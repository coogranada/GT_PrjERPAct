import { Component } from '@angular/core';
import { catchError, finalize, forkJoin, map, of } from 'rxjs';

import { GestionGarantiasService } from '../../../Services/Garantias/gestion-garantias.service';
import {
  ConsultarCreditosGarantiasResponse,
  GarantiaDisponible,
  GarantiaAsignada,
  CodeudorBasico
} from '../../../Models/Garantias/gestion-garantias.model';
import Swal from 'sweetalert2';

export interface GarantiaDisponibleVista extends GarantiaDisponible {
  idTerceroPropietario: number;
  numeroDocumentoPropietario: string;
  nombrePropietario: string;
  esTitular: boolean;
  indiceColorPropietario: number;
}

@Component({
  selector: 'app-gestion-garantias',
  templateUrl: './gestion-garantias.component.html',
  styleUrl: './gestion-garantias.component.css',
  standalone: false
})
export class GestionGarantiasComponent {

  // ============================================================
  // BÚSQUEDA
  // ============================================================

  numeroDocumento: string = '';
  consultarCancelados: boolean = false;
  nombreAsociado: string = '';

  // ============================================================
  // CRÉDITOS
  // ============================================================

  creditos: ConsultarCreditosGarantiasResponse[] = [];
  creditoSeleccionado: ConsultarCreditosGarantiasResponse | null = null;

  // ============================================================
  // GARANTÍAS
  // ============================================================

  garantiasDisponibles: GarantiaDisponibleVista[] = [];
  garantiasDisponiblesTitular: GarantiaDisponibleVista[] = [];
  garantiasDisponiblesCodeudores: GarantiaDisponibleVista[] = [];
  garantiasAsignadas: GarantiaAsignada[] = [];

  garantiaDisponibleSeleccionada: GarantiaDisponibleVista | null = null;
  garantiaAsignadaSeleccionada: GarantiaAsignada | null = null;

  // ============================================================
  // CODEUDORES
  // ============================================================

  codeudores: CodeudorBasico[] = [];

  // ============================================================
  // CARGAS
  // ============================================================

  cargando: boolean = false;
  cargandoGarantias: boolean = false;
  cargandoCodeudores: boolean = false;

  // ============================================================
  // MENSAJES
  // ============================================================

  mensaje: string = '';
  mensajeCodeudores: string = '';
  mensajeGarantiasDisponibles: string = '';
  mensajeGarantiasAsignadas: string = '';

  constructor(private readonly gestionGarantiasService: GestionGarantiasService) { }

  // ============================================================
  // CONSULTA PRINCIPAL
  // ============================================================

