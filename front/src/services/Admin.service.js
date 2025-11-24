import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const putAdmin = async (id, admin) => {
  try {
    const response = await axios.put(`${API_URL}/admin/${id}`, admin);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
