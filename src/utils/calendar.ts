export const getDayLabel = (day: number) => {
    const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return days[day] || ""
}

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

export const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const h = hours % 12 || 12
    const period = hours >= 12 ? "PM" : "AM"
    return `${h}:${mins.toString().padStart(2, "0")} ${period}`
}

export const formatHour = (hour: number) => {
    if (hour === 0 || hour === 24) return "12:00 AM"
    if (hour === 12) return "12:00 PM"
    const h = hour > 12 ? hour - 12 : hour
    const period = hour >= 12 ? "PM" : "AM"
    return `${h}:00 ${period}`
}

export const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}
