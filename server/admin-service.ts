import { getDb } from './db';
import { sql } from 'drizzle-orm';

export interface AdminPermissions {
  is_super_admin: boolean;
  can_view_users: boolean;
  can_edit_users: boolean;
  can_delete_users: boolean;
  can_send_bulk_emails: boolean;
  can_view_revenue: boolean;
  can_manage_admins: boolean;
  can_view_analytics: boolean;
}

/**
 * Check if user is admin (has any admin permissions)
 */
export async function isAdmin(userId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    const result: any = await db.execute(sql`
      SELECT id FROM admin_permissions
      WHERE user_id = ${userId}
    `);

    // MySQL2 returns result as [rows, fields], we need the rows array
    const rows = result[0];
    return Array.isArray(rows) && rows.length > 0;
  } catch (error) {
    console.error('[Admin] Error checking admin status:', error);
    return false;
  }
}

/**
 * Check if user is super admin
 */
export async function isSuperAdmin(userId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    const result: any = await db.execute(sql`
      SELECT is_super_admin FROM admin_permissions
      WHERE user_id = ${userId} AND is_super_admin = true
    `);

    // MySQL2 returns result as [rows, fields], we need the rows array
    const rows = result[0];
    return Array.isArray(rows) && rows.length > 0;
  } catch (error) {
    console.error('[Admin] Error checking super admin status:', error);
    return false;
  }
}

/**
 * Get admin permissions for user
 */
export async function getAdminPermissions(userId: number): Promise<AdminPermissions | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const result: any = await db.execute(sql`
      SELECT is_super_admin, can_view_users, can_edit_users, can_delete_users,
             can_send_bulk_emails, can_view_revenue, can_manage_admins, can_view_analytics
      FROM admin_permissions
      WHERE user_id = ${userId}
    `);

    if (!result || result.length === 0) return null;

    // MySQL2 returns result as [rows, fields], we need the first row from rows array
    const rows = result[0];
    if (!Array.isArray(rows) || rows.length === 0) return null;
    
    const row = rows[0];
    console.log('[Admin] getAdminPermissions - RAW row data:', row);
    console.log('[Admin] getAdminPermissions - can_view_users RAW:', row.can_view_users, 'type:', typeof row.can_view_users);
    // Convert tinyint(1) to boolean - MySQL may return 0/1 as numbers or strings
    // Use explicit comparison to handle both cases
    return {
      is_super_admin: row.is_super_admin === 1 || row.is_super_admin === true || row.is_super_admin === '1',
      can_view_users: row.can_view_users === 1 || row.can_view_users === true || row.can_view_users === '1',
      can_edit_users: row.can_edit_users === 1 || row.can_edit_users === true || row.can_edit_users === '1',
      can_delete_users: row.can_delete_users === 1 || row.can_delete_users === true || row.can_delete_users === '1',
      can_send_bulk_emails: row.can_send_bulk_emails === 1 || row.can_send_bulk_emails === true || row.can_send_bulk_emails === '1',
      can_view_revenue: row.can_view_revenue === 1 || row.can_view_revenue === true || row.can_view_revenue === '1',
      can_manage_admins: row.can_manage_admins === 1 || row.can_manage_admins === true || row.can_manage_admins === '1',
      can_view_analytics: row.can_view_analytics === 1 || row.can_view_analytics === true || row.can_view_analytics === '1',
    };
  } catch (error) {
    console.error('[Admin] Error getting permissions:', error);
    return null;
  }
}

/**
 * Create super admin (only if no super admin exists or called by existing super admin)
 */
export async function createSuperAdmin(userId: number, createdBy?: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // If createdBy is provided, verify they are super admin
    if (createdBy) {
      const isCreatorSuperAdmin = await isSuperAdmin(createdBy);
      if (!isCreatorSuperAdmin) {
        throw new Error('Only super admins can create other super admins');
      }
    }

    await db.execute(sql`
      INSERT INTO admin_permissions (
        user_id, is_super_admin, can_view_users, can_edit_users, can_delete_users,
        can_send_bulk_emails, can_view_revenue, can_manage_admins, can_view_analytics, created_by
      )
      VALUES (
        ${userId}, true, true, true, true, true, true, true, true, ${createdBy || null}
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        is_super_admin = true,
        can_view_users = true,
        can_edit_users = true,
        can_delete_users = true,
        can_send_bulk_emails = true,
        can_view_revenue = true,
        can_manage_admins = true,
        can_view_analytics = true,
        updatedAt = NOW()
    `);

    return true;
  } catch (error) {
    console.error('[Admin] Error creating super admin:', error);
    return false;
  }
}

