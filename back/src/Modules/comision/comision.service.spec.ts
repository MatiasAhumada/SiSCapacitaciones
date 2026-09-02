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
