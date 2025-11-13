import { useState, useEffect } from 'react';
import SalesChart from '../SalesChart/SalesChart';
import EnrollmentChart from '../EnrollmentChart/EnrollmentChart';
import MethodPaymentChart from '../MethodPaymentChart/MethodPaymentChart';
import SalesBySellerChart from '../SalesBySellerChart/SalesBySellerChart';
import FilterButton from './FilterButton';
import {
  fetchSalesByMonth,
  fetchEnrollmentsByMonth,
  fetchPaymentMethods,
  fetchSalesBySeller,
  fetchAvailableYears,
  fetchAvailableSellers,
  fetchAvailableCourses,
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
  const [selectedSalesSellers, setSelectedSalesSellers] = useState([]);
  const [selectedEnrollmentSellers, setSelectedEnrollmentSellers] = useState([]);
  const [selectedEnrollmentMonths, setSelectedEnrollmentMonths] = useState([]);
  const [selectedEnrollmentYear, setSelectedEnrollmentYear] = useState('');
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedPaymentSellers, setSelectedPaymentSellers] = useState([]);
  const [selectedSellerMonth, setSelectedSellerMonth] = useState('');

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
    const loadCourses = async () => {
      const courses = await fetchAvailableCourses();
      setAvailableCourses(courses);
    };
    loadYears();
    loadSellers();
    loadCourses();
  }, []);

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const [sales, enrollments, payment, salesBySeller] = await Promise.all([
          fetchSalesByMonth(selectedYear, selectedSalesSellers),
          fetchEnrollmentsByMonth(
            selectedEnrollmentSellers,
            selectedEnrollmentMonths,
            selectedEnrollmentYear,
            selectedCourse
          ),
          fetchPaymentMethods(selectedPaymentMonth, selectedPaymentSellers),
          fetchSalesBySeller(selectedSellers, selectedSellerMonth),
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
  }, [
    selectedYear,
    selectedSellers,
    selectedEnrollmentSellers,
    selectedEnrollmentMonths,
    selectedSalesSellers,
    selectedEnrollmentYear,
    selectedPaymentMonth,
    selectedCourse,
    selectedPaymentSellers,
    selectedSellerMonth,
  ]);

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Métricas y Análisis</h2>
        <p className="text-gray-600 text-xs sm:text-sm">Visualización de datos clave del negocio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Cobranzas por Mes */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fa-solid fa-chart-line text-white text-sm"></i>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Cobranzas por Mes</h3>
            </div>
            <FilterButton
              color="blue"
              activeFiltersCount={
                [selectedYear, selectedSalesSellers.length > 0].filter(Boolean).length
              }
              dropdownId="sales-filters"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 font-semibold text-sm rounded-t-xl">
                Filtros de Cobranzas
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los años</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendedores</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {availableSellers.map((seller) => (
                      <label
                        key={seller.id}
                        className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSalesSellers.includes(seller.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSalesSellers([...selectedSalesSellers, seller.id]);
                            } else {
                              setSelectedSalesSellers(
                                selectedSalesSellers.filter((id) => id !== seller.id)
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">{seller.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FilterButton>
          </div>
          <SalesChart data={salesData} />
        </div>

        {/* Inscripciones Nuevas */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fa-solid fa-user-plus text-white text-sm"></i>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Inscripciones Nuevas</h3>
            </div>
            <FilterButton
              color="green"
              activeFiltersCount={
                [
                  selectedEnrollmentSellers.length > 0,
                  selectedEnrollmentMonths.length > 0,
                  selectedEnrollmentYear,
                  selectedCourse,
                ].filter(Boolean).length
              }
              dropdownId="enrollment-filters"
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 font-semibold text-sm rounded-t-xl">
                Filtros de Inscripciones
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                  <select
                    value={selectedEnrollmentYear}
                    onChange={(e) => setSelectedEnrollmentYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Año actual</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Todos los cursos</option>
                    {availableCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendedores</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {availableSellers.map((seller) => (
                      <label
                        key={seller.id}
                        className="flex items-center px-3 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEnrollmentSellers.includes(seller.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEnrollmentSellers([
                                ...selectedEnrollmentSellers,
                                seller.id,
                              ]);
                            } else {
                              setSelectedEnrollmentSellers(
                                selectedEnrollmentSellers.filter((id) => id !== seller.id)
                              );
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">{seller.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meses</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {months.map((month) => (
                      <label
                        key={month.value}
                        className="flex items-center px-3 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEnrollmentMonths.includes(month.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEnrollmentMonths([
                                ...selectedEnrollmentMonths,
                                month.value,
                              ]);
                            } else {
                              setSelectedEnrollmentMonths(
                                selectedEnrollmentMonths.filter((m) => m !== month.value)
                              );
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">{month.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FilterButton>
          </div>
          <EnrollmentChart data={enrollmentData} />
        </div>

        {/* Métodos de Pago */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fa-solid fa-credit-card text-white text-sm"></i>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Métodos de Pago</h3>
            </div>
            <FilterButton
              color="purple"
              activeFiltersCount={
                [selectedPaymentMonth, selectedPaymentSellers.length > 0].filter(Boolean).length
              }
              dropdownId="payment-filters"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 font-semibold text-sm rounded-t-xl">
                Filtros de Métodos de Pago
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                  <select
                    value={selectedPaymentMonth}
                    onChange={(e) => setSelectedPaymentMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Todos los meses</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendedores</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {availableSellers.map((seller) => (
                      <label
                        key={seller.id}
                        className="flex items-center px-3 py-2 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPaymentSellers.includes(seller.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPaymentSellers([...selectedPaymentSellers, seller.id]);
                            } else {
                              setSelectedPaymentSellers(
                                selectedPaymentSellers.filter((id) => id !== seller.id)
                              );
                            }
                          }}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">{seller.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FilterButton>
          </div>
          <MethodPaymentChart data={paymentData} />
        </div>

        {/* Cobros por Vendedor */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fa-solid fa-trophy text-white text-sm"></i>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Cobros por Vendedor</h3>
            </div>
            <FilterButton
              color="orange"
              activeFiltersCount={selectedSellerMonth ? 1 : 0}
              dropdownId="sellers-filters"
            >
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 font-semibold text-sm rounded-t-xl">
                Filtros de Cobros
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                  <select
                    value={selectedSellerMonth}
                    onChange={(e) => setSelectedSellerMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Todos los meses</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </FilterButton>
          </div>
          <SalesBySellerChart data={salesBySellerData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
