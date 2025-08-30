// parse-files.ts
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

// CLI arg: node parse-files.js project.txt
const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: bun run parse-files.ts <input-file>");
  process.exit(1);
}

const input = await Bun.file(inputFile).text();

const fileRegex = /\/\/\s*📄\s*(.+)\n([\s\S]*?)(?=(?:\/\/\s*📄|$))/g;

for (const match of input.matchAll(fileRegex)) {
  const [, filePath, content] = match;

  const fullPath = join(process.cwd(), filePath.trim());
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content.trimStart() + "\n");

  console.log(`✅ Wrote ${fullPath}`);
}

