import type { DefineSendAndForward } from './messages';

export interface SessionMessageCategory {
	chat: DefineSendAndForward<{
		message: string;
	}>;
}
