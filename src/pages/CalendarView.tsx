import { useEffect, useState, type SetStateAction } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { HiCalendar, HiClock, HiArrowLeft, HiPencil, HiTrash, HiShare, HiPlus, HiOutlineCalendar, HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { toast } from "react-toastify"
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths, isToday } from "date-fns"
import { useAuth } from "../auth"
import { getCalendar, deleteCalendar, getCalendarSlots } from "../services/calendar.service"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/Button"
import { formatTime, getDayLabel } from "../utils/calendar"
import type { CalendarDisplay, CalendarSlotDisplay } from "../models/calendar"
import { handleShare } from "../utils/share"
import { Delete } from "../components/Delete"

export function CalendarView() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [calendar, setCalendar] = useState<CalendarDisplay | null>(null)
  const [slots, setSlots] = useState<CalendarSlotDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)

  const isOwner = calendar && user && calendar.ownerId === user.id

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await getCalendar(id)
        if (response.success && response.data) {
          setCalendar(response.data)

          // Set initial month to the calendar's liveAt month
          const initialMonth = startOfMonth(parseISO(response.data.liveAt))
          setCurrentMonth(initialMonth)
        } else {
          const message = response.message || "Failed to load calendar"
          setError(message)
          toast.error(message)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load calendar"
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendar()
  }, [id])

  // Fetch slots when month changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!id || !currentMonth || !calendar) return

      try {
        setIsLoadingSlots(true)
        const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd")
        const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd")

        const slotsResponse = await getCalendarSlots(id, {
          liveAt: monthStart,
          expireAt: monthEnd,
        })

        if (slotsResponse.success && slotsResponse.data) {
          setSlots(slotsResponse.data.data)
          setHasNextPage(slotsResponse.data.next)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load slots"
        toast.error(message)
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [id, currentMonth, calendar])

  const goToPreviousMonth = () => {
    if (!currentMonth || !calendar) return
    const prevMonth = subMonths(currentMonth, 1)
    // Don't go before the calendar's liveAt month
    const liveAtMonth = startOfMonth(parseISO(calendar.liveAt))
    if (prevMonth >= liveAtMonth) {
      setCurrentMonth(prevMonth)
    }
  }

  const goToNextMonth = () => {
    if (!currentMonth || !calendar) return
    const nextMonth = addMonths(currentMonth, 1)
    // Don't go after the calendar's expireAt month
    const expireAtMonth = startOfMonth(parseISO(calendar.expireAt))
    if (nextMonth <= expireAtMonth || hasNextPage) {
      setCurrentMonth(nextMonth)
    }
  }

  const canGoToPreviousMonth = () => {
    if (!currentMonth || !calendar) return false
    const liveAtMonth = startOfMonth(parseISO(calendar.liveAt))
    return currentMonth > liveAtMonth
  }

  const canGoToNextMonth = () => {
    if (!currentMonth || !calendar) return false
    const expireAtMonth = startOfMonth(parseISO(calendar.expireAt))
    return currentMonth < expireAtMonth || hasNextPage
  }

  // Group slots by date
  const slotsByDate = slots.reduce<Record<string, CalendarSlotDisplay[]>>((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = []
    }
    acc[slot.date].push(slot)
    return acc
  }, {})

  // Sort dates
  const sortedDates = Object.keys(slotsByDate).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  )

  // Get slot style based on date and booking status
  const getSlotStyle = (date: string, booked: boolean) => {
    const slotDate = parseISO(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const isPastDate = slotDate < today
    const isTodayDate = isToday(slotDate)

    if (isPastDate) {
      return booked
        ? "bg-[#9CA3AF]/20 text-[#9CA3AF] line-through"
        : "bg-[#F3F4F6] text-[#9CA3AF] line-through"
    }

    if (isTodayDate) {
      return booked
        ? "bg-[#059669] text-white"
        : "bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/30"
    }

    // Future dates
    return booked
      ? "bg-[#10B981]/10 text-[#10B981]"
      : "bg-white text-[#6B7280]"
  }

  const handleDelete = async (setIsDeleting: (flag: SetStateAction<boolean>) => void) => {
    if (!id) return

    setIsDeleting(true)
    try {
      const response = await deleteCalendar(id)
      if (response.success) {
        toast.success("Calendar deleted successfully")
        navigate("/calendars")
      } else {
        toast.error(response.message || "Failed to delete calendar")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete calendar")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 mt-16 w-full">
        <Link
          to="/calendars"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#0052FF] transition-colors mb-6"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span>Back to Calendars</span>
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-8 text-center">
            <p className="text-[#FF4D4F]">{error}</p>
            <Link to="/calendars" className="mt-4 inline-block">
              <Button>Back to Calendars</Button>
            </Link>
          </div>
        ) : calendar ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0052FF] to-[#0066FF] px-8 py-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <HiCalendar className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{calendar.title}</h1>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {/* Book button - available for everyone */}
                  <Link to={`/appointments/new?calendarId=${id}`}>
                    <Button
                      variant="outline"
                      className="!bg-white !text-[#0052FF] border-white hover:!bg-white/90"
                      data-testid="book-appointment-button"
                    >
                      <HiPlus className="w-5 h-5 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>

                  {/* Owner-only actions */}
                  {isOwner && (
                    <>
                      <Link to={`/calendars/${id}/appointments`}>
                        <Button
                          variant="outline"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                          data-testid="view-appointments-button"
                        >
                          <HiOutlineCalendar className="w-5 h-5 mr-2" />
                          View Appointments
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                        onClick={() => {
                          const url = id ? `appointments/new?calendarId=${id}` : ''
                          handleShare(url)
                        }}
                        data-testid="share-button"
                      >
                        <HiShare className="w-5 h-5 mr-2" />
                        Share
                      </Button>
                      <Link to={`/calendars/${id}/edit`}>
                        <Button
                          variant="outline"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                          data-testid="edit-button"
                        >
                          <HiPencil className="w-5 h-5 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-red-500/80"
                        onClick={() => setShowDeleteConfirm(true)}
                        data-testid="delete-button"
                      >
                        <HiTrash className="w-5 h-5 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-8 space-y-8">
              {/* Schedule Info */}
              <div className="bg-[#F7F9FC] rounded-xl p-6">
                <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-4">
                  Schedule
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0052FF]/10 flex items-center justify-center">
                      <HiCalendar className="w-5 h-5 text-[#0052FF]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Active Period</p>
                      <p className="text-[#1A1A1A] font-medium">
                        {format(parseISO(calendar.liveAt), "MMM d, yyyy")} — {format(parseISO(calendar.expireAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0052FF]/10 flex items-center justify-center">
                      <HiClock className="w-5 h-5 text-[#0052FF]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Daily Hours</p>
                      <p className="text-[#1A1A1A] font-medium">
                        {formatTime(calendar.startTime)} — {formatTime(calendar.stopTime)}
                        <span className="text-[#6B7280] font-normal ml-2">({calendar.slotDuration} min slots)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div>
                <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-4">
                  Working Days
                </h2>
                <div className="flex flex-wrap gap-3">
                  {calendar.weekDays.values.sort((a, b) => a - b).map((day) => (
                    <span
                      key={day}
                      className="bg-[#0052FF]/10 text-[#0052FF] px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {getDayLabel(day)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Calendar Slots */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide">
                    Available Slots
                  </h2>
                  {currentMonth && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPreviousMonth}
                        disabled={!canGoToPreviousMonth()}
                        className="p-1.5 rounded-lg border border-[#E5EAF2] hover:bg-[#F7F9FC] disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous month"
                      >
                        <HiChevronLeft className="w-5 h-5 text-[#6B7280]" />
                      </button>
                      <span className="text-sm font-medium text-[#1A1A1A] min-w-[120px] text-center">
                        {format(currentMonth, "MMMM yyyy")}
                      </span>
                      <button
                        onClick={goToNextMonth}
                        disabled={!canGoToNextMonth()}
                        className="p-1.5 rounded-lg border border-[#E5EAF2] hover:bg-[#F7F9FC] disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next month"
                      >
                        <HiChevronRight className="w-5 h-5 text-[#6B7280]" />
                      </button>
                    </div>
                  )}
                </div>
                {isLoadingSlots ? (
                  <div className="text-center py-8 text-[#6B7280]">Loading slots...</div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-8 text-[#6B7280]">No slots available for this month</div>
                ) : (
                  <div className="bg-[#F7F9FC] rounded-xl p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {sortedDates.map((date) => {
                        const slotDate = parseISO(date)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const isPastDate = slotDate < today
                        const isTodayDate = isToday(slotDate)

                        return (
                          <div key={date}>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`text-sm font-medium ${
                                isPastDate
                                  ? "text-[#9CA3AF]"
                                  : isTodayDate
                                    ? "text-[#0052FF]"
                                    : "text-[#1A1A1A]"
                              }`}>
                                {format(slotDate, "EEEE, MMMM d, yyyy")}
                              </h3>
                              {isTodayDate && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-[#0052FF]/10 text-[#0052FF] rounded">
                                  Today
                                </span>
                              )}
                              {isPastDate && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-[#9CA3AF]/10 text-[#9CA3AF] rounded">
                                  Past
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {slotsByDate[date]
                                .sort((a, b) => a.startTime - b.startTime)
                                .map((slot, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getSlotStyle(date, slot.booked)}`}
                                  >
                                    {formatTime(slot.startTime)} - {formatTime(slot.stopTime)}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-[#E5EAF2]">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm text-[#6B7280]">Created</span>
                    <p className="text-[#1A1A1A] font-medium mt-1">
                      {format(parseISO(calendar.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-[#6B7280]">Last Updated</span>
                    <p className="text-[#1A1A1A] font-medium mt-1">
                      {format(parseISO(calendar.updatedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-8 text-center">
            <p className="text-[#6B7280]">Calendar not found</p>
          </div>
        )}
      </main>
      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && <Delete title={calendar?.title} handleDelete={handleDelete} setShowDeleteConfirm={setShowDeleteConfirm}/>}
    </div>
  )
}