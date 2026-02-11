import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '../components/ui/Button'

// Icons
function UsersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

// API functions
async function fetchEventTypes() {
  const response = await fetch('/api/event-types')
  if (!response.ok) throw new Error('Failed to fetch event types')
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

async function fetchAllResults() {
  const response = await fetch('/api/results/all')
  if (!response.ok) throw new Error('Failed to fetch results')
  return response.json()
}

// Generic Modal Component
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-700 sticky top-0 bg-slate-900">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}

// Admin Section Component
function AdminSection({ icon: Icon, title, expanded, onToggle, children }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-greyhound-green">
            <Icon />
          </div>
          <span className="text-lg font-bold text-white">{title}</span>
        </div>
        {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {expanded && (
        <div className="border-t border-slate-700 p-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

// Action Button Component
function ActionButton({ icon: Icon, label, onClick, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-700 hover:bg-slate-600 text-white',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
    success: 'bg-greyhound-green/20 hover:bg-greyhound-green/30 text-greyhound-green border border-greyhound-green/30',
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${variants[variant]}`}
    >
      <Icon />
      <span className="font-medium">{label}</span>
    </button>
  )
}

// =====================
// EVENT TYPES MODALS
// =====================

function EventTypeForm({ eventType, onSubmit, onClose, isLoading }) {
  const [formData, setFormData] = useState({
    name: eventType?.name || '',
    distance: eventType?.distance || '',
    description: eventType?.description || '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
          placeholder="e.g., 5K"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Distance</label>
        <input
          type="text"
          value={formData.distance}
          onChange={e => setFormData(prev => ({ ...prev, distance: e.target.value }))}
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
          placeholder="e.g., 5000m"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
          placeholder="e.g., Standard cross country distance"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

function EventTypeList({ onEdit, onDelete }) {
  const { data: eventTypes = [], isLoading } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: fetchEventTypes,
  })

  if (isLoading) return <div className="text-slate-400">Loading...</div>

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {eventTypes.map(et => (
        <div key={et.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
          <div>
            <span className="font-medium text-white">{et.name}</span>
            <span className="text-slate-400 text-sm ml-2">{et.distance}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(et)} className="p-1 text-slate-400 hover:text-white"><EditIcon /></button>
            <button onClick={() => onDelete(et)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// =====================
// ATHLETES MODALS
// =====================

function AthleteForm({ athlete, onSubmit, onClose, isLoading }) {
  const [formData, setFormData] = useState({
    name: athlete?.name || '',
    grade: athlete?.grade || '',
    personalRecord: athlete?.personalRecord || '',
    events: athlete?.events || '5K',
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ ...formData, grade: parseInt(formData.grade, 10) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Grade</label>
        <select
          value={formData.grade}
          onChange={e => setFormData(prev => ({ ...prev, grade: e.target.value }))}
          required
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
        >
          <option value="">Select grade</option>
          <option value="9">9th Grade</option>
          <option value="10">10th Grade</option>
          <option value="11">11th Grade</option>
          <option value="12">12th Grade</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Personal Record</label>
        <input
          type="text"
          value={formData.personalRecord}
          onChange={e => setFormData(prev => ({ ...prev, personalRecord: e.target.value }))}
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
          placeholder="e.g., 18:30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Events</label>
        <input
          type="text"
          value={formData.events}
          onChange={e => setFormData(prev => ({ ...prev, events: e.target.value }))}
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
          placeholder="e.g., 5K, 3200m"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

function AthleteList({ onEdit, onDelete }) {
  const { data: athletes = [], isLoading } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  if (isLoading) return <div className="text-slate-400">Loading...</div>

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {athletes.map(a => (
        <div key={a.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
          <div>
            <span className="font-medium text-white">{a.name}</span>
            <span className="text-slate-400 text-sm ml-2">Grade {a.grade}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(a)} className="p-1 text-slate-400 hover:text-white"><EditIcon /></button>
            <button onClick={() => onDelete(a)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// =====================
// MEETS MODALS
// =====================

function MeetForm({ meet, onSubmit, onClose, isLoading }) {
  const [formData, setFormData] = useState({
    name: meet?.name || '',
    date: meet?.date || '',
    time: meet?.time || '',
    location: meet?.location || '',
    description: meet?.description || '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Meet Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
            className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green resize-none"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

function MeetList({ onEdit, onDelete }) {
  const { data: meets = [], isLoading } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  if (isLoading) return <div className="text-slate-400">Loading...</div>

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {meets.map(m => (
        <div key={m.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
          <div>
            <span className="font-medium text-white">{m.name}</span>
            <span className="text-slate-400 text-sm ml-2">{m.date}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(m)} className="p-1 text-slate-400 hover:text-white"><EditIcon /></button>
            <button onClick={() => onDelete(m)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// =====================
// RESULTS MODALS
// =====================

function ResultForm({ result, onSubmit, onClose, isLoading }) {
  const { data: athletes = [] } = useQuery({ queryKey: ['athletes'], queryFn: fetchAthletes })
  const { data: meets = [] } = useQuery({ queryKey: ['meets'], queryFn: fetchMeets })
  const { data: eventTypes = [] } = useQuery({ queryKey: ['eventTypes'], queryFn: fetchEventTypes })

  const [formData, setFormData] = useState({
    athleteId: result?.athleteId || '',
    meetId: result?.meetId || '',
    eventTypeId: result?.eventTypeId || '',
    time: result?.time || '',
    place: result?.place || '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      athleteId: parseInt(formData.athleteId, 10),
      meetId: parseInt(formData.meetId, 10),
      eventTypeId: parseInt(formData.eventTypeId, 10),
      time: formData.time,
      place: formData.place ? parseInt(formData.place, 10) : 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Athlete</label>
        <select
          value={formData.athleteId}
          onChange={e => setFormData(prev => ({ ...prev, athleteId: e.target.value }))}
          required
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
        >
          <option value="">Select athlete</option>
          {athletes.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Meet</label>
        <select
          value={formData.meetId}
          onChange={e => setFormData(prev => ({ ...prev, meetId: e.target.value }))}
          required
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
        >
          <option value="">Select meet</option>
          {meets.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.date})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Event</label>
        <select
          value={formData.eventTypeId}
          onChange={e => setFormData(prev => ({ ...prev, eventTypeId: e.target.value }))}
          required
          className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
        >
          <option value="">Select event</option>
          {eventTypes.map(et => (
            <option key={et.id} value={et.id}>{et.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Time</label>
          <input
            type="text"
            value={formData.time}
            onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
            required
            className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
            placeholder="e.g., 17:45"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Place</label>
          <input
            type="number"
            value={formData.place}
            onChange={e => setFormData(prev => ({ ...prev, place: e.target.value }))}
            min="1"
            className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

// Delete Confirmation Modal
function DeleteConfirmModal({ title, message, onConfirm, onClose, isLoading }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-300">{message}</p>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

function ResultList({ onEdit, onDelete }) {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['allResults'],
    queryFn: fetchAllResults,
  })

  if (isLoading) return <div className="text-slate-400">Loading...</div>

  if (results.length === 0) return <div className="text-slate-400">No results yet.</div>

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {results.map(r => (
        <div key={r.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
          <div className="flex-1 min-w-0">
            <span className="font-medium text-white">{r.athleteName}</span>
            <span className="text-greyhound-gold text-sm ml-2">{r.time}</span>
            <div className="text-slate-400 text-xs truncate">{r.meetName} • {r.eventName || '5K'}</div>
          </div>
          <div className="flex gap-2 ml-2">
            <button onClick={() => onEdit(r)} className="p-1 text-slate-400 hover:text-white"><EditIcon /></button>
            <button onClick={() => onDelete(r)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// =====================
// MAIN ADMIN PAGE
// =====================

function AdminPage({ user, onLogout }) {
  const queryClient = useQueryClient()
  const [expandedSection, setExpandedSection] = useState(null)
  const [modal, setModal] = useState({ type: null, data: null })

  // Mutations for Event Types
  const createEventType = useMutation({
    mutationFn: data => fetch('/api/event-types', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries(['eventTypes']); setModal({ type: null }) }
  })
  const updateEventType = useMutation({
    mutationFn: ({ id, ...data }) => fetch(`/api/event-types/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries(['eventTypes']); setModal({ type: null }) }
  })
  const deleteEventType = useMutation({
    mutationFn: id => fetch(`/api/event-types/${id}`, { method: 'DELETE' }),
    onSuccess: () => { queryClient.invalidateQueries(['eventTypes']); setModal({ type: null }) }
  })

  // Mutations for Athletes
  const createAthlete = useMutation({
    mutationFn: data => fetch('/api/athletes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries(['athletes']); setModal({ type: null }) }
  })
  const updateAthlete = useMutation({
    mutationFn: ({ id, ...data }) => fetch(`/api/athletes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries(['athletes']); setModal({ type: null }) }
  })
  const deleteAthlete = useMutation({
    mutationFn: id => fetch(`/api/athletes/${id}`, { method: 'DELETE' }),
    onSuccess: () => { queryClient.invalidateQueries(['athletes']); setModal({ type: null }) }
  })

  // Mutations for Meets
  const createMeet = useMutation({
    mutationFn: data => fetch('/api/meets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries(['meets']); setModal({ type: null }) }
  })
  const updateMeet = useMutation({
    mutationFn: ({ id, ...data }) => fetch(`/api/meets/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries(['meets']); setModal({ type: null }) }
  })
  const deleteMeet = useMutation({
    mutationFn: id => fetch(`/api/meets/${id}`, { method: 'DELETE' }),
    onSuccess: () => { queryClient.invalidateQueries(['meets']); setModal({ type: null }) }
  })

  // Mutations for Results
  const createResult = useMutation({
    mutationFn: data => fetch('/api/results', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries(['results']); queryClient.invalidateQueries(['allResults']); setModal({ type: null }) }
  })
  const updateResult = useMutation({
    mutationFn: ({ id, ...data }) => fetch(`/api/results/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries(['results']); queryClient.invalidateQueries(['allResults']); setModal({ type: null }) }
  })
  const deleteResult = useMutation({
    mutationFn: id => fetch(`/api/results/${id}`, { method: 'DELETE' }),
    onSuccess: () => { queryClient.invalidateQueries(['results']); queryClient.invalidateQueries(['allResults']); setModal({ type: null }) }
  })

  function toggleSection(section) {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Administration</h1>
          <p className="text-slate-300 mt-1">Welcome, {user?.username}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <LogOutIcon />
          <span>Log Out</span>
        </button>
      </div>

      {/* Admin Sections */}
      <div className="space-y-4">
        {/* Athletes */}
        <AdminSection
          icon={UsersIcon}
          title="Athletes"
          expanded={expandedSection === 'athletes'}
          onToggle={() => toggleSection('athletes')}
        >
          <div className="flex gap-2 mb-4">
            <ActionButton icon={PlusIcon} label="Add" variant="success" onClick={() => setModal({ type: 'addAthlete' })} />
          </div>
          <AthleteList
            onEdit={a => setModal({ type: 'editAthlete', data: a })}
            onDelete={a => setModal({ type: 'deleteAthlete', data: a })}
          />
        </AdminSection>

        {/* Meets */}
        <AdminSection
          icon={CalendarIcon}
          title="Meets"
          expanded={expandedSection === 'meets'}
          onToggle={() => toggleSection('meets')}
        >
          <div className="flex gap-2 mb-4">
            <ActionButton icon={PlusIcon} label="Add" variant="success" onClick={() => setModal({ type: 'addMeet' })} />
          </div>
          <MeetList
            onEdit={m => setModal({ type: 'editMeet', data: m })}
            onDelete={m => setModal({ type: 'deleteMeet', data: m })}
          />
        </AdminSection>

        {/* Results */}
        <AdminSection
          icon={TrophyIcon}
          title="Results"
          expanded={expandedSection === 'results'}
          onToggle={() => toggleSection('results')}
        >
          <div className="flex gap-2 mb-4">
            <ActionButton icon={PlusIcon} label="Add" variant="success" onClick={() => setModal({ type: 'addResult' })} />
          </div>
          <ResultList
            onEdit={r => setModal({ type: 'editResult', data: r })}
            onDelete={r => setModal({ type: 'deleteResult', data: r })}
          />
        </AdminSection>

        {/* Event Types */}
        <AdminSection
          icon={TagIcon}
          title="Event Types"
          expanded={expandedSection === 'eventTypes'}
          onToggle={() => toggleSection('eventTypes')}
        >
          <div className="flex gap-2 mb-4">
            <ActionButton icon={PlusIcon} label="Add" variant="success" onClick={() => setModal({ type: 'addEventType' })} />
          </div>
          <EventTypeList
            onEdit={et => setModal({ type: 'editEventType', data: et })}
            onDelete={et => setModal({ type: 'deleteEventType', data: et })}
          />
        </AdminSection>
      </div>

      {/* Modals */}
      {modal.type === 'addEventType' && (
        <Modal title="Add Event Type" onClose={() => setModal({ type: null })}>
          <EventTypeForm onSubmit={createEventType.mutate} onClose={() => setModal({ type: null })} isLoading={createEventType.isPending} />
        </Modal>
      )}
      {modal.type === 'editEventType' && (
        <Modal title="Edit Event Type" onClose={() => setModal({ type: null })}>
          <EventTypeForm eventType={modal.data} onSubmit={data => updateEventType.mutate({ id: modal.data.id, ...data })} onClose={() => setModal({ type: null })} isLoading={updateEventType.isPending} />
        </Modal>
      )}
      {modal.type === 'deleteEventType' && (
        <Modal title="Delete Event Type" onClose={() => setModal({ type: null })}>
          <DeleteConfirmModal message={`Are you sure you want to delete "${modal.data.name}"?`} onConfirm={() => deleteEventType.mutate(modal.data.id)} onClose={() => setModal({ type: null })} isLoading={deleteEventType.isPending} />
        </Modal>
      )}

      {modal.type === 'addAthlete' && (
        <Modal title="Add Athlete" onClose={() => setModal({ type: null })}>
          <AthleteForm onSubmit={createAthlete.mutate} onClose={() => setModal({ type: null })} isLoading={createAthlete.isPending} />
        </Modal>
      )}
      {modal.type === 'editAthlete' && (
        <Modal title="Edit Athlete" onClose={() => setModal({ type: null })}>
          <AthleteForm athlete={modal.data} onSubmit={data => updateAthlete.mutate({ id: modal.data.id, ...data })} onClose={() => setModal({ type: null })} isLoading={updateAthlete.isPending} />
        </Modal>
      )}
      {modal.type === 'deleteAthlete' && (
        <Modal title="Delete Athlete" onClose={() => setModal({ type: null })}>
          <DeleteConfirmModal message={`Are you sure you want to delete "${modal.data.name}"? This will also delete all their results.`} onConfirm={() => deleteAthlete.mutate(modal.data.id)} onClose={() => setModal({ type: null })} isLoading={deleteAthlete.isPending} />
        </Modal>
      )}

      {modal.type === 'addMeet' && (
        <Modal title="Add Meet" onClose={() => setModal({ type: null })}>
          <MeetForm onSubmit={createMeet.mutate} onClose={() => setModal({ type: null })} isLoading={createMeet.isPending} />
        </Modal>
      )}
      {modal.type === 'editMeet' && (
        <Modal title="Edit Meet" onClose={() => setModal({ type: null })}>
          <MeetForm meet={modal.data} onSubmit={data => updateMeet.mutate({ id: modal.data.id, ...data })} onClose={() => setModal({ type: null })} isLoading={updateMeet.isPending} />
        </Modal>
      )}
      {modal.type === 'deleteMeet' && (
        <Modal title="Delete Meet" onClose={() => setModal({ type: null })}>
          <DeleteConfirmModal message={`Are you sure you want to delete "${modal.data.name}"? This will also delete all results for this meet.`} onConfirm={() => deleteMeet.mutate(modal.data.id)} onClose={() => setModal({ type: null })} isLoading={deleteMeet.isPending} />
        </Modal>
      )}

      {modal.type === 'addResult' && (
        <Modal title="Add Result" onClose={() => setModal({ type: null })}>
          <ResultForm onSubmit={createResult.mutate} onClose={() => setModal({ type: null })} isLoading={createResult.isPending} />
        </Modal>
      )}
      {modal.type === 'editResult' && (
        <Modal title="Edit Result" onClose={() => setModal({ type: null })}>
          <ResultForm result={modal.data} onSubmit={data => updateResult.mutate({ id: modal.data.id, ...data })} onClose={() => setModal({ type: null })} isLoading={updateResult.isPending} />
        </Modal>
      )}
      {modal.type === 'deleteResult' && (
        <Modal title="Delete Result" onClose={() => setModal({ type: null })}>
          <DeleteConfirmModal message={`Are you sure you want to delete this result for ${modal.data.athleteName}?`} onConfirm={() => deleteResult.mutate(modal.data.id)} onClose={() => setModal({ type: null })} isLoading={deleteResult.isPending} />
        </Modal>
      )}
    </main>
  )
}

export default AdminPage
