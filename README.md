# html2ansi

Convert HTML to ANSI colored text.

Online playground: <https://cyrilluce.github.io/html-to-ansi/>

## Usage

### cli

```sh
# convert input.html to output.txt
npx html2ansi -f input.html -o output.txt
# streaming
npx html2ansi -f input.html
```

### NodeJs

```sh
npm i html2ansi -S
```

```ts
import { html2ansi } from 'html2ansi';

const ansi = html2ansi(html);
```

## TODOs

- [ ] support `<pre>`
- [ ] support colors supported in browser but not available with `chalk.xxx`

> PR is welcome!
