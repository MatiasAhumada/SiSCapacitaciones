import { API_URL } from "../constants/ApiUrl";

export const postCert = async (cert) => {
    try {
      const response = await axios.post(`${API_URL}/certificado`, cert);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  