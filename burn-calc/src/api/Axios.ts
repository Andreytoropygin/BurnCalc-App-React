import axios from 'axios';
import { API_BASE } from '../config';

export const Axios = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // для отправки/приёма cookie с sessionId
  headers: {
    'Content-Type': 'application/json',
  },
});
