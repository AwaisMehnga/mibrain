# mibrain Database Plan

Database and data model plan for a migraine tracking app serving users in the USA first, with future expansion to other countries. This is a product/architecture document only, not implementation code.

## 1. Recommended Database

Use **PostgreSQL** as the primary database.

Best production options:

1. **AWS Aurora PostgreSQL or Amazon RDS for PostgreSQL**
   - Best for maximum compliance control, enterprise readiness, backups, network isolation, audit tooling, and future international data-residency architecture.
   - Use only under an executed AWS BAA if storing PHI/ePHI for a HIPAA-regulated workload.

2. **Supabase Postgres with HIPAA support and signed BAA**
   - Best for faster MVP/product development because it gives Postgres, auth, storage, row-level security, realtime, and dashboard tools.
   - Only use for PHI/ePHI after signing a BAA and enabling/configuring the HIPAA project controls.

Recommendation:

Start with **PostgreSQL as the canonical data model**. For MVP speed, Supabase HIPAA can work if budget and BAA requirements are acceptable. For stricter long-term healthcare compliance, run PostgreSQL on AWS Aurora/RDS with a signed BAA, private networking, encrypted backups, audit logging, and separate object storage for files.

Why PostgreSQL fits mibrain:

1. The app has strongly related data: users, attacks, symptoms, triggers, meds, reports, consents, audit logs.
2. It supports relational integrity for medical-history style records.
3. It supports JSON fields for flexible clinical/context data without making the whole database schemaless.
4. It supports row-level security patterns.
5. It can support future analytics and AI features through materialized views, read replicas, and vector extensions.
6. It is widely available across HIPAA-capable managed platforms.

Avoid making the primary store NoSQL at this stage. Migraine logs look like flexible documents, but the product needs privacy controls, reporting, auditability, medication effectiveness analysis, and clean relationships. Postgres gives the best balance.

## 2. Compliance Posture

mibrain should be designed as if health data is sensitive regulated data, even if the company later determines some users or markets are outside HIPAA scope.

Baseline requirements:

1. Sign BAAs with every vendor that stores, processes, transmits, logs, backs up, monitors, or supports access to PHI/ePHI.
2. Encrypt data in transit and at rest.
3. Use field-level encryption for highly sensitive fields where practical.
4. Separate identity/contact data from health-event data.
5. Use least-privilege service roles.
6. Keep immutable audit logs for access to sensitive records.
7. Support data export, correction, deletion, consent withdrawal, and regional privacy rights.
8. Do not store raw voice audio unless necessary.
9. Do not send PHI to analytics, crash reporting, marketing pixels, or AI vendors without signed agreements and explicit purpose controls.
10. Prefer coarse location or weather-region data over precise GPS.

Important privacy design decision:

Use internal UUIDs everywhere. Do not use email, phone, name, or external auth ids as foreign keys in health tables.

## 3. Data Domains

1. Identity and account
2. User profile and privacy preferences
3. Health profile baseline
4. Migraine/attack logging
5. Daily check-ins and risk signals
6. Medication tracking
7. Insights and derived analytics
8. Notifications
9. Reports and sharing
10. Consent, privacy, audit, and compliance
11. Billing/subscription
12. Localization and regional expansion

## 4. Core Entity Relationships

High-level relationship map:

1. One user has one profile.
2. One user has many consent records.
3. One user has many conditions, triggers, medications, attacks, check-ins, risk scores, insights, notifications, and reports.
4. One attack has many locations, pain types, symptoms, aura types, triggers, medications, notes, and attachments.
5. One medication can appear in the user medication list and in many attack medication events.
6. Daily check-ins and attacks feed risk scores.
7. Attacks, check-ins, medications, and risk scores feed insights.
8. Reports are generated from filtered attack/check-in/insight data.
9. Every sensitive access creates an audit event.

## 5. Identity And Account Tables

### users

Primary account owner.

Fields:

1. `id`
2. `auth_provider`
3. `auth_provider_user_id`
4. `email_encrypted`
5. `phone_encrypted`
6. `email_verified_at`
7. `phone_verified_at`
8. `status`: active, disabled, deleted, pending_deletion
9. `created_at`
10. `updated_at`
11. `deleted_at`

Relationships:

1. Has one `user_profiles`.
2. Has many app records across all user-owned tables.

### user_profiles

Non-auth personal profile.

Fields:

1. `id`
2. `user_id`
3. `display_name_encrypted`
4. `date_of_birth_encrypted`
5. `sex_at_birth`
6. `gender_identity`
7. `country_code`
8. `region_code`
9. `timezone`
10. `locale`
11. `measurement_system`: imperial, metric
12. `created_at`
13. `updated_at`

