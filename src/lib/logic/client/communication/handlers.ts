import { Board, Campaign, Session } from 'client/state';
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

		onTokenCreate: (payload) => Board.instance.handleTokenCreate(payload),
		onTokensDelete: (payload) => Board.instance.handleTokensDelete(payload),
		onTokensMove: (payload) => Board.instance.handleTokensMove(payload),
		onTokensEdit: (payload) => Board.instance.handleTokensEdit(payload)
	};

	campaign: CategoryHandlers<CampaignMessageCategory, ClientHandledMessages, Options> = {
		onAssetCreate: (payload) => Campaign.instance.handleAssetCreate(payload),
		onTokenTemplateCreate: (payload) => Campaign.instance.handleTokenTemplateCreate(payload)
	};

	session: CategoryHandlers<SessionMessageCategory, ClientHandledMessages, Options> = {
		onChat: (payload) => Session.instance.onChatMessage(payload.message)
	};
}
