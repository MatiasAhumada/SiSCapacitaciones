import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};
