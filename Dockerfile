FROM hayd/deno:latest

# Beko port
EXPOSE 7777

# Prefer not to run as root.
USER deno

WORKDIR /app

ADD . .

ENV ENVIRONMENT=production

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--allow-run", "--unstable", "lib/server.js"]
