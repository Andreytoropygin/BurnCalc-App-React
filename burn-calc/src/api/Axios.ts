import axios from 'axios';

export const Axios = axios.create({
  baseURL: '/',
  withCredentials: true, // для отправки/приёма cookie с sessionId
  headers: {
    'Content-Type': 'application/json',
  },
});
