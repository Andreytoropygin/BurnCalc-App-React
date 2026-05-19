import { Api } from './Api';

export const apiClient = new Api({
    baseURL: 'http://localhost:8000/',
    withCredentials: true, // Важно для отправки cookie с sessionId
});
