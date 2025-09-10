import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Target, 
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  Play,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const Dashboard = ({ user, trainingData, updateProgress }) => {
  const currentTrack = trainingData.tracks.find(track => track.id === user.progress.currentTrack)
  const currentModule = currentTrack?.modules.find(module => module.id === user.progress.currentModule)
  
  // Calculate overall progress
  const totalModules = trainingData.tracks.reduce((sum, track) => sum + track.modules.length, 0)
  const completedModules = user.progress.completedModules.length
  const overallProgress = (completedModules / totalModules) * 100

  // Get next upcoming items
  const upcomingItems = [
    {
      type: 'module',
      title: currentModule?.title || 'Complete current track',
      description: currentModule?.description || 'Finish all modules in current track',
      dueDate: 'This week',
      priority: 'high'
    },
    {
      type: 'certification',
      title: `${currentTrack?.certification} Test`,
      description: 'Complete certification test for current track',
      dueDate: 'End of track',
      priority: 'medium'
    }
  ]

  // Recent achievements
  const recentAchievements = [
    {
      title: 'First Module Completed',
      description: 'Completed your first training module',
      date: '2 days ago',
      icon: BookOpen
    },
    {
      title: 'Week 1 Milestone',
      description: 'Successfully completed first week of training',
      date: '1 week ago',
      icon: Target
    }
  ]

  const stats = [
    {
      title: 'Overall Progress',
      value: `${Math.round(overallProgress)}%`,
      description: `${completedModules} of ${totalModules} modules completed`,
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Current Track',
      value: `Track ${user.progress.currentTrack}`,
      description: currentTrack?.title || 'Not started',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: 'Certifications',
      value: user.progress.certifications.length,
      description: `${user.progress.certifications.length} of 4 earned`,
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      title: 'Time Investment',
      value: '8-15h',
      description: 'Hours per week recommended',
      icon: Clock,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-blue-100 text-lg mb-4">
              Continue your journey to becoming an AI Solution Designer
            </p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {currentTrack?.title}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Module {user.progress.currentModule}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-2">{Math.round(overallProgress)}%</div>
            <div className="text-blue-100">Complete</div>
          </div>
        </div>
        
        <div className="mt-6">
          <Progress value={overallProgress} className="h-2 bg-white/20" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-blue-600" />
                <span>Continue Learning</span>
              </CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentModule ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {currentModule.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {currentModule.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{currentModule.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{currentModule.topics.length} topics</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/track/${currentTrack.id}/module/${currentModule.id}`}>
                    <Button className="w-full mt-4">
                      Continue Module
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Track Complete!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Ready for certification test
                  </p>
                  <Link to={`/certification/${currentTrack.id}`}>
                    <Button>
                      Take Certification Test
                      <Award className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Upcoming</span>
              </CardTitle>
              <CardDescription>
                Your next learning milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.priority === 'high' ? 'bg-red-500' : 
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{item.dueDate}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Track Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span>Training Tracks Overview</span>
            </CardTitle>
            <CardDescription>
              Your complete learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trainingData.tracks.map((track) => {
                const completedModules = track.modules.filter(module => 
                  user.progress.completedModules.includes(`${track.id}-${module.id}`)
                ).length
                const trackProgress = (completedModules / track.modules.length) * 100
                const isCertified = user.progress.certifications.includes(track.id)
                const isAccessible = track.id <= user.progress.currentTrack
                
                return (
                  <Link
                    key={track.id}
                    to={isAccessible ? `/track/${track.id}` : '#'}
                    className={`block ${!isAccessible ? 'pointer-events-none' : ''}`}
                  >
                    <div className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      isAccessible ? 'border-gray-200 hover:border-blue-300' : 'border-gray-100 opacity-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${track.color} flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">{track.id}</span>
                        </div>
                        {isCertified && (
                          <Star className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{track.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{track.duration}</p>
                      <Progress value={trackProgress} className="h-2 mb-2" />
                      <p className="text-xs text-gray-500">
                        {completedModules} of {track.modules.length} modules
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Recent Achievements</span>
            </CardTitle>
            <CardDescription>
              Celebrate your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Icon className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{achievement.date}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard

