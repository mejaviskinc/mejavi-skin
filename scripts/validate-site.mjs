import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(process.cwd(), "site");
const htmlFiles = readdirSync(root).filter((name) => name.endsWith(".html"));
const failures = [];

for (const name of htmlFiles) {
  const file = resolve(root, name);
  const html = readFileSync(file, "utf8");
  const refs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((m) => m[1]);

  if (/\.netlify\//i.test(html)) failures.push(`${name}: contains stale Netlify runtime reference`);

  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref)) continue;
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    if (clean.startsWith("/")) {
      failures.push(`${name}: root-absolute reference is not GitHub Pages safe: ${ref}`);
      continue;
    }
    const target = resolve(dirname(file), clean);
    if (!existsSync(target)) failures.push(`${name}: missing local asset/page: ${ref}`);
  }
}

for (const file of ["script.js","store.js","tracking.js","javi.js","site-content.js","admin.js"]) {
  if (!existsSync(resolve(root, file))) failures.push(`missing required file: ${file}`);
}

const content = JSON.parse(readFileSync(resolve(root, "content-default.json"), "utf8"));
if (!Array.isArray(content.products) || !content.products.length) failures.push("content-default.json: products is empty");
if (!Array.isArray(content.keyIngredients) || !content.keyIngredients.length) failures.push("content-default.json: keyIngredients is empty");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Site validation OK: ${htmlFiles.length} HTML pages checked.`);
