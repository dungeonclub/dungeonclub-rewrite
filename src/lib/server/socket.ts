import { Account, CustomTokenDefinition, Token } from '$lib/db/schemas';
import {
	MessageHandler,
	publicResponse,
	type CategoryHandlers,
	type ServerHandledMessages,
	type TokensMessageCategory
} from '$lib/net';
import type { AccountMessageCategory } from '$lib/net/messages/account';
import { Connection } from './connection';

export interface HandlerOptions {
	dispatcher: Connection;
}

export class ServerMessageHandler extends MessageHandler<ServerHandledMessages, HandlerOptions> {
	account: CategoryHandlers<AccountMessageCategory, ServerHandledMessages, HandlerOptions> = {
		handleLogin: async (payload) => {
			const { email, password } = payload;

			const account = await Account.findOne({ email, password });

			return {
				campaigns: account!.campaigns
			};
		}
	};

	tokens: CategoryHandlers<TokensMessageCategory, ServerHandledMessages, HandlerOptions> = {
		handleTokenCreate: async (payload, { dispatcher }) => {
			const token = await Token.create({
				definition: await CustomTokenDefinition.findById(payload.tokenDefinition),
				position: payload.position
			});

			await dispatcher.session?.campaign?.updateOne({
				$push: {
					'scenes.0.tokens': token
				}
			});

			return publicResponse({
				token
			});
		},

		handleTokenMove: async (payload) => {
			console.log('move token', payload);

			return {
				forwardedResponse: payload
			};
		}
	};
}

export const serverMessageHandler = new ServerMessageHandler();
