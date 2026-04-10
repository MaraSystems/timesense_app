import type { ReactNode, InputHTMLAttributes } from "react"

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label: string
  id: string
  error?: string
  icon?: ReactNode
  "data-testid"?: string
}

/**
 * Reusable input component with label and error state support.
 * @param label - Input label text
 * @param id - Input element ID (also used for label association)
 * @param error - Optional error message to display
 * @param icon - Optional icon to display on the left side
 * @param className - Additional CSS classes
 * @param testId - Data test ID for testing
 * @param props - Additional input HTML attributes
 */
export function Input({
  label,
  id,
  error,
  icon,
  className = "",
  "data-testid": testId,
  ...props
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-lg border ${
            error ? "border-[#FF4D4F]" : "border-[#E5EAF2]"
          } focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent bg-white ${className}`}
          data-testid={testId}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#FF4D4F]" data-testid={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}