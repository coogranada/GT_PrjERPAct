import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import { ShareComponentModule } from '../../../../Modules/share-component.module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TabNegociacionComponent } from '../shared/tab-negociacion/tab-negociacion.component';
import { AsesoriaEncabezadoForm, BuscarAsesoriasResponse, BuscarAsesoriasResponseTabla, ConsultarAsesoriaResponse, DeduciblesResponse, InfoAsociadoForm, SaldosVigentesResponse } from '../../../../Models/Creditos/GestionCredito/gestion-credito.model';
import { GestionCreditoService } from '../../../../Services/Productos/GestionCredito.service';
import { MapeoColumna, transformarDatosParaTabla } from '../../../../utils/tabla-utils';
import { AsyncPipe, CurrencyPipe, formatDate } from '@angular/common';
import { TipoDocumento, TipoDocumentoDescripcion } from '../../../../Models/Generales/tipos-documento.enum';
import { concatWithSpace, obtenerEstadoFormulario } from '../../../../utils/helpers';
import { LoadingService } from '../../../../Services/shared/loading.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import { finalize, forkJoin, Observable, of, switchMap } from 'rxjs';
import { MiListaProductosService } from '../../../../Services/Informes/mi-lista-productos.service';
import { ERP_MESSAGES, ERP_TOAST } from '../../../../utils/constant';
import { AsesoriaOperacion, CriterioBusquedaAsesoria } from '../../../../Models/Creditos/GestionCredito/gestion-credito-enum';
import { AsesoriaContractualService } from '../../../../Services/Productos/asesoriaContractual.service';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { AsociadoResponse, TiposDocumentoResponse } from '../../../../Models/Generales/generales.model';
import { ConcatWithSpacePipe } from '../../../../Pipes/utilidades/concatWithSpace.pipe';
import { SoloLetrasDirective } from '../../../shared/directives/solo-letras.directive';
import { AsesoriaTerminoService } from '../../../../Services/Productos/asesoriaTermino.service';
import Swal from 'sweetalert2';
import { StorageSecurity } from '../../../../utils/storage-security.util';

@Component({
  selector: 'app-asesoria',
  imports: [ReactiveFormsModule, ShareComponentModule, TabNegociacionComponent, CurrencyPipe, AsyncPipe, ConcatWithSpacePipe, SoloLetrasDirective],
  templateUrl: './asesoria.component.html',
  styleUrl: './asesoria.component.css',
  providers: [GestionCreditoService, AsesoriaContractualService]
})
export class AsesoriaComponent {

  // #region Injects
  // private readonly service = inject(NegociacionService);
  // private readonly notif = inject(NotificationService);
  // #endregion


  // #region ViewChild 
  @ViewChild('btnAbrirModalListaAsociados', { static: true })
  private btnAbrirModalListaAsociados!: ElementRef;

  @ViewChild('inputBusqueda')
  private inputBusqueda!: ElementRef<HTMLInputElement>;

  @ViewChild('btnAbrirModalBuscarAsesorias', { static: true })
  private btnAbrirModalBuscarAsesorias!: ElementRef;

  @ViewChild('cerrarModal', { static: true })
  private cerrarModal!: ElementRef;

  @ViewChild('numeroDocumento', { static: true })
  private numeroDocumentoInput!: ElementRef<HTMLInputElement>;

  @ViewChild('buscarAsociadoBtn')
  buscarAsociadoBtn!: ElementRef<HTMLInputElement>;

  private tabNegociacion = viewChild.required(TabNegociacionComponent);
  // #endregion


  // #region Inputs

  // #endregion

  // #region Outputs

  // #endregion

  // #region Signals públicas

  // #endregion


