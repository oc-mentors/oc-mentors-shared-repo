# Maestro E2E testing (Capacitor iOS)

This app is a **Vite + React** web UI wrapped with **Capacitor** (`com.ocmentorscorp.app`). Maestro drives the iOS Simulator through the WKWebView accessibility tree.

## Device / runtime requirements

- **Xcode** with the **iOS 26.5** simulator runtime installed (this project’s deployment target expects 26.5).
- A booted iPhone simulator on that runtime (e.g. **iPhone 17 — iOS 26.5**).
- Maestro CLI + a JDK (`JAVA_HOME`).
- First driver start is slow — set `MAESTRO_DRIVER_STARTUP_TIMEOUT=600000`.

```bash
export MAESTRO_DRIVER_STARTUP_TIMEOUT=600000
export JAVA_HOME="$(/usr/libexec/java_home)"
export PATH="$PATH:$HOME/.maestro/bin"
```

---

## Important: how selectors work

On iOS WKWebView:

| Attribute | Visible to Maestro? |
|---|---|
| `data-testid` | No |
| HTML `id` | No (`resource-id` stays empty) |
| `title` / `aria-describedby` / visually-hidden test-id text | No (verified via hierarchy dump) |
| **`aria-label` (human text)** | **Yes** → Maestro `text:` / `accessibilityText` |

Flows use **human-readable** `text:` selectors that match `aria-label` (and VoiceOver).  
`data-testid` remains for DOM tooling; **Maestro does not use it**.

**Implication:** selectors are tied to UI copy / `aria-label` text. If button labels change, update the matching Maestro YAML.

**Keyboard tip:** After `inputText`, dismiss the iOS keyboard (tap a heading like **Sign in to continue your learning**, or keyboard **Done**) before tapping primary actions. Tapping **Email** to dismiss can truncate the address.

---

## 1. Install Maestro (macOS)

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
export PATH="$PATH:$HOME/.maestro/bin"
maestro --version
```

Maestro needs a JDK:

```bash
/usr/libexec/java_home -V
export JAVA_HOME="$(/usr/libexec/java_home)"
```

---

## 2. Build the app for the iOS Simulator

```bash
cd "/Users/tanvi/Desktop/OC Mentors/Project"

npm run build
npx cap sync ios

# Prefer an iPhone on iOS 26.5
UDID="$(xcrun simctl list devices available | grep 'iPhone 17 (' | grep '26.5' | head -1 | sed -E 's/.*\(([A-F0-9-]+)\).*/\1/')"
xcrun simctl boot "$UDID" || true
open -a Simulator

cd ios/App
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug \
  -destination "platform=iOS Simulator,id=$UDID" \
  -derivedDataPath /tmp/ocmentors-dd \
  build

xcrun simctl install "$UDID" /tmp/ocmentors-dd/Build/Products/Debug-iphonesimulator/App.app
xcrun simctl launch "$UDID" com.ocmentorscorp.app
```

Bundle id: **`com.ocmentorscorp.app`**.

---

## 3. Provision accounts

### Student (quiz-completed)

Journeys **6–8, 10–13** need a student who finished the learning-style quiz (login reaches **Home**).

```bash
maestro test .maestro/subflows/provision-complete-quiz.yaml \
  --env TEST_EMAIL='your-test@example.com' \
  --env TEST_PASSWORD='your-test-password'
```

### Tutor (onboarded)

Journeys **9, 9b, 14** need an onboarded tutor (`TUTOR_EMAIL` / `TUTOR_PASSWORD`).

```bash
# Sign up as Tutor/Admin + complete 9-step tutor onboarding → Tutor home
maestro test .maestro/subflows/signup-tutor.yaml \
  --env TUTOR_PASSWORD='your-tutor-password'
# Note the printed/generated maestro.tutor.{timestamp}@ocmentors.test email, then:
maestro test .maestro/09-tutor-home.yaml \
  --env TUTOR_EMAIL='maestro.tutor.…@ocmentors.test' \
  --env TUTOR_PASSWORD='your-tutor-password'
