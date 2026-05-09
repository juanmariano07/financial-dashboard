import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const srcPath = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcPath,
      '@types': `${srcPath}/types`,
      '@components': `${srcPath}/components`,
      '@hooks': `${srcPath}/hooks`,
      '@store': `${srcPath}/store`,
      '@services': `${srcPath}/services`,
      '@utils': `${srcPath}/utils`,
      '@pages': `${srcPath}/pages`,
    },
  },
})
