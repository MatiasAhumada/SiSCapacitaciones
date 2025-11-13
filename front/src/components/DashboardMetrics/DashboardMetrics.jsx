import { useState, useEffect } from 'react';
import SalesChart from '../SalesChart/SalesChart';
import EnrollmentChart from '../EnrollmentChart/EnrollmentChart';
import MethodPaymentChart from '../MethodPaymentChart/MethodPaymentChart';
import SalesBySellerChart from '../SalesBySellerChart/SalesBySellerChart';
import {
  fetchSalesByMonth,
  fetchEnrollmentsByMonth,
  fetchPaymentMethods,
  fetchSalesBySeller,
} from '../../services/Metrics.service';

const DashboardMetrics = () => {
  const [salesData, setSalesData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [salesBySellerData, setSalesBySellerData] = useState([]);
  useEffect(() => {
    const getMetrics = async () => {
      try {
        const [sales, enrollments, payment, salesBySeller] = await Promise.all([
          await fetchSalesByMonth(),
          await fetchEnrollmentsByMonth(),
          await fetchPaymentMethods(),
          await fetchSalesBySeller(),
        ]);
        setSalesData(sales);
        setEnrollmentData(enrollments);
        setPaymentData(payment);
        setSalesBySellerData(salesBySeller);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      }
    };
    getMetrics();
  }, []);

  return (
    <div>
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Métricas y Análisis</h2>
        <p className="text-gray-600 text-sm">Visualización de datos clave del negocio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ventas por Mes */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fa-solid fa-chart-line text-white"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Cobros por Mes</h3>
          </div>
          <SalesChart data={salesData} />
        </div>

        {/* Gráfico de Inscripciones Nuevas */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fa-solid fa-user-plus text-white"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Inscripciones Nuevas</h3>
          </div>
          <EnrollmentChart data={enrollmentData} />
        </div>

        {/* Gráfico de Métodos de Pago */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fa-solid fa-credit-card text-white"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Métodos de Pago</h3>
          </div>
          <MethodPaymentChart data={paymentData} />
        </div>

        {/* Gráfico de Ventas por Vendedor */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fa-solid fa-trophy text-white"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Cobros por Vendedor</h3>
          </div>
          <SalesBySellerChart data={salesBySellerData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
