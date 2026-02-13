import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Button from './ui/Button'

async function fetchResults() {
  const response = await fetch('/api/results')
  if (!response.ok) {
    throw new Error('Failed to fetch results')
  }
  return response.json()
}

async function fetchMeetResults(meetId) {
  const response = await fetch(`/api/meets/${meetId}/results`)
  if (!response.ok) {
    throw new Error('Failed to fetch meet results')
  }
  return response.json()
}

function TrophyIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ResultsModal({ result, onClose }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  const { data: fullResults, isLoading, isError } = useQuery({
    queryKey: ['meetResults', result.id],
    queryFn: () => fetchMeetResults(result.id),
  })

  // Focus close button on mount
  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Focus trap
  useEffect(() => {
    function handleTabKey(e) {
      if (e.key !== 'Tab' || !modalRef.current) return

      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-white">{result.meetName}</h2>
            <p className="text-slate-300 mt-1">{result.date}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-greyhound-green rounded"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Team placement */}
        {result.placement && (
          <div className="px-6 py-4 bg-slate-700/50 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <TrophyIcon />
              <span className="text-greyhound-gold font-bold">Team Placement: {result.placement}</span>
            </div>
          </div>
        )}

        {/* Full Results */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <h3 className="text-lg font-bold text-white mb-4">All Results</h3>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-greyhound-green"></div>
              <span className="ml-3 text-slate-300">Loading results...</span>
            </div>
          )}

          {isError && (
            <p className="text-red-400 text-center py-4">Failed to load results</p>
          )}

          {fullResults && fullResults.length === 0 && (
            <p className="text-slate-400 text-center py-4">No results available</p>
          )}

          {fullResults && fullResults.length > 0 && (
            <div className="space-y-3">
              {fullResults.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {r.place > 0 && (
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        r.place === 1 ? 'bg-yellow-500 text-black' :
                        r.place === 2 ? 'bg-slate-400 text-black' :
                        r.place === 3 ? 'bg-amber-700 text-white' :
                        'bg-slate-600 text-white'
                      }`}>
                        {r.place}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-white">{r.athleteName}</p>
                      <p className="text-sm text-slate-400">{r.event || '5K'}</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-greyhound-green">{r.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

function ResultCard({ result, onViewDetails, index, totalCount, gridRef }) {
  function handleKeyDown(e) {
    const cards = gridRef?.current?.querySelectorAll('[data-card]')
    if (!cards) return

    let nextIndex = index
    const columns = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextIndex = Math.min(index + 1, totalCount - 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nextIndex = Math.max(index - 1, 0)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = Math.min(index + columns, totalCount - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = Math.max(index - columns, 0)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onViewDetails(result)
      return
    }

    if (nextIndex !== index) {
      cards[nextIndex]?.focus()
    }
  }

  return (
    <article
      data-card
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-labelledby={`result-${result.id}-title`}
      className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-greyhound-green hover:shadow-xl hover:shadow-greyhound-green/10 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3
            id={`result-${result.id}-title`}
            className="text-lg font-bold text-white group-hover:text-greyhound-green transition-colors"
          >
            {result.meetName}
          </h3>
          <p className="text-sm text-slate-300">{result.date}</p>
        </div>
        <div className="flex items-center gap-1 bg-greyhound-gold/20 text-greyhound-gold text-xs font-bold px-2 py-1 rounded-full">
          <TrophyIcon />
          <span>{result.placement}</span>
        </div>
      </div>

      {result.athletes && result.athletes.length > 0 && (
        <ul className="space-y-2 mt-4" aria-label="Top finishers">
          {result.athletes.slice(0, 3).map((athlete, index) => (
            <li
              key={athlete.id || index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-slate-300">
                <span className="text-greyhound-green font-bold mr-2">{index + 1}.</span>
                {athlete.name}
              </span>
              <span className="text-greyhound-gold font-semibold">{athlete.time}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 pt-4 border-t border-slate-700">
        <Button variant="outline" size="sm" className="w-full" onClick={() => onViewDetails(result)}>
          View Full Results
        </Button>
      </div>
    </article>
  )
}

function AllResultsModal({ results, onClose }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Focus close button on mount
  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Focus trap
  useEffect(() => {
    function handleTabKey(e) {
      if (e.key !== 'Tab' || !modalRef.current) return

      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="relative bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
        role="dialog"
        aria-labelledby="all-results-title"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div>
            <h2 id="all-results-title" className="text-2xl font-bold text-white">All Season Results</h2>
            <p className="text-slate-300 mt-1">{results.length} meets with results</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-greyhound-green rounded"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          <div className="space-y-6">
            {results.map((result) => (
              <div key={result.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{result.meetName}</h3>
                    <p className="text-sm text-slate-400">{result.date}</p>
                  </div>
                  {result.placement && (
                    <div className="flex items-center gap-1 bg-greyhound-gold/20 text-greyhound-gold text-xs font-bold px-2 py-1 rounded-full">
                      <TrophyIcon />
                      <span>{result.placement}</span>
                    </div>
                  )}
                </div>
                {result.athletes && result.athletes.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.athletes.map((athlete, index) => (
                      <div key={athlete.id || index} className="flex items-center justify-between text-sm bg-slate-800/50 rounded px-3 py-2">
                        <span className="text-slate-300">
                          <span className="text-greyhound-green font-bold mr-2">{index + 1}.</span>
                          {athlete.name}
                        </span>
                        <span className="text-greyhound-gold font-semibold">{athlete.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-slate-700">
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  )
}

function Results() {
  const [selectedResult, setSelectedResult] = useState(null)
  const [showAllResults, setShowAllResults] = useState(false)
  const gridRef = useRef(null)
  const { data: results, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['results'],
    queryFn: fetchResults,
  })

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-center p-12"
      >
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-2 border-greyhound-green"
          aria-hidden="true"
        ></div>
        <span className="ml-4 text-slate-300 font-medium">Loading results...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center"
      >
        <p className="text-red-400 font-bold mb-2">Error loading results</p>
        <p className="text-red-300 text-sm mb-4">{error.message}</p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="border-red-500 text-red-400 hover:bg-red-500/10"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <section aria-labelledby="results-heading" className="w-full">
        <h2 id="results-heading" className="text-3xl font-extrabold text-white tracking-tight mb-4">
          Results
        </h2>
        <p className="text-slate-300">No results available yet.</p>
      </section>
    )
  }

  return (
    <section aria-labelledby="results-heading" className="w-full animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 id="results-heading" className="text-3xl font-extrabold text-white tracking-tight">
            Results
          </h2>
          <p className="text-slate-300 mt-1">Season performance</p>
        </div>
        <button
          onClick={() => setShowAllResults(true)}
          className="text-greyhound-green font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
        >
          View All Results →
        </button>
      </div>

      {/* Results Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Meet results"
      >
        {results.map((result, index) => (
          <div
            role="listitem"
            key={result.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ResultCard
              result={result}
              onViewDetails={setSelectedResult}
              index={index}
              totalCount={results.length}
              gridRef={gridRef}
            />
          </div>
        ))}
      </div>

      {/* Results Modal */}
      {selectedResult && (
        <ResultsModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}

      {/* All Results Modal */}
      {showAllResults && (
        <AllResultsModal
          results={results}
          onClose={() => setShowAllResults(false)}
        />
      )}
    </section>
  )
}

export default Results
