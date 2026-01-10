import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { verifyToken } from "../auth-service";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * Extract JWT token from Authorization header or cookie
 */
function extractToken(req: CreateExpressContextOptions["req"]): string | null {
  // Try Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Try cookie as fallback
  const cookieToken = req.cookies?.auth_token;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Create tRPC context with JWT authentication
 */
export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const token = extractToken(opts.req);
    
    if (token) {
      const payload = verifyToken(token);
      
      if (payload) {
        // Fetch full user from database
        const db = await getDb();
        if (db) {
          const [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1);
          
          if (dbUser) {
            user = dbUser;
          }
        }
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures
    console.error("[Auth] Token verification failed:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
