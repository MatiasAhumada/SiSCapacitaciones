import { useEffect, useState } from 'react';
import logo from '../../../../assets/simplificado_a_color.png';
import Swal from 'sweetalert2';
import {
  getAluID,
  getComisiones,
  getVendedores,
  getVendID,
  postInscripcion,
} from '../../../queris/queris';
const Inscribir = () => {
  const idVende = localStorage.getItem('token');
  const [pause, setPause] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [vend, setVend] = useState({});
  const [vendedores, setVendedores] = useState([]);
  const [sucursal, setSucursal] = useState({});
  const [alu, setAlu] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [comisiones, setComisiones] = useState([]);
  const [dataInscripcion, setDataInscipcion] = useState({
    fechaRegistro: '',
    vendedorId: idVende,
    alumnoId: '',
    comisionId: '',
    sucursalId: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoComprobante, setInfoComprobante] = useState({
    apellidoNombre: '',
    dni: '',
    domicilioComercial: '',
    iva: '',
    numeroSucursal: '',
    fecha: '',
    formaPago: '',
    observacion: '',
    monto: '',
    tipoComprobante: '',
    numero: '',
  });
  const [generatePDF, setGeneratePDF] = useState(false);
  const [imprimir, setImprimir] = useState({
    tipoComprobante: 'Factura de venta',
  });

  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes} `;
  };

  useEffect(() => {
    const vendedor = async () => {
      await getVendID(idVende).then((data) => {
        setVend(data);
        setSucursal(data.sucursales[0]);
      });
    };
    const comisiones = async () => {
      await getComisiones().then((data) => {
        setComisiones(data);
      });
    };
    const vendedores = async () => {
      await getVendedores(idVende).then((data) => {
        setVendedores(data);
      });
    };

    vendedores();
    vendedor();
    comisiones();

    const intervalId = setInterval(() => {
      setFecha(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataInscipcion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAlumnoClick = async (e) => {
    e.preventDefault();
    setPause(true);
    await getAluID(alu)
      .then((data) => {
        if (data) {
          setAlumnoSeleccionado(data);
          setDataInscipcion((prevState) => ({
            ...prevState,
            fechaRegistro: fecha,
            sucursalId: sucursal.id,
            alumnoId: data.dni,
          }));
          setPause(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró el alumno',
          });
          setPause(false);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el alumno:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);

    try {
      await postInscripcion(dataInscripcion);
      Swal.fire({
        icon: 'success',
        title: 'Inscripción exitosa',
        text: 'El alumno ha sido inscrito correctamente.',
      });
    } catch (error) {
      let errorMsg = 'No se pudo inscribir al alumno.';

      if (error.response?.data?.message) {
        errorMsg = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: `Error ${error.response?.status || ''}`,
        text: errorMsg,
      });
    } finally {
      setPause(false);
    }
  };
  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>

        <h2 className="my-auto principal">Inscripcion</h2>
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="pb-2">
          <label htmlFor="fecha" className="block mb-2 text-sm  principal">
            Fecha
          </label>
          <div className="relative text-gray-400">
            <input
              type="text"
              name="fechaRegistro"
              id="fechaRegistro"
              disabled
              defaultValue={formatToDisplay(fecha)}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="vendedor" className="block mb-2 text-sm  principal text-[#111827]">
            Vendedor
          </label>
          <div className="relative text-gray-400">
            <select
              name="vendedorId"
              id="vendedorId"
              value={dataInscripcion.vendedorId || ''}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            >
              <option value="" disabled>
                Seleccione un vendedor
              </option>
              {vendedores.map((vendedor) => (
                <option key={vendedor.id} value={vendedor.id}>
                  {vendedor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="pb-2">
          <label className="block mb-2 text-sm principal">Sucursal</label>
          <div className="relative text-gray-400">
            <input
              type="string"
              name="sucursalId"
              id="sucursalId"
              disabled
              defaultValue={sucursal.name || ''}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            />
          </div>
        </div>

        <div className="pb-2">
          <label htmlFor="cuota" className="block mb-2 text-sm  principal text-[#111827]">
            Alumno
          </label>

          <div className="relative text-gray-400">
            <input
              type="number"
              name="alumnoId"
              id="alumnoId"
              value={alu}
              onChange={(e) => setAlu(e.target.value)}
              className="w-full bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400   p-3 pr-20"
              placeholder="ID del alumno"
            />
            <button
              type="button"
              onClick={handleAlumnoClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btnAz text-white text-sm px-4 py-1.5 rounded-md min-w-[100px] flex items-center justify-center"
            >
              {pause ? (
                <svg
                  fill="white"
                  className="w-6 h-6 mx-auto"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      dur="0.75s"
                      values="0 12 12;360 12 12"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              ) : (
                'Buscar'
              )}
            </button>
          </div>
        </div>
        {alumnoSeleccionado && (
          <div className="text-sm text-gray-700 mb-2">
            Alumno encontrado: {alumnoSeleccionado.name} {alumnoSeleccionado.lastname}
          </div>
        )}
        <div className="pb-2">
          <label htmlFor="comisionId" className="block mb-2 text-sm principal text-[#111827]">
            Comisión
          </label>
          <div className="relative text-gray-400">
            <select
              name="comisionId"
              id="comisionId"
              value={dataInscripcion.comisionId}
              onChange={handleChange}
              className="mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5"
            >
              <option value="">Seleccione una comisión</option>
              {comisiones.map((comision) => (
                <option key={comision.id} value={comision.id}>
                  {comision.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
        >
          {pause ? (
            <svg
              fill="white"
              className="w-6 h-6 mx-auto"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="0.75s"
                  values="0 12 12;360 12 12"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          ) : (
            'Inscribir Alumno'
          )}
        </button>
        {generatePDF && (
          <button
            type="button"
            onClick={handleOpen}
            className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 mt-2"
          >
            Generar PDF
          </button>
        )}
      </form>
      {/* <Modal title="Comprobante" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <ReciboComprobante {...imprimir}></ReciboComprobante>
        </Modal> */}
    </div>
  );
};

export default Inscribir;
