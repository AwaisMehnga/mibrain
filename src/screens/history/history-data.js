import face from '../../assets/face.webp'

export const attacks = [
  {
    id: 'a1',
    dateLabel: 'May 3rd, 2025',
    day: 'SAT',
    date: '03',
    timeLabel: '11:42 AM -> 4:04 PM',
    summaryTime: 'Saturday, 11:42 AM → 4:04 PM',
    started: '11:42 AM',
    ended: '4:04 PM',
    duration: '4h 22min',
    severity: 8,
    selectedLocations: ['Right temple', 'Behind eyes'],
    symptoms: ['Nausea', 'Light sensitivity', 'Aura'],
    medications: [
      { name: 'Sumatriptan', dose: '100mg', effectiveness: 'Full relief' },
    ],
    triggers: ['Poor sleep', 'Weather shift', 'Stress'],
    aiInsight:
      'This attack followed 5.1h sleep and a weather pressure drop — your most common pattern.',
    notes: 'Kept lights low and rested after medication kicked in. Felt more pressure behind the eyes than usual.',
    voiceNote: { label: 'Voice note 0:18', time: '0:18' },
    diagram: face,
  },
  {
    id: 'a2',
    dateLabel: 'April 28th, 2025',
    day: 'MON',
    date: '28',
    timeLabel: '8:15 PM -> 10:01 PM',
    summaryTime: 'Monday, 8:15 PM → 10:01 PM',
    started: '8:15 PM',
    ended: '10:01 PM',
    duration: '1h 46min',
    severity: 6,
    selectedLocations: ['Left temple'],
    symptoms: ['Nausea', 'Brain fog'],
    medications: [
      { name: 'Ibuprofen', dose: '400mg', effectiveness: 'Partial relief' },
    ],
    triggers: ['Screen time', 'Skipped meal'],
    aiInsight: 'No strong weather signal, but the screen exposure trend is consistent.',
    notes: 'Moved to a dark room and drank water. Headache faded by bedtime.',
    voiceNote: null,
    diagram: face,
  },
  {
    id: 'a3',
    dateLabel: 'April 18th, 2025',
    day: 'FRI',
    date: '18',
    timeLabel: '6:30 AM -> 7:42 AM',
    summaryTime: 'Friday, 6:30 AM → 7:42 AM',
    started: '6:30 AM',
    ended: '7:42 AM',
    duration: '1h 12min',
    severity: 5,
    selectedLocations: ['Forehead'],
    symptoms: ['Fatigue', 'Neck stiffness'],
    medications: [
      { name: 'Naproxen', dose: '500mg', effectiveness: 'Didn\'t work' },
    ],
    triggers: ['Poor sleep', 'Dehydration'],
    aiInsight: null,
    notes: 'Woke up already tense and took a nap after breakfast.',
    voiceNote: null,
    diagram: face,
  },
]

export function getAttackById(attackId) {
  return attacks.find((attack) => attack.id === attackId)
}
