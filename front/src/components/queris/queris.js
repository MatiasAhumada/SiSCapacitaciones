import axios from "axios";
 const URL = "http://82.29.62.125:4040";
//const URL = "http://localhost:4040";

export const login = async ({ name, password }) => {
  try {
    const response = await axios.post(`${URL}/auth/login`, { name, password });
    return response.data;
  } catch (error) {
    console.error(error);
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
export const getVendID= async(id)=>{

  try {
    const response = await axios.get(`${URL}/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
}
export const postAlu= async(alumno)=>{

  try {
    const response = await axios.post(`${URL}/alumno`,alumno);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
}
export const getSucursales= async()=>{

  try {
    const response = await axios.get(`${URL}/suc`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
}
export const getSucursalId= async(id)=>{

  try {
    const response = await axios.get(`${URL}/suc/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
}
export const getCursos= async()=>{

  try {
    const response = await axios.get(`${URL}/curso`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
}
export const getComisiones= async()=>{

  try {
    const response = await axios.get(`${URL}/comision`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
}
export const getComisionId= async(id)=>{

  try {
    const response = await axios.get(`${URL}/comision/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
}
export const postInscripcion= async(datos)=>{

  try {
    const response = await axios.post(`${URL}/inscripcion`,datos);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
}
