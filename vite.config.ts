import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                app: 'index.html',
                background: 'src/scripts/background.ts',
            },
            output: {
                entryFileNames: ({ name }) => {
                    return name === 'background' ? 'background.js' : 'assets/[name].js'
                },
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
})
