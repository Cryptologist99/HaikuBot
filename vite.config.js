import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@walletconnect/ethereum-provider': path.resolve(__dirname, 'node_modules/@walletconnect/ethereum-provider')
    }
  },
  optimizeDeps: {
    include: ['@walletconnect/ethereum-provider']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
})
