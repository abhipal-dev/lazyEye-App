const fs = require('fs');
const path = require('path');

// 1. Patch react-native-webview for AGP 9 / RN 0.87
const webviewGradle = path.join(__dirname, '..', 'node_modules', 'react-native-webview', 'android', 'build.gradle');
if (fs.existsSync(webviewGradle)) {
  let content = fs.readFileSync(webviewGradle, 'utf8');
  // Replace direct kotlin-android plugin application
  content = content.replace(
    /if \(isNewArchitectureEnabled\(\)\) \{\s*apply plugin: ['"]com\.facebook\.react['"]\s*\}\s*apply plugin: ['"]kotlin-android['"]/g,
    `if (isNewArchitectureEnabled()) {\n    apply plugin: 'com.facebook.react'\n} else {\n    apply plugin: 'kotlin-android'\n}`
  );
  content = content.replace(/compileSdkVersion getExtOrIntegerDefault\('compileSdkVersion'\)/g, "compileSdk getExtOrIntegerDefault('compileSdkVersion')");
  fs.writeFileSync(webviewGradle, content, 'utf8');
}

// 2. Patch react-native-vector-icons for AGP 9
const vectorIconsGradle = path.join(__dirname, '..', 'node_modules', 'react-native-vector-icons', 'android', 'build.gradle');
if (fs.existsSync(vectorIconsGradle)) {
  let content = fs.readFileSync(vectorIconsGradle, 'utf8');
  content = content.replace(/compileSdkVersion safeExtGet\('compileSdkVersion', 31\)/g, "compileSdk safeExtGet('compileSdkVersion', 35)");
  fs.writeFileSync(vectorIconsGradle, content, 'utf8');
}

