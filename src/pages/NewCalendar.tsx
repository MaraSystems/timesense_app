import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../auth"
import { createCalendar } from "../services/calendar.service"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { CheckboxGroup } from "../components/Checkbox"
import { ValidateCalendar, type CalendarFormData, type CalendarFormErrors } from "../validator/calendarValidator"
import { SLOT_DURATIONS, WEEKDAYS } from "../models/calendar"

export function NewCalendar() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CalendarFormData>({
    title: "",
    slotDuration: 30,
    liveAt: "",
    expireAt: "",
    startTime: 9*60,
    stopTime: 17*60,
    weekDays: [1, 2, 3, 4, 5], // Default to weekdays
  })
  const [errors, setErrors] = useState<CalendarFormErrors>({})


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ValidateCalendar(formData, setErrors)) return

    setIsLoading(true)

    try {
      const response = await createCalendar({
        title: formData.title,
        slotDuration: formData.slotDuration,
        liveAt: new Date(formData.liveAt).toISOString(),
        expireAt: new Date(formData.expireAt).toISOString(),
        startTime: formData.startTime,
        stopTime: formData.stopTime,
        weekDays: { values: formData.weekDays },
        allowOverlap: false,
      })

      if (response.success) {
        toast.success("Calendar created successfully!")
        navigate("/calendars")
      } else {
        toast.error(response.message || "Failed to create calendar")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create calendar"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 mt-16 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Create New Calendar</h1>
          <p className="text-[#6B7280] mt-1">
            Set up your availability for scheduling appointments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-6" noValidate>
          {/* Title */}
          <Input
            id="title"
            label="Calendar Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            error={errors.title}
            placeholder="e.g., Work Hours"
            data-testid="calendar-title-input"
          />

          {/* Slot Duration */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Slot Duration
            </label>
            <select
              id="slotDuration"
              value={formData.slotDuration}
              onChange={(e) => setFormData((prev) => ({ ...prev, slotDuration: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent bg-white"
              data-testid="slot-duration-select"
            >
              {SLOT_DURATIONS.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Window */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="liveAt"
              label="Availability Starts"
              type="date"
              value={formData.liveAt}
              onChange={(e) => setFormData((prev) => ({ ...prev, liveAt: e.target.value }))}
              error={errors.liveAt}
              data-testid="live-at-input"
            />
            <Input
              id="expireAt"
              label="Availability Ends"
              type="date"
              value={formData.expireAt}
              onChange={(e) => setFormData((prev) => ({ ...prev, expireAt: e.target.value }))}
              error={errors.expireAt}
              data-testid="expire-at-input"
            />
          </div>

          {/* Daily Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Daily Start Hour
              </label>
              <input
                type="number"
                id="startTime"
                min={0}
                max={23}
                value={formData.startTime/60}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: Number(e.target.value) * 60 }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent bg-white"
                data-testid="start-time-input"
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-[#FF4D4F]" data-testid="startTime-error">
                  {errors.startTime}
                </p>
              )}
              <p className="mt-1 text-xs text-[#6B7280]">Hour (0-23, e.g., 9 for 9 AM)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Daily End Hour
              </label>
              <input
                type="number"
                id="stopTime"
                min={0}
                max={23}
                value={formData.stopTime/60}
                onChange={(e) => setFormData((prev) => ({ ...prev, stopTime: Number(e.target.value) * 60 }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent bg-white"
                data-testid="stop-time-input"
              />
              {errors.stopTime && (
                <p className="mt-1 text-sm text-[#FF4D4F]" data-testid="stopTime-error">
                  {errors.stopTime}
                </p>
              )}
              <p className="mt-1 text-xs text-[#6B7280]">Hour (0-23, e.g., 17 for 5 PM)</p>
            </div>
          </div>

          {/* Working Days */}
          <CheckboxGroup
            label="Working Days"
            options={WEEKDAYS}
            selected={formData.weekDays}
            onChange={(selected) => setFormData((prev) => ({ ...prev, weekDays: selected }))}
            error={errors.weekDays}
            data-testid="weekdays-checkbox-group"
          />

          {/* Submit */}
          <div className="flex gap-4 pt-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/calendars")}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              data-testid="create-calendar-button"
            >
              Create Calendar
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}