# Pre-Hackathon Setup Checklist

> **[POST-HACKATHON UPDATE]** This checklist was prepared for P11 "Cocoon" (autism meltdown prediction). The team built **P09 "Medak"** instead with a different tech stack. Key differences:
> - **GCP project:** `medak-hackathon` (not `cocoon-hackathon`)
> - **Frontend:** React Native / Expo 54 (not Flutter/Kotlin/Android native)
> - **Backend:** FastAPI + `uv` package manager (not pip + Firebase Admin)
> - **Database:** Redis only (not Firebase Firestore)
> - **AI:** Gemini 2.0 Flash Live sessions via `google-genai` (not Vertex AI time-series)
> - **No Health Connect, Wear OS, or sensor monitoring** — Medak uses mic/camera/GPS for emergency triage
>
> Sections that remain useful regardless: Gemini API setup, Twilio setup, Docker basics, Git workflow, verification approach.
> For the actual Medak setup, see `medak/.env.example` and `medak/CLAUDE.md`.

> **Do ALL of this the evening before or morning of the hackathon.**
> Every minute saved on setup = more time building the actual product.
> Assign owners (Person A/B/C/D) and parallelize.

---

## 1. Accounts & API Keys (Get These NOW)

> ⏱ Estimated time: 30–45 min (do in parallel across team)

### 1.1 Google Cloud Project

- [ ] **Person A:** Go to https://console.cloud.google.com/
- [ ] Create project named `cocoon-hackathon`
- [ ] Note the **Project ID** (e.g., `cocoon-hackathon-123456`)
- [ ] Enable billing (free tier is fine — set a $5 budget alert just in case)

```
# After creating the project, set it as default in gcloud CLI
gcloud config set project cocoon-hackathon-123456
```

### 1.2 Gemini API Key (Free Tier)

- [ ] Go to https://aistudio.google.com/apikey
- [ ] Click "Create API Key" → select `cocoon-hackathon` project
- [ ] Copy key → store in team's shared `.env` (NEVER commit this)

**Free tier limits (as of March 2026):**
| Model | RPM | RPD | TPM |
|---|---|---|---|
| gemini-2.0-flash | 15 | 1,500 | 1,000,000 |
| gemini-2.5-pro | 5 | 25 | 25,000 |

> 💡 **Tip:** Use `gemini-2.0-flash` for real-time sensor analysis (faster, higher limits). Reserve `gemini-2.5-pro` for complex multi-agent reasoning only.

**Quick verification:**
```bash
export GEMINI_API_KEY="your-key-here"
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}'
```

### 1.3 Google Maps Platform API Key

- [ ] Go to https://console.cloud.google.com/apis/library
- [ ] Enable these APIs for the `cocoon-hackathon` project:
  - **Places API (New)** — for finding calm spaces
  - **Maps SDK for Android** — for map display
  - **Geocoding API** — for address resolution
- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Create API Key → restrict to the 3 APIs above
- [ ] For Android restriction: add your debug SHA-1 fingerprint:

```bash
# Get your debug keystore SHA-1 (run on each dev machine)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep SHA1
```

> ⚠️ **For hackathon speed:** Skip API key restrictions initially. Add them later if you have time. An unrestricted key works everywhere.

### 1.4 Twilio Account + Phone Number

- [ ] **Person B:** Sign up at https://www.twilio.com/try-twilio
- [ ] Verify your phone number
- [ ] Get a trial phone number (free — comes with $15 trial credit)
- [ ] Note these from https://console.twilio.com/:
  - `TWILIO_ACCOUNT_SID` (starts with `AC...`)
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER` (e.g., `+1234567890`)

**Quick verification:**
```bash
# Send a test SMS (trial accounts can only send to verified numbers)
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" \
  --data-urlencode "Body=Cocoon test alert: Everything is set up!" \
  --data-urlencode "From=$TWILIO_PHONE_NUMBER" \
  --data-urlencode "To=+YOUR_VERIFIED_NUMBER" \
  -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"
```

> ⚠️ **Trial limitation:** Can only send SMS to verified numbers. For the demo, verify the demo phone number in advance at https://console.twilio.com/us1/develop/phone-numbers/manage/verified

### 1.5 Firebase Project

- [ ] **Person A** (same person doing GCP — it's the same console):
- [ ] Go to https://console.firebase.google.com/
- [ ] "Add project" → select existing `cocoon-hackathon` GCP project
- [ ] Enable **Authentication** → Sign-in method → Email/Password (toggle ON)
- [ ] Enable **Cloud Firestore** → Create database → Start in **test mode** → choose `us-central1`
- [ ] Download `google-services.json`:
  - Project Settings → Your apps → Add Android app
  - Package name: `com.cocoon.app`
  - App nickname: `Cocoon`
  - Debug signing SHA-1: (use the keytool command from 1.3 above)
  - Download `google-services.json` → place in `android/app/` directory

### 1.6 Master `.env` File

Create this file and share it securely with the team (Signal message, NOT Slack/email):

```bash
# .env — Cocoon Hackathon Secrets
# ⚠️ DO NOT COMMIT THIS FILE

# Gemini
GEMINI_API_KEY=AIza...

# Google Maps
GOOGLE_MAPS_API_KEY=AIza...

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Firebase (backend admin)
FIREBASE_PROJECT_ID=cocoon-hackathon-123456