```

`complete-tutor-onboarding.yaml` swipes along the **left edge** to reveal **Next** / **Finish** (footer scrolls with long option lists; center swipes would toggle chips).

Signup display name should include **Maestro E2E Tutor** so journey **14** can search for that tutor.

---

## Messaging rule (request → accept)

On **Tutor profile**:

| State | CTA |
|---|---|
| No connection | **Request tutor** |
| Request pending | **Request sent** (Message still locked) |
| Tutor accepted | **Message tutor** |

**Message unlocks only after the tutor accepts** (`TutorRequestsContext.acceptRequest` creates the conversation + connection). Journey **8** covers request-first / already-connected branches. Journey **14** is the full student-request → tutor-accept → student-message path.

---

## 4. Full suite run command

```bash
cd "/Users/tanvi/Desktop/OC Mentors/Project"

export MAESTRO_DRIVER_STARTUP_TIMEOUT=600000
export JAVA_HOME="$(/usr/libexec/java_home)"
export PATH="$PATH:$HOME/.maestro/bin"

maestro test .maestro/01-student-login.yaml \
  --env TEST_EMAIL='…' --env TEST_PASSWORD='…'

# Tutor journeys also need:
#   --env TUTOR_EMAIL='…' --env TUTOR_PASSWORD='…'
```

`--env` values are never committed. Signup (`02`, `signup-tutor`) generates `maestro.*.{timestamp}@ocmentors.test` emails.

---

## Flows included

| File | Journey | Notes |
|---|---|---|
| `01-student-login.yaml` | Student login | `TEST_EMAIL` / `TEST_PASSWORD` |
| `02-student-signup.yaml` | Student signup | `TEST_PASSWORD` only |
| `03-wrong-password.yaml` | Wrong password | `TEST_EMAIL` |
| `04-empty-login-form.yaml` | Empty form (submit disabled) | No credentials |
| `06-browse-tutors.yaml` | Browse tutors | Quiz-completed student |
| `07-book-lesson.yaml` | Book lesson → success banner | Quiz-completed student |
| `08-messages.yaml` | Request-first / message if connected | Message locked until accept |
| `09-tutor-home.yaml` | Tutor login → home | Onboarded tutor |
| `09b-tutor-screens.yaml` | Students, Requests, Availability, Analytics | Onboarded tutor |
| `10-course-planner.yaml` | UCI search ICS 31 → Add to plan | Quiz-completed student |
| `11-notes.yaml` | Create + delete note | Quiz-completed student |
| `12-settings.yaml` | Toggle high contrast (on/off label) | Quiz-completed student |
| `13-logout.yaml` | Logout cancel then confirm | Quiz-completed student |
| `14-request-accept.yaml` | Student request → tutor accept → message | Student + onboarded tutor |
| `subflows/login-student.yaml` | Shared student login | |
| `subflows/login-student-home.yaml` | Login + require Home | |
| `subflows/login-tutor.yaml` | Shared tutor login | |
| `subflows/signup-tutor.yaml` | Tutor signup + onboarding | |
| `subflows/complete-quiz.yaml` | Learning quiz → Home | |
| `subflows/complete-tutor-onboarding.yaml` | Tutor onboarding → Tutor home | |
| `subflows/provision-complete-quiz.yaml` | One-shot student quiz provision | |
| `subflows/message-connected-tutor.yaml` | Send ping + inbox assert | |

---

## Troubleshooting

- **`iOS driver not ready in time`**: raise `MAESTRO_DRIVER_STARTUP_TIMEOUT` (e.g. `600000`).
- **No simulator destination / wrong runtime**: install **iOS 26.5** in Xcode → Settings → Platforms.
- **Element not found after launch**: WebView needs a few seconds; flows already `extendedWaitUntil` for `Login`.
- **Stuck on quiz results after login**: expected when quiz is done; use `login-student-home.yaml` (taps **Continue to Profile**).
- **Tutor Next not found**: footer is below long lists — use left-edge swipe (see `complete-tutor-onboarding.yaml`), not center scroll.
- **Tap hits wrong control**: decorative labels can collide (e.g. home “Students” stat vs nav); prefer unique `aria-label`s / quick actions.
- **Label renamed in UI**: update both `aria-label` in React and the Maestro `text:` selector.
