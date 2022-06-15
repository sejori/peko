interface Window { 
    document: { createEvent: (_x: string) => number },
    navigator: Navigator
}
window.document = { createEvent: (_x) => 0 }