# Redis (local docker)
REDIS_URL=redis://localhost:6379
```

---

## 2. Development Environment

> ⏱ Estimated time: 20–60 min per laptop (depends on download speeds)

### 2.1 Android Studio (All 4 Laptops)

- [ ] Download **Android Studio Meerkat (2024.3.1)** or latest stable: https://developer.android.com/studio
- [ ] During install, ensure these are checked:
  - Android SDK Platform 35 (Android 15)
  - Android SDK Build-Tools 35.0.0
  - Android SDK Command-line Tools
  - Android Emulator
  - Android SDK Platform-Tools

**Post-install SDK check:**
```bash
# Verify SDK installation
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list_installed

# Install anything missing
sdkmanager "platforms;android-35" "build-tools;35.0.0" "platform-tools"
```

**Minimum SDK targets for Cocoon:**
- `minSdk = 28` (Android 9 — needed for foreground services)
- `targetSdk = 35` (Android 15 — latest)
- `compileSdk = 35`

### 2.2 Kotlin + Jetpack Compose

Android Studio Meerkat ships with Kotlin 2.0+ and Compose support. Verify:
- [ ] File → Settings → Languages & Frameworks → Kotlin → ensure plugin is up to date
- [ ] When creating a new project: select "Empty Activity" (Compose template)

### 2.3 Python Backend Environment

```bash
# Install Python 3.11+ (all backend devs)
python3 --version  # Should be 3.11+

# If not installed:
# macOS:
brew install python@3.12

# Ubuntu/Debian:
sudo apt update && sudo apt install python3.12 python3.12-venv python3.12-dev

# Create the backend project venv
mkdir -p cocoon-backend && cd cocoon-backend
python3 -m venv .venv
source .venv/bin/activate
```

### 2.4 Docker + Docker Compose

```bash
# Verify installation
docker --version        # 24.0+ recommended
docker compose version  # v2.20+ (note: "docker compose" not "docker-compose")

# If not installed:
# macOS: Install Docker Desktop from https://www.docker.com/products/docker-desktop
# Linux:
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER  # Then log out/in
```

**Pre-pull images to save time at hackathon:**
```bash
docker pull redis:7-alpine
docker pull python:3.12-slim
```

### 2.5 Useful CLI Tools

```bash
# Install on all machines
pip install httpie          # Better curl for API testing
brew install jq             # JSON processor (macOS)
# or: sudo apt install jq   # Linux
```

---

## 3. Dependencies Pre-Installed

> ⏱ Estimated time: 15–20 min (while other setup runs)

### 3.1 Android Gradle Dependencies

Add to your `app/build.gradle.kts`:

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    id("com.google.gms.google-services")  // Firebase
    kotlin("plugin.serialization") version "2.0.21"
}

android {
    namespace = "com.cocoon.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.cocoon.app"
        minSdk = 28
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    // === Core Android + Compose ===
    implementation(platform("androidx.compose:compose-bom:2025.01.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // === Health Connect (Wearable/Health Sensor Data) ===
    implementation("androidx.health.connect:connect-client:1.1.0-alpha10")

    // === Google Maps ===
    implementation("com.google.maps.android:maps-compose:6.2.1")
    implementation("com.google.android.gms:play-services-maps:19.0.0")
    implementation("com.google.android.gms:play-services-location:21.3.0")
    implementation("com.google.android.libraries.places:places:4.1.0")

    // === Firebase ===
    implementation(platform("com.google.firebase:firebase-bom:33.7.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")

    // === Charts (Vico) ===
    implementation("com.patrykandpatrick.vico:compose-m3:2.0.1")

    // === Networking ===
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-kotlinx-serialization:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")

    // === Sensor Access ===
    implementation("com.google.android.gms:play-services-awareness:19.1.0")

    // === Background Work ===
    implementation("androidx.work:work-runtime-ktx:2.10.0")

    // === DataStore (local preferences) ===
    implementation("androidx.datastore:datastore-preferences:1.1.1")

    // === Testing ===
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
```

Add to your **project-level** `build.gradle.kts`:

```kotlin
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    id("com.google.gms.google-services") version "4.4.2" apply false
}
```

**Pre-build to download all dependencies:**
```bash
cd android-project
./gradlew assembleDebug  # This downloads everything — do it on good Wi-Fi!
```

### 3.2 Python Backend Dependencies

```bash
# requirements.txt
cat > requirements.txt << 'EOF'
# Core framework
fastapi==0.115.6
uvicorn[standard]==0.34.0
python-dotenv==1.0.1

# Google AI
google-genai==1.5.0
google-adk==0.5.0

# Data & State
redis==5.2.1
pydantic==2.10.4

# Twilio SMS
twilio==9.4.0

# Firebase Admin
firebase-admin==6.6.0

# Utilities
httpx==0.28.1
python-multipart==0.0.20
websockets==14.1
EOF

# Install everything
pip install -r requirements.txt
```

**Verify critical imports:**
```bash
python3 -c "
import fastapi; print(f'FastAPI: {fastapi.__version__}')
import google.genai; print('google-genai: OK')
import google.adk; print('google-adk: OK')
import redis; print(f'Redis client: {redis.__version__}')
import twilio; print(f'Twilio: {twilio.__version__}')
import firebase_admin; print(f'Firebase Admin: {firebase_admin.__version__}')
print('✅ All imports successful!')
"
```

### 3.3 Docker Compose for Backend Services

```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app  # Hot reload during development
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

volumes:
  redis_data:
```

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Pre-build to cache layers:**
```bash
docker compose build
docker compose up -d redis  # Start Redis, verify it works
docker compose down
```

---

## 4. Hardware Checklist

> ⏱ Charge everything the night before!

### 4.1 Required

