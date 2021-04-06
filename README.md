# Velocireno, a frontend web server framework.

## The epic union of Deno 🦕 &  Preact ⚛️

A deno http server renders the content of the page and serves it to the browser as html. The browser then fetches the page's Javascript via Skypack CDN (for external modules) and the Deno server (for internal modules) and hydrates the page.

## Why is this cool?

Because there is no transpilation of Javascript required. The deno server and the browser use the exact same code!

No code bundling is required either and by using es modules we can leverage the browsers in-built caching systems to keep our sites as speedy as your favourite chicken-looking dinosaur or blue-coloured hedgehog.

## Awesome features:
 - <strong>Server-side rendering</strong> - boost SEO and UX with instant content.
 - <strong>Featherweight apps</strong> - only default external modules are preact and htm, totalling less than 5kb combined.</li>
 - <strong>Hot-reloading</strong> - smooth DX with in-built devSocket, notifies browsers of src changes and triggers a reload (only used when ENVIRONMENT=development in .env).
 - <strong>CSS handling</strong> - css files present in src directory are bundled into html template (for non-global component styles use inline css in the component's js file).
 - <strong>useLocalState</strong> - hook for syncing state to localStorage, helpful for sharing state between components and preserving across user sessions and hot-reloads.

## Commands:

Start: `$ deno run --allow-net --allow-read --allow-write --allow-env --allow-run --unstable lib/server.js`