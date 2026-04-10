import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { login as loginService, createUser } from '../services/user.service'
import type { UserDisplay } from '../models/user'

/**
 * Authentication context type definition.
 */
interface AuthContextType {
  user: UserDisplay | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

/**
 * Provider component that manages authentication state.
 * Restores user session from localStorage on mount and handles login/logout events.
 * @param children - Child components to wrap with auth context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDisplay | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    /**
     * Restores user session from localStorage on initial load.
     */
    const loadUser = async () => {
      // Try to restore user from localStorage
      const storedUser = localStorage.getItem(USER_KEY)
      const token = localStorage.getItem(AUTH_TOKEN_KEY)

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          localStorage.removeItem(USER_KEY)
          localStorage.removeItem(AUTH_TOKEN_KEY)
        }
      }
      setIsLoading(false)
    }

    loadUser()

    /**
     * Handles logout events dispatched by the API interceptor.
     */
    const handleLogout = () => {
      setUser(null)
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  /**
   * Authenticates a user with email and password.
   * @param email - User's email address
   * @param password - User's password
   * @throws Error if login fails
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await loginService({email, password})
      if (response.success && response.data) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.accessToken)
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
        setUser(response.data.user)
      } else {
        throw new Error(response.message || 'Failed to login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Creates a new user account.
   * @param email - User's email address
   * @param password - User's password
   * @throws Error with message 'REGISTRATION_SUCCESS' on successful registration
   */
  const register = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await createUser(email, password)
      if (response.success && response.data) {
        // After registration, redirect to login
        // The user will need to login to get an access token
        throw new Error('REGISTRATION_SUCCESS')
      } else {
        throw new Error(response.message || 'Failed to create account')
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Clears the user session from localStorage and state.
   */
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access authentication context.
 * Must be used within an AuthProvider.
 * @returns Authentication context with user state and auth methods
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}