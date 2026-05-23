- Today’s Migraine Risk Score
- Risk Factors
- 30-Day Risk Sparkline
- Trigger Correlations
- Top Pattern
- Time Heatmap
- Medication Effectiveness
- Monthly Trend
- Weekly Summary
- Risk Alert Notifications

**ML Model**
- Today’s Migraine Risk Score
- Risk Factors
- 30-Day Risk Sparkline
- Trigger Correlations
- Top Pattern
- Time Heatmap
- Medication Effectiveness
- Monthly Trend
- Weekly Summary
- Risk Alert Notifications

**LLM**
- Top Pattern
- Weekly Summary

Yes. For mibrain, you should build the ML system in **two phases**:

1. **Pre-train / prototype from existing migraine-like datasets**
2. **Personalize the model using each user’s own logs**

The important thing: migraine prediction should be framed as **risk forecasting**, not exact certainty.

**Best Datasets To Start With**
1. **HeAD-US dataset**
   - Best fit conceptually.
   - Based on Migraine Buddy-style digital headache app data.
   - Includes demographics, migraine severity, symptoms, pain frequency, disability, stress/anxiety/depression, sleep patterns, and medication effectiveness.
   - Access may require contacting the UCI team.
   - This should be your top priority if you can get access.
   - Source: UCI HeAD-US page says the dataset includes migraine severity, symptoms, sleep patterns, and medication effectiveness, and is intended for ML prediction of severity/frequency. https://faculty.sites.uci.edu/neuroinformatics/head-us/

2. **Kaggle: Migraine dataset from wearable devices**
   - Good MVP/prototype dataset.
   - Has daily records with user ID, date, sleep duration, mood, stress, hydration, screen time, migraine occurrence, and severity.
   - Very similar to your daily check-in + attack prediction structure.
   - Use it to build the first risk model.
   - Source: https://www.kaggle.com/datasets/hebaqueen/migraine-dataset-from-wearable-devices

3. **UCL migraine forecasting study**
   - Useful as a model design reference.
   - They used diary entries and simple wearable measurements to forecast next-day headache.
   - Their best random forest model reached AUC 0.62, which is realistic and tells you not to expect magical accuracy early.
   - Source: https://discovery.ucl.ac.uk/id/eprint/10168944/

4. **Kaggle: Migraine Symptom Dataset for Classification**
   - Useful for symptom/type classification.
   - Less useful for “next attack prediction” because it is more about classifying migraine type from symptoms.
   - Source: https://www.kaggle.com/datasets/gzdekzlkaya/migraine-symptom-dataset-for-classification/versions/1

5. **Weather/environment data**
   - Use this to enrich your own logs and external datasets where possible.
   - Open-Meteo is good for historical weather: temperature, humidity, dew point, apparent temperature, pressure, etc.
   - Source: https://open-meteo.com/en/docs/historical-weather-api
   - NOAA is another strong option, but needs an API token.
   - Source: https://www.ncdc.noaa.gov/cdo-web/webservices/v2

**What Model To Build First**
Start with a simple **daily risk model**.

Prediction target:

```txt
Will the user have a migraine attack in the next 24 hours?
```

Input features:

```txt
sleepHours
sleepQuality
stressLevel
hydrationStatus
mealStatus
energyLevel
cycleDay
recentAttackCount7Days
daysSinceLastAttack
averageSeverity30Days
knownTriggers
pressureChange24h
humidity
temperature
dayOfWeek
timeOfMonth
```

Output:

```txt
riskScore: 0-100
riskLevel: low | moderate | high
riskFactors: top contributing factors
```

**Best First Algorithms**
Use these before deep learning:

1. **Logistic Regression**
   - Baseline model.
   - Easy to explain.

2. **Random Forest**
   - Good for tabular health/app data.
   - Used successfully in the UCL migraine forecasting study.

3. **XGBoost or LightGBM**
   - Best practical choice for production tabular prediction.
   - Handles mixed feature importance well.

I would use:

```txt
LightGBM or XGBoost for production
Random Forest as comparison
Logistic Regression as baseline
```

**Training Process**
1. Convert all data into daily rows.

Example:

```txt
user_id | date | sleep | stress | hydration | meals | cycle_day | weather | attacks_last_7d | migraine_next_24h
```

2. Create the label.

```txt
migraine_next_24h = 1 if attack happens within next 24 hours
migraine_next_24h = 0 otherwise
```

3. Train on historical daily rows.

4. Split by time, not random.

Correct:

```txt
Train: Jan-Apr
Validate: May
Test: June
```

Wrong:

```txt
Random shuffle all days
```

5. Evaluate with:

```txt
AUC
precision
recall
calibration
false alarm rate
```

For your app, **recall matters a lot**, because missing a high-risk day is worse than showing a cautious warning.

**How To Personalize**
Do not rely only on a global model.

Use this structure:

1. Global model trained from external + all-user anonymized data
2. User-specific calibration after enough logs
3. Personalized thresholds

Example:

```txt
Global model says: 62 risk
User usually attacks at this pattern: +12
Final risk: 74 High
```

Personalization should start after:

```txt
14+ check-ins
5+ attacks
```

Better personalization after:

```txt
30-60 check-ins
10+ attacks
```

**Production Architecture**
In your backend:

```txt
/checkins -> save daily inputs
/environment -> save weather inputs
/risk/recalculate -> run model
/risk/today -> return stored risk score
/insights/generate -> calculate patterns
```

Model service:

```txt
Laravel API
  -> sends features to Python ML service
  -> Python returns risk score + factor importance
  -> Laravel stores result in risk_scores and risk_factors
```

**Important**
For MVP, do not wait for a perfect ML model.

Build this order:

1. Rule-based risk score first
2. Collect real app data
3. Train ML model using Kaggle wearable dataset
4. Add weather enrichment
5. Replace rule score with ML score
6. Personalize per user after enough logs
7. Use LLM only to explain the model output in friendly language

So the ML predicts:

```txt
risk score
risk factors
trigger correlations
medication effectiveness
attack timing patterns
```

The LLM explains:

```txt
why risk is high
what pattern means
weekly summary text
doctor-report summary
```