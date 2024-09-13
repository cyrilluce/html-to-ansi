import { defineConfig } from 'vite'

export default defineConfig({
    base: '',
    resolve: {
        alias: {
            'html2ansi': '../src'
        }
    },
    build:{
        outDir: 'dist-site'
    }
})