import { client } from './api'
import { Timestamp } from '@bufbuild/protobuf'
import { Recurrence } from '../gen/timesense/v1/appointment_pb'
import { toAppointmentDisplay, toSlotDisplay, type CreateAppointmentParams, type UpdateAppointmentParams, type ListAppointmentsParams } from '../models/appointment'

/**
 * Creates a new appointment.
 * @param data - The appointment creation parameters
 * @returns Promise resolving to the created appointment data on success
 */
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

/**
 * Retrieves an appointment by its ID.
 * @param id - The appointment ID
 * @returns Promise resolving to the appointment data on success
 */
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

/**
 * Lists appointments with optional filtering and pagination.
 * @param params - Filtering parameters including calendarId, bookerId, dates, and pagination
 * @returns Promise resolving to a list of appointments
 */
export const listAppointments = async (params: ListAppointmentsParams) => {
  const response = await client.listAppointments({
    calendarId: params.calendarId ? BigInt(params.calendarId) : undefined,
    bookerId: params.bookerId ? BigInt(params.bookerId) : undefined,
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

/**
 * Updates an existing appointment.
 * @param id - The appointment ID to update
 * @param data - The update parameters
 * @returns Promise resolving to the updated appointment data on success
 */
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

/**
 * Deletes an appointment by its ID.
 * @param id - The appointment ID to delete
 * @returns Promise resolving to success status and message
 */
export const deleteAppointment = async (id: string) => {
  const response = await client.deleteAppointment({
    id: BigInt(id),
  })

  return {
    success: response.success,
    message: response.message,
  }
}

/**
 * Retrieves appointment time slots within a specified date range.
 * @param id - The appointment ID
 * @param params - Optional date range parameters (liveAt, expireAt)
 * @returns Promise resolving to a paginated list of appointment slots
 */
export const getAppointmentSlots = async (id: string, params?: { liveAt?: string; expireAt?: string }) => {
  const response = await client.getAppointmentSlots({
    id: BigInt(id),
    liveAt: params?.liveAt ? Timestamp.fromDate(new Date(params.liveAt)) : undefined,
    expireAt: params?.expireAt ? Timestamp.fromDate(new Date(params.expireAt)) : undefined,
  })

  return {
    success: response.success,
    message: response.message,
    data: response.data?.data ? {
      data: response.data.data.map(toSlotDisplay),
      next: response.data.next || false,
    } : undefined,
  }
}

export { Recurrence }