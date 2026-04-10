import { Recurrence, type Appointment } from "../gen/timesense/v1/appointment_pb"
import { format } from "date-fns"

/**
 * Day numbers for monthly recurrence (1-31).
 */
export const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}))

/**
 * Month options for yearly recurrence patterns.
 * Values: 1 = January, 2 = February, ..., 12 = December
 */
export const MONTHS = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
]

/**
 * Recurrence type options for appointments.
 */
export const RECURRENCE_OPTIONS = [
  { value: Recurrence.UNSPECIFIED, label: "One-time" },
  { value: Recurrence.WEEKLY, label: "Weekly" },
  { value: Recurrence.MONTHLY, label: "Monthly" },
]

/**
 * Display model for appointment data in the UI.
 */
export interface AppointmentDisplay {
  id: string
  calendarId: string
  bookerId: string
  title: string
  startTime: number
  stopTime: number
  days: number[]
  months: number[]
  recurrence: Recurrence
  liveAt: string
  expireAt: string
  rebook: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Parameters for creating a new appointment.
 */
export interface CreateAppointmentParams {
  calendarId: string
  title: string
  startTime: number
  stopTime: number
  days: number[]
  months: number[]
  recurrence: Recurrence
  liveAt: string
  expireAt: string
}

/**
 * Parameters for updating an existing appointment.
 */
export interface UpdateAppointmentParams {
  title?: string
  startTime?: number
  stopTime?: number
  days?: number[]
  months?: number[]
  recurrence?: Recurrence
  liveAt?: string
  expireAt?: string
}

/**
 * Display model for appointment slot data in the UI.
 */
export interface SlotDisplay {
  startTime: number
  stopTime: number
  date: string
  booked: boolean
}

/**
 * Parameters for listing appointments with optional filters.
 */
export interface ListAppointmentsParams {
  limit: number
  offset: number
  calendarId?: string
  bookerId?: string
  liveAt?: string
  expireAt?: string
}

/**
 * Transforms a protobuf Appointment message to a display-friendly format.
 * @param appointment - The protobuf Appointment message
 * @returns The appointment display object with string IDs and formatted dates
 */
export function toAppointmentDisplay(appointment: Appointment): AppointmentDisplay {
  const liveAtDate = appointment.liveAt?.toDate()
  const expireAtDate = appointment.expireAt?.toDate()
  const createdAtDate = appointment.createdAt?.toDate()
  const updatedAtDate = appointment.updatedAt?.toDate()

  return {
    id: appointment.id.toString(),
    calendarId: appointment.calendarId.toString(),
    bookerId: appointment.bookerId.toString(),
    title: appointment.title,
    startTime: appointment.startTime,
    stopTime: appointment.stopTime,
    days: appointment.days?.values || [],
    months: appointment.months?.values || [],
    recurrence: appointment.recurrence,
    liveAt: liveAtDate ? format(liveAtDate, "yyyy-MM-dd") : '',
    expireAt: expireAtDate ? format(expireAtDate, "yyyy-MM-dd") : '',
    rebook: appointment.rebook,
    createdAt: createdAtDate ? format(createdAtDate, "yyyy-MM-dd'T'HH:mm:ss") : '',
    updatedAt: updatedAtDate ? format(updatedAtDate, "yyyy-MM-dd'T'HH:mm:ss") : '',
  }
}

/**
 * Transforms a protobuf Slot message to a display-friendly format.
 * @param slot - The protobuf Slot message
 * @returns The slot display object with formatted date
 */
export function toSlotDisplay(slot: import("../gen/timesense/v1/slot_pb").Slot): SlotDisplay {
  const slotDate = slot.date?.toDate()
  return {
    startTime: slot.startTime,
    stopTime: slot.stopTime,
    date: slotDate ? format(slotDate, "yyyy-MM-dd") : '',
    booked: slot.booked,
  }
}