import axios from "axios";

const URL = "http://82.29.62.125:4040";

export const login = async ({name,password}) => {
 
  try {
    const response = await axios.post(`${URL}/admin/login`, {name, password });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión", error.response?.data);
  }
};
