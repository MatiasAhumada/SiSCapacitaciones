import axios from "axios";

const URL = import.meta.env.VITE_APP_URL;

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
export const deleteComision = async (id) => {
  try {
    const response = await axios.delete(`${URL}/comision/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const getComisionBySucursal = async (id) => {
  try {
    const response = await axios.get(`${URL}/comision/suc/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const postComision = async (comision) => {
  try {
    const response = await axios.post(`${URL}/comision`, comision);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vendedor", error.response?.data);
  }
};
export const putComision = async (id, comision) => {
  try {
    const response = await axios.put(`${URL}/comision/${id}`, comision);
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
    const response = await axios.post(`${URL}/profesor`, profesor);
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

//CAJA
export const GetCajaByVendedor = async (id) => {
  try {
    const response = await axios.get(`${URL}/caja/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteMovCaja = async (id) => {
  try {
    const response = await axios.delete(`${URL}/caja/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const editMovCaja = async (id, mov) => {
  try {
    const response = await axios.put(`${URL}/caja/${id}`, mov);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const postCaja = async (movimiento) => {
  try {
    const response = await axios.post(`${URL}/caja`, movimiento);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getCajas = async () => {
  try {
    const response = await axios.get(`${URL}/caja`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getMovimientosPorDia = async (fecha) => {
  try {
    const response = await axios.get(`${URL}/caja/movimientos/${fecha}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getResumenPorDia = async (fecha) => {
  try {
    const response = await axios.get(`${URL}/caja/resumen/${fecha}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getResumenTotal = async () => {
  try {
    const response = await axios.get(`${URL}/caja/resumen-total`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//CERTIFICADOS

export const postCert = async (cert) => {
  try {
    const response = await axios.post(`${URL}/certificado`, cert);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