  // #region Variables públicas
  buscarBtnDisabled = true;
  estadoInicialForm: any;
  resultBusquedaAsociados: any[] = [];
  activeTab = 'negociacion';
  encabezadosTablaBuscarAsesorias = ['Asesoria', 'Documento', 'Nombre Asociado', 'Estado', 'Fecha', 'Linea'];
  datosTransformados: any[] = [];
  formEncabezado!: FormGroup<AsesoriaEncabezadoForm>;
  buscarAsociadoBtnDisabled = true;
  idTercero: number | null = null;
  deducibles: DeduciblesResponse[] = [];
  totalSaldoDed = 0;
  totalCuotaDed = 0;
  totalValorPagadoDed = 0;
  saldosVigentes: SaldosVigentesResponse[] = [];
  totalSaldoPrestamo = 0;
  totalInteresCorriente = 0;
  totalInteresMora = 0;
  totalAbonoCanje = 0;
  totalSaldoTotal = 0;
  totalCuotaSaldosVig = 0;
  analisisCalificaciones: any[] = [];
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mesesOrdenados: string[] = [];
  calificacionesPorMes: any = null;
  calificacionAnual: any = null;
  selectedRowDed: number | null = null;
  selectedRowSaldosVig: number | null = null;
  selectedRowAnalisis: number | null = null;
  crearTerceroBtnDisabled = true;
  existeElAsociado = false;
  tiposDocumento$!: Observable<TiposDocumentoResponse[]>;
  infoAsociadoForm!: FormGroup<InfoAsociadoForm>;
  asociadoFormEstadoInicial: any;
  asociadoFormSubmitted = false;
  // #endregion


  // #region Variables privadas
  // #endregion


  // #region Constructor
  constructor(
    private fb: FormBuilder,
    private gestionCreditoService: GestionCreditoService,
    private listaProductoService: MiListaProductosService,
    private asesoriaContractualService: AsesoriaContractualService,
    // private asesoriaterminoService: AsesoriaTerminoService,
    private generalesService: GeneralesService,
    private loading: LoadingService,
    private notif: ToastrService
  ) { }
  // #endregion


  // #region Getters computados
  get af() {
    return this.infoAsociadoForm.controls;
  }
  // #endregion

  // #region Ciclo de vida
  ngOnInit(): void {
    this.tiposDocumento$ = this.generalesService.obtenerTiposDocumento();
    this.formEncabezado = this.fb.group<AsesoriaEncabezadoForm>({
      idOperacion: this.fb.control({ value: null, disabled: false }),
      idOficinaAsociado: this.fb.control({ value: null, disabled: true }),
      nombreOficinaAsociado: this.fb.nonNullable.control({ value: '', disabled: true }),
      idAsesoria: this.fb.control({ value: null, disabled: true }),
      tipoDocumento: this.fb.nonNullable.control({ value: '', disabled: true }),
      numeroDocumento: this.fb.nonNullable.control({ value: '', disabled: true }),
      nombreAsociado: this.fb.nonNullable.control({ value: '', disabled: true }),
      criterioBusqueda: this.fb.nonNullable.control({ value: CriterioBusquedaAsesoria.PorAsesoria, disabled: true }),
      busqueda: this.fb.nonNullable.control({ value: '', disabled: true }),
      estado: this.fb.nonNullable.control({ value: '', disabled: true }),
      relacion: this.fb.nonNullable.control({ value: '', disabled: true }),
      idOficina: this.fb.control({ value: null, disabled: true }),
      nombreOficina: this.fb.nonNullable.control({ value: '', disabled: true })
    });

    this.estadoInicialForm = obtenerEstadoFormulario(this.formEncabezado);
    const { criterioBusqueda, busqueda, idOperacion } = this.formEncabezado.controls;

    criterioBusqueda.valueChanges.subscribe(idCriterio => {
      if (idCriterio === CriterioBusquedaAsesoria.PorAsesoria) {
        busqueda.reset('', { emitEvent: false });
      }
    });

    idOperacion.valueChanges.subscribe(idOperacion => {
      this.resetearFormulario();
      this.tabNegociacion().resetearFormularioNeg();
      this.tabNegociacion().ocultarSelects();
      if (idOperacion === AsesoriaOperacion.Buscar) {
        this.formEncabezado.controls.busqueda.enable({ emitEvent: false });
        this.formEncabezado.controls.criterioBusqueda.enable({ emitEvent: false });
        this.buscarBtnDisabled = false;
      }
      else if (idOperacion === AsesoriaOperacion.NuevaAsesoria) {
        this.formEncabezado.controls.numeroDocumento.enable({ emitEvent: false });
        this.formEncabezado.controls.nombreAsociado.enable({ emitEvent: false });
        this.buscarAsociadoBtnDisabled = false;
        this.numeroDocumentoInput.nativeElement.focus();
        this.tabNegociacion().mostrarSelects();
      }
    });


    //Form asociado
    this.infoAsociadoForm = this.fb.group<InfoAsociadoForm>({
      idTipoDocumento: this.fb.control(null, Validators.required),
      tipoDocumento: this.fb.nonNullable.control(''),
      primerApellido: this.fb.nonNullable.control('', Validators.required),
      segundoApellido: this.fb.nonNullable.control(''),
      primerNombre: this.fb.nonNullable.control('', Validators.required),
      segundoNombre: this.fb.nonNullable.control(''),
      celular: this.fb.nonNullable.control('', Validators.required),
      correo: this.fb.nonNullable.control('', Validators.email),
      canalesContacto: this.fb.group({
        canalCorreo: this.fb.nonNullable.control(false),
        canalMensajeTexto: this.fb.nonNullable.control(false),
        canalWhatsapp: this.fb.nonNullable.control(false),
        canalTelPersonal: this.fb.nonNullable.control(false),
        canalTelCelular: this.fb.nonNullable.control(false),
        canalVisita: this.fb.nonNullable.control(false),
        canalNotificacion: this.fb.nonNullable.control(false),
      }, { validators: this.atLeastOneCheckedValidator() }),
      peso: this.fb.control(null),
      talla: this.fb.control(null)
    });

    this.asociadoFormEstadoInicial = obtenerEstadoFormulario(this.formEncabezado);

  }

