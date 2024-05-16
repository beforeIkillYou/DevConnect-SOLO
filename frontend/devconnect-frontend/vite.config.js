import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      '/api':  'https://devconnect-solo.onrender.com'
    },
    host:'0.0.0.0',
    port: 3000,
  }
})