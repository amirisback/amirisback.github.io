import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "out");
const routePath = path.join(rootDir, "src/app/api/content/route.ts");
const i18nActionsPath = path.join(rootDir, "src/lib/i18n-actions.ts");

console.log("🚀 Starting Static Export Build for GitHub Pages...");

// 1. Backup original files
const routeOriginal = fs.readFileSync(routePath, "utf-8");
const i18nOriginal = fs.readFileSync(i18nActionsPath, "utf-8");

try {
  // 2. Prepare files for static export
  const routeStatic = `import { NextResponse } from "next/server";
import { readContent } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  try {
    const data = await readContent();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to read content: " + message },
      { status: 500 }
    );
  }
}
`;
  fs.writeFileSync(routePath, routeStatic, "utf-8");

  const i18nStatic = `import { i18n, type Locale } from "@/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

export async function setLocaleAction(locale: Locale) {
  if (!(i18n.locales as readonly string[]).includes(locale)) {
    throw new Error(\`Invalid locale: \${locale}\`);
  }

  if (typeof document !== "undefined") {
    document.cookie = \`\${COOKIE_NAME}=\${locale}; path=/; max-age=31536000; SameSite=Lax\`;
  }
}
`;
  fs.writeFileSync(i18nActionsPath, i18nStatic, "utf-8");

  // 3. Run build with OUTPUT_EXPORT=true
  console.log("📦 Building Next.js static export...");
  execSync("bun x next build --webpack", {
    stdio: "inherit",
    env: { ...process.env, OUTPUT_EXPORT: "true" },
  });

  // 4. Ensure .nojekyll exists in out/
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "", "utf-8");

  // 5. Ensure 404.html exists in out/
  const notFoundPath = path.join(outDir, "_not-found.html");
  const fallback404Path = path.join(outDir, "404.html");
  if (fs.existsSync(notFoundPath) && !fs.existsSync(fallback404Path)) {
    fs.copyFileSync(notFoundPath, fallback404Path);
  }

  console.log("✅ Static export build completed successfully in ./out");
} finally {
  // Always restore original files
  fs.writeFileSync(routePath, routeOriginal, "utf-8");
  fs.writeFileSync(i18nActionsPath, i18nOriginal, "utf-8");
  console.log("🔄 Restored source files to original dynamic state.");
}

// 6. Deploy to gh-pages branch
console.log("🚀 Deploying ./out to gh-pages branch...");
const worktreeDir = path.join(rootDir, ".gh-pages-worktree");

if (fs.existsSync(worktreeDir)) {
  try {
    execSync(`git worktree remove -f "${worktreeDir}"`, { stdio: "ignore" });
  } catch {
    // Ignore error if already removed
  }
}

// Create worktree for gh-pages
try {
  execSync(`git worktree add -B gh-pages "${worktreeDir}" origin/gh-pages`, {
    stdio: "inherit",
  });
} catch {
  execSync(`git worktree add "${worktreeDir}" gh-pages`, { stdio: "inherit" });
}

// Clean existing files in worktree except .git
const existingFiles = fs.readdirSync(worktreeDir);
for (const file of existingFiles) {
  if (file === ".git") continue;
  fs.rmSync(path.join(worktreeDir, file), { recursive: true, force: true });
}

// Copy everything from out/ into worktree
function copyRecursive(src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyRecursive(outDir, worktreeDir);

// Commit and push
execSync(`git -C "${worktreeDir}" add -A`, { stdio: "inherit" });
const status = execSync(`git -C "${worktreeDir}" status --porcelain`, {
  encoding: "utf-8",
});

if (!status.trim()) {
  console.log("ℹ️ No changes detected on gh-pages.");
} else {
  execSync(
    `git -C "${worktreeDir}" commit -m "deploy: update gh-pages from master (static export)"`,
    { stdio: "inherit" }
  );
  execSync(`git -C "${worktreeDir}" push origin gh-pages`, {
    stdio: "inherit",
  });
  console.log("🎉 Successfully pushed latest static export to origin/gh-pages!");
}

// Clean up worktree
try {
  execSync(`git worktree remove -f "${worktreeDir}"`, { stdio: "inherit" });
  console.log("🧹 Cleaned up deployment worktree.");
} catch {
  // Ignore
}
