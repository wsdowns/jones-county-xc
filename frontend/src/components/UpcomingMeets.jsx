import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Button from './ui/Button'

async function fetchMeets() {
  const response = await fetch('/api/meets')
  if (!response.ok) {
    throw new Error('Failed to fetch meets')
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

function CalendarIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      className="w-4 h-4"
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

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [hours, minutes] = timeStr.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

function MeetDetailsModal({ meet, onClose }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ['meetResults', meet.id],
    queryFn: () => fetchMeetResults(meet.id),
  })

  const date = new Date(meet.date)
  const fullDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
            <h2 id="modal-title" className="text-2xl font-bold text-white">{meet.name}</h2>
            <p className="text-slate-300 mt-1">
              {fullDate}
              {meet.time && <span className="text-greyhound-gold ml-2">@ {formatTime(meet.time)}</span>}
            </p>
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

        {/* Meet info */}
        <div className="px-6 py-4 bg-slate-700/50 border-b border-slate-700">
          <div className="flex items-center gap-2 text-slate-300">
            <LocationIcon />
            <span>{meet.location || 'Location TBA'}</span>
          </div>
          {meet.description && (
            <p className="mt-2 text-sm text-slate-400">{meet.description}</p>
          )}
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
            <p className="text-slate-400 text-center py-4">No results posted yet</p>
          )}

          {results && results.length > 0 && (
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {result.place > 0 && (
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        result.place === 1 ? 'bg-yellow-500 text-black' :
                        result.place === 2 ? 'bg-slate-400 text-black' :
                        result.place === 3 ? 'bg-amber-700 text-white' :
                        'bg-slate-600 text-white'
                      }`}>
                        {result.place}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-white">{result.athleteName}</p>
                      <p className="text-sm text-slate-400">{result.event || '5K'}</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-greyhound-green">{result.time}</p>
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

function MeetCard({ meet, onViewDetails, index, totalCount, gridRef }) {
  const date = new Date(meet.date)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()
  const fullDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  function handleClick() {
    onViewDetails(meet)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
      return
    }

    const cards = gridRef?.current?.querySelectorAll('[data-card]')
    if (!cards) return

    let nextIndex = index
    const columns = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      nextIndex = Math.min(index + 1, totalCount - 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      nextIndex = Math.max(index - 1, 0)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      nextIndex = Math.min(index + columns, totalCount - 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      nextIndex = Math.max(index - columns, 0)
    }

    if (nextIndex !== index) {
      cards[nextIndex]?.focus()
    }
  }

  return (
    <article
      data-card
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-labelledby={`meet-${meet.id}-name`}
      className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-greyhound-green hover:shadow-xl hover:shadow-greyhound-green/10 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Date block */}
        <div
          className="flex-shrink-0 w-16 h-16 bg-greyhound-green rounded-lg flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-xs font-bold text-white/80">{month}</span>
          <span className="text-2xl font-extrabold text-white">{day}</span>
        </div>

        {/* Meet info */}
        <div className="flex-1 min-w-0">
          <h3
            id={`meet-${meet.id}-name`}
            className="text-lg font-bold text-white group-hover:text-greyhound-green transition-colors truncate"
          >
            {meet.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-slate-300 mt-1">
            <LocationIcon />
            <span>{meet.location}</span>
          </div>
          {meet.time && (
            <div className="flex items-center gap-1 text-sm text-greyhound-gold mt-1">
              <ClockIcon />
              <span>{formatTime(meet.time)}</span>
            </div>
          )}
          <time dateTime={meet.date} className="sr-only">
            {fullDate}
          </time>
        </div>
      </div>

      {/* Action hint */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-300 uppercase tracking-wide">Cross Country</span>
        <span
          className="text-greyhound-green text-sm font-medium opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          View Details →
        </span>
      </div>
    </article>
  )
}

function FullScheduleModal({ meets, onClose, onSelectMeet }) {
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
        className="relative bg-slate-800 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
        role="dialog"
        aria-labelledby="schedule-title"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div>
            <h2 id="schedule-title" className="text-2xl font-bold text-white">Full Season Schedule</h2>
            <p className="text-slate-300 mt-1">{meets.length} meets scheduled</p>
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
          <div className="space-y-3">
            {meets.map((meet) => {
              const date = new Date(meet.date)
              const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
              return (
                <button
                  key={meet.id}
                  onClick={() => { onClose(); onSelectMeet(meet); }}
                  className="w-full bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-greyhound-green transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-greyhound-green rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-white/80">
                        {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </span>
                      <span className="text-xl font-extrabold text-white">{date.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white">{meet.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400 mt-1">
                        <span>{formattedDate}</span>
                        {meet.time && (
                          <span className="text-greyhound-gold flex items-center gap-1">
                            <ClockIcon />
                            {formatTime(meet.time)}
                          </span>
                        )}
                        {meet.location && (
                          <span className="flex items-center gap-1">
                            <LocationIcon />
                            {meet.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-greyhound-green text-sm">Details →</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="p-4 border-t border-slate-700">
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  )
}

function UpcomingMeets() {
  const [selectedMeet, setSelectedMeet] = useState(null)
  const [showFullSchedule, setShowFullSchedule] = useState(false)
  const gridRef = useRef(null)

  const { data: meets, isLoading, isError, error } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
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
        <span className="ml-4 text-slate-300 font-medium">Loading meets...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="bg-red-500/10 border border-red-500/50 rounded-xl p-6"
      >
        <p className="text-red-400 font-bold">Error loading meets</p>
        <p className="text-red-300 text-sm">{error.message}</p>
      </div>
    )
  }

  return (
    <section aria-labelledby="meets-heading" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 id="meets-heading" className="text-3xl font-extrabold text-white tracking-tight">
            Upcoming Meets
          </h2>
          <p className="text-slate-300 mt-1">Mark your calendar</p>
        </div>
        <button
          onClick={() => setShowFullSchedule(true)}
          className="text-greyhound-green font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
        >
          View Full Schedule →
        </button>
      </div>

      {/* Cards Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Upcoming meets"
      >
        {meets.map((meet, index) => (
          <div role="listitem" key={meet.id}>
            <MeetCard
              meet={meet}
              onViewDetails={setSelectedMeet}
              index={index}
              totalCount={meets.length}
              gridRef={gridRef}
            />
          </div>
        ))}
      </div>

      {/* Meet Details Modal */}
      {selectedMeet && (
        <MeetDetailsModal
          meet={selectedMeet}
          onClose={() => setSelectedMeet(null)}
        />
      )}

      {/* Full Schedule Modal */}
      {showFullSchedule && (
        <FullScheduleModal
          meets={meets}
          onClose={() => setShowFullSchedule(false)}
          onSelectMeet={setSelectedMeet}
        />
      )}
    </section>
  )
}

export default UpcomingMeets
