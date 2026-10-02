import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Caja, MetodoPago, TipoMovimiento } from './entities/caja.entity';
import { Comprobante } from '../comprobante/entities/comprobante.entity';
import { SesionCaja } from './entities/sesion-caja.entity';
import { CajaService } from './caja.service';

describe('CajaService.remove', () => {
  const actorAdmin = { id: 'admin-1', role: 'admin' };
  const actorVendedor = { id: 'vendedor-1', role: 'vendedor' };

  const createService = (
    caja: Partial<Caja> | null,
    copias: Partial<Caja>[] = [],
  ) => {
    const sesion = {
      id: 'sesion-1',
      montoApertura: 100,
      totalIngresos: 25,
      totalEgresos: 0,
      totalEfectivo: 125,
      totalCredito: 0,
      totalDigitalJavier: 0,
      totalDigitalTobias: 0,
      totalFerro: 0,
    };
    const manager = {
      findOne: jest
        .fn()
        .mockImplementation((entity) => (entity === Caja ? caja : sesion)),
      find: jest.fn().mockResolvedValueOnce(copias).mockResolvedValue([]),
      remove: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      save: jest.fn().mockResolvedValue(sesion),
      transaction: jest.fn(),
    };
    manager.transaction.mockImplementation((callback) => callback(manager));
    const repository = { manager };
    const service = new CajaService(
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
      {} as any,
    );
    return { service, manager };
  };

  const cobro = (overrides: Partial<Caja> = {}): Partial<Caja> => ({
    id: 'cobro-1',
    tipo: TipoMovimiento.INGRESO,
    metodoPago: MetodoPago.EFECTIVO,
    monto: 25,
    vendedor: { id: 'vendedor-1' } as any,
    sesionCaja: { id: 'sesion-1', fechaCierre: null } as any,
    comprobante: { id: 'comprobante-1' } as any,
    ...overrides,
  });

  it('rejects non-existent movement ids', async () => {
    const { service } = createService(null);

    await expect(service.remove('missing', actorAdmin)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('prevents vendors from deleting another vendor’s charge', async () => {
    const { service } = createService(
      cobro({ vendedor: { id: 'vendedor-2' } as any }),
    );

    await expect(
      service.remove('cobro-1', actorVendedor),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('preserves movements from closed sessions', async () => {
    const { service } = createService(
      cobro({ sesionCaja: { id: 'sesion-1', fechaCierre: new Date() } as any }),
    );

    await expect(service.remove('cobro-1', actorAdmin)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('preserves the charge when its linked copy belongs to a closed session', async () => {
    const copia = {
      id: 'copia-1',
      origenCajaId: 'cobro-1',
      sesionCaja: { id: 'sesion-perpetua-1', fechaCierre: new Date() },
    } as Partial<Caja>;
    const { service, manager } = createService(cobro(), [copia]);

    await expect(service.remove('cobro-1', actorAdmin)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(manager.remove).not.toHaveBeenCalled();
    expect(manager.delete).not.toHaveBeenCalled();
  });

  it('removes the charge, its receipt and the linked perpetual copy atomically', async () => {
    const copia = {
      id: 'copia-1',
      origenCajaId: 'cobro-1',
      sesionCaja: { id: 'sesion-perpetua-1' },
    } as Partial<Caja>;
    const { service, manager } = createService(cobro(), [copia]);

    await expect(service.remove('cobro-1', actorVendedor)).resolves.toEqual({
      message: 'Cobro eliminado correctamente',
    });

    expect(manager.remove).toHaveBeenNthCalledWith(1, Caja, [copia]);
    expect(manager.remove).toHaveBeenNthCalledWith(
      2,
      Caja,
      expect.objectContaining({ id: 'cobro-1' }),
    );
    expect(manager.delete).toHaveBeenCalledWith(Comprobante, 'comprobante-1');
    expect(manager.save).toHaveBeenCalledTimes(2);
    expect(manager.transaction).toHaveBeenCalledTimes(1);
  });
});
