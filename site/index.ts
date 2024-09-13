import {Instance} from 'chalk'
import { html2ansi } from 'html2ansi'

const $input = document.getElementById('input-text')! as HTMLTextAreaElement
const $output = document.getElementById('output-text')! as HTMLTextAreaElement
const $copy = document.getElementById('copy-button')! as HTMLButtonElement

const chalk = new Instance({
    level: 2
})
function update(){
    $output.value = html2ansi($input.value, {
        chalk: chalk
    })
}

$input.addEventListener('input', update)
$input.addEventListener('change', update)

$input.addEventListener('paste', e => {
    e.preventDefault()
    let text: string | undefined
    try {
        text = e.clipboardData?.getData('text/html')
    } catch {
        text = e.clipboardData?.getData('text')
    }
    if (text) {
        const str = $input.value
        $input.value = str.slice(0, $input.selectionStart) + text + str.slice($input.selectionEnd)
        update()
    }
})

$copy.addEventListener('click', ()=>{
    navigator.clipboard.writeText($output.value)
})