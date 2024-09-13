#!/usr/bin/env node

import { type Readable, type Writable, Stream } from 'node:stream'
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
            input = createReadStream(file, 'utf-8')
        }
        let out: Writable = process.stdout
        if(output){
            out = await createWriteStream(output)
        }
        const stream = new Html2AnsiStream()
        Stream.Readable.toWeb(input).pipeThrough<string>(stream as any).pipeTo(Stream.Writable.toWeb(out))
    })

program.parse()