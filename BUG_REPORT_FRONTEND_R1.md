# Frontend Bug Report — Round 1

**Project:** Medak Emergency Relay  
**Scope:** All files under `frontend/`  
**Date:** 2026-03-29  
**Reviewer:** Eva (subagent)

---

## P0 — Will crash or critically fail in emergency

### BUG-F001: No way to exit RESOLVED or FAILED state
- **File:** `frontend/app/session.tsx:169-174`
- **Issue:** The "Prekini poziv" (End call) button is only rendered when `phase` is `INTAKE`, `TRIAGE`, or `LIVE_CALL`. When the session reaches `RESOLVED` or `FAILED`, the user has no button to return to the home screen. On iOS there's no hardware back button, and the session screen has `gestureEnabled: false` and `headerBackVisible: false`.
- **Impact:** User is **permanently stuck** on the resolved/failed screen. They must force-kill the app to do anything — unacceptable during an emergency where they might need to retry or call another service.
- **Fix:** Add a "Return to Home" button that renders when `phase === "RESOLVED" || phase === "FAILED"`. Call `router.replace("/")` on press.

### BUG-F002: Camera preview takes 50% of screen, squashing transcript
- **File:** `frontend/app/session.tsx:140-160`
- **Issue:** Inside the `{/* Main content area */}` `<View style={styles.flex}>`, both the `<CameraView style={styles.cameraPreview}>` (`flex: 1`) and the phase view (`TriageView`/`LiveCallView`, also `flex: 1`) are siblings. React Native splits available space equally between flex siblings. This means the camera takes 50% of the screen and the transcript + controls get the other 50%.
- **Impact:** On a typical phone, the transcript area is ~300px tall including status bar, confidence bar, mic indicator, and the chat input. Actual scrollable transcript might be 100-150px — barely 2-3 lines visible. During triage, the user can't read the AI's questions properly.
- **Fix:** Give the camera a fixed height (`height: 200` or similar) instead of `flex: 1`, or use an `aspectRatio` constraint. The transcript/interaction area should get priority space.

### BUG-F003: Corrupted AsyncStorage crashes getUserInfo
- **File:** `frontend/lib/storage.ts:17`
- **Issue:** `JSON.parse(raw)` is called without try/catch. If the stored data is corrupted or not valid JSON (e.g., partial write due to app crash), this throws a `SyntaxError` that propagates unhandled.
- **Impact:** Settings screen crashes on mount. If `getUserInfo` is ever called during SOS flow (future feature), the entire emergency flow crashes.
- **Fix:** Wrap `JSON.parse(raw)` in try/catch, return `DEFAULT_USER_INFO` on parse failure, and delete the corrupted key.

### BUG-F004: Hardcoded LAN IP as default API URL
- **File:** `frontend/lib/config.ts:2`
- **Issue:** `API_BASE` defaults to `http://10.225.114.241:8080` — a private LAN IP. If `EXPO_PUBLIC_API_URL` env var is not set (common on fresh clone, CI, or production build), the app targets a non-routable address.
- **Impact:** **Every API call and WebSocket connection fails** outside the original dev network. SOS button does nothing, session never connects.
- **Fix:** Either make the env var required (crash at startup with clear error if missing) or use a real hostname/URL. At minimum, show a visible error if `API_BASE` contains a private IP range.

### BUG-F005: No fetch timeout on API calls
- **File:** `frontend/lib/api.ts:5-14`
- **Issue:** `fetch()` calls in `triggerSOS` and `getSessionStatus` have no timeout. If the backend is unreachable (not just refusing connections — truly unreachable, e.g., wrong IP, network partition), `fetch` can hang for 30-120 seconds depending on the platform's TCP timeout.
- **Impact:** User presses SOS, sees a spinner, and waits 1-2 minutes with no feedback before the error finally appears. In an emergency, every second counts.
- **Fix:** Add `AbortController` with a 5-10 second timeout, similar to the pattern already used in `location.ts:withTimeout`.

---

## P1 — Will break in real-world conditions

