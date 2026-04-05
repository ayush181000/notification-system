#!/usr/bin/env bun

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { parse, modify, applyEdits } from "jsonc-parser";

const packageName = process.argv[2];

if (!packageName) {
  console.error("❌ Please provide package name");
  process.exit(1);
}

const ROOT = process.cwd();
const PACKAGES_DIR = join(ROOT, "packages");
const packageDir = join(PACKAGES_DIR, packageName);

if (existsSync(packageDir)) {
  console.error(`❌ Package "${packageName}" already exists`);
  process.exit(1);
}

console.log(`🚀 Creating package: ${packageName}`);

// -----------------------------
// 1️⃣ Create folder structure
// -----------------------------
mkdirSync(join(packageDir, "src"), { recursive: true });

// -----------------------------
// 2️⃣ package.json
// -----------------------------
const pkgJson = {
  name: `@${packageName}`,
  version: "1.0.0",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: {
    build: "tsc -b",
  },
};

writeFileSync(
  join(packageDir, "package.json"),
  JSON.stringify(pkgJson, null, 2),
);

// -----------------------------
// 3️⃣ tsconfig.json (strict)
// -----------------------------
const tsConfig = {
  extends: "../../tsconfig.base.json",
  compilerOptions: {
    outDir: "dist",
    rootDir: "src",
    types: ["node"],
  },
  include: ["src"],
  exclude: ["node_modules", "dist"],
};

writeFileSync(
  join(packageDir, "tsconfig.json"),
  JSON.stringify(tsConfig, null, 2),
);

// -----------------------------
// 4️⃣ starter file
// -----------------------------
writeFileSync(
  join(packageDir, "src/index.ts"),
  `export const ${packageName} = () => {
  return "${packageName} package ready 🚀";
};
`,
);

// -----------------------------
// 5️⃣ Update root tsconfig.json
// -----------------------------
const rootTsconfigPath = join(ROOT, "tsconfig.json");

if (existsSync(rootTsconfigPath)) {
  const rootContent = readFileSync(rootTsconfigPath, "utf-8");
  const rootJson = parse(rootContent);

  const references = rootJson.references ?? [];

  const alreadyExists = references.some(
    (ref: any) => ref.path === `./packages/${packageName}`,
  );

  if (!alreadyExists) {
    const edits = modify(
      rootContent,
      ["references", references.length],
      { path: `./packages/${packageName}` },
      {
        formattingOptions: { insertSpaces: true, tabSize: 2 },
      },
    );

    const updated = applyEdits(rootContent, edits);
    writeFileSync(rootTsconfigPath, updated);

    console.log("✅ Updated root tsconfig references");
  }
}

// -----------------------------
// 6️⃣ Update tsconfig.base.json (paths)
// -----------------------------
const baseTsconfigPath = join(ROOT, "tsconfig.base.json");

if (existsSync(baseTsconfigPath)) {
  const baseContent = readFileSync(baseTsconfigPath, "utf-8");
  const baseJson = parse(baseContent);

  const paths = baseJson?.compilerOptions?.paths ?? {};

  const key = `@${packageName}/*`;

  if (!paths[key]) {
    const edits = modify(
      baseContent,
      ["compilerOptions", "paths", key],
      [`packages/${packageName}/src/*`],
      {
        formattingOptions: { insertSpaces: true, tabSize: 2 },
      },
    );

    const updated = applyEdits(baseContent, edits);
    writeFileSync(baseTsconfigPath, updated);

    console.log("✅ Updated tsconfig paths");
  }
}

// -----------------------------
// DONE
// -----------------------------
console.log(`🎉 Package "@${packageName}" created successfully!`);
