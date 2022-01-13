self.onmessage = async (e) => {
    const { srcDir } = e.data
    const watcher = Deno.watchFs(srcDir)

    let eventHappened = false
    for await (const event of watcher) {
        if (eventHappened) return
        eventHappened = true
        self.postMessage(event)
        // close after first event as we only need one to trigger reload
        self.close()
    }
}

export const watcherUrl = import.meta.url