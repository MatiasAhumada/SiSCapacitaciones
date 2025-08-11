// src/components/DashboardMetrics.jsx
import React, { useState, useEffect } from 'react';
import SalesChart from './SalesCharts';
import EnrollmentChart from './EnrollmentChart';
import MethodPaymentChart from './MethodPaymentChart';
// import { fetchSalesData, fetchEnrollmentData } from '../api/metrics'; // Asumimos una API

const DashboardMetrics = () => {
  const [salesData, setSalesData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  
  useEffect(() => {
    // Lógica para obtener los datos de la API
    const getMetrics = async () => {
      const sales = await fetchSalesData();
      const enrollments = await fetchEnrollmentData();
      setSalesData(sales);
      setEnrollmentData(enrollments);
    };
    getMetrics();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Métricas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Componente para el gráfico de ventas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ventas por Mes</h2>
          <SalesChart data={salesData} />
        </div>

        {/* Componente para el gráfico de inscripciones */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Inscripciones Nuevas</h2>
          <EnrollmentChart data={enrollmentData} />
        </div>

        {/* Componente para el gráfico de métodos de pago */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Métodos de Pago</h2>
          <MethodPaymentChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;