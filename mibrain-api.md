# mibrain API Contract

Backend API endpoints for the mibrain app. The frontend should call these endpoints; the backend owns authentication, validation, PostgreSQL access, encryption/decryption, audit logging, file storage, and privacy workflows.

Base URL:

```txt
/api/v1
```

## 1. API Rules

1. All authenticated endpoints require:
   - `Authorization: Bearer <accessToken>`
2. All request and response bodies are JSON unless the endpoint is for file upload/download.
3. IDs are UUID strings.
4. Dates use ISO 8601.
5. User-owned endpoints must infer `userId` from the access token, never from frontend payload.
6. Sensitive fields such as notes, medication dose, transcript, phone, email, and report files are encrypted or protected by backend policies.
7. Backend creates audit events for sensitive reads, exports, report sharing, admin/support access, and deletion.

## 2. Standard Response Shapes

### Success

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_123",
    "serverTime": "2026-05-19T10:30:00Z"
  }
}
```

### List Success

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "limit": 20,
    "cursor": "next_cursor_or_null",
    "hasMore": true
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the highlighted fields.",
    "fields": {
      "email": "Invalid email address"
    }
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

Common error codes:

1. `UNAUTHENTICATED`
2. `FORBIDDEN`
3. `NOT_FOUND`
4. `VALIDATION_ERROR`
5. `CONFLICT`
6. `RATE_LIMITED`
7. `SERVER_ERROR`

## 3. Auth Endpoints

### POST `/auth/register`

Create account.

Payload:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secure-password",
  "countryCode": "US",
  "timezone": "America/New_York",
  "locale": "en-US"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "isOnboarded": false
    },
    "tokens": {
      "accessToken": "jwt",
      "refreshToken": "refresh_token",
      "expiresIn": 3600
    }
  }
}
```

### POST `/auth/login`

Payload:

```json
{
  "email": "jane@example.com",
  "password": "secure-password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "isOnboarded": true
    },
    "tokens": {
      "accessToken": "jwt",
      "refreshToken": "refresh_token",
      "expiresIn": 3600
    }
  }
}
```

### POST `/auth/refresh`

Payload:

```json
{
  "refreshToken": "refresh_token"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "refresh_token",
    "expiresIn": 3600
  }
}
```

### POST `/auth/logout`

Payload:

```json
{
  "refreshToken": "refresh_token"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "loggedOut": true
  }
}
```

### POST `/auth/password/forgot`

Payload:

```json
{
  "email": "jane@example.com"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "message": "If an account exists, reset instructions were sent."
  }
}
```

### POST `/auth/password/reset`

Payload:

```json
{
  "resetToken": "token",
  "newPassword": "new-secure-password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "passwordUpdated": true
  }
}
```

## 4. Bootstrap And Home

### GET `/me`

