import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const postAsistencia = async (asistencia) => {
  try {
    const response = await axios.post(`${API_URL}/asistencia`, asistencia);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
