import { Link } from "react-router-dom"
import { HiClock, HiCalendar, HiPencil, HiTrash } from "react-icons/hi"
import { Button } from "./Button"
import { formatDate, formatTime, getDayLabel } from "../utils/calendar"
import { RECURRENCE_OPTIONS } from "../models/appointment"
import type { AppointmentDisplay } from "../models/appointment"
import { Recurrence } from "../gen/timesense/v1/appointment_pb"

interface AppointmentCardProps {
  appointment: AppointmentDisplay
  showActions?: boolean
  onDelete?: (appointment: AppointmentDisplay) => void
}

export function AppointmentCard({ appointment, showActions = true, onDelete }: AppointmentCardProps) {
  const getRecurrenceLabel = (recurrence: Recurrence) => {
    const option = RECURRENCE_OPTIONS.find((opt) => opt.value === recurrence)
    return option?.label || "One-time"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-[#1A1A1A] text-lg">{appointment.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              appointment.recurrence === Recurrence.UNSPECIFIED
                ? "bg-[#10B981]/10 text-[#10B981]"
                : appointment.recurrence === Recurrence.WEEKLY
                  ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                  : "bg-[#8B5CF6]/10 text-[#8B5CF6]"
            }`}>
              {getRecurrenceLabel(appointment.recurrence)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
            <div className="flex items-center gap-1">
              <HiClock className="w-4 h-4" />
              <span>{formatTime(appointment.startTime)} - {formatTime(appointment.stopTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <HiCalendar className="w-4 h-4" />
              <span>{formatDate(appointment.liveAt)} - {formatDate(appointment.expireAt)}</span>
            </div>
          </div>
          {appointment.recurrence !== Recurrence.UNSPECIFIED && (
            <div className="flex flex-wrap gap-1 mt-2">
              {appointment.days.map((day) => (
                <span
                  key={day}
                  className="text-xs bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded"
                >
                  {appointment.recurrence === Recurrence.MONTHLY ? `Day ${day}` : getDayLabel(day)}
                </span>
              ))}
              {appointment.months.length > 0 && (
                <span className="text-xs bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded">
                  {appointment.months.length} months
                </span>
              )}
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Link to={`/appointments/${appointment.id}/edit`}>
              <Button variant="outline" size="sm">
                <HiPencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-[#FF4D4F] border-[#FF4D4F]/30 hover:bg-[#FF4D4F]/10"
              onClick={() => onDelete?.(appointment)}
            >
              <HiTrash className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}