Fetch current authenticated user and app state.

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "countryCode": "US",
      "timezone": "America/New_York",
      "isOnboarded": true,
      "subscriptionStatus": "active"
    },
    "preferences": {
      "notificationsEnabled": true,
      "riskAlertTime": "07:30",
      "checkinTime": "08:00",
      "panicButtonLocation": "home-screen",
      "theme": "dark"
    }
  }
}
```

### GET `/home`

Fetch Home screen summary.

Response:

```json
{
  "success": true,
  "data": {
    "risk": {
      "score": 72,
      "level": "high",
      "label": "High Risk",
      "summary": "You slept 5.4h and pressure is rising in your area.",
      "factors": [
        { "label": "Poor sleep", "impact": 18 },
        { "label": "Rising pressure", "impact": 12 }
      ],
      "dataSufficiency": "sufficient",
      "daysUntilInsight": 0
    },
    "activeAttack": {
      "id": "atk_uuid",
      "startedAt": "2026-05-19T08:40:00Z",
      "severity": 8,
      "durationMinutes": 84
    },
    "stats": {
      "lastAttackLabel": "3 days ago",
      "attacksThisMonth": 4,
      "loggingStreakDays": 7
    },
    "topInsight": {
      "id": "ins_uuid",
      "text": "Attacks are 3x more likely after less than 6.5h sleep"
    },
    "recentAttacks": []
  }
}
```

## 5. Onboarding

### GET `/catalog/onboarding`

Fetch selectable setup options.

Response:

```json
{
  "success": true,
  "data": {
    "conditions": [
      { "id": "chronic", "name": "Chronic Migraine", "description": "More than 15 headache days per month" }
    ],
    "triggers": [
      { "id": "sleep", "name": "Poor sleep", "category": "sleep" }
    ],
    "medications": {
      "acute": [
        { "id": "sumatriptan", "name": "Sumatriptan" }
      ],
      "preventive": [
        { "id": "topiramate", "name": "Topiramate" }
      ]
    }
  }
}
```

### PUT `/onboarding`

Save onboarding progress. Can be called after each step or once at the end.

Payload:

```json
{
  "conditions": ["episodic", "aura", "weather"],
  "triggers": ["sleep", "weather", "stress"],
  "medications": {
    "acute": [
      { "catalogId": "sumatriptan", "customName": null, "defaultDose": "50mg" }
    ],
    "preventive": []
  },
  "preferences": {
    "notificationsEnabled": true
  },
  "currentStep": "create-account",
  "isComplete": false
}
```

Response:

```json
{
  "success": true,
  "data": {
    "currentStep": "create-account",
    "isComplete": false
  }
}
```

### POST `/onboarding/complete`

Payload:

```json
{
  "completedAt": "2026-05-19T10:30:00Z"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "isOnboarded": true
  }
}
```

## 6. Profile And Settings

### GET `/profile`

Response:

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "usr_uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "countryCode": "US",
      "regionCode": "NY",
      "timezone": "America/New_York",
      "locale": "en-US",
      "measurementSystem": "imperial"
    },
    "stats": {
      "loggingSince": "2025-03-01",
      "attacksLogged": 47,
      "proUntil": "2026-03-01"
    }
  }
}
```

### PATCH `/profile`

Payload:

```json
{
  "name": "Jane Doe",
  "countryCode": "US",
  "regionCode": "NY",
  "timezone": "America/New_York",
  "locale": "en-US",
  "measurementSystem": "imperial"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "profile": {}
  }
}
```

### GET `/profile/health`

Response:

```json
{
  "success": true,
  "data": {
    "conditions": ["episodic", "aura"],
    "triggers": ["sleep", "stress", "weather"],
    "medications": {
      "acute": [
        {
          "id": "med_uuid",
          "name": "Sumatriptan",
          "defaultDose": "50mg",
          "isCustom": false
        }
      ],
      "preventive": []
    }
  }
}
```

### PUT `/profile/health`

Payload:

```json
{
  "conditions": ["episodic", "aura"],
  "triggers": ["sleep", "stress", "weather"],
  "medications": {
    "acute": [
      { "id": "med_uuid", "catalogId": "sumatriptan", "customName": null, "defaultDose": "50mg" }
    ],
    "preventive": []
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "healthProfileUpdated": true
  }
}
```

### GET `/settings/preferences`

Response:

```json
{
  "success": true,
  "data": {
    "notificationsEnabled": true,
    "riskAlertTime": "07:30",
    "checkinTime": "08:00",
    "panicButtonLocation": "home-screen",
    "defaultPanicSeverity": 8,
    "theme": "dark"
  }
}
```

### PATCH `/settings/preferences`

Payload:

```json
{
  "notificationsEnabled": true,
  "riskAlertTime": "07:30",
  "checkinTime": "08:00",
  "panicButtonLocation": "home-screen",
  "defaultPanicSeverity": 8,
  "theme": "dark"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "preferencesUpdated": true
  }
}
```

## 7. Daily Check-In

### GET `/checkins/today`

Response:

```json
{
  "success": true,
  "data": {
    "checkin": {
      "id": "chk_uuid",
      "checkinDate": "2026-05-19",
      "sleepHours": 7.5,
      "sleepQuality": "restful",
      "hydrationStatus": "yes",
      "mealStatus": "no_meals_skipped",
      "stressLevel": 3,
      "energyLevel": 4,
      "cycleDay": 7,
      "completedAt": "2026-05-19T08:05:00Z"
    }
  }
}
```

