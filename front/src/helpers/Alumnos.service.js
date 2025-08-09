import { API_URL } from "../constants/ApiUrl";

export const getAluSucID = async (dni) => {
    try {
      const response = await axios.get(`${API_URL}/alumno/sucursal/${dni}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getAluID = async (dni) => {
    try {
      const response = await axios.get(`${API_URL}/alumno/search/${dni}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getAluByDNI = async (dni) => {
    try {
      const response = await axios.get(`${API_URL}/alumno/buscar?dni=${dni}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const getAlu = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/alumno`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const postAlu = async (alumno) => {
    try {
      const response = await axios.post(`${API_URL}/alumno`, alumno);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const postAluSimple = async (alumno) => {
    try {
      const response = await axios.post(`${API_URL}/alumno/simple`, alumno);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteAlumnoId = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/alumno/remove/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const editAlumnoId = async (id,dataAlu) => {
    try {
      const response = await axios.put(`${API_URL}/alumno/edit/${id}`,dataAlu);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  