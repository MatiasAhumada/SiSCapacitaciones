import { AlumnoService } from './alumno.service';

describe('AlumnoService.getAlumnosBySucursal', () => {
  const alumnoRepository = {
    find: jest.fn(),
  };
  const service = new AlumnoService(alumnoRepository as any, {} as any);

  beforeEach(() => {
    jest.clearAllMocks();
    alumnoRepository.find.mockResolvedValue([]);
  });

  it('busca nombre sin distinguir mayúsculas y teléfono como texto', async () => {
    await service.getAlumnosBySucursal(
      'sucursal-1',
      { page: 1, limit: 10 },
      { nombre: '  Ana  ', tel: '  1155  ' },
    );

    const where = alumnoRepository.find.mock.calls[0][0].where;
    expect(where.sucursal).toEqual({ id: 'sucursal-1' });
    expect(where.name).toMatchObject({
      type: 'ilike',
      _value: '%ana%',
    });
    expect(where.tel).toMatchObject({ type: 'raw' });
    expect(where.tel.getSql('alumnos.tel')).toContain(
      'CAST(alumnos.tel AS TEXT)',
    );
  });

  it('mantiene la combinación de filtros y la paginación', async () => {
    alumnoRepository.find.mockResolvedValue([
      {
        id: 'alumno-1',
        name: 'ana',
        dni: '123',
        tel: 1155,
        alumnoComisiones: [],
        certificados: [],
      },
    ]);

    const result = await service.getAlumnosBySucursal(
      'sucursal-1',
      { page: 2, limit: 1 },
      { dni: '123', cantidadComisiones: '0' },
    );

    expect(result).toMatchObject({
      totalItems: 1,
      totalPages: 1,
      currentPage: 2,
      data: [],
    });
    expect(alumnoRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dni: expect.objectContaining({ type: 'like' }),
        }),
      }),
    );
  });
});
