import { client } from './api'
import { Timestamp } from '@bufbuild/protobuf'
import { Recurrence } from '../gen/timesense/v1/appointment_pb'
import { toAppointmentDisplay, type CreateAppointmentParams, type UpdateAppointmentParams, type ListAppointmentsParams } from '../models/appointment'

export const createAppointment = async (data: CreateAppointmentParams) => {
  const response = await client.createAppointment({
    calendarId: BigInt(data.calendarId),
    title: data.title,
    startTime: data.startTime,
    stopTime: data.stopTime,
    days: { values: data.days },
    months: { values: data.months },
    recurrence: data.recurrence,
    liveAt: Timestamp.fromDate(new Date(data.liveAt)),
    expireAt: Timestamp.fromDate(new Date(data.expireAt)),
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data ? toAppointmentDisplay(response.data) : undefined,
  }
}

export const getAppointment = async (id: string) => {
  const response = await client.getAppointment({
    id: BigInt(id),
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data ? toAppointmentDisplay(response.data) : undefined,
  }
}

export const listAppointments = async (params: ListAppointmentsParams) => {
  const response = await client.listAppointments({
    calendarId: params.calendarId ? BigInt(params.calendarId) : undefined,
    limit: params.limit,
    offset: params.offset,
    liveAt: params.liveAt ? Timestamp.fromDate(new Date(params.liveAt)) : undefined,
    expireAt: params.expireAt ? Timestamp.fromDate(new Date(params.expireAt)) : undefined,
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data ? response.data.map(toAppointmentDisplay) : [],
  }
}

export const updateAppointment = async (id: string, data: UpdateAppointmentParams) => {
  const response = await client.updateAppointment({
    id: BigInt(id),
    title: data.title,
    startTime: data.startTime,
    stopTime: data.stopTime,
    days: data.days ? { values: data.days } : undefined,
    months: data.months ? { values: data.months } : undefined,
    recurrence: data.recurrence,
    liveAt: data.liveAt ? Timestamp.fromDate(new Date(data.liveAt)) : undefined,
    expireAt: data.expireAt ? Timestamp.fromDate(new Date(data.expireAt)) : undefined,
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data ? toAppointmentDisplay(response.data) : undefined,
  }
}

export const deleteAppointment = async (id: string) => {
  const response = await client.deleteAppointment({
    id: BigInt(id),
  })

  return {
    success: response.success,
    message: response.message,
  }
}

export { Recurrence }