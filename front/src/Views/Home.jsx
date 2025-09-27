import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSucursales } from '../components/queris/queris';
import { Spinner } from '../components/Spinner/Spinner';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sedes, setSedes] = useState([]);

  useEffect(() => {
    setLoading(true);
    getSucursales().then((data) => {
      setSedes(data);
      setLoading(false);
    });
  }, []);

  const handleClick = (id) => {
    navigate(`/adm/${id}`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 ">
          {sedes.map((sede) => (
            <div
              key={sede.id}
              onClick={() => handleClick(sede.id)}
              className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-start border-l-4 border-blue-500
                         hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">{sede.name}</h2>

              <div className="flex justify-between text-gray-700 mb-2">
                <span className="font-semibold">Profesores:</span>
                <span>{sede.profesores}</span>
              </div>

              <div className="flex justify-between text-gray-700 mb-2">
                <span className="font-semibold">Vendedores:</span>
                <span>{sede.vendedores}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Alumnos:</span>
                <span>{sede.alumnos}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
