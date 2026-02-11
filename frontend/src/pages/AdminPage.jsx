import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '../components/ui/Button'

function UsersIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// API functions
async function createAthlete(data) {
  const response = await fetch('/api/athletes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to add athlete' }))
    throw new Error(error.error || 'Failed to add athlete')
  }
  return response.json()
}

async function createMeet(data) {
  const response = await fetch('/api/meets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to add meet' }))
    throw new Error(error.error || 'Failed to add meet')
  }
  return response.json()
}

async function createResult(data) {
  const response = await fetch('/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to add result' }))
    throw new Error(error.error || 'Failed to add result')
  }
  return response.json()
}

async function fetchAthletes() {
  const response = await fetch('/api/athletes')
  if (!response.ok) throw new Error('Failed to fetch athletes')
  return response.json()
}

async function fetchMeets() {
  const response = await fetch('/api/meets')
  if (!response.ok) throw new Error('Failed to fetch meets')
  return response.json()
}

// Admin Card Component
function AdminCard({ icon: Icon, title, description, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 text-left transition-all duration-300 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-greyhound-green hover:shadow-xl hover:shadow-greyhound-green/10 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className={`text-greyhound-green ${!disabled && 'group-hover:text-greyhound-gold'} transition-colors`}>
          <Icon />
        </div>
        <div>
          <h3 className={`text-lg font-bold text-white ${!disabled && 'group-hover:text-greyhound-green'} transition-colors`}>
            {title}
          </h3>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
      {disabled && (
        <span className="inline-block bg-slate-700/50 text-slate-400 text-xs font-medium px-2 py-1 rounded-full">
          Coming soon
        </span>
      )}
    </button>
  )
}

