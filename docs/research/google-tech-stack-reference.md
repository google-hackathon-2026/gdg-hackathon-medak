# Google Tech Stack Reference — Build with AI Hackathon (GDG Belgrade, March 2026)

> **Project:** Android app that predicts autism meltdowns using phone sensors and AI agents
> **Last updated:** 2026-03-28
> **Purpose:** Quick reference for the latest Google developer technologies to impress at a Google-sponsored hackathon

---

## Table of Contents

1. [Google ADK (Agent Development Kit)](#1-google-adk-agent-development-kit)
2. [A2A Protocol (Agent-to-Agent)](#2-a2a-protocol-agent-to-agent)
3. [Gemini 2.5 Flash](#3-gemini-25-flash)
4. [Health Connect API](#4-health-connect-api)
5. [Wear OS / Samsung Health](#5-wear-os--samsung-health)
6. [LiteRT (formerly TFLite) / Firebase ML](#6-litert-formerly-tflite--firebase-ml)
7. [Android Sensor APIs](#7-android-sensor-apis)
8. [Google Maps Places API (New)](#8-google-maps-places-api-new)
9. [Architecture Overview](#9-architecture-overview)
10. [Hackathon Gotchas & Tips](#10-hackathon-gotchas--tips)

---

## 1. Google ADK (Agent Development Kit)

### What It Is
Open-source Python framework from Google (announced Google Cloud NEXT 2025, April 2025) for building production-ready multi-agent systems. **This is THE tech to showcase** — it's Google's flagship agentic framework.

### Latest Version
- **Package:** `google-adk` (PyPI)
- **Install:** `pip install google-adk`
- **CLI tools:** `adk web` (visual dev UI), `adk run` (terminal chat)
- **Model support:** Gemini (native), plus any model via LiteLLM integration

### Key Concepts
| Concept | Description |
|---------|-------------|
| `LlmAgent` | Core agent with name, model, instruction, tools, sub_agents |
| `SequentialAgent` | Runs sub-agents in order (assembly line) |
| `ParallelAgent` | Runs sub-agents concurrently (fan-out/gather) |
| `LoopAgent` | Repeats sub-agents until condition met or `max_iterations` |
| `AgentTool` | Wraps a sub-agent as a callable tool for parent agent |
| Session State | Shared `dict` across all agents via `session.state` — use `output_key` to pass data between agents |

### Multi-Agent Orchestration for Our Project

```python
# agent.py — Meltdown Prediction Multi-Agent System
from google.adk.agents import LlmAgent, SequentialAgent, ParallelAgent, LoopAgent
from google.adk.tools import google_search

# --- Specialist Agents ---

sensor_analyst = LlmAgent(
    name="sensor_analyst",
    model="gemini-2.5-flash",
    description="Analyzes raw sensor data (HR, noise, movement) for stress patterns",
    instruction="""You are a sensor data analyst specializing in physiological stress detection.
    Analyze the sensor readings in {sensor_data} and identify stress indicators.
    Output a structured stress assessment with confidence scores.
    Write your analysis to the session state.""",
    output_key="stress_analysis"
)

pattern_detector = LlmAgent(
    name="pattern_detector",
    model="gemini-2.5-flash",
    description="Detects meltdown patterns from historical data and current stress levels",
    instruction="""You are a pattern recognition specialist for autism meltdown prediction.
    Given {stress_analysis} and {user_history}, identify if current patterns match
    known pre-meltdown signatures. Output risk level (LOW/MEDIUM/HIGH/CRITICAL)
    with reasoning and time estimate.""",
    output_key="risk_assessment"
)

environment_scout = LlmAgent(
    name="environment_scout",
    model="gemini-2.5-flash",
    description="Finds safe, quiet spaces nearby when meltdown risk is elevated",
    instruction="""You are an environment specialist. When risk is MEDIUM or higher,
    use the location tools to find nearby quiet, safe spaces (parks, libraries,
    quiet cafes). Provide directions and estimated walking time.""",
    tools=[google_search],  # Could also add Places API tool
    output_key="safe_spaces"
)

caregiver_notifier = LlmAgent(
    name="caregiver_notifier",
    model="gemini-2.5-flash",
    description="Composes appropriate notifications for caregivers",
    instruction="""Based on {risk_assessment} and {safe_spaces}, compose a clear,
    calm notification for the caregiver. Include: risk level, key indicators,
    suggested actions, and nearby safe spaces if available.""",
    output_key="notification"
)

# --- Orchestration ---

# Fan-out: analyze sensors + detect patterns in parallel
parallel_analysis = ParallelAgent(
    name="parallel_analysis",
    sub_agents=[sensor_analyst, pattern_detector]
)

# Sequential pipeline: analyze → scout → notify
prediction_pipeline = SequentialAgent(
    name="prediction_pipeline",
    description="Full meltdown prediction and response pipeline",
    sub_agents=[
        parallel_analysis,
        environment_scout,
        caregiver_notifier
    ]
)

# Root agent that orchestrates everything
root_agent = LlmAgent(
    name="meltdown_predictor",
    model="gemini-2.5-flash",
    description="Main orchestrator for autism meltdown prediction system",
    instruction="""You coordinate the meltdown prediction system.
    When new sensor data arrives, delegate to the prediction pipeline.
    For general questions, respond directly.""",
    sub_agents=[prediction_pipeline]
)
```

### Running Locally
```bash
pip install google-adk
# Create project structure:
#   my_agent/
#     __init__.py
#     agent.py  (must export root_agent)
adk web  # Opens visual dev UI at http://localhost:8000
```

### Hackathon Gotchas
- **Agent names must be unique** across the entire tree
- **`output_key`** is how agents write to shared state — always use it
- Sub-agents access parent state via `{key_name}` or `{key_name?}` (optional) in instructions
- `adk web --reload_agents` enables hot-reload during development
- **Rate limits:** Free tier Gemini API has limits; use `gemini-2.5-flash` (not Pro) for volume
- The `root_agent` variable name in `agent.py` is a convention ADK looks for

---

## 2. A2A Protocol (Agent-to-Agent)

### What It Is
Open protocol (announced alongside ADK at Google Cloud NEXT 2025) that standardizes how AI agents communicate with each other across different frameworks and vendors. Built on HTTP + JSON-RPC + SSE. Complements MCP (Model Context Protocol): **MCP = agent↔tools, A2A = agent↔agent**.

### Latest Version
- **Protocol version:** 0.2.6+
- **Python SDK:** `pip install a2a-sdk` (package: `a2a-sdk`)
- **GitHub:** [github.com/google-a2a/a2a-python](https://github.com/google-a2a/a2a-python)
- **50+ enterprise partners:** Salesforce, SAP, Atlassian, PayPal, etc.

### How It Works
1. **Agent Card** — JSON manifest at `/.well-known/agent.json` describing agent capabilities
2. **Discovery** — Client agent fetches remote agent's card to understand its skills
3. **Task Management** — Communication oriented around "Tasks" with lifecycle states
4. **Message Exchange** — JSON-RPC messages with "Parts" (text, images, etc.)

### Agent Card Structure
```json
{
  "name": "meltdown_sensor_agent",
  "description": "Processes physiological sensor data for stress detection",
  "version": "1.0.0",
  "url": "https://your-agent.run.app",
  "protocolVersion": "0.2.6",
  "capabilities": {
    "streaming": true
  },
  "defaultInputModes": ["text/plain", "application/json"],
  "defaultOutputModes": ["application/json"],
  "skills": [
    {
      "id": "analyze_sensors",
      "name": "Sensor Analysis",
      "description": "Analyzes HR, noise, movement data for stress patterns",
      "tags": ["sensor", "stress", "health"],
      "examples": ["Analyze these sensor readings for stress indicators"]
    }
  ]
}
```

### Python SDK Example (Server)
```python
from a2a.types import AgentCard, AgentCapabilities, AgentSkill
from a2a.server import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore

# Define agent card
capabilities = AgentCapabilities(streaming=True)
skill = AgentSkill(
    id="analyze_sensors",
    name="Sensor Analysis",
    description="Analyzes physiological sensor data for stress patterns",
    tags=["sensor", "stress"],
    examples=["Analyze HR=95, noise=75dB, movement=high"]
)
agent_card = AgentCard(
    name="sensor_agent",
    description="Physiological sensor analysis agent",
    url="http://localhost:8080",
    version="1.0.0",
    defaultInputModes=["text/plain"],
    defaultOutputModes=["application/json"],
    capabilities=capabilities,
    skills=[skill]
)

# Create and run server
task_store = InMemoryTaskStore()
handler = DefaultRequestHandler(agent_card=agent_card, task_store=task_store)
app = A2AStarletteApplication(agent_card=agent_card, http_handler=handler)
# Run with uvicorn
```

### Python SDK Example (Client)
```python
from a2a.client import A2ACardResolver
import httpx

async def discover_and_call():
    client = httpx.AsyncClient()
    resolver = A2ACardResolver(
        base_url="http://localhost:8080",
        httpx_client=client
    )
    # Discover agent capabilities
    card = await resolver.get_agent_card()
    print(f"Agent: {card.name}, Skills: {[s.name for s in card.skills]}")
    
    # Send task via JSON-RPC
    response = await client.post(
        f"{card.url}",
        json={
            "jsonrpc": "2.0",
            "id": "task-001",
            "method": "message/send",
            "params": {
                "message": "Analyze HR=95, noise=75dB, movement=high"
            }
        }
    )
```

### Why Use It for This Hackathon
- Shows you understand the **latest Google agent ecosystem** (ADK + A2A together)
- Enables different parts of the system (sensor agent, prediction agent, notification agent) to be independently deployable
- **Impressive for judges:** demonstrates enterprise-grade architecture thinking

### Hackathon Gotchas
- A2A is **overkill for a 48h hackathon** if building a monolith — use it for the architecture diagram and demo narrative, implement 1-2 agents with A2A cards
- Focus on ADK for actual multi-agent logic; A2A for the "future vision" slide
- Agent card at `/.well-known/agent.json` is the new standard path (was `/agent-card.json` before v0.3.0)

---

## 3. Gemini 2.5 Flash

### What It Is
Google's latest workhorse model — best price-performance ratio with **thinking capabilities** (adaptive reasoning). This is the model to use for all AI workloads in the hackathon.

### Latest Model Names (as of March 2026)
| Model | Code | Best For |
|-------|------|----------|
| **2.5 Flash (stable)** | `gemini-2.5-flash` | Production, agentic use, all-round |
| 2.5 Flash Latest | `gemini-flash-latest` | Always latest preview |
| 2.5 Flash Live | `gemini-live-2.5-flash-preview` | Real-time bidirectional voice/video |
| 2.5 Flash Native Audio | `gemini-2.5-flash-preview-native-audio-dialog` | Conversational audio I/O |
| 2.5 Flash TTS | `gemini-2.5-flash-preview-tts` | Text-to-speech |
| 2.5 Pro | `gemini-2.5-pro` | Complex reasoning (higher cost) |

### Key Capabilities
- **1M token context window** — can process massive amounts of sensor data history
- **Adaptive thinking** — model reasons before responding; configurable thinking budget
- **Multimodal input:** Audio, images, video, text, PDF
- **Structured output** — native JSON schema enforcement
- **Native tool use** — function calling, Google Search, code execution
- **Audio processing** — can analyze audio files for ambient noise patterns

### Structured Output (Critical for Sensor Data)
```python
import google.generativeai as genai
from google.generativeai.types import GenerationConfig

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel("gemini-2.5-flash")

# Define structured output schema
risk_schema = {
    "type": "object",
    "properties": {
        "risk_level": {
            "type": "string",
            "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        },
        "confidence": {
            "type": "number",
            "description": "Confidence score 0.0-1.0"
        },
        "contributing_factors": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "factor": {"type": "string"},
                    "severity": {"type": "number"},
                    "description": {"type": "string"}
                }
            }
        },
        "recommended_actions": {
            "type": "array",
            "items": {"type": "string"}
        },
        "estimated_time_to_meltdown_minutes": {
            "type": "integer",
            "description": "Estimated minutes until potential meltdown, -1 if not applicable"
        }
    },
    "required": ["risk_level", "confidence", "contributing_factors", "recommended_actions"]
}

response = model.generate_content(
    f"""Analyze these sensor readings for autism meltdown risk:
    - Heart Rate: 105 bpm (baseline: 72 bpm)
    - Ambient Noise: 82 dB (threshold: 70 dB)  
    - Movement Pattern: repetitive/stimming detected
    - Time of Day: 15:30 (after school)
    - Sleep Last Night: 5.5 hours (usual: 8 hours)
    
    Assess meltdown risk based on these indicators.""",
    generation_config=GenerationConfig(
        response_mime_type="application/json",
        response_schema=risk_schema
    )
)

# response.text is guaranteed valid JSON matching the schema
risk_data = json.loads(response.text)
```

### Audio Analysis (Ambient Noise Processing)
```python
# Upload audio file for analysis
audio_file = genai.upload_file("ambient_recording.wav")

response = model.generate_content([
    "Analyze this audio recording for sensory overload indicators. "
    "Identify: overall noise level estimate in dB, presence of sudden loud sounds, "
    "crowd density, repetitive/alarming sounds. Return structured JSON.",
    audio_file
], generation_config=GenerationConfig(
    response_mime_type="application/json"
))
```

### Live API (Real-time Audio/Video)
```python
# For real-time monitoring via Live API
from google.genai import Client

client = Client(api_key="YOUR_API_KEY")

# Start real-time session
session = client.live.connect(
    model="gemini-live-2.5-flash-preview",
    config={
        "response_modalities": ["TEXT"],
        "tools": [{"function_declarations": [...]}]
    }
)
# Stream audio frames for real-time analysis
```

### Thinking Budgets (Cost Control)
```python
# Control thinking tokens to manage cost/latency
response = model.generate_content(
    "Quick risk assessment: HR=90, noise=65dB",
    generation_config=GenerationConfig(
        thinking_config={"thinking_budget": 1024}  # Limit thinking tokens
    )
)

# Or disable thinking entirely for simple tasks
response = model.generate_content(
    "Format this data as JSON",
    generation_config=GenerationConfig(
        thinking_config={"thinking_budget": 0}  # No thinking
    )
)
```

### Hackathon Gotchas
- **Use `gemini-2.5-flash` (stable)** for reliability, not preview models
- **Free tier:** 15 RPM, 1M TPM, 1500 RPD — enough for demo but plan API calls carefully
- **Structured output is your best friend** — use `response_schema` for all agent outputs
- **Thinking budget:** Set to 0 for simple formatting tasks, save tokens for complex analysis
- **Audio upload:** Max 9.5 hours of audio; for real-time, use Live API
- **API Key:** Get from [aistudio.google.com](https://aistudio.google.com)

---

## 4. Health Connect API

### What It Is
Android Jetpack library that provides a unified API to read/write health & fitness data from multiple sources (Google Fit, Samsung Health, Fitbit, etc.). **Single API for all health data** regardless of which app/device collected it.

### Latest Version
- **Library:** `androidx.health.connect:connect-client:1.1.0-alpha` (latest stable track)
- **Min SDK:** Android 14 (API 34) has Health Connect built-in; Android 9+ via Play Store app
- **Gradle:**
```kotlin
// build.gradle.kts
dependencies {
    implementation("androidx.health.connect:connect-client:1.1.0-alpha10")
}
```

### Available Data Types (Relevant to Our Project)
| Data Type | Class | What It Contains |
|-----------|-------|-----------------|
| Heart Rate | `HeartRateRecord` | BPM samples with timestamps |
| Heart Rate Variability | `HeartRateVariabilityRmssdRecord` | HRV RMSSD values |
| Sleep | `SleepSessionRecord` | Sleep stages, duration |
| Respiratory Rate | `RespiratoryRateRecord` | Breaths per minute |
| Steps | `StepsRecord` | Step count |
| Exercise | `ExerciseSessionRecord` | Exercise type, duration |
| Resting Heart Rate | `RestingHeartRateRecord` | Resting BPM |
| Oxygen Saturation | `OxygenSaturationRecord` | SpO2 percentage |
| Body Temperature | `BodyTemperatureRecord` | Temperature readings |

### Permissions Model
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.health.READ_HEART_RATE" />
<uses-permission android:name="android.permission.health.READ_SLEEP" />
<uses-permission android:name="android.permission.health.READ_HEART_RATE_VARIABILITY" />
<uses-permission android:name="android.permission.health.READ_RESPIRATORY_RATE" />
<uses-permission android:name="android.permission.health.READ_STEPS" />
<uses-permission android:name="android.permission.health.READ_RESTING_HEART_RATE" />

<!-- Activity for permission request handling -->
<activity
    android:name=".HealthConnectPermissionActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
    </intent-filter>
</activity>
```

### Kotlin Code — Reading Heart Rate & Sleep
```kotlin
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Instant
import java.time.temporal.ChronoUnit

class HealthDataRepository(private val context: Context) {
    
    private val healthClient = HealthConnectClient.getOrCreate(context)
    
    // Check permissions
    suspend fun hasPermissions(): Boolean {
        val granted = healthClient.permissionController.getGrantedPermissions()
        return granted.containsAll(REQUIRED_PERMISSIONS)
    }
    
    // Request permissions
    val permissionsLauncher = registerForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { granted ->
        // Handle result
    }
    
    // Read heart rate data (last 24 hours)
    suspend fun getRecentHeartRate(): List<HeartRateRecord> {
        val now = Instant.now()
        val dayAgo = now.minus(24, ChronoUnit.HOURS)
        
        val request = ReadRecordsRequest(
            recordType = HeartRateRecord::class,
            timeRangeFilter = TimeRangeFilter.between(dayAgo, now)
        )
        
        val response = healthClient.readRecords(request)
        return response.records
    }
    
    // Read sleep data (last night)
    suspend fun getLastNightSleep(): List<SleepSessionRecord> {
        val now = Instant.now()
        val yesterday = now.minus(24, ChronoUnit.HOURS)
        
        val request = ReadRecordsRequest(
            recordType = SleepSessionRecord::class,
            timeRangeFilter = TimeRangeFilter.between(yesterday, now)
        )
        
        val response = healthClient.readRecords(request)
        return response.records
    }
    
    // Read HRV (Heart Rate Variability) — key stress indicator
    suspend fun getRecentHRV(): List<HeartRateVariabilityRmssdRecord> {
        val now = Instant.now()
        val hoursAgo = now.minus(6, ChronoUnit.HOURS)
        
        val request = ReadRecordsRequest(
            recordType = HeartRateVariabilityRmssdRecord::class,
            timeRangeFilter = TimeRangeFilter.between(hoursAgo, now)
        )
        
        return healthClient.readRecords(request).records
    }
    
    // Calculate baseline vs current
    fun analyzeHeartRate(records: List<HeartRateRecord>): HeartRateAnalysis {
        val allSamples = records.flatMap { it.samples }
        val avgBpm = allSamples.map { it.beatsPerMinute }.average()
        val maxBpm = allSamples.maxOf { it.beatsPerMinute }
        val recentBpm = allSamples.takeLast(5).map { it.beatsPerMinute }.average()
        
        return HeartRateAnalysis(
            averageBpm = avgBpm,
            maxBpm = maxBpm,
            currentBpm = recentBpm,
            isElevated = recentBpm > avgBpm * 1.3  // 30% above baseline
        )
    }
    
    companion object {
        val REQUIRED_PERMISSIONS = setOf(
            HealthPermission.getReadPermission(HeartRateRecord::class),
            HealthPermission.getReadPermission(SleepSessionRecord::class),
            HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
            HealthPermission.getReadPermission(RespiratoryRateRecord::class),
        )
    }
}
```

### Hackathon Gotchas
- **Health Connect app must be installed** on the device (built into Android 14+, Play Store for older)
- **Permissions are RUNTIME** — user must explicitly grant each data type
- **No real-time streaming** — you poll for data; use `readRecords()` with recent time range
- **Emulator support is limited** — test on a real device with a fitness tracker if possible
- **Data availability depends on user's wearable/fitness apps** — have mock data ready for demo
- **Privacy review required** for Play Store — not an issue for hackathon demo

---

## 5. Wear OS / Samsung Health

### What It Is
For hackathon purposes, there are two paths to get real-time HR data from a smartwatch:
1. **Health Connect** (recommended) — unified API, reads data from any source
2. **Wear OS Health Services API** — direct from watch, more real-time but requires Wear OS app

### Architecture Options

```
Option A (Simpler — recommended for hackathon):
┌──────────────┐    syncs to    ┌───────────────┐    reads via    ┌─────────────┐
│  Smartwatch   │ ──────────▶  │ Health Connect │ ◀────────────  │  Your App   │
│ (any brand)   │              │   (Android)    │               │  (Phone)    │
└──────────────┘              └───────────────┘               └─────────────┘

Option B (More real-time — complex):
┌──────────────┐   Health     ┌───────────────┐   Message    ┌─────────────┐
│  Wear OS App │ ──Services──▶│ Watch Agent   │ ──API────▶  │  Phone App  │
│  (on watch)  │    API       │  (on watch)   │             │             │
└──────────────┘              └───────────────┘             └─────────────┘
```

### Wear OS Health Services API (if building watch app)
```kotlin
// On Wear OS device — build.gradle
// implementation("androidx.health:health-services-client:1.1.0-alpha05")

import androidx.health.services.client.HealthServicesClient
import androidx.health.services.client.PassiveListenerCallback
import androidx.health.services.client.data.DataPointContainer
import androidx.health.services.client.data.DataType
import androidx.health.services.client.data.PassiveListenerConfig

class WatchHealthService : Service() {
    
    private lateinit var healthClient: HealthServicesClient
    
    override fun onCreate() {
        super.onCreate()
        healthClient = HealthServicesClient.getClient(this)
    }
    
    suspend fun startPassiveMonitoring() {
        val passiveClient = healthClient.passiveMonitoringClient
        
        val config = PassiveListenerConfig.Builder()
            .setDataTypes(setOf(
                DataType.HEART_RATE_BPM,
                DataType.STEPS_DAILY
            ))
            .build()
        
        passiveClient.setPassiveListenerCallback(
            config,
            object : PassiveListenerCallback {
                override fun onNewDataPointsReceived(dataPoints: DataPointContainer) {
                    val heartRates = dataPoints.getData(DataType.HEART_RATE_BPM)
                    heartRates.forEach { dp ->
                        val bpm = dp.value
                        val timestamp = dp.timeDurationFromBoot
                        // Send to phone app via MessageClient or DataClient
                        sendToPhone(bpm, timestamp)
                    }
                }
            }
        )
    }
}
```

### Samsung Health SDK (Alternative)
- Samsung Health SDK allows reading data directly from Samsung Galaxy watches
- **However:** Samsung now routes data through Health Connect on Android 14+
- **Recommendation:** Just use Health Connect API — it reads Samsung Health data automatically

### Hackathon Recommendation
**Use Health Connect API (Section 4) exclusively.** It reads data from Wear OS, Samsung Health, Fitbit, and Google Fit. Building a separate Wear OS app is a 2-day project on its own — not feasible in 48h unless you have a Wear OS developer on the team.

For the demo: Have a team member wear a smartwatch running Samsung Health or Google Fit → data syncs to Health Connect → your app reads it.

---

## 6. LiteRT (formerly TFLite) / Firebase ML

### What It Is
**LiteRT** (rebranded from TensorFlow Lite in late 2024) is Google's on-device ML inference engine for Android/iOS. For our project, it enables **on-device sensor pattern recognition** without cloud latency.

### Latest Setup
```kotlin
// build.gradle.kts
dependencies {
    // LiteRT (formerly TFLite) runtime
    implementation("com.google.ai.edge.litert:litert:1.0.1")
    implementation("com.google.ai.edge.litert:litert-support-api:0.4.0")
    // GPU delegate for faster inference
    implementation("com.google.ai.edge.litert:litert-gpu:1.0.1")
}
```

### On-Device Sensor Pattern Model
```kotlin
import com.google.ai.edge.litert.Interpreter

class OnDeviceMeltdownPredictor(context: Context) {
    
    private val interpreter: Interpreter
    
    init {
        // Load .tflite model from assets
        val modelBuffer = loadModelFile(context, "meltdown_predictor.tflite")
        val options = Interpreter.Options().apply {
            setNumThreads(4)
            // Use GPU delegate for faster inference
            // addDelegate(GpuDelegate())
        }
        interpreter = Interpreter(modelBuffer, options)
    }
    
    /**
     * Input: [heartRate, hrv, noiseDb, movementIntensity, sleepHours, timeOfDay]
     * Output: [riskScore] (0.0 - 1.0)
     */
    fun predictRisk(sensorData: SensorSnapshot): Float {
        // Normalize inputs
        val input = floatArrayOf(
            normalize(sensorData.heartRate, 40f, 200f),
            normalize(sensorData.hrv, 0f, 100f),
            normalize(sensorData.noiseDb, 20f, 120f),
            normalize(sensorData.movementIntensity, 0f, 10f),
            normalize(sensorData.sleepHours, 0f, 12f),
            normalize(sensorData.hourOfDay, 0f, 24f)
        )
        
        val inputBuffer = arrayOf(input)
        val outputBuffer = Array(1) { FloatArray(1) }
        
        interpreter.run(inputBuffer, outputBuffer)
        
        return outputBuffer[0][0]  // Risk score 0.0-1.0
    }
    
    private fun normalize(value: Float, min: Float, max: Float): Float {
        return (value - min) / (max - min)
    }
    
    private fun loadModelFile(context: Context, filename: String): ByteBuffer {
        val assetFileDescriptor = context.assets.openFd(filename)
        val inputStream = FileInputStream(assetFileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        val startOffset = assetFileDescriptor.startOffset
        val declaredLength = assetFileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }
}

data class SensorSnapshot(
    val heartRate: Float,
    val hrv: Float,
    val noiseDb: Float,
    val movementIntensity: Float,
    val sleepHours: Float,
    val hourOfDay: Float
)
```

### Creating a Simple Model (Python, pre-hackathon)
```python
import tensorflow as tf
import numpy as np

# Simple model for sensor pattern recognition
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(6,)),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')  # Risk score 0-1
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train with synthetic data (generate patterns)
# ... model.fit(X_train, y_train, epochs=50)

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

with open('meltdown_predictor.tflite', 'wb') as f:
    f.write(tflite_model)
```

### Firebase ML (Alternative for model hosting)
```kotlin
// If you want to download model from Firebase instead of bundling
// build.gradle
// implementation("com.google.firebase:firebase-ml-modeldownloader-ktx:24.2.3")

val conditions = CustomModelDownloadConditions.Builder()
    .requireWifi()
    .build()

FirebaseModelDownloader.getInstance()
    .getModel("meltdown_predictor", DownloadType.LOCAL_MODEL, conditions)
    .addOnSuccessListener { model ->
        val modelFile = model.file
        // Load into LiteRT interpreter
    }
```

### Hackathon Gotchas
- **Model training takes time** — pre-train a simple model with synthetic data BEFORE the hackathon
- A 6-input, 1-output model is tiny (~10KB .tflite) and runs in <1ms on any phone
- **GPU delegate** can cause crashes on some devices; test without it first
- Firebase ML model download requires internet on first run — bundle the model in APK for reliability
- The rebranding from TFLite to LiteRT is still in progress — some docs still say TFLite
- **Package name changed:** `org.tensorflow.lite` → `com.google.ai.edge.litert`

---

## 7. Android Sensor APIs

### AudioRecord — Ambient Noise Level

```kotlin
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder

class AmbientNoiseMeter {
    
    private var audioRecord: AudioRecord? = null
    private var isRecording = false
    private val sampleRate = 44100
    private val bufferSize = AudioRecord.getMinBufferSize(
        sampleRate,
        AudioFormat.CHANNEL_IN_MONO,
        AudioFormat.ENCODING_PCM_16BIT
    )
    
    /**
     * Permission required: android.permission.RECORD_AUDIO
     */
    fun startMonitoring(onNoiseLevel: (Double) -> Unit) {
        audioRecord = AudioRecord(
            MediaRecorder.AudioSource.MIC,
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT,
            bufferSize
        )
        
        isRecording = true
        audioRecord?.startRecording()
        
        Thread {
            val buffer = ShortArray(bufferSize)
            while (isRecording) {
                val read = audioRecord?.read(buffer, 0, bufferSize) ?: 0
                if (read > 0) {
                    val amplitude = calculateRMS(buffer, read)
                    val db = 20 * Math.log10(amplitude / Short.MAX_VALUE.toDouble())
                    // Normalize to approximate dB SPL (rough estimate)
                    val dbSpl = db + 90.0  // Approximate offset
                    onNoiseLevel(dbSpl.coerceIn(20.0, 120.0))
                }
                Thread.sleep(500) // Sample every 500ms
            }
        }.start()
    }
    
    fun stopMonitoring() {
        isRecording = false
        audioRecord?.stop()
        audioRecord?.release()
        audioRecord = null
    }
    
    private fun calculateRMS(buffer: ShortArray, readSize: Int): Double {
        var sum = 0.0
        for (i in 0 until readSize) {
            sum += buffer[i].toDouble() * buffer[i].toDouble()
        }
        return Math.sqrt(sum / readSize)
    }
}
```

### Accelerometer — Movement Pattern Detection

```kotlin
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager

class MovementDetector(context: Context) : SensorEventListener {
    
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    
    private val recentReadings = mutableListOf<Triple<Float, Float, Float>>()
    private var lastMagnitude = 0f
    
    fun startMonitoring() {
        sensorManager.registerListener(
            this,
            accelerometer,
            SensorManager.SENSOR_DELAY_UI  // ~60ms interval
        )
    }
    
    fun stopMonitoring() {
        sensorManager.unregisterListener(this)
    }
    
    override fun onSensorChanged(event: SensorEvent) {
        val x = event.values[0]
        val y = event.values[1]
        val z = event.values[2]
        
        // Calculate magnitude (removes gravity direction dependency)
        val magnitude = Math.sqrt(
            (x * x + y * y + z * z).toDouble()
        ).toFloat()
        
        // Remove gravity (~9.81 m/s²)
        val movementIntensity = Math.abs(magnitude - SensorManager.GRAVITY_EARTH)
        
        // Store recent readings for pattern analysis
        recentReadings.add(Triple(x, y, z))
        if (recentReadings.size > 100) recentReadings.removeAt(0)
        
        lastMagnitude = movementIntensity
    }
    
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
    
    /**
     * Detect repetitive movements (potential stimming)
     * Looks for periodic patterns in accelerometer data
     */
    fun detectRepetitiveMovement(): RepetitiveMovementResult {
        if (recentReadings.size < 50) return RepetitiveMovementResult(false, 0f)
        
        val magnitudes = recentReadings.map { (x, y, z) ->
            Math.sqrt((x * x + y * y + z * z).toDouble()).toFloat()
        }
        
        // Simple autocorrelation to detect repetitive patterns
        val mean = magnitudes.average().toFloat()
        val variance = magnitudes.map { (it - mean) * (it - mean) }.average().toFloat()
        
        if (variance < 0.1f) return RepetitiveMovementResult(false, 0f)
        
        // Check autocorrelation at various lags
        var maxCorrelation = 0f
        for (lag in 5..25) { // ~300ms to ~1.5s periods
            var correlation = 0f
            val n = magnitudes.size - lag
            for (i in 0 until n) {
                correlation += (magnitudes[i] - mean) * (magnitudes[i + lag] - mean)
            }
            correlation /= (n * variance)
            maxCorrelation = maxOf(maxCorrelation, correlation)
        }
        
        return RepetitiveMovementResult(
            isRepetitive = maxCorrelation > 0.5f,
            confidence = maxCorrelation
        )
    }
    
    fun getCurrentIntensity(): Float = lastMagnitude
}

data class RepetitiveMovementResult(
    val isRepetitive: Boolean,
    val confidence: Float
)
```

### GPS / Location — Background Tracking

```kotlin
import com.google.android.gms.location.*

class LocationTracker(context: Context) {
    
    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
    
    private val locationRequest = LocationRequest.Builder(
        Priority.PRIORITY_BALANCED_POWER_ACCURACY,
        60_000L  // Every 60 seconds (battery-friendly)
    ).apply {
        setMinUpdateIntervalMillis(30_000L)
        setMaxUpdates(Int.MAX_VALUE)
    }.build()
    
    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(result: LocationResult) {
            result.lastLocation?.let { location ->
                onLocationUpdate?.invoke(location.latitude, location.longitude)
            }
        }
    }
    
    var onLocationUpdate: ((Double, Double) -> Unit)? = null
    
    /**
     * Permissions required:
     *   ACCESS_FINE_LOCATION
     *   ACCESS_COARSE_LOCATION
     *   ACCESS_BACKGROUND_LOCATION (for Android 10+)
     */
    fun startTracking() {
        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback,
            Looper.getMainLooper()
        )
    }
    
    fun stopTracking() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }
}
```

### Foreground Service (Required for Background Sensors)

```kotlin
// For continuous sensor monitoring in background (Android 8+)
class SensorMonitorService : Service() {
    
    companion object {
        const val NOTIFICATION_ID = 1001
        const val CHANNEL_ID = "sensor_monitor"
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        createNotificationChannel()
        
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Monitoring Active")
            .setContentText("Tracking sensors for your safety")
            .setSmallIcon(R.drawable.ic_monitoring)
            .setOngoing(true)
            .build()
        
        startForeground(NOTIFICATION_ID, notification)
        
        // Start all sensor monitoring here
        // noiseMeter.startMonitoring { ... }
        // movementDetector.startMonitoring()
        // locationTracker.startTracking()
        
        return START_STICKY
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
}
```

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_HEALTH" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<service
    android:name=".SensorMonitorService"
    android:foregroundServiceType="health|location|microphone"
    android:exported="false" />
```

### Hackathon Gotchas
- **Foreground Service is MANDATORY** for background sensor access on Android 8+
- `foregroundServiceType` must match the sensors you're using
- **RECORD_AUDIO** requires runtime permission — handle denial gracefully
- **Background location** requires separate permission grant on Android 10+
- AudioRecord dB values are **relative**, not calibrated SPL — the +90 offset is an approximation
- **Battery drain:** Don't sample accelerometer at `SENSOR_DELAY_FASTEST`; use `SENSOR_DELAY_UI` or `SENSOR_DELAY_NORMAL`
- **Emulator:** Accelerometer works with virtual sensor controls; microphone depends on host

---

## 8. Google Maps Places API (New)

### What It Is
The new Places API (v1) provides Nearby Search to find places by type and location. Perfect for finding quiet, safe spaces (parks, libraries, cafes) when meltdown risk is elevated.

### Setup
```kotlin
// build.gradle.kts
dependencies {
    implementation("com.google.android.libraries.places:places:4.1.0")
}
```

```kotlin
// Initialize in Application or Activity
Places.initializeWithNewPlacesApiEnabled(context, "YOUR_API_KEY")
```

### Searching for Quiet/Safe Places Nearby

```kotlin
import com.google.android.libraries.places.api.Places
import com.google.android.libraries.places.api.model.Place
import com.google.android.libraries.places.api.model.CircularBounds
import com.google.android.libraries.places.api.net.SearchNearbyRequest

class SafePlaceFinder(context: Context) {
    
    private val placesClient = Places.createClient(context)
    
    /**
     * Find quiet, safe spaces within radius of current location
     * Good types for autism-friendly spaces:
     * - "park" — open green spaces, lower stimulation
     * - "library" — quiet by design
     * - "church" — typically quiet and calm
     * - "museum" — often quiet zones
     * - "cafe" — smaller ones can be quiet
     */
    suspend fun findQuietPlaces(
        latitude: Double,
        longitude: Double,
        radiusMeters: Double = 1000.0
    ): List<SafePlace> {
        
        val placeFields = listOf(
            Place.Field.ID,
            Place.Field.DISPLAY_NAME,
            Place.Field.FORMATTED_ADDRESS,
            Place.Field.LOCATION,
            Place.Field.TYPES,
            Place.Field.RATING,
            Place.Field.CURRENT_OPENING_HOURS,
            Place.Field.WEBSITE_URI
        )
        
        // Search for parks
        val parkRequest = SearchNearbyRequest.builder(
            CircularBounds.newInstance(
                LatLng(latitude, longitude),
                radiusMeters
            ),
            placeFields
        )
            .setIncludedTypes(listOf("park", "library"))
            .setMaxResultCount(10)
            .build()
        
        return try {
            val response = placesClient.searchNearby(parkRequest).await()
            response.places.map { place ->
                SafePlace(
                    name = place.displayName ?: "Unknown",
                    address = place.formattedAddress ?: "",
                    latitude = place.location?.latitude ?: 0.0,
                    longitude = place.location?.longitude ?: 0.0,
                    type = categorizePlace(place.placeTypes),
                    isOpenNow = place.currentOpeningHours?.isOpen ?: false,
                    distanceMeters = calculateDistance(
                        latitude, longitude,
                        place.location?.latitude ?: 0.0,
                        place.location?.longitude ?: 0.0
                    )
                )
            }.sortedBy { it.distanceMeters }
        } catch (e: Exception) {
            emptyList()
        }
    }
    
    /**
     * Search specifically for quiet types — expand search if few results
     */
    suspend fun findSafeSpacesExpanded(lat: Double, lng: Double): List<SafePlace> {
        val quietTypes = listOf("park", "library")
        val calmTypes = listOf("church", "museum", "art_gallery")
        
        val results = mutableListOf<SafePlace>()
        
        // First pass: very quiet places within 500m
        results.addAll(findQuietPlaces(lat, lng, 500.0))
        
        // If few results, expand radius and types
        if (results.size < 3) {
            val expandedFields = listOf(
                Place.Field.ID, Place.Field.DISPLAY_NAME,
                Place.Field.LOCATION, Place.Field.TYPES
            )
            
            val expandedRequest = SearchNearbyRequest.builder(
                CircularBounds.newInstance(LatLng(lat, lng), 1500.0),
                expandedFields
            )
                .setIncludedTypes(quietTypes + calmTypes)
                .setMaxResultCount(15)
                .build()
            
            val response = placesClient.searchNearby(expandedRequest).await()
            results.addAll(response.places.map { /* map to SafePlace */ })
        }
        
        return results.distinctBy { it.name }.sortedBy { it.distanceMeters }
    }
    
    private fun categorizePlace(types: List<String>?): String {
        return when {
            types?.contains("park") == true -> "🌳 Park"
            types?.contains("library") == true -> "📚 Library"
            types?.contains("church") == true -> "⛪ Quiet Building"
            types?.contains("museum") == true -> "🏛️ Museum"
            else -> "📍 Safe Space"
        }
    }
    
    private fun calculateDistance(
        lat1: Double, lon1: Double, lat2: Double, lon2: Double
    ): Double {
        val results = FloatArray(1)
        Location.distanceBetween(lat1, lon1, lat2, lon2, results)
        return results[0].toDouble()
    }
}

data class SafePlace(
    val name: String,
    val address: String,
    val latitude: Double,
    val longitude: Double,
    val type: String,
    val isOpenNow: Boolean,
    val distanceMeters: Double
)
```

### Hackathon Gotchas
- **API Key required** — enable "Places API (New)" in Google Cloud Console (not the old Places API!)
- **Billing must be enabled** — but Google gives $200/month free credit (more than enough)
- `SearchNearbyRequest` is the new API — don't use deprecated `findCurrentPlace`
- **`includedTypes`** uses [Google's place type strings](https://developers.google.com/maps/documentation/places/web-service/place-types) — NOT free-text
- **Rate limit:** 6000 QPM per project (generous for hackathon)
- **New API vs old:** Make sure you call `Places.initializeWithNewPlacesApiEnabled()` — the old `Places.initialize()` uses the legacy API
- Available place types for quiet spaces: `park`, `library`, `church`, `museum`, `art_gallery`, `spa`, `cemetery` (actually very quiet!)

---

## 9. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANDROID APP (Phone)                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐         │
│  │ AudioRecord  │  │ Accelerometer│  │ FusedLocation  │         │
│  │ (Noise dB)   │  │ (Movement)   │  │ Provider (GPS) │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘         │
│         └──────────────────┼─────────────────┘                  │
│                            ▼                                     │
│                  ┌──────────────────┐                            │
│                  │  Sensor Fusion   │◄────── Health Connect      │
│                  │   Service        │        (HR, HRV, Sleep)    │
│                  └────────┬─────────┘                            │
│                           │                                      │
│              ┌────────────┼────────────┐                         │
│              ▼            ▼            ▼                          │
│   ┌──────────────┐ ┌──────────┐ ┌──────────────┐               │
│   │  LiteRT      │ │ Gemini   │ │ Places API   │               │
│   │  On-Device   │ │ 2.5 Flash│ │ (Safe Spaces)│               │
│   │  Quick Risk  │ │ Deep     │ │              │               │
│   │  Assessment  │ │ Analysis │ │              │               │
│   └──────┬───────┘ └────┬─────┘ └──────┬───────┘               │
│          └───────────────┼──────────────┘                        │
│                          ▼                                       │
│                ┌──────────────────┐                              │
│                │  ADK Multi-Agent │                              │
│                │  Orchestrator    │                              │
│                │  (Backend/Cloud) │                              │
│                └────────┬─────────┘                              │
│                         │                                        │
│         ┌───────────────┼───────────────┐                        │
│         ▼               ▼               ▼                        │
│  ┌─────────────┐ ┌────────────┐ ┌──────────────┐               │
│  │ Alert UI    │ │ Caregiver  │ │ Calming      │               │
│  │ (Risk Level)│ │ Notif.     │ │ Interface    │               │
│  └─────────────┘ └────────────┘ └──────────────┘               │
└─────────────────────────────────────────────────────────────────┘

Backend (Cloud Run / Firebase):
┌─────────────────────────────────────────────────┐
│  Google ADK Multi-Agent System                   │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌───────────┐ │
│  │ Sensor     │  │ Pattern    │  │ Response  │ │
│  │ Analyst    │  │ Detector   │  │ Planner   │ │
│  │ Agent      │  │ Agent      │  │ Agent     │ │
│  └────────────┘  └────────────┘  └───────────┘ │
│         │               │              │         │
│         └───────┬───────┘              │         │
│                 ▼                      ▼         │
│          ┌────────────┐        ┌───────────┐    │
│          │ Risk       │        │ Safe Space│    │
│          │ Assessor   │        │ Finder    │    │
│          └────────────┘        └───────────┘    │
│                                                  │
│  A2A Protocol: Agent Cards at /.well-known/      │
│  Gemini 2.5 Flash: All LLM inference             │
└─────────────────────────────────────────────────┘
```

### Data Flow
1. **Continuous:** Phone sensors (audio, accelerometer, GPS) + Health Connect (HR, HRV, sleep) feed into Sensor Fusion Service
2. **Every 30s:** LiteRT on-device model does quick risk screening (< 1ms)
3. **On elevated risk:** Full sensor snapshot sent to ADK backend for deep analysis with Gemini 2.5 Flash
4. **ADK agents:** Parallel analysis (sensor + pattern) → sequential response (safe space finding → notification)
5. **Alert:** Push notification to user and/or caregiver with risk level, contributing factors, nearby safe spaces

---

## 10. Hackathon Gotchas & Tips

### Pre-Hackathon Setup Checklist
- [ ] Google Cloud account with billing enabled
- [ ] Gemini API key from [aistudio.google.com](https://aistudio.google.com)
- [ ] Places API (New) enabled in Cloud Console
- [ ] Health Connect app installed on test device
- [ ] Pre-trained LiteRT model with synthetic data
- [ ] `pip install google-adk a2a-sdk google-generativeai` on dev machine
- [ ] Android Studio with latest SDK (API 34+)
- [ ] Test device with smartwatch syncing to Health Connect

### Priority Order (What to Build First)
1. **Hour 0-4:** Android app with sensor collection (noise, movement, location) + Health Connect
2. **Hour 4-8:** Gemini 2.5 Flash integration with structured output for risk assessment
3. **Hour 8-14:** ADK multi-agent backend (sensor analyst + pattern detector + response planner)
4. **Hour 14-18:** Places API integration for safe space finding
5. **Hour 18-22:** LiteRT on-device quick screening
6. **Hour 22-28:** Alert UI, caregiver notifications, calming interface
7. **Hour 28-36:** Polish, edge cases, demo script
8. **Hour 36-48:** Slides, demo rehearsal, A2A architecture story

### What Impresses Google Judges
1. **ADK multi-agent** — shows you know the latest Google AI stack
2. **Gemini 2.5 Flash** with structured output — demonstrates advanced API usage
3. **On-device + Cloud hybrid** — LiteRT for speed, Gemini for depth
4. **Health Connect** — shows Android ecosystem knowledge
5. **A2A protocol** — even just the architecture diagram shows vision
6. **Accessibility focus** — deeply aligned with Google's mission

### Cost Estimates (Free Tier)
| Service | Free Tier | Enough for Hackathon? |
|---------|-----------|----------------------|
| Gemini 2.5 Flash | 15 RPM, 1500 RPD | ✅ Yes, plan calls carefully |
| Places API (New) | $200/month credit | ✅ Yes, ~thousands of requests |
| Health Connect | Free | ✅ Yes |
| Cloud Run | 2M requests/month free | ✅ Yes |
| Firebase | Spark plan free | ✅ Yes |

### Common Pitfalls
- **Don't** try to build a Wear OS app — use Health Connect from phone
- **Don't** use Gemini 2.5 Pro for everything — Flash is 10x cheaper and fast enough
- **Don't** forget to handle permission denials gracefully
- **Don't** call Gemini API in a tight loop — batch sensor data into snapshots
- **Do** have mock/demo data ready in case real sensors fail during demo
- **Do** use structured output (`response_schema`) for ALL Gemini calls
- **Do** show the multi-agent event graph from `adk web` in your presentation
