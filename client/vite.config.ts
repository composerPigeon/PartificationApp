import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: [
          [
              '@babel/plugin-proposal-decorators',
              { version: '2023-11'}
          ],
      ],
      presets: [reactCompilerPreset()]
    }),
  ],
  server: {
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/settings': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
