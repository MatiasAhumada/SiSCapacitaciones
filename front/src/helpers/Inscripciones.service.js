import { API_URL } from "../constants/ApiUrl";

export const postInscripcion = async (datos) => {
    try {
      const response = await axios.post(`${API_URL}/inscripcion`, datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  };