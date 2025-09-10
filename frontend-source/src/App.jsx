import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Components
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TrackOverview from './components/TrackOverview'
import ModuleContent from './components/ModuleContent'
import CertificationTest from './components/CertificationTest'
import ProgressTracker from './components/ProgressTracker'
import Header from './components/Header'
import LoginPage from './components/LoginPage'

// Data
import { trainingData } from './data/trainingData'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/auth/check-auth', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.authenticated) {
        // Get full user data
        const userResponse = await fetch('/auth/user', {
          credentials: 'include'
        })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setCurrentUser(userData)
        } else {
          // Create default user if not found
          setCurrentUser({
            id: 1,
            name: data.user_name || 'Marketing Strategist',
            email: data.user_email || 'user@preshmarketingsolutions.com',
            role: 'Marketing Strategist',
            progress: {
              currentTrack: 1,
              currentModule: 1,
              completedModules: [],
              certifications: [],
              totalProgress: 0
            }
          })
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setCurrentUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Load progress from localStorage for authenticated users
  useEffect(() => {
    if (currentUser) {
      const savedProgress = localStorage.getItem(`presh-ai-training-progress-${currentUser.id}`)
      if (savedProgress) {
        setCurrentUser(prev => ({
          ...prev,
          progress: { ...prev.progress, ...JSON.parse(savedProgress) }
        }))
      }
    }
  }, [currentUser?.id])

  // Save progress to localStorage
  const updateProgress = (newProgress) => {
    if (!currentUser) return
    
    const updatedProgress = { ...currentUser.progress, ...newProgress }
    setCurrentUser(prev => ({ ...prev, progress: updatedProgress }))
    localStorage.setItem(`presh-ai-training-progress-${currentUser.id}`, JSON.stringify(updatedProgress))
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!currentUser) {
    return <LoginPage />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header 
          user={currentUser} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />
        
        <div className="flex">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.3 }}
                className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40"
              >
                <Sidebar 
                  trainingData={trainingData}
                  currentProgress={currentUser.progress}
                  updateProgress={updateProgress}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <main className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-80' : 'ml-0'
          } pt-16`}>
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <Dashboard 
                      user={currentUser}
                      trainingData={trainingData}
                      updateProgress={updateProgress}
                    />
                  } 
                />
                <Route 
                  path="/track/:trackId" 
                  element={
                    <TrackOverview 
                      trainingData={trainingData}
                      currentProgress={currentUser.progress}
                      updateProgress={updateProgress}
                    />
                  } 
                />
                <Route 
                  path="/track/:trackId/module/:moduleId" 
                  element={
                    <ModuleContent 
                      trainingData={trainingData}
                      currentProgress={currentUser.progress}
                      updateProgress={updateProgress}
                    />
                  } 
                />
                <Route 
                  path="/certification/:trackId" 
                  element={
                    <CertificationTest 
                      trainingData={trainingData}
                      currentProgress={currentUser.progress}
                      updateProgress={updateProgress}
                    />
                  } 
                />
                <Route 
                  path="/progress" 
                  element={
                    <ProgressTracker 
                      user={currentUser}
                      trainingData={trainingData}
                    />
                  } 
                />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

