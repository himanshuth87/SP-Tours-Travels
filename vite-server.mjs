import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  try {
    const server = await createServer({
      configFile: false, // Bypass the faulty config loader
      root: process.cwd(),
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': __dirname,
        },
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
      }
    });
    await server.listen();
    server.printUrls();
    console.log('Server started dynamically to bypass & path issue.');
  } catch (e) {
    console.error(e);
  }
})();
