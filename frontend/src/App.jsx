import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import AthletesPage from './pages/AthletesPage'
import MeetsPage from './pages/MeetsPage'
import ResultsPage from './pages/ResultsPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'

const queryClient = new QueryClient()

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  function handleLogin(userData) {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-greyhound-dark">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[100] focus:bg-greyhound-green focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
          >
            Skip to main content
          </a>

          <Sidebar />

          {/* Main content - offset for sidebar on large screens */}
          <div className="lg:ml-64">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/athletes" element={<AthletesPage />} />
              <Route path="/meets" element={<MeetsPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route
                path="/admin"
                element={
                  user ? (
                    <AdminPage user={user} onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <LoginPage onLogin={handleLogin} />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