### BUG-F006: No AppState handling — backgrounding kills session silently
- **File:** `frontend/app/session.tsx` (entire file)
- **Issue:** No `AppState` listener. When the user backgrounds the app (e.g., answering a phone call, checking a text, accidentally swiping), the OS may suspend the WebSocket, mic recording, and camera capture. When the user returns, the WebSocket may be disconnected (reconnect may or may not fire), audio recording may have stopped, and camera capture may have errored.
- **Impact:** The session silently degrades. The user sees a connected-looking UI but no data is flowing. In an emergency, the operator/AI gets nothing.
- **Fix:** Add `AppState.addEventListener('change', ...)` to pause resources on background and reconnect/restart on foreground. Detect stale WebSocket connections on resume.

### BUG-F007: No screen wake lock — screen turns off during emergency
- **File:** `frontend/app/session.tsx` (entire file)
- **Issue:** No `expo-keep-awake` or equivalent. During an active session, the device screen will dim and lock per the user's auto-lock setting (typically 30s-2min).
- **Impact:** During an emergency where the user may be injured or waiting for help, the screen turns off. They can't see incoming questions or the resolved/failed status. If they need to interact (answer a DA/NE question), they must unlock the phone first.
- **Fix:** `npm install expo-keep-awake`, then use `useKeepAwake()` hook in `SessionScreen` or `activateKeepAwake()`/`deactivateKeepAwake()` in the session effect.

### BUG-F008: User personal info is saved but never sent to backend
- **File:** `frontend/lib/sosFlow.ts`, `frontend/lib/storage.ts`
- **Issue:** The settings screen lets users enter personal info (name, address, medical notes). `saveUserInfo` stores it in AsyncStorage. But `initiateSOSCall` never reads `getUserInfo()` and never includes `personalInfo` in the `SOSRequest`. The data type `SOSRequest` doesn't even have a field for it.
- **Impact:** The entire settings screen is non-functional from the backend's perspective. Users believe their medical info will be relayed to emergency services, but it's never sent. **False sense of safety.**
- **Fix:** Add `personal_info?: string` to `SOSRequest`, call `getUserInfo()` in `initiateSOSCall`, and include it in the request body.

### BUG-F009: WebSocket reconnection too aggressive — gives up after 14 seconds
- **File:** `frontend/lib/websocket.ts:93-101`
- **Issue:** `MAX_RECONNECT_ATTEMPTS = 3` with exponential backoff (2s, 4s, 8s). After just 14 seconds of trying, the session is declared `FAILED`. Mobile networks are flaky — a tunnel, elevator, or brief cell handoff easily exceeds 14 seconds.
- **Impact:** Session permanently fails during brief network interruptions. User sees "Automatic call failed" and has to restart. In an emergency with unstable connectivity (moving ambulance, rural area), this makes the app unreliable.
- **Fix:** Increase to at least 10-15 attempts with a cap on backoff (e.g., max 30s between attempts). Consider unlimited retries with user-visible "Reconnecting..." state and a manual "give up" option.

### BUG-F010: Audio/video data silently dropped during WS reconnection
- **File:** `frontend/lib/websocket.ts:42-44`
- **Issue:** `send()` checks `readyState === WebSocket.OPEN` and silently drops messages if not. During the 2-14 second reconnection window, all audio chunks (~56 chunks at 250ms interval) and video frames (~18 frames at 750ms) are permanently lost.
- **Impact:** The backend gets a gap in audio/video data during network hiccups. The AI triage agent loses context. Critical spoken information from the emergency scene is discarded.
- **Fix:** Queue critical messages (at least `user_response` and `end_session`) during disconnection and flush on reconnect. Audio/video can be dropped but text responses should be buffered.

### BUG-F011: Question auto-dismiss at 5 seconds is too fast for accessibility
- **File:** `frontend/app/session.tsx:78-82`
- **Issue:** Pending questions auto-dismiss after 5000ms via `setTimeout`. For a deaf/hard-of-hearing user (a primary use case for this app), 5 seconds may not be enough to read and tap DA/NE. For a user in a panicked state, even less so.
- **Impact:** Critical triage questions disappear before the user can respond. The backend gets no answer and may make wrong assumptions.
- **Fix:** Increase to 15-30 seconds, or don't auto-dismiss at all (let the server send a new question to replace the old one). At minimum, keep the question visible until the user taps or a new question arrives.

### BUG-F012: Settings screen has no back navigation on iOS
- **File:** `frontend/app/_layout.tsx:19`, `frontend/app/settings.tsx`
- **Issue:** The settings screen has `headerShown: false` in the layout, and the screen itself has no back button or navigation element. On iOS, there's no hardware back button. The swipe-back gesture works (gestureEnabled is not disabled), but there's no visual affordance.
- **Impact:** iOS users who open settings may not realize they can swipe back. They appear stuck.
- **Fix:** Either show the header (`headerShown: true`) or add a custom back button/icon in the settings screen.

