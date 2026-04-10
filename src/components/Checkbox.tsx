import type { InputHTMLAttributes } from "react"
import { HiCheck } from "react-icons/hi"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  id: string
  error?: string
  "data-testid"?: string
}

/**
 * Single checkbox component with custom styling.
 * @param label - Checkbox label text
 * @param id - Checkbox element ID
 * @param error - Optional error message to display
 * @param checked - Whether checkbox is checked
 * @param onChange - Change handler
 * @param className - Additional CSS classes
 * @param testId - Data test ID for testing
 * @param props - Additional input HTML attributes
 */
export function Checkbox({
  label,
  id,
  error,
  checked,
  onChange,
  className = "",
  "data-testid": testId,
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          data-testid={testId}
          {...props}
        />
        <div
          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
            checked
              ? "bg-[#0052FF] border-[#0052FF]"
              : "bg-white border-[#E5EAF2] hover:border-[#0052FF]"
          } ${error ? "border-[#FF4D4F]" : ""} ${className}`}
          onClick={() => onChange?.({ target: { checked: !checked } } as React.ChangeEvent<HTMLInputElement>)}
        >
          {checked && <HiCheck className="w-3 h-3 text-white" />}
        </div>
      </div>
      <label
        htmlFor={id}
        className="text-sm text-[#1A1A1A] cursor-pointer select-none"
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-sm text-[#FF4D4F]" data-testid={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

interface CheckboxGroupProps {
  label: string
  options: { value: number; label: string }[]
  selected: number[]
  onChange: (selected: number[]) => void
  error?: string
  "data-testid"?: string
}

/**
 * Group of checkboxes for multi-select functionality.
 * @param label - Group label text
 * @param options - Array of checkbox options with value and label
 * @param selected - Array of currently selected values
 * @param onChange - Handler called with updated selected values
 * @param error - Optional error message to display
 * @param testId - Data test ID for testing
 */
export function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  error,
  "data-testid": testId,
}: CheckboxGroupProps) {
  /**
   * Toggles a value in the selection.
   * @param value - The value to toggle
   */
  const handleToggle = (value: number) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div data-testid={testId}>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            id={`checkbox-${option.value}`}
            label={option.label}
            checked={selected.includes(option.value)}
            onChange={() => handleToggle(option.value)}
            data-testid={`checkbox-${option.value}`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#FF4D4F]" data-testid={`${testId}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}