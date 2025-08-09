import { API_URL } from '../constants/ApiUrl';

export const getCursos = async () => {
  try {
    const response = await axios.get(`${API_URL}/curso`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteCurso = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/curso/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const postCurso = async (curso) => {
  try {
    const response = await axios.post(`${API_URL}/curso`, curso);
    return response.data;
  } catch (error) {
    throw error;
  }
};