  ngOnDestroy(): void {

  }
  // #endregion

  // #region Métodos públicos
  changeTab(tab: string) {
    this.activeTab = tab;
  }

  onNumDocumentoInput() {
    this.formEncabezado.patchValue({
      tipoDocumento: '',
      nombreAsociado: ''
    }, { emitEvent: false });
  }

  onNombreAsociadoInput() {
    this.formEncabezado.patchValue({
      tipoDocumento: '',
      numeroDocumento: ''
    }, { emitEvent: false });
  }

  cargarAsesoria(idAsesoria: number): void {
    this.loading.show();

    this.gestionCreditoService.consultarAsesoria(idAsesoria)?.pipe(
      switchMap(asesoria => {
        if (!asesoria) {
          throw { status: 404 };
        }
        return forkJoin({
          asesoria: of(asesoria),
          deducibles: this.gestionCreditoService.obtenerDeducibles(idAsesoria),
          saldosVigentes: this.gestionCreditoService.obtenerSaldosVigentes(idAsesoria)
        });
      }),
      finalize(() => this.loading.hide())
    ).subscribe({
      next: ({ asesoria, deducibles, saldosVigentes }) => {
        this.deducibles = deducibles;
        this.totalSaldoDed = deducibles.reduce((acc, value) => acc + value.valor, 0);
        this.totalCuotaDed = deducibles.reduce((acc, value) => acc + value.cuota, 0);

        this.saldosVigentes = saldosVigentes;
        this.totalSaldoPrestamo = saldosVigentes.reduce((acc, value) => acc + value.curEfectivo, 0);
        this.totalInteresCorriente = saldosVigentes.reduce((acc, value) => acc + value.curIntVencidos, 0);
        this.totalInteresMora = saldosVigentes.reduce((acc, value) => acc + value.curIntMora, 0);
        this.totalAbonoCanje = saldosVigentes.reduce((acc, value) => acc + value.curCanje, 0);
        this.totalSaldoTotal = saldosVigentes.reduce((acc, value) => acc + value.saldoTotalDeuda, 0);
        this.totalCuotaSaldosVig = saldosVigentes.reduce((acc, value) => acc + value.curCuota, 0);

        this.cargarAsesoriaEnFormulario(asesoria);
        this.tabNegociacion().cargarNegociacion();

      },
      error: (err: HttpErrorResponse) => {        
        this.loading.hide();
        if (err.status === 404) {
          this.notif.warning(ERP_TOAST.WARNING, ERP_MESSAGES.REGISTRO_NO_ENCONTRADO, ConfiguracionNotificacion.configRightTop);
          return;
        }

        this.notif.error(ERP_TOAST.ERROR, 'Error al consultar asesoría.', ConfiguracionNotificacion.configRightTop);
      }
    });

  }


