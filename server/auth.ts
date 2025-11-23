import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { generatePartnerCode } from './utils/generate-partner-code';
import { eq } from 'drizzle-orm';

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            ...schema,
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    trustedOrigins: ['http://localhost:3000', process.env.VITE_APP_URL || ''],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            enabled: !!process.env.GOOGLE_CLIENT_ID,
            successRedirect: process.env.VITE_APP_URL || 'http://localhost:3000',
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID || '',
            clientSecret: process.env.APPLE_CLIENT_SECRET || '',
            enabled: !!process.env.APPLE_CLIENT_ID,
            successRedirect: process.env.VITE_APP_URL || 'http://localhost:3000',
        },
    },
    user: {
        additionalFields: {
            partnerCode: {
                type: 'string',
                required: false,
            },
            partnerId: {
                type: 'string',
                required: false,
            },
        },
    },
});
