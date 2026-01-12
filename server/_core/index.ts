import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { doubleCsrf } from "csrf-csrf";
// OAuth removed - using custom authentication only
import { appRouter } from "../routers";
import { createContext } from "./jwt-context";
import { serveStatic, setupVite } from "./vite";
import cookieParser from "cookie-parser";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Trust proxy configuration for Railway
  // Use number 1 to trust only the first proxy (Railway's reverse proxy)
  // This prevents ERR_ERL_PERMISSIVE_TRUST_PROXY error while maintaining security
  app.set('trust proxy', 1);
  
  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval needed for Vite in dev
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
  }));
  
  // CORS configuration
  const allowedOrigins: (string | RegExp)[] = [
    'https://eterbox.com',
    'https://www.eterbox.com',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
    ...(process.env.NODE_ENV === 'development' ? [/^https:\/\/.*\.manus\.computer$/] : []),
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  // Rate limiting - General API
  // Disabled in development for easier testing
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: JSON.stringify({ error: 'Too many requests from this IP, please try again later.' }),
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
    handler: (req, res) => {
      res.status(429).json({ error: 'Too many requests from this IP, please try again later.' });
    },
  });
  
  // Rate limiting - Strict for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 authentication attempts per 15 minutes
    skipSuccessfulRequests: true,
    message: JSON.stringify({ error: 'Too many authentication attempts, please try again later.' }),
    skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
    handler: (req, res) => {
      res.status(429).json({ error: 'Too many authentication attempts, please try again later.' });
    },
  });
  
  // Apply general rate limiter to all API routes
  app.use('/api/', generalLimiter);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Cookie parser for JWT tokens
  app.use(cookieParser());
  
  // CSRF Protection
  const csrfProtection = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
    cookieName: 'csrf-token',
    cookieOptions: {
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getSessionIdentifier: (req) => req.ip || 'anonymous',
  });
  
  // Endpoint to get CSRF token
  app.get('/api/csrf-token', (req, res) => {
    const token = csrfProtection.generateCsrfToken(req, res, { overwrite: true });
    res.json({ csrfToken: token });
  });
  
  // Apply CSRF protection to mutations (POST/PUT/DELETE)
  // Note: tRPC handles all requests via POST, so we apply selectively
  // app.use('/api/trpc', doubleCsrfProtection); // Commented out for now to avoid breaking existing functionality
  
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }
  // OAuth removed - using custom authentication (email/password + biometric)
  // Apply strict rate limiting to authentication endpoints
  app.use("/api/trpc/auth.login", authLimiter);
  app.use("/api/trpc/auth.register", authLimiter);
  app.use("/api/trpc/twoFactor.verify", authLimiter);
  
  // Password reset routes (Express)
  const passwordResetRouter = (await import('../auth.password-reset')).default;
  app.use("/api/auth", authLimiter, passwordResetRouter);
  
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