Notes:

1. Store only what the app truly needs.
2. Keep country/region for localization, consent, data residency, and clinical/report formatting.

### user_devices

Registered mobile/browser devices.

Fields:

1. `id`
2. `user_id`
3. `device_type`
4. `platform`
5. `push_token_encrypted`
6. `app_version`
7. `last_seen_at`
8. `notification_permission_status`
9. `created_at`
10. `revoked_at`

## 6. Privacy And Consent Tables

### consent_records

Tracks explicit user consent and policy acceptance.

Fields:

1. `id`
2. `user_id`
3. `consent_type`: terms, privacy_policy, health_data_processing, notifications, research, analytics, ai_processing, marketing
4. `status`: granted, declined, withdrawn
5. `policy_version`
6. `country_code`
7. `region_code`
8. `granted_at`
9. `withdrawn_at`
10. `source`: onboarding, settings, support, migration
11. `ip_hash`
12. `user_agent_hash`

### privacy_requests

Data rights workflow.

Fields:

1. `id`
2. `user_id`
3. `request_type`: export, delete, correct, restrict_processing, withdraw_consent
4. `status`: requested, verifying, processing, completed, rejected
5. `requested_at`
6. `completed_at`
7. `verification_method`
8. `notes_internal`

### audit_events

Immutable compliance audit log.

Fields:

1. `id`
2. `actor_user_id`
3. `actor_type`: user, admin, clinician, system, support
4. `target_user_id`
5. `event_type`
6. `entity_type`
7. `entity_id`
8. `purpose`
9. `ip_hash`
10. `user_agent_hash`
11. `created_at`
12. `metadata`

Rules:

1. Append-only.
2. No PHI in metadata unless absolutely required.
3. Admin/support access to health records must always create an audit event.

## 7. Health Profile Tables

### condition_catalog

Master list of migraine-related conditions.

Fields:

1. `id`
2. `code`
3. `name`
4. `description`
5. `is_active`

Examples:

1. chronic migraine
2. episodic migraine
3. migraine with aura
4. menstrual migraine
5. weather-sensitive migraine

### user_conditions

User-selected conditions.

Fields:

1. `id`
2. `user_id`
3. `condition_id`
4. `source`: onboarding, profile_edit, imported
5. `created_at`
6. `ended_at`

### trigger_catalog

Master trigger list.

Fields:

1. `id`
2. `code`
3. `name`
4. `category`: sleep, food, environment, hormonal, stress, sensory, lifestyle, custom
5. `description`
6. `is_active`

### user_triggers

User-known triggers.

Fields:

1. `id`
2. `user_id`
3. `trigger_id`
4. `custom_name_encrypted`
5. `confidence`: suspected, likely, confirmed
6. `created_at`
7. `archived_at`

### medication_catalog

Medication reference list.

Fields:

1. `id`
2. `generic_name`
3. `brand_name`
4. `medication_class`: triptan, gepant, nsaid, preventive, supplement, other
5. `route`: oral, injection, nasal, other
6. `country_code`
7. `is_active`

### user_medications

User medication list.

Fields:

1. `id`
2. `user_id`
3. `medication_id`
4. `custom_name_encrypted`
5. `type`: acute, preventive, rescue, supplement
6. `default_dose_encrypted`
7. `frequency_encrypted`
8. `start_date`
9. `end_date`
10. `prescriber_encrypted`
11. `is_active`
12. `created_at`
13. `updated_at`

## 8. Daily Check-In And Risk Tables

### daily_checkins

Morning baseline log.

Fields:

1. `id`
2. `user_id`
3. `checkin_date`
4. `sleep_hours`
5. `sleep_quality`
6. `hydration_status`
7. `meal_status`
8. `stress_level`
9. `energy_level`
10. `cycle_day`
11. `notes_encrypted`
12. `completed_at`
13. `created_at`
14. `updated_at`

Rules:

1. One primary check-in per user per local date.
2. Allow edits while preserving audit trail.

### risk_scores

Generated risk estimate.

Fields:

1. `id`
2. `user_id`
3. `score_date`
4. `score`
5. `level`: low, moderate, high, very_high
6. `model_version`
7. `generated_at`
8. `explanation_summary`
9. `data_sufficiency`: insufficient, building, sufficient

### risk_factors

Breakdown behind a risk score.

Fields:

1. `id`
2. `risk_score_id`
3. `factor_type`: sleep, hydration, meals, stress, weather, cycle, medication, history
4. `label`
5. `impact`
6. `direction`: increases_risk, decreases_risk
7. `explanation`

