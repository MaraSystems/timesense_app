import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { HiCalendar, HiClock, HiArrowLeft, HiPencil, HiTrash } from "react-icons/hi"
import { toast } from "react-toastify"
import { useAuth } from "../auth"
import { getCalendar, deleteCalendar, type CalendarDisplay } from "../services/calendar.service"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/Button"

export function CalendarView() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [calendar, setCalendar] = useState<CalendarDisplay | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleDelete = async () => {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (hour: number) => {
    if (hour === 0 || hour === 24) return "12:00 AM"
    if (hour === 12) return "12:00 PM"
    const h = hour > 12 ? hour - 12 : hour
    const period = hour >= 12 ? "PM" : "AM"
    return `${h}:00 ${period}`
  }

  const getDayLabel = (day: number) => {
    const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return days[day] || ""
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
            <div className="bg-[#0052FF] px-6 py-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <HiCalendar className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{calendar.title}</h1>
                  </div>
                  <p className="text-white/80 ml-13">
                    {formatDate(calendar.liveAt)} - {formatDate(calendar.expireAt)}
                  </p>
                </div>
                <div className="flex gap-2">
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
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              {/* Time Settings */}
              <div>
                <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-3">
                  Availability
                </h2>
                <div className="bg-[#F7F9FC] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <HiClock className="w-5 h-5 text-[#0052FF]" />
                    <span className="text-[#1A1A1A]">
                      {formatTime(calendar.startTime)} - {formatTime(calendar.stopTime)}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] mt-1 ml-8">
                    {calendar.slotDuration} minute appointment slots
                  </p>
                </div>
              </div>

              {/* Working Days */}
              <div>
                <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-3">
                  Working Days
                </h2>
                <div className="flex flex-wrap gap-2">
                  {calendar.weekDays.values.sort((a, b) => a - b).map((day) => (
                    <span
                      key={day}
                      className="bg-[#0052FF]/10 text-[#0052FF] px-3 py-1.5 rounded-lg text-sm font-medium"
                    >
                      {getDayLabel(day)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-[#E5EAF2]">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#6B7280]">Created</span>
                    <p className="text-[#1A1A1A] font-medium">{formatDate(calendar.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Last Updated</span>
                    <p className="text-[#1A1A1A] font-medium">{formatDate(calendar.updatedAt)}</p>
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Delete Calendar</h2>
            <p className="text-[#6B7280] mb-6">
              Are you sure you want to delete "{calendar?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#FF4D4F] hover:bg-[#FF4D4F]/80"
                onClick={handleDelete}
                isLoading={isDeleting}
                data-testid="confirm-delete-button"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}