  consultarCreditos(): void {
    const documento = this.numeroDocumento.trim();

    this.limpiarResultadoConsulta();

    if (!documento) {
      this.mensaje = 'Ingrese el número de documento.';
      return;
    }

    this.cargando = true;

    this.gestionGarantiasService.consultarCreditos(documento, this.consultarCancelados)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (creditos: ConsultarCreditosGarantiasResponse[]) => {
          this.creditos = creditos ?? [];

          if (this.creditos.length === 0) {
            this.mensaje = this.consultarCancelados
              ? 'El asociado no tiene créditos cancelados con garantía admisible.'
              : 'El asociado no tiene créditos activos con garantía admisible.';
            return;
          }

          this.nombreAsociado = this.creditos[0].nombreAsociado;
          this.seleccionarCredito(this.creditos[0]);
        },
        error: (error: any) => {
          this.limpiarResultadoConsulta();
          this.mensaje = this.obtenerMensajeError(error);
        }
      });
  }

  // ============================================================
  // SELECCIÓN DE CRÉDITO
  // ============================================================

  seleccionarCredito(credito: ConsultarCreditosGarantiasResponse): void {
    if (this.cargandoGarantias || this.cargandoCodeudores) return;
    if (this.creditoSeleccionado?.idCuenta === credito.idCuenta) return;

    this.creditoSeleccionado = credito;
    this.limpiarResultadoGarantias();
    this.consultarGarantiasCredito(credito);
  }

  esCreditoSeleccionado(credito: ConsultarCreditosGarantiasResponse): boolean {
    return this.creditoSeleccionado?.idCuenta === credito.idCuenta;
  }

  // ============================================================
  // CONSULTA DE GARANTÍAS
  // ============================================================

  private consultarGarantiasCredito(credito: ConsultarCreditosGarantiasResponse): void {
    this.cargandoGarantias = true;
    this.cargandoCodeudores = true;

    forkJoin({
      disponiblesTitular: this.gestionGarantiasService.obtenerGarantiasDisponibles(
        credito.idTercero,
        credito.idCuenta
      ),
      asignadas: this.gestionGarantiasService.obtenerGarantiasAsignadas(credito.idCuenta),
      codeudores: this.gestionGarantiasService.getCodeudoresBasico(credito.idCuenta)
    }).subscribe({
      next: ({ disponiblesTitular, asignadas, codeudores }) => {
        this.garantiasAsignadas = asignadas ?? [];
        this.codeudores = codeudores ?? [];

        const titularFiltradas = this.excluirGarantiasYaAsignadas(
          disponiblesTitular ?? [],
          this.garantiasAsignadas
        );

        this.garantiasDisponiblesTitular = titularFiltradas.map(garantia =>
          this.crearGarantiaVistaTitular(garantia, credito)
        );

        if (this.codeudores.length === 0) {
          this.mensajeCodeudores = 'El crédito seleccionado no tiene codeudores.';
          this.garantiasDisponiblesCodeudores = [];

          this.consolidarGarantiasDisponibles();
          this.actualizarMensajesGarantias();
          this.finalizarCargaGarantias();
          return;
        }

        this.consultarGarantiasTodosCodeudores(credito);
      },
      error: (error: any) => {
        this.garantiasDisponibles = [];
        this.garantiasDisponiblesTitular = [];
        this.garantiasDisponiblesCodeudores = [];
        this.garantiasAsignadas = [];
        this.codeudores = [];

        const mensaje = this.obtenerMensajeError(error);
        this.mensajeGarantiasDisponibles = mensaje;
        this.mensajeGarantiasAsignadas = mensaje;

        this.finalizarCargaGarantias();
      }
    });
  }

  // ============================================================
  // GARANTÍAS DE CODEUDORES
  // ============================================================

  private consultarGarantiasTodosCodeudores(credito: ConsultarCreditosGarantiasResponse): void {
    const consultas = this.codeudores.map((codeudor: CodeudorBasico, indice: number) =>
      this.gestionGarantiasService.obtenerGarantiasDisponibles(codeudor.idTercero, credito.idCuenta)
        .pipe(
          map((garantias: GarantiaDisponible[]) => ({
            codeudor,
            indice,
            garantias: garantias ?? []
          })),
          catchError((error: any) => {
            console.error(`Error consultando garantías del codeudor ${codeudor.idTercero}`, error);

            return of({
              codeudor,
              indice,
              garantias: [] as GarantiaDisponible[]
            });
          })
        )
    );

    if (consultas.length === 0) {
      this.garantiasDisponiblesCodeudores = [];
      this.consolidarGarantiasDisponibles();
      this.actualizarMensajesGarantias();
      this.finalizarCargaGarantias();
      return;
    }

    forkJoin(consultas)
      .pipe(finalize(() => this.finalizarCargaGarantias()))
      .subscribe({
        next: (resultados) => {
          this.garantiasDisponiblesCodeudores = resultados.flatMap(resultado => {
            const filtradas = this.excluirGarantiasYaAsignadas(
              resultado.garantias,
              this.garantiasAsignadas
            );

            return filtradas.map(garantia =>
              this.crearGarantiaVistaCodeudor(
                garantia,
                resultado.codeudor,
                resultado.indice
              )
            );
          });

          this.consolidarGarantiasDisponibles();
          this.actualizarMensajesGarantias();
        },
        error: (error: any) => {
          console.error('Error consolidando garantías de los codeudores', error);

          this.garantiasDisponiblesCodeudores = [];
          this.consolidarGarantiasDisponibles();
          this.actualizarMensajesGarantias();
        }
      });
  }

  private finalizarCargaGarantias(): void {
    this.cargandoGarantias = false;
    this.cargandoCodeudores = false;
  }

  // ============================================================
  // CONSTRUCCIÓN DEL MODELO VISUAL
  // ============================================================

  private crearGarantiaVistaTitular(
    garantia: GarantiaDisponible,
    credito: ConsultarCreditosGarantiasResponse
  ): GarantiaDisponibleVista {
    return {
      ...garantia,
      idTerceroPropietario: credito.idTercero,
      numeroDocumentoPropietario: credito.numeroDocumento,
      nombrePropietario: credito.nombreAsociado,
      esTitular: true,
      indiceColorPropietario: 0
    };
  }

  private crearGarantiaVistaCodeudor(
    garantia: GarantiaDisponible,
    codeudor: CodeudorBasico,
    indice: number
  ): GarantiaDisponibleVista {
    return {
      ...garantia,
      idTerceroPropietario: codeudor.idTercero,
      numeroDocumentoPropietario: codeudor.numeroDocumento,
      nombrePropietario: codeudor.nombreCompleto,
      esTitular: false,
      indiceColorPropietario: (indice % 5) + 1
    };
  }

  private consolidarGarantiasDisponibles(): void {
    const mapa = new Map<string, GarantiaDisponibleVista>();

    [...this.garantiasDisponiblesTitular, ...this.garantiasDisponiblesCodeudores]
      .forEach(garantia => mapa.set(this.obtenerLlaveGarantiaDisponible(garantia), garantia));

    this.garantiasDisponibles = Array.from(mapa.values());
  }

  private actualizarMensajesGarantias(): void {
    this.mensajeGarantiasDisponibles = this.garantiasDisponibles.length === 0
      ? 'El titular y los codeudores no tienen garantías vigentes disponibles.'
      : '';

    this.mensajeGarantiasAsignadas = this.garantiasAsignadas.length === 0
      ? 'El crédito no tiene garantías matriculadas.'
      : '';
  }

  // ============================================================
  // EXCLUIR GARANTÍAS YA ASIGNADAS
  // ============================================================

  private excluirGarantiasYaAsignadas(
    disponibles: GarantiaDisponible[],
    asignadas: GarantiaAsignada[]
  ): GarantiaDisponible[] {
    const asignadasIds = new Set(
      asignadas.map(garantia => this.obtenerLlaveGarantiaBase(garantia))
    );

    return disponibles.filter(garantia =>
      !asignadasIds.has(this.obtenerLlaveGarantiaBase(garantia))
    );
  }

  // ============================================================
  // SELECCIÓN DE GARANTÍAS
  // ============================================================

  seleccionarGarantiaDisponible(garantia: GarantiaDisponibleVista): void {
    this.garantiaDisponibleSeleccionada = this.esGarantiaDisponibleSeleccionada(garantia)
      ? null
      : garantia;

    this.garantiaAsignadaSeleccionada = null;
  }

  seleccionarGarantiaAsignada(garantia: GarantiaAsignada): void {
    this.garantiaAsignadaSeleccionada = this.esGarantiaAsignadaSeleccionada(garantia)
      ? null
      : garantia;

    this.garantiaDisponibleSeleccionada = null;
  }

  esGarantiaDisponibleSeleccionada(garantia: GarantiaDisponibleVista): boolean {
    if (!this.garantiaDisponibleSeleccionada) return false;

    return this.obtenerLlaveGarantiaDisponible(this.garantiaDisponibleSeleccionada)
      === this.obtenerLlaveGarantiaDisponible(garantia);
  }

  esGarantiaAsignadaSeleccionada(garantia: GarantiaAsignada): boolean {
    if (!this.garantiaAsignadaSeleccionada) return false;

    return this.obtenerLlaveGarantiaAsignada(this.garantiaAsignadaSeleccionada)
      === this.obtenerLlaveGarantiaAsignada(garantia);
  }

  // ============================================================
  // MOVIMIENTOS VISUALES
  // ============================================================

