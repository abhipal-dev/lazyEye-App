# 👁️ LazyEye Mobile — React Native Vision Therapy Platform

<p align="center">
  <a href="https://github.com/abhipal-dev/lazyEye-App/actions/workflows/ci.yml"><img src="https://github.com/abhipal-dev/lazyEye-App/actions/workflows/ci.yml/badge.svg" alt="Mobile CI Pipeline"></a>
  <img src="https://img.shields.io/badge/React%20Native-0.87-61DAFB?style=for-the-badge&logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey?style=for-the-badge&logo=android" alt="Platforms">
  <img src="https://img.shields.io/badge/Storage-MMKV%20%2F%20SQLite-4E9A06?style=for-the-badge" alt="MMKV / SQLite">
</p>

A comprehensive, role-scoped cross-platform **React Native** application for **LazyEye (Amblyopia)** clinical rehabilitation. Built with dichoptic anaglyph gaming, multi-tier user workspaces, 84-day therapy intensity heatmaps, and customizable visual themes.

---

## 🚀 Key Features

### 1. 🎭 Role-Based Scoped Portals & One-Tap Switching
The app provides distinct dashboards and strict data isolation matching the LazyEye web architecture:

| Role | Username | Password | Scope & Mobile Capabilities |
| :--- | :--- | :--- | :--- |
| **🩺 Doctor / Optometrist** | `dr_sarah` | `doctor123` | • Scoped **strictly** to assigned patients (Abhishek Pal & Riya Jaiwal)<br>• Review 84-day interactive therapy heatmap<br>• Prescribe daily therapy goals (10–30 mins)<br>• Calibrate chromatic lens colors & contrast sliders (0–255)<br>• Record clinical evaluations & compliance ratings |
| **🏥 Clinic Administrator** | `admin` | `admin123` | • Clinic overview KPIs (patients, optometrists, queue)<br>• Review and approve self-registered applicants<br>• Assign doctors to patients<br>• Admins tab is hidden (cannot view other admins) |
| **👑 Root Superadmin** | `root` | `root123` | • Full system master controls & global metrics<br>• Provision new Administrator and Root accounts<br>• System database monitoring (Paris Clever Cloud & SQLite) |
| **🎮 Vision Patient** | `abhi8535` | `9870` | • Real-time daily progress ring & adherence tracking<br>• Playable **Dichoptic Tetris** (Left Eye falling piece vs Right Eye grid)<br>• Playable **Dichoptic Snake** (Left Eye body vs Right Eye food targets)<br>• Anaglyph 3D glasses contrast calibration<br>• Personal scores & supervising doctor notes |

---

### 2. 🎨 4 Distinct Clinical & Therapy Theme Presets
Switchable on the fly from any screen or header with instant live UI adaptation:

1. **⚡ Cyber Cyan (Dark Therapy)**: High-contrast clinical dark mode (`#070C18`) with neon cyan accents. Default therapy mode for low screen glare.
2. **🏥 Clinical Crisp (Light Clinic)**: Bright, clean hospital/optometrist theme (`#F1F5F9`) with sky-blue branding and dark slate typography.
3. **🕶️ Anaglyph 3D (Red & Cyan)**: True chromatic therapy theme with split red (`#FF2A6D`) and cyan (`#05D9E8`) styling.
4. **🌿 Emerald Wellness (Anti-Strain)**: Soothing botanical green tones (`#041510`, `#10B981`) designed to reduce visual fatigue and asthenopia.

---

### 3. 🕹️ 11 Clinical Vision & Dichoptic Gaming Engines
In dichoptic amblyopia treatment, high-contrast chromatic elements are separated between the eyes to overcome brain suppression:
- **Dichoptic Tetris**: Falling tetrominoes in Left Eye color vs settled grid in Right Eye color.
- **Dichoptic Snake**: Snake body vs food targets split chromatically with edge-to-edge gesture navigation.
- **Flappy Dichoptic, Chromatic Breaker & Anaglyph Pacman**: Dynamic suppression-breaking action games.
- **Bullseye Saccades, Vernier Acuity & Fusion Depth Rings**: Oculomotor saccadic training & stereopsis exercises.
- **Contrast Stairs, Binocular Racer & Visual Search**: Contrast sensitivity & binocular integration challenges.
- **Dual Engine Toggle**: Seamlessly switch between native React Native gesture games and live interactive web engines in Settings.
- **Auto-Recording**: Sessions automatically log game name, score, and elapsed therapy seconds to the clinical records database upon completion.

---

### 4. 🗄️ High-Speed MMKV Storage & Settings Engine
- Fast key-value persistence via `mmkvStorage.js` with instant zero-overhead reads/writes.
- Persistent user preferences: Theme selection, Engine mode (`Local Engine` vs `Webview Engine`), Audio toggles, and live/offline data toggles.
- Automatic fallback synchronization ensuring offline sessions are never lost.

---

### 5. 📊 Real Clinical Data & Patient Overview
- Real patient cohorts and consultation logs (`realDataService.js` / `realData.json`) with clinical metrics.
- High-resolution real avatar integration (`avatarHelper.js`).
- Dedicated **Patient Overview** screen presenting visual acuity trends, treatment adherence statistics, and active clinical notifications.

---

### 6. 📱 Custom Floating Bottom Tab Navigation
- Custom bottom tab bar with curved floating pill styling, active glow indicators, and tactile feedback inspired by production TaxiMuscat architecture.

---

