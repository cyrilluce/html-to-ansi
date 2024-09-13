import defaultChalk, { type Chalk } from 'chalk'
import { Parser } from 'htmlparser2'
import { parseStyle } from './parse-style'
import debug from 'debug'

const log = debug('html2ansi')

export interface Stack {
    color?: string
    backgroundColor?: string
    bold?: boolean
    opacity?: number
    italic?: boolean
    underscore?: boolean
    hidden?: boolean
    del?: boolean
    pre?: boolean
    texts: string[]
}

const humanColorRegex = /^[a-z]+$/i
const rgbColorRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/

interface Options {
    chalk?: Chalk
}
export function html2ansi(html: string, opts: Options = {}) {
    const { stack, parser } = createParser(opts)

    parser.write(html)
    parser.end()

    return stack[0].texts.join('')
}


export function createParser(opts: Options = {}) {
    const { chalk = defaultChalk } = opts
    const stack: Stack[] = [
        // root
        {
            texts: []
        }
    ]
    const parser = new Parser({
        onopentag(name, attribs) {
            const s: Stack = {
                texts: []
            }
            stack.push(s)

            let skipStyle = false
            switch (name) {
                case 'span':
                case 'font':
                    break
                case 'i':
                    s.italic = true
                    break
                case 'b':
                    s.bold = true
                    break
                case 'u':
                    s.underscore = true
                    break
                case 'del':
                    s.del = true
                    break
                // ignore
                default:
                    skipStyle = true
                    break
            }
            const style = attribs.style
            if (skipStyle || !style) {
                return
            }
            const styleMap = parseStyle(attribs.style)
            for (const [key, value] of Object.entries(styleMap)) {
                switch (key) {
                    case 'color':
                        s.color = value
                        break
                    case 'background-color':
                        s.backgroundColor = value
                        break
                    case 'opacity':
                        s.opacity = parseFloat(value)
                        break
                    case 'text-decoration':
                        if (value.includes('underline')) {
                            s.underscore = true
                        }
                        break
                    case 'font-weight':
                        if (value === 'bold') {
                            s.bold = true
                        }
                        break
                }
            }

        },
        ontext(data) {
            const cur = stack[stack.length - 1]
            cur.texts.push(data)
        },
        onclosetag(name, isImplied) {
            const closed = stack.pop()!
            const parent = stack[stack.length - 1]
            let text = closed.texts.join('')
            let modifier: Chalk = chalk
            if (closed.color) {
                const color = closed.color
                if (color.startsWith('#')) {
                    modifier = modifier.hex(color)
                } else if (humanColorRegex.test(color)) {
                    if (color in chalk) {
                        modifier = chalk[color as keyof typeof chalk] as typeof chalk
                    } else {
                        // TODO: more colors
                        log(`Warning: Unknown color ${color}`)
                    }
                } else if (rgbColorRegex.test(color)) {
                    const [, r, g, b] = color.match(rgbColorRegex)!
                    modifier = modifier.rgb(parseInt(r), parseInt(g), parseInt(b))
                } else {
                    log(`Warning: Unknown color ${color}`)
                }
            }
            if (closed.backgroundColor) {
                const color = closed.backgroundColor
                if (color.startsWith('#')) {
                    modifier = modifier.bgHex(color)
                } else if (humanColorRegex.test(color)) {
                    const method = `bg${capitalize(color)}`
                    if (method in chalk) {
                        modifier = chalk[method as keyof typeof chalk] as typeof chalk
                    } else {
                        // TODO: more colors
                        log(`Warning: Unknown color ${color}`)
                    }
                } else if (rgbColorRegex.test(color)) {
                    const [, r, g, b] = color.match(rgbColorRegex)!
                    modifier = modifier.bgRgb(parseInt(r), parseInt(g), parseInt(b))
                } else {
                    // TODO: more colors / rgb ...
                    log(`Warning: Unknown color ${color}`)
                }
            }
            if (closed.bold) {
                modifier = modifier.bold
            }
            if (closed.opacity === 0.5) {
                modifier = modifier.dim
            }
            if (closed.italic) {
                modifier = modifier.italic
            }
            if (closed.underscore) {
                modifier = modifier.underline
            }
            if (closed.hidden) {
                modifier = modifier.hidden
            }
            if (closed.del) {
                modifier = modifier.strikethrough
            }
            if (name === 'div' && parent.texts.length > 0) {
                // new line
                parent.texts.push('\n')
                text = text.trimEnd()
            }
            parent.texts.push(modifier(text))
        },
    })

    return {
        parser, stack
    }
}


function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}