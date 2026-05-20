import { Api } from './Api';
import { API_BASE } from '../config';

export const apiClient = new Api({
    baseURL: API_BASE,
    withCredentials: true, // Важно для отправки cookie с sessionId
    headers: {
        'Content-Type': 'application/json',
    }
});
