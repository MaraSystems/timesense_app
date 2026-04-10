import type { User } from "../gen/timesense/v1/user_pb"

/**
 * Display model for user data in the UI.
 */
export interface UserDisplay {
  id: string
  email: string
  createdAt: string
}

/**
 * Request parameters for user registration.
 */
export interface RegisterRequest {
  email: string
  password: string
}

/**
 * Response from user registration.
 */
export interface RegisterResponse {
  success: boolean
  message: string
  data?: UserDisplay
}

/**
 * Response from user authentication containing user data and access token.
 */
export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: UserDisplay
    accessToken: string
  }
}

/**
 * Transforms a protobuf User message to a display-friendly format.
 * @param user - The protobuf User message
 * @returns The user display object with string IDs and formatted dates
 */
export function toUserDisplay(user: User): UserDisplay {
  return {
    id: user.id.toString(),
    email: user.email,
    createdAt: user.createdAt?.toDate()?.toISOString() || '',
  }
}