  onClickBuscarAsesosrias() {
    const criterioBusqueda = this.formEncabezado.controls.criterioBusqueda.value;
    const valorBusqueda = this.formEncabezado.controls.busqueda.value;

    if (!valorBusqueda.trim()) return;

    if (criterioBusqueda == CriterioBusquedaAsesoria.PorAsesoria) {
      this.cargarAsesoria(+valorBusqueda);
      return;
    }

    this.loading.show();
    this.gestionCreditoService.buscarAsesorias(criterioBusqueda, valorBusqueda).subscribe({
      next: result => {
        this.loading.hide();

        if (result.length === 1) {
          this.cargarAsesoria(result[0].idAsesoria);
        } else if (result.length > 1) {
          const columnasConfiguradas: MapeoColumna[] = [
            { encabezado: 'Asesoria', campos: ['idAsesoria'] },
            { encabezado: 'Documento', campos: ['documento'] },
            { encabezado: 'Nombre Asociado', campos: ['primerApellido', 'segundoApellido', 'primerNombre', 'segundoNombre'] },
            { encabezado: 'Estado', campos: ['estado'] },
            { encabezado: 'Fecha', campos: ['fechaMatricula'], obtenerValor: i => formatDate(i.fechaMatricula, 'yyyy/MM/dd', 'es-CO') },
            { encabezado: 'Linea', campos: ['idLinea'] }

          ];
          this.datosTransformados = transformarDatosParaTabla<BuscarAsesoriasResponse>(result, columnasConfiguradas);
          this.btnAbrirModalBuscarAsesorias.nativeElement.click();
        } else {
          this.loading.hide();
          this.notif.warning(ERP_TOAST.WARNING, ERP_MESSAGES.REGISTRO_NO_ENCONTRADO, ConfiguracionNotificacion.configRightTop);

        }
      },
      error: () => {
        this.loading.hide();
        this.notif.error(ERP_TOAST.ERROR, 'Error al buscar asesorias.', ConfiguracionNotificacion.configRightTop);
      }
    });

  }

  formatearValor = (valor: any, columna?: string): string => {
    return valor !== null && valor !== undefined ? String(valor) : '';
  };

  onClickFila(data: BuscarAsesoriasResponseTabla) {
    this.cargarAsesoria(data.Asesoria);

    this.cerrarModal.nativeElement.click();
  }

  onClickPonerFoco() {
    setTimeout(() => {
      this.inputBusqueda.nativeElement.focus();
    }, 100);
  }

  onClickTabAnalisis() {
    this.changeTab('analisis');
    if (!this.idTercero) return;

    this.loading.show();
    this.listaProductoService.getAnalisis(this.idTercero).subscribe({
      next: result => {
        this.loading.hide();
        this.analisisCalificaciones = result;

      },
      error: () => {

      }
    });
  }

  onClickFilaAnalisis(idCuenta: number) {
    this.selectedRowAnalisis = idCuenta;
    this.loading.show();

    forkJoin({
      calificaAnual: this.listaProductoService.getCalificaAnualmente(idCuenta),
      calificacionesMes: this.listaProductoService.getCalificacionesAnuales(idCuenta)
    }).subscribe({
      next: ({ calificaAnual, calificacionesMes }) => {
        this.calificacionAnual = calificaAnual[0];
        this.calificacionesPorMes = calificacionesMes;
        this.mesesOrdenados = this.obtenerMesesOrdenados(this.calificacionesPorMes?.MesActual);
        this.loading.hide();
      },
      error: (error) => {
        this.loading.hide();
        console.error(error);
      }
    });
  }

