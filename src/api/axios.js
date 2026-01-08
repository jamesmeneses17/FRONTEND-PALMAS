import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api/v1', // Puerto del backend
});

// Interceptor para agregar el token si existe (prepárate para el futuro)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
