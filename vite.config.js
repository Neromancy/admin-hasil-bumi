import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti 'admin-hasil-bumi' dengan nama repository yang kamu buat di GitHub tadi
export default defineConfig({
  plugins: [react()],
  base: "https://github.com/Neromancy/admin-hasil-bumi", 
})