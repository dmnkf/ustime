import { db } from './index';
import { user, session, account, pitch, verification } from './schema';

async function clearDb() {
    console.log('🗑️ Clearing database...');
    try {
        await db.delete(session);
        await db.delete(account);
        await db.delete(pitch);
        await db.delete(verification);
        await db.delete(user);
        console.log('✅ Database cleared successfully');
    } catch (error) {
        console.error('❌ Failed to clear database:', error);
    }
    process.exit(0);
}

clearDb();