### 7. 📅 84-Day (12-Week) Interactive Therapy Heatmap
- A responsive 7-row × 12-column GitHub-style contribution grid.
- Color-coded by daily therapy volume (0 mins, 10–20 mins, 30+ mins).
- **Single-Day Drill-Down**: Tap any calendar day cell to filter the sessions table and inspect exact game scores, play durations, and clinical notes from that date.

---

### 8. 🌐 Live API & Resilient Offline Fallback
- Connects to the live Render cloud deployment: `https://lazyeye.onrender.com`
- Features a self-healing offline mock database with the full seeded clinical cohort so the mobile app operates with zero lag even without an active internet connection.

---

## 📂 Project Architecture (Bare React Native CLI)

```
lazyEye_Mobile/
├── App.js                               # Root App with ThemeProvider & AuthProvider
├── index.js                             # AppRegistry entry point
├── app.json                             # Application metadata ("LazyEyeMobile")
├── package.json                         # CLI dependencies & scripts
├── metro.config.js                      # Metro bundler config
├── babel.config.js                      # Babel preset for React Native
├── android/                             # Native Android Studio Project
│   ├── build.gradle                     # Top-level Gradle config
│   ├── settings.gradle                  # Gradle project settings
│   ├── gradlew & gradlew.bat            # Gradle wrapper executables
│   └── app/
│       ├── build.gradle                 # Application Gradle (namespace "org.lazyeye.therapy")
│       └── src/main/
│           ├── AndroidManifest.xml      # App permissions & launch activity
│           ├── java/org/lazyeye/therapy/
│           │   ├── MainActivity.kt      # Main React Activity
│           │   └── MainApplication.kt   # React Native Application entry
│           └── res/                     # Launch drawables, styles, strings
├── ios/                                 # Native Apple Xcode Project
│   ├── Podfile                          # CocoaPods dependencies
│   ├── .xcode.env                       # Xcode build environment
│   └── LazyEyeMobile/                   # Native iOS app bundle & AppDelegate
└── src/
    ├── assets/                          # App logos, therapy icons, game assets
    ├── context/
    │   ├── AuthContext.js               # Multi-role authentication & session state
    │   └── ThemeContext.js              # Dynamic 4-theme palette manager
    ├── theme/
    │   └── themes.js                    # 4 Clinical theme token definitions
    ├── services/
    │   ├── api.js                       # Live Render API client & mock database
    │   ├── games.js                     # 11 Vision therapy game configurations
    │   ├── mmkvStorage.js               # High-speed MMKV persistent storage
    │   ├── settingsHandler.js           # Settings manager & preferences
    │   ├── realDataService.js           # Real patient & consultation data service
    │   ├── realData.json                # Seeded clinical dataset
    │   ├── avatarHelper.js              # Patient & doctor profile avatar resolver
    │   └── storage.js                   # Cross-platform session persistence
    ├── navigation/
    │   └── RootNavigator.js             # Role-scoped screen routing & modal stacks
    ├── components/
    │   ├── BottomTabBar.js              # Custom floating bottom navigation tab bar
    │   ├── BrandLogo.js                 # LazyEye brand SVG/Vector component
    │   ├── CustomIcon.js                # Vector icons helper
    │   ├── GameWebView.js               # Embedded web game engine webview
    │   ├── HeaderBar.js                 # Top navigation with role badge & quick tools
    │   ├── MetricCard.js                # Polished KPI metric cards
    │   ├── HeatmapGrid.js               # 84-day interactive mobile therapy calendar
    │   └── Button.js                    # Reusable themed button variants
    └── screens/
        ├── auth/
        │   └── LoginScreen.js           # Login with 1-tap quick role switcher
        ├── doctor/
        │   ├── DoctorDashboardScreen.js # Scoped patient cohort dashboard
        │   ├── PatientDetailScreen.js   # Lens color & contrast calibration
        │   ├── HeatmapModalScreen.js    # 84-day activity drill-down modal
        │   └── NewConsultationScreen.js # Record clinical doctor evaluation
        ├── admin/
        │   ├── AdminDashboardScreen.js  # Clinic management & doctor roster
        │   └── RegistrationApprovalsScreen.js # Approve self-registered applicants
        ├── root/
        │   └── RootSuperadminScreen.js  # Master superadmin control & admin provisioning
        ├── patient/
        │   ├── PatientHomeScreen.js     # Daily regimen progress & game launcher
        │   ├── PatientOverviewScreen.js # Overview stats, acuity trends & announcements
        │   ├── DichopticTetrisGame.js   # Playable Dichoptic Tetris
        │   ├── DichopticSnakeGame.js    # Playable Dichoptic Snake with gesture control
        │   ├── CalibrationScreen.js     # Patient lens contrast sliders
        │   └── TherapyHistoryScreen.js  # History logs & doctor remarks
        └── shared/
            ├── ProfileScreen.js         # User info, avatar & theme selection
            └── SettingsThemeModal.js    # Settings & theme picker modal
```

---

## 🏃 Running the Application (React Native CLI)

### 1. Install Dependencies
```bash
cd d:\Abhishek_Projects\lazyEye_Mobile
npm.cmd install
```

### 2. Start Metro Bundler
```bash
npm.cmd start
```

### 3. Run on Android Device / Emulator
```bash
npm.cmd run android
```

### 4. Open in Android Studio
You can also open the `d:\Abhishek_Projects\lazyEye_Mobile\android` folder directly in Android Studio to build debug or signed release APKs (`./gradlew assembleRelease`).


