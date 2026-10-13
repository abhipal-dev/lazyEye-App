# File Structure & Codebase Inventory

This document details the complete file structure, directory organization, and component roles across **LazyEye Mobile**.

---

## Codebase Directory Tree

```
lazyEye_Mobile/
├── App.js                               # Root application component, Theme & Auth provider wiring
├── index.js                             # Metro entry point, registers LazyEyeMobile component
├── package.json                         # Project dependencies, scripts & postinstall hook
├── scripts/
│   ├── patch-modules.js                 # Automatic AGP 9.2 & Gradle 9.4.1 compatibility patcher
│   └── generate-brand-assets.ps1        # Standalone .NET brand icon & asset generator
├── docs/                                # Project documentation folder
│   ├── README.md                        # Documentation hub & quick start guide
│   ├── USER_LEVELS_AND_SECURITY.md      # User levels, role scopes, permissions & RBAC
│   ├── IMPLEMENTATION_CHANGELOG.md      # Technical changelog of all improvements
│   └── FILES_AND_ARCHITECTURE.md        # File inventory & component catalog
├── src/
│   ├── assets/
│   │   ├── avatars/                 # 8 Authentic clinical profile photos & avatars
│   │   │   ├── user_22_test1.jpg    # Authentic Abhishek Pal photo
│   │   │   ├── user_4_Screenshot... # Authentic Pranjal Agarwal photo
│   │   │   ├── user_6_0_default...  # Authentic Riya Jaiwal avatar
│   │   │   ├── user_11_0_default... # Authentic Abhishek Pal (user 11) avatar
│   │   │   ├── user_18_0_default... # Authentic Puneet Kushwaha avatar
│   │   │   ├── 0_default_female...  # Authentic female fallback avatar
│   │   │   ├── 0_default_male...    # Authentic male fallback avatar
│   │   │   └── default.png          # System administrator default avatar
│   │   ├── games/                   # 11 Dedicated clinical game mascot image assets
│   │   │   ├── snake.png            # Snake Macular Fixation icon
│   │   │   ├── flappy.png           # Flappy Bird Dual Flight icon
│   │   │   ├── menja.png            # Menja 3D Slicing icon
│   │   │   ├── tetris.png           # Tetris Fusion Alignment icon
│   │   │   ├── bubbleshooter.png    # Bubble Shooter Foveal Aim icon
│   │   │   ├── pingpong.png         # Ping-Pong 3D Dynamic Rally icon
│   │   │   ├── stickyholds.png      # Sticky Holds Cliff Agility icon
│   │   │   ├── maze.png             # Maze Labyrinth Mapping icon
│   │   │   ├── ballcatcher.jpeg     # Ball Catcher Visual Motor icon
│   │   │   ├── bouncingball.png     # Bouncing Ball Agility icon
│   │   │   └── bricksbreaker.jpeg   # Bricks Breaker Suppression Defeat icon
│   │   └── logo/
│   │       ├── lazyeye_icon.png         # Flat 512x512 logo icon asset
│   │       ├── lazyeye_header_logo.png  # Horizontal flat logo + wordmark asset
│   │       └── lazyeye_splash_logo.png  # Centered flat splash logo asset
│   ├── components/
│   │   ├── BottomTabBar.js              # TaxiMuscat-inspired tactile animated floating bottom navigation bar
│   │   ├── BrandLogo.js                 # Flexible flat brand logo renderer (icon & wordmark)
│   │   ├── Button.js                    # Contrast-bordered button with CustomIcon integration
│   │   ├── CustomIcon.js                # Universal vector icon wrapper for react-native-vector-icons
│   │   ├── GameWebView.js               # Reusable game WebView with gesture pass-through & edge-to-edge safe area
│   │   ├── HeaderBar.js                 # Top navigation bar with BrandLogo, role tag & real AvatarImage
│   │   ├── HeatmapGrid.js               # 84-day interactive activity heatmap component
│   │   ├── LoadingScreen.js             # Loading screen with gentle eye blink & pulse animation
│   │   ├── MetricCard.js                # Clinical KPI metric card with icon container & border
│   │   └── SplashScreen.js              # Plain centered flat splash screen
│   ├── context/
│   │   ├── AuthContext.js               # Authentication, user sessions, role switching & API token state
│   │   └── ThemeContext.js              # Theme provider, persistent palette selection & theme toggles
│   ├── navigation/
│   │   └── RootNavigator.js             # Multi-tab router, game launcher & modal manager
│   ├── screens/
│   │   ├── admin/
│   │   │   ├── AdminDashboardScreen.js        # Clinic Admin portal (patient & doctor directories)
│   │   │   └── RegistrationApprovalsScreen.js # Applicant review & onboarding approval queue
│   │   ├── auth/
│   │   │   └── LoginScreen.js                 # Clean authentication screen & 1-tap quick role switcher
│   │   ├── doctor/
│   │   │   ├── DoctorDashboardScreen.js       # Optometrist cohort dashboard & patient cards
│   │   │   ├── HeatmapModalScreen.js          # 84-day patient therapy intensity & progress modal
│   │   │   ├── NewConsultationScreen.js       # Doctor evaluation notes & compliance form
│   │   │   └── PatientDetailScreen.js         # Patient lens calibration & regimen prescription
│   │   ├── patient/
│   │   │   ├── CalibrationScreen.js           # Patient self-calibration for Red-Cyan anaglyph glasses
│   │   │   ├── DichopticSnakeGame.js          # Native fallback Snake game with safe-area insets
│   │   │   ├── DichopticTetrisGame.js         # Native fallback Tetris game with safe-area insets
│   │   │   ├── PatientHomeScreen.js           # 11 Clinical Dichoptic Vision Engines Catalog
│   │   │   ├── PatientOverviewScreen.js       # Daily dosage, streak, evidence cards & real metrics
│   │   │   └── TherapyHistoryScreen.js        # 84-day heatmap, gameplay logs & doctor remarks
│   │   ├── root/
│   │   │   └── RootSuperadminScreen.js        # Master root console & admin provisioning form
│   │   └── shared/
│   │       ├── ProfileScreen.js               # Account details, real avatar, engine switcher & logout
│   │       └── SettingsThemeModal.js          # High-contrast theme picker with color swatches
│   ├── services/
│   │   ├── api.js                       # Real SQLite backend data bridge & Render API client
│   │   ├── avatarHelper.js              # Authentic profile avatar resolution & AvatarImage component
│   │   ├── games.js                     # 11 Responsive HTML5 Canvas dichoptic vision engines registry
│   │   ├── mmkvStorage.js               # Zero-latency MMKV synchronous storage engine
│   │   ├── realData.json                # Authentic SQLite dump: 13 users, 593 game records, consultations
│   │   ├── realDataService.js           # Streak calculations, real dosage metrics & clinical cards
│   │   ├── settingsHandler.js           # Reactive MMKV settings manager (themes, engine, sound, goal)
│   │   └── storage.js                   # Persistent local storage adapter backed by MMKV
│   └── theme/
│       └── themes.js                    # 4 WCAG AA high-contrast themes & explicit border tokens
├── android/
│   ├── app/
│   │   ├── build.gradle                 # App module Gradle configuration
│   │   └── src/main/
│   │       ├── AndroidManifest.xml      # App permissions, activities & launcher icon references
│   │       ├── assets/
│   │       │   ├── fonts/               # 19 bundled react-native-vector-icons TTF font files
│   │       │   └── index.android.bundle # Precompiled production JavaScript bundle
│   │       └── res/
│   │           ├── drawable/            # ic_launcher_foreground.png (432x432 adaptive foreground)
│   │           ├── mipmap-anydpi-v26/   # Adaptive icon XMLs (ic_launcher.xml, ic_launcher_round.xml)
│   │           ├── mipmap-mdpi/         # Generated launcher icons (48x48)
│   │           ├── mipmap-hdpi/         # Generated launcher icons (72x72)
│   │           ├── mipmap-xhdpi/        # Generated launcher icons (96x96)
│   │           ├── mipmap-xxhdpi/       # Generated launcher icons (144x144)
│   │           ├── mipmap-xxxhdpi/      # Generated launcher icons (192x192)
│   │           └── values/colors.xml    # Adaptive icon background color (#0F172A)
│   ├── build.gradle                     # Top-level Gradle configuration (AGP 9.2.1)
│   └── gradle/wrapper/gradle-wrapper.properties # Gradle 9.4.1 binary distribution wrapper
└── ios/
    └── LazyEyeMobile/
        └── Images.xcassets/
            └── AppIcon.appiconset/
                └── AppIcon-1024.png     # Generated iOS 1024x1024 App Store icon
```

