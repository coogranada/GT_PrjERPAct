import { Component, effect, ElementRef, inject, input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarteraService } from '../../../../../Services/Productos/cartera.service';
import { PeriodoPago } from '../../../../../Models/Productos/cartera/gestion-credito.model';
import { GarantiaEnum, PeriodoPagoEnum, TipoSistemas } from '../../../../../Models/Productos/cartera/gestion-credito.enum';
import { Asesor, NegociacionForm, ProductoCredito } from '../../../../../Models/Creditos/GestionCredito/gestion-credito.model';
import { ShareComponentModule } from '../../../../../Modules/share-component.module';
import { AsesoriaTerminoService } from '../../../../../Services/Productos/asesoriaTermino.service';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { GestionCreditoService } from '../../../../../Services/Productos/GestionCredito.service';
import { concatWithSpace } from '../../../../../utils/helpers';
import { PorcentajeDirective } from '../../../../shared/directives/porcentaje.directive';
import { CommonModule } from '@angular/common';
import { PERIODOS_MESES, SISTEMAS } from '../../../../../Models/Creditos/GestionCredito/gestion-credito-constants';
import { CambiarGarantiasModalComponent } from '../../../../shared/cambiar-garantias-modal/cambiar-garantias-modal.component';
import { CambiarGarantiasRequestDto, DetalleGarantiaCreditoDto, GarantiaCompartida, GarantiaDisponible, GarantiaRealAsignada, ObtenerCodeudorBasicoModel } from '../../../../../Models/Productos/garantias.model';
import { GarantiasService } from '../../../../../Services/Productos/garantias.service';
import { LoadingService } from '../../../../../Services/shared/loading.service';
import { concatMap, finalize, forkJoin, map, mergeMap, Observable, of, tap, throwError } from 'rxjs';
import { DisponiblesService } from '../../../../../Services/Productos/disponible.service';
import { ERP_MESSAGES, ERP_TOAST } from '../../../../../utils/constant';
import { IdModulo } from '../../../../../Models/Generales/modulos.enum';
import { InputBusquedaComponent } from '../../../../shared/input-busqueda/input-busqueda.component';

@Component({
  selector: 'app-tab-negociacion',
  imports: [CommonModule, ReactiveFormsModule, ShareComponentModule, PorcentajeDirective, CambiarGarantiasModalComponent, InputBusquedaComponent],
  templateUrl: './tab-negociacion.component.html',
  styleUrl: './tab-negociacion.component.css',
  providers: [AsesoriaTerminoService, GestionCreditoService]
})
export class TabNegociacionComponent {

  idAsesoria = input<number | null>();
  idTercero = input<number | null>(null);
  deducciones = input<number | null>();
  saldoCancelar = input<number | null>();
  habilitado = input(false);
  desembolso = 0;

  sistemas = SISTEMAS;
  private readonly fb = inject(FormBuilder);

  // formNegociacion!: FormGroup<NegociacionForm>;

  formNegociacion = this.fb.group<NegociacionForm>({
    idProducto: this.fb.control({ value: null, disabled: true }),
    producto: this.fb.nonNullable.control({ value: '', disabled: true }),
    idLinea: this.fb.control({ value: null, disabled: true }),
    linea: this.fb.nonNullable.control({ value: '', disabled: true }),
    idSistema: this.fb.control({ value: null, disabled: true }),
    sistema: this.fb.nonNullable.control({ value: '', disabled: true }),
    idFormaPago: this.fb.control({ value: null, disabled: true }),
    formaPago: this.fb.nonNullable.control({ value: '', disabled: true }),
    idPeriodoCapital: this.fb.control({ value: null, disabled: true }),
    periodoCapital: this.fb.nonNullable.control({ value: '', disabled: true }),
    idPeriodoInteres: this.fb.control({ value: null, disabled: true }),
    periodoInteres: this.fb.nonNullable.control({ value: '', disabled: true }),
    monto: this.fb.control({ value: null, disabled: true }),
    plazo: this.fb.control({ value: null, disabled: true }),
    periodoGracia: this.fb.control({ value: null, disabled: true }),
    idGarantia: this.fb.control({ value: null, disabled: true }),
    garantia: this.fb.nonNullable.control({ value: '', disabled: true }),
    idTipoGarantia: this.fb.control({ value: null, disabled: true }),
    tipoGarantia: this.fb.nonNullable.control({ value: '', disabled: true }),
    idAsesor: this.fb.control({ value: null, disabled: true }),
    nombreAsesor: this.fb.nonNullable.control({ value: '', disabled: true }),
    idAsesorExterno: this.fb.control({ value: null, disabled: false }),
    nombreAsesorExterno: this.fb.nonNullable.control({ value: '', disabled: false }),
    indicador: this.fb.nonNullable.control({ value: '', disabled: true }),
    puntos: this.fb.control({ value: null, disabled: true }),
    tasaPeriodica: this.fb.control({ value: null, disabled: true }),
    tasaNominal: this.fb.control({ value: null, disabled: true }),
    tasaEfectiva: this.fb.control({ value: null, disabled: true }),
    // cuota: this.fb.control({ value: null, disabled: true })
  });
  readonly negF = this.formNegociacion.controls;

