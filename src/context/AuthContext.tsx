import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  wa_number?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  updatePassword: (password: string) => Promise<boolean>
  notifications: Notification[]
  markRead: (id: string) => void
  unreadCount: number
}

export interface Notification {
  id: string
  type: 'registration' | 'reminder' | 'attendance' | 'certificate' | 'update'
  title: string
  body: string
  time: string
  read: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Demo notifications (can be moved to DB later if needed)
const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'registration', title: 'Registration Confirmed', body: 'Your registration for QA/QC Training has been confirmed.', time: '2 hours ago', read: false },
  { id: 'n2', type: 'reminder', title: 'Training Reminder', body: 'Project Quality Management Training starts in 3 days.', time: '1 day ago', read: false },
  { id: 'n3', type: 'certificate', title: 'Certificate Available', body: 'Your certificate for HSE Management Training is ready.', time: '3 days ago', read: true },
  { id: 'n4', type: 'attendance', title: 'Attendance Opened', body: 'Attendance for your Structural Analysis training is now open.', time: '5 days ago', read: true },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS)

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await fetchProfile(session.user)
      }
      setLoading(false)
    }

    getSession()

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching profile for user ID:', supabaseUser.id)
      const { data, error } = await supabase
        .from('pa_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Error fetching profile from pa_profiles:', error)
        // Fallback user if profile fetch fails (allows app to work while debugging DB)
        setUser({
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          role: supabaseUser.user_metadata?.role || 'user'
        })
        return
      }

      if (data) {
        console.log('Profile found in DB:', data)
        setUser({
          id: data.id,
          name: data.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          role: data.role as 'user' | 'admin',
          avatar: data.avatar_url,
          wa_number: data.wa_number
        })
      }
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('Supabase Login error:', error.message)
        alert('Login failed: ' + error.message)
        return false
      }
      if (data.user) {
        console.log('Auth success, fetching profile...')
        await fetchProfile(data.user)
        return true
      }
      return false
    } catch (err: any) {
      console.error('Login method error:', err)
      return false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'user'
          }
        }
      })

      if (error) {
        console.error('Supabase Registration error:', error.message)
        alert('Registration failed: ' + error.message)
        return false
      }

      if (data.user) {
        console.log('Registration success.')
        if (data.session) {
          console.log('Session created immediately. Fetching profile...')
          await fetchProfile(data.user)
        } else {
          console.log('No session returned. Email confirmation might be required.')
          alert('Registration successful! Please check your email for a confirmation link before logging in.')
        }
        return true
      }
      return false
    } catch (err: any) {
      console.error('Register method error:', err)
      return false
    }
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?view=reset`,
    })
    return !error
  }

  const updatePassword = async (password: string): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({ password })
    return !error
  }

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      forgotPassword,
      updatePassword,
      notifications,
      markRead,
      unreadCount
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
