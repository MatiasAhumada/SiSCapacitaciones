import { useEffect, useState } from 'react';
import logo from '../../assets/simplificado_a_color.png';
import {
  getCategorias,
  postEgresoProfesor,
  postEgresoSiemple,
  postEgresoVendedor,
} from '../../services/Cajas.service';
import { getProfes } from '../../services/Profesores.service';
import { getVendedores, getVendID } from '../../services/Vendedores.service';
import { clientSuccessHandler, clientErrorHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES } from '../../constants/messages';
const CajaEgreso = () => {
  const idVende = localStorage.getItem('token');
  const [profesores, setProfesores] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [pause, setPause] = useState(false);
  const [vend, setVend] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelec, setCategoriaSelec] = useState(null);
  const [fecha, setFecha] = useState(new Date());
  const [formData, setFormData] = useState({
    fecha: '',
    tipo: 'EGRESO',
    metodoPago: '',
    monto: 0,
    descripcion: '',
    vendedorId: '',
    pagoVendedorId: '',
    profesorId: '',
    subcategoriaId: '',
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
        setFormData((prev) => ({
          ...prev,
          vendedorId: data.id,
        }));
      });
    };
    const getVends = async () => {
      await getVendedores()
        .then((data) => {
          setVendedores(data);
        })
        .catch((error) => {
          clientErrorHandler(error.message || 'Error al cargar vendedores');
        });
    };

    const categorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        clientErrorHandler(error.message || 'Error al cargar categorias');
      }
    };

    getVends();
    categorias();
    vendedor();

    const intervalId = setInterval(() => {
      setFecha(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [idVende]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeCategoria = async (e) => {
    const { value } = e.target;
    setCategoriaSelec(value);
    if (value === 'PROFESORES') {
      await getProfes().then((data) => {
        setProfesores(data);
      });
    }
  };
  const handleChangeSubCat = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, subcategoriaId: value }));
  };
  const categoriaActual = categorias.find((cat) => cat.nombre === categoriaSelec);

  const handleSubmit = async (e) => {
    const fechaISO = fecha.toISOString();
    e.preventDefault();
    setPause(true);

    const nuevoFormData = {
      ...formData,
      fecha: fechaISO,
    };
    console.log(nuevoFormData);
    try {
      if (categoriaSelec === 'PROFESORES') {
        await postEgresoProfesor(nuevoFormData);
      } else if (categoriaSelec === 'COMISIONES' || categoriaSelec === 'SUELDOS') {
        await postEgresoVendedor(nuevoFormData);
      } else {
        await postEgresoSiemple(nuevoFormData);
      }
      clientSuccessHandler(SUCCESS_MESSAGES.EGRESO_REGISTRADO);
    } catch (error) {
      clientErrorHandler(error.message || 'Error al registrar el egreso');
    } finally {
      setPause(false);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
        <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
          <div>
            <img src={logo} alt="Logo" width="50" />
          </div>

          <h2 className="my-auto principal">Egresos</h2>
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
              Vendedor
            </label>
            <div className="relative text-gray-400">
              <input
                type="string"
                name="vendedorId"
                id="vendedorId"
                disabled
                defaultValue={vend.name || ''}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
            </div>
          </div>
          <div className="pb-2">
            <label className="block mb-2 text-sm principal">Tipo de Movimiento</label>
            <input
              type="string"
              name="tipo"
              id="tipo"
              disabled
              defaultValue={'Egreso'}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            />
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
            <label className="block mb-2 text-sm principal">Categoria</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChangeCategoria}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            >
              <option value="">Seleccione</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {categoriaSelec && categoriaActual?.subcategorias.length > 0 && (
            <div>
              <label className="block mb-1">Subcategoría:</label>
              <select
                name="subcategoriaId"
                value={formData.subcategoriaId}
                onChange={handleChangeSubCat}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              >
                <option value="">Selecciona una subcategoría</option>
                {categoriaActual.subcategorias.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
          {categoriaSelec === 'PROFESORES' && (
            <div>
              <label className="block mb-1">Profesor</label>
              <select
                name="profesorId"
                value={formData.profesorId}
                onChange={handleChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              >
                <option value="">Selecciona un profesor</option>
                {profesores.map((pro) => (
                  <option key={pro.id} value={pro.id}>
                    {pro.name + ' ' + pro.apellido}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(categoriaSelec === 'SUELDOS' || categoriaSelec === 'COMISIONES') && (
            <div>
              <label className="block mb-1">Vendedor</label>
              <select
                name="pagoVendedorId"
                value={formData.pagoVendedorId}
                onChange={handleChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              >
                <option value="">Selecciona un vendedor</option>
                {vendedores.map((vend) => (
                  <option key={vend.id} value={vend.id}>
                    {vend.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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

export default CajaEgreso;
