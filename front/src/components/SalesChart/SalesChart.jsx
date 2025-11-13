import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#f59e0b'];

const SalesChart = ({ data }) => {
  // Detectar si hay múltiples vendedores (cuando name es diferente de month)
  const hasMultipleSellers = data.some(item => item.month && item.name !== item.month);

  if (hasMultipleSellers) {
    // Agrupar por mes y vendedor
    const groupedData = data.reduce((acc, item) => {
      const existing = acc.find(d => d.month === item.month);
      if (existing) {
        existing[item.name] = item.sales;
      } else {
        acc.push({ month: item.month, [item.name]: item.sales });
      }
      return acc;
    }, []);

    const sellers = [...new Set(data.map(item => item.name))];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={groupedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
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
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
        />
        <Bar dataKey="sales" fill="url(#colorSales)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

SalesChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SalesChart;
