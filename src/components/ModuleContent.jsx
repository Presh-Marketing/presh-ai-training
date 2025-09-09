import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Target,
  Users,
  FileText,
  Video,
  PenTool,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const ModuleContent = ({ trainingData, currentProgress, updateProgress }) => {
  const { trackId, moduleId } = useParams()
  const navigate = useNavigate()
  
  const track = trainingData.tracks.find(t => t.id === parseInt(trackId))
  const module = track?.modules.find(m => m.id === parseInt(moduleId))
  
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState(new Set())
  const [notes, setNotes] = useState('')
  const [exerciseResponses, setExerciseResponses] = useState({})

  useEffect(() => {
    // Load saved progress for this module
    const savedNotes = localStorage.getItem(`module-notes-${trackId}-${moduleId}`)
    const savedResponses = localStorage.getItem(`exercise-responses-${trackId}-${moduleId}`)
    const savedSections = localStorage.getItem(`completed-sections-${trackId}-${moduleId}`)
    
    if (savedNotes) setNotes(savedNotes)
    if (savedResponses) setExerciseResponses(JSON.parse(savedResponses))
    if (savedSections) setCompletedSections(new Set(JSON.parse(savedSections)))
  }, [trackId, moduleId])

  if (!track || !module) {
    return <div>Module not found</div>
  }

  const isModuleCompleted = currentProgress.completedModules.includes(`${trackId}-${moduleId}`)
  const totalSections = module.topics.length + module.interactiveElements.length
  const progress = (completedSections.size / totalSections) * 100

  const saveProgress = () => {
    localStorage.setItem(`module-notes-${trackId}-${moduleId}`, notes)
    localStorage.setItem(`exercise-responses-${trackId}-${moduleId}`, JSON.stringify(exerciseResponses))
    localStorage.setItem(`completed-sections-${trackId}-${moduleId}`, JSON.stringify([...completedSections]))
  }

  const markSectionComplete = (sectionIndex) => {
    const newCompleted = new Set(completedSections)
    newCompleted.add(sectionIndex)
    setCompletedSections(newCompleted)
    saveProgress()
  }

  const completeModule = () => {
    if (!isModuleCompleted) {
      const newCompletedModules = [...currentProgress.completedModules, `${trackId}-${moduleId}`]
      
      // Check if this unlocks the next module
      let newCurrentModule = currentProgress.currentModule
      if (parseInt(trackId) === currentProgress.currentTrack && parseInt(moduleId) === currentProgress.currentModule) {
        newCurrentModule = Math.min(currentProgress.currentModule + 1, track.modules.length)
      }
      
      updateProgress({
        completedModules: newCompletedModules,
        currentModule: newCurrentModule
      })
    }
    
    // Navigate to next module or track overview
    const nextModule = track.modules.find(m => m.id === parseInt(moduleId) + 1)
    if (nextModule) {
      navigate(`/track/${trackId}/module/${nextModule.id}`)
    } else {
      navigate(`/track/${trackId}`)
    }
  }

  const getInteractiveElementIcon = (type) => {
    switch (type) {
      case 'exercise': return PenTool
      case 'presentation': return Video
      case 'workshop': return Users
      case 'simulation': return Play
      case 'roadmap': return Target
      case 'analysis': return FileText
      default: return Lightbulb
    }
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/track/${trackId}`)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Module {moduleId}: {module.title}
              </h1>
              <p className="text-gray-600 mt-1">{module.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {module.duration}
                </Badge>
                <Badge variant="secondary">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {module.topics.length} topics
                </Badge>
                <Badge variant="secondary">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {module.interactiveElements.length} exercises
                </Badge>
              </div>
            </div>
          </div>
          {isModuleCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Learning Content</TabsTrigger>
              <TabsTrigger value="exercises">Interactive Exercises</TabsTrigger>
              <TabsTrigger value="notes">My Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-6">
              {/* Topics */}
              {module.topics.map((topic, index) => {
                const isCompleted = completedSections.has(index)
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={isCompleted ? 'bg-green-50 border-green-200' : ''}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                            Topic {index + 1}: {topic.split(':')[0]}
                          </CardTitle>
                          {isCompleted && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{topic.split(':')[1]}</p>
                        
                        {/* Simulated content */}
                        <div className="space-y-4 text-gray-600">
                          <p>
                            This section covers the fundamental concepts and practical applications 
                            related to {topic.split(':')[0].toLowerCase()}. You'll learn key 
                            strategies and best practices that are essential for success in AI 
                            solution design.
                          </p>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Key Learning Points:</h4>
                            <ul className="space-y-1 text-blue-800">
                              <li>• Understanding core concepts and terminology</li>
                              <li>• Practical application in IT channel context</li>
                              <li>• Best practices and common pitfalls to avoid</li>
                              <li>• Real-world examples and case studies</li>
                            </ul>
                          </div>
                        </div>
                        
                        {!isCompleted && (
                          <Button 
                            onClick={() => markSectionComplete(index)}
                            className="mt-4"
                          >
                            Mark as Complete
                            <CheckCircle className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </TabsContent>
            
            <TabsContent value="exercises" className="space-y-6">
              {/* Interactive Elements */}
              {module.interactiveElements.map((element, index) => {
                const sectionIndex = module.topics.length + index
                const isCompleted = completedSections.has(sectionIndex)
                const Icon = getInteractiveElementIcon(element.type)
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={isCompleted ? 'bg-green-50 border-green-200' : ''}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex items-center">
                            <Icon className="h-5 w-5 mr-2 text-purple-600" />
                            {element.title}
                          </CardTitle>
                          {isCompleted && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <CardDescription>{element.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Exercise Instructions:</h4>
                          <p className="text-purple-800">{element.description}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Response:
                          </label>
                          <Textarea
                            placeholder="Enter your response or notes for this exercise..."
                            value={exerciseResponses[`${index}`] || ''}
                            onChange={(e) => {
                              setExerciseResponses(prev => ({
                                ...prev,
                                [index]: e.target.value
                              }))
                              saveProgress()
                            }}
                            className="min-h-[100px]"
                          />
                        </div>
                        
                        {!isCompleted && (
                          <Button 
                            onClick={() => markSectionComplete(sectionIndex)}
                            className="mt-4"
                          >
                            Complete Exercise
                            <CheckCircle className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Module Notes
                  </CardTitle>
                  <CardDescription>
                    Keep track of your thoughts, insights, and key takeaways
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add your notes here..."
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value)
                      saveProgress()
                    }}
                    className="min-h-[300px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Module Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {track.modules.map((mod) => {
                const isCurrentModule = mod.id === parseInt(moduleId)
                const isModCompleted = currentProgress.completedModules.includes(`${trackId}-${mod.id}`)
                
                return (
                  <Button
                    key={mod.id}
                    variant={isCurrentModule ? "default" : "ghost"}
                    className={`w-full justify-start text-left h-auto p-3 ${
                      isCurrentModule ? 'bg-blue-600 text-white' : ''
                    }`}
                    onClick={() => navigate(`/track/${trackId}/module/${mod.id}`)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {isModCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                      )}
                      <div className="text-left">
                        <div className="font-medium">Module {mod.id}</div>
                        <div className="text-xs opacity-75">{mod.title}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sections Completed</span>
                  <span>{completedSections.size}/{totalSections}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Topics</span>
                  <span>{module.topics.filter((_, i) => completedSections.has(i)).length}/{module.topics.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Exercises</span>
                  <span>{module.interactiveElements.filter((_, i) => completedSections.has(module.topics.length + i)).length}/{module.interactiveElements.length}</span>
                </div>
              </div>

              {progress === 100 && !isModuleCompleted && (
                <Button onClick={completeModule} className="w-full">
                  Complete Module
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ModuleContent

