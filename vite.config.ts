import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'PAGES_');
  const pagesBasePath = env.PAGES_BASE_PATH || '/';

  return {
    base: pagesBasePath.endsWith('/') ? pagesBasePath : `${pagesBasePath}/`,
    plugins: [react()],
  };
});
