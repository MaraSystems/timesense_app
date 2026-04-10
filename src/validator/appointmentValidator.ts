import type { Dispatch, SetStateAction } from "react"
import { Recurrence } from "../gen/timesense/v1/appointment_pb"

/**
 * Form data for appointment creation and editing.
 */
export interface AppointmentFormData {
  title: string
  date: string
  startTime: number | null
  stopTime: number | null
  recurrence: Recurrence
  days: number[]
  months: number[]
}

/**
 * Validation errors for appointment form fields.
 */
export interface AppointmentFormErrors {
  title?: string
  date?: string
  timeSlot?: string
  days?: string
  weekDays?: string
  months?: string
}

/**
 * Validates appointment form data and sets error messages.
 * @param formData - The form data to validate
 * @param setErrors - State setter for error messages
 * @returns True if form is valid, false otherwise
 */
export const ValidateAppointment = (formData: AppointmentFormData, setErrors: Dispatch<SetStateAction<AppointmentFormErrors>>): boolean => {
    const newErrors: AppointmentFormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    // Date and time required for one-time appointments
    if (formData.recurrence === Recurrence.UNSPECIFIED) {
      if (!formData.date) {
        newErrors.date = "Date is required"
      }

      if (formData.startTime === null || formData.stopTime === null) {
        newErrors.timeSlot = "Please select a time slot"
      }
    } else {
      // Time required for recurring appointments
      if (formData.startTime === null || formData.stopTime === null) {
        newErrors.timeSlot = "Please select a time"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
}