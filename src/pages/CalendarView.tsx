import { useEffect, useState, type SetStateAction } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { HiCalendar, HiClock, HiArrowLeft, HiPencil, HiTrash, HiShare, HiPlus, HiOutlineCalendar } from "react-icons/hi"
import { toast } from "react-toastify"
import { format, parseISO } from "date-fns"
import { useAuth } from "../auth"
import { getCalendar, deleteCalendar } from "../services/calendar.service"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/Button"
import { formatTime, getDayLabel } from "../utils/calendar"
import type { CalendarDisplay } from "../models/calendar"
import { handleShare } from "../utils/share"
import { Delete } from "../components/Delete"

export function CalendarView() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [calendar, setCalendar] = useState<CalendarDisplay | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOwner = calendar && user && calendar.ownerId === user.id

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await getCalendar(id)
        if (response.success && response.data) {
          setCalendar(response.data)
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