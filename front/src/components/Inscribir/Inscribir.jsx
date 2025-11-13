import { useEffect, useState } from 'react';
import logo from '../../assets/simplificado_a_color.png';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { getComisiones } from '../../services/Comisiones.service';
import { getAluByDNI, postAluSimple } from '../../services/Alumnos.service';
import { postInscripcion } from '../../services/Inscripciones.service';
import { getVendedores } from '../../services/Vendedores.service';
import ComisionSelector from '../Common/ComisionSelector';

const Inscribir = () => {
  const { user } = useAuth();
  const [pause, setPause] = useState(false);
  const [comisiones, setComisiones] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [alumnoEncontrado, setAlumnoEncontrado] = useState(null);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    comisionId: '',
    vendedorId: '',
  });
  const [comisionSearch, setComisionSearch] = useState('');
  const [showComisiones, setShowComisiones] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [comisionesData, vendedoresData] = await Promise.all([
          getComisiones(1, 100),
          getVendedores(),
        ]);
        setComisiones(comisionesData.data || comisionesData);
        setVendedores(vendedoresData);
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar datos',
          text: 'Error al cargar los datos',
        });
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleComisionSelect = (comision) => {
    const comisionText = `${comision.name} - ${comision.curso?.name} (${comision.day} ${comision.hour?.start}-${comision.hour?.end})`;
    setComisionSearch(comisionText);
    setFormData({
      ...formData,
      comisionId: comision.id,
    });
    setShowComisiones(false);
  };

  const buscarAlumno = async () => {
    if (!formData.dni) return;

    try {
      const alumno = await getAluByDNI(formData.dni);
      setAlumnoEncontrado(alumno);
      setFormData({
        ...formData,
        nombre: alumno.name,
      });
      Swal.fire({
        icon: 'success',
        title: 'Alumno encontrado',
        text: `${alumno.name}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch {
      setAlumnoEncontrado(null);
      Swal.fire({
        icon: 'info',
        title: 'Alumno no encontrado',
        text: 'Deberá crear un nuevo alumno',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);

    try {
      // Si no existe el alumno, crearlo
      if (!alumnoEncontrado) {
        await postAluSimple({
          dni: formData.dni,
          name: formData.nombre,
        });
      }

      // Crear la inscripción
      await postInscripcion({
        alumnoId: formData.dni, // El backend espera DNI, no ID
        comisionId: formData.comisionId,
        vendedorId: formData.vendedorId,
        sucursalId: vendedores.find((v) => v.id === formData.vendedorId)?.sucursales?.[0]?.id || '', // Usar sucursal del vendedor seleccionado
        fechaRegistro: new Date().toISOString(),
        state: true,
      });

      Swal.fire({
        title: 'Inscripción realizada',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });

      // Limpiar formulario
      setFormData({
        dni: '',
        nombre: '',
        comisionId: '',
        vendedorId: user?.id,
      });
      setComisionSearch('');
      setAlumnoEncontrado(null);
    } catch (err) {
      Swal.fire({
        title: 'Error al inscribir',
        icon: 'error',
        text: err.response?.data?.message || err.message,
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
        <h2 className="my-auto principal">Inscribir Alumno</h2>
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="pb-2">
          <label htmlFor="dni" className="block mb-2 text-sm principal">
            DNI del Alumno
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="dni"
              id="dni"
              value={formData.dni}
              onChange={handleChange}
              className="flex-1 bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg p-2.5"
              placeholder="Ingrese DNI"
              required
            />
            <button
              type="button"
              onClick={buscarAlumno}
              className="px-4 py-2 btnAz text-white rounded"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="pb-2">
          <label htmlFor="nombre" className="block mb-2 text-sm principal">
            Nombre Completo
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg p-2.5"
            placeholder="Nombre del alumno"
            required
          />
        </div>

        <div className="pb-2">
          <label htmlFor="vendedorId" className="block mb-2 text-sm principal">
            Vendedor
          </label>
          <select
            name="vendedorId"
            id="vendedorId"
            value={formData.vendedorId}
            onChange={handleChange}
            className="w-full bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg p-2.5"
            required
          >
            <option value="">Seleccione un vendedor</option>
            {vendedores.map((vendedor) => (
              <option key={vendedor.id} value={vendedor.id}>
                {vendedor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pb-2">
          <label htmlFor="comisionSearch" className="block mb-2 text-sm principal">
            Comisión
          </label>
          <ComisionSelector
            comisiones={comisiones}
            selectedComisionId={formData.comisionId}
            onComisionSelect={handleComisionSelect}
            searchValue={comisionSearch}
            onSearchChange={setComisionSearch}
            showDropdown={showComisiones}
            onShowDropdown={setShowComisiones}
            placeholder="Buscar comisión..."
          />
        </div>

        {alumnoEncontrado && (
          <div className="pb-2 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-green-700">
              <strong>Alumno encontrado:</strong> {alumnoEncontrado.name}
            </p>
            <p className="text-sm text-green-600">
              Tel: {alumnoEncontrado.tel} | Email: {alumnoEncontrado.email}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
          disabled={pause}
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
      </form>
    </div>
  );
};

export default Inscribir;
