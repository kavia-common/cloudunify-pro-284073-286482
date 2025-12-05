import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// PUBLIC_INTERFACE
export default defineConfig({
    plugins: [
        react(),
        // Lightweight health check so preview infra can probe the dev server
        {
            name: 'healthcheck-plugin',
            configureServer: function (server) {
                var handler = function (_req, res) {
                    res.statusCode = 200;
                    res.end('ok');
                };
                server.middlewares.use('/healthz', handler);
                server.middlewares.use('/health', handler);
            }
        }
    ],
    server: {
        host: '0.0.0.0',
        port: 3000,
        open: false,
        strictPort: true,
        // Dev proxy to backend to simplify local development and avoid CORS
        proxy: {
            '/auth': {
                target: process.env.VITE_DEV_API_PROXY || 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
            '/users': {
                target: process.env.VITE_DEV_API_PROXY || 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
            '/organizations': {
                target: process.env.VITE_DEV_API_PROXY || 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
            '/resources': {
                target: process.env.VITE_DEV_API_PROXY || 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    preview: {
        host: '0.0.0.0',
        port: 3000
    }
});
