import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: true, // 确保源映射开启
    rollupOptions: {
      output: {
        sourcemap: true // 确保 Rollup 输出源映射
      }
    }
  },
  server: {
    // 确保开发服务器配置正确
    open: true, // 启动时自动打开浏览器
    port: 5173 // 设置开发服务器端口
  }
})