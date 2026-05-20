// Замените на IP вашего компьютера в локальной сети (например, 192.168.1.X)
// Чтобы узнать IP: ipconfig (Windows) или ip addr (Linux/Mac)
const BACKEND_SOCK = "http://192.168.137.74:8000"; 

export const API_BASE = import.meta.env.DEV ? "" : `${BACKEND_SOCK}`;