## 9. Attack Logging Tables

### attacks

Main migraine/attack episode.

Fields:

1. `id`
2. `user_id`
3. `status`: active, ended, draft, deleted
4. `started_at`
5. `ended_at`
6. `duration_minutes`
7. `severity`
8. `peak_severity`
9. `started_timezone`
10. `logged_method`: panic, full_form, voice, imported
11. `notes_encrypted`
12. `created_at`
13. `updated_at`
14. `deleted_at`

Rules:

1. Panic mode creates an `active` attack with minimal fields.
2. End Attack changes status to `ended`.
3. Detailed log can enrich an active or ended attack.

### attack_locations

Pain location selections.

Fields:

1. `id`
2. `attack_id`
3. `location_code`: left_temple, right_temple, forehead, behind_eyes, back_head, top_head, left_jaw, right_jaw
4. `created_at`

### pain_type_catalog

Master pain type list.

Fields:

1. `id`
2. `code`
3. `name`

### attack_pain_types

Pain types selected for an attack.

Fields:

1. `id`
2. `attack_id`
3. `pain_type_id`

### symptom_catalog

Master symptom list.

Fields:

1. `id`
2. `code`
3. `name`
4. `category`

### attack_symptoms

Symptoms selected for an attack.

Fields:

1. `id`
2. `attack_id`
3. `symptom_id`
4. `severity`

### aura_type_catalog

Master aura list.

Fields:

1. `id`
2. `code`
3. `name`

### attack_aura_types

Aura details for attacks with aura.

Fields:

1. `id`
2. `attack_id`
3. `aura_type_id`

### attack_triggers

Possible triggers attached to an attack.

Fields:

1. `id`
2. `attack_id`
3. `trigger_id`
4. `custom_trigger_text_encrypted`
5. `confidence`: user_suspected, model_suggested, confirmed

### attack_medications

Medication taken during an attack.

Fields:

1. `id`
2. `attack_id`
3. `user_medication_id`
4. `custom_medication_name_encrypted`
5. `dose_encrypted`
6. `taken_at`
7. `effectiveness`: none, partial, full, unknown
8. `side_effects_encrypted`
9. `created_at`

### attack_recovery_states

Postdrome/recovery state after ending attack.

Fields:

1. `id`
2. `attack_id`
3. `state_code`: recovering_well, foggy, exhausted, anxious, relieved, neck_stiff
4. `created_at`

### voice_notes

Optional voice-derived record.

Fields:

1. `id`
2. `user_id`
3. `attack_id`
4. `storage_object_id`
5. `transcript_encrypted`
6. `parsed_fields`
7. `processing_status`
8. `created_at`
9. `deleted_at`

Rule:

Prefer storing transcript and parsed fields only. Store raw audio only when the user explicitly chooses to keep it.

## 10. Environmental Context Tables

### user_location_preferences

Coarse location used for weather/risk calculations.

Fields:

1. `id`
2. `user_id`
3. `country_code`
4. `region_code`
5. `city_encrypted`
6. `postal_prefix_encrypted`
7. `latitude_rounded`
8. `longitude_rounded`
9. `precision_level`: country, region, city, postal_prefix, rounded_coordinates
10. `created_at`
11. `updated_at`

### environmental_observations

Weather or external signal snapshots.

Fields:

1. `id`
2. `user_id`
3. `observation_at`
4. `source`
5. `barometric_pressure`
6. `pressure_change_24h`
7. `temperature`
8. `humidity`
9. `air_quality_index`
10. `light_exposure_estimate`
11. `metadata`

Rules:

1. Store only the data needed for risk calculation.
2. Avoid exact location unless required and explicitly consented.

## 11. Insights Tables

### insights

Generated pattern or recommendation.

Fields:

1. `id`
2. `user_id`
3. `insight_type`: trigger_correlation, medication_effectiveness, time_pattern, weekly_summary, risk_explanation
4. `title`
5. `summary`
6. `confidence`: low, medium, high
7. `model_version`
8. `status`: active, archived, dismissed
9. `generated_at`
10. `expires_at`

### insight_evidence

Data points behind an insight.

Fields:

1. `id`
2. `insight_id`
3. `entity_type`: attack, checkin, medication, environmental_observation
4. `entity_id`
5. `evidence_label`
6. `weight`

### weekly_summaries

Weekly digest.

Fields:

1. `id`
2. `user_id`
3. `week_start_date`
4. `week_end_date`
5. `attack_count`
6. `average_severity`
7. `best_day`
8. `worst_day`
9. `summary_text`
10. `created_at`

