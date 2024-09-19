import { Board, Session } from 'client/state';
import {
	MessageHandler,
	type AccountMessageCategory,
	type BoardMessageCategory,
	type CampaignMessageCategory,
	type CategoryHandlers,
	type ClientHandledMessages
} from 'shared';
import type { SessionMessageCategory } from 'shared/messages/session';

type Options = {};

export class ClientRequestHandler extends MessageHandler<ClientHandledMessages, Options> {
	account: CategoryHandlers<AccountMessageCategory, ClientHandledMessages, Options> = {};

	board: CategoryHandlers<BoardMessageCategory, ClientHandledMessages, Options> = {
		onBoardPlay: (boardSnippet) => {
			Board.instance.load(boardSnippet);
		},

		onTokenCreate: (payload) => {
			console.log('onTokenCreate', payload);
		},

		onTokenMove: (payload) => Board.instance.handleTokenMove(payload)
	};

	campaign: CategoryHandlers<CampaignMessageCategory, ClientHandledMessages, Options> = {};

	session: CategoryHandlers<SessionMessageCategory, ClientHandledMessages, Options> = {
		onChat: (payload) => Session.instance.onChatMessage(payload.message)
	};
}
