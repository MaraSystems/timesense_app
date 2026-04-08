import { createClient } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { TimeSenseService } from '../gen/timesense/v1/service_timesense_connect';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const transport = createGrpcWebTransport({
  baseUrl: API_URL,
  interceptors: []
})

export const client = createClient(TimeSenseService, transport)
