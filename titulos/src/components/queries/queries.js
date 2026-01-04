import axios from "axios";

const URL = import.meta.env.VITE_APP_URL;

// export const login = async ({ name, password }) => {
//   try {
//     const response = await axios.post(`${URL}/auth/login`, { name, password });
//     return response.data;
//   } catch (error) {
//     console.error("Error al iniciar sesión", error.response?.data);
//   }
// };
// export const getAluID= async(id)=>{
//   console.log(id)
//   try {
//     const response = await axios.get(`${URL}/alumno/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener alumno", error.response?.data);
//   }
// }
export const getCertId=async (numero)=>{
  try {
    const response=await axios.get(`${URL}/certificado/${numero}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener el certificado", error.response?.data)
    throw error
  }
}