- [ ] **Android phone for demo** (at least one, ideally two)
  - Must have: accelerometer, microphone, GPS
  - Android 9+ (API 28+)
  - **Enable Developer Options:** Settings → About Phone → tap "Build Number" 7 times
  - **Enable USB Debugging:** Settings → Developer Options → USB Debugging → ON
  - Install phone on at least one laptop and verify `adb devices` shows it
  - **Good choices:** Any Pixel (3+), Samsung Galaxy S/A series (2019+)

```bash
# Verify phone connection
adb devices
# Should show your device serial number with "device" status
```

- [ ] **USB-C cable** (data-capable, not charge-only!)
- [ ] **4 laptops** with Android Studio installed (see Section 2)
- [ ] **Power strips / extension cords** (hackathon venues never have enough outlets)

### 4.2 Strongly Recommended

- [ ] **Smartwatch with Health Connect** for wearable demo
  - Best: Samsung Galaxy Watch 4/5/6 (native Health Connect support)
  - Install Health Connect app on paired phone: https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata
  - Pair watch → verify heart rate data syncs to Health Connect

- [ ] **Laptop with decent microphone** for noise-level testing
  - The built-in mic works, but a USB condenser mic makes the demo more convincing
  - Test: record ambient noise, play loud sounds, verify decibel readings change

- [ ] **External monitor or projector adapter** for demo presentation
  - USB-C to HDMI adapter (most hackathon projectors are HDMI)
  - Test the adapter works BEFORE the event

- [ ] **Portable battery pack** (phones die fast when running sensors continuously)

### 4.3 Nice to Have

- [ ] Bluetooth speaker (to play simulated overload sounds during demo)
- [ ] Extra phone as a "caregiver device" to receive SMS alerts live
- [ ] Whiteboard markers (for impromptu architecture discussions)

---

## 5. Git Setup

> ⏱ Estimated time: 15 min

### 5.1 Create Repository

```bash
# Create on GitHub (or use gh CLI)
gh repo create cocoon-app --private --clone
cd cocoon-app

# Initialize structure
mkdir -p android backend docs assets
touch android/.gitkeep backend/.gitkeep docs/.gitkeep
```

### 5.2 `.gitignore`

```bash
cat > .gitignore << 'GITIGNORE'
# === Android ===
*.iml
.gradle/
/local.properties
/.idea/
.DS_Store
/build/
/captures
.externalNativeBuild/
.cxx/
android/app/google-services.json

# === Python Backend ===
__pycache__/
*.py[cod]
*$py.class
.venv/
*.egg-info/
dist/
.eggs/

# === Environment & Secrets ===
.env
.env.*
!.env.example
*.key
*.pem

# === IDE ===
.vscode/
*.swp
*.swo

# === Docker ===
docker-compose.override.yml

# === OS ===
.DS_Store
Thumbs.db
GITIGNORE

git add .gitignore
git commit -m "chore: initial project structure"
```

### 5.3 Branch Strategy

Keep it simple for a 48h hackathon — avoid heavyweight gitflow:

```
main                    ← stable, demo-ready at all times
├── feat/android-ui     ← Person A: screens + navigation
├── feat/sensor-service ← Person B: foreground service + sensor collection
├── feat/backend-agents ← Person C: FastAPI + ADK agents
└── feat/integrations   ← Person D: Maps, Twilio, Firebase auth
```

**Rules:**
1. `main` must always compile and run
2. Each person works on their own branch
3. Merge to `main` via quick PRs (or just merge if it's 3 AM and you're desperate)
4. Communicate before editing shared files (`AndroidManifest.xml`, `build.gradle.kts`)

```bash
# Each person creates their branch
git checkout -b feat/android-ui       # Person A
git checkout -b feat/sensor-service   # Person B
git checkout -b feat/backend-agents   # Person C
git checkout -b feat/integrations     # Person D
```

### 5.4 `.env.example` (commit this, NOT `.env`)

```bash
cat > .env.example << 'EOF'
GEMINI_API_KEY=your-gemini-key
GOOGLE_MAPS_API_KEY=your-maps-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
FIREBASE_PROJECT_ID=your-project-id
REDIS_URL=redis://localhost:6379
EOF

git add .env.example
git commit -m "chore: add env example"
```

### 5.5 CI/CD (Optional — Impressive for Judges)

If you have 10 spare minutes, add a GitHub Actions workflow:

```yaml
# .github/workflows/build.yml
name: Build Check
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  android-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
      - name: Build Android
        working-directory: ./android
        run: ./gradlew assembleDebug

  backend-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Install & check backend
        working-directory: ./backend
        run: |
          pip install -r requirements.txt
          python -c "from main import app; print('FastAPI app loads OK')"
```

---

## 6. Templates & Boilerplate

> 🔥 This is the highest-value section. Copy-paste these during the hackathon.

### 6.1 Android Foreground Service (Sensor Monitoring)

This is the backbone — it keeps sensor collection running in the background.

