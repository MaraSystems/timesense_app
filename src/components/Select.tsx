import { forwardRef } from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent ${
            error
              ? "border-[#FF4D4F] focus:ring-[#FF4D4F]"
              : "border-[#E5EAF2]"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-sm text-[#FF4D4F]" data-testid={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"