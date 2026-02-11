import { useState, useEffect, useRef } from 'react'

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

const navItems = [
  { name: 'Home', icon: HomeIcon, href: '#' },
  { name: 'Athletes', icon: UsersIcon, href: '#athletes' },
  { name: 'Meets', icon: CalendarIcon, href: '#meets' },
  { name: 'Results', icon: TrophyIcon, href: '#results' },
  { name: 'Settings', icon: SettingsIcon, href: '#settings' },
]

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('Home')
  const sidebarRef = useRef(null)
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Handle escape key to close sidebar
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus trap when sidebar is open
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  // Focus trap - keep focus inside sidebar when open
  useEffect(() => {
    if (!isOpen) return

    function handleTabKey(event) {
      if (event.key !== 'Tab' || !sidebarRef.current) return

      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  const seasonProgress = 33 // percent complete

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        ref={menuButtonRef}
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="sidebar-nav"
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-greyhound-green text-white rounded-xl shadow-lg shadow-greyhound-green/25 hover:bg-greyhound-green/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-greyhound-dark transition-all"
      >
        <MenuIcon />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          aria-hidden="true"
          onClick={() => {
            setIsOpen(false)
            menuButtonRef.current?.focus()
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="sidebar-nav"
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out
          w-64 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-greyhound-green to-greyhound-green-dark rounded-xl flex items-center justify-center shadow-lg shadow-greyhound-green/25">
              <span className="text-white font-extrabold text-sm" aria-hidden="true">JC</span>
            </div>
            <div>
              <span className="font-bold text-white block">Jones County</span>
              <span className="text-xs text-slate-300">Cross Country</span>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={() => {
              setIsOpen(false)
              menuButtonRef.current?.focus()
            }}
            aria-label="Close navigation menu"
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyhound-green transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4" aria-label="Primary">
          <p id="menu-label" className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Menu</p>
          <ul className="space-y-1" role="list" aria-labelledby="menu-label">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.name)
                    setIsOpen(false)
                  }}
                  aria-current={activeItem === item.name ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:ring-inset ${
                    activeItem === item.name
                      ? 'bg-greyhound-green text-white shadow-lg shadow-greyhound-green/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon />
                  <span className="font-medium">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="bg-gradient-to-r from-greyhound-green/20 to-greyhound-gold/20 rounded-xl p-4">
            <p className="text-sm font-bold text-white mb-1">Season 2026</p>
            <p className="text-xs text-slate-300" id="progress-label">8 meets remaining</p>
            <div
              role="progressbar"
              aria-valuenow={seasonProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-labelledby="progress-label"
              className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-greyhound-green to-greyhound-gold rounded-full transition-all duration-500"
                style={{ width: `${seasonProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
