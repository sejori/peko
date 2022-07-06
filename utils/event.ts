import { Event } from "../server.ts"

const emitters: Emitter[] = []

export type Emitter = {
  emit: (e: Event) => Promise<unknown[]> | undefined
  subscribe: (cb: Listener) => boolean
  unsubscribe: (cb: Listener) => boolean
  listeners: Listener[]
}

export type Listener = (e: Event) => unknown | Promise<unknown>

/**
 * Peko's internal event emitter.
 * @param initListeners: Listener[]
 * @returns emitter: Emitter
 */
export const createEmitter = (initListeners?: Listener[] | Listener) => {
  const listeners: Listener[] = initListeners && initListeners instanceof Array
    ? initListeners 
    : initListeners ? [initListeners] : []

  const subscribe = (listener: Listener) => {
    listeners.push(listener)
    return true
  }

  const unsubscribe = (listener: Listener) => {
    // convert listener function bodies to strings for comparison
    const emListener = listeners.find(li => li.toString() === listener.toString())
    if (emListener) {
      listeners.splice(listeners.indexOf(emListener), 1)
      return true
    }
    return false
  }

  // async so won't block process when called without "await"
  const emit = async (data: Record<string, unknown>) => {
    const date = new Date()
    const eventId = `EMIT-${JSON.stringify(data)}`
    const event: Event = { 
      id: `${eventId}-${date.toJSON()}`, 
      type: "emit", 
      date: date, 
      data 
    }
    
    try {
      return await Promise.all(listeners.map(async listener => await listener(event)))
    } catch (error) {
      throw(error)
    }
  }

  const emitter = { emit, listeners, subscribe, unsubscribe }

  emitters.push(emitter)
  return emitter
}