**`SensorMonitorService.kt`:**
```kotlin
package com.cocoon.app.service

import android.app.*
import android.content.Intent
import android.content.pm.ServiceInfo
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.cocoon.app.R
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.math.log10
import kotlin.math.sqrt

class SensorMonitorService : Service(), SensorEventListener {

    companion object {
        const val CHANNEL_ID = "cocoon_monitoring"
        const val NOTIFICATION_ID = 1001
        const val TAG = "CocoonSensor"

        private val _sensorData = MutableStateFlow(SensorSnapshot())
        val sensorData = _sensorData.asStateFlow()
    }

    data class SensorSnapshot(
        val accelerometerMagnitude: Float = 0f,
        val noiseDecibels: Double = 0.0,
        val lightLevel: Float = 0f,
        val timestamp: Long = System.currentTimeMillis()
    )

    private lateinit var sensorManager: SensorManager
    private var audioRecord: AudioRecord? = null
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    private var currentAccelMagnitude = 0f
    private var currentLight = 0f

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildNotification()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                NOTIFICATION_ID, notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE or
                ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        startSensorListening()
        startNoiseMonitoring()
        return START_STICKY
    }

    private fun startSensorListening() {
        // Accelerometer — detect movement/agitation
        sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
        // Light sensor — detect environment brightness
        sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT)?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
    }

    private fun startNoiseMonitoring() {
        scope.launch {
            try {
                val bufferSize = AudioRecord.getMinBufferSize(
                    44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT
                )
                audioRecord = AudioRecord(
                    MediaRecorder.AudioSource.MIC, 44100,
                    AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize
                )
                audioRecord?.startRecording()
                val buffer = ShortArray(bufferSize)

                while (isActive) {
                    val read = audioRecord?.read(buffer, 0, bufferSize) ?: 0
                    if (read > 0) {
                        val rms = sqrt(buffer.take(read).map { it.toDouble() * it.toDouble() }.average())
                        val db = if (rms > 0) 20 * log10(rms) else 0.0
                        updateSnapshot(noiseDb = db)
                    }
                    delay(500) // Sample every 500ms
                }
            } catch (e: SecurityException) {
                Log.e(TAG, "Microphone permission not granted", e)
            }
        }
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                val (x, y, z) = event.values
                currentAccelMagnitude = sqrt(x * x + y * y + z * z)
                updateSnapshot(accelMag = currentAccelMagnitude)
            }
            Sensor.TYPE_LIGHT -> {
                currentLight = event.values[0]
                updateSnapshot(light = currentLight)
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    private fun updateSnapshot(
        accelMag: Float? = null,
        noiseDb: Double? = null,
        light: Float? = null
    ) {
        val current = _sensorData.value
        _sensorData.value = current.copy(
            accelerometerMagnitude = accelMag ?: current.accelerometerMagnitude,
            noiseDecibels = noiseDb ?: current.noiseDecibels,
            lightLevel = light ?: current.lightLevel,
            timestamp = System.currentTimeMillis()
        )
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Cocoon Active")
            .setContentText("Monitoring environment for your safety")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID, "Cocoon Monitoring",
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "Background sensor monitoring for meltdown prevention"
        }
        getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(this)
        audioRecord?.stop()
        audioRecord?.release()
        scope.cancel()
    }
}
```

**Required in `AndroidManifest.xml`:**
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.BODY_SENSORS" />
    <uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
    <uses-permission android:name="android.permission.health.READ_HEART_RATE" />
    <uses-permission android:name="android.permission.health.READ_STEPS" />

    <application ...>

        <service
            android:name=".service.SensorMonitorService"
            android:foregroundServiceType="microphone|location"
            android:exported="false" />

        <!-- Health Connect intent filter for permissions -->
        <activity
            android:name=".HealthConnectPermissionsActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
            </intent-filter>
        </activity>

    </application>
</manifest>
```

### 6.2 ADK Agent Skeleton (Python Backend)

**`backend/agents/meltdown_predictor.py`:**
```python
"""
Cocoon Meltdown Prediction Agent using Google ADK.
This agent analyzes sensor data and predicts meltdown risk.
"""
import json
from google import genai
from google.genai import types
from google.adk import Agent, Runner
from google.adk.sessions import InMemorySessionService

# Initialize Gemini client
client = genai.Client()

# Define the meltdown risk assessment tool
def assess_risk(
    noise_db: float,
    accelerometer_magnitude: float,
    light_level: float,
    heart_rate: float | None = None,
    time_in_environment_minutes: int = 0,
    known_triggers: list[str] | None = None,
) -> dict:
    """Assess meltdown risk based on current sensor readings.

    Args:
        noise_db: Current ambient noise level in decibels
        accelerometer_magnitude: Movement intensity (g-force magnitude)
        light_level: Ambient light in lux
        heart_rate: Current heart rate in BPM (if available from wearable)
        time_in_environment_minutes: How long user has been in current environment
        known_triggers: List of user's known sensory triggers

    Returns:
        Risk assessment with level, contributing factors, and recommendations
    """
    risk_score = 0
    factors = []

    # Noise analysis
    if noise_db > 85:
        risk_score += 35
        factors.append(f"High noise: {noise_db:.0f}dB (threshold: 85dB)")
    elif noise_db > 70:
        risk_score += 20
        factors.append(f"Moderate noise: {noise_db:.0f}dB")

    # Movement/agitation analysis
    if accelerometer_magnitude > 15:
        risk_score += 25
        factors.append(f"High agitation detected: {accelerometer_magnitude:.1f}g")
    elif accelerometer_magnitude > 12:
        risk_score += 15
        factors.append(f"Elevated movement: {accelerometer_magnitude:.1f}g")

    # Light analysis
    if light_level > 10000:
        risk_score += 15
        factors.append(f"Very bright environment: {light_level:.0f} lux")

    # Heart rate (if available)
    if heart_rate and heart_rate > 100:
        risk_score += 20
        factors.append(f"Elevated heart rate: {heart_rate:.0f} BPM")

    # Time-based escalation
    if time_in_environment_minutes > 30 and risk_score > 30:
        risk_score += 10
        factors.append(f"Extended exposure: {time_in_environment_minutes} min")

    # Determine risk level
    if risk_score >= 70:
        level = "HIGH"
    elif risk_score >= 40:
        level = "MODERATE"
    else:
        level = "LOW"

    return {
        "risk_level": level,
        "risk_score": min(risk_score, 100),
        "contributing_factors": factors,
        "recommendation": _get_recommendation(level),
    }


