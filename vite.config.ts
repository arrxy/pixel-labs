import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  build: {
    // three.js alone is ~540 kB minified; it's already split into its own chunk.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        linearAlgebra: fileURLToPath(new URL('./linear-algebra/index.html', import.meta.url)),
        viewing: fileURLToPath(new URL('./viewing/index.html', import.meta.url)),
      },
      output: {
        codeSplitting: {
          groups: [{ name: 'three', test: /node_modules[\\/]three[\\/]/, priority: 20 }],
        },
      },
    },
  },
})
