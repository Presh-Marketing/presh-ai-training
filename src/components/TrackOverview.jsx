import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle, 
  Circle, 
  Lock,
  ArrowRight,
  Target,
  Users,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const TrackOverview = ({ trainingData, currentProgress, updateProgress }) => {
  const { trackId } = useParams()
  const track = trainingData.tracks.find(t => t.id === parseInt(trackId))
  
  if (!track) {
    return <div>Track not found</div>
  }

  const completedModules = track.modules.filter(module => 
    currentProgress.completedModules.includes(`${track.id}-${module.id}`)
  ).length
  
  const trackProgress = (completedModules / track.modules.length) * 100
  const isCertified = currentProgress.certifications.includes(track.id)
  const isAccessible = track.id <= currentProgress.currentTrack

  const isModuleAccessible = (moduleId) => {
    if (track.id < currentProgress.currentTrack) return true
    if (track.id === currentProgress.currentTrack) {
      return moduleId <= currentProgress.currentModule
    }
    return false
  }

  const isModuleCompleted = (moduleId) => {
    return currentProgress.completedModules.includes(`${track.id}-${moduleId}`)
  }

  if (!isAccessible) {
    return (
      <div className="text-center py-12">
        <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Locked</h2>
        <p className="text-gray-600">Complete previous tracks to unlock this content.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Track Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${track.color} rounded-xl p-8 text-white`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{track.id}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{track.title}</h1>
                <p className="text-white/80">{track.duration}</p>
              </div>
            </div>
            <p className="text-lg text-white/90 mb-6 max-w-3xl">
              {track.description}
            </p>
            <div className="flex items-center space-x-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {track.modules.length} Modules
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {track.certification}
              </Badge>
              {isCertified && (
                <Badge variant="secondary" className="bg-green-500 text-white">
                  <Award className="w-4 h-4 mr-1" />
                  Certified
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-2">{Math.round(trackProgress)}%</div>
            <div className="text-white/80">Complete</div>
            <Progress value={trackProgress} className="w-32 h-2 mt-4 bg-white/20" />
          </div>
        </div>
      </motion.div>

      {/* Track Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Modules</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedModules}/{track.modules.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Time Investment</p>
                <p className="text-2xl font-bold text-gray-900">8-15h</p>
                <p className="text-sm text-gray-500">per week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Outcome</p>
                <p className="text-lg font-semibold text-gray-900">{track.certification}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Training Modules</h2>
          {trackProgress === 100 && !isCertified && (
            <Link to={`/certification/${track.id}`}>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Award className="mr-2 h-4 w-4" />
                Take Certification Test
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {track.modules.map((module, index) => {
            const isAccessible = isModuleAccessible(module.id)
            const isCompleted = isModuleCompleted(module.id)
            const isCurrent = track.id === currentProgress.currentTrack && 
                             module.id === currentProgress.currentModule

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full transition-all hover:shadow-lg ${
                  isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                } ${!isAccessible ? 'opacity-50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {!isAccessible ? (
                            <Lock className="h-5 w-5 text-gray-400" />
                          ) : isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            Module {module.id}: {module.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {module.duration} • {module.description}
                          </CardDescription>
                        </div>
                      </div>
                      {isCurrent && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Current
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Topics */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Key Topics
                      </h4>
                      <ul className="space-y-1">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Elements */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Interactive Elements
                      </h4>
                      <div className="space-y-2">
                        {module.interactiveElements.map((element, elementIndex) => (
                          <div key={elementIndex} className="text-sm">
                            <span className="font-medium text-gray-700">{element.title}:</span>
                            <span className="text-gray-600 ml-1">{element.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {isAccessible ? (
                        <Link to={`/track/${track.id}/module/${module.id}`}>
                          <Button 
                            className="w-full" 
                            variant={isCompleted ? "outline" : "default"}
                          >
                            {isCompleted ? 'Review Module' : 'Start Module'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button className="w-full" disabled>
                          <Lock className="mr-2 h-4 w-4" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TrackOverview

