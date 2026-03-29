# Frontend Demo Mode Spec — Medak

> Generated from analysis of current codebase at `medak/frontend/`.
> All file paths relative to `medak/frontend/`.

---

## Table of Contents

1. [Current State Summary](#1-current-state-summary)
2. [Camera Preview During Demo](#2-camera-preview-during-demo)
3. [Transcript Display — Three Speaker Types](#3-transcript-display--three-speaker-types)
4. [Phase Transitions — Visual Feedback](#4-phase-transitions--visual-feedback)
5. [Confidence Bar Improvements](#5-confidence-bar-improvements)
6. [User Question Overlay — Demo Auto-Dismiss](#6-user-question-overlay--demo-auto-dismiss)
7. [Demo Mode Configuration](#7-demo-mode-configuration)
8. [Screen Mirroring / Presentation Polish](#8-screen-mirroring--presentation-polish)
9. [Implementation Order](#9-implementation-order)

---

## 1. Current State Summary

### Screens

| Screen | File | Status |
|--------|------|--------|
| SOS / Home | `app/index.tsx` | ✅ Complete — 3 emergency buttons (AMBULANCE/POLICE/FIRE), settings gear, haptic on press |
| Session | `app/session.tsx` | ⚠️ Functional but needs demo polish (see below) |
| Alarm | `app/alarm.tsx` | ✅ Complete — countdown timer, pulsing background, haptics, auto-call |
| Settings | `app/settings.tsx` | ✅ Complete — personal info text field, save button |

### Key Libraries Already Installed

- `expo-camera` (v17) — CameraView + useCameraPermissions already imported in session.tsx
- `expo-haptics` — already used throughout
- `expo-av` — mic capture working
- `expo-location` — location fetching working
- `react-native-paper` (v5) — MD3 dark theme, ProgressBar, Surface, etc.
- `expo-sensors` — DeviceMotion for fall/shake detection

### Session Screen Current State

The session screen (`app/session.tsx`) already has:
- **Camera preview**: CameraView renders as background during INTAKE, TRIAGE, and LIVE_CALL (full `flex: 1`)
- **Phase-based sub-views**: IntakeView, TriageView, LiveCallView, ResolvedView, FailedView
- **Transcript bubbles**: Yes — `TranscriptBubble` component with left/right alignment
- **Confidence bar**: Yes — `ProgressBar` from react-native-paper in TriageView
- **User question overlay**: Yes — bottom sheet with DA/NE buttons + text input, auto-dismiss after 5s
- **WebSocket**: `SessionWebSocket` class handles transcript, STATUS_UPDATE, user_question, RESOLVED, FAILED
- **Haptics**: Periodic during INTAKE, warning on user_question, success on RESOLVED, error on FAILED

### Critical Issue: Camera Obscures UI

Currently the `CameraView` has `style={styles.cameraPreview}` which is `flex: 1`. The camera and the phase sub-views are **siblings** inside the SafeAreaView, so they compete for space rather than overlaying. The camera takes up the entire screen and the UI content either gets pushed below or fights for layout. **This needs to be restructured so the camera is a background layer with the UI overlaid on top.**

### TranscriptEntry Type (current)

```typescript
// lib/types.ts
export interface TranscriptEntry {
  id: string;
  speaker: "assistant" | "user";  // ← only 2 types, no "dispatch"
  text: string;
  timestamp: number;
}
```

### WebSocket transcript message (current)

```typescript
// From server:
{ type: "transcript"; speaker: "assistant" | "user"; text: string }
```

### Theme Custom Colors (current)

```typescript
bubbleAssistant: "#1e3a5f",  // dark blue
bubbleUser: "#166534",        // dark green
// No bubbleDispatch color exists
```

---

## 2. Camera Preview During Demo

**Priority: P0** — core visual wow factor for judges

### Current State
- CameraView is rendered but layout is broken — camera and UI fight for `flex: 1` space
- Camera captures frames at ~1.3fps and sends base64 JPEG to backend via WebSocket
- Camera shows during INTAKE, TRIAGE, and LIVE_CALL

### What Needs to Change

#### 2.1 Layout restructure — camera as absolute background

**File:** `app/session.tsx`

The camera must be an absolutely positioned background layer. The UI content must overlay it. Currently they're flex siblings.

```
<SafeAreaView style={[styles.container, { backgroundColor }]}>
  {/* Camera as absolute background */}
  {showCamera && cameraPermission?.granted && (
    <CameraView
      ref={cameraRef}
      style={StyleSheet.absoluteFillObject}  // ← absolute fill
      facing="back"
      animateShutter={false}
      onCameraReady={onCameraReady}
    />
  )}
  
  {/* Semi-transparent overlay for readability */}
  {showCamera && (
    <View style={[StyleSheet.absoluteFillObject, styles.cameraOverlay]} />
  )}

  {/* UI content on top */}
  {phase === "TRIAGE" && <TriageView ... />}
  {phase === "LIVE_CALL" && <LiveCallView ... />}
  ...
</SafeAreaView>
```

Add new style:
```typescript
cameraOverlay: {
  backgroundColor: "rgba(0, 0, 0, 0.55)",  // darken for text readability
},
```

#### 2.2 Camera visibility per phase

| Phase | Camera Visible | Rationale |
|-------|---------------|-----------|
| INTAKE | ✅ Yes | Shows app is "activating sensors" |
| TRIAGE | ✅ Yes | **Key demo moment** — looks like AI is analyzing the scene |
| LIVE_CALL | ❌ No | Switch to "call UI" look — camera would be distracting |
| RESOLVED | ❌ No | Green success screen, no camera |
| FAILED | ❌ No | Error screen |

Add computed variable:
```typescript
const showCamera = (phase === "INTAKE" || phase === "TRIAGE") && cameraPermission?.granted;
```

#### 2.3 Frame capture in demo mode

In demo mode, the backend doesn't actually process video frames, but we should **still capture and send them** so the WebSocket traffic looks real in dev tools. However, reduce frame rate to save battery:

```typescript
// lib/camera.ts — add demo mode support
const FRAME_INTERVAL_MS = DEMO_MODE ? 2000 : 750;  // slower in demo
```

---

## 3. Transcript Display — Three Speaker Types

**Priority: P0** — judges need to see multi-agent communication clearly

### Current State
- `TranscriptEntry.speaker` is `"assistant" | "user"` — only 2 types
- Both the triage AI and dispatch 112 messages come through as `"assistant"`
- Bubble colors: assistant = dark blue (`#1e3a5f`), user = dark green (`#166534`)
- Labels: assistant shows "Sistem", user shows "Vi"
- Alignment: user = right, assistant = left

### What Needs to Change

#### 3.1 Add "dispatch" speaker type

**File:** `lib/types.ts`

```typescript
export interface TranscriptEntry {
  id: string;
  speaker: "assistant" | "user" | "dispatch";  // ← add "dispatch"
  text: string;
  timestamp: number;
}

// WSMessageFromServer — transcript type:
| { type: "transcript"; speaker: "assistant" | "user" | "dispatch"; text: string }
```

#### 3.2 Add dispatch bubble color to theme

**File:** `lib/theme.ts`

Add to `custom`:
```typescript
bubbleDispatch: "#7c2d12",  // dark orange/rust — matches FIRE color family
```

Update `AppTheme` type to include `bubbleDispatch: string`.

#### 3.3 Update TranscriptBubble component

**File:** `app/session.tsx` — `TranscriptBubble` function

```typescript
function TranscriptBubble({ entry, theme }: { entry: TranscriptEntry } & ThemeProp) {
  const isUser = entry.speaker === "user";
  const isDispatch = entry.speaker === "dispatch";
  
  const bgColor = isUser
    ? theme.custom.bubbleUser
    : isDispatch
      ? theme.custom.bubbleDispatch
      : theme.custom.bubbleAssistant;

  const label = isUser ? "Vi" : isDispatch ? "Dispečer 112" : "Medak AI";
  const labelColor = isUser
    ? "#4ade80"      // green accent
    : isDispatch
      ? "#fb923c"    // orange accent
      : "#60a5fa";   // blue accent

  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.bubbleRight : styles.bubbleLeft,
        { backgroundColor: bgColor },
      ]}
    >
      <Text
        variant="labelSmall"
        style={{ color: labelColor, marginBottom: 2, fontWeight: "700" }}
      >
        {label}
      </Text>
      <Text variant="bodyLarge" style={{ color: theme.colors.onPrimary }}>
        {entry.text}
      </Text>
    </View>
  );
}
```

#### 3.4 Update addTranscript callback

**File:** `app/session.tsx`

```typescript
const addTranscript = useCallback(
  (speaker: "assistant" | "user" | "dispatch", text: string) => {
    setTranscript((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        speaker,
        text,
        timestamp: Date.now(),
      },
    ]);
  },
  []
);
```

#### 3.5 Update WebSocket callback type

**File:** `lib/websocket.ts`

```typescript
export interface WSCallbacks {
  onTranscript: (speaker: "assistant" | "user" | "dispatch", text: string) => void;
  // ... rest unchanged
}
```

#### 3.6 Auto-scroll (already working)

Current code already scrolls to end on transcript change:
```typescript
useEffect(() => {
  scrollRef.current?.scrollToEnd({ animated: true });
}, [transcript]);
```
✅ No change needed.

#### 3.7 Typing animation (P2 — nice polish)

Optional: Add a brief "typing" indicator before each new message appears. Implemented as a temporary entry with animated dots (`...`).

Not worth the complexity for demo day — the messages arrive fast enough from the scripted backend. **Skip for now.**

---

## 4. Phase Transitions — Visual Feedback

**Priority: P1** — makes the demo feel alive and dramatic

### Current State
- Phase transitions are instant — state updates, UI swaps immediately
- Background color changes per phase (via `backgroundColor` computed var)
- Haptics: periodic light buzz during INTAKE, warning on user_question, success on RESOLVED
- No transition animations between phases

### What Needs to Change

#### 4.1 Animated background color transitions

**File:** `app/session.tsx`

Use `Animated.Value` for background color interpolation (similar to how `alarm.tsx` does it):

```typescript
const bgAnim = useRef(new Animated.Value(0)).current;
const [prevPhase, setPrevPhase] = useState<SessionPhase>("INTAKE");

useEffect(() => {
  // Animate background on phase change
  bgAnim.setValue(0);
  Animated.timing(bgAnim, {
    toValue: 1,
    duration: 600,
    useNativeDriver: false,
  }).start();
  setPrevPhase(phase);
}, [phase]);
```

This creates a smooth color transition between phases instead of an instant swap.

#### 4.2 Phase-specific haptic feedback

**File:** `app/session.tsx`

Add haptics on every phase transition:

```typescript
useEffect(() => {
  switch (phase) {
    case "TRIAGE":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case "LIVE_CALL":
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case "RESOLVED":
      // Already exists in onResolved callback — keep it
      break;
  }
}, [phase]);
```

#### 4.3 TRIAGE → LIVE_CALL dramatic transition

When phase changes to LIVE_CALL, show a brief full-screen overlay for 2 seconds:

```typescript
const [showCallTransition, setShowCallTransition] = useState(false);

useEffect(() => {
  if (phase === "LIVE_CALL") {
    setShowCallTransition(true);
    setTimeout(() => setShowCallTransition(false), 2500);
  }
}, [phase]);
```

Render:
```tsx
{showCallTransition && (
  <View style={styles.callTransitionOverlay}>
    <Animated.View style={[styles.pulsingIcon, { opacity: pulseAnim }]}>
      <Icon source="phone" size={80} color="#ffffff" />
    </Animated.View>
    <Text variant="displaySmall" style={styles.callTransitionText}>
      Pozivam 112...
    </Text>
  </View>
)}
```

Style:
```typescript
callTransitionOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(220, 38, 38, 0.9)",  // red overlay
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
},
callTransitionText: {
  color: "#ffffff",
  fontWeight: "900",
  fontSize: 32,
  marginTop: 24,
},
```

#### 4.4 RESOLVED screen enhancements

Current ResolvedView is decent but could be more dramatic. Add:
- Animated checkmark scale-in (from 0 to 1 with spring)
- Pulsing green background
- Larger ETA text

**File:** `app/session.tsx` — `ResolvedView` function

```typescript
function ResolvedView({ theme, etaMinutes }: ThemeProp & { etaMinutes: number | null }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.centeredView}>
      <Animated.Text
        style={[
          styles.statusIcon,
          { color: theme.custom.success, transform: [{ scale: scaleAnim }] },
        ]}
      >
        ✓
      </Animated.Text>
      <Text variant="displaySmall" style={{ color: theme.custom.success, textAlign: "center", fontWeight: "900" }}>
        Pomoć je na putu
      </Text>
      {etaMinutes != null && (
        <Text variant="displayMedium" style={{ color: "#ffffff", textAlign: "center", marginTop: 24, fontWeight: "900" }}>
          ETA: {etaMinutes} min
        </Text>
      )}
      <Text variant="titleLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center", marginTop: 32 }}>
        Ostanite na lokaciji i sačekajte dolazak ekipe
      </Text>
    </View>
  );
}
```

#### 4.5 LiveCallView header enhancement

Current `LiveCallView` shows a static orange header "Poziv u toku — Hitna pomoć (194)".

Add a pulsing phone icon:

```typescript
function LiveCallView({ ... }) {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.flex}>
      <Surface style={[styles.callHeader, { backgroundColor: theme.custom.warning }]} elevation={2}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Animated.View style={{ opacity: pulseAnim }}>
            <Icon source="phone-in-talk" size={28} color={theme.colors.background} />
          </Animated.View>
          <Text variant="titleLarge" style={{ color: theme.colors.background, fontWeight: "700" }}>
            Poziv u toku — {emergencyLabel} ({emergencyNumber})
          </Text>
        </View>
      </Surface>
      <TranscriptList transcript={transcript} scrollRef={scrollRef} theme={theme} />
    </View>
  );
}
```

---

## 5. Confidence Bar Improvements

**Priority: P1** — currently functional but visually basic

### Current State
- Uses `ProgressBar` from react-native-paper in `TriageView`
- Fixed color: `theme.custom.confidenceBar` (`#22c55e` — green always)
- Shows percentage as text: `Pouzdanost: {Math.round(confidence * 100)}%`
- Height: 8px, border-radius: 4px
- No animation — value snaps directly

### What Needs to Change

#### 5.1 Dynamic color based on value

**File:** `app/session.tsx` — `TriageView`

Replace fixed color with computed color:

```typescript
const confidenceColor = useMemo(() => {
  const pct = confidence * 100;
  if (pct < 40) return "#ef4444";      // red
  if (pct < 70) return "#eab308";      // yellow
  return "#22c55e";                     // green
}, [confidence]);
```

Use `confidenceColor` in the ProgressBar `color` prop.

#### 5.2 Animated smooth transitions

React Native Paper's `ProgressBar` already supports animated `progress` prop transitions. However, to ensure smoothness, wrap the confidence value in an `Animated.Value` and use `Animated.timing`:

```typescript
const confidenceAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(confidenceAnim, {
    toValue: confidence,
    duration: 800,
    useNativeDriver: false,
  }).start();
}, [confidence]);
```

Then create a custom animated bar instead of using ProgressBar (since ProgressBar doesn't accept Animated values well):

```tsx
<View style={styles.confidenceBarTrack}>
  <Animated.View
    style={[
      styles.confidenceBarFill,
      {
        backgroundColor: confidenceColor,
        width: confidenceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", "100%"],
        }),
      },
    ]}
  />
</View>
```

Styles:
```typescript
confidenceBarTrack: {
  height: 12,
  borderRadius: 6,
  backgroundColor: "#333333",
  overflow: "hidden",
},
confidenceBarFill: {
  height: "100%",
  borderRadius: 6,
},
```

#### 5.3 Larger percentage text for demo visibility

```typescript
<Text variant="titleMedium" style={{ color: confidenceColor, fontWeight: "700" }}>
  {Math.round(confidence * 100)}%
</Text>
```

---

## 6. User Question Overlay — Demo Auto-Dismiss

**Priority: P0** — must appear to show cross-agent relay, but auto-dismiss in demo

### Current State
- Question overlay exists: bottom sheet with DA/NE buttons and text input
- Auto-dismiss after 5 seconds (hardcoded)
- Haptic warning on appearance
- Renders when `pendingQuestion` is non-null

### What Needs to Change

#### 6.1 Demo mode auto-dismiss timing

**File:** `app/session.tsx`

Currently auto-dismisses after 5000ms. In demo mode, change to **1500ms** — just long enough for judges to see it appear, but short enough that the demo_user_agent's automatic response feels natural.

```typescript
const QUESTION_AUTO_DISMISS_MS = DEMO_MODE ? 1500 : 5000;

// In the onUserQuestion callback:
questionTimerRef.current = setTimeout(() => {
  setPendingQuestion(null);
}, QUESTION_AUTO_DISMISS_MS);
```

#### 6.2 Enhanced question overlay styling

Make it more dramatic and visible for demo presentation:

```typescript
<Surface
  style={[
    styles.questionOverlay,
    { backgroundColor: "rgba(30, 30, 30, 0.95)" },  // near-opaque for readability
  ]}
  elevation={5}
>
  <Text variant="labelLarge" style={{ color: "#fb923c", marginBottom: 4 }}>
    ⚡ DISPEČER PITA:
  </Text>
  <Text variant="headlineSmall" style={{ color: "#ffffff", marginBottom: 16, fontWeight: "700" }}>
    {pendingQuestion}
  </Text>
  {/* DA/NE buttons — same as current but larger */}
</Surface>
```

#### 6.3 Visual feedback when auto-dismissed

In demo mode, when auto-dismissed, briefly flash a subtle "Odgovoreno automatski" label before the overlay disappears (200ms fade):

```typescript
const [autoAnswered, setAutoAnswered] = useState(false);

// In the auto-dismiss timeout:
questionTimerRef.current = setTimeout(() => {
  if (DEMO_MODE) {
    setAutoAnswered(true);
    setTimeout(() => {
      setPendingQuestion(null);
      setAutoAnswered(false);
    }, 500);
  } else {
    setPendingQuestion(null);
  }
}, QUESTION_AUTO_DISMISS_MS);
```

---

## 7. Demo Mode Configuration

**Priority: P0** — demo literally doesn't work without this

### Current State
- `lib/config.ts` has `API_BASE` from env var `EXPO_PUBLIC_API_URL` with fallback to `http://10.225.114.241:8080`
- No demo mode flag exists
- Location is always fetched live via `expo-location`
- No demo-specific env file exists

### What Needs to Change

#### 7.1 Create demo mode config

**File:** `lib/config.ts`

```typescript
export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || "http://10.225.114.241:8080";

export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === "true";

// Hardcoded Belgrade coordinates for demo
export const DEMO_LOCATION = {
  latitude: 44.8065,
  longitude: 20.4789,
  accuracy: 10,
  address: "Knez Mihailova, Beograd",
};
```

#### 7.2 Create `.env.demo` file

**File:** `.env.demo` (new file)

```
EXPO_PUBLIC_DEMO_MODE=true
EXPO_PUBLIC_API_URL=http://10.225.114.241:8080
```

Usage: `cp .env.demo .env && npx expo start`

#### 7.3 Skip location permission in demo mode

**File:** `lib/location.ts`

```typescript
import { DEMO_MODE, DEMO_LOCATION } from "./config";

export async function getCurrentLocation(): Promise<LocationData | null> {
  if (DEMO_MODE) {
    return DEMO_LOCATION;
  }
  
  // ... existing location code
}
```

#### 7.4 Skip camera permission prompt in demo mode (optional)

Camera permission is still needed even in demo mode because we want to **show** the camera preview. The permission prompt is fine — it only appears once and can be pre-approved before the demo starts.

**No change needed** — just pre-approve camera permission before the live demo.

#### 7.5 Disable danger detection in demo mode

**File:** `lib/DangerDetectionContext.tsx`

In demo mode, don't run fall/shake detection — we don't want accidental alarms during the presentation:

```typescript
import { DEMO_MODE } from "./config";

// In DangerDetectionProvider:
const suppressed = pathname === "/session" || pathname === "/alarm" || alarmActive || DEMO_MODE;
```

---

## 8. Screen Mirroring / Presentation Polish

**Priority: P1** — presentation quality

### Current State
- Dark theme: ✅ already using `MD3DarkTheme` with `#1a1a1a` background
- Text sizes: mixed — some `bodyLarge`, some `labelSmall`
- Colors: good contrast on dark background
- No sensitive info visible (user personal info only on settings screen)

### What Needs to Change

#### 8.1 Increase text sizes for visibility

**File:** `app/session.tsx`

Transcript bubbles should use larger text when presenting:

```typescript
// In TranscriptBubble:
<Text variant={DEMO_MODE ? "titleMedium" : "bodyLarge"} style={{ color: theme.colors.onPrimary }}>
  {entry.text}
</Text>
```

Phase headers, confidence text, and status labels should all use at least `titleMedium`.

#### 8.2 Increase bubble sizing

```typescript
bubble: {
  padding: DEMO_MODE ? 16 : 12,
  borderRadius: 16,
  maxWidth: "85%",
},
```

#### 8.3 Confidence bar — make it thicker

```typescript
confidenceBarTrack: {
  height: DEMO_MODE ? 16 : 12,
  borderRadius: 8,
  ...
},
```

#### 8.4 Status labels — larger and bolder

In TriageView, the "Analiza u toku" label and mic indicator should be more prominent:

```typescript
<Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "700" }}>
  🔍 Analiza u toku
</Text>
```

#### 8.5 Camera overlay opacity

The camera overlay darkness should be tuned for projector readability:
```typescript
cameraOverlay: {
  backgroundColor: "rgba(0, 0, 0, 0.65)",  // fairly dark to ensure text contrast
},
```

---

## 9. Implementation Order

### P0 — Demo Doesn't Work Without These

| # | Task | File(s) | Est. Effort |
|---|------|---------|-------------|
| 1 | Demo mode config (`DEMO_MODE`, `DEMO_LOCATION`, `.env.demo`) | `lib/config.ts`, `lib/location.ts`, `.env.demo` | 15 min |
| 2 | Camera layout fix — absolute positioning with overlay | `app/session.tsx` | 30 min |
| 3 | Add "dispatch" speaker type + bubble color | `lib/types.ts`, `lib/websocket.ts`, `lib/theme.ts`, `app/session.tsx` | 30 min |
| 4 | User question auto-dismiss 1.5s in demo mode | `app/session.tsx` | 10 min |
| 5 | Camera visibility by phase (show in INTAKE+TRIAGE only) | `app/session.tsx` | 10 min |

**Total P0: ~1.5 hours**

### P1 — Much Better With These

| # | Task | File(s) | Est. Effort |
|---|------|---------|-------------|
| 6 | Confidence bar: animated fill + dynamic color (red→yellow→green) | `app/session.tsx` | 30 min |
| 7 | LIVE_CALL transition overlay ("Pozivam 112..." + pulsing phone icon) | `app/session.tsx` | 30 min |
| 8 | LiveCallView pulsing phone icon in header | `app/session.tsx` | 15 min |
| 9 | RESOLVED view — animated checkmark + larger ETA | `app/session.tsx` | 20 min |
| 10 | Phase transition haptics | `app/session.tsx` | 5 min |
| 11 | Animated background color transitions between phases | `app/session.tsx` | 20 min |
| 12 | Disable danger detection in demo mode | `lib/DangerDetectionContext.tsx` | 5 min |

**Total P1: ~2 hours**

### P2 — Nice Polish

| # | Task | File(s) | Est. Effort |
|---|------|---------|-------------|
| 13 | Larger text sizes for screen mirroring | `app/session.tsx` | 15 min |
| 14 | Thicker confidence bar + bigger bubbles | `app/session.tsx` | 10 min |
| 15 | Question overlay "Odgovoreno automatski" flash | `app/session.tsx` | 15 min |
| 16 | Reduced camera frame rate in demo mode | `lib/camera.ts` | 5 min |

**Total P2: ~45 min**

---

## Appendix: Files Changed Summary

| File | Changes |
|------|---------|
| `lib/config.ts` | Add `DEMO_MODE`, `DEMO_LOCATION` exports |
| `lib/types.ts` | Add `"dispatch"` to `TranscriptEntry.speaker` and WS message types |
| `lib/theme.ts` | Add `bubbleDispatch` to custom colors + `AppTheme` type |
| `lib/websocket.ts` | Update `WSCallbacks.onTranscript` speaker type to include `"dispatch"` |
| `lib/location.ts` | Return hardcoded location in demo mode |
| `lib/camera.ts` | Slower frame interval in demo mode |
| `lib/DangerDetectionContext.tsx` | Suppress danger detection in demo mode |
| `app/session.tsx` | Camera layout fix, 3 bubble types, confidence bar animation, phase transitions, demo auto-dismiss, larger text |
| `.env.demo` | New file — demo env vars |

## Appendix: Backend WebSocket Message Contract

The backend must send `"dispatch"` as a valid speaker value in transcript messages. Verify the backend demo script sends:

```json
{"type": "transcript", "speaker": "dispatch", "text": "Dispečer: Da li je pacijent pri svesti?"}
```

If the backend currently only sends `"assistant"` for both AI and dispatch messages, a backend change is also needed to distinguish them. The frontend is ready to handle it once the type is added.
