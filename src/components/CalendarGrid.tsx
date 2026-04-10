import { useState } from "react"
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  format,
  parseISO,
  isSameDay,
  isBefore,
  isAfter,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isValid
} from "date-fns"

export function CalendarGrid({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
}: {
  selectedDate: string
  onDateSelect: (date: string) => void
  minDate?: string
  maxDate?: string
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Start from the calendar's live date if it's in the future
    if (minDate) {
      const min = parseISO(minDate)
      const today = new Date()
      if (isAfter(min, today)) {
        return startOfMonth(min)
      }
    }
    const date = selectedDate ? parseISO(selectedDate) : new Date()
    return isValid(date) ? startOfMonth(date) : startOfMonth(new Date())
  })

  const formatDateToString = (date: Date) => {
    return format(date, "yyyy-MM-dd")
  }

  const isDateDisabled = (date: Date) => {
    const dateStr = formatDateToString(date)
    if (minDate && dateStr < minDate) return true
    if (maxDate && dateStr > maxDate) return true
    return false
  }

  const isDateSelected = (date: Date) => {
    return formatDateToString(date) === selectedDate
  }

  // Check if we can navigate to previous/next months
  const canGoToPrevMonth = () => {
    if (!minDate) return true
    const prevMonth = subMonths(currentMonth, 1)
    const lastDayOfPrevMonth = endOfMonth(prevMonth)
    return !isBefore(lastDayOfPrevMonth, parseISO(minDate))
  }

  const canGoToNextMonth = () => {
    if (!maxDate) return true
    const nextMonth = addMonths(currentMonth, 1)
    const firstDayOfNextMonth = startOfMonth(nextMonth)
    return !isAfter(firstDayOfNextMonth, parseISO(maxDate))
  }

  const goToPrevMonth = () => {
    if (canGoToPrevMonth()) {
      setCurrentMonth(subMonths(currentMonth, 1))
    }
  }

  const goToNextMonth = () => {
    if (canGoToNextMonth()) {
      setCurrentMonth(addMonths(currentMonth, 1))
    }
  }

  // Get all days to display in the calendar grid
  const days = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map(date => ({
      date,
      isCurrentMonth: format(date, "M") === format(currentMonth, "M")
    }))
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={!canGoToPrevMonth()}
          className={`p-2 rounded-lg transition-colors ${
            canGoToPrevMonth()
              ? 'hover:bg-[#F7F9FC] cursor-pointer'
              : 'opacity-30 cursor-not-allowed'
          }`}
          data-testid="prev-month"
        >
          <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-[#1A1A1A]">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          disabled={!canGoToNextMonth()}
          className={`p-2 rounded-lg transition-colors ${
            canGoToNextMonth()
              ? 'hover:bg-[#F7F9FC] cursor-pointer'
              : 'opacity-30 cursor-not-allowed'
          }`}
          data-testid="next-month"
        >
          <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-[#6B7280] py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days().map((day, index) => {
          const disabled = isDateDisabled(day.date)
          const selected = isDateSelected(day.date)
          const today = isSameDay(day.date, new Date())

          return (
            <button
              key={index}
              type="button"
              onClick={() => !disabled && onDateSelect(formatDateToString(day.date))}
              disabled={disabled}
              className={`
                w-10 h-10 rounded-lg text-sm font-medium transition-colors
                ${!day.isCurrentMonth ? 'text-[#9CA3AF]' : 'text-[#1A1A1A]'}
                ${selected
                  ? 'bg-[#0052FF] text-white hover:bg-[#0046CC]'
                  : today
                    ? 'bg-[#0052FF]/10 text-[#0052FF]'
                    : 'hover:bg-[#F7F9FC]'
                }
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
              data-testid={`calendar-day-${formatDateToString(day.date)}`}
            >
              {format(day.date, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}