import { Component, effect, ElementRef, inject, input, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarteraService } from '../../../../../Services/Productos/cartera.service';
import { PeriodoPago } from '../../../../../Models/Productos/cartera/gestion-credito.model';
import { GarantiaEnum, PeriodoPagoEnum, TipoSistemas } from '../../../../../Models/Productos/cartera/gestion-credito.enum';
import { Asesor, AsesoriaEncabezadoForm, CalcularCreditoRequest, CombinacionResponse, FormaPagoResponse, LineaResponse, NegociacionForm, ProductoCredito, TiposGarantiasResponse } from '../../../../../Models/Creditos/GestionCredito/gestion-credito.model';
import { ShareComponentModule } from '../../../../../Modules/share-component.module';
import { AsesoriaTerminoService } from '../../../../../Services/Productos/asesoriaTermino.service';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { GestionCreditoService } from '../../../../../Services/Productos/GestionCredito.service';
import { concatWithSpace, obtenerEstadoFormulario, obtenerSistemasPermitidos } from '../../../../../utils/helpers';
import { PorcentajeDirective } from '../../../../shared/directives/porcentaje.directive';
import { CommonModule } from '@angular/common';
import { PERIODOS_MESES, periodosCompatiblesValidator, SISTEMAS } from '../../../../../Models/Creditos/GestionCredito/gestion-credito-constants';
import { CambiarGarantiasModalComponent } from '../../../../shared/cambiar-garantias-modal/cambiar-garantias-modal.component';
import { CambiarGarantiasRequestDto, DetalleGarantiaCreditoDto, GarantiaCompartida, GarantiaDisponible, GarantiaRealAsignada, ObtenerCodeudorBasicoModel } from '../../../../../Models/Productos/garantias.model';
import { GarantiasService } from '../../../../../Services/Productos/garantias.service';
import { LoadingService } from '../../../../../Services/shared/loading.service';
import { concatMap, filter, finalize, forkJoin, map, merge, Observable, of, Subject, takeUntil, tap, throwError } from 'rxjs';
import { DisponiblesService } from '../../../../../Services/Productos/disponible.service';
import { ERP_MESSAGES, ERP_TOAST } from '../../../../../utils/constant';
import { IdModulo } from '../../../../../Models/Generales/modulos.enum';
import { InputBusquedaComponent } from '../../../../shared/input-busqueda/input-busqueda.component';
import { AsesoriaOperacion } from '../../../../../Models/Creditos/GestionCredito/gestion-credito-enum';
import { StorageSecurity } from '../../../../../utils/storage-security.util';

@Component({
  selector: 'app-tab-negociacion',
  imports: [CommonModule, ReactiveFormsModule, ShareComponentModule, PorcentajeDirective, CambiarGarantiasModalComponent, InputBusquedaComponent],
  templateUrl: './tab-negociacion.component.html',
  styleUrl: './tab-negociacion.component.css',
  providers: [AsesoriaTerminoService, GestionCreditoService]
})
export class TabNegociacionComponent {

  // idAsesoria = input<number | null>();
  idTercero = input.required<number | null>();
  formEncabezado = input.required<FormGroup<AsesoriaEncabezadoForm>>();
  deducciones = input.required<number>();
  saldoCancelar = input.required<number>();
  // inputProductoHabilitado = input(false);
  desembolso = 0;
  private destroy$ = new Subject<void>();

  lineaSeleccionada: LineaResponse | null = null;

  sistemas: {
    id: TipoSistemas;
    descripcion: string;
  }[] = [];
  private readonly fb = inject(FormBuilder);

  // formNegociacion!: FormGroup<NegociacionForm>;

  formNegociacion = this.fb.group<NegociacionForm>({
    idProducto: this.fb.control({ value: null, disabled: true }),
    producto: this.fb.nonNullable.control({ value: '', disabled: true }),
    idLinea: this.fb.control({ value: null, disabled: true }),
    linea: this.fb.nonNullable.control({ value: '', disabled: true }),
    // idSistema: this.fb.control({ value: null, disabled: true }),
    sistema: this.fb.nonNullable.control({ value: '', disabled: true }),
    selectSistema: this.fb.control({ value: null, disabled: true }),
    // idFormaPago: this.fb.control({ value: null, disabled: true }),
    formaPago: this.fb.nonNullable.control({ value: '', disabled: true }),
    selectFormaPago: this.fb.control({ value: null, disabled: true }),
    // idPeriodoCapital: this.fb.control({ value: null, disabled: true }),
    periodoCapital: this.fb.nonNullable.control({ value: '', disabled: true }),
    selectPeriodoCapital: this.fb.control({ value: null, disabled: true }),
    // idPeriodoInteres: this.fb.control({ value: null, disabled: true }),
    periodoInteres: this.fb.nonNullable.control({ value: '', disabled: true }),
    selectPeriodoInteres: this.fb.control({ value: null, disabled: true }),
    monto: this.fb.control({ value: null, disabled: true }),
    plazo: this.fb.control({ value: null, disabled: true }),
    periodoGracia: this.fb.control({ value: null, disabled: true }),
    idGarantia: this.fb.control({ value: null, disabled: true }),
    selectGarantia: this.fb.control({ value: null, disabled: true }),
    garantia: this.fb.nonNullable.control({ value: '', disabled: true }),
    idTipoGarantia: this.fb.control({ value: null, disabled: true }),
    tipoGarantia: this.fb.nonNullable.control({ value: '', disabled: true }),
    idAsesor: this.fb.control({ value: null, disabled: true }),
    nombreAsesor: this.fb.nonNullable.control({ value: '', disabled: true }),
    idAsesorExterno: this.fb.control({ value: null, disabled: true }),
    nombreAsesorExterno: this.fb.nonNullable.control({ value: '', disabled: true }),
    indicador: this.fb.nonNullable.control({ value: '', disabled: true }),
    puntos: this.fb.control({ value: null, disabled: true }),
    tasaPeriodica: this.fb.control({ value: null, disabled: true }),
    tasaNominal: this.fb.control({ value: null, disabled: true }),
    tasaEfectiva: this.fb.control({ value: null, disabled: true }),
    // cuota: this.fb.control({ value: null, disabled: true })
  },
  {
    validators: [periodosCompatiblesValidator]
  } 
  );
  negociacionFormEstadoInicial = obtenerEstadoFormulario(this.formNegociacion);

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

