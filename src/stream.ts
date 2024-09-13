import { createParser } from './parser'

export class Html2AnsiStream implements ReadableWritablePair<string, string> {
    readable: ReadableStream<string>
    writable: WritableStream<string>
    constructor() {
        const { parser, stack } = createParser()
        const finished = withResolvers<string>()
        this.readable = new ReadableStream({
            pull: async (controller) => {
                const data = await finished.promise
                controller.enqueue(data)
                controller.close()
            },
        })
        this.writable = new WritableStream({
            write(chunk) {
                parser.write(String(chunk))
            },
            close() {
                parser.end()
                finished.resolve(stack[0].texts.join(''))
            }
        })
    }
}

function withResolvers<T = any>() {
    let resolve: (value: T) => void
    let reject: (reason?: any) => void
    const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    })
    // @ts-ignore
    return { promise, resolve, reject }
  }