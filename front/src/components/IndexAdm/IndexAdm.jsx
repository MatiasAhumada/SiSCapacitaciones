import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSucursalId } from '../../services/Sucursales.service';
import { Spinner } from '../Spinner/Spinner';
import DashboardMetrics from '../DashboardMetrics/DashboardMetrics';
import CardInfo from '../CardInfo/CardInfo';

const IndexAdm = () => {
  const { user } = useAuth();
  const [sede, setSede] = useState({});
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!user?.sucursalId) return;
    
    setPause(true);
    getSucursalId(user.sucursalId).then((data) => {
      setPause(false);
      setSede(data);
    });
  }, [user?.sucursalId]);

  return (
    <div>
      {pause ? (
        <Spinner color="black" />
      ) : (
        <h1 className="text-center text-2xl font-bold principal">Información de {sede.name}</h1>
      )}
      <CardInfo sede={sede} />
      <DashboardMetrics />
    </div>
  );
};

export default IndexAdm;