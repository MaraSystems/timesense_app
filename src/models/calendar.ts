import type { Calendar, CalendarSlot } from "../gen/timesense/v1/calendar_pb"
import { format } from "date-fns"

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

export interface CalendarSlotDisplay {
  startTime: number
  stopTime: number
  date: string
  booked: boolean
}

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

export const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
]

export const SLOT_DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
]

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

export function toCalendarSlotDisplay(slot: CalendarSlot): CalendarSlotDisplay {
  const slotDate = slot.date?.toDate()
  return {
    startTime: slot.startTime,
    stopTime: slot.stopTime,
    date: slotDate ? format(slotDate, "yyyy-MM-dd") : '',
    booked: slot.booked,
  }
}