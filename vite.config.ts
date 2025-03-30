import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-redirects',
      closeBundle() {
        // Copiar o arquivo _redirects para a pasta dist após o build
        if (fs.existsSync('_redirects')) {
          fs.copyFileSync('_redirects', resolve('dist', '_redirects'))
          console.log('✅ _redirects file copied to dist folder')
        }
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: false
  },
  build: {
    // Configurações de build otimizadas para produção
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  }
})
