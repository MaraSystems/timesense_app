import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../auth/AuthContext"
import { Input } from "../components/Input"
import { PasswordInput } from "../components/PasswordInput"
import { Button } from "../components/Button"

export function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)

    try {
      await register(email, password)
      toast.success("Account created successfully! Please sign in.")
      navigate("/login")
    } catch (err) {
      if (err instanceof Error && err.message === "REGISTRATION_SUCCESS") {
        toast.success("Account created successfully! Please sign in.")
        navigate("/login")
      } else {
        const message = err instanceof Error ? err.message : "Failed to create account"
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-[#0052FF] flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Account</h1>
            <p className="text-[#6B7280] mt-2">Get started with TimeSense</p>
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
              placeholder="At least 8 characters"
              data-testid="password-input"
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              data-testid="confirm-password-input"
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              data-testid="register-button"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0052FF] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}