# LazyEye Mobile — Documentation Hub

Welcome to the **LazyEye Mobile** documentation. LazyEye is a specialized digital vision therapy mobile application built with **React Native (Bare CLI 0.87.1)** for the clinical treatment of amblyopia (lazy eye), binocular visual suppression, and strabismus.

The application implements dichoptic anaglyph visual training (Red-Cyan chromatic separation), patient lens calibration, clinical progress tracking via 84-day interactive activity heatmaps, and role-based clinical portals.

---

## Documentation Index

- [**Implementation & Architectural Changelog (`IMPLEMENTATION_CHANGELOG.md`)**](./IMPLEMENTATION_CHANGELOG.md)  
  Comprehensive breakdown of everything implemented: React Native 0.87.1 CLI configuration, native Gradle/AGP patches, branding & asset generation, the `CustomIcon` component, UI redesign, theme contrast audit, and the reusable `GameWebView` architecture.

- [**User Levels, Roles & Access Scopes (`USER_LEVELS_AND_SECURITY.md`)**](./USER_LEVELS_AND_SECURITY.md)  
  Complete guide to user account types (`user`, `doctor`, `admin`, `root`), scoped landing pages, access rules, data isolation boundaries, and clinical confidentiality constraints.

- [**File Structure & Inventory (`FILES_AND_ARCHITECTURE.md`)**](./FILES_AND_ARCHITECTURE.md)  
  Exhaustive map of all project directories, components, screens, services, theme files, and native Android/iOS assets.

---

## Quick Reference: Core Technologies

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | React Native `0.87.1` (Bare CLI) | React `19.2.3`, Node `v24.12.0` |
| **Build Tools** | Android Gradle Plugin `9.2.1` | Gradle `9.4.1`, JDK 17, Android SDK API 37 |
| **Icons** | `react-native-vector-icons` `^10.3.0` | Bundled 19 TTF fonts in `assets/fonts/`, unified via `CustomIcon` |
| **Game Engine** | `react-native-webview` `^14.0.1` | Embedded Canvas dichoptic games with touch gesture pass-through |
| **State & Auth** | Context API (`AuthContext`, `ThemeContext`) | Role-based routing, instant testing switcher, persistent sessions |
| **Styling** | React Native StyleSheet + Custom Design System | High-contrast WCAG AA presets with explicit theme-level borders |

---

## Quick Build & Run Commands

```powershell
# 1. Ensure dependencies and patch scripts are applied
npm install

# 2. Start Metro bundler
npx react-native start

# 3. Assemble and install Android APK
.\android\gradlew.bat -p android :app:assembleDebug
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# 4. Launch the application
adb shell am start -n org.lazyeye.therapy/.MainActivity
```

