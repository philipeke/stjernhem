/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Valfri endpoint för kontaktformuläret (Formspree, Web3Forms m.fl.). */
  readonly VITE_FORM_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Sökvägen till porträttet av Anneli, eller null när filen inte finns ännu.
 * Sätts vid byggtid av `findPortrait()` i vite.config.ts.
 */
declare const __PORTRAIT_SRC__: string | null
