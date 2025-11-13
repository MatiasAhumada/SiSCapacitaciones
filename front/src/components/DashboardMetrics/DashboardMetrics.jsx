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
  fetchAvailableYears,
  fetchAvailableSellers,
} from '../../services/Metrics.service';

const DashboardMetrics = () => {
  const [salesData, setSalesData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [salesBySellerData, setSalesBySellerData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableSellers, setAvailableSellers] = useState([]);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [selectedEnrollmentSellers, setSelectedEnrollmentSellers] = useState([]);
  const [selectedEnrollmentMonths, setSelectedEnrollmentMonths] = useState([]);

  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  useEffect(() => {
    const loadYears = async () => {
      const years = await fetchAvailableYears();
      setAvailableYears(years);
    };
    const loadSellers = async () => {
      const sellers = await fetchAvailableSellers();
      setAvailableSellers(sellers);
    };
    loadYears();
    loadSellers();
  }, []);

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const [sales, enrollments, payment, salesBySeller] = await Promise.all([
          fetchSalesByMonth(selectedYear),
          fetchEnrollmentsByMonth(selectedEnrollmentSellers, selectedEnrollmentMonths),
          fetchPaymentMethods(),
          fetchSalesBySeller(selectedSellers),
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
  }, [selectedYear, selectedSellers, selectedEnrollmentSellers, selectedEnrollmentMonths]);

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fa-solid fa-chart-line text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Cobranzas por Mes</h3>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los años</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <SalesChart data={salesData} />
        </div>

        {/* Gráfico de Inscripciones Nuevas */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fa-solid fa-user-plus text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Inscripciones Nuevas</h3>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => document.getElementById('enrollment-sellers-dropdown').classList.toggle('hidden')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                >
                  <i className="fa-solid fa-user"></i>
                  Vendedores
                  {selectedEnrollmentSellers.length > 0 && (
                    <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {selectedEnrollmentSellers.length}
                    </span>
                  )}
                </button>
                <div id="enrollment-sellers-dropdown" className="hidden absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 max-h-72 overflow-y-auto">
                  <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 font-semibold text-sm rounded-t-xl">
                    Seleccionar Vendedores
                  </div>
                  {availableSellers.map((seller) => (
                    <label key={seller.id} className="flex items-center px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedEnrollmentSellers.includes(seller.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEnrollmentSellers([...selectedEnrollmentSellers, seller.id]);
                          } else {
                            setSelectedEnrollmentSellers(selectedEnrollmentSellers.filter(id => id !== seller.id));
                          }
                        }}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                      />
                      <span className="text-sm text-gray-700 font-medium">{seller.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => document.getElementById('enrollment-months-dropdown').classList.toggle('hidden')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                >
                  <i className="fa-solid fa-calendar"></i>
                  Meses
                  {selectedEnrollmentMonths.length > 0 && (
                    <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {selectedEnrollmentMonths.length}
                    </span>
                  )}
                </button>
                <div id="enrollment-months-dropdown" className="hidden absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 max-h-72 overflow-y-auto">
                  <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 font-semibold text-sm rounded-t-xl">
                    Seleccionar Meses
                  </div>
                  {months.map((month) => (
                    <label key={month.value} className="flex items-center px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedEnrollmentMonths.includes(month.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEnrollmentMonths([...selectedEnrollmentMonths, month.value]);
                          } else {
                            setSelectedEnrollmentMonths(selectedEnrollmentMonths.filter(m => m !== month.value));
                          }
                        }}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                      />
                      <span className="text-sm text-gray-700 font-medium">{month.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fa-solid fa-trophy text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Cobros por Vendedor</h3>
            </div>
            <div className="relative">
              <button
                onClick={() => document.getElementById('sellers-dropdown').classList.toggle('hidden')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                <i className="fa-solid fa-filter"></i>
                Vendedores
                {selectedSellers.length > 0 && (
                  <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {selectedSellers.length}
                  </span>
                )}
              </button>
              <div id="sellers-dropdown" className="hidden absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 max-h-72 overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 font-semibold text-sm rounded-t-xl">
                  Seleccionar Vendedores
                </div>
                {availableSellers.map((seller) => (
                  <label key={seller.id} className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedSellers.includes(seller.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSellers([...selectedSellers, seller.id]);
                        } else {
                          setSelectedSellers(selectedSellers.filter(id => id !== seller.id));
                        }
                      }}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mr-3"
                    />
                    <span className="text-sm text-gray-700 font-medium">{seller.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <SalesBySellerChart data={salesBySellerData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
