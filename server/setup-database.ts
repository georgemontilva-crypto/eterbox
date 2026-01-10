import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getDb } from './db';
import { plans } from '../drizzle/schema';

const execAsync = promisify(exec);
const router = Router();

router.get('/setup-database', async (req, res) => {
  try {
    console.log('[Setup] Starting database initialization...');
    
    // Step 1: Run drizzle-kit push to create/update tables
    console.log('[Setup] Running drizzle-kit push...');
    const { stdout, stderr } = await execAsync('pnpm drizzle-kit push', {
      cwd: '/app', // Railway working directory
      env: process.env
    });
    
    console.log('[Setup] Drizzle output:', stdout);
    if (stderr) console.log('[Setup] Drizzle stderr:', stderr);
    
    // Step 2: Insert default plans
    console.log('[Setup] Inserting default plans...');
    const db = await getDb();
    
    if (!db) {
      throw new Error('Database connection failed');
    }
    
    const defaultPlans = [
      {
        name: 'Free',
        description: 'Perfect for getting started with basic password management',
        maxKeys: 3,
        maxFolders: 1,
        maxGeneratedKeys: 10,
        price: '0.00',
        yearlyPrice: '0.00',
        yearlyDiscount: 0,
        features: JSON.stringify([
          '3 stored credentials',
          '1 folder',
          '10 generated secure keys per month',
          'Basic encryption',
          'Email support'
        ]),
        isActive: true
      },
      {
        name: 'Basic',
        description: 'Ideal for individuals who need more storage and features',
        maxKeys: 50,
        maxFolders: 10,
        maxGeneratedKeys: 100,
        price: '4.99',
        yearlyPrice: '49.99',
        yearlyDiscount: 17,
        features: JSON.stringify([
          '50 stored credentials',
          '10 folders',
          '100 generated secure keys per month',
          'Advanced encryption',
          'Priority email support',
          '2FA authentication',
          'Export/Import data'
        ]),
        isActive: true
      },
      {
        name: 'Corporate',
        description: 'For businesses and teams requiring unlimited access',
        maxKeys: 999999,
        maxFolders: 999999,
        maxGeneratedKeys: 999999,
        price: '14.99',
        yearlyPrice: '149.99',
        yearlyDiscount: 17,
        features: JSON.stringify([
          'Unlimited credentials',
          'Unlimited folders',
          'Unlimited generated keys',
          'Military-grade encryption',
          '24/7 priority support',
          'Team management',
          'Advanced 2FA',
          'API access',
          'Custom integrations'
        ]),
        isActive: true
      }
    ];
    
    // Insert plans (ignore duplicates)
    for (const plan of defaultPlans) {
      try {
        await db!.insert(plans).values(plan).onDuplicateKeyUpdate({
          set: {
            description: plan.description,
            maxKeys: plan.maxKeys,
            maxFolders: plan.maxFolders,
            maxGeneratedKeys: plan.maxGeneratedKeys,
            price: plan.price as any,
            yearlyPrice: plan.yearlyPrice as any,
            yearlyDiscount: plan.yearlyDiscount,
            features: plan.features
          }
        });
        console.log(`[Setup] Plan "${plan.name}" inserted/updated`);
      } catch (err: any) {
        console.log(`[Setup] Plan "${plan.name}" already exists or error:`, err.message);
      }
    }
    
    // Fetch and return all plans
    const allPlans = await db!.select().from(plans);
    
    res.json({
      success: true,
      message: 'Database initialized successfully! ✅',
      plans: allPlans,
      note: 'This endpoint will be removed for security. Do not visit again.'
    });
    
  } catch (error: any) {
    console.error('[Setup] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to initialize database. Check Railway logs for details.'
    });
  }
});

export default router;
