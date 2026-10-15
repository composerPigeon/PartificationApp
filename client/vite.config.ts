import {defineConfig} from 'vite'
import react, {reactCompilerPreset} from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        babel({
            plugins: [
                [
                    '@babel/plugin-proposal-decorators',
                    {version: '2023-11'}
                ],
            ],
            presets: [reactCompilerPreset()]
        }),
    ],
    server: {
        watch: {
            usePolling: process.env.VITE_USE_POLLING === 'true',
        },
        proxy: {
            '/auth': {
                target: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:5000',
                changeOrigin: true,
            },
            '/settings': {
                target: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:5000',
                changeOrigin: true,
            },
        },
    },
})
