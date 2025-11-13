import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#f59e0b'];

const EnrollmentChart = ({ data }) => {
  // Determinar si es agrupación por semana o mes
  const isWeekly = data.some((item) => item.week);
  const xAxisKey = isWeekly ? 'week' : 'month';

  // Agrupar datos
  const groupedData = data.reduce((acc, item) => {
    const key = item.week || item.month;
    const existing = acc.find((d) => d[xAxisKey] === key);
    if (existing) {
      existing[item.name] = item.inscripciones;
    } else {
      acc.push({ [xAxisKey]: key, [item.name]: item.inscripciones });
    }
    return acc;
  }, []);

  // Obtener vendedores únicos
  const sellers = [...new Set(data.map((item) => item.name))];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={groupedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xAxisKey} stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value) => [value, 'Inscripciones']}
        />
        <Legend />
        {sellers.map((seller, index) => (
          <Line
            key={seller}
            type="monotone"
            dataKey={seller}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

EnrollmentChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default EnrollmentChart;
