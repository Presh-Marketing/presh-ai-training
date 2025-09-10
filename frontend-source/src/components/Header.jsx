import { useState } from 'react'
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import preshLogo from '../assets/presh_logo.png'

const Header = ({ user, sidebarOpen, setSidebarOpen, onLogout }) => {
  const [notifications] = useState([
    { id: 1, message: "New module available: AI Ethics and Governance", time: "2 hours ago" },
    { id: 2, message: "Certification test reminder: Track 1 due in 3 days", time: "1 day ago" }
  ])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <img 
              src={preshLogo} 
              alt="Presh.ai" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                AI Solution Designer Certification
              </h1>
              <p className="text-xs text-slate-500">Professional Development Platform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Progress Badge */}
          <Badge variant="secondary" className="bg-teal-100 text-teal-800 border-teal-200">
            Track {user.progress.currentTrack} • Module {user.progress.currentModule}
          </Badge>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-100">
                <Bell className="h-5 w-5 text-slate-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                  <span className="text-sm">{notification.message}</span>
                  <span className="text-xs text-slate-500 mt-1">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2 hover:bg-slate-100">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0) || 'M'}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header

