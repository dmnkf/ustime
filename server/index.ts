import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { auth } from './auth';
import { WebSocketServer, WebSocket } from 'ws';
import { db } from './db';
import { user, pitch } from './db/schema';
import { eq } from 'drizzle-orm';

const app = new Hono();

app.use('*', logger());

const allowedOrigins = [
    'http://localhost:3000',
    process.env.VITE_APP_URL || '',
    'https://ustime-production.up.railway.app'
];

console.log('Allowed Origins:', allowedOrigins);
console.log('VITE_APP_URL:', process.env.VITE_APP_URL);

app.use('*', cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Mount Better Auth
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
    return auth.handler(c.req.raw);
});

// API Routes
app.post('/api/connect', async (c) => {
    try {
        const body = await c.req.json();
        const { partnerCode, userId } = body;

        if (!partnerCode || !userId) {
            return c.json({ error: 'Missing partnerCode or userId' }, 400);
        }

        // Find the partner by their code
        const partner = await db.query.user.findFirst({
            where: eq(user.partnerCode, partnerCode),
        });

        if (!partner) {
            return c.json({ error: 'Invalid partner code' }, 404);
        }

        if (partner.id === userId) {
            return c.json({ error: 'Cannot connect to yourself' }, 400);
        }

        // Update both users to link them
        await db.update(user)
            .set({ partnerId: partner.id })
            .where(eq(user.id, userId));

        await db.update(user)
            .set({ partnerId: userId })
            .where(eq(user.id, partner.id));

        return c.json({
            success: true,
            partnerId: partner.id,
            partnerName: partner.name
        });
    } catch (error) {
        console.error('Connect error:', error);
        return c.json({ error: 'Failed to connect' }, 500);
    }
});

import { serveStatic } from '@hono/node-server/serve-static';

// Serve static files from dist (Frontend) - MUST be after API routes but before catch-all
app.use('/*', serveStatic({ root: './dist' }));
app.get('*', serveStatic({ path: './dist/index.html' }));

const port = parseInt(process.env.PORT || '3001');
console.log(`Server is running on port ${port}`);

const server = serve({
    fetch: app.fetch,
    port
});

// WebSocket Server
const wss = new WebSocketServer({ server: server as any });

const clients = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
    let userId: string | null = null;

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === 'auth') {
                userId = data.userId;
                if (userId) clients.set(userId, ws);
            } else if (data.type === 'pitch') {
                const { receiverId, activity } = data;
                const receiverWs = clients.get(receiverId);

                // Save pitch to DB
                if (userId && receiverId) {
                    await db.insert(pitch).values({
                        senderId: userId,
                        receiverId: receiverId,
                        activityTitle: activity.title,
                        activityCategory: activity.category,
                    });
                }

                if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
                    receiverWs.send(JSON.stringify({
                        type: 'pitch',
                        activity,
                        senderId: userId
                    }));
                }
            }
        } catch (e) {
            console.error('WS Error:', e);
        }
    });

    ws.on('close', () => {
        if (userId) clients.delete(userId);
    });
});
