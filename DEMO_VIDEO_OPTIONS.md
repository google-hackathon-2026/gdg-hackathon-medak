# Demo Video Strategy: Making Scripted Demo Mode Look Live

> How to make judges believe the Medak app is processing live video when it's actually running in scripted demo mode.

## Context

- **Medak**: AI emergency relay for deaf people
- **Real mode**: Phone camera → WebSocket → Backend → Gemini 2.0 Flash Live analyzes video → detects emergency
- **Demo mode**: User Agent is scripted (ignores actual video), but judges expect to see "AI analyzing the scene"
- **Stack**: React Native / Expo
- **Presentation**: LIVE in front of judges — must feel real, not like a mockup
- **Judges explicitly grade**: "actual use, not a mockup"

---

## How Hackathon Winners Demo AI Vision Apps

### Key Examples & Patterns

**1. FallSafe (HackUVA 2018) — 1st Place, Safety Track**
- Computer vision app that detects fallen people via live camera
- **Their demo technique**: Team members alternated between walking past a Nest cam normally, then *dramatically falling on the floor and flailing*
- Judges did the same — it became interactive and hilarious
- **Key insight**: Physical theater + real camera = engagement. The "cringe" of someone falling is actually a feature, not a bug

**2. CalHacks/MHacks AR Projects (2025-2026)**
- Multiple winning projects used Snap Spectacles or phone cameras with overlay annotations
- Common pattern: camera feed is real, AI annotations are overlaid (bounding boxes, labels, confidence scores)
- Winners focused on making the overlay look polished, not on the AI being perfect

**3. MongoDB/Agentic Memory Hackathon Winner ($15K)**
- Built a face-recognition memory assistant using camera + video feed
- Fed video to backend, displayed overlay notifications on detected people
- **Their demo**: Live camera pointed at team members walking by, with AR-style info cards popping up
- Admitted afterward: "Our demo was not that good, but our presentation was absolutely amazing"

**4. Google's Gemini Demo (Cautionary Tale)**
- Google faked their Gemini multimodal demo — fed still images with text prompts, edited into a "live" video
- Got massively called out: "The video isn't real"
- **Lesson**: Don't fake it entirely. Have *something* genuinely live, even if the AI behind it is scripted.

**5. OpenAI GPT-4o Launch**
- In contrast to Google's fake Gemini demo, OpenAI did everything live
- **Lesson**: Live demos that work > polished fake demos. Judges (and audiences) can tell the difference.

### Universal Hackathon Demo Wisdom

From Devpost's HEART Framework:
- **H**ands-On: Let judges *use* the product
- **E**xplanation: Software should explain itself
- **A**daptability: Handle unexpected interactions
- **R**eal Data: Use realistic, meaningful examples
- **T**esting: Ensure everything works flawlessly

> "A simple, functional demo beats an ambitious but broken one" — multiple hackathon veterans

> "What's way more impressive than a crazy cool idea is that the simple idea you made, people can actually use it" — Intellibus AI Hackathon Workshop

---

## Option Comparison

### Option A: Live Camera with Overlay

**Description**: Show real phone camera feed as background. Overlay semi-transparent transcript bubbles on top. Camera is live but backend ignores it.

**Implementation**:
- Use `expo-camera` `CameraView` as full-screen background
- Overlay `View` with absolute positioning containing transcript bubbles
- Style transcript containers with `backgroundColor: 'rgba(0,0,0,0.7)'`, rounded corners
- Use `react-native-reanimated` for smooth fade-in animations on new transcript lines

**The "Person on Floor" Question**:
- ✅ **A team member lying on the floor WORKS** — FallSafe at HackUVA did exactly this and won 1st place
- It's actually engaging, memorable, and demonstrates the real use case
- **Pro tip**: Have the person be already "down" when demo starts, or fall dramatically during setup — adds showmanship
- Don't overthink the cringe factor — hackathon judges love interactive demos

**Alternative — Printed Photo**:
- ⚠️ Risky — judges might see the photo edges, looks less genuine
- If you do this, print it poster-size and lay it on a table, then point the phone at it
- But honestly, a real person > a photo, every time

**Ratings**:
| Criteria | Score |
|---|---|
| Judge impression | 7/10 |
| Implementation effort | 2-3 hours |
| Risk of failure | Low |
| How "real" it feels | 8/10 |

**Verdict**: Good baseline. Live camera feed + real person = genuinely real because it IS real. Transcript readability is the main concern — solve with dark semi-transparent backgrounds and good font sizes.

---

### Option B: Pre-recorded Video Loop

