import { client } from './api'
import type { User } from '../gen/timesense/v1/user_pb'
import { toUserDisplay, type AuthResponse, type RegisterRequest, type RegisterResponse } from '../models/user'

/**
 * Creates a new user account with the provided email and password.
 * @param email - The user's email address
 * @param password - The user's password
 * @returns Promise resolving to the registration response with user data on success
 */
export const createUser = async (email: string, password: string): Promise<RegisterResponse> => {
  const response = await client.createUser({ email, password })

  if (response.success && response.data) {
    return {
      success: true,
      message: response.message,
      data: toUserDisplay(response.data),
    }
  }

  return {
    success: response.success,
    message: response.message,
  }
}

/**
 * Authenticates a user with the provided credentials.
 * @param params - Object containing email and password
 * @returns Promise resolving to the authentication response with user data and access token on success
 */
export const login = async (params: RegisterRequest): Promise<AuthResponse> => {
  const response = await client.login(params)
  if (response.success && response.data) {
    return {
      success: true,
      message: response.message,
      data: {
        user: toUserDisplay(response.data.user as User),
        accessToken: response.data.accessToken,
      },
    }
  }

  return {
    success: response.success,
    message: response.message,
  }
}

/**
 * Retrieves a user by their ID.
 * @param id - The user's ID
 * @returns Promise resolving to the user data on success
 */
export const getUser = async (id: number) => {
  const response = await client.getUser({ id: BigInt(id) })
  return {
    success: response.success,
    message: response.message,
    data: response.data ? toUserDisplay(response.data) : undefined,
  }
}