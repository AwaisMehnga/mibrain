1. Shared authenticated API foundation
   - Prerequisite: auth, sign in, sign up, onboarding, and database are already implemented
   - Implement shared `/api/v1` API client
   - Implement bearer token request headers
   - Implement standard success, list, and error response handling
   - Implement unauthenticated and onboarding-required API error handling
   - API sequence:
     - `GET /api/v1/me`
     - `POST /api/v1/auth/refresh`
     - `POST /api/v1/auth/logout`

2. Profile, health profile, and user preferences foundation
   - Prerequisite: shared authenticated API foundation
   - Implement profile read and edit
   - Implement health profile read and edit
   - Implement conditions, triggers, acute medications, and preventive medications management
   - Implement app preferences used by logging, Home, notifications, and panic mode
   - API sequence:
     - `GET /api/v1/profile`
     - `GET /api/v1/profile/health`
     - `GET /api/v1/settings/preferences`
     - `PATCH /api/v1/profile`
     - `PUT /api/v1/profile/health`
     - `PATCH /api/v1/settings/preferences`

3. Daily check-in logging
   - Prerequisite: profile, health profile, and user preferences foundation
   - Implement today's check-in fetch
   - Implement sleep, hydration, meals, stress, energy, and optional cycle day input
   - Implement create or replace today's check-in
   - Implement past check-ins query for risk, Home, Insights, Weekly Summary, and Reports
   - API sequence:
     - `GET /api/v1/checkins/today`
     - `POST /api/v1/checkins`
     - `GET /api/v1/checkins`

4. Environmental context for risk
   - Prerequisite: profile, health profile, and user preferences foundation
   - Implement location preference for coarse weather/environment data
   - Implement today's environment fetch
   - API sequence:
     - `PUT /api/v1/environment/location-preference`
     - `GET /api/v1/environment/today`

5. Risk scoring foundation
   - Prerequisite: daily check-in logging and environmental context for risk
   - Implement today's risk fetch
   - Implement risk recalculation after check-in or environment update
   - API sequence:
     - `POST /api/v1/risk/recalculate`
     - `GET /api/v1/risk/today`

6. Panic attack quick logging
   - Prerequisite: profile, health profile, and user preferences foundation
   - Implement panic attack screen
   - Implement severity selection
   - Implement medication yes or no selection
   - Implement minimal active attack creation
   - Implement active attack fetch for Home and end attack flow
   - API sequence:
     - `POST /api/v1/attacks/panic`
     - `GET /api/v1/attacks/active`

7. End active attack
   - Prerequisite: panic attack quick logging
   - Implement active attack summary
   - Implement end time selection
   - Implement medication taken and effectiveness update
   - Implement recovery state and recovery notes
   - Implement active attack completion
   - API sequence:
     - `GET /api/v1/attacks/active`
     - `POST /api/v1/attacks/:attackId/end`
     - `GET /api/v1/attacks/:attackId`

8. Full attack logging
   - Prerequisite: profile, health profile, and user preferences foundation
   - Implement detailed attack log flow
   - Implement start time, end time, severity, and peak severity
   - Implement pain locations and pain types
   - Implement symptoms and aura details
   - Implement medications, dose, taken time, and effectiveness
   - Implement possible triggers
   - Implement notes
   - Implement create detailed attack
   - Implement edit existing attack
   - Implement soft delete attack
   - API sequence:
     - `POST /api/v1/attacks`
     - `GET /api/v1/attacks/:attackId`
     - `PATCH /api/v1/attacks/:attackId`
     - `DELETE /api/v1/attacks/:attackId`

9. Attack history data
   - Prerequisite: panic attack quick logging, end active attack, and full attack logging
   - Implement attack list query
   - Implement filters for all, severe, aura, medicated, this month, and date range
   - Implement attack detail read
   - Implement edit this log from history detail
   - Implement delete from history detail
   - API sequence:
     - `GET /api/v1/attacks`
     - `GET /api/v1/attacks/:attackId`
     - `PATCH /api/v1/attacks/:attackId`
     - `DELETE /api/v1/attacks/:attackId`

10. Home screen with real data
   - Prerequisite: daily check-in logging, risk scoring foundation, panic attack quick logging, end active attack, full attack logging, and attack history data
   - Implement Home command center
   - Implement risk card from real risk data
   - Implement model-building state when data is not enough
   - Implement active attack banner
   - Implement recent attacks
   - Implement stats
   - Implement top insight teaser when insight data exists
   - Implement quick action navigation to panic attack, voice log, check-in, and full log
   - API sequence:
     - `GET /api/v1/home`
     - `GET /api/v1/risk/today`
     - `GET /api/v1/attacks/active`
     - `GET /api/v1/attacks`

