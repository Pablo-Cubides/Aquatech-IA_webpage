#!/usr/bin/env node

/**
 * validate-push.js
 * 
 * Local mirroring of GitHub Actions CI. 
 * Runs syntax checks, linting, typechecking, and a smoke build.
 */

const { execSync } = require('child_process');

function run(command, description) {
  console.log(`\n🚀 Running: ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', env: { ...process.env, SKIP_ENV_VALIDATION: '1' } });
    console.log(`✅ ${description} passed.`);
    return true;
  } catch (error) {
    console.error(`\n❌ ${description} failed.`);
    return false;
  }
}

async function main() {
  console.log('--- PRE-PUSH VALIDATION ---');

  // 1. Syntax Verification (Braces)
  if (!run('node scripts/validate-syntax.js', 'Syntax Validation (Braces)')) process.exit(1);

  // 2. Linting
  if (!run('pnpm lint --filter @ia-next/web', 'ESLint Check')) process.exit(1);

  // 3. Type-checking
  if (!run('pnpm typecheck --filter @ia-next/web', 'TypeScript Type Check')) process.exit(1);

  // 4. Smoke Build
  // We only run build if everything else passed and we want to be absolutely sure.
  if (!run('pnpm run build --filter @ia-next/web', 'Smoke Build (@ia-next/web)')) process.exit(1);

  console.log('\n✨ ALL PRE-PUSH CHECKS PASSED. Ready to push! ✨\n');
  process.exit(0);
}

main();
