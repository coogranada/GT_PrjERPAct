import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, EventEmitter, input, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DetalleGarantiaCreditoDto, GarantiaCompartida, GarantiaDisponible, GarantiaRealAsignada, ObtenerCodeudorBasicoModel } from '../../../Models/Productos/cartera/gestion-credito.model';
import { LoadingService } from '../../../Services/shared/loading.service';
import { CarteraService } from '../../../Services/Productos/cartera.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cambiar-garantias-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './cambiar-garantias-modal.component.html',
  styleUrl: './cambiar-garantias-modal.component.css'
})
export class CambiarGarantiasModalComponent {
  //Garantias
  public garantiasRealesAsignadas: GarantiaRealAsignada[] = [];
  public garantiasCompartidasView: GarantiaCompartida[] = [];
  public isDisabledSaveGarantiasButton: boolean = true;
  public garantiasRealesAsignadasInicial: GarantiaRealAsignada[] = [];
  public garantiasDisponiblesInicialDeudor: GarantiaDisponible[] = [];
  public garantiasCompartidasInicial: GarantiaDisponible[] = [];
  public selectedRowsGarantia: Record<string, null | number> = {
    Consecutivo: null, Descripcion: null, Tipo: null, Respalda: null, Cobertura: null
  }
  private snapshotTomado = false;
  public codeudorSeleccionadoId?: number;
  public tablaDetalleActiva: string = '';
  public filaSeleccionadaGarantia: any = null;
  public selectedRowsGarantias: { [key: string]: number | null } = {
    codeudorDisponibles: null,
    deudorDisponibles: null,
    asignadas: null
  };

  public garantiasDisponiblesInicialCodeudor: GarantiaDisponible[] = [];


  @Input() garantiasForm!: FormGroup;
  @Input() mostrarGarantiasCodeudor: boolean = false;
  @Input() mostrarDetalleGarantia: boolean = false;
  @Input() isDisabledConfirmarGarantiasButton: boolean = true;
  @Input() isDisabledLimpiarGarantiasButton: boolean = true;

  @Input() garantiasEliminar: any[] = [];
  @Input() garantiasAgregar: any[] = [];
  @Input() listGarantiasDisponiblesDeudor: any[] = [];
  @Input() listGarantiasDisponiblesCodeudor: any[] = [];
  @Input() garantiasCompartidasBackendInput: any[] = [];
  @Input() garantiasRealesAsignadasInput: any[] = [];
  @Input() garantiasCompartidas: any[] = [];
  @Input() detalleGarantiaCreditos: any[] = [];
  @Input() codeudoresBasico: any[] = [];

  @Input() valorCoberturaDisponibleDeudor: number = 0;
  @Input() valorRespaldadoDisponibleDeudor: number = 0;
  @Input() valorCoberturaDisponibleCodeudor: number = 0;
  @Input() valorRespaldadoDisponibleCodeudor: number = 0;
  @Input() valorCoberturaCompartidas: number = 0;
  @Input() valorRespaldadoCompartidas: number = 0;
  @Input() SaldoCapital: number = 0;
  @Input() datosCuenta!: {
    idTercero: number,
    idCuenta: number
    idOficina: number;
    idProducto: number;
    idConsecutivo: number;
    idDigito: number;
    linea: number;
    nombreLinea: string;
    documento: string;
    nombre: string;
  };

  @Output() cerrar = new EventEmitter<boolean>();
  @Output() confirmar = new EventEmitter<any>();
  @Output() limpiar = new EventEmitter<void>();
  @Output() changeCodeudor = new EventEmitter<any>();
  @Output() agregarGarantia = new EventEmitter<any>();
  @Output() eliminarGarantia = new EventEmitter<any>();
  @Output() verDetalle = new EventEmitter<any>();

  @ViewChild('openModal', { static: true }) openModal!: ElementRef;


  constructor(private loading: LoadingService,
    private carteraService: CarteraService,
    private notif: ToastrService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['listGarantiasDisponiblesCodeudor']?.currentValue?.length) {
      this.listGarantiasDisponiblesCodeudor = this.procesarGarantiasDisponibles(
        this.listGarantiasDisponiblesCodeudor, true
      );
      this.calcularTotalesGarantias();
    }

