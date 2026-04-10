import type { User } from "../gen/timesense/v1/user_pb"

export interface UserDisplay {
  id: string
  email: string
  createdAt: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: UserDisplay
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: UserDisplay
    accessToken: string
  }
}

export function toUserDisplay(user: User): UserDisplay {
  return {
    id: user.id.toString(),
    email: user.email,
    createdAt: user.createdAt?.toDate()?.toISOString() || '',
  }
}