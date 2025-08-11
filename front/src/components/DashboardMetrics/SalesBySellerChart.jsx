// src/components/SalesBySellerChart.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const SalesBySellerChart = ({ data }) => {
  // Los datos de la API deberían lucir así:
  // [
  //   { name: 'Vendedor 1', sales: 12000 },
  //   { name: 'Vendedor 2', sales: 8500 },
  //   { name: 'Vendedor 3', sales: 6000 },
  //   ...
  // ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`Ventas: ${value}`]} />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesBySellerChart;