export function parseStyle(style: string){
    const styles: Record<string, string> = {}
    const rules = style.split(';').map(r => r.trim()).filter(r => !!r)
    for(const rule of rules){
        let [key, value] = rule.split(':')
        key = key.trim()
        value = value.trim()
        styles[key] = value
    }
    return styles
}