  mensajeProductoNoEncontrado = ERP_MESSAGES.REGISTRO_NO_ENCONTRADO;
  productoBtnDisabled = true;

  //Fin producto


  //Lineas
  columnasBusquedaLinea = [
    {
      field: 'idLinea',
      header: 'Linea'
    },
    {
      field: 'linea',
      header: 'Descripción Linea'
    }
  ];

  buscarLineasPorCodigo = (codigo: string) =>
    this.gestionCreditoService.buscarLineas(this.negF.idProducto.value!, +codigo);

  buscarLineasPorNombre = (nombre: string) =>
    this.gestionCreditoService.buscarLineas(this.negF.idProducto.value!, null, nombre);

  mensajeLineaNoEncontrada = ERP_MESSAGES.REGISTRO_NO_ENCONTRADO;
  lineaBtnDisabled = true;
  combinacionesPermitidas: CombinacionResponse[] = [];
  combinacionesValidas: CombinacionResponse[] = [];

  // periodosCapitalValidos: PeriodoPago[] = [];
  formasPagoValidas: FormaPagoResponse[] = [];
  garantiasValidas: { id: number; descripcion: string; }[] = [];
  plazoMinimo: null | number = null;
  plazoMaximo: null | number = null;
  //Fin lineas

  mostrarSelectSistemas = false;
  mostrarSelectFormaPago = false;
  mostrarSelectPerCapital = false;
  mostrarSelectPerInteres = false;
  mostrarSelectGarantia = false;

  periodosPago: PeriodoPago[] = [];
  // get periodosPagoInteres(): PeriodoPago[] {
  //   const idPeriodoCapitalActual = this.formNegociacion.controls.selectPeriodoCapital.value;
  //   if (idPeriodoCapitalActual == null) return [];
  //   if (idPeriodoCapitalActual === PeriodoPagoEnum.AlVencimiento) return this.periodosPagoCapital.filter(p => p.IdFrecuenciaPago !== PeriodoPagoEnum.AlVencimiento);

  //   const mesesCapital = PERIODOS_MESES[idPeriodoCapitalActual as keyof typeof PERIODOS_MESES];
  //   return this.periodosPagoCapital.filter(p => {
  //     const meses = PERIODOS_MESES[p.IdFrecuenciaPago as keyof typeof PERIODOS_MESES];
  //     if (!meses || !mesesCapital) return false;
  //     return meses <= mesesCapital && mesesCapital % meses === 0;
  //   });
  // }
  get periodoInteresMeses() {
    return PERIODOS_MESES[this.negF.selectPeriodoInteres.value as keyof typeof PERIODOS_MESES];
  }
  periodosInteresValidos: PeriodoPago[] = []
  formasPago: FormaPagoResponse[] = [];
  asesoresExternos: Asesor[] = [];
  tipoGarantiaBtnDisabled = true;
  asesorExtBtnDisabled = true;
  calcularBtnDisabled = true;
  valorPrestamo = 0;
  totalCuota: number  = 0;
  get detalleGarantiasVisible() {
    const idGarantia = this.negF.idGarantia.value ?? this.negF.selectGarantia.value;
    return idGarantia === GarantiaEnum.Admisible && (this.listGarantiasDisponiblesDeudor.length > 0 || this.garantiasCompartidasBackend.length > 0);
  }
  // detalleGarantiasVisible = false;
  isFlipped = false;

  @ViewChild('searchButton')
  searchButton!: ElementRef<HTMLInputElement>;

  @ViewChild('modalAsesoresExterno', { static: true }) private modalAsesoresExterno!: ElementRef;

  inputBusquedaProducto = viewChild<InputBusquedaComponent>('inputBusquedaProducto');
  

  //Garantias
  yaCargaronGarantiasPreviamente = false;
  garantias = [{ id: 5, descripcion: 'Admisible' }, { id: 10, descripcion: 'No Admisible' }];
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

  //Tipo garantia
  columnasBusquedaTipoGarantia = [
    {
      field: 'idTipoGarantia',
      header: 'Tipo Garantía'
    },
    {
      field: 'tipoGarantia',
      header: 'Descripción Tipo Garantia'
    }
  ];

  buscarTiposGarantiasPorCodigo = (codigo: string) =>
    this.gestionCreditoService.buscarTiposGarantias(+codigo);

  buscarTiposGarantiasPorNombre = (nombre: string) =>
    this.gestionCreditoService.buscarTiposGarantias(null, nombre);

  onTipoGarantiaSeleccionada(tipoGarantia: TiposGarantiasResponse) {

  }

  //Fin tipo garantia

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

    // effect(() => {
    //   this.cargarNegociacion();
    // });

