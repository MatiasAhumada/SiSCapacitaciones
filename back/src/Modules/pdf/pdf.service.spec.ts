import { PdfService } from './pdf.service';

describe('PdfService receipt field mapping', () => {
  const service = new PdfService();

  it('uses current movement description and quota fields while preserving the receipt commission', () => {
    const observation = (service as any).getObservacionComprobante(
      {
        descripcion: 'Pago de cuota editado',
        cuota: 3,
        mesCuota: 'Marzo',
      },
      { observacion: 'Descripción antigua - Comisión: Diseño' },
    );

    expect(observation).toBe(
      'Pago de cuota editado - Comisión: Diseño - Cuota: 3 - Mes: Marzo',
    );
  });

  it('keeps the historical description for legacy movements without Caja description', () => {
    const observation = (service as any).getObservacionComprobante(
      {},
      { observacion: 'Nota emitida - Comisión: Diseño' },
    );

    expect(observation).toBe('Nota emitida - Comisión: Diseño');
  });

  it('does not resurrect a stale receipt note when the current description was cleared', () => {
    const observation = (service as any).getObservacionComprobante(
      { descripcion: '' },
      { observacion: 'Nota vieja - Comisión: Diseño' },
    );

    expect(observation).toBe('Comisión: Diseño');
  });
});
