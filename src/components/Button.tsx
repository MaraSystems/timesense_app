import type { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  isLoading?: boolean
  icon?: ReactNode
  "data-testid"?: string
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  icon,
  className = "",
  disabled,
  "data-testid": testId,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantStyles = {
    primary: "bg-[#0052FF] text-white hover:bg-[#0046DB] focus:ring-[#0052FF]",
    secondary: "bg-[#F3F4F6] text-[#1A1A1A] hover:bg-[#E5EAF2] focus:ring-[#A0AEC0]",
    outline: "border border-[#E5EAF2] bg-white text-[#1A1A1A] hover:bg-[#F7F9FC] focus:ring-[#0052FF]",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isLoading}
      data-testid={testId}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
      )}
    </button>
  )
}