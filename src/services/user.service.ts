import { client } from './api'
import type { User } from '../gen/timesense/v1/user_pb'

export interface UserDisplay {
  id: string
  email: string
  createdAt: string
}

function toUserDisplay(user: User): UserDisplay {
  return {
    id: user.id.toString(),
    email: user.email,
    createdAt: user.createdAt?.toDate()?.toISOString() || '',
  }
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: UserDisplay
    accessToken: string
  }
}

export const createUser = async (email: string, password: string): Promise<{ success: boolean; message: string; data?: UserDisplay }> => {
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

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await client.login({ email, password })
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