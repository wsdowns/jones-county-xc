import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Button from './ui/Button'
import { Select, SelectItem } from './ui/Select'

async function fetchAthletes() {
  const response = await fetch('/api/athletes')
  if (!response.ok) {
    throw new Error('Failed to fetch athletes')
  }
  return response.json()
}

async function fetchAthleteResults(athleteId) {
  const response = await fetch(`/api/athletes/${athleteId}/results`)
  if (!response.ok) {
    throw new Error('Failed to fetch athlete results')
  }
  return response.json()
}

function ClockIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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

function AthleteDetailsModal({ athlete, onClose }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ['athleteResults', athlete.id],
    queryFn: () => fetchAthleteResults(athlete.id),
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
            <h2 id="modal-title" className="text-2xl font-bold text-white">{athlete.name}</h2>
            <p className="text-slate-300 mt-1">Grade {athlete.grade} • {athlete.events}</p>
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

        {/* PR highlight */}
        <div className="px-6 py-4 bg-slate-700/50 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <ClockIcon />
            <div>
              <p className="text-sm text-slate-400">Personal Record</p>
              <p className="text-2xl font-bold text-greyhound-gold">{athlete.personalRecord || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
          <h3 className="text-lg font-bold text-white mb-4">Race Results</h3>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-greyhound-green"></div>
              <span className="ml-3 text-slate-300">Loading results...</span>
            </div>
          )}

          {isError && (
            <p className="text-red-400 text-center py-4">Failed to load results</p>
          )}

          {results && results.length === 0 && (
            <p className="text-slate-400 text-center py-4">No race results yet</p>
          )}

          {results && results.length > 0 && (
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{result.meetName}</p>
                      <p className="text-sm text-slate-400">{result.meetDate} • {result.event || '5K'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-greyhound-green">{result.time}</p>
                      {result.place > 0 && (
                        <p className="text-sm text-greyhound-gold">
                          {result.place === 1 ? '1st' : result.place === 2 ? '2nd' : result.place === 3 ? '3rd' : `${result.place}th`} place
                        </p>
                      )}
                    </div>
                  </div>
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

function AthleteCard({ athlete, onViewDetails, index, totalCount, gridRef }) {
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
      onViewDetails(athlete)
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
      onClick={() => onViewDetails(athlete)}
      aria-labelledby={`athlete-${athlete.id}-name`}
      className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-greyhound-green hover:shadow-xl hover:shadow-greyhound-green/10 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-greyhound-green focus:border-greyhound-green focus:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3
            id={`athlete-${athlete.id}-name`}
            className="text-lg font-bold text-white group-hover:text-greyhound-green transition-colors"
          >
            {athlete.name}
          </h3>
          <p className="text-sm text-slate-300">Grade {athlete.grade}</p>
        </div>
        <span className="bg-greyhound-green/20 text-greyhound-green text-xs font-bold px-2 py-1 rounded-full uppercase">
          {athlete.events}
        </span>
      </div>
      <div className="flex items-center gap-2 text-2xl font-extrabold text-greyhound-gold mb-4">
        <ClockIcon />
        <span aria-label={`Personal record: ${athlete.personalRecord}`}>{athlete.personalRecord}</span>
      </div>
      <div className="w-full py-2 border-2 border-greyhound-green text-greyhound-green bg-transparent text-center text-xs font-semibold rounded-lg group-hover:bg-greyhound-green group-hover:text-white transition-all duration-200" aria-hidden="true">
        View Details
      </div>
    </article>
  )
}

function AthleteList() {
  const [raceCategory, setRaceCategory] = useState('')
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const gridRef = useRef(null)

  const { data: athletes, isLoading, isError, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
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
        <span className="ml-4 text-slate-300 font-medium">Loading athletes...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="bg-red-500/10 border border-red-500/50 rounded-xl p-6"
      >
        <p className="text-red-400 font-bold">Error loading athletes</p>
        <p className="text-red-300 text-sm">{error.message}</p>
      </div>
    )
  }

  const filteredAthletes = raceCategory
    ? athletes.filter(a => a.events?.toLowerCase().includes(raceCategory.toLowerCase()))
    : athletes

  return (
    <section aria-labelledby="athletes-heading" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 id="athletes-heading" className="text-3xl font-extrabold text-white tracking-tight">
            Athletes
          </h2>
          <p className="text-slate-300 mt-1">Our competitive roster</p>
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={raceCategory}
            onValueChange={setRaceCategory}
            placeholder="Filter by event"
            label="Filter by event"
          >
            <SelectItem value="5k">5K</SelectItem>
            <SelectItem value="3200m">3200m</SelectItem>
            <SelectItem value="1600m">1600m</SelectItem>
            <SelectItem value="800m">800m</SelectItem>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Athletes roster"
      >
        {filteredAthletes.map((athlete, index) => (
          <div role="listitem" key={athlete.id}>
            <AthleteCard
              athlete={athlete}
              onViewDetails={setSelectedAthlete}
              index={index}
              totalCount={filteredAthletes.length}
              gridRef={gridRef}
            />
          </div>
        ))}
      </div>

      {/* Athlete Details Modal */}
      {selectedAthlete && (
        <AthleteDetailsModal
          athlete={selectedAthlete}
          onClose={() => setSelectedAthlete(null)}
        />
      )}
    </section>
  )
}

export default AthleteList
