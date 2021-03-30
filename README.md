# Velocireno, a frontend web server framework.

## The epic union of Deno 🦕, Skypack 🛰️ & Preact ⚛️

A deno http server renders the content of the page and serves it to the browser as html. The browser then fetches the page's Javascript via Skypack CDN (for external modules) and the Deno server (for custom modules) and hydrates the page.

## Why is this cool?

Because there is no transpilation of Javascript required. The deno server and the browser use the exact same code!

No code bundling is required either and by using es modules we can leverage the browsers in-built caching systems to keep our sites as speedy as your favourite chicken-looking dinosaur or blue-coloured hedgehog.

## Commands:

Start: `$ deno run --allow-net --allow-read --allow-env --unstable lib/server.js`