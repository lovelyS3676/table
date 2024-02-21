import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    include: ['**/tests/*.spec.*'],
    exclude: ['**/coverage/**'],
    globals: true,
    setupFiles: './tests/setup.ts',
    environment: 'jsdom',
    coverage: {
      exclude: ['**/docs/**', '**/__mocks__/**'],
    },
  },
});
