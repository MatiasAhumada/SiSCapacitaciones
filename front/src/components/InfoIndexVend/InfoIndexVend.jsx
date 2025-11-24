import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GetCajaByVendedor } from '../../services/Cajas.service';
import { getVendID } from '../../services/Vendedores.service';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES } from '../../constants/messages';
import SalesChart from '../SalesChart/SalesChart';
import EnrollmentChart from '../EnrollmentChart/EnrollmentChart';
import MethodPaymentChart from '../MethodPaymentChart/MethodPaymentChart';
import FilterButton from '../DashboardMetrics/FilterButton';
import {
  fetchSalesByMonth,
  fetchEnrollmentsByMonth,
  fetchPaymentMethods,
  fetchAvailableYears,
  fetchAvailableCourses,
} from '../../services/Metrics.service';

const InfoIndexVend = () => {
  const { user } = useAuth();
  const [vendedor, setVendedor] = useState(null);
  const [totalCaja, setTotalCaja] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEnrollmentMonths, setSelectedEnrollmentMonths] = useState([]);
  const [selectedEnrollmentYear, setSelectedEnrollmentYear] = useState('');
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

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
    if (!user?.id) return;

    const loadVendedor = async () => {
      try {
        const data = await getVendID(user.id);
        clientSuccessHandler(SUCCESS_MESSAGES.BIENVENIDO);
        setVendedor(data);
      } catch (error) {
        clientErrorHandler(error?.response?.data?.message || error?.message);
      }
    };

    const loadCaja = async () => {
      try {
        const data = await GetCajaByVendedor(user.id);
        setTotalCaja(data[0]?.totalEfectivo || 0);
      } catch (error) {
        clientErrorHandler(error?.response?.data?.message || error?.message);
      }
    };

    const loadYears = async () => {
      const years = await fetchAvailableYears();
      setAvailableYears(years);
    };

    const loadCourses = async () => {
      const courses = await fetchAvailableCourses();
      setAvailableCourses(courses);
    };

    loadVendedor();
    loadCaja();
    loadYears();
    loadCourses();

    const interval = setInterval(loadCaja, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    if (!vendedor?.id) return;

    const getMetrics = async () => {
      try {
        const [sales, enrollments, payment] = await Promise.all([
          fetchSalesByMonth(selectedYear, [vendedor.id]),
          fetchEnrollmentsByMonth(
            [vendedor.id],
            selectedEnrollmentMonths,
            selectedEnrollmentYear,
            selectedCourse
          ),
          fetchPaymentMethods(selectedPaymentMonth, [vendedor.id]),
        ]);
        setSalesData(sales);
        setEnrollmentData(enrollments);
        setPaymentData(payment);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      }
    };
    getMetrics();
  }, [
    vendedor?.id,
    selectedYear,
    selectedEnrollmentMonths,
    selectedEnrollmentYear,
    selectedPaymentMonth,
    selectedCourse,
  ]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
            {vendedor?.img ? (
              <img src={vendedor.img} alt={vendedor.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Bienvenido</p>
            <h2 className="text-4xl md:text-5xl font-bold">
              {vendedor ? vendedor.name : 'Cargando...'}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white border-opacity-20">
          <div className="flex items-center gap-2">
            <span className="text-xl opacity-90">🏛️</span>
            <span className="text-lg font-medium">
              {vendedor && vendedor.sucursales.length > 0
                ? vendedor.sucursales[0].name
                : 'Sin sucursales'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl opacity-90">✉️</span>
            <span className="text-lg font-medium">{vendedor?.email || 'Sin email'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl opacity-90">📞</span>
            <span className="text-lg font-medium">{vendedor?.tel || 'Sin teléfono'}</span>
          </div>
        </div>
      </div>

      {/* Caja Efectivo en Tiempo Real */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-xl p-6 text-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Caja Efectivo Actual</p>
              <p className="text-4xl font-bold">${totalCaja.toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-2">Actualizado en tiempo real</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
              <span className="text-4xl">💵</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inscripciones Realizadas</p>
              <p className="text-3xl font-bold text-gray-800">
                {vendedor?.inscripciones?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Comisiones Activas</p>
              <p className="text-3xl font-bold text-gray-800">
                {vendedor?.comisiones?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">Mis Métricas</h3>
        <p className="text-gray-600 text-sm">
          Visualización de tus datos de ventas e inscripciones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Cobranzas por Mes */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fa-solid fa-chart-line text-white text-sm"></i>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Mis Cobranzas</h3>
            </div>
            <FilterButton
              color="blue"
              activeFiltersCount={selectedYear ? 1 : 0}
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
              </div>
            </FilterButton>
          </div>
          <SalesChart data={salesData} />
        </div>

        {/* Inscripciones Nuevas */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fa-solid fa-user-plus text-white text-sm"></i>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Mis Inscripciones</h3>
            </div>
            <FilterButton
              color="green"
              activeFiltersCount={
                [
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
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fa-solid fa-credit-card text-white text-sm"></i>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Mis Métodos de Pago</h3>
            </div>
            <FilterButton
              color="purple"
              activeFiltersCount={selectedPaymentMonth ? 1 : 0}
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
              </div>
            </FilterButton>
          </div>
          <MethodPaymentChart data={paymentData} />
        </div>
      </div>
    </div>
  );
};

export default InfoIndexVend;
