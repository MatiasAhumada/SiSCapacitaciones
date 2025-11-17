import { useEffect, useState } from 'react';
import logo from '../../assets/simplificado_a_color.png';
import Swal from 'sweetalert2';
import { getAlu, getAluID } from '../../services/Alumnos.service';
import { useAuth } from '../../context/AuthContext';
import { postCaja, postIngresoSimple } from '../../services/Cajas.service';
import { descargarComprobantePDF } from '../../services/Comprobantes.service';

import { Spinner } from '../Spinner/Spinner';
const CreateCaja = () => {
  const { user } = useAuth();
  const [movimientoId, setMovimientoId] = useState(null);
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
  const [cuotaVieja, setCuotaVieja] = useState(false);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [pause, setPause] = useState(false);
  const [alumnoComisiones, setAlumnocomisiones] = useState([]);
  const [alu, setAlu] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [tipoIngreso, setTipoIngreso] = useState('Ingreso');
  const [formData, setFormData] = useState({
    fecha: '',
    metodoPago: '',
    tipo: '',
    descripcion: '',
    vendedorId: '',
    alumnoComisionId: '',
    monto: '',
    cuota: '',
    mesCuota: '',
    comprobante: {
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
    },
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
    const alumnos = async () => {
      await getAlu().then((data) => {
        try {
          setAlu(data);
        } catch (error) {
          console.log(error);
        }
      });
    };

    alumnos();
    setFormData((prev) => ({
      ...prev,
      vendedorId: user?.id,
    }));

    const intervalId = setInterval(() => {
      setFecha(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);

    try {
      if (!formData.metodoPago) throw new Error('El método de pago es obligatorio');
      if (!formData.monto || formData.monto <= 0) throw new Error('El monto debe ser mayor a cero');
      
      if (tipoIngreso === 'Ingreso') {
        if (!alumnoSeleccionado) throw new Error('Debe seleccionar un alumno válido');
        if (alumnoComisiones.length === 0) throw new Error('El alumno seleccionado no tiene comisiones asignadas');
        if (!formData.cuota) throw new Error('El número de cuota es obligatorio');
      }
      
      if ((tipoIngreso === 'Cobro Varios' || tipoIngreso === 'Certificacion Examen') && alumnoSeleccionado && alumnoComisiones.length === 0) {
        throw new Error('El alumno seleccionado no tiene comisiones asignadas');
      }

      const { tipo, descripcion, monto, metodoPago } = e.target;

      const fechaISO = fecha.toISOString();

      const cargaComprobante = {
        ...infoComprobante,
        fecha: cuotaVieja ? formData.fecha : fechaISO,
        formaPago: metodoPago.value,
        observacion: descripcion.value,
        monto: monto.value,
        tipoComprobante: 'Factura de venta',
        numero: '-',
        ...alumnoSeleccionado,
      };

      setInfoComprobante(cargaComprobante);

      let response;
      
      if (tipoIngreso === 'Ingreso' || (alumnoSeleccionado && (tipoIngreso === 'Cobro Varios' || tipoIngreso === 'Certificacion Examen'))) {
        const nuevoFormData = {
          ...formData,
          fecha: cuotaVieja ? formData.fecha : fechaISO,
          metodoPago: metodoPago.value,
          descripcion: descripcion.value,
          monto: monto.value,
          tipo: tipo.value,
          vendedorId: user?.id,
          comprobante: cargaComprobante,
        };
        response = await postCaja(nuevoFormData);
      } else {
        const ingresoSimpleData = {
          tipo: tipoIngreso,
          metodoPago: metodoPago.value,
          monto: monto.value,
          descripcion: descripcion.value,
          fecha: cuotaVieja ? formData.fecha : fechaISO,
          vendedorId: user?.id,
        };
        response = await postIngresoSimple(ingresoSimpleData);
      }
      
      if (response) {
        Swal.fire({
          title: 'Ingreso Registrado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          if (tipoIngreso === 'Ingreso' || (alumnoSeleccionado && (tipoIngreso === 'Cobro Varios' || tipoIngreso === 'Certificacion Examen'))) {
            setMovimientoId(response.id);
            setGeneratePDF(true);
          }
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar el movimiento',
        text: error.message || 'Error inesperado,intente nuevamente',
      });
    } finally {
      setPause(false);
    }
  };

  const handleDescargarPDF = async () => {
    try {
      await descargarComprobantePDF(movimientoId);
      Swal.fire({
        icon: 'success',
        title: 'Comprobante descargado',
        text: 'El comprobante se ha descargado correctamente',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al descargar comprobante',
        text: error.message,
      });
    }
  };
  const handleAlumnoClick = async (e) => {
    e.preventDefault();
    setPause(true);
    try {
      await getAluID(alu)
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            alumnoComisionId: data.id,
          }));
          setAlumnocomisiones(data.alumnoComisiones);
          setAlumnoSeleccionado({
            apellidoNombre: data.name,
            dni: data.dni,
            domicilioComercial: `${data.address}, ${data.locality}`,
            iva: '-',
            numeroSucursal: '000' + data.sucursal.numeroSucursal,
          });
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se encontró el alumno, verifique el ID ingresado.`,
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

            <h2 className="my-auto principal">Ingresos</h2>
          </div>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="pb-2">
              <label htmlFor="fecha" className="block mb-2 text-sm principal">
                Fecha
              </label>
              <div className="relative text-gray-400">
                <input
                  type={cuotaVieja ? "date" : "text"}
                  name="fecha"
                  id="fecha"
                  disabled={!cuotaVieja}
                  value={cuotaVieja ? (formData.fecha?.split('T')[0] || '') : formatToDisplay(fecha)}
                  onChange={handleChange}
                  className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="cuotaVieja"
                  checked={cuotaVieja}
                  onChange={(e) => setCuotaVieja(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="cuotaVieja" className="ml-2 text-sm text-gray-700">
                  Cobrar cuota vieja
                </label>
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
                  defaultValue={user?.name || ''}
                  className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                />
              </div>
            </div>
            <div className="pb-2">
              <label className="block mb-2 text-sm principal">Tipo de Ingreso</label>
              <select
                name="tipoIngreso"
                value={tipoIngreso}
                onChange={(e) => setTipoIngreso(e.target.value)}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              >
                <option value="Ingreso">Cobro de Cuota</option>
                <option value="Aporte">Aporte</option>
                <option value="Cobro Varios">Cobro Varios</option>
                <option value="Certificacion Examen">Certificación de Examen</option>
              </select>
            </div>
            <input type="hidden" name="tipo" value={tipoIngreso} />

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
                <option value="Ferro">Ferro</option>
              </select>
            </div>
            {(tipoIngreso === 'Ingreso' || tipoIngreso === 'Cobro Varios' || tipoIngreso === 'Certificacion Examen') && (
              <>
                <div className="pb-2">
                  <div className="pb-2">
                    <label htmlFor="cuota" className="block mb-2 text-sm principal text-[#111827]">
                      Alumno {tipoIngreso !== 'Ingreso' && '(Opcional)'}
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
                    {pause ? <Spinner color="white"></Spinner> : 'Buscar'}
                  </button>
                </div>
              </div>
              {alumnoSeleccionado && (
                <>
                  <div className="text-sm text-gray-700 mb-2">
                    Alumno encontrado: {alumnoSeleccionado.apellidoNombre}
                  </div>
                  <div className="pb-2">
                    <label className="block mb-2 text-sm principal">Comisiones Del Alumno</label>
                    <select
                      name="alumnoComisionId"
                      value={formData.alumnoComisionId}
                      onChange={handleChange}
                      className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                    >
                      <option value="">Seleccione Comision</option>
                      {alumnoComisiones.map((alu) => (
                        <option key={alu.id} value={alu.id}>
                          {alu.comision?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
                </div>
              </>
            )}

            {tipoIngreso === 'Ingreso' && (
              <>
                <div className="pb-2">
                  <label htmlFor="cuota" className="block mb-2 text-sm principal text-[#111827]">
                    N° de Cuota
                  </label>
                  <div className="relative text-gray-400">
                    <input
                      type="number"
                      name="cuota"
                      id="cuota"
                      value={formData.cuota}
                      onChange={handleChange}
                      className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                    />
                  </div>
                </div>

                <div className="pb-2">
                  <label htmlFor="mesCuota" className="block mb-2 text-sm principal text-[#111827]">
                    Mes de Cuota
                  </label>
                  <div className="relative text-gray-400">
                    <select
                      name="mesCuota"
                      id="mesCuota"
                      value={formData.mesCuota}
                      onChange={handleChange}
                      className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                    >
                      <option value="">Seleccione un mes</option>
                      <option value="Enero">Enero</option>
                      <option value="Febrero">Febrero</option>
                      <option value="Marzo">Marzo</option>
                      <option value="Abril">Abril</option>
                      <option value="Mayo">Mayo</option>
                      <option value="Junio">Junio</option>
                      <option value="Julio">Julio</option>
                      <option value="Agosto">Agosto</option>
                      <option value="Septiembre">Septiembre</option>
                      <option value="Octubre">Octubre</option>
                      <option value="Noviembre">Noviembre</option>
                      <option value="Diciembre">Diciembre</option>
                    </select>
                  </div>
                </div>
              </>
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
              {pause ? <Spinner color="white"></Spinner> : 'Registrar Ingreso'}
            </button>
            {generatePDF && (tipoIngreso === 'Ingreso' || tipoIngreso === 'Cobro Varios' || tipoIngreso === 'Certificacion Examen') && (
              <button
                type="button"
                onClick={handleDescargarPDF}
                className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 mt-2"
              >
                Descargar Comprobante
              </button>
            )}
          </form>
    </div>
  );
};

export default CreateCaja;
