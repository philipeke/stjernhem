import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error — ren JS-konfiguration som delas med scripts/make-pages.mjs
import { PAGES, htmlFor } from './pages.config.mjs'

/**
 * Varje sida är ett eget HTML-dokument. Det ger riktiga adresser
 * (/metod/ i stället för /#metod), egen titel och beskrivning per sida,
 * och en 200-svarande URL som sökmotorer kan indexera var för sig.
 */
const input = Object.fromEntries(
  (PAGES as { dir: string }[]).map((page) => [
    page.dir || 'home',
    fileURLToPath(new URL(htmlFor(page), import.meta.url)),
  ])
)

/**
 * Porträttet av Anneli finns ännu inte. I stället för att låta webbläsaren
 * begära en bild som ger 404 letar vi upp den vid byggtid — lägg bara filen
 * i public/portratt/ så plockas den upp automatiskt.
 */
function findPortrait(): string | null {
  const dir = fileURLToPath(new URL('./public/portratt/', import.meta.url))
  for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'avif']) {
    if (existsSync(`${dir}anneli.${ext}`)) return `/portratt/anneli.${ext}`
  }
  return null
}

// Siten körs på ett eget apex-domännamn (stjernhem.se) via GitHub Pages,
// därför base '/'.
export default defineConfig({
  base: '/',
  define: {
    __PORTRAIT_SRC__: JSON.stringify(findPortrait()),
  },
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    assetsInlineLimit: 2048,
    rollupOptions: {
      input,
      output: {
        // Animationsbiblioteket är stort och ändras sällan — egen chunk
        // ger bättre cachning mellan deployer.
        manualChunks(id) {
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'motion'
          }
          return undefined
        },
      },
    },
  },
})
