import api from './axios'; // Tu instancia de Axios configurada con el .env

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data; // Esto devuelve el array de los 10 productos de la BD
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
};