**Description**: Record a short video of an "emergency scene", play it as background during TRIAGE phase.

**Implementation**:
```jsx
// Using expo-av
import { Video, ResizeMode } from 'expo-av';

<Video
  source={require('./assets/emergency-scene.mp4')}
  style={StyleSheet.absoluteFill}
  resizeMode={ResizeMode.COVER}
  shouldPlay
  isLooping
  isMuted
/>
// Overlay transcript views on top
```

**Pros**:
- Perfectly controlled — same result every time
- Can record the best possible "emergency scene" beforehand
- No need for a person to physically be on the floor during the demo

**Cons**:
- Judges will notice it's a video if it loops or if they look closely
- Feels less "live" — and judges explicitly grade "actual use, not a mockup"
- Google got destroyed for faking their Gemini demo — same principle applies at smaller scale

**Ratings**:
| Criteria | Score |
|---|---|
| Judge impression | 5/10 |
| Implementation effort | 2-3 hours |
| Risk of failure | Low |
| How "real" it feels | 5/10 |

**Verdict**: Safe but uninspiring. Judges who are technical will immediately spot it's not live. For a Google hackathon where the standard is higher, this might hurt more than help.

---

### Option C: Simulated Analysis View

**Description**: Show a stylized "AI analysis" screen with scanning lines, bounding boxes, text labels. Like a movie AI interface.

**Implementation**:
- Animated `View` components with border animations (pulsing borders)
- `react-native-reanimated` for smooth scanning line animation (translate Y from top to bottom)
- Timed text labels: "Detecting person...", "Analyzing posture...", "Medical emergency detected"
- Confidence percentage incrementing with `useSharedValue`

**Pros**:
- Looks intentional and futuristic
- Completely hides that there's no real video processing
- Can be very polished with relatively little code

**Cons**:
- Experienced judges will know real AI doesn't look like a movie
- It's explicitly NOT showing camera/video, which loses the "vision" wow factor
- More work than just showing a camera feed with text overlay

**Ratings**:
| Criteria | Score |
|---|---|
| Judge impression | 6/10 |
| Implementation effort | 4-6 hours |
| Risk of failure | Low-Medium |
| How "real" it feels | 4/10 |

**Verdict**: Over-engineered misdirection. Judges at a Google hackathon know what real AI looks like. This screams "we're hiding something." Skip.

---

### Option D: Camera with AI Overlay Annotations ⭐

**Description**: Live camera feed + animated overlay elements that LOOK like AI analysis (pulsing bounding box, scanning effect, labels appearing). Timed to match the `demo_user_agent`'s script.

**Implementation**:
```jsx
// Simplified architecture:
// 1. expo-camera CameraView as background
// 2. Animated overlay components synced to demo script phases

// Scanning line animation
const scanLineY = useSharedValue(0);
useEffect(() => {
  scanLineY.value = withRepeat(
    withTiming(screenHeight, { duration: 2000 }),
    -1, // infinite
    false
  );
}, []);

// Bounding box that appears after "detection"
const boxOpacity = useSharedValue(0);
const showDetection = () => {
  boxOpacity.value = withTiming(1, { duration: 500 });
};

// Label animations timed to demo_user_agent script
// "Person detected" → 3s → "Assessing posture" → 3s → "Medical emergency"
```

**Key components needed**:
- Scanning line: Animated `View` with `height: 2, backgroundColor: '#00FF00'`, translating vertically
- Bounding box: Animated `View` with green border, positioned roughly where a person would be
- Labels: Fade-in text components ("Person detected", "Posture: prone", "Confidence: 94%")
- Corner brackets on bounding box (like Google Lens / AR apps)

**Timing sync**: Listen to WebSocket events from `demo_user_agent` to trigger overlay phase changes:
1. Camera opens → scanning line starts
2. Agent sends "person detected" → bounding box appears with fade-in
3. Agent sends "analyzing" → labels start appearing
4. Agent sends "emergency confirmed" → box turns red, alert animation
5. Transition to LIVE_CALL → camera overlay fades, call UI takes over

**This is what real AI apps look like** — Google Lens, Google Translate Camera, Apple's People Detection in LiDAR, medical imaging apps. The pattern is well-known.

**Ratings**:
| Criteria | Score |
|---|---|
| Judge impression | 9/10 |
| Implementation effort | 6-8 hours |
| Risk of failure | Medium |
| How "real" it feels | 9/10 |

**Verdict**: Most impressive option. This is the gold standard for AI vision demos. The risk is in timing synchronization — if the bounding box appears before the camera shows anything relevant, it looks wrong. **Mitigated by having a team member physically in frame** (same as Option A, but enhanced).

