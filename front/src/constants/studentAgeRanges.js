export const STUDENT_AGE_RANGES = [
  { value: '0-17', label: '0 a 17 años', chartLabel: '0-17' },
  { value: '18-25', label: '18 a 25 años', chartLabel: '18-25' },
  { value: '26-35', label: '26 a 35 años', chartLabel: '26-35' },
  { value: '36-50', label: '36 a 50 años', chartLabel: '36-50' },
  { value: '51+', label: '51 años o más', chartLabel: '51+' },
];

export const EMPTY_STUDENT_DEMOGRAPHICS = {
  totalAlumnos: 0,
  classifiedTotal: 0,
  unclassifiedTotal: 0,
  ageDistribution: STUDENT_AGE_RANGES.map(({ value, chartLabel }) => ({
    range: value,
    label: chartLabel,
    total: 0,
  })),
};
