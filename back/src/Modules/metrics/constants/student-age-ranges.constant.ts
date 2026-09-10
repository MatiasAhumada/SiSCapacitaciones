export const STUDENT_AGE_RANGES = [
  {
    value: '0-17',
    label: '0 a 17',
    minimumAge: 0,
    maximumAge: 17,
    resultAlias: 'ageRange0To17',
  },
  {
    value: '18-25',
    label: '18 a 25',
    minimumAge: 18,
    maximumAge: 25,
    resultAlias: 'ageRange18To25',
  },
  {
    value: '26-35',
    label: '26 a 35',
    minimumAge: 26,
    maximumAge: 35,
    resultAlias: 'ageRange26To35',
  },
  {
    value: '36-50',
    label: '36 a 50',
    minimumAge: 36,
    maximumAge: 50,
    resultAlias: 'ageRange36To50',
  },
  {
    value: '51+',
    label: '51 o más',
    minimumAge: 51,
    resultAlias: 'ageRange51OrMore',
  },
] as const;
