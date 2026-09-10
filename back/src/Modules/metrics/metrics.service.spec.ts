import { Repository } from 'typeorm';
import { MetricsService } from './metrics.service';
import { Caja } from '../caja/entities/caja.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { Alumno } from '../alumno/entities/alumno.entity';

describe('MetricsService.getStudentDemographics', () => {
  const queryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };
  const alumnoRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
  } as unknown as Repository<Alumno>;
  const service = new MetricsService(
    {} as Repository<Caja>,
    {} as Repository<Inscripcion>,
    alumnoRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queryBuilder.select.mockReturnThis();
    queryBuilder.addSelect.mockReturnThis();
    queryBuilder.andWhere.mockReturnThis();
  });

  it('devuelve las cinco franjas ordenadas y distingue alumnos sin edad', async () => {
    queryBuilder.getRawOne.mockResolvedValue({
      totalAlumnos: '11',
      allAlumnos: '12',
      ageRange0To17: '2',
      ageRange18To25: '3',
      ageRange26To35: '4',
      ageRange36To50: '2',
      ageRange51OrMore: '0',
    });

    await expect(service.getStudentDemographics()).resolves.toEqual({
      totalAlumnos: 11,
      classifiedTotal: 11,
      unclassifiedTotal: 1,
      ageRange: '',
      gender: '',
      ageDistribution: [
        { range: '0-17', label: '0 a 17', total: 2 },
        { range: '18-25', label: '18 a 25', total: 3 },
        { range: '26-35', label: '26 a 35', total: 4 },
        { range: '36-50', label: '36 a 50', total: 2 },
        { range: '51+', label: '51 o más', total: 0 },
      ],
    });
    expect(queryBuilder.addSelect).toHaveBeenCalledTimes(6);
    expect(queryBuilder.andWhere).not.toHaveBeenCalled();
  });

  it('aplica género y límites inclusivos para una franja cerrada', async () => {
    queryBuilder.getRawOne.mockResolvedValue({
      totalAlumnos: '3',
      allAlumnos: '3',
      ageRange18To25: '3',
    });

    const result = await service.getStudentDemographics('18-25', 'Femenino');

    expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
      1,
      'LOWER(alumno.gender) = LOWER(:gender)',
      { gender: 'Femenino' },
    );
    expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
      2,
      'alumno.age BETWEEN :ageMin AND :ageMax',
      { ageMin: 18, ageMax: 25 },
    );
    expect(result.totalAlumnos).toBe(3);
    expect(result.classifiedTotal).toBe(3);
    expect(result.ageRange).toBe('18-25');
  });

  it('aplica el límite inferior para la franja abierta de 51 años o más', async () => {
    queryBuilder.getRawOne.mockResolvedValue({
      totalAlumnos: '4',
      allAlumnos: '4',
      ageRange51OrMore: '4',
    });

    await service.getStudentDemographics('51+');

    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'alumno.age >= :ageMin',
      { ageMin: 51 },
    );
  });

  it('normaliza una respuesta vacía sin romper el contrato', async () => {
    queryBuilder.getRawOne.mockResolvedValue(undefined);

    const result = await service.getStudentDemographics();

    expect(result.totalAlumnos).toBe(0);
    expect(result.classifiedTotal).toBe(0);
    expect(result.unclassifiedTotal).toBe(0);
    expect(result.ageDistribution).toHaveLength(5);
    expect(result.ageDistribution.every((item) => item.total === 0)).toBe(true);
  });
});
