import { CodeudorDraft, HistorialOperacion, LogCambiarCodeudores, DetallesLogCredito, CambiarInfoCreditoLog } from "../Models/Productos/cartera/gestion-credito.model";

type FormateadorOperacion = (r: HistorialOperacion) => HistorialOperacion;

export const formateadoresPorOperacion: Record<number, FormateadorOperacion> = {
  0: (registro) => {
    return {
      ...registro,
      Detalles: registro.Detalles.replace(/[{}"]+/gi, '')?.replace(/,/g, ' ') 
    };
  },
  125: (registro) => {
    const detalles: LogCambiarCodeudores = JSON.parse(registro.Detalles);

    const formatear = (lista: CodeudorDraft[]) =>
      lista.map(p => `${p.documento} ${p.nombreCompleto}`).join(' - ');

    return {
      ...registro,
      Detalles: `<strong>Anterior:</strong> ${formatear(detalles.Anteriores)} | <strong>Actualiza:</strong> ${formatear(detalles.Actuales)}`
    };
  },
  126: (registro) => {
    if (!registro?.Detalles) return registro;

    const mapTipoPagare = (tipo?: number): string => {
    switch (tipo) {
      case 1: return 'Desmaterializado';
      case 2: return 'Físico';
      default: return '';
    }

    };

    let detalles: any;
    try {
      detalles = JSON.parse(registro.Detalles);
    } catch {
      return registro;
    }

    const anterior = detalles.Anterior;
    const actualiza = detalles.Actualiza;

    return {
      ...registro,
      Detalles: `
        <strong>Anterior:</strong>
        Pagaré: ${anterior?.pagare ?? ''} -
        Tipo: ${mapTipoPagare(anterior?.tipo)}

        | <strong>Actualiza:</strong>
        Pagaré: ${actualiza?.pagare ?? ''} -
        Tipo: ${mapTipoPagare(actualiza?.tipo)}
      `
    };
  },
  129: (registro) => {
    if (!registro?.Detalles) return registro;

    let detalles: any;
    try {
      detalles = JSON.parse(registro.Detalles);
    } catch {
      return registro;
    }

    const anterior = detalles.Anterior;
    const actualiza = detalles.Actualiza;

    return {
      ...registro,
      Detalles: `
        <strong>Anterior:</strong>
        Código: ${anterior?.id ?? ''} -
        Línea: ${anterior?.linea ?? ''}

        | <strong>Actualiza:</strong>
        Código: ${actualiza?.id ?? ''} -
        Línea: ${actualiza?.linea ?? ''}
      `
    };
  },
  130: (registro) => {
    const detalles: DetallesLogCredito = JSON.parse(registro.Detalles);

    const formatear = (info: { TasaNominal: string }) => {
      return Object.entries(info)
        .map(([key, value]) => `${key}: ${value ?? ''}`)
        .join(' - ');
    };

    return {
      ...registro,
      Detalles: `<strong>Anterior:</strong> TasaNominal: ${detalles.Anterior.TasaNominal} | <strong>Actualiza:</strong> TasaNominal: ${detalles.Actualiza.TasaNominal}`
    };
  },
  131: (registro) => {
    if (!registro?.Detalles) return registro;

    let detalles: any;
    try {
      detalles = JSON.parse(registro.Detalles);
    } catch {
    return registro;
    }

    const anterior = detalles.Anterior;
    const actualiza = detalles.Actualiza;

    const mapManejaSeguro = (v?: number): string =>
      v === 0
        ? 'Con cobertura de seguro'
        : 'Sin cobertura de seguro';

    return {
      ...registro,
      Detalles: `
        <strong>Anterior:</strong> ${mapManejaSeguro(anterior?.manejaSeguro)}
        | <strong>Actualiza:</strong> ${mapManejaSeguro(actualiza?.manejaSeguro)}
      `
    };
  },
  132: (registro) => {
    const detalles: DetallesLogCredito = JSON.parse(registro.Detalles);

    return {
      ...registro,
      Detalles: `<strong>Anterior:</strong> ${detalles.Anterior.Cuota} | <strong>Actualiza:</strong> ${detalles.Actualiza.Cuota}`
    };
  },
  135: (registro) => {
    const detalles: DetallesLogCredito = JSON.parse(registro.Detalles);

    const formatear = (detalle: CambiarInfoCreditoLog) => {
      return `Sistema: ${detalle.Sistema} - ${detalle.Plazo} ${detalle.PeriodoInteres}`;
    };

    return {
      ...registro,
      Detalles: `<strong>Anterior:</strong> ${formatear(detalles.Anterior)} | <strong>Actualiza:</strong> ${formatear(detalles.Actualiza)}`
    };
  },
  139: (registro) => {
    const detalles: DetallesLogCredito = JSON.parse(registro.Detalles);

    const formatear = ({ Sistema, PeriodoCapital, PeriodoInteres }: Partial<CambiarInfoCreditoLog>) => {
      return Object.entries({ Sistema, PeriodoCapital, PeriodoInteres })
        .map(([key, value]) => `${key}: ${value ?? ''}`)
        .join(' - ');
    };

    return {
      ...registro,
      Detalles: `<strong>Anterior:</strong> ${formatear(detalles.Anterior)} | <strong>Actualiza:</strong> ${formatear(detalles.Actualiza)}`
    };
  },
  140: (registro) => {
    const detalles: DetallesLogCredito = JSON.parse(registro.Detalles);

    const formatear = (detalle: CambiarInfoCreditoLog) => {
      return `Sistema: ${detalle.Sistema} - ${detalle.Plazo} ${detalle.PeriodoInteres} - Periodo gracia: ${detalle.PeriodoGracia}`;
    };

    return {
      ...registro,
      Detalles: `<strong>Anterior:</strong> ${formatear(detalles.Anterior)} | <strong>Actualiza:</strong> ${formatear(detalles.Actualiza)}`
    };
  },
  21: (registro) => {
    if (!registro?.Detalles) return registro;
      
    let detalles: any;
    try {
      detalles = JSON.parse(registro.Detalles);
    } catch {
      return registro;
    }
    
    const mapFormaPago = (v?: number): string => {
      switch (v) {
        case 0: return 'Caja';
        case 1: return 'Débito';
        case 2: return 'Nómina';
        default: return '';
      }
    };
    
    const anterior = detalles.Anterior;
    const actualiza = detalles.Actualiza;
    
    const textoAnterior = anterior?.FormaPago === 1 && anterior?.Debito
      ? `Débito (${anterior.Debito.DocumentoDebito} - ${anterior.Debito.NombreDebito} - ${anterior.Debito.Cuenta})`
      : mapFormaPago(anterior?.FormaPago);
    
    const textoActualiza = actualiza?.FormaPago === 1 && actualiza?.Debito
      ? `Débito (${actualiza.Debito.DocumentoDebito} - ${actualiza.Debito.NombreDebito} - ${actualiza.Debito.Cuenta})`
      : mapFormaPago(actualiza?.FormaPago);
    
    return {
      ...registro,
      Detalles: `<strong>Anterior:</strong> ${textoAnterior} | <strong>Actualiza:</strong> ${textoActualiza}`
    };
  },
  133: (registro) => {
    if (!registro?.Detalles) return registro;

    let detalles: any;
    try {
      detalles = JSON.parse(registro.Detalles);
    } catch {
      return registro;
    }

    const anterior = detalles.Anterior;
    const actualiza = detalles.Actualiza;

    const formatear = (obj: any) => {
      return `
        Cumplimiento: ${obj?.Cumplimiento ?? ''} -
        Recalificación: ${obj?.Recalificacion ?? ''} -
        Reestructurado: ${obj?.Reestructurado ?? ''} -
        Cualitativa: ${obj?.Cualitativa ?? ''} -
        Modelo: ${obj?.Modelo ?? ''}
      `;
    };

    const textoCausal = actualiza?.Causal
      ? `Causal: ${actualiza.Causal.Descripcion}`
      : '';

    const textoFecha = actualiza?.Fecha
      ? `| <strong>Fecha calificación:</strong> ${actualiza.Fecha}`
      : '';

    return {
      ...registro,
      Detalles: `
        <strong>Anterior:</strong>
        ${formatear(anterior)}

        | <strong>Actualiza:</strong>
        ${formatear(actualiza)}
        - ${textoCausal}
        ${textoFecha}
      `
    };
  },
  134: (registro) => {
    if (!registro?.Detalles) return registro;

    let detalles: any;
    try {
      detalles = JSON.parse(registro.Detalles);
    } catch {
      return registro;
    }

    const anteriorGarantias = detalles.Anterior?.Garantias ?? [];
    const actualGarantias = detalles.Actualiza?.Garantias ?? [];
    const agregadas = detalles.Actualiza?.Agregadas ?? [];
    const eliminadas = detalles.Actualiza?.Eliminadas ?? [];

    const formatear = (lista: any[]) =>
      lista.length
        ? lista
            .map(g => `(Id: ${g.Id} - Tipo: ${g.Tipo} - Cobertura: ${g.ValorCobertura})`)
            .join(' - ')
        : 'Ninguna';

    return {
      ...registro,
      Detalles: `
        <strong>Anterior:</strong> ${formatear(anteriorGarantias)}
        | <strong>Actual:</strong> ${formatear(actualGarantias)}
        | <strong>Agregadas:</strong> ${formatear(agregadas)}
        | <strong>Eliminadas:</strong> ${formatear(eliminadas)}
      `
    };
  },
};