### POST `/checkins`

Create or replace today's check-in.

Payload:

```json
{
  "checkinDate": "2026-05-19",
  "sleepHours": 7.5,
  "sleepQuality": "restful",
  "hydrationStatus": "yes",
  "mealStatus": "no_meals_skipped",
  "stressLevel": 3,
  "energyLevel": 4,
  "cycleDay": 7,
  "notes": "Woke up calm."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "checkin": {
      "id": "chk_uuid",
      "checkinDate": "2026-05-19"
    },
    "risk": {
      "score": 42,
      "level": "moderate",
      "label": "Moderate Risk"
    }
  }
}
```

### GET `/checkins`

Query past check-ins.

Query:

```txt
?from=2026-05-01&to=2026-05-19&limit=20&cursor=abc
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "chk_uuid",
      "checkinDate": "2026-05-19",
      "sleepHours": 7.5,
      "stressLevel": 3,
      "energyLevel": 4
    }
  ],
  "pagination": {
    "limit": 20,
    "cursor": null,
    "hasMore": false
  }
}
```

## 8. Risk

### GET `/risk/today`

Response:

```json
{
  "success": true,
  "data": {
    "score": 72,
    "level": "high",
    "label": "High Risk",
    "summary": "You slept 5.4h and pressure is rising in your area.",
    "factors": [
      {
        "type": "sleep",
        "label": "Poor sleep",
        "impact": 18,
        "direction": "increases_risk",
        "explanation": "Your most significant factor today."
      }
    ],
    "recommendations": ["Drink extra water", "Avoid screens", "Rest if possible"],
    "sparkline30Days": [15, 18, 22, 25, 30, 40, 72]
  }
}
```

### POST `/risk/recalculate`

Recalculate risk, usually after check-in or environmental update.

Payload:

```json
{
  "scoreDate": "2026-05-19",
  "reason": "daily_checkin_updated"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "score": 72,
    "level": "high",
    "modelVersion": "risk-v1"
  }
}
```

## 9. Attack Logging

### POST `/attacks/panic`

Fast minimal attack log.

Payload:

```json
{
  "startedAt": "2026-05-19T08:40:00Z",
  "severity": 8,
  "tookMedication": true
}
```

Response:

```json
{
  "success": true,
  "data": {
    "attack": {
      "id": "atk_uuid",
      "status": "active",
      "startedAt": "2026-05-19T08:40:00Z",
      "severity": 8
    }
  }
}
```

### POST `/attacks`

Create detailed attack log.

Payload:

```json
{
  "startedAt": "2026-05-19T08:40:00Z",
  "endedAt": "2026-05-19T12:10:00Z",
  "severity": 8,
  "peakSeverity": 9,
  "locations": ["right_temple", "behind_eyes"],
  "painTypes": ["throbbing", "pulsing"],
  "symptoms": ["nausea", "light_sensitivity", "aura"],
  "auraTypes": ["zigzag_lines", "blurry_vision"],
  "medications": [
    {
      "userMedicationId": "med_uuid",
      "customName": null,
      "dose": "50mg",
      "takenAt": "2026-05-19T09:00:00Z",
      "effectiveness": "partial"
    }
  ],
  "triggers": ["sleep", "weather", "stress"],
  "notes": "Pain was strongest behind the eyes."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "attack": {
      "id": "atk_uuid",
      "status": "ended",
      "durationMinutes": 210,
      "severity": 8
    }
  }
}
```

### GET `/attacks`

History list.

Query:

```txt
?from=2026-05-01&to=2026-05-31&filter=severe&limit=20&cursor=abc
```

Filter values:

