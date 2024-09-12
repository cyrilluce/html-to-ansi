#!/usr/bin/env node

import { Readable, Writable } from 'node:stream'
import { program } from 'commander'
import { createReadStream, createWriteStream } from 'node:fs'
import { Html2AnsiStream } from './stream'

program
    .name('html2ansi')
    .description('Convert HTML to colored ANSI colored text')
    .option('-f, --file <file>', 'Input html file path. If not present, will read html from stdin')
    .option('-o, --output <file>', 'Output ansi text to file. If not present, will write to stdout')
    .action(async (opts) => {
        const { file, output } = opts
        let input: Readable = process.stdin
        if(file){
            input = createReadStream(file)
        }
        let out: Writable = process.stdout
        if(output){
            out = await createWriteStream(output)
        }
        input.pipe(new Html2AnsiStream()).pipe(out)
    })

program.parse()