import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const mailpit = process.env.MAILPIT_URL || 'http://localhost:8025'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: mailpit, ws: true },
      '/view': mailpit,
    },
  },
})
