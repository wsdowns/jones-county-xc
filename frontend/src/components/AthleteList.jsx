import { useState } from 'react'
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

function AthleteCard({ athlete }) {
  return (
    <article
      aria-labelledby={`athlete-${athlete.id}-name`}
      className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-greyhound-green hover:shadow-xl hover:shadow-greyhound-green/10 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
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
      <Button variant="outline" size="sm" className="w-full">
        View Details
      </Button>
    </article>
  )
}

function AthleteList() {
  const [raceCategory, setRaceCategory] = useState('')

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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Athletes roster"
      >
        {athletes.map((athlete) => (
          <div role="listitem" key={athlete.id}>
            <AthleteCard athlete={athlete} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default AthleteList
