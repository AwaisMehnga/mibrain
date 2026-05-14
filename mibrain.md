# mibrain — Complete Mobile App Design Guide
### For Google Stitch / AI Screen Generation
**Version:** MVP Production 1.0  
**Platform:** Mobile-first PWA → React Native  
**Last Updated:** May 2025

---

## IMPORTANT INSTRUCTIONS FOR STITCH

Generate every screen as a **mobile frame (390×844px, iPhone 14 Pro equivalent)**.  
Apply the design system defined in Section 1 to every single screen.  
Every screen is **dark mode by default** — this is a migraine app. Bright screens cause pain.  
Do not deviate from the color tokens or typography defined below.  
All screens must feel like one cohesive product, not separate designs.

---

## SECTION 1: DESIGN SYSTEM

### 1.1 Philosophy

mibrain lives in the quiet space between pain episodes. The design must feel like a **relief, not a task**. Every interaction should feel effortless — like the app understands the user is sometimes logging while lying in a dark room with throbbing pain. Nothing should require more than 2 taps to reach. Nothing should be loud, bright, or demanding.

**Design principles:**
1. **Calm over clinical** — warm, human, never sterile hospital-esque
2. **Dim by default** — dark backgrounds, soft contrast, easy on photosensitive eyes
3. **Generous touch targets** — minimum 56px height on all interactive elements
4. **One action per screen** — never compete for attention
5. **Feedback without noise** — soft haptic-style visual confirmations, no jarring alerts

---

### 1.2 Color Tokens

```
BACKGROUNDS
--bg-primary:      #0D0F14    (deepest navy-black — main screen background)
--bg-secondary:    #141720    (card background, slightly lighter)
--bg-tertiary:     #1C2030    (elevated surface, bottom sheets, modals)
--bg-input:        #1A1E2B    (input field background)

TEXT
--text-primary:    #EEF0F5    (primary text — soft white, not harsh pure white)
--text-secondary:  #8B92A8    (secondary text, labels, captions)
--text-muted:      #4D5368    (placeholder text, disabled states)
--text-inverse:    #0D0F14    (text on accent buttons)

ACCENT — The Signature Color
--accent-primary:  #7C6EF5    (muted violet-indigo — calm, intelligent, not aggressive)
--accent-soft:     #7C6EF520  (accent at 12% opacity — for backgrounds, chips)
--accent-glow:     #7C6EF540  (accent at 25% opacity — for pressed states, halos)

SEVERITY SCALE (used on sliders, pain indicators, history cards)
--severity-1:      #4CAF7D    (1–2 — gentle green, minimal)
--severity-3:      #8BC34A    (3–4 — yellow-green, mild)
--severity-5:      #FFD54F    (5–6 — amber, moderate)
--severity-7:      #FF9800    (7–8 — orange, severe)
--severity-9:      #EF5350    (9–10 — deep red, unbearable)

STATUS COLORS
--success:         #4CAF7D    (logged, saved, confirmed)
--warning:         #FFB74D    (risk alert, moderate warning)
--danger:          #EF5350    (high risk, critical alert)
--danger-soft:     #EF535015  (danger at 8% — panic mode background tint)

BORDERS & DIVIDERS
--border-subtle:   #FFFFFF08  (hairline dividers — barely visible)
--border-default:  #FFFFFF12  (standard card borders)
--border-active:   #7C6EF550  (selected/focused state border)

PANIC MODE OVERLAY
--panic-bg:        #0A0810    (near-black with violet undertone)
--panic-button:    #C62828    (deep crimson — visible in darkest environment)
--panic-text:      #FFB4AB    (warm soft red-white — readable without brightness)
```

---

### 1.3 Typography

```
FONT FAMILY
Display/Headings:  "DM Serif Display" — elegant, warm, trustworthy
Body/UI:           "DM Sans" — geometric, clean, highly legible at small sizes
Monospace/Data:    "DM Mono" — for numbers, severity scores, duration times

SCALE
--text-xs:    11px / 16px line-height   (labels, badges, timestamps)
--text-sm:    13px / 20px line-height   (secondary body, captions)
--text-base:  15px / 24px line-height   (primary body, list items)
--text-md:    17px / 26px line-height   (section headings, card titles)
--text-lg:    20px / 30px line-height   (screen titles)
--text-xl:    24px / 34px line-height   (hero text)
--text-2xl:   32px / 40px line-height   (large numbers, severity display)
--text-3xl:   48px / 56px line-height   (panic mode button label)

WEIGHT
Light:   300  (never use on body text — only large decorative)
Regular: 400  (body text)
Medium:  500  (labels, captions, emphasis)
SemiBold: 600 (button labels, card titles)
Bold:    700  (screen headings, critical numbers)
```

---

### 1.4 Spacing System

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px

SCREEN PADDING: 20px horizontal on all screens
CARD PADDING:   16px internal padding on all cards
SECTION GAP:    24px between major sections
ITEM GAP:       12px between list items
```

---

### 1.5 Component Tokens

```
BORDER RADIUS
--radius-sm:    8px   (chips, tags, small buttons)
--radius-md:    12px  (cards, inputs)
--radius-lg:    16px  (bottom sheets, modals)
--radius-xl:    24px  (large buttons, featured cards)
--radius-full:  9999px (pills, avatar, icon buttons)

SHADOWS
--shadow-card:    0 2px 12px rgba(0,0,0,0.4)
--shadow-float:   0 8px 32px rgba(0,0,0,0.6)
--shadow-accent:  0 4px 20px rgba(124,110,245,0.25)

BUTTON HEIGHTS
Primary CTA:     56px
Secondary:       48px
Tertiary/Ghost:  44px
Icon button:     44×44px minimum

ICON STYLE: Phosphor Icons — Regular weight
ICON SIZE: 20px default, 24px for primary actions, 32px for empty states
```

---

### 1.6 Motion & Animation

```
DURATION
--duration-fast:    150ms   (hover states, toggles)
--duration-base:    250ms   (transitions, slides)
--duration-slow:    400ms   (modals opening, page transitions)
--duration-deliberate: 600ms (onboarding reveals, empty states)

EASING
--ease-out:   cubic-bezier(0.16, 1, 0.3, 1)    (elements entering)
--ease-in:    cubic-bezier(0.4, 0, 1, 1)        (elements leaving)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) (satisfying confirmations)

INTERACTIONS
Button press:     Scale to 0.97, 150ms ease-out
Card tap:         Background flash at --accent-soft, 150ms
Successful save:  Checkmark reveal with scale spring, 400ms
Slider drag:      Real-time color interpolation across severity scale
Panic button:     Pulse ring animation (infinite, 2s cycle)
```

---

## SECTION 2: NAVIGATION STRUCTURE

### Bottom Tab Bar (All Main Screens)

```
5 tabs, always visible except during Panic Mode and active attack logging:

