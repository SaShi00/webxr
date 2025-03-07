import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => ({
  root: resolve(__dirname, 'src/pages'),
  publicDir: resolve(__dirname, 'src/assets'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        virtualWorld: resolve(__dirname, 'src/pages/virtualWorld/main.html')
      }
    }
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    }
  },
  preview: {
    port: 5173,
  },
  define: {
    'import.meta.env.MODE': JSON.stringify(mode),
  },
}));