def _get_recommendation(level: str) -> str:
    recommendations = {
        "HIGH": "🚨 Immediate action recommended. Move to a quiet, dimly-lit space. Use noise-cancelling headphones. Alert caregiver.",
        "MODERATE": "⚠️ Environment is becoming stressful. Consider relocating soon. Take a sensory break.",
        "LOW": "✅ Environment is comfortable. Continue monitoring.",
    }
    return recommendations.get(level, "Continue monitoring.")


# Create the ADK agent
meltdown_agent = Agent(
    model="gemini-2.0-flash",
    name="cocoon_meltdown_predictor",
    description="Predicts autism meltdown risk from sensor data and recommends calming actions",
    instruction="""You are Cocoon's meltdown prediction agent. Your role is to:

1. Analyze sensor data (noise, movement, light, heart rate) using the assess_risk tool
2. Provide empathetic, actionable guidance
3. When risk is HIGH, be urgent but calm — never alarmist
4. Suggest specific nearby calm spaces when possible
5. Track patterns over time to improve predictions

Always call assess_risk first with the sensor data, then interpret the results
for the user in a supportive, clear way. Use simple language.

Remember: You're helping someone who may be in distress. Be kind.""",
    tools=[assess_risk],
)


# Session management
session_service = InMemorySessionService()


async def analyze_sensors(user_id: str, sensor_data: dict) -> dict:
    """Main entry point for sensor analysis."""
    runner = Runner(
        agent=meltdown_agent,
        app_name="cocoon",
        session_service=session_service,
    )

    session = await session_service.get_session(
        app_name="cocoon", user_id=user_id
    )
    if not session:
        session = await session_service.create_session(
            app_name="cocoon", user_id=user_id
        )

    prompt = f"""Analyze these current sensor readings:
- Noise level: {sensor_data.get('noise_db', 0):.1f} dB
- Movement intensity: {sensor_data.get('accelerometer_magnitude', 0):.1f}
- Light level: {sensor_data.get('light_level', 0):.0f} lux
- Heart rate: {sensor_data.get('heart_rate', 'unavailable')} BPM
- Time in environment: {sensor_data.get('time_minutes', 0)} minutes

Assess the risk and provide guidance."""

    response = await runner.run_async(
        session_id=session.id,
        user_id=user_id,
        new_message=types.Content(
            role="user", parts=[types.Part(text=prompt)]
        ),
    )

    # Extract the final text response
    final_text = ""
    async for event in response:
        if event.text:
            final_text += event.text

    return {
        "analysis": final_text,
        "sensor_data": sensor_data,
        "session_id": session.id,
    }
```

### 6.3 FastAPI Backend Skeleton

**`backend/main.py`:**
```python
"""Cocoon Backend — FastAPI + ADK Agents + Twilio Alerts"""
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis.asyncio as redis
from twilio.rest import Client as TwilioClient

load_dotenv()

# Redis client (initialized in lifespan)
redis_client: redis.Redis | None = None

# Twilio client
twilio_client = TwilioClient(
    os.getenv("TWILIO_ACCOUNT_SID"),
    os.getenv("TWILIO_AUTH_TOKEN"),
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global redis_client
    redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
    yield
    if redis_client:
        await redis_client.close()


app = FastAPI(
    title="Cocoon API",
    description="Meltdown prediction & safe space finder for autism support",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hackathon mode — restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Models ===

class SensorData(BaseModel):
    noise_db: float = 0.0
    accelerometer_magnitude: float = 0.0
    light_level: float = 0.0
    heart_rate: float | None = None
    time_minutes: int = 0
    latitude: float | None = None
    longitude: float | None = None


class AlertRequest(BaseModel):
    caregiver_phone: str
    user_name: str
    risk_level: str
    message: str


class RiskResponse(BaseModel):
    risk_level: str
    risk_score: int
    analysis: str
    contributing_factors: list[str]
    recommendation: str


# === Endpoints ===

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "cocoon-api"}


@app.post("/api/v1/analyze", response_model=RiskResponse)
async def analyze_sensors(data: SensorData):
    """Analyze sensor data and return meltdown risk assessment."""
    from agents.meltdown_predictor import analyze_sensors as run_analysis

    try:
        result = await run_analysis(
            user_id="demo-user",
            sensor_data=data.model_dump(),
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/alert")
async def send_alert(alert: AlertRequest):
    """Send SMS alert to caregiver via Twilio."""
    try:
        message = twilio_client.messages.create(
            body=f"🦋 Cocoon Alert — {alert.user_name}\n\n"
                 f"Risk Level: {alert.risk_level}\n"
                 f"{alert.message}\n\n"
                 f"Please check in with them.",
            from_=os.getenv("TWILIO_PHONE_NUMBER"),
            to=alert.caregiver_phone,
        )
        return {"status": "sent", "message_sid": message.sid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/sensor-history")
async def store_sensor_reading(data: SensorData):
    """Store sensor reading in Redis for pattern analysis."""
    import json, time
    if redis_client:
        key = f"sensors:demo-user:{int(time.time())}"
        await redis_client.setex(key, 3600, json.dumps(data.model_dump()))  # TTL: 1 hour
        return {"status": "stored", "key": key}
    raise HTTPException(status_code=503, detail="Redis not available")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
```

### 6.4 Gemini Structured Output Wrapper

Useful for getting JSON responses from Gemini without ADK overhead:

**`backend/utils/gemini_structured.py`:**
```python
"""Lightweight Gemini wrapper for structured JSON responses."""
import json
import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def gemini_json(
    prompt: str,
    schema: dict | None = None,
    model: str = "gemini-2.0-flash",
) -> dict:
    """Get a structured JSON response from Gemini.

    Args:
        prompt: The prompt to send
        schema: Optional JSON schema for the response
        model: Model to use (default: gemini-2.0-flash for speed)

    Returns:
        Parsed JSON dict from the model
    """
    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        temperature=0.2,
    )

    if schema:
        config.response_schema = schema

    response = await client.aio.models.generate_content(
        model=model,
        contents=prompt,
        config=config,
    )

    return json.loads(response.text)


# Example usage for calm space recommendations:
CALM_SPACE_SCHEMA = {
    "type": "object",
    "properties": {
        "spaces": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "type": {"type": "string", "enum": ["park", "library", "quiet_cafe", "rest_area", "other"]},
                    "why_calming": {"type": "string"},
                    "estimated_noise_level": {"type": "string", "enum": ["very_quiet", "quiet", "moderate"]},
                },
                "required": ["name", "type", "why_calming"],
            },
        },
        "immediate_actions": {
            "type": "array",
            "items": {"type": "string"},
        },
    },
    "required": ["spaces", "immediate_actions"],
}
```

### 6.5 Health Connect Permission Flow

**`HealthConnectManager.kt`:**
```kotlin
package com.cocoon.app.health

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Instant
import java.time.temporal.ChronoUnit

