import { config } from "https://deno.land/x/dotenv/mod.ts"

// export all .env vars as attributes to env export
export const env = config({ safe: true })

// boolean dev environment flag
export const devMode = env.ENVIRONMENT === "development"

// location of client source files
export const srcDir = `${Deno.cwd()}/src`

// location of page modules
export const pagesDir = `${Deno.cwd()}/src/pages/*.js`

// location of client dist files (stores dependency bundles)
export const distDir = `${Deno.cwd()}/dist`
