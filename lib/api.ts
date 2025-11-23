import { authClient } from './auth-client';

const WS_URL = import.meta.env.PROD ? 'wss://ustime-production.up.railway.app' : 'ws://localhost:3001';
const API_URL = import.meta.env.PROD ? 'https://ustime-production.up.railway.app/api' : 'http://localhost:3001/api';

class ApiClient {
    private ws: WebSocket | null = null;
    private userId: string | null = null;
    private listeners: ((data: any) => void)[] = [];

    constructor() {
        // Initialize WS connection when user is authenticated
    }

    connect(userId: string) {
        if (this.ws?.readyState === WebSocket.OPEN) return;

        this.userId = userId;
        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
            console.log('WS Connected');
            this.ws?.send(JSON.stringify({ type: 'auth', userId }));
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.listeners.forEach(listener => listener(data));
        };

        this.ws.onclose = () => {
            console.log('WS Disconnected');
            // Simple reconnect logic
            setTimeout(() => this.connect(userId), 3000);
        };
    }

    subscribe(callback: (data: any) => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    sendPitch(receiverId: string, activity: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'pitch',
                receiverId,
                activity
            }));
        }
    }

    async connectPartner(partnerCode: string, userId: string) {
        const res = await fetch(`${API_URL}/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partnerCode, userId }),
        });
        return res.json();
    }
}

export const api = new ApiClient();
