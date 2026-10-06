import { Operacion } from "../Models/Productos/cartera/cambiar-tasa-context";
import { CodeudorDraft, HistorialOperacion, LogCambiarCodeudores, DetallesLogCredito, CambiarInfoCreditoLog } from "../Models/Productos/cartera/gestion-credito.model";

type FormateadorOperacion = (r: HistorialOperacion) => HistorialOperacion;

export const formateadoresPorOperacion: Record<number, FormateadorOperacion> = {
  0: (registro) => {
    return {
      ...registro,
      Detalles: (registro.Detalles ?? '')
        .replace(/[{}"]+/gi, '')
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
  
    let detalles: any;
    try {
      detalles = JSON.parse(registro.Detalles);
    } catch {
      return registro;
    }
  
    const mapTipoPagare = (tipo: any): string => {
    
      if (typeof tipo === 'string') {
        return tipo;
      }
    
      switch (Number(tipo)) {
        case 1:
          return 'Desmaterializado';
        case 2:
          return 'Fisico';
        default:
          return '';
      }
    };
  
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
  
    const mapSeguro = (valor: any): string => {
      if (typeof valor === 'string') return valor;
    
      if (valor?.manejaSeguro === 0)
        return 'Con cobertura de seguro';
    
      if (valor?.manejaSeguro === 1)
        return 'Sin cobertura de seguro';
    
      return '';
    };
  
    return {
      ...registro,
      Detalles: `
        <strong>Anterior:</strong> ${mapSeguro(detalles.Anterior)}
        | <strong>Actualiza:</strong> ${mapSeguro(detalles.Actualiza)}
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

    const formatear = ({ Sistema, PeriodoCapital, PeriodoInteres, Plazo, PeriodoGracia }: Partial<CambiarInfoCreditoLog>) => {
      return Object.entries({ Sistema, PeriodoCapital, PeriodoInteres, Plazo, PeriodoGracia })
        .map(([key, value]) => `${key}: ${value ?? ''}`)
        .join(' - ');
    };

    return {
      ...registro,
      Detalles: `<strong>Anterior:</strong> ${formatear(detalles.Anterior)} | <strong>Actualiza:</strong> ${formatear(detalles.Actualiza)}`
    };
  },
  143: (registro) => {
    const detalles: DetallesLogCredito = JSON.parse(registro.Detalles);

    const formatear = ({ Sistema, PeriodoCapital, PeriodoInteres, Plazo, PeriodoGracia }: Partial<CambiarInfoCreditoLog>) => {
      return Object.entries({ Sistema, PeriodoCapital, PeriodoInteres, Plazo, PeriodoGracia })
        .map(([key, value]) => `${key}: ${value ?? ''}`)
        .join(' - ');
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

    const anterior = detalles.Anterior;
    const actualiza = detalles.Actualiza;

    const mapFormaPago = (valor: any): string => {
      if (valor === 0) return 'Caja';
      if (valor === 1) return 'Débito';
      if (valor === 2) return 'Nómina';
      return valor ?? '';
    };

    const textoAnterior =
      mapFormaPago(anterior?.FormaPago) === 'Débito' &&
      (anterior?.CuentaOrigen || anterior?.Debito)
        ? `Débito (${
            (anterior.CuentaOrigen || anterior.Debito).Documento ??
            (anterior.CuentaOrigen || anterior.Debito).DocumentoDebito
          } - ${
            (anterior.CuentaOrigen || anterior.Debito).Nombre ??
            (anterior.CuentaOrigen || anterior.Debito).NombreDebito
          } - ${
            (anterior.CuentaOrigen || anterior.Debito).Cuenta
          })`
        : mapFormaPago(anterior?.FormaPago);

    const textoActualiza =
      mapFormaPago(actualiza?.FormaPago) === 'Débito' &&
      (actualiza?.CuentaOrigen || actualiza?.Debito)
        ? `Débito (${
            (actualiza.CuentaOrigen || actualiza.Debito).Documento ??
            (actualiza.CuentaOrigen || actualiza.Debito).DocumentoDebito
          } - ${
            (actualiza.CuentaOrigen || actualiza.Debito).Nombre ??
            (actualiza.CuentaOrigen || actualiza.Debito).NombreDebito
          } - ${
            (actualiza.CuentaOrigen || actualiza.Debito).Cuenta
          })`
        : mapFormaPago(actualiza?.FormaPago);

    return {
      ...registro,
      Detalles:
        `<strong>Anterior:</strong> ${textoAnterior}` +
        ` | <strong>Actualiza:</strong> ${textoActualiza}`
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
      ? `Causal: ${actualiza.Causal}`
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
        | <strong>Actualiza:</strong> ${formatear(actualGarantias)}
        | <strong>Agregadas:</strong> ${formatear(agregadas)}
        | <strong>Eliminadas:</strong> ${formatear(eliminadas)}
      `
    };
  },
};