/**
 * Add admin with custom permissions
 */
export async function addAdmin(
  userEmail: string,
  permissions: Partial<AdminPermissions>,
  createdBy: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Verify creator is super admin or has manage_admins permission
    const creatorPerms = await getAdminPermissions(createdBy);
    if (!creatorPerms || (!creatorPerms.is_super_admin && !creatorPerms.can_manage_admins)) {
      return { success: false, message: 'No tienes permisos para agregar administradores' };
    }

    // Get user by email
    const userResult: any = await db.execute(sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `);

    console.log('[Admin] addAdmin - userResult:', userResult);

    // db.execute() returns [rows, fields], we need the rows array
    const rows = userResult[0];
    if (!Array.isArray(rows) || rows.length === 0) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    const userId = rows[0]?.id;
    console.log('[Admin] addAdmin - userId:', userId, 'type:', typeof userId);

    if (!userId) {
      return { success: false, message: 'ID de usuario no válido' };
    }

    // Insert or update permissions
    await db.execute(sql`
      INSERT INTO admin_permissions (
        user_id, is_super_admin, can_view_users, can_edit_users, can_delete_users,
        can_send_bulk_emails, can_view_revenue, can_manage_admins, can_view_analytics, created_by
      )
      VALUES (
        ${userId},
        ${permissions.is_super_admin || false},
        ${permissions.can_view_users !== undefined ? permissions.can_view_users : true},
        ${permissions.can_edit_users || false},
        ${permissions.can_delete_users || false},
        ${permissions.can_send_bulk_emails || false},
        ${permissions.can_view_revenue || false},
        ${permissions.can_manage_admins || false},
        ${permissions.can_view_analytics !== undefined ? permissions.can_view_analytics : true},
        ${createdBy}
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        is_super_admin = EXCLUDED.is_super_admin,
        can_view_users = EXCLUDED.can_view_users,
        can_edit_users = EXCLUDED.can_edit_users,
        can_delete_users = EXCLUDED.can_delete_users,
        can_send_bulk_emails = EXCLUDED.can_send_bulk_emails,
        can_view_revenue = EXCLUDED.can_view_revenue,
        can_manage_admins = EXCLUDED.can_manage_admins,
        can_view_analytics = EXCLUDED.can_view_analytics,
        updatedAt = NOW()
    `);

    return { success: true };
  } catch (error) {
    console.error('[Admin] Error adding admin:', error);
    return { success: false, message: 'Error al agregar administrador' };
  }
}

/**
 * Remove admin permissions
 */
export async function removeAdmin(userId: number, removedBy: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Verify remover has permission
    const removerPerms = await getAdminPermissions(removedBy);
    if (!removerPerms || (!removerPerms.is_super_admin && !removerPerms.can_manage_admins)) {
      throw new Error('No tienes permisos para remover administradores');
    }

    // Cannot remove super admin unless you are super admin
    const targetPerms = await getAdminPermissions(userId);
    if (targetPerms?.is_super_admin && !removerPerms.is_super_admin) {
      throw new Error('Solo super admins pueden remover otros super admins');
    }

    await db.execute(sql`
      DELETE FROM admin_permissions
      WHERE user_id = ${userId}
    `);

    return true;
  } catch (error) {
    console.error('[Admin] Error removing admin:', error);
    return false;
  }
}

/**
 * Get all admins
 */
export async function getAllAdmins() {
  try {
    const db = await getDb();
    if (!db) return [];

    const result: any = await db.execute(sql`
      SELECT u.id, u.name, u.email, u.createdAt,
             ap.is_super_admin, ap.can_view_users, ap.can_edit_users, ap.can_delete_users,
             ap.can_send_bulk_emails, ap.can_view_revenue, ap.can_manage_admins, ap.can_view_analytics,
             ap.created_at as admin_since
      FROM users u
      INNER JOIN admin_permissions ap ON u.id = ap.user_id
      ORDER BY ap.is_super_admin DESC, u.createdAt ASC
    `);

    // MySQL2 returns result as [rows, fields], we need the rows array
    const rows = result[0];
    if (!Array.isArray(rows)) return [];
    
    return rows;
  } catch (error) {
    console.error('[Admin] Error getting admins:', error);
    return [];
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  try {
    const db = await getDb();
    if (!db) return null;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    // Total users
    const totalUsersResult: any = await db.execute(sql`
      SELECT COUNT(*) as count FROM users
    `);
    const totalUsers = totalUsersResult[0]?.[0]?.count || 0;

    // New users in period
    const newUsersResult: any = await db.execute(sql`
      SELECT COUNT(*) as count FROM users
      WHERE createdAt >= ${startDate.toISOString()}
    `);
    const newUsers = newUsersResult[0]?.[0]?.count || 0;

    // Total revenue (sum of all payments)
    const revenueResult: any = await db.execute(sql`
      SELECT COALESCE(SUM(amount), 0) as total FROM payment_history
      WHERE status = 'completed'
    `);
    const totalRevenue = parseFloat(revenueResult[0]?.[0]?.total || '0');

    // Revenue in period
    const periodRevenueResult: any = await db.execute(sql`
      SELECT COALESCE(SUM(amount), 0) as total FROM payment_history
      WHERE status = 'completed' AND created_at >= ${startDate.toISOString()}
    `);
    const periodRevenue = parseFloat(periodRevenueResult[0]?.[0]?.total || '0');

    // Active subscriptions
    const activeSubsResult: any = await db.execute(sql`
      SELECT COUNT(*) as count FROM users
      WHERE planId IS NOT NULL AND planId != 1
    `);
    const activeSubscriptions = activeSubsResult[0]?.[0]?.count || 0;

    // Users by plan
    const usersByPlanResult: any = await db.execute(sql`
      SELECT p.name, COUNT(u.id) as count
      FROM plans p
      LEFT JOIN users u ON p.id = u.planId
      GROUP BY p.id, p.name
      ORDER BY p.id
    `);

    // Daily registrations (last 30 days)
    const dailyRegsResult: any = await db.execute(sql`
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM users
      WHERE createdAt >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `);

    // Daily revenue (last 30 days)
    const dailyRevenueResult: any = await db.execute(sql`
      SELECT DATE(created_at) as date, COALESCE(SUM(amount), 0) as total
      FROM payment_history
      WHERE status = 'completed' AND created_at >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    return {
      totalUsers,
      newUsers,
      totalRevenue,
      periodRevenue,
      activeSubscriptions,
      usersByPlan: usersByPlanResult[0] || [],
      dailyRegistrations: dailyRegsResult[0] || [],
      dailyRevenue: dailyRevenueResult[0] || [],
      period
    };
  } catch (error) {
    console.error('[Admin] Error getting analytics:', error);
    return null;
  }
}

/**
 * Get users with expiring subscriptions (for payment reminders)
 */
export async function getUsersWithExpiringSubscriptions(daysBeforeExpiry: number = 5) {
  try {
    const db = await getDb();
    if (!db) return [];

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBeforeExpiry);

    const result: any = await db.execute(sql`
      SELECT u.id, u.name, u.email, u.subscription_end_date as subscriptionEndDate, p.name as plan_name, p.price
      FROM users u
      INNER JOIN plans p ON u.plan_id = p.id
      WHERE u.subscription_end_date IS NOT NULL
        AND u.subscription_end_date <= ${targetDate.toISOString()}
        AND u.subscription_end_date > NOW()
      ORDER BY u.subscription_end_date ASC
    `);

    const users = Array.isArray(result) ? result : (result?.rows || result || []);
    console.log('[Admin] getUsersWithExpiringSubscriptions - Total users found:', users.length);
    
    return users;
  } catch (error) {
    console.error('[Admin] Error getting expiring subscriptions:', error);
    return [];
  }
}