1. `all`
2. `severe`
3. `aura`
4. `medicated`
5. `this_month`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "atk_uuid",
      "dateLabel": "May 19, 2026",
      "startedAt": "2026-05-19T08:40:00Z",
      "endedAt": "2026-05-19T12:10:00Z",
      "durationMinutes": 210,
      "severity": 8,
      "locations": ["Right temple", "Behind eyes"],
      "symptoms": ["Nausea", "Light sensitivity"],
      "medicated": true
    }
  ],
  "pagination": {
    "limit": 20,
    "cursor": null,
    "hasMore": false
  }
}
```

### GET `/attacks/active`

Response:

```json
{
  "success": true,
  "data": {
    "attack": {
      "id": "atk_uuid",
      "startedAt": "2026-05-19T08:40:00Z",
      "severity": 8,
      "durationMinutes": 84
    }
  }
}
```

### GET `/attacks/:attackId`

Response:

```json
{
  "success": true,
  "data": {
    "attack": {
      "id": "atk_uuid",
      "status": "ended",
      "startedAt": "2026-05-19T08:40:00Z",
      "endedAt": "2026-05-19T12:10:00Z",
      "durationMinutes": 210,
      "severity": 8,
      "locations": ["right_temple", "behind_eyes"],
      "painTypes": ["throbbing"],
      "symptoms": ["nausea", "aura"],
      "auraTypes": ["zigzag_lines"],
      "medications": [
        {
          "id": "atkmed_uuid",
          "name": "Sumatriptan",
          "dose": "50mg",
          "takenAt": "2026-05-19T09:00:00Z",
          "effectiveness": "partial"
        }
      ],
      "triggers": ["sleep", "weather"],
      "aiInsight": "This attack followed short sleep and pressure change.",
      "notes": "Pain was strongest behind the eyes.",
      "voiceNote": {
        "id": "voice_uuid",
        "durationSeconds": 18
      }
    }
  }
}
```

### PATCH `/attacks/:attackId`

Update detailed attack log.

Payload:

```json
{
  "severity": 7,
  "locations": ["right_temple"],
  "symptoms": ["nausea", "light_sensitivity"],
  "notes": "Updated note."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "attack": {
      "id": "atk_uuid",
      "updatedAt": "2026-05-19T10:30:00Z"
    }
  }
}
```

### POST `/attacks/:attackId/end`

End active attack.

Payload:

```json
{
  "endedAt": "2026-05-19T12:10:00Z",
  "medications": [
    {
      "userMedicationId": "med_uuid",
      "customName": null,
      "dose": "50mg",
      "takenAt": "2026-05-19T09:00:00Z",
      "effectiveness": "full"
    }
  ],
  "recoveryStates": ["still_foggy", "relieved"],
  "recoveryNotes": "Rested after medication."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "attack": {
      "id": "atk_uuid",
      "status": "ended",
      "durationMinutes": 210
    }
  }
}
```

### DELETE `/attacks/:attackId`

Soft delete an attack.

Response:

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

## 10. Voice Logging

### POST `/voice/transcribe`

Upload audio for transcription and parsing. Use multipart form data.

Payload:

```txt
file: audio/webm
attackId: optional atk_uuid
keepAudio: false
```

Response:

```json
{
  "success": true,
  "data": {
    "voiceNoteId": "voice_uuid",
    "transcript": "Migraine started around 11:42 AM, severity 7, right temple, took Sumatriptan 100mg.",
    "parsed": {
      "severity": 7,
      "startedAt": "2026-05-19T11:42:00Z",
      "locations": ["right_temple"],
      "medications": [
        {
          "name": "Sumatriptan",
          "dose": "100mg"
        }
      ]
    }
  }
}
```

### POST `/voice/:voiceNoteId/confirm`

Create attack from parsed voice result.

Payload:

```json
{
  "parsed": {
    "severity": 7,
    "startedAt": "2026-05-19T11:42:00Z",
    "locations": ["right_temple"],
    "medications": [
      { "name": "Sumatriptan", "dose": "100mg" }
    ]
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "attack": {
      "id": "atk_uuid",
      "status": "active"
    }
  }
}
```

## 11. History Calendar

### GET `/history/calendar`

Query:

```txt
?month=2026-05
```

Response:

```json
{
  "success": true,
  "data": {
    "month": "2026-05",
    "days": [
      {
        "date": "2026-05-19",
        "attackCount": 1,
        "averageSeverity": 8,
        "severityLevel": "severe"
      }
    ]
  }
}
```

### GET `/history/calendar/:date`

Response:

```json
{
  "success": true,
  "data": {
    "date": "2026-05-19",
    "attacks": [
      {
        "id": "atk_uuid",
        "timeLabel": "8:40 AM -> 12:10 PM",
        "durationMinutes": 210,
        "severity": 8,
        "locations": ["Right temple"]
      }
    ]
  }
}
```

## 12. Insights

### GET `/insights`

Response:

```json
{
  "success": true,
  "data": {
    "status": "unlocked",
    "loggedAttackCount": 47,
    "daysUntilUnlock": 0,
    "topPattern": {
      "id": "ins_uuid",
      "title": "Attacks are 3x more likely after poor sleep",
      "confidence": "high",
      "summary": "In 8 of your last 10 attacks, you slept under 6.5 hours."
    },
    "triggerCorrelations": [
      {
        "trigger": "Poor sleep",
        "triggerId": "sleep",
        "correlationPercent": 87
      }
    ],
    "timeHeatmap": [],
    "medicationEffectiveness": [],
    "monthlyTrend": []
  }
}
```

### POST `/insights/generate`

Generate or refresh insights.

Payload:

```json
{
  "reason": "user_requested",
  "includeAiSummary": true
}
```

Response:

```json
{
  "success": true,
  "data": {
    "jobId": "job_uuid",
    "status": "processing"
  }
}
```

### GET `/insights/:insightId`

Response:

```json
{
  "success": true,
  "data": {
    "insight": {
      "id": "ins_uuid",
      "type": "trigger_correlation",
      "title": "Poor Sleep",
      "summary": "Present in 87% of your attacks.",
      "confidence": "high",
      "threshold": "< 6.5 hours sleep = high risk",
      "recommendations": [
        "Keep sleep schedule consistent.",
        "Use screen dimming before bed."
      ],
      "exampleAttacks": []
    }
  }
}
```

### GET `/insights/weekly`

Query:

```txt
?weekStart=2026-05-18
```

Response:

```json
{
  "success": true,
  "data": {
    "weekStart": "2026-05-18",
    "weekEnd": "2026-05-24",
    "attacksThisWeek": 2,
    "averageSeverity": 6.5,
    "bestDay": "Tuesday",
    "worstDay": "Friday",
    "topInsight": "Sleep was the strongest pattern this week.",
    "loggingDays": [
      { "date": "2026-05-18", "logged": true }
    ]
  }
}
```

## 13. Notifications

### GET `/notifications`

Query:

```txt
?limit=30&cursor=abc
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "not_uuid",
      "type": "risk_alert",
      "title": "High risk day detected",
      "body": "Your risk is elevated today.",
      "targetRoute": "/risk-detail",
      "readAt": null,
      "createdAt": "2026-05-19T07:30:00Z"
    }
  ],
  "pagination": {
    "limit": 30,
    "cursor": null,
    "hasMore": false
  }
}
```

### PATCH `/notifications/:notificationId/read`

Response:

```json
{
  "success": true,
  "data": {
    "read": true
  }
}
```

### POST `/notifications/mark-all-read`

Response:

```json
{
  "success": true,
  "data": {
    "markedReadCount": 4
  }
}
```

### PUT `/notifications/preferences`

Payload:

```json
{
  "riskAlert": {
    "enabled": true,
    "preferredTime": "07:30"
  },
  "dailyCheckin": {
    "enabled": true,
    "preferredTime": "08:00"
  },
  "medicationReminders": {
    "enabled": true
  },
  "weeklySummary": {
    "enabled": true
  },
  "milestones": {
    "enabled": true
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "preferencesUpdated": true
  }
}
```

## 14. Doctor Reports

### POST `/reports`

Generate report.

Payload:

```json
{
  "periodDays": 30,
  "includeRawData": false,
  "format": "pdf"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "report": {
      "id": "rep_uuid",
      "status": "generating",
      "periodStart": "2026-04-19",
      "periodEnd": "2026-05-19"
    }
  }
}
```

### GET `/reports/:reportId`

Response:

```json
{
  "success": true,
  "data": {
    "report": {
      "id": "rep_uuid",
      "status": "ready",
      "periodStart": "2026-04-19",
      "periodEnd": "2026-05-19",
      "midasScore": 18,
      "summary": {
        "totalAttacks": 4,
        "averageSeverity": 7.2,
        "topTriggers": ["Poor sleep", "Weather shift", "Stress"]
      }
    }
  }
}
```

### GET `/reports/:reportId/download`

Response:

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://private-signed-url",
    "expiresAt": "2026-05-19T10:45:00Z"
  }
}
```

