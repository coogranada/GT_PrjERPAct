import { DecimalPipe } from '@angular/common';

export class NaturalesAllModel {
    esReimpresa: string = '';
    ServicioSolicitado: string = "";
    TipoDeCliente: string = "";
    DiaFechaSoli: string | number = "";
    MesFechaSoli: string | number = "";
    AnoFechaSoli: string | number = "";
    TipoDocumento: string | null = "";
    NumeroDocumento: string = "";
    LugarExpedicon: string = "";
    DiaFechaExpe: string | number = "";
    MesFechaExpe: string | number = "";
    AnofechaExpe: string | number = "";
    PrimerApellido: string = "";
    SegundoApellido: string = "";
    PrimerNombre: string = "";
    SegundoNombre: string = "";
    LugarNacimiento: string = "";
    CiudadNto: string = "";
    DiaFechaNaci: string | number = "";
    MesFechaNaci: string | number = "";
    AnoFechaNaci: string | number = "";
    Departamento: string = "";
    Pais: string = "";
    Genero: string = "";
    EstadoCivil: string = "";
    NivelEstudio: string = "";
    ConocioCoogranada: string = "";
    Cual: string = "";
    NumeroPersonasCargo: string = "";
    RegimenTributario: string = "";
    tituloProfesional: string = "";
    Nacionalidad: string = "";
    NumeroCelular: string = "";
    CorreoElectronico: string = "";
    Direccion: string = "";
    MesFechaAnti: string | number = "";
    AnoFechaAnti: string | number = "";
    LugarVive: string = "";
    CiudadReside: string = "";
    BarrioReside: string = "";
    DepartamentoReside: string = "";
    PaisReside: string = "";
    Telefono: string = "";
    TipoVivienda: string = "";
    AnosVivienda: string = "";
    MesesVivienda: string = "";
    NombreArrendador: string = "";
    TelefonoArrendador: string = "";
    TipoOcupacion: string = "";
    DescripcionOcupacion: string = "";
    ActividadEconomica: string = "";
    CodigoCiiu: string = "";
    CiudadLaboral: string = "";
    DepartamentoLaboral: string = "";
    PaisLaboral: string = "";
    BarrioLaboral: string = "";
    DireccionLaboral: string = "";
    TelefonoLaboral: string = "";
    EmpresaLabora: string = "";
    NitLabora: string = "";
    CargoOficio: string = "";
    Eps: string = "";
    AnosAntiguedadEmpresa: string | number = "";
    MesesAntiguedadEmpresa: string | number = "";
    NEmpleados: string = "";
    TipoLocalLaboral: string = "";
    NomArrendadorLaboral: string = "";
    TeleArrendadorLaboral: string = "";
    Correspondencia: string = "";
    Salario: number = 0;
    Comisiones: number = 0;
    Arriendos: number = 0;
    OtrosIngresos: OtrosIngresos = { Valor: 0, Observacion: ""};
    TotalIngresos: number = 0;
    CostosGastos: number = 0;
    TotalIngresosOperacionales: number = 0;
    ValorArriendo: number = 0;
    ObligacionesFinancieras: number = 0;
    OtrasObligaciones: number = 0;
    GastosFamiliares: number = 0;
    OtrosEgresos: number = 0;
    TotalEgresos: number = 0;
    TotalActivos: number = 0;
    TotalPasivos: number = 0;
    TotalPatrimonio: number = 0;
    TipoPropiedad: string = "";
    TipoVehiculo: string = "";
    CiudadActivo: string = "";
    Marca: string = "";
    TipoDocConyugue: string = "";
    DocumentoConyugue: string = "";
    PrimerApellidoConyugue: string = "";
    SegundoApellidoConyugue: string = "";
    PrimerNombreConyugue: string = "";
    SegundoNombreConyugue: string = "";
    TelefonoRConyugue: string = "";
    CelularConyugue: string = "";
    EmpresaLaboraConyugue: string = "";
    OcupacionConyugue: string = "";
    IngresosConyugue: string = "";
    EgresosConyugue: string = "";
    NitEmpresaConyugue: string = "";
    AntiguedadEmpConyugue: string = "";
    MesesAntiguedadEmpresaConyugue: string = "";
    AnosAntiguedadEmpresaConyugue: string = "";
    TelefonoEmpresaConyugue: string = "";
    DetallesOcupacionConyugue: string = "";
    // Entrevista
    PersonaPEPS: string = "";
    AdministraRecursosPublicos: string = "";
    Administradineros: string = "";
    OtraActividad: string = "";
    CualActivdad: string = "";
    GanaActividad: string = "";
    ValorPromedio: string = "";
    PaiseEntrevista: string = "";
    OperacionMonedaExtrangera: string = "";
    Entidad: string = "";
    TipoProducto: string = "";
    UbicacionEntrevista: string = "";
    Moneda: string = "";
    MontoPromedio: string = "";
    Ciudadoperacion: string = "";
    TieneInversionMonedaExtrangera: string = "";
    MonedaTiene: string = "";
    PaisTiene: string = "";
    PoseeCuentaMonedaExtrangera: string = "";
    UbicacionCuenta: string = "";
    MonedaPosee: string = "";
    PaisPosee: string = "";
    EsPersonaPeps: string = "";
    ManejaRecursosPublicos: string = "";
    PorCargoPoderPublico: string = "";
    PorActividadPoderPublico: string = "";
    CuentaMonedaExtrangera: string = "";
    DeclaroQueNoTransacciones: string = "";
    VinculoEntreUnPeps: string = "";
    // Fin entrevista
    // info Peps
    NombreCompleto: string = "";
    IdentitificacionPeps: string = "";
    Cargo: string = "";
    Periodo: string = "";
    Parentesco: string = "";
    // Fin Peps
    // Referencias
    ParentescoFamiliar: string = "";
    parentescoPersonal: string = "";
    Propiedades: Propiedad[] = [];
    Vehiculos: Vehiculo[] = [];
    OtrosActivos: OtrosActivos[] = [];
    ReferenciasFamiliares: ReferenciaFamiliar[] = [];
    ReferenciasPersonales: ReferenciaFamiliar[] = [];
    ReferenciasComerciales: ReferenciaComercial[] = [];
    ReferenciasFinancieras: ReferenciaFinanciera[] = [];
    Peps: Peps[] = [];
    Importa: string = "";
    Exporta: string = "";
    Giros: string = "";
}
export class NaturalesServicio {
    MontoSolicitado: string = "";
    PlazoDeseado: string = "";
    Destino: string = "";
    Oficina: string = "";
    Asesor: string = "";
    NombreDeudor: string = "";
    NumeroDocDeudor: string = "";
    TipoIdentificacion: string | null = "";
    esDeudorAsociado?: string;
    RadicadoCredito?: string = "";

}
export class NaturalesMenorModel {
    TipoIdentificacion: string = "";
    NumeroDocumento: string = "";
    FechaExpedicion: string = "";
    LugarExpedicion: string = "";
    PrimerNombre: string = "";
    SegundoNombre: string = "";
    PrimerApellido: string = "";
    SegundoApellido: string = "";
    Genero: string = "";
    LugarNacimiento: string = "";
    FechaNacimiento: string = "";
    CiudadNacimiento: string = "";
    DepartamentoNacimiento: string = "";
    PaisNacimiento: string = "";
}

