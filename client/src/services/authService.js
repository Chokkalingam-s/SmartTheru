import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = (data) => axios.post(`${API_BASE_URL}/auth/login`, data);
