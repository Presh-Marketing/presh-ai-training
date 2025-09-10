import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  BookOpen, 
  Award, 
  BarChart3, 
  ChevronDown, 
  ChevronRight,
  CheckCircle,
  Circle,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const Sidebar = ({ trainingData, currentProgress, updateProgress }) => {
  const location = useLocation()
  const [expandedTracks, setExpandedTracks] = useState({ 1: true })

  const toggleTrack = (trackId) => {
    setExpandedTracks(prev => ({
      ...prev,
      [trackId]: !prev[trackId]
    }))
  }

  const isModuleAccessible = (trackId, moduleId) => {
    if (trackId < currentProgress.currentTrack) return true
    if (trackId === currentProgress.currentTrack) {
      return moduleId <= currentProgress.currentModule
    }
    return false
  }

  const isModuleCompleted = (trackId, moduleId) => {
    return currentProgress.completedModules.includes(`${trackId}-${moduleId}`)
  }

  const getTrackProgress = (track) => {
    const completedModules = track.modules.filter(module => 
      isModuleCompleted(track.id, module.id)
    ).length
    return (completedModules / track.modules.length) * 100
  }

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/progress', icon: BarChart3, label: 'Progress Tracker' }
  ]

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Training Tracks */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Training Tracks
          </h3>
          
          {trainingData.tracks.map((track) => {
            const isExpanded = expandedTracks[track.id]
            const trackProgress = getTrackProgress(track)
            const isTrackAccessible = track.id <= currentProgress.currentTrack
            const isCertificationEarned = currentProgress.certifications.includes(track.id)
            
            return (
              <div key={track.id} className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => toggleTrack(track.id)}
                  className={`w-full justify-between p-3 h-auto ${
                    !isTrackAccessible ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isTrackAccessible}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${track.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-sm">{track.id}</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{track.title}</h4>
                        {isCertificationEarned && (
                          <Award className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{track.duration}</p>
                      <div className="mt-2">
                        <Progress value={trackProgress} className="h-1" />
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(trackProgress)}% complete
                        </p>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </Button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 space-y-1"
                  >
                    {track.modules.map((module) => {
                      const isAccessible = isModuleAccessible(track.id, module.id)
                      const isCompleted = isModuleCompleted(track.id, module.id)
                      const isActive = location.pathname === `/track/${track.id}/module/${module.id}`
                      
                      return (
                        <Link
                          key={module.id}
                          to={isAccessible ? `/track/${track.id}/module/${module.id}` : '#'}
                          className={`block ${!isAccessible ? 'pointer-events-none' : ''}`}
                        >
                          <Button
                            variant="ghost"
                            className={`w-full justify-start p-2 h-auto text-left ${
                              isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                            } ${!isAccessible ? 'opacity-50' : ''}`}
                            disabled={!isAccessible}
                          >
                            <div className="flex items-start space-x-3 w-full">
                              <div className="flex-shrink-0 mt-0.5">
                                {!isAccessible ? (
                                  <Lock className="h-4 w-4 text-gray-400" />
                                ) : isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="text-sm font-medium truncate">
                                  {module.title}
                                </h5>
                                <p className="text-xs text-gray-500 mt-1">
                                  {module.duration}
                                </p>
                              </div>
                            </div>
                          </Button>
                        </Link>
                      )
                    })}
                    
                    {/* Certification Test Link */}
                    <Link
                      to={trackProgress === 100 ? `/certification/${track.id}` : '#'}
                      className={`block ${trackProgress !== 100 ? 'pointer-events-none' : ''}`}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start p-2 h-auto text-left border-t border-gray-100 mt-2 pt-3 ${
                          trackProgress !== 100 ? 'opacity-50' : 'text-yellow-700 bg-yellow-50'
                        }`}
                        disabled={trackProgress !== 100}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <Award className="h-4 w-4 flex-shrink-0" />
                          <div>
                            <h5 className="text-sm font-medium">
                              Certification Test
                            </h5>
                            <p className="text-xs text-gray-500">
                              {track.certification}
                            </p>
                          </div>
                          {isCertificationEarned && (
                            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                              Earned
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Sidebar