  //Producto
  columnasBusquedaProducto = [
    {
      field: 'idProducto',
      header: 'Producto'
    },
    {
      field: 'descripcionProducto',
      header: 'Descripción Producto'
    }
  ];

  buscarProductosPorCodigo = (codigo: string) =>
    this.gestionCreditoService.buscarProductosCredito(+codigo);

  buscarProductosPorNombre = (nombre: string) =>
    this.gestionCreditoService.buscarProductosCredito(null, nombre);

  mensajeProductoNoEncontrado = ERP_MESSAGES.ASESOR_EXT_NO_ENCONTRADO;
  //Fin producto

  periodosPagoCapital: PeriodoPago[] = [];
  get periodosPagoInteres(): PeriodoPago[] {
    const idPeriodoCapitalActual = this.formNegociacion.controls.idPeriodoCapital.value;
    if (idPeriodoCapitalActual == null) return [];
    if (idPeriodoCapitalActual === PeriodoPagoEnum.AlVencimiento) return this.periodosPagoCapital.filter(p => p.IdFrecuenciaPago !== PeriodoPagoEnum.AlVencimiento);

    const mesesCapital = PERIODOS_MESES[idPeriodoCapitalActual as keyof typeof PERIODOS_MESES];
    return this.periodosPagoCapital.filter(p => {
      const meses = PERIODOS_MESES[p.IdFrecuenciaPago as keyof typeof PERIODOS_MESES];
      if (!meses || !mesesCapital) return false;
      return meses <= mesesCapital && mesesCapital % meses === 0;
    });
  }
  formasPago: any[] = [];
  asesoresExternos: Asesor[] = [];
  productoBtnDisabled = true;
  lineaBtnDisabled = true;
  tipoGarantiaBtnDisabled = true;
  asesorExtBtnDisabled = true;
  calculatBtnDisabled = true;
  totalCuota: number | null = null;
  detalleGarantiasVisible = false;
  isFlipped = false;

  @ViewChild('searchButton')
  searchButton!: ElementRef<HTMLInputElement>;

  @ViewChild('modalAsesoresExterno', { static: true }) private modalAsesoresExterno!: ElementRef;

  //Garantias
  datosCuenta: any;
  garantiasCompartidas: GarantiaCompartida[] = [];
  garantiasRealesAsignadas: GarantiaRealAsignada[] = [];
  garantiasCompartidasBackend: GarantiaCompartida[] = [];
  listGarantiasDisponiblesDeudor: GarantiaDisponible[] = [];
  garantiasRealesAsignadasInicial: GarantiaRealAsignada[] = [];
  mostrarDetalleGarantia = false;
  valorCoberturaCompartidas: number = 0;
  mostrarModalGarantias = false;
  tablaDetalleActiva = '';
  filaSeleccionadaGarantia: number | null = null;
  selectedRowsGarantias: {
    [key: string]: number | null;
  } = {
      asignadas: null
    };
  public detalleGarantiaCreditos: DetalleGarantiaCreditoDto[] = [];
  @ViewChild('modalGarantias') modalGarantias!: CambiarGarantiasModalComponent;
  valorCoberturaDisponibleDeudor: number = 0;
  valorRespaldadoDisponibleDeudor: number = 0;
  valorRespaldadoCompartidas: number = 0;
  Modulo = IdModulo;
  idCuenta: number | null = null;
  //Fin garantias

