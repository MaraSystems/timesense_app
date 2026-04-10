import type { Dispatch, SetStateAction } from "react"
import { Recurrence } from "../gen/timesense/v1/appointment_pb"

export interface AppointmentFormData {
  title: string
  date: string
  startTime: number | null
  stopTime: number | null
  recurrence: Recurrence
  days: number[]
  months: number[]
}

export interface AppointmentFormErrors {
  title?: string
  date?: string
  timeSlot?: string
  days?: string
  weekDays?: string
  months?: string
}

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
