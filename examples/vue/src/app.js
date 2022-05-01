import { createSSRApp } from "https://cdn.skypack.dev/vue@v3.2.23"

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}