import AthleteList from '../components/AthleteList'
import UpcomingMeets from '../components/UpcomingMeets'
import Results from '../components/Results'

function HomePage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      {/* Hero Banner */}
      <header className="relative min-h-[20vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-greyhound-dark via-greyhound-green-dark to-greyhound-dark" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-greyhound-dark via-transparent to-transparent" aria-hidden="true"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-greyhound-green/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-greyhound-gold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-greyhound-green/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} aria-hidden="true"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-6">
          {/* Date badge */}
          <div className="inline-flex items-center gap-2 bg-greyhound-green/20 backdrop-blur-sm border border-greyhound-green/30 px-5 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-greyhound-gold rounded-full animate-pulse" aria-hidden="true"></span>
            <time className="text-greyhound-gold text-sm font-semibold tracking-widest uppercase">
              {today}
            </time>
          </div>

          {/* Main title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-none">
            JONES COUNTY
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-greyhound-green via-emerald-400 to-greyhound-gold">
              CROSS COUNTRY
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 mb-10 tracking-wide">
            Home of the <span className="text-greyhound-gold">Greyhounds</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#athletes-heading"
              className="px-8 py-4 bg-greyhound-green text-white font-bold text-lg rounded-xl shadow-lg shadow-greyhound-green/30 hover:shadow-greyhound-green/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-greyhound-dark transition-all duration-300"
            >
              View Roster
            </a>
            <a
              href="#meets-heading"
              className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-greyhound-dark transition-all duration-300"
            >
              Upcoming Meets
            </a>
          </div>

          {/* Season badge */}
          <div className="mt-12 inline-flex items-center gap-3 text-slate-300">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-600" aria-hidden="true"></div>
            <span className="text-sm font-medium uppercase tracking-widest">2026 Season</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-600" aria-hidden="true"></div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-greyhound-dark to-transparent" aria-hidden="true"></div>
      </header>

      {/* Gold accent bar */}
      <div className="h-1 bg-gradient-to-r from-transparent via-greyhound-gold to-transparent" aria-hidden="true"></div>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats bar */}
        <section aria-label="Team statistics" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-extrabold text-greyhound-green" aria-hidden="true">24</p>
            <p className="text-sm text-slate-300 font-medium uppercase tracking-wide">Athletes</p>
            <span className="sr-only">24 Athletes</span>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-extrabold text-greyhound-green" aria-hidden="true">8</p>
            <p className="text-sm text-slate-300 font-medium uppercase tracking-wide">Meets</p>
            <span className="sr-only">8 Meets</span>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-extrabold text-greyhound-green" aria-hidden="true">16:42</p>
            <p className="text-sm text-slate-300 font-medium uppercase tracking-wide">Best 5K</p>
            <span className="sr-only">Best 5K time: 16 minutes 42 seconds</span>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-extrabold text-greyhound-green" aria-hidden="true">3rd</p>
            <p className="text-sm text-slate-300 font-medium uppercase tracking-wide">Region Rank</p>
            <span className="sr-only">Region Rank: 3rd</span>
          </div>
        </section>

        {/* Content sections */}
        <div className="space-y-12">
          <AthleteList />
          <UpcomingMeets />
          <Results />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-6">
        <div className="flex items-center justify-center">
          <p className="text-slate-300 text-sm">
            © 2026 Jones County Cross Country. Go Greyhounds!
          </p>
        </div>
      </footer>
    </>
  )
}

export default HomePage