### POST `/reports/:reportId/share-link`

Payload:

```json
{
  "expiresInHours": 72,
  "accessScope": "view_pdf"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "shareUrl": "https://app.mibrain.com/shared/reports/token",
    "expiresAt": "2026-05-22T10:30:00Z"
  }
}
```

### DELETE `/reports/:reportId/share-link`

Response:

```json
{
  "success": true,
  "data": {
    "revoked": true
  }
}
```

### GET `/exports/raw-data`

Query:

```txt
?format=csv&from=2026-04-19&to=2026-05-19
```

Response:

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://private-signed-url",
    "expiresAt": "2026-05-19T10:45:00Z"
  }
}
```

## 15. Files

### POST `/files/upload-url`

Create private upload URL.

Payload:

```json
{
  "objectType": "voice_audio",
  "contentType": "audio/webm",
  "sizeBytes": 320000,
  "relatedEntityType": "attack",
  "relatedEntityId": "atk_uuid"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "objectId": "obj_uuid",
    "uploadUrl": "https://private-upload-url",
    "expiresAt": "2026-05-19T10:45:00Z"
  }
}
```

### GET `/files/:objectId/download-url`

Response:

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://private-download-url",
    "expiresAt": "2026-05-19T10:45:00Z"
  }
}
```

### DELETE `/files/:objectId`

