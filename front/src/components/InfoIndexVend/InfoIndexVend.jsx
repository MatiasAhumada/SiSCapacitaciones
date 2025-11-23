import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GetCajaByVendedor } from '../../services/Cajas.service';
import { getVendID } from '../../services/Vendedores.service';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES } from '../../constants/messages';

const InfoIndexVend = () => {
  const { user } = useAuth();
  const [vendedor, setVendedor] = useState(null);
  const [totalCaja, setTotalCaja] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const vendedor = async () => {
      try {
        const data = await getVendID(user.id);
        clientSuccessHandler(SUCCESS_MESSAGES.BIENVENIDO);
        setVendedor(data);
      } catch (error) {
        clientErrorHandler(error?.response?.data?.message || error?.message);
      }
    };

    const cajaVendedor = async () => {
      try {
        const data = await GetCajaByVendedor(user.id);
        setTotalCaja(data[0]?.totalEfectivo || 0);
      } catch (error) {
        clientErrorHandler(error?.response?.data?.message || error?.message);
      }
    };

    vendedor();
    cajaVendedor();
  }, [user?.id]);

  const stats = [
    { name: 'Inscripciones realizadas', value: vendedor?.inscripciones?.length || '0' },
    { name: 'Alumnos registrados', value: '300+' },
    { name: 'Total Caja Actual en efectivo', value: `$${totalCaja}` },
    { name: 'Paid time off', value: 'Unlimited' },
  ];

  return (
    <div className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div>
          <h2 className="principal text-5xl mb-3 sm:text-7xl">
            {vendedor ? vendedor.name : 'Cargando...'}
          </h2>
          <p className="mt-8 sm:text-xl/8">
            {vendedor && vendedor.sucursales.length > 0
              ? vendedor.sucursales[0].name
              : 'Sin sucursales'}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base/7">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default InfoIndexVend;
