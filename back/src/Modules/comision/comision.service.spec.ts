import { ComisionService } from './comision.service';

describe('ComisionService.remove', () => {
  it('desvincula pagos e inscripciones antes de eliminar la comisión', async () => {
    const pagos = [
      { id: 'pago-1', alumnoComision: { id: 'alumno-comision-1' } },
    ];
    const inscripciones = [
      { id: 'inscripcion-1', comision: { id: 'comision-1' } },
    ];
    const manager = {
      findOne: jest.fn().mockResolvedValue({ id: 'comision-1' }),
      find: jest
        .fn()
        .mockResolvedValueOnce(pagos)
        .mockResolvedValueOnce(inscripciones),
      save: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      transaction: jest.fn(),
    };
    manager.transaction.mockImplementation((callback) => callback(manager));

    const repository = { manager };
    const service = new ComisionService(
      repository as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    await expect(service.remove('comision-1')).resolves.toEqual({
      message: 'Borrado exitoso',
    });

    expect(pagos[0].alumnoComision).toBeNull();
    expect(inscripciones[0].comision).toBeNull();
    expect(manager.save).toHaveBeenNthCalledWith(1, expect.anything(), pagos);
    expect(manager.save).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      inscripciones,
    );
    expect(manager.delete).toHaveBeenCalledWith(
      expect.anything(),
      'comision-1',
    );
  });
});

describe('ComisionService.findOneAluCom', () => {
  afterEach(() => jest.useRealTimers());

  it('devuelve el estado de deuda calculado por cada comisión', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-15T12:00:00'));
    const alumnoComisionRepository = {
      findOne: jest
        .fn()
        .mockResolvedValue({ id: 'ac-1', alumno: { id: 'alumno-1' } }),
      find: jest.fn().mockResolvedValue([
        {
          id: 'ac-1',
          state: true,
          comision: { id: 'com-1', name: 'Comisión 1' },
          pagos: [
            {
              id: 'pago-1',
              tipo: 'Ingreso',
              fecha: new Date('2026-08-10T12:00:00'),
            },
          ],
        },
      ]),
    };
    const cajaRepository = { find: jest.fn().mockResolvedValue([]) };
    const service = new ComisionService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      alumnoComisionRepository as any,
      {} as any,
      {} as any,
      {} as any,
      cajaRepository as any,
      {} as any,
    );

    const result = await service.findOneAluCom('ac-1');

    expect(result.comisiones[0].debe).toBe(true);
  });

  it('filtra los pagos por la comisión seleccionada', async () => {
    const alumnoComisionRepository = {
      findOne: jest
        .fn()
        .mockResolvedValue({ id: 'ac-1', alumno: { id: 'alumno-1' } }),
      find: jest.fn().mockResolvedValue([]),
    };
    const cajaRepository = { find: jest.fn().mockResolvedValue([]) };
    const service = new ComisionService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      alumnoComisionRepository as any,
      {} as any,
      {} as any,
      {} as any,
      cajaRepository as any,
      {} as any,
    );

    await service.findOneAluCom('ac-1', 'com-2');

    expect(cajaRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { alumnoComision: { comision: { id: 'com-2' } } },
      }),
    );
  });
});

describe('ComisionService.findDeudores', () => {
  afterEach(() => jest.useRealTimers());

  it('lista solo relaciones activas con semáforo pendiente', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-20T12:00:00'));
    const alumnoComisionRepository = {
      find: jest.fn().mockResolvedValue([
        {
          id: 'ac-deudor',
          state: true,
          alumno: { id: 'a-1', name: 'Ana', dni: '111' },
          comision: { id: 'c-1', name: 'Comisión A' },
          pagos: [{ tipo: 'Ingreso', fecha: new Date('2026-08-10T12:00:00') }],
        },
        {
          id: 'ac-al-dia',
          state: true,
          alumno: { id: 'a-2', name: 'Bruno', dni: '222' },
          comision: { id: 'c-2', name: 'Comisión B' },
          pagos: [
            { tipo: 'Ingreso', fecha: new Date('2026-08-10T12:00:00') },
            { tipo: 'Ingreso', fecha: new Date('2026-09-10T12:00:00') },
          ],
        },
      ]),
    };
    const service = new ComisionService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      alumnoComisionRepository as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const result = await service.findDeudores('sucursal-1', '11');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 'ac-deudor', semaforo: 'red' });
    expect(alumnoComisionRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          state: true,
          comision: { sucursal: { id: 'sucursal-1' } },
          alumno: { dni: expect.anything() },
        },
      }),
    );
  });
});

describe('ComisionService.obtenerMetricasAsistencia', () => {
  it('devuelve contadores de alumnos activos e inactivos', async () => {
    const alumnoComisionRepository = {
      count: jest
        .fn()
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1),
    };
    const asistenciaRepository = { find: jest.fn().mockResolvedValue([]) };
    const service = new ComisionService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      alumnoComisionRepository as any,
      asistenciaRepository as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    await expect(
      service.obtenerMetricasAsistencia('com-1'),
    ).resolves.toMatchObject({
      totalAlumnos: 3,
      alumnosActivos: 2,
      alumnosInactivos: 1,
    });
  });
});
