export default function ModuleIntro({ module, onBegin, onBack }) {
  return (
    <>
      {/* Simple top bar */}
      <div className="module-header">
        <div className="module-header__bar">
          <div className="module-header__left">
            <button className="module-header__back" onClick={onBack}>←</button>
            <div>
              <div className="module-header__label">Module {module.id}</div>
              <div className="module-header__title">{module.title}</div>
            </div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: '0%' }} />
        </div>
      </div>

      <div className="page-container module-intro">
        {/* About card */}
        <div className="card intro-card">
          <h2 className="intro-card__heading">What this module is about</h2>
          <p className="intro-card__body">{module.about}</p>

          <div className="intro-card__section">
            <div className="intro-card__section-label">Why it matters</div>
            <div className="intro-card__section-text">{module.whyItMatters}</div>
          </div>

          <div className="intro-card__section">
            <div className="intro-card__section-label">What you'll get clarity on</div>
            <div className="intro-card__section-text">{module.whatYouGetClarity}</div>
          </div>
        </div>

        {/* Begin card */}
        <div className="card begin-card">
          <div className="begin-card__sub">
            <span className="begin-card__label">Reflection Questions</span>
            <span className="begin-card__count">18 questions</span>
          </div>
          <p className="begin-card__hint">Take your time to reflect honestly on each question.</p>
          <button className="btn btn--primary" onClick={onBegin}>
            Begin Module
          </button>
        </div>
      </div>
    </>
  )
}
