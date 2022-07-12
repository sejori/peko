import { Event } from "../server.ts"

export type Listener = (e: Event) => unknown | Promise<unknown>

/**
 * Event emitter class, designed to be used with the sseHandler
 * @param initListeners: Listener[]
 * @returns emitter: Emitter
 */
export class Emitter {
  listeners: Listener[] = []

  constructor(initListeners?: Listener[] | Listener) {
    this.listeners = initListeners instanceof Array
      ? initListeners 
      : initListeners ? [initListeners] : []
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener)
    return true
  }

  unsubscribe(listener: Listener) {
    // convert listener function bodies to strings for comparison
    const emListener = this.listeners.find(li => li.toString() === listener.toString())
    if (emListener) {
      this.listeners.splice(this.listeners.indexOf(emListener), 1)
      return true
    }
    return false
  }

  // async so won't block process when called without "await"
  async emit (data: Record<string, unknown>) {
    const date = new Date()
    const eventId = `EMIT-${JSON.stringify(data)}`
    const event: Event = { 
      id: `${eventId}-${date.toJSON()}`, 
      type: "emit", 
      date: date, 
      data 
    }
    
    try {
      return await Promise.all(this.listeners.map(async listener => await listener(event)))
    } catch (error) {
      throw(error)
    }
  }
}