Response:

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

## 16. Subscription

### GET `/billing/plans`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "monthly",
      "name": "Monthly",
      "priceCents": 699,
      "currency": "USD",
      "billingPeriod": "month"
    },
    {
      "id": "annual",
      "name": "Annual",
      "priceCents": 4999,
      "currency": "USD",
      "billingPeriod": "year"
    }
  ]
}
```

### GET `/billing/subscription`

Response:

```json
{
  "success": true,
  "data": {
    "status": "active",
    "planId": "annual",
    "trialEndsAt": null,
    "currentPeriodEndsAt": "2026-03-01T00:00:00Z"
  }
}
```

### POST `/billing/checkout`

Payload:

```json
{
  "planId": "annual",
  "returnUrl": "https://app.mibrain.com/profile"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://payment-provider/checkout/session"
  }
}
```

### POST `/billing/cancel`

Payload:

```json
{
  "cancelAtPeriodEnd": true
}
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "active",
    "cancelAtPeriodEnd": true
  }
}
```

## 17. Privacy And Compliance

### GET `/privacy/consents`

Response:

```json
{
  "success": true,
  "data": [
    {
      "type": "privacy_policy",
      "status": "granted",
      "policyVersion": "2026-05",
      "grantedAt": "2026-05-19T10:30:00Z"
    }
  ]
}
```

### POST `/privacy/consents`

Payload:

```json
{
  "type": "health_data_processing",
  "status": "granted",
  "policyVersion": "2026-05"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "consentRecorded": true
  }
}
```

### POST `/privacy/export`

Request full data export.

Payload:

```json
{
  "format": "json"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "requestId": "prv_uuid",
    "status": "processing"
  }
}
```

### POST `/privacy/delete-request`

Request account/data deletion.

Payload:

```json
{
  "reason": "user_requested",
  "confirm": true
}
```

Response:

```json
{
  "success": true,
  "data": {
    "requestId": "prv_uuid",
    "status": "requested",
    "scheduledDeletionAt": "2026-06-18T00:00:00Z"
  }
}
```

### GET `/privacy/requests/:requestId`

Response:

```json
{
  "success": true,
  "data": {
    "id": "prv_uuid",
    "type": "export",
    "status": "completed",
    "downloadUrl": "https://private-signed-url",
    "expiresAt": "2026-05-22T10:30:00Z"
  }
}
```

## 18. Environmental Context

### GET `/environment/today`

Response:

```json
{
  "success": true,
  "data": {
    "observationAt": "2026-05-19T07:30:00Z",
    "barometricPressure": 1012.3,
    "pressureChange24h": 5.1,
    "temperature": 72,
    "humidity": 58,
    "airQualityIndex": 42
  }
}
```

### PUT `/environment/location-preference`

Payload:

```json
{
  "countryCode": "US",
  "regionCode": "NY",
  "city": "New York",
  "postalPrefix": "100",
  "precisionLevel": "postal_prefix"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "locationPreferenceUpdated": true
  }
}
```

## 19. Support And Feedback

### POST `/feedback`

Payload:

```json
{
  "category": "bug",
  "message": "The calendar did not open.",
  "includeDiagnostics": true
}
```

Response:

```json
{
  "success": true,
  "data": {
    "feedbackId": "fbk_uuid",
    "received": true
  }
}
```

### POST `/support/contact`

Payload:

```json
{
  "subject": "Need help exporting data",
  "message": "I cannot find my report export.",
  "allowSupportAccess": false
}
```

Response:

```json
{
  "success": true,
  "data": {
    "ticketId": "sup_uuid",
    "status": "open"
  }
}
```

## 20. Admin/Internal Endpoints

These are not used by the mobile/frontend app. They require internal admin authentication, role checks, purpose-of-access, and audit logging.

### GET `/admin/users/:userId/audit`

Response:

```json
{
  "success": true,
  "data": []
}
```

### POST `/admin/users/:userId/support-access`

Payload:

```json
{
  "purpose": "user_requested_support",
  "ticketId": "sup_uuid",
  "expiresInMinutes": 30
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessGranted": true,
    "expiresAt": "2026-05-19T11:00:00Z"
  }
}
```

## 21. Screen To Endpoint Map

1. Splash/App Start:
   - `GET /me`
2. Onboarding:
   - `GET /catalog/onboarding`
   - `PUT /onboarding`
   - `POST /onboarding/complete`
3. Sign In/Create Account:
   - `POST /auth/register`
   - `POST /auth/login`
4. Home:
   - `GET /home`
   - `GET /risk/today`
   - `GET /attacks/active`
5. Daily Check-in:
   - `GET /checkins/today`
   - `POST /checkins`
6. Panic Attack:
   - `POST /attacks/panic`
7. Full Attack Log:
   - `POST /attacks`
   - `PATCH /attacks/:attackId`
8. End Attack:
   - `POST /attacks/:attackId/end`
9. Voice Log:
   - `POST /voice/transcribe`
   - `POST /voice/:voiceNoteId/confirm`
10. Risk Detail:
   - `GET /risk/today`
11. Insights:
   - `GET /insights`
   - `GET /insights/:insightId`
   - `GET /insights/weekly`
12. History:
   - `GET /attacks`
   - `GET /attacks/:attackId`
13. Calendar:
   - `GET /history/calendar`
   - `GET /history/calendar/:date`
14. Notifications:
   - `GET /notifications`
   - `PATCH /notifications/:notificationId/read`
   - `POST /notifications/mark-all-read`
15. Doctor Report:
   - `POST /reports`
   - `GET /reports/:reportId`
   - `GET /reports/:reportId/download`
   - `POST /reports/:reportId/share-link`
16. Profile:
   - `GET /profile`
   - `PATCH /profile`
   - `GET /profile/health`
   - `PUT /profile/health`
17. Settings:
   - `GET /settings/preferences`
   - `PATCH /settings/preferences`
   - `PUT /notifications/preferences`
18. Privacy:
   - `GET /privacy/consents`
   - `POST /privacy/consents`
   - `POST /privacy/export`
   - `POST /privacy/delete-request`