Tab 1: Home          Icon: house-simple   Label: "Home"
Tab 2: Log           Icon: plus-circle    Label: "Log"       (ACCENT colored — primary action)
Tab 3: Insights      Icon: chart-line     Label: "Insights"
Tab 4: History       Icon: clock-counter-clockwise   Label: "History"
Tab 5: Profile       Icon: user-circle    Label: "Profile"

BOTTOM BAR STYLE:
- Background: --bg-tertiary with blur (backdrop-filter: blur(20px))
- Height: 72px + safe area inset
- Active tab: --accent-primary icon + label
- Inactive tab: --text-muted icon, no label (or faded label)
- Center Log tab: slightly elevated, 56px circle background in --accent-primary
```

---

## SECTION 3: ALL SCREENS

---

### SCREEN GROUP A: ONBOARDING (8 Screens)

---

#### A1 — Splash / Launch Screen

**Purpose:** Brand moment while app loads  
**Duration:** 1.5 seconds then auto-advances

**Layout:**
- Full screen: --bg-primary
- Center: mibrain wordmark in "DM Serif Display" 36px, --text-primary
- Below wordmark: tagline "Know before it hits." in DM Sans 14px, --text-secondary, letter-spacing 0.08em
- Subtle: single soft violet radial gradient centered at 50% 60%, 300px radius, --accent-primary at 6% opacity — creates atmosphere without brightness
- Bottom: 8px loading bar, --accent-primary, animating left to right, 1.2s

**Do NOT include:** logos, multiple images, any navigation

---

#### A2 — Welcome Screen

**Purpose:** Emotional connection before signup  
**Advancement:** Two CTAs

**Layout:**
- Top 55%: Illustration area — abstract minimal art  
  - NOT a photo  
  - Geometric: three overlapping soft ellipses in muted violet, indigo, slate  
  - Suggests calm, brain waves, or relief — not pain imagery  
  - No hard edges, very soft and atmospheric
- Bottom 45%: white text area on --bg-primary

**Content:**
- H1 (DM Serif Display, 32px, --text-primary):  
  "Finally understand your migraines."
- Body (DM Sans 15px, --text-secondary, 24px line-height):  
  "mibrain learns your personal triggers and warns you before attacks hit. Built for real migraine life."
- Primary CTA button (56px, --accent-primary fill, --radius-xl, full width minus 40px padding):  
  Label: "Get Started" (DM Sans SemiBold 16px, --text-inverse)
- Tertiary link below button:  
  "Already have an account? Sign in" (--accent-primary color, 14px)

---

#### A3 — Condition Setup Screen

**Purpose:** Personalize from the start  
**Type:** Single-scroll screen

**Header:**
- Back arrow (top left, 44px tap area)
- Step indicator: "1 of 4" (top right, --text-muted, 13px)
- H2 (DM Serif Display, 26px): "What brings you to mibrain?"
- Subtext (15px, --text-secondary): "This helps us personalize your experience. You can change this anytime."

**Selection Cards** (multi-select, vertically stacked, 16px gap):  
Each card: --bg-secondary, --radius-md, 16px padding, full width  
Selected state: --border-active border (1.5px), --accent-soft background tint  
Each card has:
- Left: 40px icon circle (condition-specific icon, --accent-soft background)
- Right: title (15px SemiBold) + description (13px --text-secondary)
- Far right: checkbox circle (empty → filled checkmark on select)

Cards:
1. 🧠  **Chronic Migraine** — "More than 15 headache days per month"
2. ⚡  **Episodic Migraine** — "Fewer than 15 headache days per month"  
3. 👁️  **Migraine with Aura** — "Visual or sensory symptoms before attacks"
4. 💊  **Currently on preventive medication**
5. 📅  **Menstrual migraines** — "Attacks linked to my cycle"
6. 🌡️  **Weather-sensitive** — "Barometric pressure triggers my attacks"

**Bottom CTA:** "Continue" (56px, full width, --accent-primary) — sticky at bottom of screen above safe area

---

#### A4 — Trigger Awareness Screen

**Purpose:** Set baseline triggers  
**Type:** Multi-select grid

**Header:**
- Back arrow + "2 of 4"
- H2: "What usually triggers your migraines?"
- Subtext: "Select all that apply. mibrain tracks these automatically when possible."

**Grid Layout:** 2 columns, 12px gap  
Each chip: 72px tall, --bg-secondary, --radius-md, 14px padding  
Selected: --accent-soft background, --border-active border, checkmark in top right corner  
Icon (24px) above text (13px SemiBold)

Triggers:
- 😴 Poor sleep          - ☀️ Bright light
- 🌧️ Weather change      - 📱 Screen time
- ☕ Caffeine            - 🍷 Alcohol
- 😰 Stress              - 🍽️ Skipped meals
- 🌸 Hormonal changes    - 💧 Dehydration
- 🌬️ Strong smells       - 🏃 Exercise
- ✈️ Travel / altitude   - 🔊 Loud noise

**Bottom CTA:** "Continue"

---

#### A5 — Medication Setup Screen

**Purpose:** Capture current medication  
**Type:** List with add functionality

**Header:**
- Back + "3 of 4"
- H2: "What medications do you use?"
- Subtext: "For tracking effectiveness. mibrain never shares this with anyone."

**Two Sections:**

Section 1 — "Acute / Rescue Medications" (for stopping attacks)  
Section 2 — "Preventive Medications" (daily medications)

Each section:
- Section label (12px uppercase, --text-muted, 1.2em letter-spacing)
- Pre-seeded medication chips (scrollable horizontal row):
  - Sumatriptan, Rizatriptan, Nurtec, Ubrelvy, Excedrin, Ibuprofen, Acetaminophen
  - Preventive: Topiramate, Amitriptyline, Propranolol, Aimovig, Ajovy, Emgality
  - Each chip: 36px height pill, --bg-secondary, 14px, tap to select/deselect
  - Selected: --accent-primary background, white text
- "+ Add custom" link below each row (--accent-primary, 14px)

**Skip option:** "I'll add this later" ghost link below CTA  
**Bottom CTA:** "Continue"

---

#### A6 — Notification Permission Screen

**Purpose:** Permission request with clear value prop  
**Type:** Single focused screen

**Layout:**
- Top 40%: Illustration — phone with soft glow notification bubble, abstract, minimal
- Bottom 60%: Content

**Content:**
- H2 (DM Serif Display, 28px): "Know before it hits."
- Body (15px, --text-secondary):  
  "mibrain sends a morning risk alert when your patterns suggest a high-risk day. We also send gentle check-in reminders — never more than 2 notifications per day."
- Value list (3 items, icon + text, 12px gap):
  - 🌅 Morning risk score based on your patterns
  - 💊 Medication reminders (if you choose)
  - ✅ Daily check-in prompt (30 seconds)
- Primary CTA: "Enable Notifications" (--accent-primary)
- Secondary ghost: "Not now" (--text-muted, below CTA)

---

#### A7 — Create Account Screen

**Purpose:** Sign up  
**Type:** Form screen

**Header:**
- "4 of 4"
- H2 (DM Serif Display, 26px): "Create your account"
- Subtext: "Your data stays private and encrypted. Always."

**Form Fields** (stacked, 16px gap):  
Each field:
- Label: 12px, --text-secondary, 6px margin-bottom
- Input: 52px height, --bg-input, --radius-md, 15px DM Sans, --text-primary  
- Focus state: --border-active border (1.5px)
- Placeholder: --text-muted

Fields:
1. Full name (placeholder: "Your name")
2. Email address (keyboard: email)
3. Password (with show/hide toggle icon, 44px tap area)
4. Confirm password

**Privacy note** (12px, --text-muted, centered, below form):  
"We never sell your data. See our Privacy Policy."  
"Privacy Policy" — underline, --accent-primary

**CTA:** "Create Account" (56px, --accent-primary)  
**Alternative:** "Sign in instead" (link, below CTA)

---

#### A8 — Sign In Screen

**Purpose:** Returning users  
**Type:** Form screen

**Header:**
- mibrain wordmark (28px, DM Serif Display, centered)
- H2 (22px): "Welcome back."

**Form:**
- Email field
- Password field + show/hide toggle
- "Forgot password?" — right-aligned link (13px, --accent-primary)

**CTA:** "Sign In" (56px, --accent-primary)  
**Below:** "Don't have an account? Get started" (link)

---

### SCREEN GROUP B: HOME (3 Screens)

---

#### B1 — Home Screen (Main)

**Purpose:** Daily command center  
**Navigation:** Tab 1

**Status Bar Area:** Transparent, system text light

**Top Bar:**
- Left: "Good morning, [Name]" (DM Serif Display, 20px, --text-primary) — time-aware greeting
- Right: Bell icon button (44px tap area) — notification center

**SECTION 1 — Risk Score Card**  
Full-width card, --bg-secondary, --radius-lg, 20px padding, --shadow-accent  
This is the hero element of the home screen.

Content inside card:
- Top row: "Today's Risk Score" label (12px, --text-secondary uppercase) + info icon (?)
- Center: Large number — e.g. "72" in DM Mono Bold 64px  
  Color: maps to severity scale (green=low, amber=medium, red=high)
- Below number: "High Risk" label (16px SemiBold, same color as number)
- Below label: Explanation text (13px, --text-secondary):  
  "You slept 5.4h and pressure is rising in your area."
- Bottom row: Two small tags showing key contributing factors:  
  Pill chips — "Poor sleep" (warning colored) + "Rising pressure" (warning colored)
- If <14 days data: Replace number with "Building your model..." + "X days until your first insight" (progress bar)

**SECTION 2 — Quick Actions Row**  
Horizontal row, 3 equal buttons, 10px gap

Button 1 — PANIC: 
- Deep crimson/red background (--panic-button at 20% opacity)
- Red icon: lightning bolt or exclamation
- Label: "Attack Now" (13px, --danger)
- Subtle pulse ring animation

Button 2 — DAILY CHECK-IN:
- --bg-tertiary background
- Icon: sun or clipboard
- Label: "Check-in" (13px, --text-secondary)
- Badge: "!" if not done today

Button 3 — LOG ENTRY:
- --bg-tertiary background  
- Icon: plus
- Label: "Log" (13px, --text-secondary)

**SECTION 3 — Today's Stats Row**  
3 stat chips, horizontal, scrollable  
Each chip: --bg-secondary, --radius-md, 12px padding, centered content

Chips:
- "Last attack" / "3 days ago" (value in --text-primary 16px SemiBold)
- "This month" / "4 attacks"
- "Streak" / "7 days" (logging streak)

**SECTION 4 — Active Attack Banner** (conditional — only shows if attack in progress)  
Full-width, --danger-soft background, --danger border  
Content: 
- Left: Red pulsing dot
- "Attack in progress — 1h 24m" (14px SemiBold, --danger)
- Right: "End Attack" button (pill, --danger background, 13px white)

**SECTION 5 — Insights Teaser Card**  
--bg-secondary, --radius-lg, 16px padding  
Shows the #1 AI insight in preview:  
- Label: "Your Top Pattern" (12px, --text-secondary uppercase)
- Insight text (14px, --text-primary): "Attacks are 3× more likely after <6.5h sleep"
- Right: arrow icon (→) to navigate to Insights
- If insufficient data: "Keep logging — insight unlocks in 8 more days" with progress bar

**SECTION 6 — Recent History** (last 3 attacks)  
Section header: "Recent Attacks" (14px SemiBold) + "See all" link (13px, --accent-primary)  
Each row (see HISTORY screen card spec — compact version, 64px height)

**Bottom:** Tab bar

---

#### B2 — Home Screen (No Data State — First 3 Days)

**Purpose:** Encourage logging when no history exists

**Same layout as B1 but:**
- Risk Score Card: Replaced by onboarding progress card  
  "Complete 3 days of logging to unlock your risk score"  
  Progress: 1/3 days shown as 3 horizontal bars (filled = --accent-primary)
- Insights Card: "Your first insight appears after 14 days of logging. You're on day 1."
- Recent History: Empty state illustration + "Your attacks will appear here" (--text-muted)
- The 3 quick action buttons remain visible and functional

---

#### B3 — Notification Center Screen

**Purpose:** View all alerts and reminders  
**Arrival:** Tap bell icon on Home

**Header:**
- "< Back" (chevron left, 44px)
- "Notifications" (17px SemiBold)
- "Mark all read" (13px, --accent-primary, right)

**Sections:**

"Today":  
Each notification row:
- 48px height, --bg-secondary if unread (with 4px --accent-primary left border), --bg-primary if read
- Left: 36px icon circle (colored by notification type)
- Content: Title (14px SemiBold) + description (13px, --text-secondary) + time (12px, --text-muted)

Types:
- 🔴 Risk Alert: "High risk day detected" — red icon
- ☀️ Check-in: "Good morning! Time for your 30-second check-in" — amber icon
- 💊 Medication: "Time for Topiramate" — blue icon
- 🎉 Milestone: "7-day logging streak!" — green icon

"Earlier":
- Same format, slightly more muted

---

### SCREEN GROUP C: ATTACK LOGGING (6 Screens)

---

#### C1 — Panic Mode Screen

**Purpose:** Fastest possible attack logging — single tap to start  
**Arrival:** "Attack Now" button OR from home screen panic button  
**Design:** This screen is intentionally DIFFERENT from all others — minimal, dark, large targets

**Background:** --panic-bg (0A0810) — the darkest screen in the app  
**No bottom tab bar** on this screen

**Layout (vertical center stack):**

Top area:
- Small "×" close button (top right, 44px, --text-muted)
- Current time: "11:42 AM" (DM Mono, 14px, --text-muted, centered)

Center area (main content):
- Text: "How bad is it?" (DM Serif Display, 24px, --panic-text)
- Severity buttons: 10 large buttons in 2×5 grid  
  Each button: 56px × 56px, --radius-md  
  Number: DM Mono Bold, 22px  
  Color: maps from --severity-1 (green, "1") to --severity-9 (red, "10")  
  Background: colored at 20% opacity, border colored at 60%  
  On select: fills solid, scale spring animation

- After severity selected, slides up:
  "Did you take medication?" (18px, --panic-text)  
  Two large buttons: "Yes" | "Not yet" (56px height, full width minus 40px, --bg-tertiary)

Large CONFIRM button:  
- "Log Attack" (DM Sans Bold 18px, --text-inverse)
- --panic-button background, 64px height, --radius-xl, full width
- Pulsing red glow shadow underneath
- Saves immediately on tap

Confirmation state:
- Background briefly flashes --danger at 15% opacity
- Checkmark icon + "Attack logged" (20px, --panic-text)
- "Add more details later" link (13px, --text-muted, appears 1s after confirmation)
- Auto-returns to Home after 2s

---

#### C2 — Full Attack Log Screen

**Purpose:** Detailed attack entry  
**Arrival:** "Log" tab → New Attack, or "Add more details" from Panic Mode  
**Type:** Single vertical scroll, sections revealed progressively

**Header:**
- "< Back" + "Log Attack" (17px SemiBold) + "Save" (--accent-primary, SemiBold, right)

**SECTION 1 — When did it start?**  
- Section label: "Start Time" (12px uppercase, --text-muted)
- Time picker: Large inline picker, DM Mono 28px  
  Format: "Today, 11:42 AM" — tappable, opens native time picker
- Toggle: "Set custom date" (13px, --accent-primary) for retroactive logging

**SECTION 2 — Severity**  
- Section label: "Pain Severity" (12px uppercase)
- Subtitle: "At its worst" (12px, --text-muted)
- Large horizontal slider: 100% width, 8px track height  
  Left end: "1" (green), Right end: "10" (red)  
  Track gradient: --severity-1 → --severity-9  
  Thumb: 28px circle, white, --shadow-float  
  Current value: displayed above thumb in DM Mono Bold 24px  
  Below slider: Current label ("Moderate", "Severe", "Unbearable") in matching color

**SECTION 3 — Location on Head**  
- Section label: "Pain Location" (12px uppercase)
- Head diagram: Simple outlined head SVG, front-facing, 160px × 180px, centered  
  --text-muted outline color  
  Tappable zones (8 zones): Left temple, Right temple, Forehead, Behind eyes, Back of head, Top of head, Left jaw, Right jaw  
  Tapped zone: fills with --accent-primary circle overlay  
  Multi-select allowed
- Below diagram: Selected zones shown as chips ("Right temple", "Behind eyes")

**SECTION 4 — Pain Type**  
- Section label: "Pain Type" (12px uppercase)
- Multi-select chip row (scrollable horizontally):  
  Throbbing | Pressing | Stabbing | Burning | Squeezing | Pulsing  
  Unselected: --bg-tertiary, --text-secondary  
  Selected: --accent-soft background, --accent-primary text + border

**SECTION 5 — Symptoms**  
- Section label: "Other Symptoms" (12px uppercase)
- Multi-select chips:  
  Nausea | Vomiting | Light sensitivity | Sound sensitivity | Aura | Neck stiffness | Dizziness | Fatigue | Brain fog

**SECTION 6 — Aura Details** (conditional — only if "Aura" selected)  
- Section label: "Aura Type"
- Multi-select chips:  
  Zigzag lines | Blind spot | Blurry vision | Flashing lights | Tingling | Difficulty speaking

**SECTION 7 — Medication Taken**  
- Section label: "Medication Taken" (12px uppercase)
- Pre-seeded medication chips (from their profile setup)
- "None taken" option
- Each selected medication: shows dose input (e.g., "100mg") — inline text input  
- "+ Add custom med" link

**SECTION 8 — Potential Triggers**  
- Section label: "Possible Triggers" (12px uppercase)
- Multi-select from their personalized trigger list (from onboarding)
- Shows 8 most common, "+ See more" expander

**SECTION 9 — Notes**  
- Section label: "Notes" (12px uppercase)
- Textarea: 88px min-height, --bg-input, --radius-md, 14px DM Sans  
- Placeholder: "Anything else you want to remember about this attack..."
- Voice note button: microphone icon (right side of input), 44px — opens voice recording

**STICKY BOTTOM:**  
"Save Attack Log" (56px, --accent-primary, full width minus 40px, --radius-xl)  
Above button: "You can add more details anytime"

---

#### C3 — End Attack Screen

**Purpose:** Mark attack as over, capture aftermath  
**Arrival:** "End Attack" from home screen active banner OR history screen

**Header:** "End Attack" (17px SemiBold)

**Content:**

- Attack summary recap card (--bg-secondary, --radius-md):
  - Started: "11:42 AM"
  - Severity: "8/10"  
  - Duration so far: "3h 14min"

- "When did it end?" — time picker (same style as C2)

- "Medication effectiveness" (if medication was logged):
  For each medication taken:  
  "How well did [Sumatriptan 100mg] work?"  
  Segmented control: "Didn't work" | "Partial relief" | "Full relief" (48px height, full width)

- "How do you feel now?" — postdrome check:  
  Chips: Recovering well | Still foggy | Exhausted | Anxious | Relieved | Neck stiff

- "Notes on recovery" — short textarea

**CTA:** "End Attack" (56px, --success background, white text, full width)  
On tap: Confirmation animation + returns to home

---

#### C4 — Voice Log Screen

**Purpose:** Hands-free attack logging via speech  
**Arrival:** Mic button on home screen OR tap-to-speak in log screen

**Background:** --bg-primary  
**No keyboard** — this is a voice-first screen

**Layout:**

Top: "×" close (44px, top right)

Center stack:
- Status text (DM Serif Display, 22px, --text-primary):  
  States: "Tap to start" → "Listening..." → "Processing..." → "Got it."
  
- Large circular microphone button: 120px diameter  
  Default: --bg-tertiary, mic icon 40px --text-secondary  
  Listening: --accent-primary background, white mic icon, animated pulsing rings (2 rings, animated scale+opacity)  
  Processing: spinner animation, --accent-primary border

- Waveform visualization (listening state):  
  15 vertical bars, animated height, --accent-primary color  
  Smooth real-time animation synced to audio input

- Transcribed text area (appears after speaking):  
  --bg-secondary, --radius-md, 16px padding, 14px DM Sans, --text-primary  
  Shows live transcription as user speaks  
  Below: parsed fields as chips ("Severity: 7", "Right temple", "Sumatriptan")

- Confirm button (after transcription):  
  "Log this attack" (56px, --accent-primary)  
  "Edit details first" (ghost, --text-secondary, below)

Bottom: "Speak naturally. Try: 'Migraine started, severity 8, right temple, took Sumatriptan'"  
(12px, --text-muted, centered, italic)

---

#### C5 — Daily Check-in Screen

**Purpose:** 30-second morning baseline log  
**Arrival:** Home quick action OR notification

**Header:**
- "×" close (top right)
- "Good morning" (DM Serif Display, 24px)
- "30-second check-in" (14px, --text-muted)

**Progress:** 4 dots (steps), top center

**Step 1 — Sleep:**  
"How did you sleep?"  
Large thumb slider: 0–12 hours  
Value displayed: "7.5 hours" (DM Mono Bold, 32px, --text-primary)  
Below: Sleep quality chips: "Restful" | "Disrupted" | "Very poor"

**Step 2 — Hydration & Food:**  
"Did you drink enough water yesterday?"  
Toggle: "Yes" | "No" (segmented, 56px, full width)  
  
"Did you skip any meals?"  
Toggle: "No meals skipped" | "Skipped a meal" | "Skipped multiple"

**Step 3 — Stress & Energy:**  
"Stress level this morning?" — 1–5 icon scale (emoji-free, numbered circles)  
"Energy level?" — 1–5 scale  

**Step 4 — Cycle Day (if menstrual migraines opted in):**  
"What day of your cycle are you on?"  
Number input (DM Mono, 28px, large centered stepper: − [7] +)  
"Skip for today" link below

**Final CTA after step 4:** "Done — See Today's Risk"  
Triggers risk score calculation + returns to home with updated score

---

#### C6 — Log History Detail Screen

**Purpose:** View a single past attack in full  
**Arrival:** Tap any attack card in History

**Header:** "< Back" + date string "May 3rd, 2025" (17px SemiBold)

**Top Summary Card** (--bg-secondary, --radius-lg, 20px padding):
- Severity: large number (DM Mono 48px, severity-colored)
- Duration: "4h 22min" (DM Mono 20px, --text-secondary)
- Date + time: "Saturday, 11:42 AM → 4:04 PM"

**Sections (content cards, stacked, 12px gap):**

Location card:
- Head diagram (smaller, 80px) with selected zones highlighted
- Location labels as chips

Symptoms card:
- "Nausea, Light sensitivity, Aura" — chip list

Medications card:
- Each med as row: name + dose + effectiveness badge (green/amber/red)

Triggers suspected card:
- Chip list of selected triggers

AI note card (if insight available):
- --accent-soft background, --accent-primary left border (3px)
- "mibrain noticed:" label (12px, --accent-primary, uppercase)
- Insight text: "This attack followed 5.1h sleep and a weather pressure drop — your most common pattern." (14px, --text-primary)

Notes card:
- User's text note (14px, --text-primary, italic)
- Voice note player if recorded

**Footer:**
- "Edit this log" (ghost button, --text-secondary)
- "Delete" (ghost button, --danger, 13px)

---

### SCREEN GROUP D: DAILY CHECK-IN (Already covered in C5)

---

### SCREEN GROUP E: INSIGHTS (4 Screens)

---

#### E1 — Insights Main Screen

**Purpose:** AI-powered pattern analysis  
**Navigation:** Tab 3

**Header:**
- "Insights" (DM Serif Display, 24px)
- Subtitle: "Based on [47] logged attacks" (13px, --text-secondary)

**If <14 days data — Locked State:**
- Full width card with soft lock illustration
- "Your insights unlock in [8] more days"
- Progress bar (--accent-primary fill, --bg-secondary track)
- "Keep logging your daily check-in to get accurate patterns"
- Below: teaser placeholder cards (blurred/frosted, greyed out, with lock icon)

**If ≥14 days data — Insights Available:**

**SECTION 1 — Top Trigger Card** (hero card)  
--bg-secondary, --radius-lg, full width, 20px padding  
- "Your #1 Pattern" label (12px uppercase, --accent-primary)
- Insight (DM Serif Display, 20px, --text-primary):  
  "Attacks are 3× more likely after poor sleep"
- Supporting data (13px, --text-secondary):  
  "In 8 of your last 10 attacks, you slept under 6.5 hours the night before."
- Confidence indicator: "High confidence" green badge (12px pill)

**SECTION 2 — Trigger Correlation Chart**  
Section label: "What correlates with your attacks?" (14px SemiBold)  

Horizontal bar chart:
- Each bar: trigger name (left, 13px) + bar (colored, width = correlation %) + % label (right, DM Mono 13px)
- Bars colored by strength: green (weak) → amber → red (strong)
- Bars: 8px height, --radius-full
- Sort: descending by correlation
- 6 triggers shown, "See all" expander

Triggers shown:
- Poor sleep: 87%
- Rising pressure: 76%
- Stress (4–5): 71%
- Skipped meals: 58%
- Alcohol: 52%
- Bright screens: 44%

**SECTION 3 — Time Pattern Card**  
"When do your attacks hit?"  
Heatmap grid: 7 columns (Mon–Sun) × 4 rows (Morning/Afternoon/Evening/Night)  
Each cell: 40px × 40px, colored by frequency (0 = --bg-tertiary, max = --accent-primary)  
Most active cell highlighted with glow

**SECTION 4 — Medication Effectiveness Card**  
"How well are your meds working?"  
For each medication used:
- Name + dose (14px SemiBold)
- Effectiveness: horizontal split bar (Full relief / Partial / Didn't work)
- Colors: --success | --warning | --danger
- Cases: "13 uses"

**SECTION 5 — Monthly Trend Card**  
"Attack frequency over time"  
Line chart: last 4 months  
X-axis: months, Y-axis: attack count  
Line: --accent-primary, 2px stroke, smooth curve  
Data points: 6px circles, --accent-primary fill  
Trend indicator: "↓ 2 fewer attacks than last month" (--success) or "↑ 3 more" (--danger)

---

#### E2 — Insights Detail Screen — Trigger Deep Dive

**Purpose:** Explore one trigger's full pattern  
**Arrival:** Tap any trigger from E1 chart

**Header:** "< Back" + trigger name (e.g. "Poor Sleep", 17px SemiBold)

**Content:**
- Summary stat: "Present in 87% of your attacks" (DM Mono 32px, --danger)
- Explanation card:  
  AI-generated plain English explanation of the pattern (3–4 sentences, 14px, --text-primary)  
  
- Threshold card:  
  "Your critical threshold:"  
  "< 6.5 hours sleep = high risk" (DM Mono Bold 18px, --warning)
  "Found by analyzing [47] nights of data"

- Attack examples (last 3 attacks where this trigger was present):  
  Compact history rows showing correlation

- Recommendation card (--accent-soft background):  
  "What you can do:" label (12px, --accent-primary)  
  2–3 bullet suggestions (14px, --text-primary)

---

#### E3 — Risk Score Detail Screen

**Purpose:** Explain today's risk score  
**Arrival:** Tap risk score card on Home

**Header:** "< Back" + "Today's Risk Score" (17px SemiBold)

**Hero:**
- Large number (DM Mono 80px, centered, severity-colored): e.g. "72"
- Label: "High Risk" (22px SemiBold, same color)

**Breakdown Card:**  
"What's contributing today:" (14px SemiBold)  
Each factor as a row:
- Factor name (14px) + impact badge ("+18 risk", "+12 risk") + brief explanation (13px, --text-secondary)
- Positive factors (reducing risk) shown with -- prefix in --success color

**Recommendation strip:**  
"Based on your patterns, consider:"  
3 action items as chips: "Drink extra water" | "Avoid screens" | "Rest if possible"

**Historical context:**  
"Your risk score over the last 30 days" — small sparkline chart

---

#### E4 — Weekly Summary Screen

**Purpose:** End-of-week automated digest  
**Arrival:** Weekly notification OR dedicated section in Insights

**Header:** "Week of May 5–11" (17px SemiBold)  
Navigation: "< Previous week" | "Next week >" (if available)

**Cards (stacked):**

Week Overview:
- Attacks this week: large number, color-coded vs last week
- Average severity
- Best day / Worst day

Top insight of the week:  
Same format as E1 hero card

Medication summary:  
What worked, what didn't

Logging consistency:  
7-day calendar row, each day: --success circle (logged) or --bg-tertiary (missed)  
Streak count: "5-day streak!"

**CTA:** "Share this week's report" (ghost, --accent-primary) — opens Doctor Report flow

---

### SCREEN GROUP F: HISTORY (3 Screens)

---

#### F1 — History Screen (Main)

**Purpose:** Browse all past attacks  
**Navigation:** Tab 4

**Header:**
- "Attack History" (DM Serif Display, 24px)
- Right: Filter icon (funnel, 44px tap) + Calendar view toggle icon

**Summary Strip (horizontal scroll, 3 stat chips):**
- "This month: 4 attacks"
- "Avg severity: 7.2"
- "Most attacks: Monday"

**Filter Bar:**
- Scrollable horizontal pill row: "All" | "Severe (8+)" | "With aura" | "Medicated" | "This month" | "Custom..."
- Active filter: --accent-primary background, white text

**Attack List** (grouped by month):

Month header: "MAY 2025" (11px, --text-muted, uppercase, with count "4 attacks")

**Attack Card** (each):
--bg-secondary, --radius-md, 16px padding, 12px gap between cards

Layout (horizontal):
- Left column (60px width):  
  - Day name: "MON" (11px, --text-muted uppercase)  
  - Day number: "12" (DM Mono Bold 22px, --text-primary)
- Center column (flex-1):  
  - Time: "11:42 AM → 4:04 PM" (12px, --text-muted)  
  - Duration: "4h 22min" (13px, --text-secondary)  
  - Chips (horizontal, small): pain location chip + symptom chips (2–3 max, then "+2 more")
- Right column:  
  - Severity number: DM Mono Bold 24px, severity-colored  
  - Below: medication taken indicator (pill icon if yes, --success colored)

Tap → navigates to C6 (Attack Detail)  
Swipe left: reveals "Delete" action (--danger)

**Empty state (no attacks logged):**  
Centered illustration + "No attacks logged yet" + "Log your first attack" CTA

---

#### F2 — Calendar View Screen

**Purpose:** Visual month-by-month view  
**Arrival:** Calendar toggle on History header

**Header:**
- "< Back" to list view
- Month/year with "< >" navigation arrows
- Current month: "May 2025" (17px SemiBold)

**Calendar Grid:**
- Standard 7-column, 5-row month grid
- Each day cell: 44×44px  
- Day with attack: colored circle background (color = avg severity that day)  
  - 1–4: --severity-1 (green)  
  - 5–7: --severity-5 (amber)  
  - 8–10: --severity-9 (red)  
- Multiple attacks in one day: stacked dots below number  
- Today: --accent-primary ring outline  
- No attacks: plain --text-muted number

**Day detail** (tap any day with attack):  
Bottom sheet slides up (--bg-tertiary, --radius-lg top corners, 24px padding):  
- Date header: "Monday, May 12"  
- Attack cards listed (same compact format)  
- Swipe down to dismiss

**Legend** (below calendar):  
- Small colored squares + labels: "Mild" | "Moderate" | "Severe"

---

#### F3 — Export / Doctor Report Screen

**Purpose:** Generate and share the doctor report PDF  
**Arrival:** Share button in History OR Insights

**Header:** "< Back" + "Doctor Report" (17px SemiBold)

**Period Selector:**  
Segmented control: "30 Days" | "60 Days" | "90 Days" (48px, full width)

**Report Preview Card** (--bg-secondary, --radius-lg, 20px padding):  
Thumbnail of what the report contains:
- "Report includes:" label (12px, --text-muted)
- Checklist rows (icon + text, 12px gap):
  - ✓ Total attacks + frequency trend
  - ✓ Average severity score
  - ✓ Top 3 suspected triggers
  - ✓ Medication usage + effectiveness rates
  - ✓ MIDAS disability score (auto-calculated)
  - ✓ Best and worst days analysis
  - ✓ Day-of-week pattern chart

**MIDAS Score Card:**  
"Your MIDAS Score: 18" (DM Mono Bold 28px)  
Grade: "Grade III — Severe disability" (--warning)  
Explanation: 12px, --text-secondary, 2 lines  
"This score is calculated from your logged attack history and is recognized by neurologists."

**CTA:** "Generate PDF Report" (56px, --accent-primary)  
On tap: loading state (spinner in button, 1–2s) → share sheet opens (native)

**Secondary options (icon + text links, below main CTA, 24px gap):**
- "Share via link" (generates temp read-only URL)
- "Export raw data (CSV)"

---

### SCREEN GROUP G: PROFILE & SETTINGS (6 Screens)

---

#### G1 — Profile Screen (Main)

**Purpose:** Account overview + settings hub  
**Navigation:** Tab 5

**Header:**
- User avatar (48px circle, initials on --accent-soft background if no photo)
- Right of avatar: Name (17px SemiBold) + "Pro member" badge (12px pill, --accent-primary)
- Settings gear icon (top right, 44px)

**Stats Row** (horizontal, 3 cells, --bg-secondary, --radius-md, 16px padding):
- "Logging since" / "Mar 2025"
- "Attacks logged" / "47"
- "Pro until" / "Mar 2026"

**Section: My Health**
List rows (48px height, --bg-secondary, --radius-md, 12px gap, chevron right):
- "My Conditions" → G2
- "My Triggers" → G2
- "My Medications" → G2

**Section: App Settings**
List rows:
- "Notifications" → G3
- "Panic Button" → G4
- "Data & Privacy" → G5
- "Doctor Reports" → F3

**Section: Account**
List rows:
- "Edit Profile"
- "Change Password"
- "Subscription" → G6
- "Help & Support"
- "Send Feedback"
- "Sign Out" (--danger colored text)

---

#### G2 — Health Profile Screen

**Purpose:** Edit conditions, triggers, medications  
**Arrival:** From G1

**Header:** "< Back" + "My Health Profile" (17px SemiBold)

**Three sections, each expandable:**

**My Conditions:**  
Chips showing current conditions (same as onboarding A3)  
"Edit" button → opens A3 selection in edit mode

**My Known Triggers:**  
Chip list of selected triggers  
"Edit" → opens multi-select (same as A4)  
"+ Add custom trigger" link

**My Medications:**  
Two subsections (Acute / Preventive)  
Each med as a row: name + dose + edit/delete actions  
"+ Add medication" link

---

#### G3 — Notifications Settings Screen

**Purpose:** Full notification control  
**Arrival:** Profile → Notifications

**Header:** "< Back" + "Notifications" (17px SemiBold)

**Master toggle** (top, --bg-secondary card):  
"Enable Notifications" — large toggle (--accent-primary when on)

**Each notification type (toggle rows, --bg-secondary, 16px padding):**

Format: icon (32px circle) + text block (left) + toggle (right)  
Toggle: system-style, --accent-primary when on

Rows:
- 🌅 **Morning Risk Alert** — "Sent when your risk score is elevated. Time: [7:30 AM]" (tap time to change)
- ✅ **Daily Check-in Reminder** — "Time: [8:00 AM]" (tappable)
- 💊 **Medication Reminders** — "Per your medication list" → sub-screen to set times per med
- 📊 **Weekly Summary** — "Every Sunday morning"
- 🎉 **Milestone Alerts** — "Attack-free streaks, logging streaks"
- 📅 **Cycle-based warning** (if opted in) — "Alert 2 days before predicted high-risk cycle phase"

---

#### G4 — Panic Button Settings Screen

**Purpose:** Customize panic mode  
**Arrival:** Profile → Panic Button

**Header:** "< Back" + "Panic Button" (17px SemiBold)

**Preview card:**  
Shows panic button preview (miniature version, 120px centered)

**Settings:**

"Panic Button Location":  
Segmented: "Home screen" | "Both home & widget"

"Quick Log Default Severity":  
Slider (1–10) — "Pre-set severity so you can log with zero taps if needed"

"After Panic Log":  
"Automatically enable Do Not Disturb" — toggle  
"Dim screen to minimum brightness" — toggle  
"Show breathing guide" — toggle

"Panic Mode Brightness":  
Slider: "Low" → "Normal" — controls how dark panic mode goes

---

#### G5 — Data & Privacy Screen

**Purpose:** Transparency + data control  
**Arrival:** Profile → Data & Privacy

**Header:** "< Back" + "Data & Privacy" (17px SemiBold)

**Sections:**

"Your Data":  
- "All your data is encrypted at rest and in transit" — info row (no toggle, just statement with shield icon)
- "We never sell your health data" — info row
- "Export all my data (CSV)" — action row, --accent-primary
- "Delete all my data" — action row, --danger

"Analytics":
- "Help improve mibrain (anonymous usage data)" — toggle (default ON)

"Privacy Policy" — link row, opens in-app browser  
"Terms of Service" — link row

---

#### G6 — Subscription / Upgrade Screen

**Purpose:** Paywall and subscription management  
**Arrival:** Profile → Subscription OR from locked features

**Header:** "< Back" + "mibrain Pro" (DM Serif Display, 24px)

**Hero:**  
Soft gradient card (--accent-primary gradient, dark toned):  
"Unlock everything" (22px SemiBold)  
"AI trigger analysis, doctor reports, full history, voice logging"

**Plan Cards** (two, side by side):

Monthly card:
- "$6.99" (DM Mono Bold 28px) + "/month" (14px)
- --bg-secondary, --radius-lg, border --border-default

Annual card (RECOMMENDED):
- "$49.99" (DM Mono Bold 28px) + "/year" (14px)
- "$4.17/month" (13px, --success) — saves 40%
- --accent-soft background, --border-active border
- "Best Value" badge (12px pill, --accent-primary, top right)

**Feature List:**
Checklist (icon + text, 14px, 12px gap):
- ✓ AI trigger analysis (unlocks after 14 days)
- ✓ Daily risk score predictions
- ✓ Doctor report PDF export
- ✓ Full attack history (unlimited)
- ✓ Voice logging
- ✓ Medication effectiveness tracking
- ✓ Weekly AI insights digest
- ✓ Priority support

**CTA:** "Start 14-Day Free Trial" (56px, --accent-primary)  
"No credit card required" (12px, --text-muted, centered, below)

**Current subscribers:** Show plan, next billing date, "Cancel subscription" link (--text-muted, 13px)

---

### SCREEN GROUP H: EMPTY STATES & UTILITY (4 Screens)

---

#### H1 — Onboarding Complete / First Launch Screen

**Purpose:** Celebrate completion, set expectations  
**Arrival:** After creating account

**Full screen, centered:**
- Soft success animation (circle expanding, checkmark appearing, --success color)
- H1 (DM Serif Display, 28px): "You're all set, [Name]."
- Body (15px, --text-secondary, centered):  
  "mibrain works best with daily logging. Your first AI insight appears after 14 days — the more you log, the more accurate it gets."
- Progress indicator: "Day 1 of 14 until your first insight"
- CTA: "Start My First Log" (56px, --accent-primary)
- Ghost: "Explore the app first" (--text-secondary, below)

---

#### H2 — Loading / Processing Screen

**Purpose:** AI is generating insights  
**Arrival:** Triggered after sufficient data is available for first insight

**Full centered:**
- Animated logo mark (mibrain wordmark pulsing softly, --accent-primary)
- "Analyzing your patterns..." (16px, --text-secondary)
- Progress bar (--accent-primary, animated, --bg-secondary track)
- Rotating tip text (every 2s):  
  "Looking at your sleep patterns..."  
  "Analyzing weather correlations..."  
  "Identifying your trigger combinations..."  
  "Almost there..."

---

#### H3 — Error State Screen

**Purpose:** Graceful error handling

**Centered layout:**
- Icon: triangle-warning (48px, --warning)
- H2 (20px): "Something went wrong"
- Body (14px, --text-secondary): Context-specific message  
- CTA: "Try Again" (56px, --accent-primary)
- Ghost: "Go Home" (below)

---

#### H4 — Offline Mode Banner

**Purpose:** Notify user they can still log offline  
**Appearance:** Persistent top banner (44px) when offline

Content:
- Yellow/amber thin banner below status bar
- "You're offline — logs will sync when connected" (12px, --text-inverse on --warning bg)
- All logging still works (stored locally, synced later)

---

## SECTION 4: INTERACTION FLOWS

### Critical Flow 1: Panic Attack Flow
```
User feels attack → Home Screen
→ Taps "Attack Now" (red button)
→ C1 Panic Mode (full dark screen)
→ Selects severity (1–10 large buttons)
→ "Did you take medication?" Yes/No
→ Taps "Log Attack" 
→ Confirmation flash → returns Home
→ Active attack banner appears on Home
→ Later: taps "End Attack" → C3 End Attack screen
→ Logs medication effectiveness + recovery state
→ Attack saved to history
```

### Critical Flow 2: Voice Log Flow
```
User taps mic button on Home
→ C4 Voice Log Screen
→ Taps large mic button
→ Speaks: "Migraine, severity 8, right temple, took Sumatriptan"
→ Waveform animates, transcription appears live
→ AI parses: severity=8, location=right temple, med=Sumatriptan
→ Parsed fields shown as confirmation chips
→ User taps "Log this attack"
→ Saved → returns Home
```

### Critical Flow 3: Insights Unlock Flow
```
Day 14 → morning check-in submitted
→ AI trigger analysis triggered (background)
→ Push notification: "Your first insight is ready!"
→ User opens app → H2 Loading screen (2–3s)
→ E1 Insights Main Screen revealed with animation
→ First insight card animates in with --ease-spring
→ User explores correlations
```

---

## SECTION 5: ACCESSIBILITY REQUIREMENTS

All screens must meet these standards:

- **Minimum contrast ratio:** 4.5:1 for body text, 3:1 for large text (WCAG AA)
- **Minimum touch target:** 44×44px for all interactive elements
- **Focus indicators:** Visible focus ring (2px, --accent-primary) on all focusable elements
- **Motion sensitivity:** All animations respect `prefers-reduced-motion` — disable pulsing/spinning animations
- **Text scaling:** UI must remain functional at iOS/Android large text settings (up to 150% scale)
- **Screen reader labels:** All icon-only buttons must have accessible labels
- **Color not sole indicator:** Severity levels must show both color AND number/label

---

## SECTION 6: SCREEN INVENTORY SUMMARY

| Group | Screen ID | Screen Name |
|-------|-----------|-------------|
| Onboarding | A1 | Splash Screen |
| Onboarding | A2 | Welcome Screen |
| Onboarding | A3 | Condition Setup |
| Onboarding | A4 | Trigger Awareness |
| Onboarding | A5 | Medication Setup |
| Onboarding | A6 | Notification Permission |
| Onboarding | A7 | Create Account |
| Onboarding | A8 | Sign In |
| Home | B1 | Home Main |
| Home | B2 | Home (No Data) |
| Home | B3 | Notification Center |
| Attack Logging | C1 | Panic Mode |
| Attack Logging | C2 | Full Attack Log |
| Attack Logging | C3 | End Attack |
| Attack Logging | C4 | Voice Log |
| Attack Logging | C5 | Daily Check-in |
| Attack Logging | C6 | Log History Detail |
| Insights | E1 | Insights Main |
| Insights | E2 | Trigger Deep Dive |
| Insights | E3 | Risk Score Detail |
| Insights | E4 | Weekly Summary |
| History | F1 | History Main |
| History | F2 | Calendar View |
| History | F3 | Doctor Report |
| Profile | G1 | Profile Main |
| Profile | G2 | Health Profile |
| Profile | G3 | Notification Settings |
| Profile | G4 | Panic Button Settings |
| Profile | G5 | Data & Privacy |
| Profile | G6 | Subscription / Upgrade |
| Utility | H1 | Onboarding Complete |
| Utility | H2 | AI Loading |
| Utility | H3 | Error State |
| Utility | H4 | Offline Banner |

**Total: 34 screens**

---

## SECTION 7: STITCH PROMPT INSTRUCTIONS

When feeding this to Google Stitch, use this system prompt prefix before each screen:

```
You are designing a screen for mibrain, an AI-powered migraine tracker app.
Design system: Dark background (#0D0F14), accent color (#7C6EF5 violet-indigo), 
typography: DM Serif Display for headings, DM Sans for body, DM Mono for numbers.
Mobile frame: 390×844px. Dark mode only. Generous touch targets (min 56px for CTAs).
Calm, premium, medical-adjacent but warm. No harsh whites. No purple gradients on white.
Now design: [SCREEN NAME] — [SCREEN DESCRIPTION FROM THIS GUIDE]
```

Then paste the relevant screen specification from this document.

Generate screens in this order for best consistency:
1. Start with A2 (Welcome) to lock in visual tone
2. Then B1 (Home) to establish the component library
3. Then C1 (Panic Mode) to establish the dark emergency variant
4. Then all remaining screens referencing the established components

---

*End of mibrain Design Guide — MVP v1.0*
*34 screens | 7 screen groups | 1 cohesive product*
