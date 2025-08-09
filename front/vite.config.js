import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  content: [],
  plugins: [
    react(),
    tailwindcss({
      config: './tailwind.config.js',
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
    allowedHosts: ['siscapacitaciones.net', 'www.siscapacitaciones.net'],
  },
});
