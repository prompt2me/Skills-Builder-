import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({command}) => {
  // Determine base path:
  // In development, serve at root '/'
  // In build for GitHub Pages (prompt2me/Skills-Builder-):
  // uses GITHUB_REPOSITORY if present, or BASE_PATH, or relative './'
  const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '';
  const basePath = command === 'serve' ? '/' : (process.env.BASE_PATH || repoName || './');

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'spa-fallback-404-for-github-pages',
        closeBundle() {
          try {
            const distPath = path.resolve(__dirname, 'dist');
            const indexPath = path.join(distPath, 'index.html');
            const notFoundPath = path.join(distPath, '404.html');
            if (fs.existsSync(indexPath)) {
              fs.copyFileSync(indexPath, notFoundPath);
            }
          } catch (e) {
            console.warn('Could not copy 404.html for GitHub Pages:', e);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
