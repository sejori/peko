// export all .env vars as attributes to env export
export const env = Deno.env.toObject()

// dev environment flag
export const devMode = env.ENVIRONMENT !== "production"

// dev: adjust to increase hot reload delay (if server start isn't finishing before page refresh)
export const reloadDelay = 400

// location of client source files
export const srcDir = `${Deno.cwd()}/src`

// html template for ssr
export const templateFile = `${Deno.cwd()}/src/templates/default.js`

// globs for file searching in page ssr
export const pagesGlob = `${Deno.cwd()}/src/pages/*.js`
export const cssGlob = `${Deno.cwd()}/src/styles/*.css`

// location of dist directory (stores page bundles in prod env)
export const distDir = `${Deno.cwd()}/dist`

export const cacheLifespan = 3600000