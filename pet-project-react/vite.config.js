import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost/project/petprojectt',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/api/screening': {
        target: 'http://localhost/project/petprojectt',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/screening/, '/api/screening')
      },
      '/uploads': {
        target: 'http://localhost/project/petprojectt',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uploads/, '/uploads')
      },
      '/petprojectt/uploads': {
        target: 'http://localhost/project/petprojectt',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/petprojectt\/uploads/, '/petprojectt/uploads')
      },
      '/adoption_requests': {
        target: 'http://localhost/project/petprojectt',
        changeOrigin: true,
        secure: false
      },
      '/payments': {
        target: 'http://localhost/project/petprojectt',
        changeOrigin: true,
        secure: false
      }
    }
  }
}

)