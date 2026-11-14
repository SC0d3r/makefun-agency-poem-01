import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const POEM_PATH = path.join(import.meta.dirname, "poem.txt");
const MAX_CHARS = 1000;

function fail(message: string): never {
  console.error(`Error: ${message}`);
  process.exit(1);
}

let poemBytes: Buffer;
try {
  poemBytes = readFileSync(POEM_PATH);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === "ENOENT") {
    fail(`poem.txt is missing (expected at ${POEM_PATH})`);
  }
  fail(`could not read the poem at ${POEM_PATH}: ${(error as Error).message}`);
}

const poem = poemBytes.toString("utf8");
const charCount = [...poem].length;

if (poem.trim().length === 0) {
  fail(`the poem at ${POEM_PATH} is empty or contains only white space`);
}

if (charCount > MAX_CHARS) {
  fail(`the poem at ${POEM_PATH} is ${charCount} characters long; the limit is ${MAX_CHARS}`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath = path.join(outputDir, "entry.txt");

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, poemBytes);

console.log(`Wrote ${charCount} characters to ${outputPath}`);
