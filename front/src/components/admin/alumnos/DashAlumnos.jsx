import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteAlumnoId } from '../../../helpers/Alumnos.service';
import { getAluSucID } from '../../../helpers/Alumnos.service';
import FilterAlus from './DropDowns/FilterAlus';
import { Spinner } from '../../Spinner/Spinner';
import Pagination from '../../Pagination/Pagination';

const DashAlumnos = () => {
  const initialItemPerPage = 10;

  const [tableItems, setTableItems] = useState([]);

  const [pause, setPause] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemPerPage);
  const [isFiltered, setIsFiltered] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  const location = useLocation();

  const isSubRoute = location.pathname.includes('crear');
  const click = (item) => {
    console.log(item.idAluCom[0]);
    const idAlu = item.idAluCom[0];
    if (!idAlu) {
      Swal.fire({
        title: 'No hay comisiones asignadas',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    navigate(`/adm/${id}/alumno/${idAlu}`, {
      state: { id: idAlu },
    });
  };
  const clickDelete = async (id) => {
    const alumnoId = id;

    setPause((prev) => ({ ...prev, [alumnoId]: true }));

    await deleteAlumnoId(id).then(() => {
      try {
        Swal.fire({
          title: 'Alumno Eliminado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause((prev) => {
            const newPause = { ...prev };
            delete newPause[alumnoId];
            return newPause;
          });
          peticionAlumnos(currentPage);
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const peticionAlumnos = async (page = 1, perPage = itemsPerPage) => {
    try {
      const data = await getAluSucID(id, page, perPage);
      setTableItems(data.data);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
      setTotalAlumnos(data.totalItems || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    peticionAlumnos(currentPage);
  }, [currentPage, id]);

  const filtrarAlumnos = async (filtros, setPaused) => {
    const hayFiltros = Object.values(filtros).some((v) => v !== '');
    if (!hayFiltros) {
      setItemsPerPage(initialItemPerPage);
      setCurrentPage(1);
      await peticionAlumnos(1, initialItemPerPage);
      setIsFiltered(false);
      setPaused(false);
      return;
    }
    setItemsPerPage(totalAlumnos);
    await peticionAlumnos(currentPage);
    const resultado = tableItems.filter((alumno) => {
      return (
        (!filtros.nombre || alumno.name.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
        (!filtros.dni || alumno.dni.includes(filtros.dni)) &&
        (!filtros.tel || alumno.tel.includes(filtros.tel)) &&
        (!filtros.cantidadComisiones ||
          alumno.cantidadComisiones === parseInt(filtros.cantidadComisiones)) &&
        (!filtros.cantidadCertificados ||
          alumno.cantidadCertificados === parseInt(filtros.cantidadCertificados))
      );
    });
    setIsFiltered(true);
    setTableItems(resultado);
    setPaused(false);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {!isSubRoute && (
        <>
          <div className="items-start justify-between md:flex">
            <div className="max-w-lg">
              <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
                Listado de alumnos.
              </h3>
              <p className="text-gray-600 mt-2">
                En esta tabla estaran todos los alumnos de esta sucursal
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center">
              <FilterAlus onFiltrar={filtrarAlumnos} />

              <button
                onClick={() => navigate(`/adm/${id}/alumnos/crear`)}
                className="w-full md:w-auto px-4 py-2 text-white principal btnAz md:text-sm"
              >
                Nuevo Alumno
              </button>
            </div>
          </div>
          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm  text-center">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
                <tr>
                  <th className="py-3 px-6">Nombre y Apellido</th>
                  <th className="py-3 px-6">DNI</th>
                  <th className="py-3 px-6">Telefono</th>
                  <th className="py-3 px-6">Comision/s</th>
                  <th className="py-3 px-6">Certificados</th>

                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {tableItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.dni}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.tel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.cantidadComisiones}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.cantidadCertificados}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* BOTON VER MAS */}
                      <button
                        type="button"
                        value={item.id}
                        onClick={() => click(item)}
                        className="px-4 py-2 ms-3 btnAz principal md:text-sm rounded"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>

                      {/* BOTON BORRAR */}
                      <button
                        value={item.id}
                        onClick={() => clickDelete(item.id)}
                        className=" px-4 py-2 ms-3 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                      >
                        {pause[item.id] ? (
                          <Spinner color="white" />
                        ) : (
                          <i className="fa-solid fa-x"></i>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isFiltered ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          ) : null}
        </>
      )}
      <Outlet />
    </div>
  );
};

export default DashAlumnos;
