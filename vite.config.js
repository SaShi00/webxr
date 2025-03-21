import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // base: process.env.NODE_ENV === 'production' ? '/webxr/' : '',
  base: '/webxr/',
  root: 'src/pages',
  publicDir: resolve(__dirname, 'src/assets'), 
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        '': resolve(__dirname, 'src/pages/index.html'),
        'virtualWorld': resolve(__dirname, 'src/pages/virtualWorld/main.html')
      }
    }
  }
})