matricularTodas(): void {
  if (this.garantiasDisponibles.length === 0 || !this.creditoSeleccionado) {
    return;
  }

  this.confirmarAccion(
    '¿Desea realizar el proceso de matrícula de garantías?',
    () => {

      const nuevasAsignadas = this.garantiasDisponibles.map(garantia =>
        this.convertirDisponibleAAsignada(garantia)
      );

      const mapaAsignadas = new Map<string, GarantiaAsignada>();

      [...this.garantiasAsignadas, ...nuevasAsignadas].forEach(garantia =>
        mapaAsignadas.set(this.obtenerLlaveGarantiaAsignada(garantia), garantia)
      );

      this.garantiasAsignadas = Array.from(mapaAsignadas.values());

      this.garantiasDisponibles = [];
      this.garantiasDisponiblesTitular = [];
      this.garantiasDisponiblesCodeudores = [];

      this.garantiaDisponibleSeleccionada = null;
      this.garantiaAsignadaSeleccionada = null;

      this.mensajeGarantiasDisponibles = 'No hay garantías disponibles.';
      this.mensajeGarantiasAsignadas = '';
    }
  );
}

retirarGarantiaSeleccionada(): void {
  const garantia = this.garantiaAsignadaSeleccionada;

  if (!garantia) {
    return;
  }

  this.confirmarAccion(
    '¿Desea retirar la garantía seleccionada?',
    () => {

      const llaveAsignada = this.obtenerLlaveGarantiaAsignada(garantia);

      this.garantiasAsignadas = this.garantiasAsignadas.filter(item =>
        this.obtenerLlaveGarantiaAsignada(item) !== llaveAsignada
      );

      const garantiaDisponible = this.convertirAsignadaADisponibleVista(garantia);

      const llaveDisponible = this.obtenerLlaveGarantiaDisponible(garantiaDisponible);

      const yaExiste = this.garantiasDisponibles.some(item =>
        this.obtenerLlaveGarantiaDisponible(item) === llaveDisponible
      );

      if (!yaExiste) {
        this.agregarGarantiaAPropietario(garantiaDisponible);
        this.consolidarGarantiasDisponibles();
      }

      this.garantiaAsignadaSeleccionada = null;
      this.mensajeGarantiasDisponibles = '';

      if (this.garantiasAsignadas.length === 0) {
        this.mensajeGarantiasAsignadas = 'El crédito no tiene garantías matriculadas.';
      }
    }
  );
}

