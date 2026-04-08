import { client } from './api'
import { Timestamp } from '@bufbuild/protobuf'
import type { Calendar } from '../gen/timesense/v1/calendar_pb'

// Helper to convert Calendar from protobuf to display format
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

function toCalendarDisplay(calendar: Calendar): CalendarDisplay {
  return {
    id: calendar.id.toString(),
    ownerId: calendar.ownerId.toString(),
    title: calendar.title,
    slotDuration: calendar.slotDuration,
    liveAt: calendar.liveAt?.toDate()?.toISOString() || '',
    expireAt: calendar.expireAt?.toDate()?.toISOString() || '',
    startTime: calendar.startTime,
    stopTime: calendar.stopTime,
    weekDays: { values: calendar.weekDays?.values || [] },
    createdAt: calendar.createdAt?.toDate()?.toISOString() || '',
    updatedAt: calendar.updatedAt?.toDate()?.toISOString() || '',
  }
}

export const createCalendar = async (data: {
  title: string
  slotDuration: number
  liveAt: string
  expireAt: string
  startTime: number
  stopTime: number
  weekDays: { values: number[] }
  allowOverlap: boolean
}) => {
  const response = await client.createCalendar({
    title: data.title,
    slotDuration: data.slotDuration,
    liveAt: Timestamp.fromDate(new Date(data.liveAt)),
    expireAt: Timestamp.fromDate(new Date(data.expireAt)),
    startTime: data.startTime,
    stopTime: data.stopTime,
    weekDays: { values: data.weekDays.values },
    allowOverlap: data.allowOverlap,
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data ? toCalendarDisplay(response.data) : undefined,
  }
}

export const listCalendars = async (params?: { ownerId?: string; limit?: number; offset?: number }) => {
  const response = await client.listCalendars({
    ownerId: params?.ownerId ? BigInt(params.ownerId) : undefined,
    limit: params?.limit,
    offset: params?.offset,
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data ? {
      limit: response.data.limit,
      offset: response.data.offset,
      data: response.data.data.map(toCalendarDisplay),
      next: response.data.next,
    } : undefined,
  }
}

export const getCalendar = async (id: string) => {
  const response = await client.getCalendar({
    id: BigInt(id),
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data ? toCalendarDisplay(response.data) : undefined,
  }
}

export const deleteCalendar = async (id: string, ownerId?: string) => {
  const response = await client.deleteCalendar({
    id: BigInt(id),
    ownerId: ownerId ? BigInt(ownerId) : undefined,
  })

  return {
    success: response.success,
    message: response.message,
  }
}