import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Project site: https://damino312.github.io/flowwow-2/
  base: '/flowwow-2/',
  plugins: [react()],
})
