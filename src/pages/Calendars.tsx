import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { HiPlus, HiCalendar, HiClock } from "react-icons/hi"
import { toast } from "react-toastify"
import { useAuth } from "../auth"
import { listCalendars } from "../services/calendar.service"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/Button"
import { formatDate, formatTime, getDayLabel } from "../utils/calendar"
import type { CalendarDisplay } from "../models/calendar"

const PAGE_SIZE = 2

export function Calendars() {
  const { isAuthenticated } = useAuth()
  const [calendars, setCalendars] = useState<CalendarDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)

  const fetchCalendars = async (resetList = false) => {
    try {
      if (resetList) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      const currentOffset = resetList ? 0 : offset
      const response = await listCalendars({ limit: PAGE_SIZE, offset: currentOffset })

      if (response.success && response.data) {
        if (resetList) {
          setCalendars(response.data.data)
          setOffset(PAGE_SIZE)
        } else {
          setCalendars((prev) => [...prev, ...response.data!.data])
          setOffset((prev) => prev + PAGE_SIZE)
        }
        setHasMore(response.data.next)
      } else {
        const message = response.message || "Failed to load calendars"
        setError(message)
        toast.error(message)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load calendars"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchCalendars(true)
  }, [])

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchCalendars(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 mt-16 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">My Calendars</h1>
            <p className="text-[#6B7280] mt-1">Manage your availability schedules</p>
          </div>
          <Link to="/calendars/new">
            <Button>
              <HiPlus className="w-5 h-5 mr-2" />
              New Calendar
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-8 text-center">
            <p className="text-[#FF4D4F]">{error}</p>
            <Button
              className="mt-4"
              onClick={() => fetchCalendars(true)}
            >
              Try Again
            </Button>
          </div>
        ) : calendars.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center mx-auto mb-4">
              <HiCalendar className="w-8 h-8 text-[#0052FF]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No calendars yet</h3>
            <p className="text-[#6B7280] mb-6">
              Create your first calendar to start managing your availability.
            </p>
            <Link to="/calendars/new">
              <Button>
                <HiPlus className="w-5 h-5 mr-2" />
                Create Calendar
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {calendars.map((calendar) => (
                <Link
                  key={calendar.id}
                  to={`/calendars/${calendar.id}`}
                  className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-6 hover:shadow-md transition-shadow block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-[#1A1A1A]">{calendar.title}</h3>
                    <div className="flex items-center gap-1 text-[#0052FF] bg-[#0052FF]/10 px-2 py-1 rounded-md text-sm">
                      <HiClock className="w-4 h-4" />
                      <span>{calendar.slotDuration}min</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <HiCalendar className="w-4 h-4" />
                      <span>{formatDate(calendar.liveAt)} - {formatDate(calendar.expireAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiClock className="w-4 h-4" />
                      <span>{formatTime(calendar.startTime)} - {formatTime(calendar.stopTime)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {calendar.weekDays.values.map((day) => (
                        <span
                          key={day}
                          className="text-xs bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded"
                        >
                          {getDayLabel(day)}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
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
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}