import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { HiArrowLeft, HiClock, HiCalendar, HiPencil, HiExclamation, HiTrash, HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { toast } from "react-toastify"
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths, isToday } from "date-fns"
import { useAuth } from "../auth"
import { getAppointment, deleteAppointment, getAppointmentSlots } from "../services/appointment.service"
import { getCalendar } from "../services/calendar.service"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/Button"
import { formatTime, getDayLabel } from "../utils/calendar"
import { RECURRENCE_OPTIONS, type SlotDisplay } from "../models/appointment"
import type { AppointmentDisplay } from "../models/appointment"
import type { CalendarDisplay } from "../models/calendar"
import { Recurrence } from "../gen/timesense/v1/appointment_pb"
import { Loading } from "../components/Loading"

export function ViewAppointment() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [appointment, setAppointment] = useState<AppointmentDisplay | null>(null)
  const [calendar, setCalendar] = useState<CalendarDisplay | null>(null)
  const [slots, setSlots] = useState<SlotDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await getAppointment(id)
        if (response.success && response.data) {
          setAppointment(response.data)

          // Fetch calendar info
          const calResponse = await getCalendar(response.data.calendarId)
          if (calResponse.success && calResponse.data) {
            setCalendar(calResponse.data)
          }

          // Set initial month to the appointment's liveAt month
          const initialMonth = startOfMonth(parseISO(response.data.liveAt))
          setCurrentMonth(initialMonth)
        } else {
          const message = response.message || "Failed to load appointment"
          setError(message)
          toast.error(message)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load appointment"
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointment()
  }, [id])

  // Fetch slots when month changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!id || !currentMonth || !appointment) return

      try {
        setIsLoadingSlots(true)
        const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd")
        const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd")

        const slotsResponse = await getAppointmentSlots(id, {
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
  }, [id, currentMonth, appointment])

  const goToPreviousMonth = () => {
    if (!currentMonth || !appointment) return
    const prevMonth = subMonths(currentMonth, 1)
    // Don't go before the appointment's liveAt month
    const liveAtMonth = startOfMonth(parseISO(appointment.liveAt))
    if (prevMonth >= liveAtMonth) {
      setCurrentMonth(prevMonth)
    }
  }

  const goToNextMonth = () => {
    if (!currentMonth || !appointment) return
    const nextMonth = addMonths(currentMonth, 1)
    // Don't go after the appointment's expireAt month
    const expireAtMonth = startOfMonth(parseISO(appointment.expireAt))
    if (nextMonth <= expireAtMonth || hasNextPage) {
      setCurrentMonth(nextMonth)
    }
  }

  const canGoToPreviousMonth = () => {
    if (!currentMonth || !appointment) return false
    const liveAtMonth = startOfMonth(parseISO(appointment.liveAt))
    return currentMonth > liveAtMonth
  }

  const canGoToNextMonth = () => {
    if (!currentMonth || !appointment) return false
    const expireAtMonth = startOfMonth(parseISO(appointment.expireAt))
    return currentMonth < expireAtMonth || hasNextPage
  }

  const getRecurrenceLabel = (recurrence: Recurrence) => {
    const option = RECURRENCE_OPTIONS.find((opt) => opt.value === recurrence)
    return option?.label || "One-time"
  }

  const handleDelete = async () => {
    if (!id) return

    try {
      setIsDeleting(true)
      const response = await deleteAppointment(id)
      if (response.success) {
        toast.success("Appointment deleted successfully")
        navigate("/appointments")
      } else {
        toast.error(response.message || "Failed to delete appointment")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete appointment"
      toast.error(message)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  // Group slots by date
  const slotsByDate = slots.reduce<Record<string, SlotDisplay[]>>((acc, slot) => {
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
      : "bg-[#F3F4F6] text-[#6B7280]"
  }

  if (isLoading) {
    return <Loading />
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Navbar isAuthenticated={isAuthenticated} />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 mt-16 w-full">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-8 text-center">
            <p className="text-[#FF4D4F]">{error || "Appointment not found"}</p>
            <Link to="/appointments" className="mt-4 inline-block">
              <Button>Back to Appointments</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isBooker = user && user.id === appointment.bookerId

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 mt-16 w-full">
        <Link
          to="/appointments"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#0052FF] transition-colors mb-6"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span>Back to Appointments</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0052FF] to-[#0066FF] px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <HiCalendar className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">{appointment.title}</h1>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    appointment.recurrence === Recurrence.UNSPECIFIED
                      ? "bg-white/20 text-white"
                      : appointment.recurrence === Recurrence.WEEKLY
                        ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                        : "bg-[#8B5CF6]/20 text-[#8B5CF6]"
                  }`}>
                    {getRecurrenceLabel(appointment.recurrence)}
                  </span>
                  {appointment.rebook && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-[#FF4D4F]/20 text-[#FF4D4F]">
                      Rebook Required
                    </span>
                  )}
                </div>
              </div>

              {isBooker && (
                <div className="flex gap-3">
                  <Link to={`/appointments/${id}/edit`}>
                    <Button
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <HiPencil className="w-5 h-5 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-[#FF4D4F] hover:bg-[#FF4D4F]/20"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <HiTrash className="w-5 h-5 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Rebook Warning */}
          {appointment.rebook && (
            <div className="px-8 py-4 bg-[#FF4D4F]/5 border-b border-[#E5EAF2]">
              <div className="flex items-center gap-3">
                <HiExclamation className="w-5 h-5 text-[#FF4D4F]" />
                <div>
                  <p className="text-sm font-medium text-[#FF4D4F]">Rebooking Required</p>
                  <p className="text-sm text-[#6B7280]">
                    The calendar has been updated and this appointment no longer aligns with the availability schedule.
                    Please rebook or update this appointment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="p-8 space-y-6">
            {/* Schedule Info */}
            <div className="bg-[#F7F9FC] rounded-xl p-6">
              <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-4">
                Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0052FF]/10 flex items-center justify-center">
                    <HiClock className="w-5 h-5 text-[#0052FF]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Time</p>
                    <p className="text-[#1A1A1A] font-medium">
                      {formatTime(appointment.startTime)} - {formatTime(appointment.stopTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0052FF]/10 flex items-center justify-center">
                    <HiCalendar className="w-5 h-5 text-[#0052FF]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Active Period</p>
                    <p className="text-[#1A1A1A] font-medium">
                      {format(parseISO(appointment.liveAt), "MMM d, yyyy")} — {format(parseISO(appointment.expireAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recurrence Details */}
            {appointment.recurrence !== Recurrence.UNSPECIFIED && (
              <div>
                <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-4">
                  Recurrence
                </h2>
                {appointment.days.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-[#6B7280] mb-2">
                      {appointment.recurrence === Recurrence.MONTHLY ? "Days of Month" : "Weekdays"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {appointment.days.map((day) => (
                        <span
                          key={day}
                          className="bg-[#0052FF]/10 text-[#0052FF] px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {appointment.recurrence === Recurrence.MONTHLY ? `Day ${day}` : getDayLabel(day)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {appointment.months.length > 0 && (
                  <div>
                    <p className="text-xs text-[#6B7280] mb-2">Months</p>
                    <div className="flex flex-wrap gap-2">
                      {appointment.months.map((month) => (
                        <span
                          key={month}
                          className="bg-[#F3F4F6] text-[#6B7280] px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {format(new Date(2024, month - 1, 1), "MMM")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Calendar Info */}
            {calendar && (
              <div>
                <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-4">
                  Calendar
                </h2>
                <Link
                  to={`/calendars/${calendar.id}`}
                  className="block bg-[#F7F9FC] rounded-lg p-4 hover:bg-[#E5EAF2] transition-colors"
                >
                  <p className="text-[#1A1A1A] font-medium">{calendar.title}</p>
                  <p className="text-sm text-[#6B7280] mt-1">
                    {formatTime(calendar.startTime)} - {formatTime(calendar.stopTime)} • {calendar.slotDuration}min slots
                  </p>
                </Link>
              </div>
            )}

            {/* Slots */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide">
                  Appointment Slots
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
                    {format(parseISO(appointment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-[#6B7280]">Last Updated</span>
                  <p className="text-[#1A1A1A] font-medium mt-1">
                    {format(parseISO(appointment.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FF4D4F]/10 flex items-center justify-center">
                <HiTrash className="w-5 h-5 text-[#FF4D4F]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Delete Appointment</h3>
            </div>
            <p className="text-[#6B7280] mb-6">
              Are you sure you want to delete "{appointment.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#FF4D4F] hover:bg-[#FF4D4F]/90"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}