    // effect(() => {
    //   if (this.inputProductoHabilitado()) {
    //     this.negF.idProducto.enable();
    //     this.negF.producto.enable();
    //     this.productoBtnDisabled = false;
    //   } 
    // })
  }



  ngOnInit(): void {
    this.carteraService.getPeriodosPagoCacheable()
      .subscribe(data => this.periodosPago = data);

    this.gestionCreditoService.getFormasPago()
      .subscribe(data => this.formasPago = data);


    // this.aplicarReglasSistema(TipoSistemas.CuotaFija);


    // this.formEncabezado()?.controls.asesoria.valueChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.cargarNegociacion();
    //   })


    this.formEncabezado()?.controls.idOperacion.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(idOp => {
        // this.resetearFormularioNeg();

        if (idOp === AsesoriaOperacion.NuevaAsesoria) {

        }

      });

    // this.formEncabezado()?.controls.tipoDocumento.valueChanges
    //   .pipe(
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(tipoDoc => {
    //     const idOp = this.formEncabezado().controls.idOperacion.value;
    //     if (idOp === AsesoriaOperacion.NuevaAsesoria) {
    //       this.negF.idProducto.enable({ emitEvent: false });
    //       this.negF.producto.enable({ emitEvent: false });
    //       this.productoBtnDisabled = false;
    //     }

    //     if(!tipoDoc) {
    //       this.negF.idProducto.disable({ emitEvent: false });
    //       this.negF.producto.disable({ emitEvent: false });
    //       this.productoBtnDisabled = true;
    //     }
    //   });

    const { idProducto, producto, idLinea, linea, selectSistema, periodoGracia, idAsesorExterno, nombreAsesorExterno, selectGarantia } = this.negF;


    merge(idProducto.valueChanges, producto.valueChanges)
      .pipe(takeUntil(this.destroy$))
      .subscribe(idProducto => {
        const idLinea = this.negF.idLinea.value;
        if (idLinea) {
          this.negF.idLinea.reset({ value: null, disabled: true });
          this.negF.linea.reset({ value: '', disabled: true });
          this.lineaBtnDisabled = true;
        }



      });

    merge(idLinea.valueChanges, linea.valueChanges)
      .pipe(takeUntil(this.destroy$))
      .subscribe(idLinea => {
        this.reiniciarNegociacion();
      });

    // selectSistema.valueChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(idSistema => {
    //     if (idSistema == null) return;
    //     this.negF.selectFormaPago.enable();
    //     // this.negF.selectPeriodoCapital.enable();
    //     // this.negF.selectPeriodoInteres.enable();
    //     this.negF.monto.enable();
    //     this.negF.plazo.enable();
    //     // this.negF.selectGarantia.enable();

    //     if (!this.esCuotaVariable(idSistema)) {
    //       this.negF.periodoGracia.enable();
    //     } else {
    //       this.negF.periodoGracia.reset({ value: null, disabled: true });
          
    //     }

    //     // const perGraciaControl = this.cambiarInfoCreditoForm.controls.periodoGracia;
    //     // perGraciaControl.setValue(this.context.datosFormData.PeriodoGracia, { emitEvent: false }); //Valor original
    //     // plazo.setValue(this.context.datosFormData.Plazo, { emitEvent: false });
    //     // /* if (this.maxPeriodoGracia > 0) */ periodoGracia.enable();
    //     // if (idSistema && this.esCuotaVariable(idSistema)) {
    //     //   periodoGracia.setValue(0, { emitEvent: false });
    //     //   periodoGracia.disable();
    //     // }

    //     // this.aplicarReglasPeriodosPlazo();
    //   });

    // idAsesorExterno.valueChanges.subscribe(() => {
    //   nombreAsesorExterno.setValue('', { emitEvent: false });
    // });

    // nombreAsesorExterno.valueChanges.subscribe(() => {
    //   idAsesorExterno.setValue(null, { emitEvent: false });
    // });

    // this.negF.selectFormaPago.valueChanges.subscribe(idFormaPago => {
    //   if (idFormaPago == null) return;
    //   const { selectPeriodoCapital, selectPeriodoInteres, selectSistema } = this.negF;

      

    //   this.actualizarPeriodosInteresValidos(idFormaPago);
    //   if (this.esCuotaVariable(selectSistema.value!)) {

    //     // if (this.lineaSeleccionada?.sigla === 'CROT') {
    //     //   selectPeriodoCapital.enable({ emitEvent: false });
    //     //   selectPeriodoInteres.setValue(PeriodoPagoEnum.Mes);
    //     // } else {
    //     //   selectPeriodoCapital.enable({ emitEvent: false });
    //     //   selectPeriodoInteres.enable({ emitEvent: false });
    //     // }

    //     selectPeriodoCapital.enable({ emitEvent: false });
    //       selectPeriodoInteres.enable({ emitEvent: false });
          
    //   } else {
    //     selectPeriodoCapital.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
    //     selectPeriodoCapital.disable({ emitEvent: false });
    //     selectPeriodoInteres.setValue(PeriodoPagoEnum.Mes);
    //     selectPeriodoInteres.disable({ emitEvent: false });
    //   }

    //   // this.negF.selectPeriodoCapital.enable({ emitEvent: false });
    //   // this.negF.selectPeriodoInteres.enable({ emitEvent: false });
    //   // this.onFormaPagoChange(idFormaPago);
    //   // this.aplicarReglasSistema(this.negF.selectSistema.value!);

    //   // this.actualizarCombinacionesValidas();
    //   this.actualizarPlazos();
    //   this.habilitarCalcular();

    // });





    this.negF.selectSistema.valueChanges.subscribe(idSistema => {
      if (idSistema == null) return;
      const { selectPeriodoCapital, selectPeriodoInteres, selectSistema, monto, plazo, periodoGracia } = this.negF;

      this.actualizarPeriodosInteresValidos();
      monto.enable();
      plazo.enable();
      if (this.esCuotaVariable(selectSistema.value!)) {
        periodoGracia.reset({ value: null, disabled: true });

        if (this.lineaSeleccionada?.sigla === 'CROT') {
          selectPeriodoCapital.enable({ emitEvent: false });
          selectPeriodoInteres.setValue(PeriodoPagoEnum.Mes);
        } else {
          selectPeriodoCapital.enable({ emitEvent: false });
          selectPeriodoInteres.enable({ emitEvent: false });
        }

        // selectPeriodoCapital.enable({ emitEvent: false });
        // selectPeriodoInteres.enable({ emitEvent: false });

      } else {
        selectPeriodoCapital.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
        selectPeriodoCapital.disable({ emitEvent: false });
        selectPeriodoInteres.setValue(PeriodoPagoEnum.Mes);
        selectPeriodoInteres.disable({ emitEvent: false });
        periodoGracia.enable();
      }

      // this.negF.selectPeriodoCapital.enable({ emitEvent: false });
      // this.negF.selectPeriodoInteres.enable({ emitEvent: false });
      // this.onFormaPagoChange(idFormaPago);
      // this.aplicarReglasSistema(this.negF.selectSistema.value!);

      // this.actualizarCombinacionesValidas();
      this.actualizarPlazos();
      this.habilitarCalcular();

    });




    this.negF.selectPeriodoCapital.valueChanges.subscribe(idPer => {
      if (idPer == null) return;
      // this.actualizarPlazos();
      this.habilitarCalcular();

    });

    // this.negF.selectPeriodoInteres.valueChanges.subscribe(idPer => {
    //   if (idPer == null) return;
    //   this.negF.selectGarantia.enable();
    //   this.actualizarGarantiasValidas(idPer);
    //   // this.onPeriodoInteresChange(idPer);
    //   // this.actualizarCombinacionesValidas();
    //   this.actualizarPlazos();
    //   this.habilitarCalcular();

    // });

    this.negF.selectPeriodoInteres.valueChanges.subscribe(idPer => {
      if (idPer == null) return;
      this.negF.selectFormaPago.enable();
      this.actualizarFormaPagoValidas(idPer);
      // this.onPeriodoInteresChange(idPer);
      // this.actualizarCombinacionesValidas();
      this.actualizarPlazos();
      this.habilitarCalcular();

    });



    this.negF.selectFormaPago.valueChanges.subscribe(idFormaPago => {
      if (idFormaPago == null) return;
      this.negF.selectGarantia.enable();
      this.actualizarGarantiasValidas(idFormaPago);
      // this.onPeriodoInteresChange(idPer);
      // this.actualizarCombinacionesValidas();
      this.actualizarPlazos();
      this.habilitarCalcular();

    });

    this.negF.plazo.valueChanges.subscribe(plazo => {
      if (plazo == null) return;
      // this.actualizarPlazos();
    });

    selectGarantia.valueChanges.subscribe(idGar => {      
      if (idGar == null) return;
      
      // this.actualizarCombinacionesValidas();
      this.actualizarPlazos();
      this.habilitarCalcular();
      if(idGar === GarantiaEnum.NoAdmisible) {
        this.negF.idTipoGarantia.reset({ value: null, disabled: false });
        this.negF.tipoGarantia.reset({ value: '', disabled: false });
        this.tipoGarantiaBtnDisabled = false;
      } else {
        this.negF.idTipoGarantia.reset({ value: GarantiaEnum.Admisible, disabled: true });
        this.negF.tipoGarantia.reset({ value: 'Admisible', disabled: true });
        this.tipoGarantiaBtnDisabled = true;
      }

    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  cargarNegociacion() {
    // const id = this.idAsesoria();
    const idAsesoria = this.formEncabezado()?.controls.idAsesoria.value;

    if (!idAsesoria) {
      return;
    }

    this.loading.show();
    this.gestionCreditoService.consultarNegociacion(idAsesoria).subscribe(
      {
        next: result => {
          this.loading.hide();
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
            // idSistema: result.idSistema,
            sistema: result.sistema,
            // idFormaPago: result.idFormaPago,
            formaPago: result.formaPago,
            // idPeriodoCapital: result.idPeriodoCapital,
            periodoCapital: result.periodoCapital,
            // idPeriodoInteres: result.idPeriodoInteres,
            periodoInteres: result.periodoInteres,
            monto: result.monto,
            plazo: result.plazo,
            periodoGracia: result.diasGracia,
            idGarantia: result.idGarantia,
            garantia: result.garantia,
            idTipoGarantia: result.idTipoGarantia,
            tipoGarantia: result.tipoGarantia,
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
          this.valorPrestamo = result.monto;
          this.totalCuota = result.cuota + this.deducciones();
          this.desembolso = result.monto - this.deducciones() - this.saldoCancelar();

          // const deducciones = this.deducciones();
          // const saldoCancelar = this.saldoCancelar();
          // if (deducciones && saldoCancelar != null && saldoCancelar != undefined) {
          //   this.desembolso = result.monto - deducciones - saldoCancelar;
          //   this.totalCuota += deducciones;
          // }

          this.loading.show();
          this.cargarGarantias().subscribe(() => {
            this.loading.hide();
          });



          // this.detalleGarantiasVisible = true;
        },
        error: () => {
          this.loading.hide()
        }
      }
    )
  }

  public habilitarEstadoInputProd(focus: boolean = true) {
    this.negF.idProducto.enable({ emitEvent: false });
    this.negF.producto.enable({ emitEvent: false });
    this.productoBtnDisabled = false;
    // if(focus) this.inputBusquedaProducto()?.codigoInputRef()?.nativeElement.focus();
  }

  public deshabilitarEstadoInputProd() {
    this.negF.idProducto.setValue(null, { emitEvent: false });
    this.negF.idProducto.disable({ emitEvent: false });

    this.negF.producto.setValue('', { emitEvent: false });
    this.negF.producto.disable({ emitEvent: false });
    this.productoBtnDisabled = true;
  }

  public resetearFormularioNeg() {
    this.formNegociacion.reset(this.negociacionFormEstadoInicial, { emitEvent: false });    
    this.productoBtnDisabled = true;
    this.lineaBtnDisabled = true;
    this.tipoGarantiaBtnDisabled = true;
    this.asesorExtBtnDisabled = true;
    this.calcularBtnDisabled = true;

    this.valorPrestamo = 0;
    this.deducciones();

    // this.infoAsociadoGuardado = false;
  }

  onProductoSeleccionado(producto: ProductoCredito) {
    this.negF.idLinea.enable();
    this.negF.linea.enable();
    this.lineaBtnDisabled = false;
    this.negF.idLinea.reset();
    this.negF.linea.reset();
    const resultPerfil = StorageSecurity.getData();
    this.negF.idAsesor.setValue(resultPerfil.IdAsesor);
    this.negF.nombreAsesor.setValue(resultPerfil.Nombre);

  }
  

  onLineaSeleccionada(linea: LineaResponse) {
    //Se hace peticion para obtener combinaciones permitidas de acuerdo a la linea.
    this.loading.show();
    this.gestionCreditoService.obtenerCombinacionesPermitidas(linea.idLinea).subscribe({
      next: res => {
        this.loading.hide();        
        this.combinacionesPermitidas = res;
        this.lineaSeleccionada = linea;
        this.sistemas = obtenerSistemasPermitidos(linea.tipoConfiguracionSistema/* , linea.sigla */);
        if (linea.sigla === 'CROT') {
          this.negF.selectSistema.setValue(TipoSistemas.CuotaVariable);
          this.periodosInteresValidos = this.periodosPago;
          this.negF.selectPeriodoInteres.setValue(PeriodoPagoEnum.Mes);
          this.negF.selectPeriodoCapital.enable();
          return;
        }

        // this.actualizarFormaPagoValidas();
        // this.actualizarPeriodosInteresValidos();
        this.negF.selectSistema.enable();
        if (this.sistemas.length === 1) this.negF.selectSistema.setValue(this.sistemas[0].id);


      }, error: () => {
        this.loading.hide()
      }
    });


    // this.lineaSeleccionada = linea;
    // // this.reiniciarNegociacion();

    // this.sistemas = obtenerSistemasPermitidos(linea.tipoConfiguracionSistema, linea.sigla);

    // if(linea.sigla === 'CROT') {
    //   this.negF.selectSistema.reset({ value: TipoSistemas.CuotaVariable, disabled: true });
    //   this.periodosInteresValidos = this.periodosPago;
    //   this.negF.selectPeriodoInteres.reset({ value: PeriodoPagoEnum.Mes, disabled: true });
    //   this.negF.selectPeriodoCapital.enable();
    //   return;
    // }

    // //Se habilita select sistema.
    // this.negF.selectSistema.enable();
    // if (this.sistemas.length === 1) this.negF.selectSistema.setValue(this.sistemas[0].id);


  }

  mostrarSelects() {
    this.mostrarSelectSistemas = true;
    this.mostrarSelectFormaPago = true;
    this.mostrarSelectPerCapital = true;
    this.mostrarSelectPerInteres = true;
    this.mostrarSelectGarantia = true;
  }

  ocultarSelects() {
    this.mostrarSelectSistemas = false;
    this.mostrarSelectFormaPago = false;
    this.mostrarSelectPerCapital = false;
    this.mostrarSelectPerInteres = false;
    this.mostrarSelectGarantia = false;
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
    const { selectPeriodoCapital, selectPeriodoInteres } = this.formNegociacion.controls;

    if (idSistema === TipoSistemas.CuotaFija || idSistema === TipoSistemas.CuotaFijaTasaVariable) {
      selectPeriodoCapital.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
      selectPeriodoCapital.disable({ emitEvent: false });

      selectPeriodoInteres.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
      selectPeriodoInteres.disable({ emitEvent: false });

    } else {
      selectPeriodoCapital.reset();
      selectPeriodoCapital.enable({ emitEvent: false });

      selectPeriodoInteres.reset();
      selectPeriodoInteres.enable({ emitEvent: false });
    }
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

  cargarGarantias(idTercero: number = this.idTercero()!): Observable<void> {
    return forkJoin({
      garantiasDisponibles: this.garantiasService.getGarantiasDisponibles(idTercero),
      garantiasCompartidas: this.garantiasService.getGarantiasCompartidasPorIdTercero(idTercero)
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


  // private getGarantiasDisponibles(idTercero: number) {
  //   this.loading.show();
  //   return this.garantiasService.getGarantiasDisponibles(idTercero).pipe(
  //     tap((data: any) => {
  //       this.listGarantiasDisponiblesDeudor = data ?? [];
  //       this.loading.hide();
  //     })
  //   );
  // }

  onClickCerrarModalGarantias() {
    this.garantiasRealesAsignadas = [];
    // this.listGarantiasDisponiblesDeudor = [];
    // this.garantiasCompartidasBackend = [];
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
          this.loading.hide();
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


    // this.loading.show();
    // this.getGarantias().subscribe({
    //   next: () => {
    //     this.loading.hide();
    //     this.mostrarModalGarantias = true;
    //     setTimeout(() => {
    //       this.modalGarantias.abrir();
    //     });
    //   },
    //   error: () => {

    //   }
    // })

  }

  //Fin cambiar garantías



  // private recalcularCombinaciones(): void {

  //   const { selectFormaPago, selectGarantia, plazo } = this.formNegociacion.getRawValue();

  //   this.combinacionesValidas =
  //     this.combinacionesPermitidas.filter(x => {

  //       if (selectFormaPago && x.idFormaPago !== selectFormaPago) {
  //         return false;
  //       }

  //       if (selectGarantia && x.idGarantia !== selectGarantia) {
  //         return false;
  //       }

  //       // if (
  //       //     plazo &&
  //       //     (plazo < x.plazoMinimo ||
  //       //      plazo > x.plazoMaximo)
  //       // ) {
  //       //     return false;
  //       // }

  //       return true;
  //     });


  //   // const garantiasValidasIds = new Set(this.combinacionesValidas.map(c => c.idGarantia));
  //   // this.garantiasValidas = this.garantias.filter(g => garantiasValidasIds.has(g.id));


  //   const formaPagoValidasIds = new Set(this.combinacionesValidas.map(c => c.idFormaPago));
  //   this.formasPagoValidas = this.formasPago.filter(f => formaPagoValidasIds.has(f.IdFormaPago));

  //   const periodoCapValidosIds = new Set(this.combinacionesValidas.map(c => c.idPeriodoPagoCapital));
  //   this.periodosCapitalValidos = this.periodosPagoCapital.filter(p => periodoCapValidosIds.has(p.IdFrecuenciaPago));



  //   // this.formasPagoValidas =
  //   //   [...new Set(
  //   //     this.combinacionesValidas.map(x => x.idFormaPago)
  //   //   )];

  //   // this.garantiasValidas =
  //   //   [...new Set(
  //   //     this.combinacionesValidas.map(x => x.idGarantia)
  //   //   )];
  // }

  // private actualizarFormaPagoValidas() {
  //   const formaPagoValidasIds = new Set(this.combinacionesPermitidas.map(c => c.idFormaPago));
  //   this.formasPagoValidas = this.formasPago.filter(f => formaPagoValidasIds.has(f.IdFormaPago));
  //   if (this.formasPagoValidas.length === 1) this.negF.selectFormaPago.setValue(this.formasPagoValidas[0].IdFormaPago);
  // }

  private actualizarFormaPagoValidas(idPeriodoInteres: number) {

    const formasPagoIds = new Set(
      this.combinacionesPermitidas
        .filter(c => c.idPeriodoPagoInteres === idPeriodoInteres)
        .map(c => c.idFormaPago)
    );

    this.formasPagoValidas =
      this.formasPago.filter(g =>
        formasPagoIds.has(g.IdFormaPago)
      );

    if (this.formasPagoValidas.length === 1) this.negF.selectFormaPago.setValue(this.formasPagoValidas[0].IdFormaPago);
    if (!this.formasPagoValidas.find(f => f.IdFormaPago === this.negF.selectFormaPago.value)) { //Si el actual no es válido.
      this.negF.selectFormaPago.setValue(null);
    }
  }



  // private actualizarPeriodosInteresValidos(idFormaPago: number) {
  //   const periodoInteresIds = new Set(
  //     this.combinacionesPermitidas
  //       .filter(c => c.idFormaPago === idFormaPago)
  //       .map(c => c.idPeriodoPagoInteres)
  //   );
  //   this.periodosInteresValidos =
  //     this.periodosPago.filter(p =>
  //       periodoInteresIds.has(p.IdFrecuenciaPago)
  //     );

  //   if (this.periodosInteresValidos.length === 1) this.negF.selectPeriodoInteres.setValue(this.periodosInteresValidos[0].IdFrecuenciaPago);
  //   if (!this.periodosInteresValidos.find(p => p.IdFrecuenciaPago === this.negF.selectPeriodoInteres.value)) { //Si el actual idInteres no es válido.
  //     this.negF.selectPeriodoInteres.setValue(null);
  //   }
  // }


  private actualizarPeriodosInteresValidos() {
    const periodoInteresValidosIds = new Set(this.combinacionesPermitidas.map(c => c.idPeriodoPagoInteres));
    this.periodosInteresValidos = this.periodosPago.filter(p => periodoInteresValidosIds.has(p.IdFrecuenciaPago));
    if (this.periodosInteresValidos.length === 1) this.negF.selectPeriodoInteres.setValue(this.periodosInteresValidos[0].IdFrecuenciaPago);
  }

  // private actualizarGarantiasValidas(idPeriodoInteres: number) {
  //   const idFormaPago = this.negF.selectFormaPago.value;

  //   const garantiaIds = new Set(
  //     this.combinacionesPermitidas
  //       .filter(c =>
  //         c.idFormaPago === idFormaPago &&
  //         c.idPeriodoPagoInteres === idPeriodoInteres
  //       )
  //       .map(c => c.idGarantia)
  //   );

  //   this.garantiasValidas =
  //     this.garantias.filter(g =>
  //       garantiaIds.has(g.id)
  //     );

  //   if (this.garantiasValidas.length === 1) this.negF.selectGarantia.setValue(this.garantiasValidas[0].id);
  //   if (!this.garantiasValidas.find(g => g.id === this.negF.selectGarantia.value)) { //Si el actual no es válido.
  //     this.negF.selectGarantia.setValue(null);
  //   }
  // }

  private actualizarGarantiasValidas(idFormaPago: number) {
    const idPeriodoInteres = this.negF.selectPeriodoInteres.value;

    const garantiaIds = new Set(
      this.combinacionesPermitidas
        .filter(c =>
          c.idFormaPago === idFormaPago &&
          c.idPeriodoPagoInteres === idPeriodoInteres
        )
        .map(c => c.idGarantia)
    );

    this.garantiasValidas =
      this.garantias.filter(g =>
        garantiaIds.has(g.id)
      );

    if (this.garantiasValidas.length === 1) this.negF.selectGarantia.setValue(this.garantiasValidas[0].id);
    if (!this.garantiasValidas.find(g => g.id === this.negF.selectGarantia.value)) { //Si el actual no es válido.
      this.negF.selectGarantia.setValue(null);
    }
  }

  onFormaPagoChange(idFormaPago: number): void {

    // this.negF.selectPeriodoCapital.enable();
    // this.negF.selectPeriodoInteres.reset({ value: null, disabled: false });

    // this.negF.selectPeriodoInteres.enable();
    // this.negF.selectPeriodoInteres.setValue(null);


    
    

    
  }

  onPeriodoInteresChange(idPeriodoInteres: number): void {
    this.negF.selectGarantia.enable();
    const { selectFormaPago } = this.formNegociacion.getRawValue();

    const garantiaIds = new Set(
      this.combinacionesPermitidas
        .filter(c =>
          c.idFormaPago === selectFormaPago &&
          c.idPeriodoPagoInteres === idPeriodoInteres
        )
        .map(c => c.idGarantia)
    );

    this.garantiasValidas =
      this.garantias.filter(g =>
        garantiaIds.has(g.id)
      );

    if (this.garantiasValidas.length === 1) this.negF.selectGarantia.setValue(this.garantiasValidas[0].id);


  }

  

  private obtenerCombinacionSeleccionada() {
    //   const { selectFormaPago, selectPeriodoCapital,  } = this.formNegociacion.value;

    // const combinacionSeleccionada = this.combinacionesPermitidas.find(
    //     c => c.idFormaPago === selectFormaPago 
    //     && c.idPeriodoPagoCapital === selectPeriodoCapital 
    //     && c.idGarantia === idGar
    //   );
  }
  // private obtenerCombinacionesFiltradas(
  //   override: Partial<NegociacionForm> = {}
  // ): CombinacionResponse[] {

  //   const filtros = {
  //     ...this.formNegociacion.getRawValue(),
  //     ...override
  //   };

  //   const { selectFormaPago, selectPeriodoCapital, selectGarantia } = filtros;

  //   return this.combinacionesPermitidas.filter(c =>
  //     (selectFormaPago == null || c.idFormaPago === selectFormaPago) &&
  //     (selectGarantia == null || c.idGarantia === selectGarantia) &&
  //     (selectPeriodoCapital == null || c.idPeriodoPagoCapital === selectPeriodoCapital)
  //   );
  // }

   private obtenerCombinacionesFiltradas(): CombinacionResponse[] {
    const { selectFormaPago, selectPeriodoInteres, selectGarantia } = this.formNegociacion.getRawValue();
    return this.combinacionesPermitidas.filter(c =>
      (selectFormaPago == null || c.idFormaPago === selectFormaPago) &&
      (selectGarantia == null || c.idGarantia === selectGarantia) &&
      (selectPeriodoInteres == null || c.idPeriodoPagoInteres === selectPeriodoInteres)
    );
  }

  private actualizarPlazos(): void {
    const combinaciones = this.obtenerCombinacionesFiltradas();    
    if (!combinaciones.length) {
      this.plazoMinimo = null;
      this.plazoMaximo = null;
      return;
    }

    const idPeriodoInteres = this.negF.selectPeriodoInteres.value;
    if(idPeriodoInteres == null) return;

    const periodoInteresMeses = PERIODOS_MESES[idPeriodoInteres as keyof typeof PERIODOS_MESES];

    const plazoMinValido = Math.min(...combinaciones.map(c => c.plazoMinimo));
    const plazoMaxValido = Math.max(...combinaciones.map(c => c.plazoMaximo));

    const minimoMeses = plazoMinValido / 30;
    const minimoPeriodoInteres = Math.ceil(minimoMeses / periodoInteresMeses);
    this.plazoMinimo = minimoPeriodoInteres;

    const maximoMeses = plazoMaxValido / 30;
    const maximoPeriodoInteres = maximoMeses / periodoInteresMeses;
    this.plazoMaximo = maximoPeriodoInteres;

    this.negF.plazo.addValidators([
      Validators.min(this.plazoMinimo),
      Validators.max(this.plazoMaximo)
    ]);
    
    this.negF.plazo.updateValueAndValidity();

  }

  private habilitarCalcular() {
    const { selectFormaPago, selectPeriodoCapital, selectPeriodoInteres, monto, plazo, selectGarantia } = this.formNegociacion.getRawValue();

    const selects = [selectFormaPago, selectPeriodoCapital, selectPeriodoInteres, selectGarantia]
    if(selects.some(s => s == null || s == undefined)) {
      this.calcularBtnDisabled = true;
    } else {
      this.calcularBtnDisabled = false;
    }


    // const selects = [selectPeriodoCapital, selectPeriodoInteres, monto, plazo, selectGarantia];
    // this.calcularBtnDisabled = !selects.every(Boolean) && selectFormaPago == undefined || selectFormaPago == null;


  }


  onClickCalcular() {

    const { idLinea, selectSistema, selectFormaPago, selectPeriodoCapital, selectPeriodoInteres, monto, plazo, selectGarantia } = this.formNegociacion.getRawValue();
    const numeroDocumento = this.formEncabezado().controls.numeroDocumento.value?.trim();
    if (
      idLinea == null ||
      selectSistema == null ||
      selectFormaPago == null ||
      selectPeriodoInteres == null ||
      selectPeriodoCapital == null ||
      monto == null ||
      plazo == null ||
      selectGarantia == null ||
      !numeroDocumento
    ) {
      return;
    }

    const request: CalcularCreditoRequest = {
      numeroDocumento,
      idLinea,
      idSistema: selectSistema,
      idFormaPago: selectFormaPago,
      idPeriodoInteres: selectPeriodoInteres,
      idPeriodoCapital: selectPeriodoCapital,
      monto,
      plazo,
      idGarantia: selectGarantia
    }

    this.loading.show();
    this.gestionCreditoService.calcularCredito(request).subscribe({
      next: result => {
        this.loading.hide();
        const { tasaPeriodica, tasaEfectiva, tasaNominal, cuota } = result;
        this.formNegociacion.patchValue({ tasaPeriodica, tasaEfectiva, tasaNominal });
        this.totalCuota = cuota;
        this.valorPrestamo = this.negF.monto.value ?? 0;
        this.desembolso = this.valorPrestamo - this.deducciones() - this.saldoCancelar();
      },
      error: () => {
        this.loading.hide();
      }
    })
  }


  private esCombinacionPeriodosValida(periodoCapital: number, periodoInteres: number): boolean {

    if (periodoInteres === PeriodoPagoEnum.AlVencimiento) {
      return true;
    }

    const mesesCapital = PERIODOS_MESES[periodoCapital as keyof typeof PERIODOS_MESES];
    const mesesInteres = PERIODOS_MESES[periodoInteres as keyof typeof PERIODOS_MESES];

    if (!mesesCapital || !mesesInteres) {
      return false;
    }

    return (
      mesesInteres <= mesesCapital &&
      mesesCapital % mesesInteres === 0
    );
  }

  private validarPeriodos() {

    const capital = this.formNegociacion.controls.selectPeriodoCapital.value;
    const interes = this.formNegociacion.controls.selectPeriodoInteres.value;

    if (!capital || !interes) {
      return;
    }

    if(!this.esCombinacionPeriodosValida(capital, interes)) {
      alert('Periodos no compatibles')
    }
  }

  private reiniciarNegociacion() {
    this.sistemas = [];
    this.formasPagoValidas = [];
    this.periodosInteresValidos = [];
    this.garantiasValidas = [];

    this.negF.selectSistema.reset({ value: null, disabled: true }, { emitEvent: false });
    this.negF.selectFormaPago.reset({ value: null, disabled: true }, { emitEvent: false });
    this.negF.selectPeriodoCapital.reset({ value: null, disabled: true }, { emitEvent: false });
    this.negF.selectPeriodoInteres.reset({ value: null, disabled: true }, { emitEvent: false });
    this.negF.selectGarantia.reset({ value: null, disabled: true }, { emitEvent: false });

    //Valor prestamo?
  }

  
  


  private actualizarCombinacionesValidas(): void {
    // const garantia = this.negF.selectGarantia.value;
    // const formaPago = this.negF.selectFormaPago.value;
    // const periodoInteres = this.negF.selectPeriodoInteres.value;

    // const combinaciones = this.combinacionesPermitidas.filter(c =>
    //   (!garantia || c.idGarantia === garantia) &&
    //   (!formaPago || c.idFormaPago === formaPago) &&
    //   (!periodoInteres || c.idPeriodoPagoInteres === periodoInteres)
    // );
    const combinaciones = this.obtenerCombinacionesFiltradas();

    this.garantiasValidas = this.garantias.filter(g =>
      combinaciones.some(c => c.idGarantia === g.id)
    );

    this.formasPagoValidas = this.formasPago.filter(f =>
      combinaciones.some(c => c.idFormaPago === f.IdFormaPago)
    );

    this.periodosInteresValidos = this.periodosPago.filter(p =>
      combinaciones.some(c => c.idPeriodoPagoInteres === p.IdFrecuenciaPago)
    );

    this.validarSeleccionActual();
  }

  private validarSeleccionActual(): void {

    if (
      this.negF.selectGarantia.value &&
      !this.garantiasValidas.some(
        g => g.id === this.negF.selectGarantia.value
      )
    ) {
      this.negF.selectGarantia.reset();
    }

    if (
      this.negF.selectFormaPago.value &&
      !this.formasPagoValidas.some(
        f => f.IdFormaPago === this.negF.selectFormaPago.value
      )
    ) {
      this.negF.selectFormaPago.reset();
    }

    if (
      this.negF.selectPeriodoInteres.value &&
      !this.periodosInteresValidos.some(
        p => p.IdFrecuenciaPago === this.negF.selectPeriodoInteres.value
      )
    ) {
      this.negF.selectPeriodoInteres.reset();
    }
  }

}
