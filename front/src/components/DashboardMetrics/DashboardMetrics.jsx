import React, { useState, useEffect } from 'react';
import SalesChart from './SalesChart';
import EnrollmentChart from './EnrollmentChart';
import MethodPaymentChart from './MethodPaymentChart';
import SalesBySellerChart from './SalesBySellerChart';
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
    <div className="p-8 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-center">
        {/* Gráfico de Ventas por Mes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ventas por Mes</h2>
          <SalesChart data={salesData} />
        </div>

        {/* Gráfico de Inscripciones Nuevas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Inscripciones Nuevas</h2>
          <EnrollmentChart data={enrollmentData} />
        </div>

        {/* Gráfico de Métodos de Pago */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Métodos de Pago</h2>
          <MethodPaymentChart data={paymentData} />
        </div>

        {/* Nuevo Gráfico de Ventas por Vendedor */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ventas por Vendedor</h2>
          <SalesBySellerChart data={salesBySellerData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
