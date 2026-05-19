# mibrain Flow

Implementation-focused order of user flows, screen transitions, and data movement.

## 1. App Start

1. User opens `/`.
2. `Layout` shows Splash for about 1 second.
3. `AppRouter` reads persisted `mibrain-auth-store`.
4. If `auth.isOnboarded` is false, go to `/setup/welcome`.
5. If onboarded but not authenticated, go to `/setup/signin`.
6. If authenticated and onboarded, show Home at `/`.
7. Normal app screens show `Topbar` + bottom `NavBar`.
8. Fullscreen routes hide app chrome: `/log/panic-attack`, `/log/voice`, `/check-in`, `/history/:attackId`.

## 2. Onboarding

1. `/setup/welcome`
   - `Get Started` -> `/setup/conditions`.
   - `Sign in` -> `/setup/signin`.

2. `/setup/conditions`
   - User selects migraine conditions.
   - Save to `healthProfile.conditions`.
   - Next -> `/setup/triggers`.

3. `/setup/triggers`
   - User selects known triggers.
   - Save to `healthProfile.triggers`.
   - Next -> `/setup/medications`.

4. `/setup/medications`
   - User selects acute and preventive medications, or skips.
   - Save to `healthProfile.medications.acute` and `healthProfile.medications.preventive`.
   - Next -> `/setup/notifications`.

5. `/setup/notifications`
   - Enable notifications sets `preferences.notificationsEnabled = true`.
   - `Not now` keeps notifications disabled.
   - Next -> `/setup/create-account`.

6. `/setup/create-account`
   - User enters name, email, password, confirm password.
   - Validate form.
   - Create local auth session in `auth`.
   - Set `auth.isAuthenticated = true` and `auth.isOnboarded = true`.
   - Go to `/`.

## 3. Sign In

1. User opens `/setup/signin`.
2. User enters email and password.
3. Validate required fields.
4. Set `auth.isAuthenticated = true`, create `auth.user`, set token.
5. Set `auth.isOnboarded = true`.
6. Go to `/`.

## 4. Home

1. Home `/` is the command center.
2. Risk card shows either:
   - model-building state if data is not enough
   - score, risk label, reason, and factors if data exists
3. Tapping risk card -> `/risk-detail`.
4. Quick actions:
   - `Attack Now` -> `/log/panic-attack`
   - `Voice Log` -> `/log/voice`
   - `Check-in` -> `/check-in`
5. Insight teaser arrow -> `/insights`.
6. `See all` recent attacks -> `/history`.
7. If an attack is active, show active attack banner.
8. `End Attack` in banner -> `/log/end-attack`.

## 5. Daily Check-In

1. User opens `/check-in`.
2. Step 1 saves sleep hours and sleep quality.
3. Step 2 saves hydration and skipped meals.
4. Step 3 saves stress and energy.
5. Step 4 appears only for menstrual migraine users and saves cycle day.
6. On final submit, calculate risk score.
7. Save one `dailyCheckin` object:
   - sleep, hydration, meals, stress, energy, optional cycle day, score, `completedAt`
8. Show confirmation.
9. Return to Home.
10. Home/Risk Detail read the latest check-in to update risk.

## 6. Panic Attack Quick Log

1. User taps `Attack Now` from Home.
2. Open `/log/panic-attack`.
3. User selects severity 1-10.
4. Medication question appears.
5. User selects `Yes` or `Not yet`.
6. User taps `Log Attack`.
7. Create minimal active attack:
   - `startedAt`, `severity`, `tookMedication`, `status: active`
8. Show `Attack logged`.
9. Return to Home.
10. Home shows active attack banner.
11. User later taps `End Attack` to finish it.

## 7. Full Attack Log

1. User opens `/log`.
2. Detailed log moves through sections:
   - start time + severity
   - pain location
   - pain type
   - symptoms
   - aura details if Aura is selected
   - medication + dose
   - possible triggers
   - notes
3. User can move `Next` and `Back`.
4. Notes mic button -> `/log/voice`.
5. Final save creates or updates an attack log:
   - `startedAt`, `severity`, locations, pain types, symptoms, aura types, medications, triggers, notes
6. Return to Home.
7. The attack becomes available to History, Calendar, Insights, and Doctor Report.

## 8. End Attack

1. User opens `/log/end-attack` from the active banner.
2. Screen shows active attack summary.
3. User sets end time.
4. User confirms medications taken or adds medication.
5. For each medication, user selects effectiveness.
6. User selects recovery/postdrome state.
7. User adds recovery notes.
8. `End Attack` updates active attack:
   - `status: ended`, `endedAt`, duration, medication effectiveness, recovery, notes
9. Show confirmation.
10. Return to Home.
11. Active banner disappears and the completed attack appears in History.

