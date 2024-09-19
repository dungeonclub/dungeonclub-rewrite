import type { SessionMessageCategory } from 'shared/messages/session';
import type { CategoryHandler } from '../socket';

export const sessionHandler: CategoryHandler<SessionMessageCategory> = {
	handleChat: async (payload) => {
		return {
			forwardedResponse: payload
		};
	}
};
