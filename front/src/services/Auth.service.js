import { API_URL } from "../constants/ApiUrl";
import axios from 'axios';

export const AuthLogin = async ({ name, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { name, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
