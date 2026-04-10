import type { Dispatch, SetStateAction } from "react"

export interface CalendarFormData {
  title: string
  slotDuration: number
  liveAt: string
  expireAt: string
  startTime: number
  stopTime: number
  weekDays: number[]
}

export interface CalendarFormErrors {
  title?: string
  liveAt?: string
  expireAt?: string
  startTime?: string
  stopTime?: string
  weekDays?: string
}

export const ValidateCalendar = (formData: CalendarFormData, setErrors: Dispatch<SetStateAction<CalendarFormErrors>>): boolean => {
    const newErrors: CalendarFormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.liveAt) {
      newErrors.liveAt = "Start date is required"
    }

    if (!formData.expireAt) {
      newErrors.expireAt = "End date is required"
    }

    if (formData.liveAt && formData.expireAt && formData.liveAt >= formData.expireAt) {
      newErrors.expireAt = "End date must be after start date"
    }

    if (formData.startTime >= formData.stopTime) {
      newErrors.stopTime = "End hour must be after start hour"
    }

    if (formData.weekDays.length === 0) {
      newErrors.weekDays = "Select at least one day"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }