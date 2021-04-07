import { config } from "https://deno.land/x/dotenv/mod.ts"

// export all .env vars as attributes to env export
export const env = config({ safe: true })

// boolean dev environment flag
export const devMode = env.ENVIRONMENT === "development"

// location of client source files
export const srcDir = `${Deno.cwd()}/src`

// html template for ssr
export const templateFile = `${Deno.cwd()}/src/templates/default.js`

// globs for file searching in page ssr
export const pagesGlob = `${Deno.cwd()}/src/pages/*.js`
export const cssGlob = `${Deno.cwd()}/src/styles/*.css`

// location of client dist files (stores dependency bundles)
export const distDir = `${Deno.cwd()}/dist`
