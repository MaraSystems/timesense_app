import { useEffect, useState, type SetStateAction } from "react"
import { Link } from "react-router-dom"
import { HiArrowLeft, HiCalendar, HiRefresh } from "react-icons/hi"
import { toast } from "react-toastify"
import { useAuth } from "../auth"
import { listAppointments, deleteAppointment } from "../services/appointment.service"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/Button"
import { Delete } from "../components/Delete"
import { AppointmentCard } from "../components/AppointmentCard"
import { DateFilterPanel, FilterButton } from "../components/DateFilterPanel"
import type { AppointmentDisplay } from "../models/appointment"

const PAGE_SIZE = 10

export function Appointments() {
  const { user, isAuthenticated } = useAuth()

  const [appointments, setAppointments] = useState<AppointmentDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentDisplay | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [liveAtFilter, setLiveAtFilter] = useState<string>("")
  const [expireAtFilter, setExpireAtFilter] = useState<string>("")

  const fetchAppointments = async (resetList = false) => {
    if (!user) {
      setError("Please log in to view appointments")
      setIsLoading(false)
      return
    }

    try {
      if (resetList) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      const currentOffset = resetList ? 0 : offset

      const response = await listAppointments({
        limit: PAGE_SIZE,
        offset: currentOffset,
        bookerId: user.id,
        liveAt: liveAtFilter || undefined,
        expireAt: expireAtFilter || undefined,
      })

      if (response.success) {
        if (resetList) {
          setAppointments(response.data)
          setOffset(PAGE_SIZE)
        } else {
          setAppointments((prev) => [...prev, ...response.data])
          setOffset((prev) => prev + PAGE_SIZE)
        }
        setHasMore(response.data.length === PAGE_SIZE)
      } else {
        const message = response.message || "Failed to load appointments"
        setError(message)
        toast.error(message)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load appointments"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchAppointments(true)
  }, [user?.id, liveAtFilter, expireAtFilter])

  const handleClearFilters = () => {
    setLiveAtFilter("")
    setExpireAtFilter("")
    setShowFilters(false)
  }

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchAppointments(false)
    }
  }

  const handleDelete = async (setIsDeleting: (flag: SetStateAction<boolean>) => void) => {
    if (!appointmentToDelete) return

    setIsDeleting(true)
    try {
      const response = await deleteAppointment(appointmentToDelete.id)
      if (response.success) {
        toast.success("Appointment deleted successfully")
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentToDelete.id))
        setShowDeleteConfirm(false)
        setAppointmentToDelete(null)
      } else {
        toast.error(response.message || "Failed to delete appointment")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete appointment")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 mt-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/calendars">
              <Button variant="outline" className="gap-2">
                <HiArrowLeft className="w-5 h-5" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">My Appointments</h1>
              <p className="text-[#6B7280] mt-1">View and manage your booked appointments</p>
            </div>
          </div>
          <FilterButton
            showFilters={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
            filterCount={(liveAtFilter ? 1 : 0) + (expireAtFilter ? 1 : 0)}
          />
        </div>

        {showFilters && (
          <DateFilterPanel
            liveAtFilter={liveAtFilter}
            expireAtFilter={expireAtFilter}
            onLiveAtChange={setLiveAtFilter}
            onExpireAtChange={setExpireAtFilter}
            onClear={handleClearFilters}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-8 text-center">
            <p className="text-[#FF4D4F]">{error}</p>
            <Button
              className="mt-4"
              onClick={() => fetchAppointments(true)}
            >
              Try Again
            </Button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center mx-auto mb-4">
              <HiCalendar className="w-8 h-8 text-[#0052FF]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No appointments yet</h3>
            <p className="text-[#6B7280] mb-6">
              You haven't booked any appointments yet.
            </p>
            <Link to="/calendars">
              <Button>
                Browse Calendars
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  currentUserId={user?.id}
                  onDelete={(apt) => {
                    setAppointmentToDelete(apt)
                    setShowDeleteConfirm(true)
                  }}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0052FF] border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <HiRefresh className="w-4 h-4 mr-2" />
                      Load More
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />

      {showDeleteConfirm && appointmentToDelete && (
        <Delete
          title={appointmentToDelete.title}
          entityName="Appointment"
          handleDelete={handleDelete}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}
    </div>
  )
}