import { Api } from './Api';

export const apiClient = new Api({
    baseURL: '/',
    withCredentials: true, // Важно для отправки cookie с sessionId
});