  //Asesor externo
  columnasAsesorExterno = [
    {
      field: 'intIdAsesor',
      header: 'Código'
    },
    {
      field: 'Nombre',
      header: 'Nombre asesor externo'
    }
  ];

  buscarAsesorExtPorCodigo = (codigo: string) =>
    this.asesoriaTerminoServices.BuscarAsesorExternoCacheable({ strCodigo: +codigo, strNombre: null });

  buscarAsesorExtPorNombre = (nombre: string) =>
    this.asesoriaTerminoServices.BuscarAsesorExternoCacheable({ strCodigo: null, strNombre: nombre });

  mensajeAsesorExtNoEncontrado = ERP_MESSAGES.ASESOR_EXT_NO_ENCONTRADO;
  //Fin Asesor externo

  

  // private asesoriaTerminoServices = inject(AsesoriaTerminoService);
  constructor(
    // private fb: FormBuilder,
    private carteraService: CarteraService,
    private notif: ToastrService,
    private gestionCreditoService: GestionCreditoService,
    private asesoriaTerminoServices: AsesoriaTerminoService,
    private garantiasService: GarantiasService,
    private loading: LoadingService,
    // private disponiblesServices: DisponiblesService
  ) {

    effect(() => {
      const id = this.idAsesoria();

      if (!id) {
        return;
      }

      this.gestionCreditoService.consultarNegociacion(id).subscribe(
        {
          next: result => {

            const { primerApellidoAsesor: pa, segundoApellidoAsesor: sa, primerNombreAsesor: pn, segundoNombreAsesor: sn,
              primerApellidoAsesorExterno: paE, segundoApellidoAsesorExterno: saE, primerNombreAsesorExterno: pnE, segundoNombreAsesorExterno: snE
            } = result;
            const nombreAsesor = concatWithSpace(pa, sa, pn, sn);
            const nombreAsesorExterno = concatWithSpace(paE, saE, pnE, snE);

            this.formNegociacion.patchValue({
              idProducto: result.idProducto,
              producto: result.producto,
              idLinea: result.idLinea,
              linea: result.linea,
              idSistema: result.idSistema,
              sistema: result.sistema,
              idFormaPago: result.idFormaPago,
              formaPago: result.formaPago,
              idPeriodoCapital: result.idPeriodoCapital,
              periodoCapital: result.periodoCapital,
              idPeriodoInteres: result.idPeriodoInteres,
              periodoInteres: result.periodoInteres,
              monto: result.monto,
              plazo: result.plazo,
              periodoGracia: result.diasGracia,
              idGarantia: result.idGarantia,
              garantia: result.garantia,
              idTipoGarantia: result.idGarantia,
              tipoGarantia: result.garantia,
              idAsesor: result.idAsesor,
              nombreAsesor,
              idAsesorExterno: result.idAsesorExterno,
              nombreAsesorExterno,
              tasaPeriodica: result.tasaPeriodica,
              tasaNominal: result.tasaNominal,
              tasaEfectiva: result.tasaEfectiva,
              indicador: result.siglaIndicador,
              puntos: result.puntos
            });
            this.totalCuota = result.cuota
            const deducciones = this.deducciones();
            const saldoCancelar = this.saldoCancelar();
            if (deducciones && saldoCancelar != null && saldoCancelar != undefined) {
              this.desembolso = result.monto - deducciones - saldoCancelar;
              this.totalCuota += deducciones;
            }

            this.loading.show();
            this.cargarGarantias().subscribe(() => {
              this.loading.hide();

              const tieneGarantias = this.listGarantiasDisponiblesDeudor.length || this.garantiasCompartidasBackend.length;
              if (result.idGarantia === GarantiaEnum.Admisible && tieneGarantias) {
                this.detalleGarantiasVisible = true;
              }

            });



            // this.detalleGarantiasVisible = true;
          },
          error: () => {

          }
        }
      )

    });

    effect(() => {
      if (this.habilitado()) {
        this.negF.idProducto.enable();
        this.negF.producto.enable();
        this.productoBtnDisabled = false;
      }
    })
  }