---

## Detailed File Directory & Descriptions

### Core & Entry Point
- **`App.js`**: Root React component. Wraps the app in `ThemeProvider` and `AuthProvider`, configures the reactive `StatusBar`, and renders the `RootNavigator`.
- **`index.js`**: Registers the main application component with the React Native AppRegistry.
- **`package.json`**: Defines dependencies (`react-native-vector-icons`, `react-native-webview`, etc.) and the `"postinstall": "node scripts/patch-modules.js"` hook.

---

### Components (`src/components/`)
- **`BrandLogo.js`**: Flexible logo component. Supports `icon` (centered mark) and `header` (mark + "LazyEye VISION THERAPY" wordmark) variants. Standardized size presets (`xs`, `sm`, `md`, `lg`, `xl`, `hero`).
- **`CustomIcon.js`**: Reusable icon component wrapping `react-native-vector-icons`. Supports `library`, `name`, `color`, `size`, `solid`, and graceful fallback to Feather `help-circle`.
- **`GameWebView.js`**: Reusable game host. Features gesture pass-through (`scrollEnabled={false}`, `bounces={false}`), responsive viewport (`meta viewport`), safe area insets, animated `LoadingScreen`, and a retry fallback state.
- **`LoadingScreen.js`**: Loading screen rendering the flat eye logo with a gentle periodic eyelid blink (`scaleY`) and soft pulse loop (`scale`), without heavy AI effects.
- **`SplashScreen.js`**: Clean splash screen displaying the flat brand logo centered on a plain background.
- **`HeaderBar.js`**: Standardized app header featuring `BrandLogo`, user role tag, screen title, subtitle, and action buttons for Theme and Profile.
- **`Button.js`**: Theme-aware button with built-in `CustomIcon` support, high-contrast borders, loading indicator, and variant styling (`primary`, `secondary`, `outline`, `danger`).
- **`MetricCard.js`**: Reusable clinical KPI card displaying title, big value, subtitle, and an icon enclosed in a rounded, bordered container.
- **`HeatmapGrid.js`**: 84-day (12-week) horizontal activity heatmap grid visualizing patient therapy intensity day-by-day.

