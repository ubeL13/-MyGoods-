import dns from 'node:dns'
import path from 'node:path'

import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// На Windows localhost может резолвиться сначала в ::1, и dev-сервер слушает только IPv6,
// а браузер подключается по 127.0.0.1. Просим Node сначала отдавать IPv4.
// https://vite.dev/config/server-options#server-host
dns.setDefaultResultOrder('ipv4first')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('antd') || id.includes('@ant-design')) {
            return 'antd'
          }

          if (id.includes('react-router')) {
            return 'router'
          }

          if (id.includes('axios')) {
            return 'axios'
          }

          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'react'
          }

          return 'vendor'
        },
      },
    },
  },
})
