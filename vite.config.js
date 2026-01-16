import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        wasm(),
        topLevelAwait(),
        react()
    ],
    optimizeDeps: {
        exclude: ['onnxruntime-web']
    },
    server: {
        host: '0.0.0.0', // Allow access from network
        port: 5173,
        strictPort: true
    }
})