## 12. Notification Tables

### notifications

In-app notification center.

Fields:

1. `id`
2. `user_id`
3. `type`: risk_alert, checkin, medication, milestone, weekly_summary, report
4. `title`
5. `body`
6. `target_route`
7. `read_at`
8. `sent_at`
9. `created_at`

### notification_preferences

Per-user notification settings.

Fields:

1. `id`
2. `user_id`
3. `notification_type`
4. `enabled`
5. `preferred_time`
6. `quiet_hours_start`
7. `quiet_hours_end`
8. `timezone`
9. `updated_at`

## 13. Reports And Sharing Tables

### doctor_reports

Generated report metadata.

Fields:

1. `id`
2. `user_id`
3. `period_start`
4. `period_end`
5. `status`: generating, ready, failed, expired
6. `storage_object_id`
7. `midas_score`
8. `created_at`
9. `expires_at`

### shared_report_links

Temporary share links.

Fields:

1. `id`
2. `doctor_report_id`
3. `user_id`
4. `token_hash`
5. `access_scope`: view_pdf, download_pdf, summary_only
6. `expires_at`
7. `revoked_at`
8. `created_at`
9. `last_accessed_at`

Rules:

1. Store link token as a hash, never plaintext.
2. Report links should expire by default.
3. Access should create audit events.

## 14. Subscription Tables

### plans

Available subscription products.

Fields:

1. `id`
2. `name`
3. `billing_period`
4. `price_cents`
5. `currency`
6. `features`
7. `is_active`

### subscriptions

User subscription state.

Fields:

1. `id`
2. `user_id`
3. `plan_id`
4. `provider`
5. `provider_subscription_id`
6. `status`: trialing, active, past_due, canceled, expired
7. `trial_ends_at`
8. `current_period_ends_at`
9. `created_at`
10. `updated_at`

Rule:

Payment processor records should not mix with health tables.

## 15. Regional Expansion Tables

### countries

Supported countries.

Fields:

1. `code`
2. `name`
3. `default_locale`
4. `default_timezone`
5. `privacy_regime`: hipaa, gdpr, uk_gdpr, pipeda, other
6. `is_supported`

### regional_compliance_rules

Configuration for regional privacy behavior.

Fields:

1. `id`
2. `country_code`
3. `region_code`
4. `requires_explicit_health_consent`
5. `requires_data_residency`
6. `default_retention_days`
7. `minor_age_threshold`
8. `privacy_policy_version`
9. `terms_version`

## 16. Object Storage

Use encrypted object storage for files, not database blobs.

Objects:

1. Voice audio, if retained.
2. Generated doctor report PDFs.
3. Export files.
4. Optional profile images.

Each object needs metadata:

1. `id`
2. `user_id`
3. `object_type`
4. `storage_path`
5. `encryption_key_ref`
6. `content_type`
7. `size_bytes`
8. `created_at`
9. `expires_at`
10. `deleted_at`

Rules:

1. Private bucket only.
2. Short-lived signed URLs.
3. No public health files.
4. Audit file access.

## 17. Security And Privacy Rules

1. Every user-owned table must have `user_id`.
2. App reads must be scoped by authenticated `user_id`.
3. Admin/support access requires purpose, role, and audit logging.
4. Soft delete first, then hard delete according to retention policy.
5. Use separate analytics views with de-identified data.
6. Do not use production PHI in staging or development.
7. Backups must be encrypted and covered by the same compliance boundary.
8. Logs must not include names, emails, notes, transcripts, meds, or attack details.
9. Reports and exports should expire.
10. Deletion requests must delete or anonymize health records, files, exports, and derived insights.

## 18. Suggested Implementation Order

1. Build identity, profile, consent, and audit foundations.
2. Build health profile: conditions, triggers, medications.
3. Build daily check-ins and risk scores.
4. Build attacks and related detail tables.
5. Build medication effectiveness.
6. Build History and Calendar queries.
7. Build Insights as derived data.
8. Build Doctor Reports and object storage.
9. Build notifications and preferences.
10. Build privacy request workflows.
11. Add regional compliance and data-residency rules before international launch.

## 19. Open Decisions

1. Will mibrain be a direct-to-consumer wellness app, a medical device, a provider-connected app, or all three?
2. Will users share data directly with clinicians?
3. Will raw voice recordings be stored, or only transcripts?
4. Will AI processing happen in-house, with a vendor, or both?
5. Will international users require country-specific data residency?
6. What is the retention policy for deleted accounts and generated reports?
7. Which vendors will sign BAAs and equivalent data-processing agreements?

