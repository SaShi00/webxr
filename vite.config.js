import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
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
    },
    define: {
      'process.env': env
    }
  }
})

