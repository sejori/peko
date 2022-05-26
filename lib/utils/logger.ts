import { getConfig } from "../config.ts"
import { Event } from "../types.ts"

/**
 * Peko's internal logging function.
 * 
 * Returns promise so process isn't blocked when called without "await" keyword.
 * 
 * @param request: Request
 * @param status: number
 * @param start: number
 * @param responseTime: number
 * @returns Promise<void>
 */
export const logRequest = async (request: Request, status: number, start: number, responseTime: number) => {
  const config = getConfig()
  const date = new Date(start).toString()
  const headers: Record<string, string> = {}
  for (const pair of request.headers.entries()) {
      headers[pair[0]] = pair[1]
  }

  const requestEvent: Event = {
      id: `${request.method}-${request.url}-${date}`,
      type: "request",
      date,
      data: {
        status,
        method: request.method,
        url: request.url,
        responseTime: `${responseTime}ms`,
        headers
      }
  }

  try {
      await config.logString(`[${requestEvent.date}] ${requestEvent.data.status} ${requestEvent.data.method} ${requestEvent.data.url} ${requestEvent.data.responseTime}`)
  } catch (error) {
      console.log(error)
  }

  try {
      await config.logEvent(requestEvent)
  } catch (error) {
      console.log(error)
  }
}