### BUG-F013: Mixed language strings — half Serbian inline, half English via STRINGS
- **File:** `frontend/app/session.tsx` (multiple locations)
- **Issue:** The `STRINGS` object contains English strings, but `session.tsx` has several hardcoded Serbian strings:
  - Line ~131: `"Prekini poziv?"`, `"Da li ste sigurni da želite da prekinete poziv?"`
  - Line ~133: `"Otkaži"`, `"Prekini"`
  - Line ~178: `"Pošalji"` (Send button)
  - Line ~167: `"Unesite poruku..."` (placeholder)
  - Line ~212: `"Poziv u toku"` (Live call banner)
- **Impact:** If localization is ever needed, these strings are missed. More immediately, the app shows a confusing mix of English (buttons, status) and Serbian (dialogs, labels) to the user.
- **Fix:** Move all user-facing strings to `strings.ts`. Pick one language.

### BUG-F014: reverseGeocode is exported but never called — address never sent
- **File:** `frontend/lib/location.ts:23-38`, `frontend/lib/sosFlow.ts`
- **Issue:** `sosFlow.ts` comment says "Address reverse-geocoding runs in parallel and never blocks the call" but the code never calls `reverseGeocode()`. The `address` field on `SOSRequest` is always `undefined`.
- **Impact:** Backend never receives a human-readable address. If the AI agent needs to relay the address to emergency services, it only has lat/lng coordinates.
- **Fix:** Call `reverseGeocode(lat, lng)` in parallel during `initiateSOSCall` and attach the result. Since it has a 2s timeout, it won't block significantly.

---

## P2 — Quality, UX, and robustness issues

### BUG-F015: No React error boundary anywhere in the app
- **File:** `frontend/app/_layout.tsx`
- **Issue:** No `ErrorBoundary` component wraps any part of the app. If any component throws during render (e.g., unexpected null in transcript data, theme property missing), the entire app crashes with a white screen or Expo error overlay.
- **Impact:** In an emergency, a single bad data point from the WebSocket crashes the entire app. User must restart.
- **Fix:** Add an error boundary at the layout level and especially around the session screen. Show a fallback UI with the emergency number for manual calling.

### BUG-F016: Continuous haptic feedback during INTAKE is excessive
- **File:** `frontend/app/session.tsx:111-115`
- **Issue:** `Haptics.impactAsync(ImpactFeedbackStyle.Light)` fires every 1500ms during the INTAKE phase. If the backend is slow or unreachable, INTAKE can last 10+ seconds (or indefinitely with the fetch timeout issue), meaning 7+ haptic pulses.
- **Impact:** Annoying, drains battery, and masks other haptic signals (question notification). Users may think the phone is malfunctioning.
- **Fix:** Limit to 3-5 pulses max, or use a single long vibration pattern instead.

### BUG-F017: Location fallback sends (0, 0) — ocean off Africa's coast
- **File:** `frontend/lib/sosFlow.ts:24-25`
- **Issue:** When `requireLocation` is `false` and location fails, `lat` and `lng` default to `0`. Latitude 0, Longitude 0 is "Null Island" in the Gulf of Guinea.
- **Impact:** Backend receives a valid-looking location that's completely wrong. If the system doesn't validate coordinates against the expected service area (Serbia), it may attempt to dispatch to Africa.
- **Fix:** Send `null` for lat/lng when location is unavailable (requires backend support), or use a sentinel value that the backend explicitly handles. At minimum, don't fallback to `(0, 0)`.

### BUG-F018: No offline/manual dial fallback
- **File:** Entire frontend
- **Issue:** If the backend is unreachable (no internet, wrong API URL, server down), the app shows an error alert and returns to the home screen. There's no fallback to initiate a direct phone call to 194/192/193 using `Linking.openURL('tel:194')`.
- **Impact:** The app becomes a barrier to getting help instead of an aid. User opens Medak instead of the phone dialer, wastes time, and then has to navigate to the phone app.
- **Fix:** When the SOS API call fails, offer a "Call [number] directly" button that uses `Linking.openURL('tel:...')`. Also show this in the FAILED phase.