// Add Athlete Modal
function AddAthleteModal({ onClose }) {
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    personalRecord: '',
    events: '5K',
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      setSuccessMessage('Athlete added successfully!')
      setFormData({ name: '', grade: '', personalRecord: '', events: '5K' })
      setTimeout(() => {
        setSuccessMessage('')
        onClose()
      }, 2000)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    mutation.reset()
    mutation.mutate({
      name: formData.name,
      grade: parseInt(formData.grade, 10),
      personalRecord: formData.personalRecord,
      events: formData.events,
    })
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 id="modal-title" className="text-xl font-bold text-white">Add New Athlete</h2>
          <button onClick={onClose} aria-label="Close modal" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-greyhound-green">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {successMessage && (
            <div className="flex items-center gap-2 bg-greyhound-green/20 border border-greyhound-green/50 text-greyhound-green rounded-lg p-3">
              <CheckIcon />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {mutation.isError && (
            <div role="alert" className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3">
              <span className="font-medium">{mutation.error.message}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent" placeholder="Enter athlete name" />
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-slate-300 mb-1">Grade</label>
            <select id="grade" name="grade" value={formData.grade} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent">
              <option value="">Select grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
          </div>

          <div>
            <label htmlFor="personalRecord" className="block text-sm font-medium text-slate-300 mb-1">Personal Record (5K)</label>
            <input type="text" id="personalRecord" name="personalRecord" value={formData.personalRecord} onChange={handleChange} className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent" placeholder="e.g., 18:30" />
          </div>

          <div>
            <label htmlFor="events" className="block text-sm font-medium text-slate-300 mb-1">Primary Event</label>
            <select id="events" name="events" value={formData.events} onChange={handleChange} className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent">
              <option value="5K">5K</option>
              <option value="3200m">3200m</option>
              <option value="1600m">1600m</option>
              <option value="800m">800m</option>
            </select>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Adding...
                </span>
              ) : (
                'Add Athlete'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Meet Modal
function AddMeetModal({ onClose }) {
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createMeet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meets'] })
      setSuccessMessage('Meet added successfully!')
      setFormData({ name: '', date: '', location: '', description: '' })
      setTimeout(() => {
        setSuccessMessage('')
        onClose()
      }, 2000)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    mutation.reset()
    mutation.mutate(formData)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title-meet">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 id="modal-title-meet" className="text-xl font-bold text-white">Add New Meet</h2>
          <button onClick={onClose} aria-label="Close modal" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-greyhound-green">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {successMessage && (
            <div className="flex items-center gap-2 bg-greyhound-green/20 border border-greyhound-green/50 text-greyhound-green rounded-lg p-3">
              <CheckIcon />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {mutation.isError && (
            <div role="alert" className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3">
              <span className="font-medium">{mutation.error.message}</span>
            </div>
          )}

          <div>
            <label htmlFor="meetName" className="block text-sm font-medium text-slate-300 mb-1">Meet Name</label>
            <input type="text" id="meetName" name="name" value={formData.name} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent" placeholder="e.g., Region Championship" />
          </div>

          <div>
            <label htmlFor="meetDate" className="block text-sm font-medium text-slate-300 mb-1">Date</label>
            <input type="date" id="meetDate" name="date" value={formData.date} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent" />
          </div>

          <div>
            <label htmlFor="meetLocation" className="block text-sm font-medium text-slate-300 mb-1">Location</label>
            <input type="text" id="meetLocation" name="location" value={formData.location} onChange={handleChange} className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent" placeholder="e.g., Macon, GA" />
          </div>

          <div>
            <label htmlFor="meetDescription" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea id="meetDescription" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent resize-none" placeholder="Optional description..." />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Adding...
                </span>
              ) : (
                'Add Meet'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Results Modal
function AddResultsModal({ onClose }) {
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    athleteId: '',
    meetId: '',
    event: '5K',
    time: '',
    place: '',
  })

  const queryClient = useQueryClient()

  const { data: athletes = [] } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  const { data: meets = [] } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  const mutation = useMutation({
    mutationFn: createResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] })
      setSuccessMessage('Result added successfully!')
      setFormData({ athleteId: '', meetId: '', event: '5K', time: '', place: '' })
      setTimeout(() => {
        setSuccessMessage('')
        onClose()
      }, 2000)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    mutation.reset()
    mutation.mutate({
      athleteId: parseInt(formData.athleteId, 10),
      meetId: parseInt(formData.meetId, 10),
      event: formData.event,
      time: formData.time,
      place: formData.place ? parseInt(formData.place, 10) : 0,
    })
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title-results">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 id="modal-title-results" className="text-xl font-bold text-white">Add Result</h2>
          <button onClick={onClose} aria-label="Close modal" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-greyhound-green">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {successMessage && (
            <div className="flex items-center gap-2 bg-greyhound-green/20 border border-greyhound-green/50 text-greyhound-green rounded-lg p-3">
              <CheckIcon />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {mutation.isError && (
            <div role="alert" className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3">
              <span className="font-medium">{mutation.error.message}</span>
            </div>
          )}

          <div>
            <label htmlFor="athleteId" className="block text-sm font-medium text-slate-300 mb-1">Athlete</label>
            <select id="athleteId" name="athleteId" value={formData.athleteId} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent">
              <option value="">Select athlete</option>
              {athletes.map(athlete => (
                <option key={athlete.id} value={athlete.id}>{athlete.name} (Grade {athlete.grade})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="meetId" className="block text-sm font-medium text-slate-300 mb-1">Meet</label>
            <select id="meetId" name="meetId" value={formData.meetId} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent">
              <option value="">Select meet</option>
              {meets.map(meet => (
                <option key={meet.id} value={meet.id}>{meet.name} ({meet.date})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="event" className="block text-sm font-medium text-slate-300 mb-1">Event</label>
            <select id="event" name="event" value={formData.event} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent">
              <option value="5K">5K</option>
              <option value="3200m">3200m</option>
              <option value="1600m">1600m</option>
              <option value="800m">800m</option>
              <option value="400m">400m</option>
            </select>
          </div>

          <div>
            <label htmlFor="resultTime" className="block text-sm font-medium text-slate-300 mb-1">Time</label>
            <input type="text" id="resultTime" name="time" value={formData.time} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent" placeholder="e.g., 17:45" />
          </div>

          <div>
            <label htmlFor="resultPlace" className="block text-sm font-medium text-slate-300 mb-1">Place (optional)</label>
            <input type="number" id="resultPlace" name="place" value={formData.place} onChange={handleChange} min="1" className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent" placeholder="e.g., 1" />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Adding...
                </span>
              ) : (
                'Add Result'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Admin Page
function AdminPage({ user, onLogout }) {
  const [showAddAthlete, setShowAddAthlete] = useState(false)
  const [showAddMeet, setShowAddMeet] = useState(false)
  const [showAddResults, setShowAddResults] = useState(false)

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Administration</h1>
        <p className="text-slate-300 mt-1">Welcome, {user?.username}</p>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard
          icon={UsersIcon}
          title="Add Athlete"
          description="Add a new team member"
          onClick={() => setShowAddAthlete(true)}
        />
        <AdminCard
          icon={CalendarIcon}
          title="Add Meet"
          description="Schedule a new meet"
          onClick={() => setShowAddMeet(true)}
        />
        <AdminCard
          icon={TrophyIcon}
          title="Add Results"
          description="Record meet results"
          onClick={() => setShowAddResults(true)}
        />
        <AdminCard
          icon={LogOutIcon}
          title="Log Out"
          description="End your session"
          onClick={onLogout}
        />
      </div>

      {/* Modals */}
      {showAddAthlete && <AddAthleteModal onClose={() => setShowAddAthlete(false)} />}
      {showAddMeet && <AddMeetModal onClose={() => setShowAddMeet(false)} />}
      {showAddResults && <AddResultsModal onClose={() => setShowAddResults(false)} />}
    </main>
  )
}

export default AdminPage