    if (changes['garantiasCompartidasBackendInput']) {
      this.actualizarGarantiasCompartidasView();
      this.calcularTotalesGarantias();
    }
  }

  
  emitirConfirmacion() {
    this.confirmar.emit({
      asignadas: this.garantiasRealesAsignadas,
      agregar: this.garantiasAgregar,
      eliminar: this.garantiasEliminar,
      compartidas: this.garantiasCompartidasView,
      totales: {
        cobertura: this.valorCoberturaCompartidas,
        respalda: this.valorRespaldadoCompartidas
      }
    });
  }

  private actualizarGarantiasCompartidasView() {

    const backend = this.garantiasCompartidasBackendInput || [];

    const desdeAsignadas = this.garantiasRealesAsignadas
      .filter(g => Number(g.CantidadCreditos) >= 1)
      .map(g => ({
        lngConsecutivo: Number(g.Consecutivo),
        lngTercero: Number(g.IdTercero) || 0,
        IdGarantia: g.Matricula,
        Clase: g.Clase,
        Descripcion: g.Descripcion,
        Tipo: this.mapTipoGarantiaInverso(g.Tipo),
        Cobertura: Number(g.Cobertura) || 0,
        Respalda: Number(g.TotalDeuda) || 0,
        CantidadCreditos: Number(g.CantidadCreditos) || 0,
        GrupoGarantia: g.GrupoGarantia ?? ''
      }));

    const idsExistentes = new Set(
      backend.map(x => Number(x.lngConsecutivo))
    );

    const mapa = new Map<number, any>();

    backend.forEach(x => {
      mapa.set(Number(x.lngConsecutivo), { ...x });
    });

    desdeAsignadas.forEach(x => {
      mapa.set(Number(x.lngConsecutivo), { ...x });
    });

    this.garantiasCompartidasView = Array.from(mapa.values());

  }

  private inicializarModal(): void {
    const hayDatos =
      (this.listGarantiasDisponiblesDeudor?.length ?? 0) > 0 ||
      (this.listGarantiasDisponiblesCodeudor?.length ?? 0) > 0 ||
      (this.garantiasRealesAsignadas?.length ?? 0) > 0 ||
      (this.garantiasCompartidas?.length ?? 0) > 0;

    if (!hayDatos) return;

    if (!this.snapshotTomado) {

      this.garantiasRealesAsignadasInicial = JSON.parse(
        JSON.stringify(this.garantiasRealesAsignadas)
      );

      this.garantiasDisponiblesInicialDeudor = JSON.parse(
        JSON.stringify(this.listGarantiasDisponiblesDeudor)
      );

      this.garantiasCompartidasInicial = JSON.parse(
        JSON.stringify(this.garantiasCompartidasView)
      );

      this.snapshotTomado = true;
    }
  }

  private procesarGarantiasDisponibles(data: any[], esCodeudor: boolean): any[] {

    const saldoActual = Number(this.SaldoCapital) || 0;
    const idCuentaActual = this.datosCuenta?.idCuenta?.toString().trim();

    return (data ?? [])
      .filter(g =>
        !this.garantiasRealesAsignadas.some(
          r => Number(r.Consecutivo) === Number(g.Consecutivo)
        )
      )
      .map(g => {

        const eraInicial = this.garantiasRealesAsignadasInicial.some(
          x => Number(x.Consecutivo) === Number(g.Consecutivo)
        );

        const sigueAsignada = this.garantiasRealesAsignadas.some(
          x => Number(x.Consecutivo) === Number(g.Consecutivo)
        );

        let cantidad = Number(g.CantidadCreditos) || 0;
        let respalda = Number(g.Respalda) || 0;
        let grupoGarantia = (g.GrupoGarantia || '').toString();

        if (eraInicial && !sigueAsignada) {

          cantidad = Math.max(cantidad - 1, 0);
          respalda = Math.max(respalda - saldoActual, 0);

          if (grupoGarantia && idCuentaActual) {
            grupoGarantia = grupoGarantia
              .split('-')
              .map((x: string) => x.trim())
              .filter((item: string) => {
                const cuenta = (item.split(':')[0] || '').trim();
                return cuenta !== idCuentaActual;
              })
              .join('-');
          }
        }

        return {
          ...g,
          CantidadCreditos: cantidad,
          Respalda: respalda,
          GrupoGarantia: grupoGarantia
        };
      });
  }

  abrir() {

    ($('#cambiarGarantias') as any).modal('show');

    this.garantiasRealesAsignadas = JSON.parse(
      JSON.stringify(this.garantiasRealesAsignadasInput)
    );

    this.garantiasRealesAsignadasInicial = JSON.parse(
      JSON.stringify(this.garantiasRealesAsignadasInput)
    );

    this.listGarantiasDisponiblesDeudor =
      this.procesarGarantiasDisponibles(
        this.listGarantiasDisponiblesDeudor,
        false
      );

    this.listGarantiasDisponiblesCodeudor =
      this.procesarGarantiasDisponibles(
        this.listGarantiasDisponiblesCodeudor,
        true
      );

    this.garantiasCompartidas = JSON.parse(
      JSON.stringify(this.garantiasCompartidasBackendInput || [])
    );

    this.garantiasDisponiblesInicialDeudor = JSON.parse(
      JSON.stringify(this.listGarantiasDisponiblesDeudor)
    );

    this.garantiasDisponiblesInicialCodeudor = JSON.parse(
      JSON.stringify(this.listGarantiasDisponiblesCodeudor)
    );

    this.garantiasCompartidasInicial = JSON.parse(
      JSON.stringify(this.garantiasCompartidasView)
    );

    this.actualizarGarantiasCompartidasView();
    this.calcularTotalesGarantias();
    this.inicializarModal();
  }

  cerrarModal() {
    ($('#cambiarGarantias') as any).modal('hide');
  }

  obtenerPorcentaje(disponible: number, cobertura: number): number {
    if (!cobertura || cobertura <= 0) return 0;
    return (disponible / cobertura) * 100;
  }

  obtenerEstado(respaldo: number, cobertura: number): string {
    const p = this.obtenerPorcentaje(respaldo, cobertura);
    if (p <= 75) return 'VERDE';
    if (p <= 95) return 'AMARILLO';
    return 'ROJO';
  }

  //Pasando Garantias
  selectRowGarantias(tableName: string, index: number, garantiaId?: any): void {
    if (this.mostrarDetalleGarantia && garantiaId &&
      this.filaSeleccionadaGarantia === garantiaId &&
      this.tablaDetalleActiva === tableName) {
      return;
    }

    if (this.selectedRowsGarantias[tableName] === index) {
      this.selectedRowsGarantias[tableName] = null;
    } else {
      Object.keys(this.selectedRowsGarantias).forEach(key => {
        this.selectedRowsGarantias[key] = null;
      });
      this.selectedRowsGarantias[tableName] = index;
    }
  }

  isRowSelected(tableName: string, index: number, garantiaId: any): boolean {
    if (this.mostrarDetalleGarantia &&
      this.filaSeleccionadaGarantia === garantiaId &&
      this.tablaDetalleActiva === tableName) {
      return true;
    }
    return this.selectedRowsGarantias[tableName] === index;
  }

  puedeAgregarGarantiaCodeudor(garantia: any): boolean {
    return Number(garantia.Cobertura) >= Number(garantia.Respalda);
  }

  onClickAgregarGarantia(index: number, tipo: 'codeudor' | 'deudor', event?: Event) {

    
    console.group('🟡 AGREGAR GARANTIA');
    console.log('Tipo:', tipo);
    console.log('Index:', index);

    this.mostrarDetalleGarantia = false;
    event?.stopPropagation();

    const lista = tipo === 'codeudor'
      ? this.listGarantiasDisponiblesCodeudor
      : this.listGarantiasDisponiblesDeudor;

    const garantia = lista[index];

    if (!garantia) return;
    const idTercero = tipo === 'codeudor'
      ? this.codeudorSeleccionadoId
      : this.datosCuenta.idTercero;

    const idCuentaActual = this.datosCuenta.idCuenta?.toString().trim();
    const valorActual = Number(this.SaldoCapital) || 0;

    let grupoGarantia = (garantia.GrupoGarantia || '').toString().trim();

        console.log(grupoGarantia, '😊');


    const nuevoGrupo = `${idCuentaActual}:${valorActual}`;

    console.log(nuevoGrupo, '😊😊');
    

    if (!grupoGarantia) {
      grupoGarantia = nuevoGrupo;
    } else {
      const existe = grupoGarantia
        .split('-')
        .some((x: string) =>
          (x.split(':')[0] || '').trim() === idCuentaActual
        );

      if (!existe) {
        grupoGarantia = `${grupoGarantia}-${nuevoGrupo}`;
      }
    }

    console.log(grupoGarantia, '👌');
    

    const gruposUnicos = new Set<string>();
    let valorRespaldaAsignado = 0;

    grupoGarantia
      .split('-')
      .map((x: string) => x.trim())
      .filter((x: string) => x)
      .forEach((item: string) => {

        if (!gruposUnicos.has(item)) {
          gruposUnicos.add(item);

          const partes = item.split(':');

          if (partes.length >= 2) {
            valorRespaldaAsignado += Number(partes[1]) || 0;
          }
        }
      });

          console.log(grupoGarantia, '👌--.');

    const cantidadCreditos = gruposUnicos.size;

    const nueva: GarantiaRealAsignada = {
      Matricula: garantia.Matricula,
      Clase: garantia.Clase,
      Descripcion: garantia.Descripcion,
      Cobertura: garantia.Cobertura,
      Consecutivo: Number(garantia.Consecutivo),
      Tipo: garantia.Tipo,
      IdTercero: idTercero,
      TotalDeuda: valorRespaldaAsignado,
      CantidadCreditos: cantidadCreditos,
      GrupoGarantia: grupoGarantia
    };

    console.log(nueva, '🤠');
    
    this.garantiasRealesAsignadas.push(nueva);

    this.actualizarGarantiasCompartidasView();


    lista.splice(index, 1);

    this.garantiasAgregar.push(nueva);

    const idxCompartida = this.garantiasCompartidas.findIndex(
      x => Number(x.lngConsecutivo) === Number(garantia.Consecutivo)
    );

    if (idxCompartida !== -1) {

      this.garantiasCompartidas[idxCompartida] = {
        ...this.garantiasCompartidas[idxCompartida],
        Respalda: valorRespaldaAsignado,
        CantidadCreditos: cantidadCreditos,
        GrupoGarantia: grupoGarantia
      };

    } else {

      this.garantiasCompartidas.push({
        lngConsecutivo: Number(garantia.Consecutivo),
        lngTercero: Number(idTercero) || 0,

        IdGarantia: garantia.Matricula,
        Clase: garantia.Clase,
        Descripcion: garantia.Descripcion,

        Tipo: this.mapTipoGarantiaInverso(garantia.Tipo),

        Cobertura: Number(garantia.Cobertura) || 0,
        Respalda: valorRespaldaAsignado,
        CantidadCreditos: cantidadCreditos,
        GrupoGarantia: grupoGarantia
      });
    }


    this.calcularTotalesGarantias();
  }

  mapTipoGarantiaInverso(tipo: string): string {
    if (!tipo) return '';

    switch (tipo) {
      case 'Hipoteca': return 'H';
      case 'Pignoración': return 'P';
      case 'Títulos': return 'T';
      default: return tipo;
    }
  }

  mapTipoGarantia(tipo: string): string {
    if (!tipo) return '';

    switch (tipo) {
      case 'H': return 'Hipoteca';
      case 'P': return 'Pignoración';
      case 'T': return 'Títulos';
      default: return tipo;
    }
  }

  private calcularTotalesGarantias() {

    this.valorCoberturaDisponibleDeudor = 0;
    this.valorRespaldadoDisponibleDeudor = 0;

    this.valorCoberturaDisponibleCodeudor = 0;
    this.valorRespaldadoDisponibleCodeudor = 0;

    this.valorCoberturaCompartidas = 0;
    this.valorRespaldadoCompartidas = 0;

    const obtenerGrupo = (grupo: any): string[] => {
      if (!grupo) return [];

      return grupo.toString()
        .split('-')
        .map((x: string) => x.trim())
        .filter((x: string) => x);
    };

    const sumarValoresGrupo = (grupo: any, gruposUnicos: Set<string>, totalRef: { valor: number }) => {
      const items = obtenerGrupo(grupo);

      items.forEach((item: string) => {
        const partes = item.split(':');
        const idCuenta = (partes[0] || '').trim();
        const valor = Number(partes[1]) || 0;

        if (idCuenta && !gruposUnicos.has(idCuenta)) {
          gruposUnicos.add(idCuenta);
          totalRef.valor += valor;
        }
      });
    };

    /* ✅ DISPONIBLES DEUDOR */
    const gruposDeudor = new Set<string>();
    const totalDeudor = { valor: 0 };

    this.listGarantiasDisponiblesDeudor.forEach((garantia: GarantiaDisponible) => {
      const cobertura = Number(garantia.Cobertura) || 0;

      this.valorCoberturaDisponibleDeudor += cobertura;

      sumarValoresGrupo(
        garantia.GrupoGarantia,
        gruposDeudor,
        totalDeudor
      );
    });

    this.valorRespaldadoDisponibleDeudor = totalDeudor.valor;

    /* ✅ DISPONIBLES CODEUDOR */
    const gruposCodeudor = new Set<string>();
    const totalCodeudor = { valor: 0 };

    this.listGarantiasDisponiblesCodeudor.forEach((garantia: GarantiaDisponible) => {
      const cobertura = Number(garantia.Cobertura) || 0;

      this.valorCoberturaDisponibleCodeudor += cobertura;

      sumarValoresGrupo(
        garantia.GrupoGarantia,
        gruposCodeudor,
        totalCodeudor
      );
    });

    this.valorRespaldadoDisponibleCodeudor = totalCodeudor.valor;

    /* ✅ GARANTÍAS COMPARTIDAS */
    const gruposCompartidas = new Set<string>();
    const totalCompartidas = { valor: 0 };

    this.garantiasCompartidasView?.forEach((garantia: any) => {
      const cobertura = Number(garantia.Cobertura) || 0;

      this.valorCoberturaCompartidas += cobertura;

      sumarValoresGrupo(
        garantia.GrupoGarantia,
        gruposCompartidas,
        totalCompartidas
      );
    });

    this.valorRespaldadoCompartidas = totalCompartidas.valor;

    /* ✅ BOTONES */
    this.isDisabledConfirmarGarantiasButton =
      this.sonMismasGarantias(
        this.garantiasRealesAsignadas,
        this.garantiasRealesAsignadasInicial,
        false
      );

    this.isDisabledLimpiarGarantiasButton =
      this.sonMismasGarantias(
        this.garantiasRealesAsignadas,
        this.garantiasRealesAsignadasInicial,
        true
      );
  }

