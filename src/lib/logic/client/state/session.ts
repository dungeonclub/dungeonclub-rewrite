import type { CampaignSnippet, GetPayload } from 'shared';
import { derived, readonly, writable } from 'svelte/store';
import { getSocket } from '../communication';
import { Board } from './board';
import { WithState } from './with-state';

export class Campaign extends WithState<CampaignSnippet> {
	async join(options: GetPayload<'campaignJoin'>) {
		this.onEnter(await getSocket().request('campaignJoin', options));
	}

	onEnter(snippet: CampaignSnippet) {
		this.set(snippet);

		if (snippet.selectedBoard) {
			Board.instance.load(snippet.selectedBoard);
		}
	}
}

export class Session {
	static readonly instance = new Session();
	static readonly state = this.instance.state;

	readonly campaign = new Campaign();
	readonly state = derived([this.campaign.state], ([campaign]) => ({
		campaign
	}));

	private readonly _chatMessages = writable<string[]>([]);
	readonly chatMessages = readonly(this._chatMessages);

	onChatMessage(message: string) {
		this._chatMessages.update((messages) => [...messages, message]);
	}
}

export const sessionState = Session.state;
