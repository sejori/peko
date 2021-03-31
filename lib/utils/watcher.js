self.onmessage = async (e) => {
    const { srcDir } = e.data
    console.log("starting file watcher")
    const watcher = Deno.watchFs(srcDir)
    for await (const event of watcher) {
        self.postMessage(event)
    }
    self.close()
}