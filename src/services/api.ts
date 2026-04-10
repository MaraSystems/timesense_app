import { createClient, type Interceptor } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { TimeSenseService } from '../gen/timesense/v1/service_timesense_connect';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

const authInterceptor: Interceptor = (next) => async (req) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    req.header.set('Authorization', `Bearer ${token}`);
  }
  return next(req);
}

const logoutInterceptor: Interceptor = (next) => async (req) => {
  try {
    return await next(req);
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthenticated')) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    throw error;
  }
}

const transport = createGrpcWebTransport({
  baseUrl: API_URL,
  interceptors: [
    authInterceptor,
    logoutInterceptor
  ]
})

export const client = createClient(TimeSenseService, transport)
