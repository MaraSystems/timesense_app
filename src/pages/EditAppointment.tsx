import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { HiArrowLeft } from "react-icons/hi"
import { startOfMonth, endOfMonth, format, parseISO, getDate } from "date-fns"
import { useAuth } from "../auth"
import { getCalendar, getCalendarSlots } from "../services/calendar.service"
import { getAppointment, updateAppointment, Recurrence } from "../services/appointment.service"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { Select } from "../components/Select"
import { WEEKDAYS, type CalendarDisplay, type CalendarSlotDisplay } from "../models/calendar"
import { ValidateAppointment, type AppointmentFormData, type AppointmentFormErrors } from "../validator/appointmentValidator"
import { CalendarGrid } from "../components/CalendarGrid"
import { RECURRENCE_OPTIONS, MONTH_DAYS, MONTHS } from "../models/appointment"
import { Loading } from "../components/Loading"
import { formatDate, formatTime } from "../utils/calendar"

export function EditAppointment() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [calendar, setCalendar] = useState<CalendarDisplay | null>(null)
  const [slots, setSlots] = useState<CalendarSlotDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<string>("")
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: "",
    date: "",
    startTime: null,
    stopTime: null,
    recurrence: Recurrence.UNSPECIFIED,
    days: [],
    months: [],
  })
  const [errors, setErrors] = useState<AppointmentFormErrors>({})

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) {
        toast.error("No appointment specified")
        navigate("/calendars")
        return
      }

      try {
        setIsLoading(true)
        const response = await getAppointment(id)
        if (response.success && response.data) {
          const appointment = response.data
          setFormData({
            title: appointment.title,
            date: appointment.recurrence === Recurrence.UNSPECIFIED ? appointment.liveAt : "",
            startTime: appointment.startTime,
            stopTime: appointment.stopTime,
            recurrence: appointment.recurrence,
            days: appointment.days,
            months: appointment.months,
          })
          setCurrentMonth(appointment.liveAt.substring(0, 7))

          // Fetch calendar
          const calResponse = await getCalendar(appointment.calendarId)
          if (calResponse.success && calResponse.data) {
            setCalendar(calResponse.data)
          }
        } else {
          toast.error("Failed to load appointment")
          navigate("/calendars")
        }
      } catch (err) {
        toast.error("Failed to load appointment")
        navigate("/calendars")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointment()
  }, [id, navigate])

  // Fetch available slots when month changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!calendar || !currentMonth) {
        setSlots([])
        return
      }

      try {
        setIsLoadingSlots(true)
        const monthDate = parseISO(`${currentMonth}-01`)
        const firstDay = startOfMonth(monthDate)
        const lastDay = endOfMonth(monthDate)

        const liveAt = format(firstDay, "yyyy-MM-dd")
        const expireAt = format(lastDay, "yyyy-MM-dd")

        const response = await getCalendarSlots(calendar.id, {
          liveAt,
          expireAt,
        })

        if (response.success && response.data) {
          const sortedSlots = response.data.data.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date)
            return a.startTime - b.startTime
          })
          setSlots(sortedSlots)
        } else {
          setSlots([])
        }
      } catch (err) {
        console.error("Failed to load slots:", err)
        setSlots([])
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [calendar, currentMonth])

  // Update month when date changes
  useEffect(() => {
    if (formData.date) {
      const newMonth = formData.date.substring(0, 7)
      if (newMonth !== currentMonth) {
        setCurrentMonth(newMonth)
      }
    }
  }, [formData.date, currentMonth])

  // Get slots for the selected date
  const slotsForSelectedDate = formData.date
    ? slots.filter(slot => slot.date.startsWith(formData.date))
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ValidateAppointment(formData, setErrors) || !id || !calendar) return

    if (formData.startTime === null || formData.stopTime === null) {
      setErrors({ timeSlot: "Please select a time" })
      return
    }

    setIsSaving(true)

    try {
      let days: number[] = []
      let months: number[] = []
      let liveAt: string
      let expireAt: string

      if (formData.recurrence === Recurrence.UNSPECIFIED) {
        const selectedDate = parseISO(formData.date)
        const dayOfMonth = getDate(selectedDate)
        const month = selectedDate.getMonth() + 1
        days = [dayOfMonth]
        months = [month]
        liveAt = formData.date
        expireAt = formData.date
      } else {
        days = formData.days
        months = formData.months
        liveAt = calendar.liveAt.split("T")[0]
        expireAt = calendar.expireAt.split("T")[0]
      }

      const response = await updateAppointment(id, {
        title: formData.title,
        startTime: formData.startTime,
        stopTime: formData.stopTime,
        days,
        months,
        recurrence: formData.recurrence,
        liveAt,
        expireAt,
      })

      if (response.success) {
        toast.success("Appointment updated successfully!")
        navigate(`/appointments?calendarId=${calendar.id}`)
      } else {
        toast.error(response.message || "Failed to update appointment")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update appointment"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  // Get min and max dates for the date picker
  const getMinDate = () => {
    if (calendar?.liveAt) {
      return calendar.liveAt.split("T")[0]
    }
    return new Date().toISOString().split("T")[0]
  }

  const getMaxDate = () => {
    if (calendar?.expireAt) {
      return calendar.expireAt.split("T")[0]
    }
    return undefined
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      {isLoading ? <Loading /> :
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 mt-16 w-full">
        <Link
          to={calendar ? `/appointments?calendarId=${calendar.id}` : "/calendars"}
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#0052FF] transition-colors mb-6"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span>Back to Appointments</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Appointment</h1>
          <p className="text-[#6B7280] mt-1">
            {calendar && (
              <>
                on <span className="font-medium text-[#1A1A1A]">{calendar.title}</span>
              </>
            )}
          </p>
        </div>

        {calendar && (
          <div className="bg-[#0052FF]/5 rounded-lg p-4 mb-6">
            <p className="text-sm text-[#6B7280]">
              <span className="font-medium text-[#1A1A1A]">Availability:</span>{" "}
              {formatTime(calendar.startTime)} - {formatTime(calendar.stopTime)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-6" noValidate>
          {/* Title */}
          <Input
            id="title"
            label="Appointment Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            error={errors.title}
            placeholder="e.g., Team Meeting"
            data-testid="appointment-title-input"
          />

          {/* Recurrence */}
          <Select
            id="recurrence"
            label="Recurrence"
            value={formData.recurrence}
            onChange={(e) => setFormData((prev) => ({
              ...prev,
              recurrence: Number(e.target.value),
              days: [],
              months: [],
              startTime: null,
              stopTime: null,
            }))}
            data-testid="recurrence-select"
          >
            {RECURRENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          {/* Date Selection - only for one-time appointments */}
          {formData.recurrence === Recurrence.UNSPECIFIED && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Select Date
              </label>
              <div className="bg-white rounded-lg border border-[#E5EAF2] p-4">
                <CalendarGrid
                  selectedDate={formData.date}
                  onDateSelect={(date) => {
                    setFormData((prev) => ({
                      ...prev,
                      date: date,
                      startTime: null,
                      stopTime: null,
                    }))
                  }}
                  minDate={getMinDate()}
                  maxDate={getMaxDate()}
                  availableWeekdays={calendar?.weekDays.values}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-[#FF4D4F]" data-testid="date-error">
                  {errors.date}
                </p>
              )}
              {formData.date && (
                <p className="mt-2 text-sm text-[#6B7280]">
                  Selected: {formatDate(formData.date)}
                </p>
              )}
            </div>
          )}

          {/* Time Slots - for one-time appointments */}
          {formData.recurrence === Recurrence.UNSPECIFIED && formData.date && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Select Time Slot
              </label>
              {isLoadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : slotsForSelectedDate.length === 0 ? (
                <div className="bg-[#F7F9FC] rounded-lg p-4 text-center text-[#6B7280]">
                  No time slots available for this date
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {slotsForSelectedDate.map((slot, index) => {
                    const isSelected = formData.startTime === slot.startTime && formData.stopTime === slot.stopTime
                    const isBooked = slot.booked
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (!isBooked) {
                            setFormData((prev) => ({
                              ...prev,
                              startTime: slot.startTime,
                              stopTime: slot.stopTime,
                            }))
                          }
                        }}
                        disabled={isBooked}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isBooked
                            ? "bg-[#F7F9FC] text-[#9CA3AF] cursor-not-allowed border border-[#E5EAF2]"
                            : isSelected
                              ? "bg-[#0052FF] text-white"
                              : "bg-[#F7F9FC] text-[#1A1A1A] hover:bg-[#E5EAF2] border border-[#E5EAF2]"
                        }`}
                        data-testid={`slot-${slot.startTime}-${slot.stopTime}`}
                      >
                        {formatTime(slot.startTime)} - {formatTime(slot.stopTime)}
                        {isBooked && <span className="ml-1 text-[#9CA3AF]">(Booked)</span>}
                      </button>
                    )
                  })}
                </div>
              )}
              {errors.timeSlot && (
                <p className="mt-1 text-sm text-[#FF4D4F]" data-testid="timeSlot-error">
                  {errors.timeSlot}
                </p>
              )}
            </div>
          )}

          {/* Time Selection - for recurring appointments */}
          {(formData.recurrence === Recurrence.WEEKLY || formData.recurrence === Recurrence.MONTHLY) && calendar && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: Math.ceil((calendar.stopTime - calendar.startTime) / calendar.slotDuration) }, (_, i) => {
                  const slotStart = calendar.startTime + (i * calendar.slotDuration)
                  const slotStop = slotStart + calendar.slotDuration
                  const isSelected = formData.startTime === slotStart && formData.stopTime === slotStop
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          startTime: slotStart,
                          stopTime: slotStop,
                        }))
                      }}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-[#0052FF] text-white"
                          : "bg-[#F7F9FC] text-[#1A1A1A] hover:bg-[#E5EAF2] border border-[#E5EAF2]"
                      }`}
                      data-testid={`recurring-slot-${slotStart}-${slotStop}`}
                    >
                      {formatTime(slotStart)} - {formatTime(slotStop)}
                    </button>
                  )
                })}
              </div>
              {errors.timeSlot && (
                <p className="mt-1 text-sm text-[#FF4D4F]" data-testid="timeSlot-error">
                  {errors.timeSlot}
                </p>
              )}
            </div>
          )}

          {/* Days Selection - Weekly */}
          {formData.recurrence === Recurrence.WEEKLY && calendar && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Select Weekdays
              </label>
              <div className="flex flex-wrap gap-3">
                {WEEKDAYS.filter((day) => calendar.weekDays.values.includes(day.value)).map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      const newDays = formData.days.includes(day.value)
                        ? formData.days.filter((d) => d !== day.value)
                        : [...formData.days, day.value]
                      setFormData((prev) => ({ ...prev, days: newDays }))
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.days.includes(day.value)
                        ? "bg-[#0052FF] text-white"
                        : "bg-[#F7F9FC] text-[#1A1A1A] hover:bg-[#E5EAF2] border border-[#E5EAF2]"
                    }`}
                    data-testid={`weekday-${day.label.toLowerCase()}`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.weekDays && (
                <p className="mt-1 text-sm text-[#FF4D4F]" data-testid="weekDays-error">
                  {errors.weekDays}
                </p>
              )}
            </div>
          )}

          {/* Days Selection - Monthly */}
          {formData.recurrence === Recurrence.MONTHLY && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Select Days of the Month
              </label>
              <div className="grid grid-cols-7 gap-2">
                {MONTH_DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      const newDays = formData.days.includes(day.value)
                        ? formData.days.filter((d) => d !== day.value)
                        : [...formData.days, day.value]
                      setFormData((prev) => ({ ...prev, days: newDays }))
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      formData.days.includes(day.value)
                        ? "bg-[#0052FF] text-white"
                        : "bg-[#F7F9FC] text-[#1A1A1A] hover:bg-[#E5EAF2]"
                    }`}
                    data-testid={`day-${day.value}`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Months Selection */}
          {(formData.recurrence === Recurrence.WEEKLY || formData.recurrence === Recurrence.MONTHLY) && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Select Months
              </label>
              <div className="flex flex-wrap gap-3">
                {MONTHS.map((month) => (
                  <button
                    key={month.value}
                    type="button"
                    onClick={() => {
                      const newMonths = formData.months.includes(month.value)
                        ? formData.months.filter((m) => m !== month.value)
                        : [...formData.months, month.value]
                      setFormData((prev) => ({ ...prev, months: newMonths }))
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.months.includes(month.value)
                        ? "bg-[#0052FF] text-white"
                        : "bg-[#F7F9FC] text-[#1A1A1A] hover:bg-[#E5EAF2] border border-[#E5EAF2]"
                    }`}
                    data-testid={`month-${month.label.toLowerCase()}`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4 pt-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(calendar ? `/appointments?calendarId=${calendar.id}` : "/calendars")}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              data-testid="update-appointment-button"
            >
              Update Appointment
            </Button>
          </div>
        </form>
      </main>}
      <Footer />
    </div>
  )
}