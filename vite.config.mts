import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            'html2ansi': '../src'
        }
    },
    build:{
        outDir: 'dist-site'
    }
})