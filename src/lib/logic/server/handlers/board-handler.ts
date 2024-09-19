import { publicResponse, type BoardMessageCategory } from 'shared';
import { SelectBoard, SelectToken } from '../../net/snippets';
import { prisma } from '../server';
import type { CategoryHandler } from '../socket';

export const boardHandler: CategoryHandler<BoardMessageCategory> = {
	handleBoardEdit: async ({ id: boardId }, { dispatcher }) => {
		const campaignId = dispatcher.sessionAsOwner.campaignId;

		return await prisma.board.findFirstOrThrow({
			where: {
				campaignId: campaignId,
				id: boardId
			},
			select: SelectBoard
		});
	},

	handleBoardPlay: async ({ id: boardId }, { dispatcher }) => {
		const session = dispatcher.sessionAsOwner;
		const campaignId = session.campaignId;

		const boardSnippet = await prisma.board.findFirstOrThrow({
			where: {
				campaignId: campaignId,
				id: boardId
			},
			select: SelectBoard
		});

		await prisma.campaign.update({
			where: { id: campaignId },
			data: {
				selectedBoardId: boardId
			}
		});

		return publicResponse(boardSnippet);
	},

	handleTokenCreate: async (payload, { dispatcher }) => {
		const sessionCampaignId = dispatcher.sessionAsOwner.campaignId;

		const { campaignId } = await prisma.board.findUniqueOrThrow({
			where: {
				id: payload.boardId
			},
			select: { campaignId: true }
		});

		if (sessionCampaignId !== campaignId) {
			throw 'Board is not part of the hosted campaign';
		}

		const token = await prisma.token.create({
			data: {
				boardId: payload.boardId,
				templateId: payload.tokenTemplate,
				...payload.position
			},
			select: SelectToken
		});

		return {
			response: token,
			forwardedResponse: {
				...token,
				boardId: payload.boardId
			}
		};
	},

	handleTokenMove: async (payload, { dispatcher }) => {
		const boardId = dispatcher.sessionAsOwner && dispatcher.sessionConnection.visibleBoardId;

		await prisma.token.update({
			where: { boardId, id: payload.id },
			data: {
				x: payload.position.x,
				y: payload.position.y
			},
			select: null
		});

		return {
			forwardedResponse: payload
		};
	},

	handleChatMessage: async (payload, { dispatcher }) => {
		const name = dispatcher.session.isOwner(dispatcher) ? 'GM' : 'Guest'; //TODO Replace guest with the actual name of the user
		return {
			type: 'chatMessage',
			content: {
				message: `${name}: ${payload.message}`
			}
		};
	}
};