  obtenerMesesOrdenados(mesActual: number): string[] {
    const resultado: string[] = [];
    let indice = mesActual - 2;

    if (indice < 0) {
      indice = 11;
    }

    for (let i = 0; i < 12; i++) {
      resultado.push(this.meses[indice]);

      indice--;

      if (indice < 0) {
        indice = 11;
      }
    }

    return resultado;
  }

  onClickTabAlertas() {
    this.changeTab('alertas');
  }

  private buscarAsociadoPorDocumento(documento: string) {
    this.loading.show();
    this.asesoriaContractualService.BuscarNombreXDocumento(documento).subscribe({
      next: result => {
        this.loading.hide();

        if (result.Mensaje) {
          if (result.Mensaje === 'Gerencia de desarrollo.') {
            Swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: ERP_MESSAGES.PERSONA_VETADA_CONTACTO + result.Mensaje + '.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: 'rgb(160, 0, 87)'
            });

          } else if (result.Mensaje === 'Oficial de cumplimiento.') {
            Swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: ERP_MESSAGES.PERSONA_VETADA_CONTACTO + result.Mensaje + '.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: 'rgb(160, 0, 87)'
            });
          } else {
            this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
          }
          this.formEncabezado.patchValue({
            tipoDocumento: '',
            numeroDocumento: '',
            nombreAsociado: ''
          });
          return;
        }

        if (!result.NumeroDocumento) {
          this.existeElAsociado = false;
          this.abrirModalInfoAsociado();
          return;
        }
        this.existeElAsociado = true;
        this.mapearDatosAsociado(result);
        this.idTercero = result.lngTercero;
        if (this.idTercero) {
          this.loading.show();
          this.tabNegociacion().cargarGarantias(this.idTercero).subscribe(() => {
            this.loading.hide();
            // this.yaCargaronGarantiasPreviamente = true;
          });
        }