//   private calcularTotalesGarantias() {

//   console.group('🔥🔥🔥 CALCULO TOTAL GARANTIAS ❤️❤️❤️');

//   this.valorCoberturaDisponibleDeudor = 0;
//   this.valorRespaldadoDisponibleDeudor = 0;

//   this.valorCoberturaDisponibleCodeudor = 0;
//   this.valorRespaldadoDisponibleCodeudor = 0;

//   this.valorCoberturaCompartidas = 0;
//   this.valorRespaldadoCompartidas = 0;

//   const obtenerGrupo = (grupo: any): string[] => {
//     if (!grupo) return [];

//     return grupo.toString()
//       .split('-')
//       .map((x: string) => x.trim())
//       .filter((x: string) => x);
//   };

//   const sumarValoresGrupo = (
//     grupo: any,
//     gruposUnicos: Set<string>,
//     totalRef: { valor: number }
//   ) => {

//     console.group('🧠 PROCESANDO GRUPO ❤️', grupo);

//     const items = obtenerGrupo(grupo);

//     items.forEach((item: string) => {

//       console.log('➡️ ITEM:', item);

//       const partes = item.split(':');
//       const idCuenta = (partes[0] || '').trim();
//       const valor = Number(partes[1]) || 0;

//       console.log('   cuenta:', idCuenta, '| valor:', valor);

