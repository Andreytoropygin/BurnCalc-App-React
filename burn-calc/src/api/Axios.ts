import axios from 'axios';

export const Axios = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true, // для отправки/приёма cookie с sessionId
  headers: {
    'Content-Type': 'application/json',
  },
});