        this.abrirModalInfoAsociado();
      },
      error: () => {
        this.loading.hide();

      }
    })
  }

  onBlurDocumento(event: FocusEvent) {
    const numeroDocumentoCtrl = this.formEncabezado.controls.numeroDocumento;
    const numeroDocumento = numeroDocumentoCtrl.value;
    // const focoCambioABotonLupa = event.relatedTarget == this.buscarAsociadoBtn.nativeElement;
    // if (!numeroDocumento || focoCambioABotonLupa) {
    //   numeroDocumentoCtrl.setValue('');
    //   return;
    // }

    if (!numeroDocumento?.trim()) return;

    this.buscarAsociadoPorDocumento(numeroDocumento);

  }


  onClickBuscarAsociado() {
    const nombreCtrl = this.formEncabezado.controls.nombreAsociado;
    const nombre = nombreCtrl.value?.replace(/\s{2,}/g, ' ')?.trim();
    if (!nombre) return;

    this.loading.show();
    this.asesoriaContractualService.BuscarNombreXNombre(nombre)
      .subscribe({
        next: result => {
          this.loading.hide();
          this.existeElAsociado = true;
          if (result.length == 0) {
            this.existeElAsociado = false;
            this.notif.warning(ERP_TOAST.WARNING, ERP_MESSAGES.ASOCIADO_NO_ENCONTRADO, ConfiguracionNotificacion.configRightTop);
            this.formEncabezado.patchValue({
              tipoDocumento: '',
              numeroDocumento: '',
              nombreAsociado: ''
            });

          } else if (result.length == 1) {
            // Mapea directamente
            const asociado = result[0];
            this.buscarAsociadoPorDocumento(asociado.NumeroDocumento);
          } else {
            // Modal
            this.btnAbrirModalListaAsociados.nativeElement.click();
            this.resultBusquedaAsociados = result;
          }
        },
        error: () => {
          this.loading.hide();
        }
      });
  }

  mapearDatosAsociado(asociado: AsociadoResponse) {
    const nombre = concatWithSpace(asociado.PrimerApellido, asociado.SegundoApellido, asociado.PrimerNombre, asociado.SegundoNombre);
    this.formEncabezado.patchValue({
      tipoDocumento: TipoDocumentoDescripcion['' + asociado.TipoDocumento as TipoDocumento],
      numeroDocumento: asociado.NumeroDocumento,
      nombreAsociado: nombre
    });
    const resultPerfil = StorageSecurity.getData();    
    this.formEncabezado.controls.idOficina.setValue(resultPerfil.NumeroOficina);
    this.formEncabezado.controls.nombreOficina.setValue(resultPerfil.Oficina);
  }

  onClickFilaAsociados(asociado: AsociadoResponse) {
    this.buscarAsociadoPorDocumento(asociado.NumeroDocumento);
  }

  onClickCerrarModalNuevoAsociado() {
    this.formEncabezado.patchValue({
      tipoDocumento: '',
      numeroDocumento: '',
      nombreAsociado: ''
    });
    this.tabNegociacion().deshabilitarEstadoInputProd();
  }

  onClickGuardarInfoAsociado() {
    this.asociadoFormSubmitted = true;

    if (this.existeElAsociado) {
      if (this.af.canalesContacto.hasError('atLeastOneRequired')) {
        this.af.canalesContacto.markAsTouched();
        return;
      }
    } else {
      if (this.infoAsociadoForm.invalid) {
        this.infoAsociadoForm.markAllAsTouched();
        return;
      }


      const { idTipoDocumento, primerApellido, segundoApellido, primerNombre, segundoNombre } = this.af;


      this.mapearDatosAsociado({
        TipoDocumento: idTipoDocumento.value!,
        NumeroDocumento: this.formEncabezado.controls.numeroDocumento.value,
        PrimerApellido: primerApellido.value,
        SegundoApellido: segundoApellido.value,
        PrimerNombre: primerNombre.value,
        SegundoNombre: segundoNombre.value
      });

    }

    ($('#modalCrearTercero') as any).modal('hide');
    this.tabNegociacion().habilitarEstadoInputProd();

    //Tab negociacion
    // this.infoAsociadoGuardado = true;

  }


  onClickContinuar() {
    this.asociadoFormSubmitted = true;
    if (this.af.canalesContacto.hasError('atLeastOneRequired')) {
      this.af.canalesContacto.markAsTouched();
      return;
    }
    
    ($('#modalCrearTercero') as any).modal('hide');
    this.tabNegociacion().habilitarEstadoInputProd();



    // this.abrirModalInfoAsociado();


  }
  // #endregion


  // #region Métodos privados
  private atLeastOneCheckedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const values = Object.values(control.value);

      const hasOneChecked = values.some(value => value === true);

      return hasOneChecked ? null : { atLeastOneRequired: true };
    };
  }

  private resetearFormulario() {
    const idOperacion = this.formEncabezado.controls.idOperacion.value;
    
    this.formEncabezado.reset({
      ...this.estadoInicialForm,
      idOperacion: {
        value: idOperacion,
        disabled: false
      }
    }, { emitEvent: false });

    this.buscarBtnDisabled = true;
    this.buscarAsociadoBtnDisabled = true;

    // this.infoAsociadoGuardado = false;
  }


  private cargarAsesoriaEnFormulario(asesoria: ConsultarAsesoriaResponse): void {

    const {
      primerApellido: pa,
      segundoApellido: sa,
      primerNombre: pn,
      segundoNombre: sn
    } = asesoria;

    const nombreAsociado = concatWithSpace(pa, sa, pn, sn);

    this.formEncabezado.patchValue({
      idOficinaAsociado: asesoria.idOficinaAsociado,
      nombreOficinaAsociado: asesoria.oficinaAsociado,
      idAsesoria: asesoria.idAsesoria,
      tipoDocumento: TipoDocumentoDescripcion[
        asesoria.idTipoDocumento.toString() as TipoDocumento
      ],
      numeroDocumento: asesoria.documento,
      nombreAsociado,
      estado: asesoria.estado,
      relacion: asesoria.relacion,
      idOficina: asesoria.idOficinaAsesoria,
      nombreOficina: asesoria.oficinaAsesoria
    });

    this.idTercero = asesoria.idTercero;

  }


  private abrirModalInfoAsociado() {
    this.infoAsociadoForm.reset(this.asociadoFormEstadoInicial);
    ($('#modalCrearTercero') as any).modal('show');
  }
  // #endregion

}
