// Master test runner for LazyEye Mobile
const { spawnSync } = require('child_process');
const path = require('path');

const suites = [
  { name: 'Offline Queue Engine', script: 'scripts/test-offline-queue.js' },
  { name: 'Mobile Theme Engine', script: 'scripts/test-theme-engine.js' },
];

console.log('========================================');
console.log('Running LazyEye Mobile Test Suites');
console.log('========================================\n');

let failed = false;

suites.forEach((suite) => {
  console.log(`>>> Starting: ${suite.name}`);
  const result = spawnSync(process.execPath, [path.join(__dirname, '..', suite.script)], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });

  if (result.status !== 0) {
    console.error(`❌ Suite failed: ${suite.name} (exit code ${result.status})`);
    failed = true;
  }
});

if (failed) {
  console.error('\nOne or more test suites failed.');
  process.exit(1);
} else {
  console.log('\n========================================');
  console.log('✓ All LazyEye Mobile Test Suites Passed');
  console.log('========================================\n');
}
