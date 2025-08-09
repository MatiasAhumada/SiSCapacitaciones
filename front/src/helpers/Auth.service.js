import { API_URL } from "../constants/ApiUrl";

export const login = async ({ name, password }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { name, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  };