## 9. Voice Log

1. User opens `/log/voice`.
2. User taps mic.
3. State changes: `Tap to start` -> `Listening...` -> `Processing...` -> `Got it.`
4. Transcript appears while listening.
5. App parses fields such as severity, location, medication.
6. User chooses:
   - `Log this attack` -> save parsed attack and return Home
   - `Edit details first` -> open `/log` with parsed values prefilled

## 10. Risk Detail

1. User taps Home risk card.
2. Open `/risk-detail`.
3. Show score, label, contributing factors, recommendations, 30-day sparkline.
4. Data should come from latest check-in, recent attacks, selected triggers, and risk model inputs.
5. Back returns to previous screen.

## 11. Insights

1. User opens `/insights`.
2. If less than 14 days of useful data, show locked/progress state.
3. If unlocked, show:
   - top pattern
   - trigger correlation chart
   - time heatmap
   - medication effectiveness
   - monthly trend
4. Trigger row tap -> `/insights/detail/:trigger`.
5. Detail screen shows trigger frequency, explanation, threshold, example attacks, recommendations.
6. Weekly summary link -> `/insights/weekly`.
7. Insights read completed attacks, check-ins, triggers, and medication effectiveness.

## 12. History

1. User opens `/history`.
2. Show summary stats, filters, and attack list grouped by month.
3. Filters include all, severe, aura, medicated, this month, custom.
4. Attack tap -> `/history/:attackId`.
5. Detail shows severity, duration, date/time, locations, symptoms, meds, triggers, AI note, notes, voice note.
6. `Edit this log` -> `/log` with that attack loaded.
7. `Delete` should confirm, then remove the attack.

## 13. Calendar

1. User taps calendar icon from History.
2. Open `/history/calendar`.
3. Calendar groups attacks by date.
4. Attack days show severity color.
5. User switches months with arrows.
6. Day tap opens bottom sheet.
7. Bottom sheet lists attacks for that day.
8. Attack tap -> `/history/:attackId`.

## 14. Doctor Report

1. User opens `/report` from History, Profile, or Weekly Summary.
2. Select period: 30, 60, or 90 days.
3. Filter completed attacks by period.
4. Show preview: totals, severity, top triggers, medication effectiveness, MIDAS score, trends.
5. `Generate PDF Report` creates report and opens native share if available.
6. Fallback downloads report.
7. Secondary actions: share link and export CSV.

## 15. Notifications

1. User opens `/notifications`.
2. Notifications are grouped by time.
3. Unread rows are highlighted.
4. `Mark all read` clears unread state.
5. Notification tap should deep link:
   - risk alert -> `/risk-detail`
   - check-in -> `/check-in`
   - weekly summary -> `/insights/weekly`
   - report -> `/report`

## 16. Profile

1. User opens `/profile`.
2. Profile shows user, membership, stats, health, app settings, account actions.
3. Health rows open Health Profile and edit:
   - conditions, triggers, medications
4. Notifications row edits:
   - notification enabled state, risk alert time, check-in time
5. Panic Button row edits:
   - panic button location, default severity, after-log behavior, brightness
6. Data & Privacy row handles:
   - export data, delete data, analytics opt-in, policy links
7. Doctor Reports -> `/report`.
8. Subscription opens Pro screen.
9. Sign Out calls `logout()`, clears persisted store, and goes to `/setup/signin`.

## 17. Shared Data Shape

1. `auth`: authentication, onboarding, user, token.
2. `healthProfile`: conditions, triggers, acute meds, preventive meds.
3. `preferences`: notifications, alert times, panic button, theme.
4. `dailyCheckin`: latest baseline inputs and calculated risk.
5. `attacks`: active and completed attack logs.
6. `notifications`: message type, title, body, read state, target route.

## 18. Data Movement Rules

1. Onboarding writes baseline health profile and preferences.
2. Daily check-in writes today's baseline and updates risk.
3. Panic log creates a minimal active attack fast.
4. Full log creates a detailed attack or enriches an existing attack.
5. End attack turns an active attack into a completed history item.
6. History, Calendar, Insights, and Report read completed attacks.
7. Insights generate derived summaries, not raw log edits.
8. Profile mutates profile and preferences.
9. Sign out clears local persisted app state.

## 19. Build Order

1. Store shape for auth, profile, preferences, check-ins, attacks, notifications.
2. Onboarding writes.
3. Home from real store data.
4. Daily check-in and risk calculation.
5. Panic quick log and active attack state.
6. End attack.
7. Full attack create/edit.
8. History and Calendar from real attacks.
9. Risk Detail and Insights from derived data.
10. Doctor Report export.
11. Profile settings.
12. Notification read/deep-link behavior.
