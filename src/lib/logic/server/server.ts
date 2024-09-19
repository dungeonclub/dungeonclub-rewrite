import type { WebSocket } from 'ws';
import { AccountManager } from './account-manager';
import { AssetManager } from './asset-manager';
import { prisma } from './prisma';
import type { MailService } from './services/mail-service';
import { GmailMailService } from './services/mail/service-gmail';
import { DummyMailService } from './services/mail/service-local';
import { SessionManager } from './session';
import { ConnectionSocket } from './socket';
import { getWebSocketServer } from './ws-server/ws-server';
import { GMAIL_API_CLIENT_ID } from '$env/static/private';

export { prisma };

export class Server {
	readonly accountManager = new AccountManager();
	readonly assetManager = new AssetManager();
	readonly sessionManager = new SessionManager();
	readonly webSocketManager = new WebSocketManager();

	readonly mailService: MailService =
		import.meta.env.PROD || GMAIL_API_CLIENT_ID ? new GmailMailService() : new DummyMailService();

	async start() {
		this.webSocketManager.start();
	}
}

class WebSocketManager {
	private connectionSockets: ConnectionSocket[] = [];

	start() {
		const wss = getWebSocketServer();
		wss.removeAllListeners();
		wss.on('connection', (socket) => this.onConnect(socket));
	}

	onConnect(webSocket: WebSocket) {
		const connectionSocket = new ConnectionSocket(webSocket);

		webSocket.on('close', (code) => {
			this.onDisconnect(connectionSocket, code);
		});

		this.connectionSockets.push(connectionSocket);
	}

	private onDisconnect(disconnectedSocket: ConnectionSocket, code: number) {
		console.log('Closing connection with code', code);
		disconnectedSocket.dispose();

		this.connectionSockets = this.connectionSockets.filter(
			(socket) => socket !== disconnectedSocket
		);
	}
}

export const server = new Server();
