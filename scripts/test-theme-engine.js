// Unit & Integration tests for LazyEye Mobile Theme Engine
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const assert = require('assert');

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

const { THEMES, DEFAULT_THEME } = requireEsModule('../src/theme/themes.js');

console.log('\n--- Running Mobile Theme Engine Verification Tests ---');

function runThemeTests() {
  // Test 1: Verify default theme constant
  assert.strictEqual(DEFAULT_THEME, 'calmDark', 'DEFAULT_THEME must be calmDark');
  assert.ok(THEMES[DEFAULT_THEME], 'Default theme must exist in THEMES registry');
  console.log('✓ Test 1: Default theme resolves to calmDark');

  // Test 2: Core color tokens present across all defined themes
  const requiredTokens = [
    'background',
    'surface',
    'border',
    'cardBorder',
    'primary',
    'text',
    'textSecondary',
    'textMuted',
    'cardBg',
  ];

  ['calmDark', 'clinicalCrisp'].forEach((themeKey) => {
    const theme = THEMES[themeKey];
    assert.ok(theme, `Theme ${themeKey} should exist`);
    assert.strictEqual(typeof theme.colors, 'object', `Theme ${themeKey} must have colors object`);
    
    requiredTokens.forEach((token) => {
      assert.ok(
        theme.colors[token],
        `Theme ${themeKey} is missing required color token: ${token}`
      );
    });
  });
  console.log('✓ Test 2: Core color tokens complete across calmDark and clinicalCrisp');

  // Test 3: Legacy aliases backward compatibility
  const legacyKeys = ['cyberCyan', 'anaglyphDichoptic', 'emeraldComfort'];
  legacyKeys.forEach((key) => {
    assert.ok(THEMES[key], `Legacy alias ${key} should resolve without throwing`);
    assert.strictEqual(THEMES[key].id, 'calmDark', `Legacy alias ${key} should map to calmDark`);
  });
  console.log('✓ Test 3: Legacy theme aliases map gracefully to calmDark');

  // Test 4: Contrast and StatusBar configurations
  assert.strictEqual(THEMES.calmDark.statusBar, 'light-content', 'calmDark should use light-content status bar');
  assert.strictEqual(THEMES.clinicalCrisp.statusBar, 'dark-content', 'clinicalCrisp should use dark-content status bar');
  assert.strictEqual(THEMES.calmDark.isDark, true, 'calmDark isDark flag must be true');
  assert.strictEqual(THEMES.clinicalCrisp.isDark, false, 'clinicalCrisp isDark flag must be false');
  console.log('✓ Test 4: StatusBar and dark mode flags align with contrast requirements');

  // Test 5: Hex format validation
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbaRegex = /^rgba?\(/;
  ['calmDark', 'clinicalCrisp'].forEach((themeKey) => {
    const colors = THEMES[themeKey].colors;
    for (const [key, value] of Object.entries(colors)) {
      if (value === 'transparent') continue;
      const isValid = hexRegex.test(value) || rgbaRegex.test(value);
      assert.ok(isValid, `Color ${key} in ${themeKey} has invalid format: ${value}`);
    }
  });
  console.log('✓ Test 5: All color token values adhere to valid hex or rgba strings');

  console.log('\nAll 5 theme engine verification tests passed successfully.\n');
}

try {
  runThemeTests();
} catch (err) {
  console.error('❌ Theme engine test failed:', err.message);
  process.exit(1);
}