//       if (idCuenta && !gruposUnicos.has(idCuenta)) {

//         gruposUnicos.add(idCuenta);
//         totalRef.valor += valor;

//         console.log('   ✅ SUMA:', valor);

//       } else {

//         console.log('   ❌ IGNORADO (duplicado):', idCuenta);

//       }
//     });

//     console.groupEnd();
//   };

//   /* ✅ GARANTÍAS COMPARTIDAS — ESTE ES EL FOCO 🔥 */
//   const gruposCompartidas = new Set<string>();
//   const totalCompartidas = { valor: 0 };

//   console.group('📊 GARANTIAS COMPARTIDAS ❤️❤️❤️');

//   this.garantiasCompartidasView?.forEach((garantia: any, index: number) => {

//     console.group(`🔎 GARANTIA [${index}]`);

//     console.log('📦 DATOS:', garantia);

//     const cobertura = Number(garantia.Cobertura) || 0;

//     console.log('💰 Cobertura:', cobertura);

//     this.valorCoberturaCompartidas += cobertura;

//     console.log('🧩 GrupoGarantia:', garantia.GrupoGarantia);

//     sumarValoresGrupo(
//       garantia.GrupoGarantia,
//       gruposCompartidas,
//       totalCompartidas
//     );

//     console.groupEnd();
//   });

