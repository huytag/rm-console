import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Fails the production build if any emitted chunk exceeds the size budget.
 * Catches regressions to the 1.1MB main chunk issue that motivated
 * `manualChunks` (Phase 8 fix).
 *
 * Runs only on `vite build`; the threshold is intentionally generous so
 * Element Plus + chart.js can stay in their own vendor chunks but the
 * main entry chunk stays slim.
 */
const CHUNK_SIZE_LIMIT_BYTES = 500 * 1024
const MAIN_CHUNK_SIZE_LIMIT_BYTES = 300 * 1024 // main entry should be even tighter

function chunkBudgetGuard() {
  return {
    name: 'chunk-budget-guard',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const violations = []

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (!chunk.type || chunk.type !== 'chunk') continue
        if (!chunk.isEntry && !chunk.isDynamicEntry) continue
        if (chunk.code.length > CHUNK_SIZE_LIMIT_BYTES) {
          violations.push(
            `${fileName} → ${(chunk.code.length / 1024).toFixed(1)} KB (limit ${CHUNK_SIZE_LIMIT_BYTES / 1024} KB)`,
          )
        }
        if (
          chunk.isEntry &&
          !chunk.isDynamicEntry &&
          chunk.code.length > MAIN_CHUNK_SIZE_LIMIT_BYTES
        ) {
          violations.push(
            `main entry ${fileName} → ${(chunk.code.length / 1024).toFixed(1)} KB (entry limit ${MAIN_CHUNK_SIZE_LIMIT_BYTES / 1024} KB)`,
          )
        }
      }

      if (violations.length) {
        this.error(
          `Build failed: chunk size budget exceeded\n  - ${violations.join('\n  - ')}`,
        )
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), chunkBudgetGuard()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8989',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Production-only: serve sourcemaps (hidden, uploaded to error reporter separately)
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : false,
    rollupOptions: {
      output: {
        // Code-split heavy libraries out of the main bundle so the first paint
        // doesn't have to download Element Plus / chart.js for routes that
        // don't use them.
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-element-plus': ['element-plus', '@element-plus/icons-vue'],
          'vendor-chart': ['chart.js', 'vue-chartjs'],
          'vendor-http': ['axios'],
        },
      },
    },
  },
})