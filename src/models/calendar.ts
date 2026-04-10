import type { Calendar } from "../gen/timesense/v1/calendar_pb"
import type { Slot } from "../gen/timesense/v1/slot_pb"
import { format } from "date-fns"

/**
 * Display model for calendar data in the UI.
 */
export interface CalendarDisplay {
  id: string
  ownerId: string
  title: string
  slotDuration: number
  liveAt: string
  expireAt: string
  startTime: number
  stopTime: number
  weekDays: { values: number[] }
  createdAt: string
  updatedAt: string
}

/**
 * Display model for calendar slot data in the UI.
 */
export interface CalendarSlotDisplay {
  startTime: number
  stopTime: number
  date: string
  booked: boolean
}

/**
 * Parameters for creating a new calendar.
 */
export interface CreateCalendarParams {
  title: string
  slotDuration: number
  liveAt: string
  expireAt: string
  startTime: number
  stopTime: number
  weekDays: { values: number[] }
  allowOverlap: boolean
}

/**
 * Parameters for updating an existing calendar.
 */
export interface UpdateCalendarParams {
  title?: string
  slotDuration?: number
  liveAt?: string
  expireAt?: string
  startTime?: number
  stopTime?: number
  weekDays?: { values: number[] }
  allowOverlap?: boolean
}

/**
 * Weekday options for calendar configuration.
 * Values follow JavaScript standard: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
]

/**
 * Available slot duration options for calendar configuration.
 */
export const SLOT_DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
]

/**
 * Transforms a protobuf Calendar message to a display-friendly format.
 * @param calendar - The protobuf Calendar message
 * @returns The calendar display object with string IDs and formatted dates
 */
export function toCalendarDisplay(calendar: Calendar): CalendarDisplay {
  const liveAtDate = calendar.liveAt?.toDate()
  const expireAtDate = calendar.expireAt?.toDate()
  const createdAtDate = calendar.createdAt?.toDate()
  const updatedAtDate = calendar.updatedAt?.toDate()

  return {
    id: calendar.id.toString(),
    ownerId: calendar.ownerId.toString(),
    title: calendar.title,
    slotDuration: calendar.slotDuration,
    liveAt: liveAtDate ? format(liveAtDate, "yyyy-MM-dd") : '',
    expireAt: expireAtDate ? format(expireAtDate, "yyyy-MM-dd") : '',
    startTime: calendar.startTime,
    stopTime: calendar.stopTime,
    weekDays: { values: calendar.weekDays?.values || [] },
    createdAt: createdAtDate ? format(createdAtDate, "yyyy-MM-dd'T'HH:mm:ss") : '',
    updatedAt: updatedAtDate ? format(updatedAtDate, "yyyy-MM-dd'T'HH:mm:ss") : '',
  }
}

/**
 * Transforms a protobuf Slot message to a display-friendly format.
 * @param slot - The protobuf Slot message
 * @returns The slot display object with formatted date
 */
export function toCalendarSlotDisplay(slot: Slot): CalendarSlotDisplay {
  const slotDate = slot.date?.toDate()
  return {
    startTime: slot.startTime,
    stopTime: slot.stopTime,
    date: slotDate ? format(slotDate, "yyyy-MM-dd") : '',
    booked: slot.booked,
  }
}