  ngOnInit(): void {
    // this.carteraService.getPeriodosPagoCacheable()
    //   .subscribe(data => this.periodosPagoCapital = data);

    // this.gestionCreditoService.getFormasPago()
    //   .subscribe(data => this.formasPago = data);


    // this.aplicarReglasSistema(TipoSistemas.CuotaFija);

    const { sistema, periodoGracia, idAsesorExterno, nombreAsesorExterno } = this.formNegociacion.controls;

    sistema.valueChanges.subscribe(idSistema => {
      if (idSistema == null) return;
      // this.aplicarReglasSistema(idSistema);
      // const perGraciaControl = this.cambiarInfoCreditoForm.controls.periodoGracia;
      // perGraciaControl.setValue(this.context.datosFormData.PeriodoGracia, { emitEvent: false }); //Valor original
      // plazo.setValue(this.context.datosFormData.Plazo, { emitEvent: false });
      // /* if (this.maxPeriodoGracia > 0) */ periodoGracia.enable();
      // if (idSistema && this.esCuotaVariable(idSistema)) {
      //   periodoGracia.setValue(0, { emitEvent: false });
      //   periodoGracia.disable();
      // }

      // this.aplicarReglasPeriodosPlazo();
    });

    // idAsesorExterno.valueChanges.subscribe(() => {
    //   nombreAsesorExterno.setValue('', { emitEvent: false });
    // });

    // nombreAsesorExterno.valueChanges.subscribe(() => {
    //   idAsesorExterno.setValue(null, { emitEvent: false });
    // });
  }

  onProductoSeleccionado(producto: ProductoCredito) {
    
    
  }


  onIdAsesorInput() {
    this.formNegociacion.controls.nombreAsesorExterno.setValue('', { emitEvent: false });
  }

  onNombreAsesorInput() {
    this.formNegociacion.controls.idAsesorExterno.setValue(null, { emitEvent: false });
  }

  esCuotaVariable(idSistema: number) {
    return idSistema === TipoSistemas.CuotaVariable || idSistema === TipoSistemas.CuotaVariableTasaVariable;
  }

  private aplicarReglasSistema(idSistema: number): void {
    const { periodoCapital, periodoInteres } = this.formNegociacion.controls;

    // if (idSistema === TipoSistemas.CuotaFija || idSistema === TipoSistemas.CuotaFijaTasaVariable) {
    //   periodoCapital.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
    //   periodoCapital.disable({ emitEvent: false });

    //   periodoInteres.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
    //   periodoInteres.disable({ emitEvent: false });

    // } else {
    //   periodoCapital.reset();
    //   periodoCapital.enable({ emitEvent: false });

    //   periodoInteres.reset();
    //   periodoInteres.enable({ emitEvent: false });
    // }
  }


  mapearAsesorExterno(asesor: Asesor) {

    // this.formNegociacion.patchValue({
    //   idAsesorExterno: asesor.intIdAsesor,
    //   nombreAsesorExterno: asesor.Nombre
    // });

    // this.modalAsesoresExterno.nativeElement.click();
  }



  //Inicio cambiar garantias

  // cargarGarantias() {
  //   forkJoin({
  //     garantiasDisponibles: this.garantiasService.getGarantiasDisponibles(this.idTercero()!),
  //     garantiasCompartidas: this.garantiasService.getGarantiasCompartidasPorIdTercero(this.idTercero()!)
  //   }).subscribe({
  //     next: ({ garantiasDisponibles, garantiasCompartidas }) => {
  //       this.listGarantiasDisponiblesDeudor = garantiasDisponibles ?? [];
  //       this.garantiasCompartidasBackend = garantiasCompartidas ?? [];

  //       // if (this.listGarantiasDisponiblesDeudor.length === 0 && this.garantiasCompartidasBackend.length === 0) { //En caso de que no tenga garantias.
  //       //   this.loading.hide();
  //       //   this.notif.warning(ERP_TOAST.WARNING, 'No tiene garantias.', ConfiguracionNotificacion.configRightTop);

  //       //   return;
  //       // }

  //       const idCuenta = (this.listGarantiasDisponiblesDeudor[0] ?? this.garantiasCompartidasBackend[0])?.GrupoGarantia?.split(':').shift();
  //       if (idCuenta) this.idCuenta = +idCuenta;

