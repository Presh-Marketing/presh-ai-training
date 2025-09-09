import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Calendar,
  CheckCircle,
  Star,
  BookOpen
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const ProgressTracker = ({ user, trainingData }) => {
  // Calculate overall statistics
  const totalModules = trainingData.tracks.reduce((sum, track) => sum + track.modules.length, 0)
  const completedModules = user.progress.completedModules.length
  const overallProgress = (completedModules / totalModules) * 100

  // Track progress data for charts
  const trackProgressData = trainingData.tracks.map(track => {
    const completedInTrack = track.modules.filter(module => 
      user.progress.completedModules.includes(`${track.id}-${module.id}`)
    ).length
    const progressPercent = (completedInTrack / track.modules.length) * 100
    
    return {
      name: `Track ${track.id}`,
      title: track.title,
      completed: completedInTrack,
      total: track.modules.length,
      progress: progressPercent,
      certified: user.progress.certifications.includes(track.id)
    }
  })

  // Time investment calculation (simulated)
  const weeklyHours = 12 // Average hours per week
  const weeksActive = 4 // Simulated weeks active
  const totalHoursInvested = weeklyHours * weeksActive

  // Learning velocity (modules per week)
  const learningVelocity = completedModules / Math.max(weeksActive, 1)

  // Certification progress
  const certificationProgress = (user.progress.certifications.length / trainingData.tracks.length) * 100

  // Pie chart data for module completion
  const moduleCompletionData = [
    { name: 'Completed', value: completedModules, color: '#10b981' },
    { name: 'Remaining', value: totalModules - completedModules, color: '#e5e7eb' }
  ]

  // Recent activity (simulated)
  const recentActivity = [
    { date: '2024-09-09', activity: 'Completed Module 1: AI Business Fundamentals', type: 'module' },
    { date: '2024-09-08', activity: 'Started Track 1: AI Foundations', type: 'track' },
    { date: '2024-09-07', activity: 'Joined AI Solution Designer Program', type: 'enrollment' }
  ]

  // Upcoming milestones
  const upcomingMilestones = [
    { date: '2024-09-15', milestone: 'Complete Track 1 Certification', type: 'certification' },
    { date: '2024-09-30', milestone: 'Begin Track 2: Technical Competency', type: 'track' },
    { date: '2024-12-15', milestone: 'Complete Full Program', type: 'graduation' }
  ]

  const stats = [
    {
      title: 'Overall Progress',
      value: `${Math.round(overallProgress)}%`,
      description: `${completedModules} of ${totalModules} modules`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Certifications Earned',
      value: user.progress.certifications.length,
      description: `${user.progress.certifications.length} of ${trainingData.tracks.length} tracks`,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Time Invested',
      value: `${totalHoursInvested}h`,
      description: `${weeklyHours}h per week average`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Learning Velocity',
      value: `${learningVelocity.toFixed(1)}`,
      description: 'modules per week',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Progress Tracker</h1>
            <p className="text-indigo-100 text-lg">
              Track your journey to becoming an AI Solution Designer
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-2">{Math.round(overallProgress)}%</div>
            <div className="text-indigo-100">Complete</div>
          </div>
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
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Track Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Track Progress</span>
              </CardTitle>
              <CardDescription>
                Your progress across all training tracks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trackProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'progress' ? `${value.toFixed(1)}%` : value,
                      name === 'progress' ? 'Progress' : 'Modules'
                    ]}
                  />
                  <Bar dataKey="progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Module Completion Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Module Completion</span>
              </CardTitle>
              <CardDescription>
                Overall module completion status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={moduleCompletionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {moduleCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Completed ({completedModules})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Remaining ({totalModules - completedModules})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Your latest learning activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'module' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'track' && <Target className="h-4 w-4 text-green-600" />}
                      {activity.type === 'enrollment' && <Star className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span>Upcoming Milestones</span>
              </CardTitle>
              <CardDescription>
                Key dates and achievements ahead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {milestone.type === 'certification' && <Award className="h-4 w-4 text-yellow-600" />}
                      {milestone.type === 'track' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      {milestone.type === 'graduation' && <Star className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{milestone.milestone}</p>
                      <p className="text-xs text-gray-500 mt-1">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Track Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <span>Detailed Track Breakdown</span>
            </CardTitle>
            <CardDescription>
              Comprehensive view of your progress in each track
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trackProgressData.map((track, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                        trainingData.tracks[index].color
                      } flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{track.title}</h4>
                        <p className="text-sm text-gray-600">
                          {track.completed} of {track.total} modules completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{Math.round(track.progress)}%</span>
                      {track.certified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          Certified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={track.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ProgressTracker

