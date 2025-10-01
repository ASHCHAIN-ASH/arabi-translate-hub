import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // تحسين حجم الـ bundle
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
      },
    },
    // تفعيل minification باستخدام esbuild (أسرع من terser)
    minify: 'esbuild',
  },
  // إلغاء الكاش بشكل كامل في التطوير
  cacheDir: mode === 'development' ? 'node_modules/.vite-temp' : 'node_modules/.vite',
  optimizeDeps: {
    force: true, // إعادة بناء dependencies
  },
}));