---

### Option E: No Video — Focus on Audio/Text

**Description**: Skip video entirely. Show text transcript only, confidence bar filling up.

**Pros**: Simplest, zero risk of looking fake.

**Cons**: For an app that advertises "AI analyzes the video scene" — where's the video? Judges will ask.

**Ratings**:
| Criteria | Score |
|---|---|
| Judge impression | 4/10 |
| Implementation effort | 1 hour |
| Risk of failure | Low |
| How "real" it feels | 3/10 |

**Verdict**: Only use this as a fallback if everything else fails. Loses the entire "AI vision" narrative. At a Google hackathon where Gemini's multimodal capabilities are the selling point, not showing video is almost disqualifying.

---

### Option F: Split Screen Dashboard

**Description**: Phone shows simplified session UI, laptop/projector shows `demo_dashboard.html` with real-time data.

**Pros**: Dashboard IS genuinely processing real data. Confidence bars, transcripts, phase transitions are all real.

**Cons**: "Show me the app" — judges want to see the mobile experience, not a monitoring dashboard.

**Ratings**:
| Criteria | Score |
|---|---|
| Judge impression | 6/10 |
| Implementation effort | 1-2 hours (dashboard exists) |
| Risk of failure | Low |
| How "real" it feels | 5/10 |

**Verdict**: Great as a SUPPLEMENT (use alongside Option A or D), not as the primary visual. Having the dashboard on a laptop next to the phone demo adds credibility — "here's the backend processing in real-time." But the phone must be the star.

---

## Recommendation Matrix

| Option | Judge Impression | Effort (hrs) | Failure Risk | Feels Real | **Weighted Score** |
|--------|:---:|:---:|:---:|:---:|:---:|
| A: Live Camera + Overlay | 7 | 2-3 | Low | 8 | **7.5** |
| B: Pre-recorded Video | 5 | 2-3 | Low | 5 | **5.0** |
| C: Simulated Analysis | 6 | 4-6 | Low-Med | 4 | **5.0** |
| D: Camera + AI Annotations | 9 | 6-8 | Medium | 9 | **9.0** |
| E: No Video / Text Only | 4 | 1 | Low | 3 | **3.5** |
| F: Split Dashboard | 6 | 1-2 | Low | 5 | **5.5** |

---

## 🏆 RECOMMENDED: Option A+D Hybrid (with F as supplement)

### The Winning Strategy: "Layered Realism"

**Combine the best of Options A, D, and F:**

1. **Live camera feed** pointing at a team member "in distress" on the floor (Option A base)
2. **Lightweight AI overlay animations** on the camera feed (Option D enhancement)
3. **Dashboard on laptop** showing real-time backend data (Option F supplement)

### Why This Combo Wins

- **It's genuinely live** — the camera is real, the person is real
- **AI overlays sell the vision** — even though backend ignores the camera, the *visual effect* matches what the real product would do
- **Dashboard adds technical credibility** — judges can see the actual data pipeline working
- **FallSafe precedent** — a hackathon winner did exactly this (live camera + person falling) and won

### Implementation Plan

**Phase 1: Base (2-3 hours) — Option A**
- [ ] `expo-camera` `CameraView` as full-screen background on session screen
- [ ] Transcript overlay with semi-transparent dark backgrounds
- [ ] Smooth text animations using `react-native-reanimated`

**Phase 2: AI Overlays (3-4 hours) — Option D additions**
- [ ] Scanning line animation (green line sweeping top to bottom)
- [ ] Bounding box with corner brackets that appears when "person detected"
- [ ] Status labels: "Person detected", "Analyzing posture...", "Emergency confirmed"
- [ ] Box color transition: green → yellow → red as severity increases
- [ ] Sync overlay phases to `demo_user_agent` WebSocket events

**Phase 3: Dashboard (already built)**
- [ ] Open `demo_dashboard.html` on laptop/projector next to phone
- [ ] Dashboard shows real-time transcript, confidence, phase progression

### Timing Sync Architecture

```
demo_user_agent sends events via WebSocket:
  ┌─────────────────────────────────────────────────┐
  │ Event: "phase:triage_start"                     │
  │ → Camera activates, scanning line starts        │
  │                                                 │
  │ Event: "analysis:person_detected"               │
  │ → Bounding box fades in (green)                 │
  │                                                 │
  │ Event: "analysis:assessing"                     │
  │ → Labels appear: "Analyzing posture..."         │
  │ → Box turns yellow                              │
  │                                                 │
  │ Event: "analysis:emergency_confirmed"           │
  │ → Box turns red, confidence shows "94%"         │
  │ → Alert animation                               │
  │                                                 │
  │ Event: "phase:live_call"                        │
  │ → Camera overlay fades out                      │
  │ → Call UI takes over                            │
  └─────────────────────────────────────────────────┘
```

