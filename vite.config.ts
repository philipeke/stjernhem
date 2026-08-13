import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