### BUG-F019: No WebSocket pong timeout — half-open connections undetected
- **File:** `frontend/lib/websocket.ts:105-113`
- **Issue:** Client sends `ping` every 15 seconds and the server responds with `pong`, but the client never checks whether `pong` arrives. A half-open TCP connection (common when switching networks) would go undetected indefinitely.
- **Impact:** The app appears connected (green dot) but no data flows. The user waits for help that isn't coming because the backend lost the connection.
- **Fix:** Track the last `pong` timestamp. If no `pong` received within 2× the ping interval (30s), force-disconnect and trigger reconnection.

### BUG-F020: Audio mode not reset when mic capture stops
- **File:** `frontend/lib/audio.ts:36-38`
- **Issue:** `startMicCapture` sets `allowsRecordingIOS: true` via `Audio.setAudioModeAsync`, but the returned stop function never resets it. When the session ends and the user returns to the home screen, `allowsRecordingIOS` stays `true`.
- **Impact:** On iOS, `allowsRecordingIOS: true` forces the audio session into recording mode, which can degrade audio playback quality for other apps or system sounds until the app is killed.
- **Fix:** In the stop function, call `Audio.setAudioModeAsync({ allowsRecordingIOS: false })`.

### BUG-F021: Invalid `shutterSound: false` option in takePictureAsync
- **File:** `frontend/lib/camera.ts:25`
- **Issue:** `takePictureAsync` is called with `{ shutterSound: false }`. This is not a valid `CameraPictureOptions` property in expo-camera v17. The correct way to disable shutter is the `animateShutter={false}` prop on the `CameraView` component (which IS correctly set in `session.tsx`).
- **Impact:** The `shutterSound` option is silently ignored. On some devices/locales (especially in Japan/Korea), shutter sound is mandatory at the OS level regardless. At ~1.3fps, this could produce annoying rapid shutter sounds on affected devices.
- **Fix:** Remove `shutterSound: false` from the options object. Rely on `animateShutter={false}` on the component, and document the OS-level shutter sound limitation.

### BUG-F022: WebSocket send buffer can grow unbounded on slow networks
- **File:** `frontend/lib/websocket.ts:42-44`, `frontend/lib/audio.ts`, `frontend/lib/camera.ts`
- **Issue:** Audio chunks (~11KB base64 every 250ms) and video frames (~50-200KB base64 every 750ms) are sent without checking `WebSocket.bufferedAmount`. On a slow connection, the send buffer accumulates: ~300KB/s of data with no backpressure.
- **Impact:** On a 3G connection or congested network, memory usage climbs continuously. After 60 seconds, that's ~18MB queued. The app may be OOM-killed by the OS.
- **Fix:** Check `ws.bufferedAmount` before sending. If the buffer exceeds a threshold (e.g., 1MB), skip sending audio/video frames until it drains. Log a warning.

### BUG-F023: Settings save error gives no visual feedback
- **File:** `frontend/app/settings.tsx:30-34`
- **Issue:** The `catch` block in `handleSave` only triggers error haptics — no Snackbar, Alert, or any visual message.
- **Impact:** User thinks save succeeded (no error visible), but data was not persisted. They enter an emergency believing their medical info will be relayed, but it wasn't saved.
- **Fix:** Show a Snackbar or Alert with an error message in the catch block.

### BUG-F024: Settings button may be clipped by bottom safe area
- **File:** `frontend/app/index.tsx:82-87`
- **Issue:** The settings `IconButton` uses `position: 'absolute', bottom: 32, right: 24`. Since it's inside `SafeAreaView`, this should be fine — but the `absolute` positioning takes it out of the safe area flow. On devices with large bottom insets (home indicator), the button may sit too close to the edge.
- **Impact:** Settings button may be partially hidden or hard to tap on certain devices.
- **Fix:** Move the settings button into the normal layout flow (e.g., below the grid with a spacer) or account for bottom insets explicitly.

### BUG-F025: Transcript list not virtualized — potential performance issue
- **File:** `frontend/app/session.tsx` (TranscriptList component)
- **Issue:** `TranscriptList` uses `ScrollView` with `.map()` to render all transcript entries. For long sessions with many transcript entries, this renders all entries simultaneously.
- **Impact:** For a 10+ minute session with rapid transcription, dozens of text bubbles are rendered at once. This can cause jank on lower-end devices.
- **Fix:** Use `FlatList` with `keyExtractor` for automatic virtualization. Only matters for longer sessions.

