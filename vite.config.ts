import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    // Use SWC for faster refresh and build
    react(),
    // Image optimization
    imagetools({
      defaultDirectives: (url) => {
        const isIcon = url.pathname.includes('node_modules');
        return new URLSearchParams({
          quality: '80',
          ...(isIcon ? { w: '24', format: 'png' } : { w: '1200', format: 'webp' }),
        });
      },
    }),
    // Gzip/Brotli compression for production
    mode === 'production' && compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024, // Only compress files > 1KB
    }),
    mode === 'production' && compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files > 1KB
    }),
    // Bundle analyzer (only in analyze mode)
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/bundle-analysis.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  
  root: path.resolve(process.cwd(), "client"),
  
  optimizeDeps: {
    include: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
    ],
  },
  
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'terser' : false,
    cssMinify: mode === 'production',
    chunkSizeWarningLimit: 1000, // in KB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'wouter'
          ],
          ui: [
            '@radix-ui/*',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ],
          state: [
            '@tanstack/react-query',
            'zod',
            'react-hook-form',
            '@hookform/resolvers',
            'zod-validation-error'
          ],
          animations: [
            'framer-motion',
            'tailwindcss-animate'
          ],
        },
      },
    },
    target: 'es2020', // Target modern browsers
    reportCompressedSize: false, // Disable gzip size reporting for better performance
  },
  
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  
  esbuild: {
    // Drop console logs in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