class HealthConnectManager(private val context: Context) {

    private val client by lazy { HealthConnectClient.getOrCreate(context) }

    // Permissions to request
    val permissions = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(StepsRecord::class),
    )

    suspend fun hasAllPermissions(): Boolean {
        val granted = client.permissionController.getGrantedPermissions()
        return granted.containsAll(permissions)
    }

    suspend fun readLatestHeartRate(): Double? {
        return try {
            val response = client.readRecords(
                ReadRecordsRequest(
                    recordType = HeartRateRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(
                        Instant.now().minus(5, ChronoUnit.MINUTES),
                        Instant.now()
                    )
                )
            )
            response.records
                .flatMap { it.samples }
                .maxByOrNull { it.time }
                ?.beatsPerMinute
                ?.toDouble()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun readStepsLast30Min(): Long {
        return try {
            val response = client.readRecords(
                ReadRecordsRequest(
                    recordType = StepsRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(
                        Instant.now().minus(30, ChronoUnit.MINUTES),
                        Instant.now()
                    )
                )
            )
            response.records.sumOf { it.count }
        } catch (e: Exception) {
            0L
        }
    }
}
```

**In your Activity/Composable, request permissions:**
```kotlin
// In your MainActivity or a setup screen
val healthConnectManager = HealthConnectManager(context)
val permissionLauncher = rememberLauncherForActivityResult(
    contract = PermissionController.createRequestPermissionResultContract()
) { grantedPermissions ->
    if (grantedPermissions.containsAll(healthConnectManager.permissions)) {
        // Permissions granted — start reading data
    }
}

LaunchedEffect(Unit) {
    if (!healthConnectManager.hasAllPermissions()) {
        permissionLauncher.launch(healthConnectManager.permissions)
    }
}
```

---

## 7. Demo Preparation

> 🎯 The demo makes or breaks your hackathon score. Prepare for it NOW.

### 7.1 Pre-Recorded Video Backup

**CRITICAL: Start recording early, not at the end.**

- [ ] Set up screen recorder: **OBS Studio** (free) or built-in (macOS: Cmd+Shift+5)
- [ ] Record short clips throughout the hackathon showing features working
- [ ] Final demo video should be 2-3 minutes max
- [ ] Store in `assets/demo-recordings/`

**Script your demo flow BEFORE building:**
1. Open Cocoon → show clean dashboard (10s)
2. Walk into a noisy area → watch risk meter rise in real-time (15s)
3. Risk hits HIGH → automatic SMS alert sent to caregiver (10s)
4. Caregiver receives SMS on their phone (show second phone) (5s)
5. App suggests nearby quiet spaces on map (10s)
6. Tap a park → get directions (5s)
7. Show the Gemini agent's analysis in the app (10s)

### 7.2 Noise Audio Files for Demo

Download or create these **before** the hackathon:

```bash
mkdir -p assets/demo-audio

# Option 1: Use freesound.org (free, requires account)
# Search for: "crowd noise", "construction", "shopping mall", "classroom"
# Download and save as:
#   assets/demo-audio/crowd_noise_85db.wav
#   assets/demo-audio/quiet_library_30db.wav
#   assets/demo-audio/transition_quiet_to_loud.wav

# Option 2: Generate with ffmpeg (synthetic noise)
# White noise at different volumes:
ffmpeg -f lavfi -i "anoisesrc=d=30:c=pink:r=44100:a=0.3" assets/demo-audio/moderate_noise.wav
ffmpeg -f lavfi -i "anoisesrc=d=30:c=pink:r=44100:a=0.8" assets/demo-audio/loud_noise.wav
```

**Demo strategy:**
- Start with the phone in a quiet area (LOW risk, green dashboard)
- Play `loud_noise.wav` from a laptop speaker near the phone
- Watch the risk meter climb in real-time on the phone
- This is visually impressive and shows the system works

### 7.3 Google Maps Test Queries

Verify these work with your API key **before** the hackathon:

```bash
# Test: Find quiet places near a location (use hackathon venue coordinates)
curl "https://maps.googleapis.com/maps/api/place/nearbysearch/json?\
location=YOUR_VENUE_LAT,YOUR_VENUE_LNG&\
radius=2000&\
type=park|library&\
key=$GOOGLE_MAPS_API_KEY"

# Test: Place details
curl "https://maps.googleapis.com/maps/api/place/details/json?\
place_id=PLACE_ID_FROM_ABOVE&\
fields=name,formatted_address,opening_hours,rating&\
key=$GOOGLE_MAPS_API_KEY"
```

- [ ] Find the hackathon venue address → get lat/lng from Google Maps
- [ ] Test search for parks within 2km → note 3-5 results
- [ ] Test search for libraries within 2km → note results
- [ ] If venue is in a dead zone (no parks/libraries), pre-seed some demo data

### 7.4 Simulated Sensor Data (For When Real Sensors Misbehave)

Create a fallback that generates realistic demo data:

**`backend/utils/demo_data.py`:**
```python
"""Simulated sensor data for demo scenarios."""
import math
import time

def generate_escalation_scenario(duration_seconds: int = 120) -> list[dict]:
    """Generate a realistic meltdown escalation sequence.

    Returns time-series data showing gradual sensory overload.
    """
    readings = []
    start = time.time()

    for i in range(0, duration_seconds, 2):
        progress = i / duration_seconds  # 0.0 → 1.0

        readings.append({
            "timestamp": start + i,
            "noise_db": 40 + (50 * progress) + (5 * math.sin(i * 0.3)),  # 40→90 dB
            "accelerometer_magnitude": 9.8 + (8 * progress ** 2),         # Calm → agitated
            "light_level": 300 + (200 * math.sin(i * 0.1)),               # Flickering lights
            "heart_rate": 72 + (40 * progress),                            # 72→112 BPM
            "time_minutes": i // 60,
        })

    return readings


def generate_calm_scenario() -> dict:
    """Generate a calm, safe environment reading."""
    return {
        "noise_db": 35.0,
        "accelerometer_magnitude": 9.81,
        "light_level": 200.0,
        "heart_rate": 68.0,
        "time_minutes": 0,
    }


def generate_high_risk_scenario() -> dict:
    """Generate a high-risk reading for demo."""
    return {
        "noise_db": 92.0,
        "accelerometer_magnitude": 18.5,
        "light_level": 12000.0,
        "heart_rate": 115.0,
        "time_minutes": 45,
    }
```

---

## 8. Presentation

> ⏱ Do this the night before — it takes longer than you think.

### 8.1 Slide Template

- [ ] Create a Google Slides deck (for real-time collaboration): https://slides.google.com/
- [ ] Share with all 4 team members as editors
- [ ] Use these slides as your template:

**Slide structure (8-10 slides max):**

| # | Slide | Content | Time |
|---|-------|---------|------|
| 1 | **Title** | Cocoon 🦋 — Predicting Meltdowns Before They Happen | 10s |
| 2 | **The Problem** | 1 in 36 children diagnosed with ASD. Meltdowns ≠ tantrums. Unpredictable → fear → isolation. | 30s |
| 3 | **Our Solution** | AI-powered early warning system using phone sensors + Google ADK agents | 20s |
| 4 | **How It Works** | Architecture diagram: Phone Sensors → Agent Analysis → Risk Score → Alerts + Safe Spaces | 30s |
| 5 | **Live Demo** | Show the app working in real-time (or pre-recorded video) | 90s |
| 6 | **Technology** | Google ADK, Gemini 2.0 Flash, Health Connect, Firebase, Google Maps | 20s |
| 7 | **Impact** | Who this helps, how it could scale, accessibility focus | 20s |
| 8 | **What's Next** | Wearable integration, personalized ML models, caregiver dashboard | 15s |

### 8.2 Key Statistics (Pre-Researched)

Copy-paste these into your slides:

**Autism Prevalence:**
- 1 in 36 children in the US diagnosed with ASD (CDC, 2023)
- ~75 million people worldwide on the autism spectrum
- Autism costs the US ~$236 billion/year (Buescher et al.)

**Sensory Overload & Meltdowns:**
- 90-95% of autistic individuals experience sensory processing difficulties (Marco et al., 2011)
- Meltdowns are NOT behavioral — they're neurological responses to sensory overload
- Average meltdown duration: 20-60 minutes; recovery can take hours
- 70%+ of autistic adults report avoiding public spaces due to sensory fear

**Technology Gap:**
- <5% of health/wellness apps address neurodivergent needs
- Autism families spend avg $60,000+/year on therapies and support
- Early intervention (prediction → prevention) can reduce meltdown frequency by 40-60%

**Why This Matters:**
- "If I knew 10 minutes earlier, I could have avoided it" — common feedback from autistic adults
- Caregivers report anxiety from unpredictability as their #1 challenge

### 8.3 Architecture Diagram

Pre-draw this using https://excalidraw.com/ or https://draw.io/ (both free, collaborative):

```
┌─────────────────────────────────────────────────────────────┐
│                    📱 ANDROID APP (Cocoon)                  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │Accel-    │  │Micro-    │  │Light     │  │Health     │  │
│  │erometer  │  │phone     │  │Sensor    │  │Connect    │  │
│  │(movement)│  │(noise dB)│  │(lux)     │  │(heart rate│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │ steps)    │  │
│       │              │             │         └─────┬─────┘  │
│       └──────────────┴─────────────┴───────────────┘        │
│                          │                                   │
│              ┌───────────▼───────────┐                      │
│              │  Foreground Service   │                      │
│              │  (Background Monitor) │                      │
│              └───────────┬───────────┘                      │
│                          │ Sensor Batch (every 5s)          │
│                          ▼                                   │
│              ┌───────────────────────┐                      │
│              │  Real-time Dashboard  │    ┌──────────────┐  │
│              │  • Risk Meter (gauge) │    │ 🗺️ Safe Space │  │
│              │  • Sensor Charts      │◄──►│   Map View   │  │
│              │  • Alert History      │    │ (Google Maps) │  │
│              └───────────┬───────────┘    └──────────────┘  │
└──────────────────────────┼───────────────────────────────────┘
                           │ HTTPS / WebSocket
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   🖥️ BACKEND (FastAPI)                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Google ADK Agent Orchestrator           │    │
│  │                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │ Meltdown     │  │ Safe Space   │  │ Caregiver│  │    │
│  │  │ Predictor    │  │ Finder       │  │ Alerter  │  │    │
│  │  │ Agent        │  │ Agent        │  │ Agent    │  │    │
│  │  │              │  │              │  │          │  │    │
│  │  │ Gemini 2.0   │  │ Maps API +   │  │ Twilio   │  │    │
│  │  │ Flash        │  │ Gemini       │  │ SMS      │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│              ┌───────────▼───────────┐                      │
│              │   Redis (Time-Series  │                      │
│              │   Sensor History)     │                      │
│              └───────────────────────┘                      │
│                          │                                   │
│              ┌───────────▼───────────┐                      │
│              │  Firebase (Auth +     │                      │
│              │  User Profiles +      │                      │
│              │  Trigger History)     │                      │
│              └───────────────────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

- [ ] Recreate this in Excalidraw with colors and icons
- [ ] Export as PNG → add to slide 4
- [ ] Also add to `docs/architecture.png` in the repo (judges check repos!)

### 8.4 Color Palette & Branding

Keep it consistent across slides and app:

```
Cocoon Brand Colors:
- Primary:     #6C63FF  (Calm purple — accessibility, trust)
- Success/Low: #4CAF50  (Green — safe)
- Warning/Med: #FF9800  (Orange — caution)
- Danger/High: #F44336  (Red — urgent)
- Background:  #1A1A2E  (Dark navy — calm, reduces stimulation)
- Surface:     #16213E  (Slightly lighter navy)
- Text:        #E8E8E8  (Off-white — less harsh than pure white)

Fonts:
- Headlines: Google Sans or Inter (clean, modern)
- Body: Roboto (Android native)

Logo concept: A cocoon/butterfly emoji 🦋 works great as a hackathon logo.
```

---

## 9. Team Role Assignment

> Assign these BEFORE the hackathon starts.

| Person | Role | Focus Areas | Branch |
|--------|------|-------------|--------|
| **A** | Android Lead | UI/UX, Compose screens, navigation, dashboard | `feat/android-ui` |
| **B** | Sensor Engineer | Foreground service, sensor collection, Health Connect | `feat/sensor-service` |
| **C** | Backend/AI Lead | FastAPI, ADK agents, Gemini integration, Redis | `feat/backend-agents` |
| **D** | Integration Lead | Maps, Twilio, Firebase auth, demo prep, slides | `feat/integrations` |

**Communication:**
- [ ] Create a group chat (Signal/WhatsApp/Discord) just for the team
- [ ] Agree on merge protocol: announce in chat before merging to `main`
- [ ] Set alarms: 12h mark (checkpoint), 24h mark (integration), 36h mark (polish), 44h mark (demo prep)

---

## 10. Final Pre-Hackathon Verification Checklist

Run through this 1-2 hours before the hackathon begins:

```bash
# ✅ API Keys work
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Say OK"}]}]}' | jq '.candidates[0].content.parts[0].text'

# ✅ Android project builds
cd android && ./gradlew assembleDebug && echo "✅ Android builds!" || echo "❌ ANDROID BUILD FAILED"

# ✅ Backend starts
cd backend && source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 &
sleep 3
curl http://localhost:8000/health | jq .
kill %1

# ✅ Docker services work
docker compose up -d
sleep 5
docker compose ps  # All should show "Up" / "healthy"
docker compose down

# ✅ Git is clean and ready
git status  # Should be clean
git log --oneline -5  # Should show your setup commits

# ✅ Phone connects
adb devices  # Should show your device

# ✅ Team can all clone and build
# Have each person run:
git clone git@github.com:YOUR_ORG/cocoon-app.git
cd cocoon-app
# Android person: open in Android Studio, sync Gradle, build
# Backend person: cd backend && pip install -r requirements.txt && python -c "from main import app"
```

---

## ⚡ Quick Reference Card

Print this or keep it open during the hackathon:

| Service | URL | Credentials Location |
|---------|-----|---------------------|
| Gemini API | `https://generativelanguage.googleapis.com/v1beta/` | `.env` → `GEMINI_API_KEY` |
| Google Maps | `https://maps.googleapis.com/maps/api/` | `.env` → `GOOGLE_MAPS_API_KEY` |
| Firebase Console | `https://console.firebase.google.com/` | `google-services.json` in `android/app/` |
| Twilio Console | `https://console.twilio.com/` | `.env` → `TWILIO_*` |
| Backend API | `http://localhost:8000` | N/A (local) |
| Redis | `redis://localhost:6379` | N/A (Docker) |
| API Docs (Swagger) | `http://localhost:8000/docs` | N/A |

**Emergency contacts:**
- Google Cloud support: https://cloud.google.com/support
- Twilio status: https://status.twilio.com/
- Firebase status: https://status.firebase.google.com/

---

> **Remember:** A hackathon is a marathon sprint. Eat, hydrate, take breaks.
> The best projects aren't the ones with the most features —
> they're the ones that tell the best story with a working demo. 🦋