### BUG-F026: `useLocalSearchParams` types not validated at runtime
- **File:** `frontend/app/session.tsx:30`
- **Issue:** `useLocalSearchParams<{ sessionId: string; emergencyType: EmergencyType }>()` provides TypeScript typing but no runtime validation. If the session screen is deep-linked or navigated to without params, `sessionId` is `undefined` and `emergencyType` is `undefined`. The `useEffect` returns early for missing `sessionId`, but `emergencyType` falls through to the fallback `"194"` — the wrong service might be shown.
- **Impact:** Edge case: deep link or navigation bug puts user on session screen without valid params. The screen renders but can't function.
- **Fix:** Add a guard at the top of the component: if `!sessionId || !emergencyType`, redirect to `/` immediately.

### BUG-F027: Mic recording uses recursive scheduling with no error backoff
- **File:** `frontend/lib/audio.ts:52-79`
- **Issue:** `recordChunk()` calls itself at the end of each iteration. If recording fails fast (e.g., permission revoked, hardware error), the catch block swallows the error and immediately calls `recordChunk()` again, creating a tight retry loop.
- **Impact:** If the mic fails, the app enters a CPU-burning loop of failed recording attempts with no delay between them, draining battery and potentially causing thermal throttling.
- **Fix:** Add a delay before retrying on error: `setTimeout(recordChunk, 1000)` in the catch block, or track consecutive failures and stop after N.

### BUG-F028: Missing `alarm.tsx` — dead strings in `strings.ts`
- **File:** `frontend/lib/strings.ts:27-33`, `frontend/app/` directory
- **Issue:** `strings.ts` defines `call_failed`, `fall_detected`, `sos_activated`, `calling_emergency`, `calling_emergency_countdown`, `cancel_alarm`, `cancel`, and `home_screen` — all referencing an alarm/danger detection flow. But `alarm.tsx`, `DangerDetectionContext.tsx`, and `useDangerDetection.ts` don't exist.
- **Impact:** No functional impact (dead code), but indicates a planned feature that's incomplete. The strings inflate the bundle slightly and may confuse contributors.
- **Fix:** Either implement the alarm screen or remove the dead strings. Add a `TODO` comment if planned.

### BUG-F029: Expo-av recording creates excessive file I/O
- **File:** `frontend/lib/audio.ts:52-79`
- **Issue:** The "streaming" mic capture workaround creates a new `Audio.Recording` every 250ms, writes to disk, reads back as base64, then deletes the file. That's 4 file write + read + delete cycles per second.
- **Impact:** On devices with slow flash storage, this creates I/O contention. Combined with camera frame captures, the app does 5+ file operations per second. This contributes to thermal throttling and battery drain during extended sessions.
- **Fix:** Acceptable for hackathon/demo, but for production: investigate Expo's `useAudioRecorder` with streaming, or drop to native modules for direct PCM streaming without file intermediary.

### BUG-F030: No network connectivity check before SOS
- **File:** `frontend/app/index.tsx`, `frontend/lib/sosFlow.ts`
- **Issue:** When the user presses an SOS button, the app immediately tries the API call with no pre-check for network connectivity. Combined with BUG-F005 (no fetch timeout), the user waits in the dark.
- **Impact:** User presses SOS with no internet (airplane mode, dead zone) and sees a spinner for an extended period before getting a generic error.
- **Fix:** Check `NetInfo.fetch()` before the API call. If offline, immediately show "No internet connection — call [number] directly" with a `tel:` link.

---

## Summary

| Priority | Count | Key Themes |
|----------|-------|------------|
| **P0** | 5 | Stuck UI, crash on corrupt data, unreachable API, no fetch timeout |
| **P1** | 9 | No backgrounding support, no wake lock, data not sent, flaky reconnection, mixed languages |
| **P2** | 16 | No error boundary, no offline fallback, buffer overflow, file I/O pressure, dead code |

**Top 5 fixes for demo day:**
1. **BUG-F001** — Add "Go Home" button on RESOLVED/FAILED (5 min fix)
2. **BUG-F002** — Fix camera/transcript layout split (5 min fix)
3. **BUG-F005** — Add fetch timeout with AbortController (10 min fix)
4. **BUG-F007** — Add `useKeepAwake()` to session screen (5 min fix, one package install)
5. **BUG-F011** — Increase question timeout to 15-30s (1 min fix)
