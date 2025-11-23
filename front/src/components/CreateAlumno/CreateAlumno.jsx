import { useEffect, useState } from 'react';
import { getSucursales } from '../../services/Sucursales.service';
import { postAlu, editAlumnoId, getAluByDNI } from '../../services/Alumnos.service';
import { Spinner } from '../Spinner/Spinner';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const CreateAlumno = () => {
  const [pause, setPause] = useState(false);
  const [edit, setEdit] = useState(false);
  const [formAlu, setFormAlu] = useState({
    dni: '',
    name: '',
    fNac: '',
    tel: '',
    telex: '',
    ocupation: '',
    nationality: '',
    address: '',
    province: '',
    locality: '',
    email: '',
    age: '',
    gender: '',
    sucursalId: '',
  });
  const [sucursales, setSucursales] = useState([]);
  const [searchDni, setSearchDni] = useState('');
  const genero = [{ label: 'Masculino' }, { label: 'Femenino' }, { label: 'Otros' }];
  const ocupacion = [{ label: 'Estudiante' }, { label: 'Trabajador' }, { label: 'Retirado' }];
  const formFields = [
    { name: 'dni', label: 'DNI', type: 'number' },
    { name: 'name', label: 'Nombre Completo', type: 'text' },
    { name: 'fNac', label: 'Fecha de Nacimiento', type: 'date' },
    { name: 'tel', label: 'Teléfono', type: 'number' },
    { name: 'telex', label: 'Teléfono Alternativo', type: 'number' },
    { name: 'age', label: 'Edad', type: 'number' },
    { name: 'gender', label: 'Género', type: 'select', options: genero },
    { name: 'ocupation', label: 'Ocupación', type: 'select', options: ocupacion },
    { name: 'nationality', label: 'Nacionalidad', type: 'text' },
    { name: 'address', label: 'Dirección', type: 'text' },
    { name: 'province', label: 'Provincia', type: 'text' },
    { name: 'locality', label: 'Localidad', type: 'text' },
    { name: 'email', label: 'Correo Electrónico', type: 'email' },
    {
      name: 'sucursalId',
      label: 'Sucursal',
      type: 'select',
      options: sucursales.map((s) => ({ label: s.name, value: s.id })),
    },
  ];

  useEffect(() => {
    getSucursales().then((data) => {
      setSucursales(data);
    });
  }, []);

  const handleChange = (e) => {
    setFormAlu({ ...formAlu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setPause(true);
    try {
      const data = await postAlu(formAlu);
      setPause(false);
      setFormAlu((prev) => ({ ...prev, alumnoId: data.id, sucursalId: formAlu.sucursalId }));
      clientSuccessHandler(SUCCESS_MESSAGES.ALUMNO_CREADO);
      setFormAlu({
        dni: '',
        name: '',
        fNac: '',
        tel: '',
        telex: '',
        ocupation: '',
        nationality: '',
        address: '',
        province: '',
        locality: '',
        email: '',
        age: '',
        gender: '',
        sucursalId: '',
      });
    } catch (error) {
      clientErrorHandler(error?.response?.data?.message || error?.message);
      setPause(false);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await getAluByDNI(searchDni);
      const formattedData = {
        ...data,
        fNac: data.fNac ? new Date(data.fNac).toISOString().split('T')[0] : '',
        sucursalId: data.sucursal?.id || '',
      };
      clientSuccessHandler(SUCCESS_MESSAGES.ALUMNO_ENCONTRADO);
      setSearchDni('');
      setEdit(true);
      setFormAlu(formattedData);
    } catch (error) {
      clientErrorHandler(error?.message || ERROR_MESSAGES.ERROR_ALUMNO_NO_ENCONTRADO);
      setEdit(false);
    }
  };

  const handleEdit = async () => {
    const { id, ...restoData } = formAlu;
    try {
      await editAlumnoId(id, restoData);
      clientSuccessHandler(SUCCESS_MESSAGES.ALUMNO_ACTUALIZADO);
      setEdit(false);
      setSearchDni('');
      setFormAlu({
        dni: '',
        name: '',
        fNac: '',
        tel: '',
        telex: '',
        ocupation: '',
        nationality: '',
        address: '',
        province: '',
        locality: '',
        email: '',
        age: '',
        gender: '',
        sucursalId: '',
      });
    } catch (error) {
      clientErrorHandler(error?.message || ERROR_MESSAGES.ERROR_ACTUALIZAR_PAGO);
    }
  };

  return (
    <>
      <div className="flex flex-col p-2 max-w-md mx-auto">
        <p className="text-gray-700 font-semibold text-center text-lg">Buscar DNI</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Buscar por DNI"
            value={searchDni}
            onChange={(e) => setSearchDni(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-2 w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="btnAz text-white px-4 py-2 rounded-lg transition"
          >
            Buscar
          </button>
        </div>
      </div>
      <div className="p-4 border rounded-lg shadow-md text-center">
        <h2 className="text-lg principal">Cargar Alumno</h2>
        <p>Ingrese información del alumno.</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {formFields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label htmlFor={field.name} className="mb-1 text-sm">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formAlu[field.name]}
                  onChange={handleChange}
                  className="p-2 border rounded"
                >
                  <option value="">Seleccione una opción</option>
                  {(field.options || []).map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formAlu[field.name]}
                  onChange={handleChange}
                  placeholder={field.label}
                  className="p-2 border rounded"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          {edit ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-green-700 hover:bg-green-500 text-white rounded"
            >
              {pause ? <Spinner /> : 'Editar Alumno'}
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-4 py-2 btnAz rounded">
              {pause ? <Spinner /> : 'Cargar Alumno'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateAlumno;
