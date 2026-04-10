import { client } from './api'
import { Timestamp } from '@bufbuild/protobuf'
import { toCalendarDisplay, toCalendarSlotDisplay, type CreateCalendarParams, type UpdateCalendarParams } from '../models/calendar'


export const createCalendar = async (data: CreateCalendarParams) => {
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

export const deleteCalendar = async (id: string) => {
  const response = await client.deleteCalendar({
    id: BigInt(id),
  })

  return {
    success: response.success,
    message: response.message,
  }
}

export const updateCalendar = async (id: string, data: UpdateCalendarParams) => {
  const response = await client.updateCalendar({
    id: BigInt(id),
    title: data.title,
    slotDuration: data.slotDuration,
    liveAt: data.liveAt ? Timestamp.fromDate(new Date(data.liveAt)) : undefined,
    expireAt: data.expireAt ? Timestamp.fromDate(new Date(data.expireAt)) : undefined,
    startTime: data.startTime,
    stopTime: data.stopTime,
    weekDays: data.weekDays ? { values: data.weekDays.values } : undefined,
    allowOverlap: data.allowOverlap,
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data ? toCalendarDisplay(response.data) : undefined,
  }
}

export const getCalendarSlots = async (id: string, params?: { liveAt?: string; expireAt?: string }) => {
  const response = await client.getCalendarSlots({
    id: BigInt(id),
    liveAt: params?.liveAt ? Timestamp.fromDate(new Date(params.liveAt)) : undefined,
    expireAt: params?.expireAt ? Timestamp.fromDate(new Date(params.expireAt)) : undefined,
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data?.data ? {
      data: response.data.data.map(toCalendarSlotDisplay),
      next: response.data.next || false,
    } : undefined,
  }
}