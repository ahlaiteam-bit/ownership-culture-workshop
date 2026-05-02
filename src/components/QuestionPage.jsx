import { useState, useMemo } from 'react'
import { QUESTIONS_PER_PAGE, TOTAL_PAGES } from '../data/modules'

export default function QuestionPage({ module, moduleState, onAnswer, onComplete, onBack }) {
  const [currentPage, setCurrentPage] = useState(1)

  // Get questions for the current page
  const pageQuestions = useMemo(
    () => module.questions.filter((q) => q.page === currentPage),
    [module.questions, currentPage]
  )

  const isLastPage = currentPage === TOTAL_PAGES

  // Check if all questions on this page are answered
  const isPageComplete = pageQuestions.every(
    (q) => moduleState.answers[q.id] !== undefined && moduleState.answers[q.id] !== ''
  )

  const handleNext = () => {
    if (!isPageComplete) return
    if (isLastPage) {
      onComplete()
    } else {
      setCurrentPage((p) => p + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1)
      window.scrollTo(0, 0)
    } else {
      onBack() // Back to intro page
    }
  }

  const progressPct = ((currentPage - 1) / TOTAL_PAGES) * 100

  // Render a single question scale widget
  const renderScale = (q) => {
    const val = moduleState.answers[q.id]
    return (
      <div className="scale-widget">
        <div className="scale-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              className={`scale-btn ${val === num ? 'scale-btn--active' : ''}`}
              onClick={() => onAnswer(module.id, q.id, num)}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="scale-labels">
          <span>Very low / Not true for me</span>
          <span>Very high / Very true for me</span>
        </div>
      </div>
    )
  }

  // Render a single question MCQ widget
  const renderMCQ = (q) => {
    const val = moduleState.answers[q.id]
    return (
      <div className="mcq-options">
        {q.options.map((opt) => {
          const isActive = val === opt
          return (
            <button
              key={opt}
              className={`mcq-option ${isActive ? 'mcq-option--active' : ''}`}
              onClick={() => onAnswer(module.id, q.id, opt)}
            >
              <div className="mcq-radio">
                <div className="mcq-radio__dot" />
              </div>
              {opt}
            </button>
          )
        })}
      </div>
    )
  }

  // Render a single question open text widget
  const renderText = (q) => {
    return (
      <textarea
        className="open-text-area"
        placeholder={q.hint || 'Write your response here...'}
        value={moduleState.answers[q.id] || ''}
        onChange={(e) => onAnswer(module.id, q.id, e.target.value)}
      />
    )
  }

  return (
    <>
      <div className="module-header">
        <div className="module-header__bar">
          <div className="module-header__left">
            <button className="module-header__back" onClick={handlePrev}>←</button>
            <div>
              <div className="module-header__label">Module {module.id}</div>
              <div className="module-header__title">{module.title}</div>
            </div>
          </div>
          <div className="module-header__page">
            Page {currentPage} of {TOTAL_PAGES}
          </div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="page-container question-page">
        <div className="card">
          <div className="question-page__meta">
            Page {currentPage} of {TOTAL_PAGES} · Questions {pageQuestions[0]?.id}–{pageQuestions[pageQuestions.length - 1]?.id} of {module.questions.length}
          </div>

          {pageQuestions.map((q) => (
            <div key={q.id} className="question-item">
              <h3 className="question-item__text">{q.text}</h3>
              {q.type === 'text' && q.hint && (
                <div className="question-item__hint">{q.hint}</div>
              )}

              {q.type === 'scale' && renderScale(q)}
              {q.type === 'mcq' && renderMCQ(q)}
              {q.type === 'text' && renderText(q)}
            </div>
          ))}

          <div className="question-nav">
            <button className="btn btn--outline" onClick={handlePrev}>
              ‹ Previous
            </button>
            <button
              className={`btn ${isPageComplete ? 'btn--primary' : 'btn--outline'}`}
              onClick={handleNext}
              disabled={!isPageComplete}
            >
              {isLastPage ? '✓ Complete Module' : 'Next ›'}
            </button>
          </div>

          <div className="page-dots">
            {[...Array(TOTAL_PAGES)].map((_, i) => {
              const p = i + 1
              let cls = 'page-dot'
              if (p === currentPage) cls += ' page-dot--active'
              else if (p < currentPage) cls += ' page-dot--done'
              return (
                <div key={p} className={cls}>
                  {p}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
