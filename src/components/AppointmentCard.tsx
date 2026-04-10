import { useNavigate } from "react-router-dom"
import { HiClock, HiCalendar, HiPencil, HiTrash, HiExclamation, HiChevronRight } from "react-icons/hi"
import { Button } from "./Button"
import { formatDate, formatTime, getDayLabel } from "../utils/calendar"
import { RECURRENCE_OPTIONS } from "../models/appointment"
import type { AppointmentDisplay } from "../models/appointment"
import { Recurrence } from "../gen/timesense/v1/appointment_pb"

interface AppointmentCardProps {
  appointment: AppointmentDisplay
  currentUserId?: string
  onDelete?: (appointment: AppointmentDisplay) => void
}

export function AppointmentCard({ appointment, currentUserId, onDelete }: AppointmentCardProps) {
  const navigate = useNavigate()
  const isBooker = currentUserId === appointment.bookerId
  const getRecurrenceLabel = (recurrence: Recurrence) => {
    const option = RECURRENCE_OPTIONS.find((opt) => opt.value === recurrence)
    return option?.label || "One-time"
  }

  const handleCardClick = () => {
    navigate(`/appointments/${appointment.id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer ${
        appointment.rebook ? "border-[#FF4D4F]/50" : "border-[#E5EAF2]"
      }`}
    >
      {appointment.rebook && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-[#FF4D4F]/10 rounded-lg">
          <HiExclamation className="w-5 h-5 text-[#FF4D4F] shrink-0" />
          <span className="text-sm text-[#FF4D4F] font-medium">
            Rebook required!
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-[#1A1A1A] text-lg line-clamp-2">{appointment.title}</h3>
        <div className="flex items-center gap-2">
          <span className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${
            appointment.recurrence === Recurrence.UNSPECIFIED
              ? "bg-[#10B981]/10 text-[#10B981]"
              : appointment.recurrence === Recurrence.WEEKLY
                ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                : "bg-[#8B5CF6]/10 text-[#8B5CF6]"
          }`}>
            {getRecurrenceLabel(appointment.recurrence)}
          </span>
          <HiChevronRight className="w-5 h-5 text-[#6B7280] shrink-0" />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <HiClock className="w-4 h-4 text-[#6B7280] shrink-0" />
          <span className="text-[#1A1A1A] font-medium">
            {formatTime(appointment.startTime)} - {formatTime(appointment.stopTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <HiCalendar className="w-4 h-4 shrink-0" />
          <span>{formatDate(appointment.liveAt)}</span>
          <span className="text-[#9CA3AF]">→</span>
          <span>{formatDate(appointment.expireAt)}</span>
        </div>
      </div>

      {appointment.recurrence !== Recurrence.UNSPECIFIED && (
        <div className="flex flex-wrap gap-1 mb-3">
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

      {isBooker && (
        <div className="flex gap-2 mt-auto pt-3 border-t border-[#E5EAF2]" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
          >
            <HiPencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-[#FF4D4F] border-[#FF4D4F]/30 hover:bg-[#FF4D4F]/10"
            onClick={() => onDelete?.(appointment)}
          >
            <HiTrash className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}