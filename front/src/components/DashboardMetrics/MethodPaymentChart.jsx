// src/components/MethodPaymentChart.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Colores para cada porción del gráfico
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MethodPaymentChart = ({ data }) => {
  // Los datos de ejemplo deberían lucir así:
  // [
  //   { name: 'Efectivo', value: 400 },
  //   { name: 'Crédito', value: 300 },
  //   { name: 'Digital Tobias', value: 300 },
  //   { name: 'Digital Javier', value: 200 },
  // ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MethodPaymentChart;