import { createContext, useContext, useState, type ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
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

const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Ahmad Rizky', email: 'user@demo.com', role: 'user' },
  { id: 'a1', name: 'Admin Prestigium', email: 'admin@demo.com', role: 'admin' },
]

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'registration', title: 'Registration Confirmed', body: 'Your registration for QA/QC Training has been confirmed.', time: '2 hours ago', read: false },
  { id: 'n2', type: 'reminder', title: 'Training Reminder', body: 'Project Quality Management Training starts in 3 days.', time: '1 day ago', read: false },
  { id: 'n3', type: 'certificate', title: 'Certificate Available', body: 'Your certificate for HSE Management Training is ready.', time: '3 days ago', read: true },
  { id: 'n4', type: 'attendance', title: 'Attendance Opened', body: 'Attendance for your Structural Analysis training is now open.', time: '5 days ago', read: true },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS)

  const login = async (email: string, _password: string): Promise<boolean> => {
    const found = DEMO_USERS.find((u) => u.email === email)
    if (found) {
      setUser(found)
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    const newUser: User = { id: `u${Date.now()}`, name, email, role: 'user' }
    setUser(newUser)
    return true
  }

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AuthContext.Provider value={{ user, login, logout, register, notifications, markRead, unreadCount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
