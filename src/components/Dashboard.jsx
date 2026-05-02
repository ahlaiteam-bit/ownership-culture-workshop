import { MODULES } from '../data/modules'
import BlueprintDownloader from './BlueprintDownloader'

const MODULE_ICONS = ['🔍', '🪞', '🧭', '🎯', '🧠', '🗺️']

function getBadge(status) {
  if (status === 'open') return { cls: 'badge--open', label: 'Open' }
  if (status === 'completed') return { cls: 'badge--completed', label: '✓ Done' }
  return { cls: 'badge--locked', label: '🔒 Locked' }
}

export default function Dashboard({ state, completedCount, onModuleClick, saveBlueprint, resetSession, syncStateFromCheat }) {
  const { userName, modules } = state
  const progressPct = Math.round((completedCount / 6) * 100)

  const handleCheatCode = () => {
    if (confirm('Auto-fill all 6 modules with dummy data to test the PDF generator?')) {
      const dummyInput = "This is auto-generated test data to bypass the workshop completion checks."
      const dummyModules = { ...modules }
      for (let i = 1; i <= 6; i++) {
        dummyModules[i] = {
          status: 'completed',
          answers: { 'q1': dummyInput, 'q2': dummyInput, 'q3': dummyInput },
          report: 'Auto-generated report for testing purposes.'
        }
      }
      syncStateFromCheat({ ...state, modules: dummyModules })
    }
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h1 className="dashboard__welcome">Welcome, {state.userProfile?.name || userName} 👋</h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={resetSession} 
                className="btn btn--danger-outline"
                style={{ 
                  borderRadius: '4px', 
                  padding: '5px 14px', 
                  cursor: 'pointer', 
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                Sign Out / Clear All Data
              </button>
            </div>
          </div>
          <p className="dashboard__subtitle">Ownership Culture Workshop</p>

          <div className="dashboard__progress-summary">
            <div className="dashboard__progress-track">
              <div
                className="dashboard__progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="dashboard__progress-label">
              {completedCount} of 6 modules completed
            </span>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="module-list">
        {MODULES.map((mod, idx) => {
          const modState = modules[mod.id]
          const status = modState?.status || 'locked'
          const badge = getBadge(status)

          return (
            <button
              key={mod.id}
              className={`module-card module-card--${status}`}
              onClick={() => (status !== 'locked' ? onModuleClick(mod.id) : null)}
              disabled={status === 'locked'}
            >
              <div className="module-card__content">
                <div className="module-card__top">
                  <span className="module-card__number">Module {mod.id}</span>
                  <span className={`badge ${badge.cls}`}>{badge.label}</span>
                </div>
                <div className="module-card__title">
                  {MODULE_ICONS[idx]} {mod.title}
                </div>
                <div className="module-card__desc">{mod.description}</div>
              </div>
              {status !== 'locked' && (
                <span className="module-card__arrow">›</span>
              )}
            </button>
          )
        })}
      </div>
      
      {completedCount === 6 && (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 var(--space-4) var(--space-6)' }}>
          <BlueprintDownloader state={state} saveBlueprint={saveBlueprint} />
        </div>
      )}
    </div>
  )
}