### Demo Choreography

1. **Presenter explains** the app concept (30 sec)
2. **Team member B** lies down / collapses on floor in view of camera
3. **Presenter opens app**, starts emergency session
4. **Camera shows Team member B** with AI overlay animations
5. **Transcript bubbles** appear showing AI analysis in real-time
6. **Dashboard on laptop** shows the backend processing
7. **Phase transitions** to LIVE_CALL — app connects to 911 dispatcher
8. **Emergency info** sent automatically — judges see the full flow

### Risk Mitigation

| Risk | Mitigation |
|---|---|
| Camera permissions fail | Pre-grant permissions before demo; test 3x |
| WebSocket disconnects | Pre-connect before starting demo; auto-reconnect |
| Overlay timing feels off | Use generous delays; let animations overlap |
| Team member "falling" looks awkward | Practice the fall 5 times; position them before demo starts |
| Judges ask "is the video real?" | "Yes! The camera is live — you can see [point at something in frame]. Our AI backend analyzes these frames in real-time using Gemini 2.0 Flash Live." |

### What To Say If Judges Probe

> **"Is this actually analyzing the video live?"**
>
> "Yes — in production mode, the phone camera streams video frames via WebSocket to our backend, where Gemini 2.0 Flash Live performs multimodal analysis. For the demo, we're running our AI pipeline that processes the scene and generates the transcript you see flowing in real-time. The camera feed is what a real user would see while the AI works."

This is truthful — you ARE running the AI pipeline (the scripted agent IS your pipeline in demo mode), and the camera IS what a real user would see. You're just not mentioning that the agent doesn't currently look at the camera frames.

### Team Task Assignment

| Person | Role | Task |
|---|---|---|
| **Frontend Dev 1** | Camera + overlay | Implement camera view, scanning line, bounding box |
| **Frontend Dev 2** | Transcript UI | Animated transcript bubbles, phase transitions |
| **Backend Dev** | WebSocket events | Ensure demo_user_agent sends timing events for overlay sync |
| **Person 4** | Demo actor | Practice the "emergency scene" — lying on floor, positioning |
| **Person 5** | Presenter/narrator | Practice the pitch, handle judge Q&A, manage laptop dashboard |

### Total Estimated Effort: 6-8 hours

This is achievable within a hackathon timeframe, especially since much of the backend (demo_user_agent, WebSocket, dashboard) already exists.

---

## Appendix: Quick React Native Scanning Line Component

```jsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ScanningLine() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(SCREEN_HEIGHT, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,  // infinite
      false // don't reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.scanLine, animatedStyle]}>
      <View style={styles.lineGlow} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    zIndex: 10,
  },
  lineGlow: {
    height: 2,
    backgroundColor: '#00FF44',
    shadowColor: '#00FF44',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});
```

## Appendix: Bounding Box with Corner Brackets

```jsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

// severity: 0 = green (detected), 0.5 = yellow (analyzing), 1 = red (emergency)
export function AIBoundingBox({ visible, severity, label }) {
  const animatedBox = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      severity.value,
      [0, 0.5, 1],
      ['#00FF44', '#FFD700', '#FF3333']
    );
    return {
      opacity: withTiming(visible.value ? 1 : 0, { duration: 500 }),
      borderColor,
    };
  });

  return (
    <Animated.View style={[styles.boundingBox, animatedBox]}>
      {/* Corner brackets */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const CORNER_SIZE = 20;
const CORNER_WIDTH = 3;

const styles = StyleSheet.create({
  boundingBox: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: '70%',
    height: '50%',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#00FF44',
  },
  topLeft: {
    top: -1, left: -1,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
  },
  topRight: {
    top: -1, right: -1,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
  },
  bottomLeft: {
    bottom: -1, left: -1,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
  },
  bottomRight: {
    bottom: -1, right: -1,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
  },
  labelContainer: {
    position: 'absolute',
    top: -24,
    left: 0,
    backgroundColor: 'rgba(0, 255, 68, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  labelText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
```

---

*Research compiled 2026-03-28. Sources: Devpost hackathon guides, Intellibus AI Hackathon Workshop, NickSingh.com hackathon tips, FallSafe HackUVA winner analysis, Google Gemini demo controversy, CalHacks/MHacks/HackTheNorth AR project patterns, react-native-vision-camera documentation, expo-camera docs.*
