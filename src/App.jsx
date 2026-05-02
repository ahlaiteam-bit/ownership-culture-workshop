import { useState } from 'react'
import { MODULES } from './data/modules'
import { useWorkshopState } from './hooks/useWorkshopState'
import Dashboard from './components/Dashboard'
import ModuleIntro from './components/ModuleIntro'
import QuestionPage from './components/QuestionPage'
import ReportPage from './components/ReportPage'

export default function App() {
  const { 
    state, 
    loading, 
    initUser, 
    setAnswer, 
    completeModule, 
    saveBlueprint, 
    resetSession, // New
    completedCount, 
    syncState 
  } = useWorkshopState()
  
  // Views: 'dashboard' | 'intro' | 'questions' | 'report'
  const [view, setView] = useState('dashboard')
  const [activeModuleId, setActiveModuleId] = useState(null)
  
  const [profileForm, setProfileForm] = useState({
    name: '', email: '', mobile: '', company: '', role: '', department: ''
  })

  // Handle name submission on first load
  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (profileForm.name.trim()) {
      initUser({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        mobile: profileForm.mobile.trim(),
        company: profileForm.company.trim(),
        role: profileForm.role.trim(),
        department: profileForm.department.trim()
      })
    }
  }

  // Handle navigation
  const goDashboard = () => {
    setActiveModuleId(null)
    setView('dashboard')
    window.scrollTo(0, 0)
  }

  const handleModuleClick = (moduleId) => {
    setActiveModuleId(moduleId)
    
    // If it's already completed, go straight to the report
    if (state.modules[moduleId].status === 'completed') {
      setView('report')
    } else {
      setView('intro')
    }
    window.scrollTo(0, 0)
  }

  const activeModule = MODULES.find((m) => m.id === activeModuleId)

  if (loading) {
    return (
      <div className="app-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const handleProfileChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="app-wrapper">
      {/* Name Entry Modal (if no user exists yet) */}
      {!state && !loading && (
        <div className="overlay">
          <form className="name-modal" onSubmit={handleNameSubmit} style={{ maxWidth: '500px' }}>
            <h2 className="report-title text-center" style={{ marginBottom: '1rem' }}>Welcome!</h2>
            <p className="report-section__body text-center" style={{ marginBottom: '2rem' }}>
              Please enter your details to begin the Ownership Culture Workshop.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <input type="text" className="open-text-area" style={{ minHeight: 'auto', padding: '10px 16px' }} placeholder="Full Name *" value={profileForm.name} onChange={(e) => handleProfileChange('name', e.target.value)} required />
              <input type="email" className="open-text-area" style={{ minHeight: 'auto', padding: '10px 16px' }} placeholder="Email Address *" value={profileForm.email} onChange={(e) => handleProfileChange('email', e.target.value)} required />
              <input type="tel" className="open-text-area" style={{ minHeight: 'auto', padding: '10px 16px' }} placeholder="Mobile Number" value={profileForm.mobile} onChange={(e) => handleProfileChange('mobile', e.target.value)} />
              <input type="text" className="open-text-area" style={{ minHeight: 'auto', padding: '10px 16px' }} placeholder="Company *" value={profileForm.company} onChange={(e) => handleProfileChange('company', e.target.value)} required />
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input type="text" className="open-text-area" style={{ minHeight: 'auto', padding: '10px 16px', flex: '1 1 150px' }} placeholder="Role" value={profileForm.role} onChange={(e) => handleProfileChange('role', e.target.value)} />
                <input type="text" className="open-text-area" style={{ minHeight: 'auto', padding: '10px 16px', flex: '1 1 150px' }} placeholder="Department" value={profileForm.department} onChange={(e) => handleProfileChange('department', e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn--primary" disabled={!profileForm.name.trim() || !profileForm.email.trim() || !profileForm.company.trim()}>
              Start Workshop
            </button>
          </form>
        </div>
      )}

      {/* Main Application Flow */}
      {state && view === 'dashboard' && (
        <Dashboard
          state={state}
          completedCount={completedCount}
          onModuleClick={handleModuleClick}
          saveBlueprint={saveBlueprint}
          resetSession={resetSession}
          syncStateFromCheat={(newState) => syncState(newState, localStorage.getItem('ocw_email'))}
        />
      )}

      {state && activeModule && view === 'intro' && (
        <ModuleIntro
          module={activeModule}
          onBack={goDashboard}
          onBegin={() => setView('questions')}
        />
      )}

      {state && activeModule && view === 'questions' && (
        <QuestionPage
          module={activeModule}
          moduleState={state.modules[activeModuleId]}
          onAnswer={setAnswer}
          onBack={() => setView('intro')}
          onComplete={async () => {
            try {
              // First generate and save the report via completeModule
              await completeModule(activeModuleId)
              // Then switch to report view once report is ready
              setView('report')
            } catch (err) {
              console.error("Failed to complete module:", err)
              alert("Error generating report. Please try again.")
            }
          }}
        />
      )}

      {state && activeModule && view === 'report' && (
        <ReportPage
          module={activeModule}
          state={state}
          onComplete={completeModule}
          onBack={goDashboard}
        />
      )}
    </div>
  )
}
