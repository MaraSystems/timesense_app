import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../auth/AuthContext"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Input } from "../components/Input"
import { PasswordInput } from "../components/PasswordInput"
import { Button } from "../components/Button"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)

    try {
      await login(email, password)
      toast.success("Welcome back!")
      navigate("/")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to login"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 flex items-center justify-center px-4 py-12 mt-16">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-lg bg-[#0052FF] flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Welcome to TimeSense</h1>
              <p className="text-[#6B7280] mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
                data-testid="email-input"
              />

              <PasswordInput
                id="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
                data-testid="password-input"
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                data-testid="login-button"
              >
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-[#6B7280] mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0052FF] hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}