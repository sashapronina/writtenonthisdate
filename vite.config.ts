import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub project page: https://<user>.github.io/writtenonthisdate/
  base: '/writtenonthisdate/',
})
