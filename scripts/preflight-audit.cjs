const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = process.cwd();
const sourceRoots = ['app', 'hooks', 'prisma', 'tests', 'scripts', 'middleware.ts'];
const extensions = ['.ts', '.tsx', '.js', '.jsx'];
const sourceFiles = [];

function walk(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (extensions.includes(path.extname(target)) && !target.endsWith('.d.ts')) sourceFiles.push(target);
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (['node_modules', '.next', '.test-build', '.git'].includes(entry.name)) continue;
    walk(path.join(target, entry.name));
  }
}
sourceRoots.forEach((entry) => walk(path.join(root, entry)));

const syntaxErrors = [];
const missingImports = [];
const forbiddenSourceReferences = [];
const importPattern = /(?:from\s*|import\s*\()\s*["']([^"']+)["']/g;
const forbiddenPattern = /vapi|elevenlabs|deepgram|GOOGLE_GENERATIVE_AI_API_KEY|gpt-4/i;

function resolveLocalImport(fromFile, specifier) {
  const base = specifier.startsWith('@/')
    ? path.join(root, specifier.slice(2))
    : path.resolve(path.dirname(fromFile), specifier);
  const candidates = [base, ...extensions.map((ext) => base + ext), ...extensions.map((ext) => path.join(base, 'index' + ext)), path.join(base, 'index.ts'), path.join(base, 'index.tsx')];
  return candidates.some((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const transpiled = ts.transpileModule(text, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.Preserve,
      isolatedModules: true,
    },
  });
  for (const diagnostic of transpiled.diagnostics || []) {
    if (diagnostic.category === ts.DiagnosticCategory.Error) {
      syntaxErrors.push(`${path.relative(root, file)}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
    }
  }
  if (forbiddenPattern.test(text)) forbiddenSourceReferences.push(path.relative(root, file));
  importPattern.lastIndex = 0;
  let match;
  while ((match = importPattern.exec(text))) {
    const specifier = match[1];
    if ((specifier.startsWith('@/') || specifier.startsWith('.')) && !resolveLocalImport(file, specifier)) {
      missingImports.push(`${path.relative(root, file)} -> ${specifier}`);
    }
  }
}

let packageOk = true;
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  packageOk = pkg.name === lock.name && pkg.name === lock.packages?.['']?.name && JSON.stringify(pkg.dependencies || {}) === JSON.stringify(lock.packages?.['']?.dependencies || {});
} catch (error) {
  packageOk = false;
}

console.log(`Source files scanned: ${sourceFiles.length}`);
console.log(`Syntax errors: ${syntaxErrors.length}`);
console.log(`Missing local imports: ${missingImports.length}`);
console.log(`Legacy voice/paid-AI references in active source: ${forbiddenSourceReferences.length}`);
console.log(`Package/lock root metadata consistent: ${packageOk ? 'yes' : 'no'}`);
for (const item of syntaxErrors) console.error(`SYNTAX: ${item}`);
for (const item of missingImports) console.error(`IMPORT: ${item}`);
for (const item of forbiddenSourceReferences) console.error(`LEGACY: ${item}`);
if (syntaxErrors.length || missingImports.length || forbiddenSourceReferences.length || !packageOk) process.exitCode = 1;