retirarTodasLasGarantias(): void {
  if (this.garantiasAsignadas.length === 0) {
    return;
  }

  this.confirmarAccion(
    '¿Desea retirar todas las garantías matriculadas?',
    () => {

      const disponiblesNuevas = this.garantiasAsignadas.map(garantia =>
        this.convertirAsignadaADisponibleVista(garantia)
      );

      disponiblesNuevas.forEach(garantia =>
        this.agregarGarantiaAPropietario(garantia)
      );

      this.consolidarGarantiasDisponibles();

      this.garantiasAsignadas = [];

      this.garantiaDisponibleSeleccionada = null;
      this.garantiaAsignadaSeleccionada = null;

      this.mensajeGarantiasDisponibles = '';
      this.mensajeGarantiasAsignadas = 'El crédito no tiene garantías matriculadas.';
    }
  );
}

  private agregarGarantiaAPropietario(garantia: GarantiaDisponibleVista): void {
    const llave = this.obtenerLlaveGarantiaDisponible(garantia);

    if (garantia.esTitular) {
      const yaExiste = this.garantiasDisponiblesTitular.some(item =>
        this.obtenerLlaveGarantiaDisponible(item) === llave
      );

      if (!yaExiste) {
        this.garantiasDisponiblesTitular = [...this.garantiasDisponiblesTitular, garantia];
      }

      return;
    }

    const yaExiste = this.garantiasDisponiblesCodeudores.some(item =>
      this.obtenerLlaveGarantiaDisponible(item) === llave
    );

    if (!yaExiste) {
      this.garantiasDisponiblesCodeudores = [...this.garantiasDisponiblesCodeudores, garantia];
    }
  }

  // ============================================================
  // CONVERSIONES
  // ============================================================

  private convertirDisponibleAAsignada(garantia: GarantiaDisponibleVista): GarantiaAsignada {
    return {
      consecutivo: garantia.consecutivo,
      matricula: garantia.matricula,
      tipo: garantia.tipo,
      respalda: garantia.respalda,
      cobertura: garantia.cobertura,
      totalDeuda: garantia.respalda,
      clase: garantia.clase,
      cantidadCreditos: garantia.cantidadCreditos,
      grupoGarantia: garantia.grupoGarantia,
      idTercero: garantia.idTerceroPropietario,
      descripcion: garantia.descripcion,
      fechaUltimoAvaluo: garantia.fechaUltimoAvaluo,
      fechaMatricula: garantia.fechaMatricula,
      propietariosGarantia: garantia.propietariosGarantia,
    };
  }

  private convertirAsignadaADisponibleVista(garantia: GarantiaAsignada): GarantiaDisponibleVista {
    const propietario = this.obtenerInformacionPropietario(garantia.idTercero);

    return {
      consecutivo: garantia.consecutivo,
      matricula: garantia.matricula,
      tipo: garantia.tipo,
      respalda: garantia.totalDeuda,
      cobertura: garantia.cobertura,
      clase: garantia.clase,
      cantidadCreditos: garantia.cantidadCreditos,
      grupoGarantia: garantia.grupoGarantia,
      descripcion: garantia.descripcion,
      fechaUltimoAvaluo: garantia.fechaUltimoAvaluo,
      idTerceroPropietario: garantia.idTercero,
      fechaMatricula: garantia.fechaMatricula,
      numeroDocumentoPropietario: propietario.numeroDocumento,
      nombrePropietario: propietario.nombre,
      esTitular: propietario.esTitular,
      indiceColorPropietario: propietario.indiceColor,
      propietariosGarantia: garantia.propietariosGarantia,
    };
  }

  private obtenerInformacionPropietario(idTercero: number): {
    numeroDocumento: string;
    nombre: string;
    esTitular: boolean;
    indiceColor: number;
  } {
    const esTitular = Number(this.creditoSeleccionado?.idTercero) === Number(idTercero);

    if (esTitular) {
      return {
        numeroDocumento: this.creditoSeleccionado?.numeroDocumento ?? this.numeroDocumento,
        nombre: this.creditoSeleccionado?.nombreAsociado ?? this.nombreAsociado,
        esTitular: true,
        indiceColor: 0
      };
    }

    const indiceCodeudor = this.codeudores.findIndex(
      codeudor => Number(codeudor.idTercero) === Number(idTercero)
    );

    const codeudor = indiceCodeudor >= 0 ? this.codeudores[indiceCodeudor] : null;

    return {
      numeroDocumento: codeudor?.numeroDocumento ?? '',
      nombre: codeudor?.nombreCompleto ?? 'Codeudor',
      esTitular: false,
      indiceColor: indiceCodeudor >= 0 ? (indiceCodeudor % 5) + 1 : 1
    };
  }

  // ============================================================
  // LLAVES DE COMPARACIÓN
  // ============================================================

  private obtenerLlaveGarantiaBase(garantia: GarantiaDisponible | GarantiaAsignada): string {
    return `${garantia.tipo}-${garantia.consecutivo}`;
  }

  private obtenerLlaveGarantiaDisponible(garantia: GarantiaDisponibleVista): string {
    return `${garantia.idTerceroPropietario}-${garantia.tipo}-${garantia.consecutivo}`;
  }

  private obtenerLlaveGarantiaAsignada(garantia: GarantiaAsignada): string {
    return `${garantia.idTercero}-${garantia.tipo}-${garantia.consecutivo}`;
  }

  // ============================================================
  // TOTALES
  // ============================================================

  get totalCobertura(): number {
    const mapaGarantias = new Map<string, number>();

    this.garantiasAsignadas.forEach(garantia =>
      mapaGarantias.set(
        this.obtenerLlaveGarantiaAsignada(garantia),
        Number(garantia.cobertura) || 0
      )
    );

    return Array.from(mapaGarantias.values()).reduce(
      (total: number, cobertura: number) => total + cobertura,
      0
    );
  }

  get totalRespaldado(): number {
    return this.creditos.reduce(
      (total: number, credito: ConsultarCreditosGarantiasResponse) =>
        total + (Number(credito.saldoDeuda) || 0),
      0
    );
  }

  get valorDisponible(): number {
    return this.totalCobertura - this.totalRespaldado;
  }

  get porcentajeDisponible(): number {
    if (this.totalCobertura <= 0) return 0;

    const porcentaje = (this.valorDisponible / this.totalCobertura) * 100;
    return Math.max(0, Math.min(100, porcentaje));
  }

  get claseDisponibilidad(): string {
    if (this.porcentajeDisponible > 25) return 'disponibilidad-verde';
    if (this.porcentajeDisponible > 5) return 'disponibilidad-amarilla';

    return 'disponibilidad-morada';
  }

  // ============================================================
  // PRESENTACIÓN
  // ============================================================

  obtenerTipoGarantia(tipo: string): string {
    switch (tipo) {
      case 'H': return 'Hipoteca';
      case 'P': return 'Pignoración';
      case 'T': return 'Títulos';
      default: return tipo || '';
    }
  }

  obtenerTooltipGarantia(grupoGarantia: string | null | undefined): string {
    if (!grupoGarantia) return 'Sin créditos relacionados';

    return grupoGarantia
      .split('-')
      .map((item: string) => {
        const partes = item.split(':');
        const cuenta = partes[0]?.trim() || '';
        const valor = Number(partes[1]) || 0;

        return `${cuenta}: ${this.formatearMoneda(valor)}`;
      })
      .join('\n');
  }

  obtenerTooltipPropietarios(
    propietariosGarantia: string | null | undefined
  ): string {
    if (!propietariosGarantia?.trim()) {
      return 'Sin propietarios';
    }

    const propietarios = propietariosGarantia
      .split('~')
      .map(propietario => {
        const partes = propietario.split('|');

        const numeroDocumento = partes[1]?.trim() || 'Sin documento';
        const nombreCompleto = partes[2]?.trim() || 'Sin nombre';

        return `${numeroDocumento} - ${nombreCompleto}`;
      })
      .join('\n');

    return `Propietario(s):\n${propietarios}`;
  }

  private formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  }

  // ============================================================
  // FILTROS Y LIMPIEZA
  // ============================================================

  cambiarTipoConsulta(cancelados: boolean): void {
    if (this.consultarCancelados === cancelados || this.cargando) return;

    this.consultarCancelados = cancelados;

    if (this.numeroDocumento.trim()) {
      this.consultarCreditos();
      return;
    }

    this.limpiarResultadoConsulta();
  }

  normalizarDocumento(): void {
    this.numeroDocumento = this.numeroDocumento.replace(/\s/g, '');
  }

  limpiar(): void {
    this.numeroDocumento = '';
    this.consultarCancelados = false;
    this.limpiarResultadoConsulta();
  }

  private limpiarResultadoGarantias(): void {
    this.garantiasDisponibles = [];
    this.garantiasDisponiblesTitular = [];
    this.garantiasDisponiblesCodeudores = [];
    this.garantiasAsignadas = [];
    this.codeudores = [];

    this.garantiaDisponibleSeleccionada = null;
    this.garantiaAsignadaSeleccionada = null;

    this.cargandoGarantias = false;
    this.cargandoCodeudores = false;

    this.mensajeCodeudores = '';
    this.mensajeGarantiasDisponibles = '';
    this.mensajeGarantiasAsignadas = '';
  }

  private limpiarResultadoConsulta(): void {
    this.creditos = [];
    this.creditoSeleccionado = null;
    this.nombreAsociado = '';
    this.mensaje = '';

    this.limpiarResultadoGarantias();
  }

  private obtenerMensajeError(error: any): string {
    if (typeof error?.error === 'string') return error.error;

    return error?.error?.mensaje
      ?? error?.error?.Mensaje
      ?? error?.error?.title
      ?? error?.message
      ?? 'No fue posible completar la consulta.';
  }

  private confirmarAccion( mensaje: string, accion: () => void ): void {
    Swal.fire({
      title: 'Advertencia',
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(result => {
      if (result.isConfirmed) {
        accion();
      }
    });
  } 


}