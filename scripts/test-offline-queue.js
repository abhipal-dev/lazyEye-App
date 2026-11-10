// Verification suite for Offline Therapy Queue Engine
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const assert = require('assert');

// Helper to transform and require ES module
const moduleCache = {};
function requireEsModule(relPath) {
  const fullPath = path.resolve(__dirname, relPath);
  if (moduleCache[fullPath]) return moduleCache[fullPath];

  const code = fs.readFileSync(fullPath, 'utf8');
  const transformed = babel.transformSync(code, {
    presets: ['module:@react-native/babel-preset'],
    filename: fullPath,
  });

  const m = { exports: {} };
  moduleCache[fullPath] = m.exports;

  const fn = new Function('module', 'exports', 'require', '__dirname', '__filename', transformed.code);
  fn(m, m.exports, (modPath) => {
    if (modPath.startsWith('.')) {
      const resolved = path.resolve(path.dirname(fullPath), modPath);
      if (fs.existsSync(resolved + '.js')) return requireEsModule(resolved + '.js');
      if (fs.existsSync(resolved + '.json')) return require(resolved + '.json');
      if (fs.existsSync(resolved)) return requireEsModule(resolved);
    }
    return require(modPath);
  }, path.dirname(fullPath), fullPath);

  moduleCache[fullPath] = m.exports;
  return m.exports;
}

// Load MMKV and offlineQueue through Babel transform
const { MMKVStorage } = requireEsModule('../src/services/mmkvStorage.js');
const offlineQueueModule = requireEsModule('../src/services/offlineQueue.js');
const offlineQueue = offlineQueueModule.default || offlineQueueModule.offlineQueue;

console.log('\n--- Running Offline Therapy Queue Tests ---');

async function runTests() {
  // Test 1: Clean state
  offlineQueue.clearQueue();
  assert.strictEqual(offlineQueue.getQueue().length, 0, 'Queue should start empty');
  console.log('✓ Test 1: Queue initialization and clear');

  // Test 2: Enqueue session
  const res1 = offlineQueue.enqueue({
    userId: 22,
    gameName: 'Snake',
    score: 35,
    durationSeconds: 180,
  });
  assert.strictEqual(res1.success, true, 'Enqueue should succeed');
  assert.ok(res1.item.id.startsWith('queue_'), 'Item should have unique queue ID');
  assert.strictEqual(res1.item.status, 'pending', 'Initial status should be pending');
  assert.strictEqual(offlineQueue.getStats().pendingCount, 1, 'Pending count should be 1');
  console.log('✓ Test 2: Enqueue session with UUID and pending status');

  // Test 3: Multiple sessions enqueued
  const res2 = offlineQueue.enqueue({
    userId: 22,
    gameName: 'Tetris',
    score: 80,
    durationSeconds: 300,
  });
  assert.strictEqual(res2.success, true);
  assert.strictEqual(offlineQueue.getStats().pendingCount, 2, 'Pending count should be 2');
  console.log('✓ Test 3: Multiple sessions queued in order');

  // Test 4: Listener subscription
  let notifiedStats = null;
  const unsubscribe = offlineQueue.subscribe((stats) => {
    notifiedStats = stats;
  });
  assert.ok(notifiedStats !== null, 'Subscriber should receive initial stats');
  assert.strictEqual(notifiedStats.pendingCount, 2);
  console.log('✓ Test 4: Subscription listener notified');

  // Test 5: Flush with failed network response (simulating offline/tunnel down)
  const mockFailingClient = async () => {
    throw new Error('Network unreachable');
  };
  const failResult = await offlineQueue.flush(mockFailingClient);
  assert.strictEqual(failResult.syncedCount, 0, 'No sessions should sync on failure');
  assert.strictEqual(failResult.remainingCount, 2, 'Sessions must remain in queue on network error');
  const failedItems = offlineQueue.getQueue();
  assert.strictEqual(failedItems[0].status, 'failed', 'Item status should be failed');
  assert.strictEqual(failedItems[0].attempts, 1, 'Attempt counter should increment');
  console.log('✓ Test 5: Network failure retains sessions and records error attempt');

  // Test 6: Flush with successful network response (simulating reconnection)
  const mockSuccessClient = async (endpoint, opts) => {
    return { status: 'success', created_at_utc: new Date().toISOString() };
  };
  // Reset lastAttemptAt to bypass backoff for test run
  offlineQueue.getQueue().forEach((item) => {
    item.lastAttemptAt = 0;
  });
  const successResult = await offlineQueue.flush(mockSuccessClient);
  assert.strictEqual(successResult.syncedCount, 2, 'Both pending sessions should sync successfully');
  assert.strictEqual(successResult.remainingCount, 0, 'Pending queue should now be empty');
  assert.strictEqual(offlineQueue.getStats().pendingCount, 0);
  console.log('✓ Test 6: Network recovery flushes all queued sessions');

  // Test 7: Persistence hydration
  offlineQueue.enqueue({
    userId: 22,
    gameName: 'Ball Catcher',
    score: 12,
    durationSeconds: 60,
  });
  // Verify data is persisted in MMKV
  const rawStored = MMKVStorage.getString('@lazyeye_offline_therapy_queue');
  assert.ok(rawStored && rawStored.length > 0, 'MMKV should contain serialized queue');
  const parsedStored = JSON.parse(rawStored);
  assert.strictEqual(parsedStored[0].gameName, 'Ball Catcher');
  console.log('✓ Test 7: MMKV storage persistence and serialization');

  unsubscribe();
  offlineQueue.clearQueue();

  console.log('\n--- All 7 Offline Therapy Queue Tests Passed Successfully ---\n');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
