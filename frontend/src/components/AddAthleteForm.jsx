import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from './ui/Button'

async function createAthlete(data) {
  const response = await fetch('/api/athletes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to add athlete' }))
    throw new Error(error.error || 'Failed to add athlete')
  }
  return response.json()
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function AddAthleteForm() {
  const [isOpen, setIsOpen] = useState(false)
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
        setIsOpen(false)
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

  function handleClose() {
    setIsOpen(false)
    mutation.reset()
    setSuccessMessage('')
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-greyhound-green hover:text-greyhound-gold transition-colors focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
      >
        <PlusIcon />
        <span className="font-medium">Add Athlete</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Modal Content */}
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h2 id="modal-title" className="text-xl font-bold text-white">
                Add New Athlete
              </h2>
              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-greyhound-green"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="flex items-center gap-2 bg-greyhound-green/20 border border-greyhound-green/50 text-greyhound-green rounded-lg p-3">
                  <CheckIcon />
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              {/* Error Message */}
              {mutation.isError && (
                <div role="alert" className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3">
                  <span className="font-medium">{mutation.error.message}</span>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent transition-colors"
                  placeholder="Enter athlete name"
                />
              </div>

              {/* Grade Field */}
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-slate-300 mb-1">
                  Grade
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent transition-colors"
                >
                  <option value="">Select grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
              </div>

              {/* Personal Record Field */}
              <div>
                <label htmlFor="personalRecord" className="block text-sm font-medium text-slate-300 mb-1">
                  Personal Record (5K)
                </label>
                <input
                  type="text"
                  id="personalRecord"
                  name="personalRecord"
                  value={formData.personalRecord}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent transition-colors"
                  placeholder="e.g., 18:30"
                />
              </div>

              {/* Events Field */}
              <div>
                <label htmlFor="events" className="block text-sm font-medium text-slate-300 mb-1">
                  Primary Event
                </label>
                <select
                  id="events"
                  name="events"
                  value={formData.events}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:border-transparent transition-colors"
                >
                  <option value="5K">5K</option>
                  <option value="3200m">3200m</option>
                  <option value="1600m">1600m</option>
                  <option value="800m">800m</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full"
                >
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
      )}
    </>
  )
}

export default AddAthleteForm
