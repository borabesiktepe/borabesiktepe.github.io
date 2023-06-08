import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        mimeTypes: {
          'text/x-typescript': ['ts', 'tsx'],
          'text/javascript': ['js', 'jsx'],
          'text/jsx': ['js', 'jsx'],
        }
      }
    }
  }
})
