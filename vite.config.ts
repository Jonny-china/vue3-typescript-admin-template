import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import viteSvgIcons from 'vite-plugin-svg-icons'

const mockServerPort = 9528

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteSvgIcons({ iconDirs: [path.resolve(__dirname, './src/icons/svg/')] })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/_variables.scss";@import "@/styles/_mixins.scss";`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js', //解决警告You are running the esm-bundler build of vue-i18n. It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle.
      path: 'path-browserify'
    }
  },
  server: {
    port: 9527,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${mockServerPort}`,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        rewrite: () => '/mock-api/v1'
      }
    }
  }
})
