import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetCajaByVendedor, getVendID } from '../../queris/queris';
import Swal from 'sweetalert2';

const InfoIndexVend = () => {
  const [vendedor, setVendedor] = useState(null);
  const [totalCaja, setTotalCaja] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem('token');

    const vendedor = async () => {
      await getVendID(id).then((data) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido!',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setVendedor(data);
          });
        }
      });
    };

    const cajaVendedor = async () => {
      await GetCajaByVendedor(id).then((data) => {
        try {
          const total = data.reduce((acc, item) => {
            const monto = parseFloat(item.monto) || 0;
            return item.tipo === 'transferencia' || item.tipo === 'egreso'
              ? acc - monto
              : acc + monto;
          }, 0);

          setTotalCaja(total);
        } catch (error) {
          console.log(error);
        }
      });
    };
    vendedor();
    cajaVendedor();
  }, []);

  const stats = [
    { name: 'Inscripciones realizadas', value: vendedor?.inscripciones?.length || '0' },
    { name: 'Alumnos registrados', value: '300+' },
    { name: 'Caja actual', value: `$${totalCaja}` },
    { name: 'Paid time off', value: 'Unlimited' },
  ];

  const navigate = useNavigate();

  const click = (name) => {
    navigate(`/inicioVendedor/${name.toLowerCase()}`);
  };

  return (
    <div className="relative isolate overflow-hidden  py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div>
          <h2 className="principal text-5xl mb-3  sm:text-7xl">
            {vendedor ? vendedor.name : 'Cargando...'}
          </h2>

          <p className="mt-8 sm:text-xl/8">
            {' '}
            {vendedor && vendedor.sucursales.length > 0
              ? vendedor.sucursales[0].name
              : 'Sin sucursales'}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 ">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight ">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default InfoIndexVend;
