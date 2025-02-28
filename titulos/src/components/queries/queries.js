import axios from "axios";

const URL = "http://82.29.62.125:4040";

export const login = async ({ dni, email }) => {
  try {
    const response = await axios.post(`${URL}/alumno/login`, { dni, email });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión", error.response?.data);
  }
};
export const getAluID= async(id)=>{
  try {
    const response = await axios.get(`${URL}/alumno/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener alumno", error.response?.data);
  }
}