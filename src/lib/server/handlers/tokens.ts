import { CustomTokenDefinition, Token } from '$lib/db/schemas';
import { publicResponse, type TokensMessageCategory } from '$lib/net';
import type { CategoryHandler } from '../socket';

export const tokensHandler: CategoryHandler<TokensMessageCategory> = {
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
