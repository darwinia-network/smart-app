import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (error: string | null, data: any) => void;

type LoadResult = [string | null, Record<string, string> | boolean];

const languageCache: Record<string, Record<string, string>> = {};
const loaders: Record<string, Promise<LoadResult>> = {};

class Backend {
  type = 'backend';

  static type: 'backend' = 'backend';

  async read(lng: string, _namespace: string, responder: Callback): Promise<void> {
    if (languageCache[lng]) {
      return responder(null, languageCache[lng]);
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!loaders[lng]) {
      loaders[lng] = this.createLoader(lng);
    }

    const [error, data] = await loaders[lng];

    return responder(error, data);
  }

  async createLoader(lng: string): Promise<LoadResult> {
    try {
      const response = await fetch(`/locales/${lng}/translation.json`, {});

      if (!response.ok) {
        // eslint-disable-next-line no-magic-numbers
        return [`i18n: failed loading ${lng}`, response.status >= 500 && response.status < 600];
      } else {
        languageCache[lng] = (await response.json()) as Record<string, string>;

        return [null, languageCache[lng]];
      }
    } catch (error) {
      return [(error as Error).message, false];
    }
  }
}

i18n
  .use(detector)
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en',
    debug: false,
    saveMissing: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {},
  });

export default i18n;
