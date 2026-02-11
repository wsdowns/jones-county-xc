import { useQuery } from '@tanstack/react-query'
import Button from './ui/Button'

async function fetchResults() {
  const response = await fetch('/api/results')
  if (!response.ok) {
    throw new Error('Failed to fetch results')
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

function ResultCard({ result }) {
  return (
    <article
      aria-labelledby={`result-${result.id}-title`}
      className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-greyhound-green hover:shadow-xl hover:shadow-greyhound-green/10 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
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
        <Button variant="outline" size="sm" className="w-full">
          View Full Results
        </Button>
      </div>
    </article>
  )
}

function Results() {
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
        <button className="text-greyhound-green font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1">
          View All Results →
        </button>
      </div>

      {/* Results Grid */}
      <div
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
            <ResultCard result={result} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Results
