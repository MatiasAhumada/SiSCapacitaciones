import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const postAsistencia = async (asistencia) => {
  const response = await axios.post(`${API_URL}/asistencia`, asistencia);
  return response.data;
};
