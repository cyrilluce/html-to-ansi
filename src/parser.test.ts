import { describe, expect, it } from 'vitest'
import {html2ansi} from './parser'
import chalk from 'chalk'

describe('html2ansi', ()=>{
    it('simple', ()=>{
        expect(html2ansi(`<span style='color: red;'>test</span>`)).toBe(chalk.red('test'))
        expect(html2ansi(`<span style='background-color: red;'>test</span>`)).toBe(chalk.bgRed('test'))

        expect(html2ansi(`<span style='color: rgb(64, 158, 255);'>test</span>`)).toBe(chalk.rgb(64, 158, 255)('test'))

        expect(html2ansi(`<span style=' opacity : 0.5'>test</span>`)).toBe(chalk.dim('test'))
        expect(html2ansi(`<b>test</b>`)).toBe(chalk.bold('test'))
        expect(html2ansi(`<i>test</i>`)).toBe(chalk.italic('test'))
        expect(html2ansi(`<u>test</u>`)).toBe(chalk.underline('test'))
        expect(html2ansi(`<del>test</del>`)).toBe(chalk.strikethrough('test'))

        expect(html2ansi(`<a href="https://www.cnbeta.com.tw/articles/tech/1445200.htm" target="_blank" style="box-sizing: border-box; transition: 0.2s; margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: 700; font-stretch: inherit; font-size: 20px; line-height: 35px; font-family: inherit; font-optical-sizing: inherit; font-size-adjust: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; vertical-align: baseline; color: rgb(192, 0, 0); text-decoration: none; background-color: transparent;">test</a>`)).toBe(chalk.rgb(192, 0, 0)('test'))
    })
    
    it('compose', ()=>{
        expect(html2ansi(`<span style='color: #0dbc79; color: #000000; background-color: #BFBFBF; font-weight: bold;'> PASS </span>`)).toBe(chalk.hex('#000000').bgHex('#BFBFBF').bold(' PASS '))
        expect(html2ansi(`<div>foo</div><div>bar</div>`), 'div as new line').toBe(`foo\nbar`)
    })

    it('nested', ()=>{
        expect(html2ansi(`<b>te<i>st</i></b>`)).toBe(chalk.bold(`te${chalk.italic('st')}`))
    })

    it('ignore wrap', ()=>{
        expect(html2ansi(`<meta charset='utf-8'><html><body><!--StartFragment--><pre><div style='color: #000000; background-color: #ffffff; font-family: Menlo, Monaco, 'Courier New', monospace, monospace; font-size: 12px;'><div><b>test</b></div></div></pre><!--EndFragment--></body></html>`)).toBe(chalk.bold('test'))
    })
})