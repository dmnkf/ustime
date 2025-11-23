import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    partnerCode: text('partner_code').unique(), // Custom field
    partnerId: text('partner_id'), // Custom field
});

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    expiresAt: timestamp('expires_at'),
    password: text('password'),
    scope: text('scope'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

export const pitch = pgTable('pitch', {
    id: uuid('id').defaultRandom().primaryKey(),
    senderId: text('sender_id').notNull().references(() => user.id),
    receiverId: text('receiver_id').notNull().references(() => user.id),
    activityTitle: text('activity_title').notNull(),
    activityCategory: text('activity_category').notNull(),
    status: text('status').default('pending').notNull(), // pending, accepted, rejected
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
