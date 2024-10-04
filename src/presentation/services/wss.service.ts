import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

interface Options {
    server: Server,
    path?: string
}

export class WssService {

    private static _instance: WssService;
    private wss: WebSocketServer;

    private constructor(options: Options) {
        const { server, path = '/ws' } = options;

        this.wss = new WebSocketServer({ server, path });

    }

    static get instance() {
        if (!WssService._instance) {
            throw 'WssService is not initialized';
        }

        return WssService._instance;
    }

    static initWss(options: Options) {
        WssService._instance = new WssService(options);
    }

    sendMessage(type: string, payload: Object, email: string, poll_id: string) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type, payload, email, poll_id }));
            }
        });
    }

    sendAlertActiveAccount(email: string) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ email, type: 'warning' }));
            }
        });
    }



    start() {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('Client connected');

            ws.on('close', () => console.log('Client disconnected'));
        });
    }
}