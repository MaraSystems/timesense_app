import { createClient, type Interceptor } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { TimeSenseService } from '../gen/timesense/v1/service_timesense_connect';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const authInterceptor: Interceptor = (next) => async (req) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    req.header.set('Authorization', `Bearer ${token}`);
  }
  return next(req);
}

const transport = createGrpcWebTransport({
  baseUrl: API_URL,
  interceptors: [
    authInterceptor
  ]
})

export const client = createClient(TimeSenseService, transport)
