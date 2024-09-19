import type { MailService } from '../mail-service';
import { GmailMailService } from './service-gmail';
import { DummyMailService } from './service-local';
import { SMTPMailService } from './service-smtp';

export function parseMailServiceType(mailServiceType: string | undefined): MailService {
	if (!mailServiceType) {
		return new DummyMailService();
	}

	switch (mailServiceType) {
		case 'gmail':
			return new GmailMailService();
		case 'smtp':
			return new SMTPMailService();
		default:
			console.error(
				`Unsupported mail service "${mailServiceType}", falling back to dummy email service.`
			);
			return new DummyMailService();
	}
}
