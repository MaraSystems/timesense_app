export interface User {
  id: string
  email: string
  createdAt: string
}

export interface CreateUserRequest {
  email: string
}

export interface CreateUserResponse {
  success: boolean
  message: string
  data: User
}
