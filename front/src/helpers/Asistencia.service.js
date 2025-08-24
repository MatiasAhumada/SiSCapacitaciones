import { API_URL } from "../constants/ApiUrl";
import axios from 'axios';

export const registrarAsistencia = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/comision/asistencia`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};