import { Parser } from 'htmlparser2'
import { Duplex } from 'node:stream'
import { createParser, type Stack } from './parser'

export class Html2AnsiStream extends Duplex {
    protected parser: Parser
    protected stack: Stack[]
    #finished = false
    #read = false
    constructor() {
        super({
            decodeStrings: true
        })
        const { parser, stack } = createParser()
        this.parser = parser
        this.stack = stack
    }
    override _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        this.parser.write(String(chunk))
        callback()
    }

    override _final(callback: (error?: Error | null) => void) {
        this.#finished = true
        this.#flush()
        callback()
    }

    #flush() {
        if (this.#finished && this.#read) {
            this.push(Buffer.from(this.stack[0].texts.join('')))
            // end
            this.push(null)
        }
    }
    override _read(size: number): void {
        this.#read = true
        this.#flush()
    }
}