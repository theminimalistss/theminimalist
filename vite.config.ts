import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { normalizeSiteUrl, socialMeta } from './scripts/socialMeta.ts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), socialMeta(normalizeSiteUrl(env.VITE_SITE_URL))],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
      assetsInlineLimit: 0,
      target: ['es2020', 'chrome90', 'edge90', 'firefox90', 'safari15'],
      cssTarget: ['chrome90', 'edge90', 'firefox90', 'safari15'],
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/services/**', 'src/utils/**', 'src/hooks/**'],
        reporter: ['text', 'html'],
      },
    },
  };
});
