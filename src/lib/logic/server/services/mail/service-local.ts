import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { MailService, type SendMailOptions } from '../mail-service';

const EMAIL_OUTPUT_DIRECTORY = 'logs';

export class DummyMailService extends MailService {
	async sendMail(options: SendMailOptions): Promise<void> {
		const timestamp = Date.now();
		const filePath = path.join(EMAIL_OUTPUT_DIRECTORY, `email-${timestamp}.html`);

		await mkdir(EMAIL_OUTPUT_DIRECTORY, { recursive: true });
		await writeFile(filePath, options.htmlBody);

		console.warn(
			[
				`Email with subject "${options.subject}" will NOT be sent, because no mailing service is configured.`,
				`Instead, you can find the email body at "${filePath}".`
			].join('\n')
		);
	}
}
