/**
 * Converts a day number to its full name.
 * @param day - Day number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @returns The full day name or empty string if invalid
 */
export const getDayLabel = (day: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[day] || ""
}

/**
 * Generates an array of date objects for a calendar month view.
 * Includes days from previous and next months to fill a 6-week grid.
 * @param date - The date to generate the calendar for
 * @returns Array of date objects with date and isCurrentMonth properties
 */
export const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      })
    }

    return days
}

/**
 * Formats minutes since midnight to a 12-hour time string.
 * @param minutes - Minutes since midnight (0-1440)
 * @returns Formatted time string (e.g., "9:30 AM", "2:00 PM")
 */
export const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const h = hours % 12 || 12
    const period = hours >= 12 ? "PM" : "AM"
    return `${h}:${mins.toString().padStart(2, "0")} ${period}`
}

/**
 * Formats an hour (0-24) to a 12-hour time string.
 * @param hour - Hour in 24-hour format (0-24)
 * @returns Formatted time string (e.g., "12:00 AM", "3:00 PM")
 */
export const formatHour = (hour: number) => {
    if (hour === 0 || hour === 24) return "12:00 AM"
    if (hour === 12) return "12:00 PM"
    const h = hour > 12 ? hour - 12 : hour
    const period = hour >= 12 ? "PM" : "AM"
    return `${h}:00 ${period}`
}

/**
 * Formats a date string to a localized readable format.
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Mon, Jan 15, 2024") or "N/A" if empty
 */
export const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}