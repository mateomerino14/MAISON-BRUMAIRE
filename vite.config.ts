import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

/** GitHub Pages sirve el sitio bajo el nombre del repositorio. */
const PAGES_BASE = '/MAISON-BRUMAIRE/'

export default defineConfig(({ command, isPreview }) => {
  let base = '/'
  if (command === 'build' || isPreview === true) {
    base = PAGES_BASE
  }
  return {
    base,
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
    },
  }
})