  //       //Filtramos las garantias que ya estan en compartidas, en disponibles solo quedan las nuevas.
  //       const matriculas = garantiasCompartidas.map(g => g.IdGarantia);
  //       this.listGarantiasDisponiblesDeudor = this.listGarantiasDisponiblesDeudor.filter(g => !matriculas.includes(g.Matricula));

  //       this.getDatosSimulacion();

  //       // this.loading.hide();
  //       // this.mostrarModalGarantias = true;
  //       // setTimeout(() => {
  //       //   this.modalGarantias.abrir();
  //       // });


  //     },
  //     error: err => {
  //       // this.loading.hide();
  //     }
  //   });
  // }

  cargarGarantias(): Observable<void> {
    return forkJoin({
      garantiasDisponibles: this.garantiasService.getGarantiasDisponibles(this.idTercero()!),
      garantiasCompartidas: this.garantiasService.getGarantiasCompartidasPorIdTercero(this.idTercero()!)
    }).pipe(
      tap(({ garantiasDisponibles, garantiasCompartidas }) => {
        this.listGarantiasDisponiblesDeudor = garantiasDisponibles ?? [];
        this.garantiasCompartidasBackend = garantiasCompartidas ?? [];

        const idCuenta = (this.listGarantiasDisponiblesDeudor[0] ?? this.garantiasCompartidasBackend[0])?.GrupoGarantia?.split(':').shift();
        if (idCuenta) this.idCuenta = +idCuenta;

        //Filtramos las garantias que ya estan en compartidas, en disponibles solo quedan las nuevas.
        const matriculas = garantiasCompartidas.map(g => g.IdGarantia);
        this.listGarantiasDisponiblesDeudor = this.listGarantiasDisponiblesDeudor.filter(g => !matriculas.includes(g.Matricula));
        this.getDatosSimulacion();
      }),
      map(() => void 0)
    );
  }

  // habilitarCambiarGarantia() {



  // }

  getDatosSimulacion() {
    this.datosCuenta = {
      idTercero: this.idTercero(),
      idCuenta: this.idCuenta
    };
  }


  getGarantiasDisponibles(idTercero: number) {
    this.loading.show();
    return this.garantiasService.getGarantiasDisponibles(idTercero).pipe(
      tap((data: any) => {
        this.listGarantiasDisponiblesDeudor = data ?? [];
        this.loading.hide();
      })
    );
  }

  onClickCerrarModalGarantias() {
    this.garantiasRealesAsignadas = [];
    this.mostrarDetalleGarantia = false;
    ($('#cambiarGarantias') as any).modal('hide');
    this.mostrarModalGarantias = false;
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

  cerrarDetalleGarantia(event?: Event) {
    if (event) event.stopPropagation();

    this.mostrarDetalleGarantia = false;
    this.filaSeleccionadaGarantia = null;
    this.tablaDetalleActiva = '';
    this.detalleGarantiaCreditos = [];
  }

  onClickDetalleGarantia(garantiaId: number, tipo: string, tabla: string) {

    if (
      this.mostrarDetalleGarantia &&
      this.filaSeleccionadaGarantia === garantiaId &&
      this.tablaDetalleActiva === tabla
    ) {

      this.cerrarDetalleGarantia();
      return;
    }

    this.filaSeleccionadaGarantia = garantiaId;
    this.tablaDetalleActiva = tabla;

    this.loading.show();

    this.carteraService.obtenerDetalleGarantiaCreditos(garantiaId, this.mapTipoGarantia(tipo))
      .pipe(finalize(() => this.loading.hide())).subscribe({
        next: (data) => {
          this.detalleGarantiaCreditos = data ?? [];
          this.mostrarDetalleGarantia = true;
        },
        error: () => {

          this.notif.warning(
            ERP_TOAST.WARNING,
            ERP_MESSAGES.CONSULTA_CREDITOS_ASOCIADOS_ERROR,
            ConfiguracionNotificacion.configRightTop
          );

          this.cerrarDetalleGarantia();
        }
      });
  }

  onClickVerGarantias() {
    this.mostrarModalGarantias = true;
    setTimeout(() => {
      this.modalGarantias.abrir();
    });
  }

  //Fin cambiar garantías


}