---

### Screens (`src/screens/`)

#### Patient Screens (`src/screens/patient/`)
- **`PatientHomeScreen.js`**: Uncluttered patient landing page. Features greeting, daily regimen goal progress bar, single primary action ("Start Daily Session"), Red-Cyan glasses status, and prescribed game cards.
- **`CalibrationScreen.js`**: Interactive binocular suppression target allowing patients to fine-tune Left Eye (OS) and Right Eye (OD) chromatic filters and contrast levels.
- **`TherapyHistoryScreen.js`**: Personal therapy logs, total gameplay minutes, average scores, and supervising optometrist evaluations.

#### Doctor Screens (`src/screens/doctor/`)
- **`DoctorDashboardScreen.js`**: Optometrist landing page showing assigned patient cohort, clinical privacy banner, quick KPI metrics, and action buttons (Heatmap, Calibrate, Consult).
- **`HeatmapModalScreen.js`**: Interactive modal rendering the patient's 84-day therapy intensity heatmap, day filtering, and granular session logs.
- **`PatientDetailScreen.js`**: Clinical dual-eye fusion preview and prescription adjustment screen for Left Eye/Right Eye colors, contrast values (0–255), and daily regimen minutes.
- **`NewConsultationScreen.js`**: Clinical evaluation form allowing doctors to record therapy compliance ratings (Excellent, Good, Moderate, Low) and progress remarks.

#### Admin Screens (`src/screens/admin/`)
- **`AdminDashboardScreen.js`**: Clinic operations dashboard with metrics, patient directory tab, and optometrist directory tab.
- **`RegistrationApprovalsScreen.js`**: Applicant queue allowing administrators to review and approve/enroll pending patient registration requests.

#### Superadmin Screen (`src/screens/root/`)
- **`RootSuperadminScreen.js`**: Master root console. Displays platform authority banner, global platform KPIs, administrator provisioning form, and active administrator roster.

#### Authentication & Shared Screens (`src/screens/auth/` & `src/screens/shared/`)
- **`LoginScreen.js`**: Clean sign-in screen with flat `BrandLogo`, high-contrast inputs, connection status pill, and a verified 1-tap quick role switcher.
- **`ProfileScreen.js`**: User profile drawer displaying user credentials, active role badge, visual theme switcher, quick role switcher, and sign-out action.
- **`SettingsThemeModal.js`**: Modal allowing instant switching between all 4 high-contrast themes, featuring live palette color swatches and checkmark indicators.

---

### Services & Context (`src/services/` & `src/context/`)
- **`games.js`**: Central games registry. Houses responsive HTML5 Canvas engines for `Dichoptic Tetris` and `Dichoptic Snake`, dynamically accepting calibrated left/right eye colors. Adding a new game requires only adding a new entry here.
- **`api.js`**: Data layer handling user authentication, patient lists, doctor lists, calibrations, consultations, and 84-day activity heatmaps.
- **`storage.js`**: Local persistent key-value storage layer.
- **`AuthContext.js`**: Global authentication context managing login, logout, active user profile, and instant role switching.
- **`ThemeContext.js`**: Global theme context managing active theme selection, persistence, and dynamic palette tokens.

---

### Themes (`src/theme/`)
- **`themes.js`**: 4 WCAG AA high-contrast theme definitions (`cyberCyan`, `clinicalCrisp`, `anaglyphDichoptic`, `emeraldComfort`) equipped with explicit theme-level border tokens (`cardBorder`, `buttonBorder`, `iconContainerBorder`, `selectedBorder`).

---

### Build Scripts (`scripts/`)
- **`scripts/patch-modules.js`**: Automated postinstall script patching `react-native-webview` and `react-native-vector-icons` for Android Gradle Plugin 9.2+ compatibility.
- **`scripts/generate-brand-assets.ps1`**: PowerShell .NET `System.Drawing` script that renders pixel-perfect flat brand assets across all Android mipmap resolutions, adaptive icon foregrounds, and iOS AppIcon formats.

