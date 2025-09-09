import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  AlertTriangle,
  Trophy,
  RotateCcw,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const CertificationTest = ({ trainingData, currentProgress, updateProgress }) => {
  const { trackId } = useParams()
  const navigate = useNavigate()
  
  const track = trainingData.tracks.find(t => t.id === parseInt(trackId))
  const testData = trainingData.certificationTests[parseInt(trackId)]
  
  const [testState, setTestState] = useState('overview') // overview, taking, completed
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [testResults, setTestResults] = useState(null)

  // Sample questions for demonstration
  const sampleQuestions = {
    1: [
      {
        id: 1,
        question: "What is the primary difference between AI, Machine Learning, and Deep Learning?",
        options: [
          "AI is a subset of ML, which is a subset of Deep Learning",
          "ML is a subset of AI, and Deep Learning is a subset of ML",
          "They are all the same thing with different names",
          "Deep Learning came first, then ML, then AI"
        ],
        correct: 1,
        section: "AI Concepts and Terminology"
      },
      {
        id: 2,
        question: "According to Presh.ai's AI policy, what is the company's approach to AI implementation?",
        options: [
          "AI should replace human workers to increase efficiency",
          "AI as an Aid, Not an Agent - augmenting human capabilities",
          "AI should only be used for data analysis",
          "AI implementation should be fully automated"
        ],
        correct: 1,
        section: "Ethics and Governance"
      },
      {
        id: 3,
        question: "Which of the following is a key AI use case for MSPs (Managed Service Providers)?",
        options: [
          "Social media marketing automation",
          "Predictive maintenance and service delivery automation",
          "Video game development",
          "Music composition"
        ],
        correct: 1,
        section: "IT Channel Applications"
      }
    ],
    2: [
      {
        id: 1,
        question: "What are the key factors to consider when assessing data quality for an AI project?",
        options: [
          "Only the volume of data matters",
          "Completeness, accuracy, consistency, and relevance",
          "Data should always be stored in the cloud",
          "The age of the data is the only important factor"
        ],
        correct: 1,
        section: "Data Fundamentals"
      },
      {
        id: 2,
        question: "Which Azure AI service would be most appropriate for building a customer service chatbot?",
        options: [
          "Azure Machine Learning Studio",
          "Azure Cognitive Services - Language Understanding (LUIS)",
          "Azure Data Factory",
          "Azure SQL Database"
        ],
        correct: 1,
        section: "Platform Knowledge"
      }
    ]
  }

  const questions = sampleQuestions[parseInt(trackId)] || []

  useEffect(() => {
    if (testState === 'taking' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [testState, timeRemaining])

  if (!track || !testData) {
    return <div>Test not found</div>
  }

  const isEligible = () => {
    const completedModules = track.modules.filter(module => 
      currentProgress.completedModules.includes(`${track.id}-${module.id}`)
    ).length
    return completedModules === track.modules.length
  }

  const startTest = () => {
    setTestState('taking')
    setCurrentQuestion(0)
    setAnswers({})
    setTimeRemaining(testData.totalTime * 60) // Convert minutes to seconds
    setTestResults(null)
  }

  const submitTest = () => {
    // Calculate score
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct).length
    const score = (correctAnswers / questions.length) * 100
    const passed = score >= testData.passingScore

    const results = {
      score,
      passed,
      correctAnswers,
      totalQuestions: questions.length,
      timeUsed: testData.totalTime * 60 - timeRemaining,
      sectionScores: testData.sections.map(section => ({
        title: section.title,
        score: Math.floor(Math.random() * 20) + 80 // Simulated section scores
      }))
    }

    setTestResults(results)
    setTestState('completed')

    // Update progress if passed
    if (passed && !currentProgress.certifications.includes(parseInt(trackId))) {
      const newCertifications = [...currentProgress.certifications, parseInt(trackId)]
      let newCurrentTrack = currentProgress.currentTrack
      
      // Unlock next track if this was the current track
      if (parseInt(trackId) === currentProgress.currentTrack) {
        newCurrentTrack = Math.min(currentProgress.currentTrack + 1, trainingData.tracks.length)
      }
      
      updateProgress({
        certifications: newCertifications,
        currentTrack: newCurrentTrack,
        currentModule: 1
      })
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (testState === 'overview') {
    return (
      <div className="space-y-8">
        {/* Test Overview Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${track.color} rounded-xl p-8 text-white`}
        >
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/track/${trackId}`)}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">{testData.title}</h1>
                <p className="text-white/80">Track {trackId} Certification</p>
              </div>
            </div>
          </div>
          <p className="text-lg text-white/90">{testData.description}</p>
        </motion.div>

        {/* Eligibility Check */}
        {!isEligible() && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You must complete all modules in this track before taking the certification test.
            </AlertDescription>
          </Alert>
        )}

        {/* Test Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{testData.totalQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Limit</p>
                  <p className="text-2xl font-bold text-gray-900">{testData.totalTime} min</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Passing Score</p>
                  <p className="text-2xl font-bold text-gray-900">{testData.passingScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Test Sections</CardTitle>
            <CardDescription>
              The certification test is divided into the following sections:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testData.sections.map((section, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    {section.questions > 0 && (
                      <p className="text-sm text-gray-600">
                        {section.questions} questions • {section.timeLimit} minutes
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {section.type || 'Multiple Choice'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Start Test Button */}
        <div className="text-center">
          <Button
            onClick={startTest}
            disabled={!isEligible()}
            size="lg"
            className="px-8 py-3"
          >
            {isEligible() ? (
              <>
                Start Certification Test
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Complete All Modules First
                <AlertTriangle className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (testState === 'taking') {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="space-y-6">
        {/* Test Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{testData.title}</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{formatTime(timeRemaining)}</div>
                <p className="text-sm text-gray-600">Time Remaining</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{question.section}</Badge>
              <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
            
            <RadioGroup
              value={answers[question.id]?.toString() || ''}
              onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: parseInt(value) }))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={submitTest}>
                  Submit Test
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!answers[question.id]}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (testState === 'completed') {
    return (
      <div className="space-y-8">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${
            testResults.passed ? 'from-green-600 to-emerald-600' : 'from-red-600 to-pink-600'
          } rounded-xl p-8 text-white text-center`}
        >
          {testResults.passed ? (
            <Trophy className="h-16 w-16 mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold mb-2">
            {testResults.passed ? 'Congratulations!' : 'Test Not Passed'}
          </h1>
          <p className="text-xl text-white/90 mb-4">
            You scored {Math.round(testResults.score)}%
          </p>
          <p className="text-white/80">
            {testResults.passed 
              ? `You have earned the ${testData.title}!`
              : `You need ${testData.passingScore}% to pass. You can retake the test.`
            }
          </p>
        </motion.div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Score:</span>
                <span className="font-bold">{Math.round(testResults.score)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Correct Answers:</span>
                <span>{testResults.correctAnswers} / {testResults.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Used:</span>
                <span>{formatTime(testResults.timeUsed)}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={testResults.passed ? "default" : "destructive"}>
                  {testResults.passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {testResults.sectionScores.map((section, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{section.title}</span>
                    <span>{section.score}%</span>
                  </div>
                  <Progress value={section.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/track/${trackId}`)}
          >
            Back to Track
          </Button>
          {!testResults.passed && (
            <Button onClick={() => setTestState('overview')}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Test
            </Button>
          )}
          {testResults.passed && (
            <Button onClick={() => navigate('/dashboard')}>
              Continue Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default CertificationTest

