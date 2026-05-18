import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

const conditionOptions = ['Migraine', 'Tension Headache', 'Cluster Headache', 'Other']
const triggerOptions = ['Sleep deprivation', 'Stress', 'Hormonal', 'Food', 'Weather', 'Light', 'Caffeine', 'Alcohol', 'Skipped meals']

export default function HealthProfile({ onBack }) {
  const { conditions = [], triggers = [], medications } = useAuthStore((state) => state.healthProfile)
  const [customTrigger, setCustomTrigger] = useState('')
  const [showAddMed, setShowAddMed] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', dose: '', type: 'acute' })

  return (
    <div className="px-5 py-5 pb-8 space-y-5 anim-fade-in-up">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="text-accent flex items-center gap-2">
          <ChevronLeft size={18} />
          <span className="text-[15px] font-semibold">My Health Profile</span>
        </button>
      </header>

      {/* My Conditions */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-fg">My Conditions</h3>
          <button className="text-[12px] font-medium text-accent">Edit</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {conditions.length > 0 ? (
            conditions.map((c) => (
              <span key={c} className="rounded-full bg-secondary px-3 py-1.5 text-[13px] text-fg">
                {c}
              </span>
            ))
          ) : (
            <p className="text-[13px] text-fg-secondary">No conditions added yet</p>
          )}
        </div>
      </section>

      {/* My Known Triggers */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-fg">My Known Triggers</h3>
          <button className="text-[12px] font-medium text-accent">Edit</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {triggers.length > 0 ? (
            triggers.map((t) => (
              <span key={t} className="rounded-full bg-secondary px-3 py-1.5 text-[13px] text-fg">
                {t}
              </span>
            ))
          ) : (
            <p className="text-[13px] text-fg-secondary">No triggers added yet</p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 text-accent">
          <Plus size={16} />
          <button className="text-[13px] font-medium">Add custom trigger</button>
        </div>
        {showAddMed && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="e.g., specific food"
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              className="flex-1 rounded-md bg-secondary px-3 py-2 text-[13px] text-fg outline-none"
            />
            <button className="rounded-md bg-accent px-3 py-2 text-[13px] font-medium text-fg-inverse">Add</button>
          </div>
        )}
      </section>

      {/* My Medications */}
      <section className="space-y-3">
        <h3 className="text-[14px] font-semibold text-fg">My Medications</h3>

        {/* Acute Medications */}
        {medications?.acute && medications.acute.length > 0 && (
          <div className="space-y-2">
            <p className="text-[12px] text-fg-secondary">Acute (as-needed)</p>
            {medications.acute.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-md bg-secondary px-4 py-3">
                <div>
                  <p className="text-[13px] font-medium text-fg">{med.name}</p>
                  <p className="text-[12px] text-fg-secondary">{med.dose || 'No dose specified'}</p>
                </div>
                <button className="text-fg-muted">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Preventive Medications */}
        {medications?.preventive && medications.preventive.length > 0 && (
          <div className="space-y-2">
            <p className="text-[12px] text-fg-secondary">Preventive (daily)</p>
            {medications.preventive.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-md bg-secondary px-4 py-3">
                <div>
                  <p className="text-[13px] font-medium text-fg">{med.name}</p>
                  <p className="text-[12px] text-fg-secondary">{med.dose || 'No dose specified'}</p>
                </div>
                <button className="text-fg-muted">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-accent">
          <Plus size={16} />
          <button onClick={() => setShowAddMed(!showAddMed)} className="text-[13px] font-medium">
            Add medication
          </button>
        </div>

        {showAddMed && (
          <div className="mt-3 space-y-3 rounded-md bg-secondary p-4">
            <input
              type="text"
              placeholder="Medication name"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="w-full rounded-md bg-primary px-3 py-2 text-[13px] text-fg outline-none"
            />
            <input
              type="text"
              placeholder="Dose (e.g., 100mg)"
              value={newMed.dose}
              onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
              className="w-full rounded-md bg-primary px-3 py-2 text-[13px] text-fg outline-none"
            />
            <select
              value={newMed.type}
              onChange={(e) => setNewMed({ ...newMed, type: e.target.value })}
              className="w-full rounded-md bg-primary px-3 py-2 text-[13px] text-fg outline-none"
            >
              <option value="acute">Acute (as-needed)</option>
              <option value="preventive">Preventive (daily)</option>
            </select>
            <div className="flex gap-2">
              <button className="flex-1 rounded-md bg-accent px-3 py-2 text-[13px] font-medium text-fg-inverse">Save</button>
              <button onClick={() => setShowAddMed(false)} className="flex-1 rounded-md bg-tertiary px-3 py-2 text-[13px] font-medium">
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
