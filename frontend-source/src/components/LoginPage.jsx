import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Shield, Users, BookOpen, Award } from 'lucide-react'
import preshLogo from '../assets/presh_logo.png'

const LoginPage = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for error parameters in URL
    const urlParams = new URLSearchParams(window.location.search)
    const errorType = urlParams.get('error')
    const domain = urlParams.get('domain')
    
    if (errorType === 'unauthorized_domain') {
      setError(`Access restricted to ${domain} email addresses only.`)
    } else if (errorType === 'auth_failed') {
      setError('Authentication failed. Please try again.')
    } else if (errorType === 'invalid_state') {
      setError('Security validation failed. Please try again.')
    }
  }, [])

  const handleGoogleLogin = () => {
    setLoading(true)
    setError('')
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={preshLogo} 
              alt="Presh.ai" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Solution Designer Certification
          </h1>
          <p className="text-slate-300">
            Professional Development Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-slate-800">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">
              Sign in with your presh.ai account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-slate-500">
                <Shield className="inline w-4 h-4 mr-1" />
                Restricted to @presh.ai accounts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-center space-x-6 text-white">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <span className="text-sm">19 Modules</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-teal-400" />
                <span className="text-sm">4 Certifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-teal-400" />
                <span className="text-sm">Team Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 Presh Marketing Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

