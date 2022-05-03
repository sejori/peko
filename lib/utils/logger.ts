import { getConfig } from "../config.ts"
import { RequestEvent } from "../types.ts"

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
  
  const headers: Record<string, string> = {}
  for (const pair of request.headers.entries()) {
      headers[pair[0]] = pair[1]
  }

  const requestEvent: RequestEvent = {
      date: new Date(start).toString(),
      status,
      method: request.method,
      url: request.url,
      responseTime: `${responseTime}ms`,
      headers
  }

  try {
      await config.logString(`[${requestEvent.date}] ${requestEvent.status} ${requestEvent.method} ${requestEvent.url} ${requestEvent.responseTime}`)
  } catch (error) {
      console.log(error)
  }

  try {
      await config.logEvent(requestEvent)
  } catch (error) {
      console.log(error)
  }
}