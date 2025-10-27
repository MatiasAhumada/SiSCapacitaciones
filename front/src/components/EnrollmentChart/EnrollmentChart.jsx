// src/components/EnrollmentChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const EnrollmentChart = ({ data }) => {
  // Los datos de ejemplo deberían lucir así:
  // [
  //   { name: 'Enero', inscripciones: 15 },
  //   { name: 'Febrero', inscripciones: 25 },
  //   { name: 'Marzo', inscripciones: 30 },
  //   ...
  // ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="inscripciones"
          stroke="#82ca9d" // Color verde para las inscripciones
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EnrollmentChart;
