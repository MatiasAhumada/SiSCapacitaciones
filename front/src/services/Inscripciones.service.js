import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const postInscripcion = async (inscripcion) => {
  try {
    const response = await axios.post(`${API_URL}/inscripcion`, inscripcion);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
