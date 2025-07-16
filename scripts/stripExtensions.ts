// scripts/strip-dts-extensions.js
import fs from "node:fs";
import path from "node:path";

const EXT_PATTERN = /(?<=from\s+["'])(\.\/.*?)(\.ts)(["'])/g;

function stripExtensionsInFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf8");
  const updated = content.replace(EXT_PATTERN, (_, base, __, quote) => `${base}.d.ts${quote}`);
  fs.writeFileSync(filePath, updated);
}

function walkDir(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(fullPath);
    else if (entry.isFile() && fullPath.endsWith(".d.ts")) stripExtensionsInFile(fullPath);
  }
}

walkDir("./dist");
console.log("Stripped .ts extensions from declaration files.");
