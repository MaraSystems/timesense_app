import { useState, type InputHTMLAttributes } from "react"
import { HiEye, HiEyeSlash } from "react-icons/hi2"
import { HiLockClosed } from "react-icons/hi2"

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "prefix"> {
  label: string
  id: string
  error?: string
  "data-testid"?: string
}

/**
 * Password input component with visibility toggle.
 * Displays a lock icon on the left and an eye icon to toggle password visibility.
 * @param label - Input label text
 * @param id - Input element ID
 * @param error - Optional error message to display
 * @param className - Additional CSS classes
 * @param testId - Data test ID for testing
 * @param props - Additional input HTML attributes
 */
export function PasswordInput({
  label,
  id,
  error,
  className = "",
  "data-testid": testId,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HiLockClosed className="h-5 w-5 text-[#A0AEC0]" />
        </div>
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
            error ? "border-[#FF4D4F]" : "border-[#E5EAF2]"
          } focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent bg-white ${className}`}
          data-testid={testId}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          data-testid={`toggle-${testId}-visibility`}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <HiEyeSlash className="h-5 w-5 text-[#A0AEC0]" />
          ) : (
            <HiEye className="h-5 w-5 text-[#A0AEC0]" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#FF4D4F]" data-testid={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}