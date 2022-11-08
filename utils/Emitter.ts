export type Listener = (data: unknown) => unknown | Promise<unknown>

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

  subscribe(listener: Listener): boolean {
    this.listeners.push(listener)
    return true
  }

  unsubscribe(listener: Listener): boolean {
    const emListener = this.listeners.find(li => li === listener || li.toString() === listener.toString())
    if (emListener) {
      this.listeners.splice(this.listeners.indexOf(emListener), 1)
      return true
    }
    return false
  }

  // async so won't block process when called without "await"
  async emit(data: unknown): Promise<unknown[]> {    
    return await Promise.all(this.listeners.map(async listener => await listener(data)))
  }
}