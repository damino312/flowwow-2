/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YM_COUNTER_ID?: string;
  readonly VITE_SITE_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
