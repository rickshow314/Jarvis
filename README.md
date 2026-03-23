# Jarvis 🤖

**Your AI-powered daily life organizer** — a modern mobile assistant app built with React Native + Expo that lets you manage tasks, calendar events, and your day through natural voice and text conversation.

---

## Features

- **AI Chat (voice & text)** — Talk or type to Jarvis powered by Gemini Flash 2.0. Add tasks, schedule events, and ask anything hands-free.
- **Smart Task Management** — AI auto-categorizes tasks (Work, Personal, Health, Errands) and surfaces overdue items proactively.
- **Smart Calendar** — Native Google/Apple Calendar integration with conflict detection and AI scheduling.
- **Daily Briefing** — Personalized morning briefing with weather, top tasks, and upcoming events read aloud.
- **Offline-Capable** — Core functionality works without internet; graceful degradation when AI is unavailable.
- **Privacy First** — All data stored locally on-device via SQLite. API keys stored in OS secure keychain. No cloud sync.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Language | TypeScript 5.4 |
| Navigation | Expo Router (file-based) |
| AI Backend | Google Gemini Flash 2.0 |
| Database | SQLite via Drizzle ORM |
| State | Zustand |
| Cache/Settings | react-native-mmkv |
| Animations | react-native-reanimated 3 |
| Voice | expo-speech + @react-native-voice/voice |
| Secrets | expo-secure-store (OS keychain) |
| Notifications | expo-notifications |
| Tests | Jest + React Native Testing Library + Detox |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Xcode) or Android Emulator (Android Studio), or the [Expo Go](https://expo.dev/go) app on your phone

### Install

```bash
git clone https://github.com/rickshow314/Jarvis.git
cd Jarvis
npm install
```

### Run

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `i` for iOS / `a` for Android simulator.

### Configure your Gemini API key

1. Get a free API key at [aistudio.google.com](https://aistudio.google.com)
2. Open the app → go to **Settings** tab
3. Paste your key in the **Gemini API Key** field and tap **Save Key**

The key is stored securely in the OS keychain — never in plain storage.

---

## 📱 Guía de instalación en móvil desde cero

### Paso 1 — Instala Node.js

Descarga e instala Node.js 20 LTS desde [nodejs.org](https://nodejs.org).  
Verifica: `node --version` debe mostrar `v20.x.x`

---

### Paso 2 — Instala las herramientas de desarrollo

```bash
npm install -g expo-cli
```

---

### Paso 3 — Clona el proyecto e instala dependencias

```bash
git clone https://github.com/rickshow314/Jarvis.git
cd Jarvis
npm install
```

---

### Paso 4 — Instala Expo Go en tu móvil

| Plataforma | Enlace |
|---|---|
| iPhone (iOS 16+) | [App Store — Expo Go](https://apps.apple.com/app/expo-go/id982107779) |
| Android (10+) | [Play Store — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) |

---

### Paso 5 — Arranca el servidor de desarrollo

```bash
npx expo start
```

Aparecerá un **código QR** en la terminal.

- **iPhone**: abre la app de Cámara, apunta al QR → toca la notificación que aparece.
- **Android**: abre Expo Go → toca "Scan QR code" → apunta al QR.

> ⚠️ El móvil y el ordenador deben estar **en la misma red Wi-Fi**.

---

### Paso 6 — Configura la API key de Gemini (OBLIGATORIO para que funcione la IA)

Sin este paso el chat de Jarvis no responderá.

1. Ve a [aistudio.google.com](https://aistudio.google.com) e inicia sesión con tu cuenta Google.
2. Clica **"Get API key"** → **"Create API key"** → copia la clave (empieza por `AIza...`).
3. Abre Jarvis en el móvil → pestaña **Settings**.
4. Pega la clave en el campo **"Gemini API Key"** → toca **Save Key**.

---

### Paso 7 — Concede los permisos necesarios

La primera vez que uses cada función, el sistema pedirá permisos:

| Permiso | ¿Para qué? | ¿Cuándo se pide? |
|---|---|---|
| **Micrófono** | Entrada de voz al pulsar el icono del mic | Al intentar hablar por primera vez |
| **Notificaciones** | Briefing mañanero | Al configurar la hora en Settings |
| **Calendario** | Leer/crear eventos en tu calendario nativo | Al usar la función de calendario |

> Si rechazas un permiso por error, ve a **Ajustes del móvil → Aplicaciones → Expo Go → Permisos** para reactivarlo.

---

## ⚠️ Qué falta configurar / limitaciones actuales

### Funcional ahora mismo (sin configuración extra)
- ✅ Chat de texto con Gemini (solo necesita la API key)
- ✅ Gestor de tareas manual
- ✅ Ajustes y almacenamiento local

### Requiere configuración adicional

| Función | Estado | Qué hay que hacer |
|---|---|---|
| **Voz (hablar con Jarvis)** | ⚠️ Limitado en Expo Go | Funciona TTS (Jarvis habla). STT (tú hablas) requiere un **build nativo**: `npx expo prebuild && npx expo run:android` o `run:ios` |
| **Integración calendario nativo** | ⚠️ Requiere permisos + `expo prebuild` | En Expo Go las API de calendario están disponibles pero algunas funciones avanzadas necesitan build nativo |
| **Notificaciones push (briefing)** | ⚠️ Parcial en Expo Go | Las notificaciones locales funcionan; las push remotas requieren configurar un proyecto en [expo.dev](https://expo.dev) |
| **Widget de pantalla de inicio** | ❌ No disponible aún | Requiere build nativo + configurar App Group (iOS) o ContentProvider (Android) — roadmap v2 |
| **Dark mode** | ⚠️ Parcial — sigue el sistema | El switch en Settings funciona pero algunos componentes aún ignoran el tema |

### Build nativo (para funcionalidad completa)

Si quieres todas las funciones sin limitaciones, necesitas hacer un build nativo local:

**Android:**
```bash
# Requiere Android Studio instalado
npx expo prebuild --platform android
npx expo run:android
```

**iOS (solo en Mac):**
```bash
# Requiere Xcode instalado
npx expo prebuild --platform ios
npx expo run:ios
```

O usa [EAS Build](https://expo.dev/eas) (servicio en la nube de Expo) para generar el APK/IPA sin necesitar las herramientas nativas instaladas:
```bash
npm install -g eas-cli
eas build --platform android   # genera un APK instalable
```

---

## Project Structure

```
jarvis-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Chat screen (main)
│   │   ├── two.tsx          # Tasks screen
│   │   └── settings.tsx     # Settings screen
│   └── _layout.tsx
├── src/
│   ├── ai/                  # Gemini client + prompt builder
│   ├── db/                  # Drizzle schema + repositories
│   ├── services/            # Voice, Calendar, Briefing, Notifications
│   ├── store/               # Zustand stores (chat, tasks, settings)
│   ├── components/          # UI components (chat, tasks, calendar)
│   ├── hooks/               # useNetworkStatus
│   └── utils/               # secureStorage wrapper
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/                 # Detox
```

---

## Architecture Principles

This project follows a **spec-driven development** approach using [spec-kit](https://github.com/github/spec-kit):

1. **Conversational AI First** — every feature is reachable via voice or text
2. **Privacy by Default** — local-only data, no telemetry, secrets in keychain
3. **Test-First (TDD)** — tests written before implementation
4. **Offline-Capable Core** — never crashes without network
5. **Simplicity & YAGNI** — no over-engineering, MVP first

See `.specify/templates/` for the full Constitution, Specification, and Implementation Plan.

---

## Roadmap

- [ ] Home screen widgets (iOS + Android)
- [ ] Recurring tasks & events
- [ ] Multiple AI provider support (OpenAI, local models)
- [ ] Dark mode polish
- [ ] App Store / Play Store release

---

## License

MIT
