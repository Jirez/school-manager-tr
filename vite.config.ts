import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import * as path from 'path'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      cookieName: 'SCHOOL_PARAGLIDE_COOKIE',
      outputStructure: 'message-modules',
      strategy: ['cookie', 'preferredLanguage', 'baseLocale'],
    }),
    devtools(),
    tailwindcss(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
  ],
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      treeshake: true, // Stricter tree-shaking for lighter chunks
      output: {
        hoistTransitiveImports: false,
        minifyInternalExports: true,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group 1: React Core & Router
            if (
              id.includes('react-router') ||
              id.includes('react-dom') ||
              id.includes('react/') ||
              id.includes('scheduler')
            ) {
              return 'vendor-react'
            }
            // Group 2: Data & State Management (Heavier Logic)
            if (
              id.includes('@apollo') ||
              id.includes('graphql') ||
              id.includes('zen-observable')
            ) {
              return 'vendor-apollo'
            }
            if (
              id.includes('redux') ||
              id.includes('@reduxjs/toolkit') ||
              id.includes('immer')
            ) {
              return 'vendor-redux'
            }
            // Group 3: UI Framework (Bootstrap & Styling)
            if (
              id.includes('bootstrap') ||
              id.includes('reactstrap') ||
              id.includes('classnames')
            ) {
              return 'vendor-ui-kit'
            }
            // Group 4: Complex UI Components (Table, Select, Pickers)
            if (
              id.includes('@tanstack/react-table') ||
              id.includes('react-paginate')
            ) {
              return 'vendor-tables'
            }
            if (
              id.includes('react-select') ||
              id.includes('react-flatpickr') ||
              id.includes('cleave.js')
            ) {
              return 'vendor-forms-ui'
            }
            // Group 5: Icons (Usually massive, isolated to its own chunk)
            if (
              id.includes('react-icons') ||
              id.includes('react-feather') ||
              id.includes('lucide-react')
            ) {
              return 'vendor-icons'
            }
            // Group 6: Animations & Transitions
            if (
              id.includes('motion') ||
              id.includes('framer-motion') ||
              id.includes('animate.css')
            ) {
              return 'vendor-animations'
            }
            // Group 7: Large Utilities
            if (id.includes('lodash')) return 'vendor-lodash'
            if (id.includes('dayjs') || id.includes('rxjs'))
              return 'vendor-utils-heavy'
            if (id.includes('ahooks') || id.includes('axios'))
              return 'vendor-libs-core'
            // Allow smaller libraries to stay in the original vendor or be bundled with components
          }
        },
        // Kept your custom naming pattern but refined for better organization
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    target: 'esnext',
    outDir: 'school-manager',
    minify: 'esbuild', // Options: 'esbuild' | 'terser' | false
    cssMinify: 'lightningcss',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  css: {
    devSourcemap: false,
    /* transformer: "lightningcss", // Use lightningcss for faster CSS transformation
      lightningcss: {
        targets: {
          chrome: 111, // Adjust based on your target browser
        },
      }, */
    preprocessorOptions: {
      scss: {
        // api: "modern",
        loadPaths: [
          path.resolve(import.meta.dirname),
          path.resolve(import.meta.dirname, 'node_modules'),
          path.resolve(import.meta.dirname, 'src'),
        ],
      },
    },
  },

  // envDir: 'public/',
  envPrefix: 'EPS_',
  server: {
    port: 3001,
    host: '0.0.0.0',
  },
  /* resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
        "@assets": path.resolve(__dirname, "src/@core/assets"),
        "@myAssets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/@core/components"),
        "@layouts": path.resolve(__dirname, "src/@core/layouts"),
        "@store": path.resolve(__dirname, "src/redux"),
        "@styles": path.resolve(__dirname, "src/@core/scss"),
        "@configs": path.resolve(__dirname, "src/configs"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@context": path.resolve(__dirname, "src/context"),
        "@myLayouts": path.resolve(__dirname, "src/layouts"),
        "@navigation": path.resolve(__dirname, "src/navigation"),
        "@views": path.resolve(__dirname, "src/views"),
        "@auth": path.resolve(__dirname, "src/@core/auth"),
        "@queries": path.resolve(__dirname, "src/queries"),
        "@gql": path.resolve(__dirname, "src/gql"),
      },
    }, */
})

export default config
