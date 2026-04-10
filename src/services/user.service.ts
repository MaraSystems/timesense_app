import { client } from './api'
import type { User } from '../gen/timesense/v1/user_pb'
import { toUserDisplay, type AuthResponse, type RegisterRequest, type RegisterResponse } from '../models/user'

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

export const getUser = async (id: number) => {
  const response = await client.getUser({ id: BigInt(id) })
  return {
    success: response.success,
    message: response.message,
    data: response.data ? toUserDisplay(response.data) : undefined,
  }
}