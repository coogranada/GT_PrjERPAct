import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, EventEmitter, input, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DetalleGarantiaCreditoDto, GarantiaCompartida, GarantiaDisponible, GarantiaRealAsignada, ObtenerCodeudorBasicoModel } from '../../../Models/Productos/cartera/gestion-credito.model';
import { LoadingService } from '../../../Services/shared/loading.service';
import { CarteraService } from '../../../Services/Productos/cartera.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { TooltipService } from '../../../Services/Tooltip/tooltip.service';

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
  public garantiasCompartidasInicial: GarantiaCompartida[] = [];
  public isDisabledSaveGarantiasButton: boolean = true;
  public garantiasRealesAsignadasInicial: GarantiaRealAsignada[] = [];
  public garantiasDisponiblesInicialDeudor: GarantiaDisponible[] = [];
  public garantiasDerivadas: GarantiaCompartida[] = [];
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
  @Input() listGarantiasDisponiblesCodeudor: GarantiaDisponible[] = [];
  @Input() garantiasRealesAsignadasInput: any[] = [];
  @Input() garantiasCompartidasBackendInput: any[] = [];
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
    idTercero: number;
    idCuenta: number;
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
  @Output() changeCodeudor = new EventEmitter<any>();

  @ViewChild('openModal', { static: true }) openModal!: ElementRef;


  constructor(private loading: LoadingService,
    private carteraService: CarteraService,
    private notif: ToastrService,
    private tooltipService: TooltipService,
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
    const desdeBackend = [...(this.garantiasCompartidasBackendInput || [])];

    const idsDerivadasOcultas = new Set(
      this.garantiasDerivadas.map(
        x => Number(x.lngConsecutivo)
      )
    );

    const backendFiltrado =
      desdeBackend.filter(
        x => !idsDerivadasOcultas.has(
          Number(x.lngConsecutivo)
        )
      );

    const desdeAsignadas =
      this.garantiasRealesAsignadas
        .filter(g => Number(g.CantidadCreditos) > 0)
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

    const mapa = new Map<number, any>();
          
    backendFiltrado.forEach(x => {
      mapa.set(Number(x.lngConsecutivo), { ...x });
    });
    
    desdeAsignadas.forEach(x => {
      mapa.set(Number(x.lngConsecutivo), { ...x });
    });
    
    this.garantiasDerivadas.forEach(x => {
      mapa.set(Number(x.lngConsecutivo), { ...x });
    });
    
    this.garantiasCompartidasView =
      Array.from(mapa.values());
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
    (data ?? []).forEach(g => {

      const existe = this.garantiasRealesAsignadas.some(
        r => Number(r.Consecutivo) === Number(g.Consecutivo)
      );

    });
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

    this.actualizarGarantiasCompartidasView();
    
    this.garantiasCompartidasInicial = JSON.parse(
      JSON.stringify(this.garantiasCompartidasView)
    );

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

  onClickAgregarGarantia(index: number,tipo: 'codeudor' | 'deudor',event?: Event) 
  {
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

    const nuevoGrupo = `${idCuentaActual}:${valorActual}`;

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

    const cantidadCreditos = (Number(garantia.CantidadCreditos) || 0) + 1;

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

    this.garantiasRealesAsignadas.push(nueva);

    this.actualizarGarantiasCompartidasView();

    lista.splice(index, 1);

    this.garantiasAgregar.push(nueva);

    if (tipo === 'codeudor') {
      this.cargarGarantiasDerivadas(
        Number(garantia.Consecutivo),
        garantia.Tipo
      );
    }
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

    this.isDisabledConfirmarGarantiasButton =
      this.sonMismasGarantias(
        this.garantiasRealesAsignadas,
        this.garantiasRealesAsignadasInicial,
      );

    this.isDisabledLimpiarGarantiasButton =
      this.sonMismasGarantias(
        this.garantiasRealesAsignadas,
        this.garantiasRealesAsignadasInicial,
      );
  }

  private sonMismasGarantias(a: any[], b: any[]): boolean {

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
    this.garantiasCompartidasView = JSON.parse(JSON.stringify(this.garantiasCompartidasInicial));
    this.listGarantiasDisponiblesCodeudor = [];

    Object.keys(this.selectedRowsGarantias).forEach(key => {
      this.selectedRowsGarantias[key] = null;
    });

    this.garantiasDerivadas = [];
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
    this.garantiasDerivadas = [];
    this.garantiasRealesAsignadas = [];
    this.listGarantiasDisponiblesDeudor = [];
    this.listGarantiasDisponiblesCodeudor =[]
    this.garantiasCompartidas = []
    this.isDisabledConfirmarGarantiasButton = true;
    this.garantiasCompartidasView = [];
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

  private EliminarDerivadasPorBase(baseId: number): void {

    const derivadas = this.garantiasCompartidasView.filter(
      x => Number(x.IdGarantiaBase) === Number(baseId)
    );


    if (!derivadas.length) {
      return;
    }

    const consecutivos = derivadas.map(d => Number(d.lngConsecutivo));

    // Eliminar de garantiasDerivadas
    this.garantiasDerivadas = this.garantiasDerivadas.filter(
      x => !consecutivos.includes(Number(x.lngConsecutivo))
    );

    // Eliminar de garantiasCompartidasView
    this.garantiasCompartidasView = this.garantiasCompartidasView.filter(
      x => !consecutivos.includes(Number(x.lngConsecutivo))
    );

        // Eliminar de garantiasCompartidas
    this.garantiasCompartidas = this.garantiasCompartidas.filter(
      x => !consecutivos.includes(Number(x.lngConsecutivo))
    );

            // Eliminar de garantiasCompartidas
    this.garantiasCompartidasBackendInput = this.garantiasCompartidasBackendInput.filter(
      x => !consecutivos.includes(Number(x.lngConsecutivo))
    );

  }

  esGarantiaDerivada(garantia: any): boolean {
    return !!garantia.IdGarantiaBase;
  }

  onClickEliminarGarantia(index: number, event?: Event) {

    this.mostrarDetalleGarantia = false;
    event?.stopPropagation();

    const garantia = this.garantiasRealesAsignadas[index];
    const esDeudor = Number(garantia.IdTercero) === this.datosCuenta.idTercero;
    const hayCodeudorSeleccionado = !!this.codeudorSeleccionadoId;

    const esMismoCodeudor = Number(garantia.IdTercero) === Number(this.codeudorSeleccionadoId);

    // CODEUDOR:
    // ocultar derivadas asociadas
    if (!esDeudor) {
      this.EliminarDerivadasPorBase(
        Number(garantia.Consecutivo)
      );
    }

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

    if (esDeudor) {

      cantidadCreditos--;

      if (cantidadCreditos < 0) {
        cantidadCreditos = 0;
      }

    } else {

      // Regla de negocio:
      // garantía de codeudor siempre sale
      cantidadCreditos = 0;

      grupoGarantiaNuevo = '';
      valorRespaldaDisponible = 0;

    }

    if (cantidadCreditos === 0) {

      grupoGarantiaNuevo = '';
      valorRespaldaDisponible = 0;

    }

    // BACKEND INPUT
    const idxBackend =
      this.garantiasCompartidasBackendInput.findIndex(
        x =>
          Number(x.lngConsecutivo) ===
          Number(garantia.Consecutivo)
      );

    if (idxBackend !== -1) {

      if (
        esDeudor &&
        cantidadCreditos > 0
      ) {

        this.garantiasCompartidasBackendInput[idxBackend] = {
          ...this.garantiasCompartidasBackendInput[idxBackend],
          CantidadCreditos: cantidadCreditos,
          Respalda: valorRespaldaDisponible,
          GrupoGarantia: grupoGarantiaNuevo
        };

      } else {

        this.garantiasCompartidasBackendInput.splice(
          idxBackend,
          1
        );

      }

    }

    // COMPARTIDAS
    const idxCompartida =
      this.garantiasCompartidas.findIndex(
        x =>
          Number(x.lngConsecutivo) ===
          Number(garantia.Consecutivo)
      );

    if (idxCompartida !== -1) {

      if ( esDeudor && cantidadCreditos > 0) {

        this.garantiasCompartidas[idxCompartida] = {
          ...this.garantiasCompartidas[idxCompartida],
          CantidadCreditos: cantidadCreditos,
          Respalda: valorRespaldaDisponible,
          GrupoGarantia: grupoGarantiaNuevo
        };

      } else {
        this.garantiasCompartidas.splice(idxCompartida, 1);
      }
    }

    // DEVOLVER A DISPONIBLES DEUDOR
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

    const idxAgregada =this.garantiasAgregar.findIndex(
        g =>Number(g.Consecutivo) === Number(garantia.Consecutivo)
      );

    if (idxAgregada !== -1) {

      this.garantiasAgregar.splice(
        idxAgregada,
        1
      );

    } else {

      const yaExisteEliminar = this.garantiasEliminar.some(
          g => Number(g.Consecutivo) === Number(garantia.Consecutivo)
        );
        
      if (!yaExisteEliminar) {
        this.garantiasEliminar.push(garantia);
      }

    }

    // ELIMINAR DE ASIGNADAS
    this.garantiasRealesAsignadas.splice(
      index,
      1
    );

    // DEVOLVER A DISPONIBLES CODEUDOR
    if (
      !esDeudor &&
      hayCodeudorSeleccionado &&
      esMismoCodeudor
    ) {

      this.listGarantiasDisponiblesCodeudor.push({
        Consecutivo: garantia.Consecutivo,
        Matricula: garantia.Matricula,
        Clase: garantia.Clase,
        Descripcion: garantia.Descripcion,
        Tipo: garantia.Tipo,
        Respalda: valorRespaldaDisponible,
        Cobertura: garantia.Cobertura,
        IdTercero: garantia.IdTercero,
        CantidadCreditos: garantia.CantidadCreditos - 1,
        GrupoGarantia: ''
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
    ).pipe(finalize(() => this.loading.hide())).subscribe({
      next: (data) => {
        let detalle = data || [];

        if (tabla === 'compartidas') {
          const garantiaVista = this.garantiasCompartidasView.find(
            x => Number(x.lngConsecutivo) === Number(garantiaId)
          );

          if (garantiaVista?.GrupoGarantia) {

            const cuentasVigentes = garantiaVista.GrupoGarantia
              .split('-')
              .map((x: string) => x.split(':')[0]?.trim());

            detalle = detalle.filter(
              (item: any) =>
                cuentasVigentes.includes(
                  String(item.IdCuenta).trim()
                )
            );
          }
        }

        const idCuentaActual = Number(this.datosCuenta.idCuenta) || 0;
        const esDisponible = tabla === 'deudorDisponibles' || tabla === 'codeudorDisponibles';

        if (esDisponible) {
          detalle = detalle.filter((item: any) => {
            const idDetalle = Number(
              item.IdCuenta ??
              item.lngIdCuenta ??
              item.Cuenta
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

              const idDetalle = Number(
                item.IdCuenta ??
                item.lngIdCuenta ??
                item.Cuenta
              ) || 0;

              return idDetalle === idCuentaActual;

            });

            if (!yaExiste) {

              const garantiaBase: DetalleGarantiaCreditoDto =
                detalle.length > 0
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
                this.datosCuenta.idDigito
              );

              const registroFake: DetalleGarantiaCreditoDto = {
                ...garantiaBase,
                strMatricula:
                  strMatricula ||
                  garantiaBase.strMatricula ||
                  '',
                IdCuenta: idCuentaActual,
                Cuenta: cuentaTexto,
                Linea: this.datosCuenta.linea,
                NombreLinea: this.datosCuenta.nombreLinea,
                IdDeudor: this.datosCuenta.documento,
                NombreDeudor: this.datosCuenta.nombre,
                ValorCredito: Number(this.SaldoCapital) || 0
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
          'No fue posible consultar los créditos asociados.',
          ConfiguracionNotificacion.configRightTop
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

  obtenerTooltipGarantiaDerivada(item: GarantiaCompartida): string {
    return (
      `Garantía derivada:\n` +
      `Garantía base: ${item.IdGarantiaBaseExterna}\n` +
      `Crédito compartido: ${item.CreditoIntermedio ?? 'No disponible'}`
    );
  }

  private cargarGarantiasDerivadas( garantia: number, tipo: string ): void {
    this.loading.show();
    this.carteraService.getGarantiasDerivadas(garantia,tipo,this.datosCuenta.idCuenta)
      .subscribe({
        next: derivadas => {
          if (!derivadas?.length) {
            
            this.loading.hide();
            return;
          }
          derivadas.forEach(d => {

            const existe = this.garantiasDerivadas.some(
              x => Number(x.lngConsecutivo) === Number(d.lngConsecutivo)
            );

            if (!existe) {
              this.garantiasDerivadas.push({
                ...d
              });
            }

          });

          this.actualizarGarantiasCompartidasView();
          this.calcularTotalesGarantias();
          this.loading.hide();

        },

        error: err => {
          this.loading.hide();
          console.error(
            'Error consultando garantías derivadas',
            err
          );
        }

      });
  }
}
