import { config } from "https://deno.land/x/dotenv/mod.ts"

export const { ENVIRONMENT, DOMAIN } = config({ safe: true })

export const devMode = ENVIRONMENT === "development"
export const srcDir = `${Deno.cwd()}/src`