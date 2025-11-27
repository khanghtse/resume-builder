import axios from 'axios';
// Thêm dòng này để kiểm tra xem nó in ra cái gì
console.log("Backend URL:", import.meta.env.VITE_BASE_URL);
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

export default api;