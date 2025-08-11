import { useEffect, useState } from 'react';
import CardInfo from './CardInfo';
import { useParams } from 'react-router-dom';
import { getSucursalId } from '../../helpers/Sucursales.service';
import { Spinner } from '../Spinner/Spinner';
import DashboardMetrics from '../DashboardMetrics/DashboardMetrics';

const IndexAdm = () => {
  const [sede, setSede] = useState({});
  const [pause, setPause] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    setPause(true);

    getSucursalId(id).then((data) => {
      setPause(false);
      setSede(data);
    });
  }, [id]);

  
  return (
    <div>
      {pause ? (
        <Spinner color="black" />
      ) : (
        <h1 className="text-center text-2xl font-bold principal">Información de {sede.name}</h1>
      )}
      <CardInfo sede={sede}></CardInfo>
      <DashboardMetrics />
    </div>
  );
};

export default IndexAdm;
