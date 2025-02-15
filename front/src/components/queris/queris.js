const URL = "http://localhost:3001/api/sucursales";
export const fetchSucursal = async (id) => {
  try {
    const response = await fetch(URL + `/${id}`); // Tu endpoint real
    return response
  } catch (error) {
    console.error("Error al cargar la sucursal:", error);
  }
};