class Propiedad {
    TipoActivo: string = "";
    Direccion: string = "";
    Ciudad: string = "";
    Valor: string = "";
    ValorDeuda: string = "";
    Afavor: string = "";
}

class Vehiculo {
    TipoActivo: string = "";
    Marca: string = "";
    Modelo: string = "";
    Placa: string = "";
    Valor: string = "";
    ValorPignorado: string = "";
    Afavor: string = "";
}

class OtrosActivos {
    TipoActivo: string = "";
    Ciudad: string = "";
    Descripcion: string = "";
    Valor: string = "";
}

class ReferenciaFamiliar {
    Nombre: string = "";
    parentesco: string = "";
    Telefono1: string = "";
    Telefono2: string = "";
    Telefono3: string = "";
}

class ReferenciaComercial {
    Nombre: string = "";
    Ciudad: string = "";
    Telefono: string = "";
    Servicio: string = "";
}

class ReferenciaFinanciera {
    Nombre: string = "";
    Telefono: string = "";
    Oficina: string = "";
    Servicio: string = "";
    NroServicio: string | number = "";
}

class Peps {
    NombrePeps: string = "";
    DocumentoPeps: string = "";
    Periodo: string = "";
    Cargo: string = "";
    Parentesco: string = "";
}

class OtrosIngresos {
    Valor: number = 0;
    Observacion: string = "";
}