//   console.groupEnd();

//   this.valorRespaldadoCompartidas = totalCompartidas.valor;

//   console.log('✅✅✅ RESULTADO FINAL ❤️❤️❤️', {
//     cobertura: this.valorCoberturaCompartidas,
//     respaldo: this.valorRespaldadoCompartidas
//   });

//   console.groupEnd();

//   /* ✅ BOTONES */
//   this.isDisabledConfirmarGarantiasButton =
//     this.sonMismasGarantias(
//       this.garantiasRealesAsignadas,
//       this.garantiasRealesAsignadasInicial,
//       false
//     );

//   this.isDisabledLimpiarGarantiasButton =
//     this.sonMismasGarantias(
//       this.garantiasRealesAsignadas,
//       this.garantiasRealesAsignadasInicial,
//       true
//     );
// }



  private sonMismasGarantias(a: any[], b: any[], limpiarButton: boolean): boolean {
    if (!limpiarButton) {
      if (this.garantiasRealesAsignadas.length === 0) return true;
    }

    if (a.length !== b.length) return false;

    const ordenA = [...a]
      .map(x => Number(x.Consecutivo))
      .sort((x, y) => x - y);

    const ordenB = [...b]
      .map(x => Number(x.Consecutivo))
      .sort((x, y) => x - y);

    return ordenA.every((id, i) => id === ordenB[i]);
  }

  onClickLimpiarGarantias() {
    this.garantiasRealesAsignadas = JSON.parse(JSON.stringify(this.garantiasRealesAsignadasInicial));

    this.listGarantiasDisponiblesDeudor = JSON.parse(JSON.stringify(this.garantiasDisponiblesInicialDeudor));
    this.garantiasCompartidas = JSON.parse(JSON.stringify(this.garantiasCompartidasInicial));
    this.listGarantiasDisponiblesCodeudor = [];

    Object.keys(this.selectedRowsGarantias).forEach(key => {
      this.selectedRowsGarantias[key] = null;
    });

    
    this.actualizarGarantiasCompartidasView();

    this.garantiasAgregar = [];
    this.garantiasEliminar = [];

    this.selectedRowsGarantia = {
      Consecutivo: null,
      Descripcion: null,
      Tipo: null,
      Respalda: null,
      Cobertura: null
    };

    this.calcularTotalesGarantias();

    this.garantiasForm.get('codeudorSeleccionado')?.setValue('');
    this.isDisabledConfirmarGarantiasButton = true;
    this.isDisabledLimpiarGarantiasButton = true;
    this.isDisabledSaveGarantiasButton = true;
    this.mostrarGarantiasCodeudor = false;
    this.mostrarDetalleGarantia = false;

  }

  onChangeCodeudor() {
    const id = this.garantiasForm.get('codeudorSeleccionado')?.value;

    if (!id) return;

    this.codeudorSeleccionadoId = id;
    this.mostrarGarantiasCodeudor = true;
    this.changeCodeudor.emit(id);
  }

  onClickCerrarModalGarantias() {

    this.snapshotTomado = false; 

    this.garantiasForm.reset();
    this.cerrar.emit(true);
    this.garantiasAgregar = [];
    this.garantiasEliminar = [];
    this.garantiasRealesAsignadas = [];
    this.garantiasCompartidas = []
    this.isDisabledConfirmarGarantiasButton = true;
    this.isDisabledLimpiarGarantiasButton = true;
    this.isDisabledSaveGarantiasButton = true;
    this.mostrarGarantiasCodeudor = false;
    this.mostrarDetalleGarantia = false

    this.valorCoberturaDisponibleDeudor = 0
    this.valorRespaldadoDisponibleDeudor = 0
    this.valorCoberturaDisponibleCodeudor = 0
    this.valorRespaldadoDisponibleCodeudor = 0
    this.valorCoberturaCompartidas = 0
    this.valorRespaldadoCompartidas = 0
    this.SaldoCapital = 0
  }

  onClickEliminarGarantia(index: number, event?: Event) {
    this.mostrarDetalleGarantia = false;
    event?.stopPropagation();

    const garantia = this.garantiasRealesAsignadas[index];
    const esDeudor = Number(garantia.IdTercero) === this.datosCuenta.idTercero;
    const hayCodeudorSeleccionado = !!this.codeudorSeleccionadoId;
    const esMismoCodeudor = Number(garantia.IdTercero) === Number(this.codeudorSeleccionadoId);
    const idCuenta = this.datosCuenta.idCuenta;

    let valorRespaldaDisponible = 0;
    let grupoGarantiaNuevo = '';

    const grupo = (garantia.GrupoGarantia || '').toString().trim();

    if (grupo) {
      const items = grupo.split('-')
        .map((x: string) => x.trim())
        .filter((x: string) => x);

      const gruposFiltrados: string[] = [];

      items.forEach((item: string) => {
        const partes = item.split(':');
        const idGrupo = (partes[0] || '').trim();
        const valorGrupo = Number(partes[1]) || 0;

        if (Number(idGrupo) !== this.datosCuenta.idCuenta) {
          valorRespaldaDisponible += valorGrupo;
          gruposFiltrados.push(item);
        }
      });

      grupoGarantiaNuevo = gruposFiltrados.join('-');
    } else {
      valorRespaldaDisponible = Number(garantia.TotalDeuda) || 0;
    }

    let cantidadCreditos = Number(garantia.CantidadCreditos) || 0;
    cantidadCreditos -= 1;

    if (cantidadCreditos < 0) cantidadCreditos = 0;

    if (esDeudor) {
      this.listGarantiasDisponiblesDeudor.push({
        Consecutivo: garantia.Consecutivo,
        Matricula: garantia.Matricula,
        Clase: garantia.Clase,
        Descripcion: garantia.Descripcion,
        Tipo: garantia.Tipo,
        Respalda: valorRespaldaDisponible,
        Cobertura: garantia.Cobertura,
        IdTercero: garantia.IdTercero,
        CantidadCreditos: cantidadCreditos,
        GrupoGarantia: grupoGarantiaNuevo
      });
    }

    // this.garantiasEliminar.push(garantia);
    // this.garantiasRealesAsignadas.splice(index, 1);
    // ✅ VALIDAR SI FUE AGREGADA EN ESTA SESIÓN
const idxAgregada = this.garantiasAgregar.findIndex(
  g => Number(g.Consecutivo) === Number(garantia.Consecutivo)
);

if (idxAgregada !== -1) {
  // ✅ Si fue agregada en esta sesión → solo quitarla del array agregar
  this.garantiasAgregar.splice(idxAgregada, 1);
} else {
  // ✅ Si venía de BD → sí eliminar
  this.garantiasEliminar.push(garantia);
}

// ✅ SIEMPRE quitar de asignadas
this.garantiasRealesAsignadas.splice(index, 1);

    const idxCompartida = this.garantiasCompartidas.findIndex(
      x => Number(x.lngConsecutivo) === Number(garantia.Consecutivo)
    );

    if (idxCompartida !== -1) {
      if (!esDeudor) {
        this.garantiasCompartidas.splice(idxCompartida, 1);
      } else {
        if (cantidadCreditos > 0) {
          this.garantiasCompartidas[idxCompartida] = {
            ...this.garantiasCompartidas[idxCompartida],
            Respalda: valorRespaldaDisponible,
            CantidadCreditos: cantidadCreditos,
            GrupoGarantia: grupoGarantiaNuevo
          };
        } else {
          this.garantiasCompartidas.splice(idxCompartida, 1);
        }
      }
    }

    if (!esDeudor && hayCodeudorSeleccionado && esMismoCodeudor) {

      this.listGarantiasDisponiblesCodeudor.push({
          Consecutivo: garantia.Consecutivo,
          Matricula: garantia.Matricula,
          Clase: garantia.Clase,
          Descripcion: garantia.Descripcion,
          Tipo: garantia.Tipo,
          Respalda: valorRespaldaDisponible,
          Cobertura: garantia.Cobertura,
          IdTercero: garantia.IdTercero,
          CantidadCreditos: cantidadCreditos,
          GrupoGarantia: grupoGarantiaNuevo
        });
    }

    this.actualizarGarantiasCompartidasView();
    this.calcularTotalesGarantias();

  }

  cerrarDetalleGarantia(event?: Event) {
    if (event) event.stopPropagation();

    this.mostrarDetalleGarantia = false;
    this.filaSeleccionadaGarantia = null;
    this.tablaDetalleActiva = '';
    this.detalleGarantiaCreditos = [];
  }

  onClickDetalleGarantia(garantiaId: any, tipo?: any, tabla?: string, strMatricula?: string) {

    if (this.mostrarDetalleGarantia &&
      this.filaSeleccionadaGarantia === garantiaId &&
      this.tablaDetalleActiva === tabla
    ) {
      this.cerrarDetalleGarantia();
      return;
    }

    this.filaSeleccionadaGarantia = garantiaId;
    this.tablaDetalleActiva = tabla || '';

    Object.keys(this.selectedRowsGarantias).forEach(key => {
      this.selectedRowsGarantias[key] = null;
    });

    this.loading.show();

    this.carteraService.obtenerDetalleGarantiaCreditos(
      garantiaId,
      this.mapTipoGarantia(tipo)
    )
      .pipe(finalize(() => this.loading.hide()))
      .subscribe({
        next: (data) => {

          let detalle = data || [];

          const idCuentaActual = Number(this.datosCuenta.idCuenta) || 0;
          const esDisponibleOCompartida =
            tabla === 'deudorDisponibles' ||
            tabla === 'codeudorDisponibles' ||
            tabla === 'compartidas';

          if (esDisponibleOCompartida) {
            detalle = detalle.filter((item: any) => {

              const idDetalle = Number(
                item.IdCuenta ?? item.lngIdCuenta ?? item.Cuenta
              ) || 0;

              return idDetalle !== idCuentaActual;
            });
          }

          if (tabla === 'asignadas' || tabla === 'compartidas') {

            const garantiaActual = this.garantiasRealesAsignadas.find(
              g => Number(g.Consecutivo) === Number(garantiaId)
            );

            const tieneCreditoActual = garantiaActual?.GrupoGarantia
              ?.toString()
              .split('-')
              .some((x: string) =>
                (x.split(':')[0] || '').trim() === String(idCuentaActual)
              );

            if (tieneCreditoActual) {

              const yaExiste = detalle.some((item: any) => {
                const idDetalle = Number(item.IdCuenta ?? item.lngIdCuenta ?? item.Cuenta) || 0;
                return idDetalle === idCuentaActual;
              });

              if (!yaExiste) {

                const garantiaBase: DetalleGarantiaCreditoDto = detalle.length > 0
                  ? detalle[0]
                  : {
                    Garantia: garantiaId,
                    strMatricula: strMatricula || '',
                    IdCuenta: 0,
                    Cuenta: '',
                    Linea: 0,
                    NombreLinea: '',
                    IdDeudor: '',
                    NombreDeudor: '',
                    ValorCredito: 0
                  };

                const cuentaTexto = this.generarCuenta(
                  this.datosCuenta.idOficina,
                  this.datosCuenta.idProducto,
                  this.datosCuenta.idConsecutivo,
                  this.datosCuenta.idDigito);
                const linea = this.datosCuenta.linea;
                const nombreLinea = this.datosCuenta.nombreLinea;
                const documento = this.datosCuenta.documento;
                const nombre = this.datosCuenta.nombre;
                const valorCredito = Number(this.SaldoCapital) || 0;
                const registroFake: DetalleGarantiaCreditoDto = {
                  ...garantiaBase,
                  strMatricula: strMatricula || garantiaBase.strMatricula || '', // ✅ FORZAR AQUÍ
                  IdCuenta: idCuentaActual,
                  Cuenta: cuentaTexto,
                  Linea: linea,
                  NombreLinea: nombreLinea,
                  IdDeudor: documento,
                  NombreDeudor: nombre,
                  ValorCredito: valorCredito
                };
                detalle.push(registroFake);
              }
            }
          }

          this.detalleGarantiaCreditos = detalle;
          this.mostrarDetalleGarantia = true;
        },

        error: () => {

          this.notif.warning(
            'Advertencia',
            'No fue posible consultar los créditos asociados.'
          );

          this.cerrarDetalleGarantia();
        }
      });
  }

  private generarCuenta(oficina: any, producto: any, consecutivo: any, digito: any): string {
    const ofi = String(Number(oficina) || 0).padStart(3, '0');
    const pro = String(Number(producto) || 0).padStart(3, '0');
    const con = String(Number(consecutivo) || 0).padStart(7, '0');
    const dig = String(Number(digito) || 0).padStart(1, '0');

    return `${ofi}-${pro}-${con}-${dig}`;
  }


}
