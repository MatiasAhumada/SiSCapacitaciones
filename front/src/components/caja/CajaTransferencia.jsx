import { useEffect, useState } from 'react';
import logo from '../assets/simplificado_a_color.png';
import Swal from 'sweetalert2';
import {
  getVendedores,
  getVendID,
  postTransferencia,
} from '../queris/queris';
const CajaTransferencia = () => {
  const idVende = localStorage.getItem('token');
  const [vendedores, setVendedores] = useState([]);
  const [pause, setPause] = useState(false);
  const [vend, setVend] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelec, setCategoriaSelec] = useState(null);
  const [fecha, setFecha] = useState(new Date());
  const [formData, setFormData] = useState({
    fecha: '',
    metodoPago: '',
    monto: 0,
    descripcion: '',
    vendedorOrigenId: '',
    vendedorDestinoId: '',
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
      await getVendID(idVende)
        .then((data) => {
          setVend(data);
          setFormData((prev) => ({
            ...prev,
            vendedorOrigenId: data.id,
          }));
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar vendedor',
            text: error.message || 'Ocurrió un error al cargar el vendedor.',
          });
        });
    };
    const vendedores = async () => {
      await getVendedores()
        .then((data) => {
          setVendedores(data);
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar vendedores',
            text: error.message || 'Ocurrió un error al cargar los vendedores.',
          });
        });
    };

    vendedores();
    vendedor();

    const intervalId = setInterval(() => {
      setFecha(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const fechaISO = fecha.toISOString();
    e.preventDefault();
    setPause(true);

    const nuevoFormData = {
      ...formData,
      fecha: fechaISO,
    };
    console.log(nuevoFormData);
    setPause(false);

    await postTransferencia(nuevoFormData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Transferencia realizada correctamente',
          text: `Transferencia de ${nuevoFormData.monto} registrada exitosamente.`,
        });
        setPause(false);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar la transferencia',
          text: error.message || 'Ocurrió un error al registrar la transferencia.',
        });
        setPause(false);
      });
  };

  return (
    <>
      <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
        <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
          <div>
            <img src={logo} alt="Logo" width="50" />
          </div>

          <h2 className="my-auto principal">Transferencia de cajas</h2>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="pb-2">
            <label htmlFor="fecha" className="block mb-2 text-sm  principal">
              Fecha
            </label>
            <div className="relative text-gray-400">
              <input
                type="text"
                name="fecha"
                id="fecha"
                disabled
                defaultValue={formatToDisplay(fecha)}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
            </div>
          </div>
          <div className="pb-2">
            <label htmlFor="vendedor" className="block mb-2 text-sm  principal text-[#111827]">
              Enviar desde:
            </label>
            <div className="relative text-gray-400">
              <input
                type="string"
                name="vendedorOrigenId"
                id="vendedorOrigenId"
                disabled
                defaultValue={vend.name || ''}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
            </div>
          </div>

          <div className="pb-2">
            <label className="block mb-2 text-sm principal">Enviar hacia: </label>
            <select
              name="vendedorDestinoId"
              value={formData.vendedorDestinoId}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            >
              <option value="">Seleccione</option>
              {vendedores.map((ven) => (
                <option key={ven.id} value={ven.id}>
                  {ven.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pb-2">
            <label className="block mb-2 text-sm principal">Metodo de Pago</label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            >
              <option value="">Seleccione</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Credito">Credito</option>
              <option value="Digital Tobias">Digital Tobias</option>
              <option value="Digital Javier">Digital Javier</option>
            </select>
          </div>
          <div className="pb-2">
            <label htmlFor="descripcion" className="block mb-2 text-sm  principal text-[#111827]">
              Descripcion
            </label>
            <div className="relative text-gray-400">
              <input
                type="text"
                name="descripcion"
                id="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
            </div>
          </div>
          <div className="pb-2">
            <label htmlFor="monto" className="block mb-2 text-sm  principal text-[#111827]">
              Monto
            </label>
            <div className="relative text-gray-400">
              <input
                type="number"
                name="monto"
                id="monto"
                value={formData.monto}
                onChange={handleChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
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
              'Registrar Movimiento'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default CajaTransferencia;
