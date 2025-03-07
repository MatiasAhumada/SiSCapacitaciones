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
//ALUMNOS

export const getAluID = async (id) => {
  try {
    const response = await axios.get(`${URL}/alumno/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener alumno", error.response?.data);
  }
};
export const getAlu = async (id) => {
  try {
    const response = await axios.get(`${URL}/alumno`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener alumno", error.response?.data);
  }
};

export const postAlu = async (alumno) => {
  try {
    const response = await axios.post(`${URL}/alumno`, alumno);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};

export const deleteAlumnoId = async (id) => {
  try {
    const response = await axios.delete(`${URL}/alumno/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//VENDEDOR
export const getVendedores = async () => {
  try {
    const response = await axios.get(`${URL}/vendedor`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};

export const getVendID = async (id) => {
  try {
    const response = await axios.get(`${URL}/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const postVend = async (vendedor) => {
  try {
    const response = await axios.post(`${URL}/vendedor`, vendedor);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};

export const deleteVend = async (id) => {
  try {
    const response = await axios.delete(`${URL}/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};

//SUCURSALES
export const getSucursales = async () => {
  try {
    const response = await axios.get(`${URL}/suc`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const getSucursalId = async (id) => {
  try {
    const response = await axios.get(`${URL}/suc/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const postSucursal = async (datos) => {
  try {
    const response = await axios.post(`${URL}/suc`, datos);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};

//CURSOS
export const getCursos = async () => {
  try {
    const response = await axios.get(`${URL}/curso`);

    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const deleteCurso = async (id) => {
  try {
    const response = await axios.delete(`${URL}/curso/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const postCurso = async (curso) => {
  try {
    const response = await axios.post(`${URL}/curso`, curso);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};

//COMISIONES
export const getComisiones = async () => {
  try {
    const response = await axios.get(`${URL}/comision`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const getComisionId = async (id) => {
  try {
    const response = await axios.get(`${URL}/comision/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};

//INSCRIPCIONES
export const postInscripcion = async (datos) => {
  try {
    const response = await axios.post(`${URL}/inscripcion`, datos);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};

//PROFESORES

export const getProfes = async () => {
  try {
    const response = await axios.get(`${URL}/profesor`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getProfesId = async (id) => {
  try {
    const response = await axios.get(`${URL}/profesor/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const postProfes = async (profesor) => {
  try {
    const response = await axios.post(`${URL}/profesor`,profesor);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProfesId = async (id) => {
  try {
    const response = await axios.delete(`${URL}/profesor/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
