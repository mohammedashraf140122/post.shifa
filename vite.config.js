import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite"

export default defineConfig({
  base: '/post.shifa/',
  plugins: [react(), tailwindcss(), flowbiteReact()],
  build: {
    sourcemap: false,   // يمنع استخدام eval-source-map
    minify: 'esbuild',  // يقلل حجم الكود من غير eval
  }
})
