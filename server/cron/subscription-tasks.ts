/**
 * Cron Job: Daily Subscription Tasks
 * Runs every day at 9:00 AM to handle subscription renewals and reminders
 * 
 * To set up in Railway:
 * 1. Add a new cron job service
 * 2. Set schedule: "0 9 * * *" (every day at 9 AM)
 * 3. Set command: "node dist/server/cron/subscription-tasks.js"
 */

import * as subscriptionService from '../subscription-renewal-service';

async function main() {
  console.log('========================================');
  console.log('Starting Daily Subscription Tasks');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('========================================');

  try {
    const results = await subscriptionService.runDailySubscriptionTasks();
    
    console.log('\n========================================');
    console.log('Daily Subscription Tasks Completed');
    console.log('========================================');
    console.log(`Renewed: ${results.renewed} subscriptions`);
    console.log(`Reminders sent: ${results.reminders}`);
    console.log(`Expired: ${results.expired} subscriptions`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n========================================');
    console.error('Daily Subscription Tasks Failed');
    console.error('========================================');
    console.error(error);
    console.error('========================================\n');

    process.exit(1);
  }
}

main();
