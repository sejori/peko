import { emptyDir } from "https://deno.land/std/fs/mod.ts";
import { build } from "https://deno.land/x/dnt/mod.ts";

async function buildSubmodule(name: string, entry: string) {
  await emptyDir(`./npm/${name}`);

  await build({
    entryPoints: [entry],
    outDir: `./npm/${name}`,
    shims: {
      deno: true
    },
    package: {
      name: `@peko/${name}`,
      version: "2.4.2",
      description: `Peko submodule: ${name}`,
      license: "MIT",
      repository: {
        type: "git",
        url: "git+https://github.com/sejori/peko.git"
      },
      bugs: {
        url: "https://github.com/sejori/peko/issues"
      }
    }
  });
}

async function main() {
  await buildSubmodule("core", "./packages/core/mod.ts");
  await buildSubmodule("http", "./packages/http/mod.ts");
  await buildSubmodule("auth", "./packages/auth/mod.ts");
  await buildSubmodule("dev", "./packages/dev/mod.ts");
  await buildSubmodule("model", "./packages/model/mod.ts");
  await buildSubmodule("graph", "./packages/graph/mod.ts");
}

await main();
