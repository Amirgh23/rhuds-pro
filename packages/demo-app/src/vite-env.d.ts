/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_LOG_ENDPOINT?: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