11. Risk detail screen
   - Prerequisite: daily check-in logging, environmental context for risk, risk scoring foundation, and attack history data
   - Implement score, label, summary, factors, recommendations, and 30-day sparkline
   - Implement risk explanations from check-ins, attacks, triggers, and environment
   - API sequence:
     - `GET /api/v1/risk/today`
     - `GET /api/v1/checkins`
     - `GET /api/v1/attacks`
     - `GET /api/v1/environment/today`

12. Calendar history
   - Prerequisite: attack history data
   - Implement monthly calendar view
   - Implement attack severity indicators by day
   - Implement day detail bottom sheet
   - Implement attack detail navigation from calendar
   - API sequence:
     - `GET /api/v1/history/calendar`
     - `GET /api/v1/history/calendar/:date`
     - `GET /api/v1/attacks/:attackId`

13. File storage foundation
   - Prerequisite: shared authenticated API foundation
   - Implement private upload URL creation
   - Implement private download URL creation
   - Implement private file deletion
   - API sequence:
     - `POST /api/v1/files/upload-url`
     - `GET /api/v1/files/:objectId/download-url`
     - `DELETE /api/v1/files/:objectId`

14. Voice logging
   - Prerequisite: file storage foundation and full attack logging
   - Implement mic recording state
   - Implement transcript processing state
   - Implement voice transcription
   - Implement parsed attack preview
   - Implement confirm parsed voice log into attack
   - Implement edit parsed voice log before saving
   - API sequence:
     - `POST /api/v1/voice/transcribe`
     - `POST /api/v1/voice/:voiceNoteId/confirm`
     - `POST /api/v1/attacks`
     - `PATCH /api/v1/attacks/:attackId`

15. Insights generation
   - Prerequisite: daily check-in logging, end active attack, full attack logging, attack history data, and risk scoring foundation
   - Implement generate or refresh insights action
   - Implement processing state
   - API sequence:
     - `POST /api/v1/insights/generate`

16. Insights dashboard
   - Prerequisite: insights generation and enough completed attack/check-in data
   - Implement locked insights state
   - Implement top pattern
   - Implement trigger correlation chart
   - Implement time heatmap
   - Implement medication effectiveness
   - Implement monthly trend
   - Implement trigger insight detail
   - API sequence:
     - `GET /api/v1/insights`
     - `GET /api/v1/insights/:insightId`

17. Weekly summary
   - Prerequisite: insights generation, attack history data, and daily check-in logging
   - Implement weekly summary screen
   - Implement weekly attack totals, average severity, best day, worst day, top insight, and logging days
   - API sequence:
     - `GET /api/v1/insights/weekly`
     - `GET /api/v1/attacks`
     - `GET /api/v1/checkins`

18. Notifications center
   - Prerequisite: Home screen with real data, risk detail screen, daily check-in logging, and weekly summary
   - Implement notification list
   - Implement unread state
   - Implement mark one as read
   - Implement mark all as read
   - Implement deep links for risk alert, check-in, weekly summary, and report
   - API sequence:
     - `GET /api/v1/notifications`
     - `PATCH /api/v1/notifications/:notificationId/read`
     - `POST /api/v1/notifications/mark-all-read`
     - `PUT /api/v1/notifications/preferences`

19. Doctor reports and raw exports
   - Prerequisite: attack history data, daily check-in logging, insights dashboard, file storage foundation, and profile data
   - Implement report period selection
   - Implement report preview
   - Implement PDF report generation
   - Implement report status fetch
   - Implement report download
   - Implement share link creation
   - Implement share link revocation
   - Implement raw CSV export
   - API sequence:
     - `POST /api/v1/reports`
     - `GET /api/v1/reports/:reportId`
     - `GET /api/v1/reports/:reportId/download`
     - `POST /api/v1/reports/:reportId/share-link`
     - `DELETE /api/v1/reports/:reportId/share-link`
     - `GET /api/v1/exports/raw-data`

20. Data and privacy
   - Prerequisite: profile data, file storage foundation, attack history data, daily check-in logging, and doctor reports
   - Implement consent list
   - Implement consent update
   - Implement full data export request
   - Implement account or data deletion request
   - Implement privacy request status
   - API sequence:
     - `GET /api/v1/privacy/consents`
     - `POST /api/v1/privacy/consents`
     - `POST /api/v1/privacy/export`
     - `POST /api/v1/privacy/delete-request`
     - `GET /api/v1/privacy/requests/:requestId`

21. Subscription
   - Prerequisite: profile data and shared authenticated API foundation
   - Implement plans list
   - Implement current subscription status
   - Implement checkout start
   - Implement cancel subscription
   - API sequence:
     - `GET /api/v1/billing/plans`
     - `GET /api/v1/billing/subscription`
     - `POST /api/v1/billing/checkout`
     - `POST /api/v1/billing/cancel`

22. Support and feedback
   - Prerequisite: shared authenticated API foundation and profile data
   - Implement feedback form
   - Implement support contact form
   - API sequence:
     - `POST /api/v1/feedback`
     - `POST /api/v1/support/contact`
