import { MailService, type SendMailOptions } from '../mail-service';
import {writeFile, writeFileSync} from "fs";

export class DummyMailService extends MailService {
	constructor() {
		super();
		console.log('DummyMailService initialized for local development');
	}

	async sendMail(options: SendMailOptions): Promise<void> {
		console.log('--- Dummy Email Service ---');
		console.log('To:', options.recipient);
		console.log('Subject:', options.subject);
		const filename = `logs/email-${new Date().toISOString().replace(/:/g, '-')}.html`;
		await writeFileSync(filename, options.htmlBody);
		console.log('--- End of Dummy Email ---');

		console.log('Dummy email sent successfully: ' + filename);
	}
}