import { I18nLoader } from 'nestjs-i18n';

export class NoOpLoader implements I18nLoader {
	async languages(): Promise<string[]> {
		return ['en', 'ar']; // or just ['en'] if you want
	}

	async load(): Promise<Record<string, any>> {
		return {}; // return empty object
	}
}
