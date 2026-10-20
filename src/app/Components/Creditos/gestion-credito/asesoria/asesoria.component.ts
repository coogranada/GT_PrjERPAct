import { Component, ElementRef, ViewChild } from '@angular/core';
import { ShareComponentModule } from '../../../../Modules/share-component.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TablaHistorialComponent } from '../../../shared/tabla-historial/tabla-historial.component';
import { TabNegociacionComponent } from '../shared/tab-negociacion/tab-negociacion.component';
import { AsesoriaEncabezadoForm, BuscarAsesoriasResponse, BuscarAsesoriasResponseTabla, ConsultarAsesoriaResponse, DeduciblesResponse, SaldosVigentesResponse } from '../../../../Models/Creditos/GestionCredito/gestion-credito.model';
import { GestionCreditoService } from '../../../../Services/Productos/GestionCredito.service';
import { MapeoColumna, transformarDatosParaTabla } from '../../../../utils/tabla-utils';
import { CurrencyPipe, formatDate } from '@angular/common';
import { TipoDocumento, TipoDocumentoDescripcion } from '../../../../Models/Generales/tipos-documento.enum';
import { concatWithSpace } from '../../../../utils/helpers';
import { LoadingService } from '../../../../Services/shared/loading.service';
import { HttpError } from '@microsoft/signalr';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { MiListaProductosService } from '../../../../Services/Informes/mi-lista-productos.service';
import { ERP_MESSAGES } from '../../../../utils/constant';
import { CriterioBusquedaAsesoria } from '../../../../Models/Creditos/GestionCredito/gestion-credito-enum';
import { AsesoriaContractualService } from '../../../../Services/Productos/asesoriaContractual.service';

@Component({
  selector: 'app-asesoria',
  imports: [ReactiveFormsModule, ShareComponentModule, TabNegociacionComponent, CurrencyPipe],
  templateUrl: './asesoria.component.html',
  styleUrl: './asesoria.component.css',
  providers: [GestionCreditoService, AsesoriaContractualService]
})
export class AsesoriaComponent {

  activeTab = 'negociacion';
  @ViewChild('inputBusqueda')
  private inputBusqueda!: ElementRef<HTMLInputElement>;

  @ViewChild('btnAbrirModalBuscarAsesorias', { static: true }) 
  private btnAbrirModalBuscarAsesorias!: ElementRef;

  @ViewChild('cerrarModal', { static: true }) 
  private cerrarModal!: ElementRef;

  encabezadosTablaBuscarAsesorias = ['Asesoria', 'Documento', 'Nombre Asociado', 'Estado', 'Fecha', 'Linea'];
  datosTransformados: any[] = [];
  formEncabezado!: FormGroup<AsesoriaEncabezadoForm>;
  buscarAsociadoBtnDisabled = true;
  idTercero: number | null = null;

  deducibles: DeduciblesResponse[] = [];
  totalSaldoDed = 0;
  totalCuotaDed = 0;
  totalValorPagadoDed = 0;

  // saldoCancelar = 0;
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
  @ViewChild('btnAbrirModalCrearTercero', { static: true }) 
  private btnAbrirModalCrearTercero!: ElementRef<HTMLButtonElement>;

  @ViewChild('cerrarModalCrearTercero', { static: true }) 
  private cerrarModalCrearTercero!: ElementRef;

  @ViewChild('numeroDocumento', { static: true }) 
  private numeroDocumentoInput!: ElementRef<HTMLInputElement>;

  existeElAsociado = false;

  constructor(
    private fb: FormBuilder,
    private gestionCreditoService: GestionCreditoService,
    private listaProductoService: MiListaProductosService,
    private asesoriaContractualService: AsesoriaContractualService,

    private loading: LoadingService,
    private notif: ToastrService,
  
  ) { }

  ngOnInit(): void {
    this.formEncabezado = this.fb.group<AsesoriaEncabezadoForm>({
      idOperacion: this.fb.control({ value: null, disabled: false }),
      idOficinaAsociado: this.fb.control({ value: null, disabled: true }),
      nombreOficinaAsociado: this.fb.nonNullable.control({ value: '', disabled: true }),
      asesoria: this.fb.control({ value: null, disabled: true }),
      tipoDocumento: this.fb.nonNullable.control({ value: '', disabled: true }),
      numeroDocumento: this.fb.nonNullable.control({ value: '', disabled: true }),
      nombreAsociado: this.fb.nonNullable.control({ value: '', disabled: true }),
      criterioBusqueda: this.fb.nonNullable.control(CriterioBusquedaAsesoria.PorAsesoria),
      busqueda: this.fb.nonNullable.control(''),
      estado: this.fb.nonNullable.control({ value: '', disabled: true }),
      relacion: this.fb.nonNullable.control({ value: '', disabled: true }),
      idOficina: this.fb.control({ value: null, disabled: true }),
      nombreOficina: this.fb.nonNullable.control({ value: '', disabled: true })
    });

   
    const { criterioBusqueda, busqueda, idOperacion } = this.formEncabezado.controls;

    criterioBusqueda.valueChanges.subscribe(idCriterio => {
      if (idCriterio === CriterioBusquedaAsesoria.PorAsesoria) {
        busqueda.reset('', { emitEvent: false });
      }
    });

    idOperacion.valueChanges.subscribe(idOperacion => {

      // this.formEncabezado.reset({
      //   idOperacion: this.formEncabezado.controls.idOperacion.value
      //  });
      
      this.formEncabezado.controls.numeroDocumento.disable({ emitEvent: false });
      this.formEncabezado.controls.nombreAsociado.disable({ emitEvent: false });

      if(idOperacion === 1) {
       
      }
      else if(idOperacion === 2) {
        this.formEncabezado.controls.numeroDocumento.enable({ emitEvent: false });
        this.formEncabezado.controls.nombreAsociado.enable({ emitEvent: false });
        this.buscarAsociadoBtnDisabled = false;
        this.numeroDocumentoInput.nativeElement.focus();
      }
    });

  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }


  // cargarAsesoria(idAsesoria: number) {

  //   this.loading.show();
  //   this.gestionCreditoService.consultarAsesoria(idAsesoria)?.subscribe({
  //     next: result => {
  //       this.loading.hide();
  //       if (!result) return;
  //       this.cargarAsesoriaEnFormulario(result);

  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.loading.hide();
  //       if (err.status === 404) {
  //         this.notif.warning('Advertencia', ERP_MESSAGES.REGISTRO_NO_ENCONTRADO, ConfiguracionNotificacion.configRightTop);
  //         return;
  //       }

  //       this.notif.error('Error', 'Error al consultar asesoria.', ConfiguracionNotificacion.configRightTop);
  //     }
  //   });

  // }

  // cargarAsesoria(idAsesoria: number): void {
  //   this.loading.show();

  //   this.gestionCreditoService.consultarAsesoria(idAsesoria)?.pipe(
  //     switchMap(asesoria => {
  //       if (!asesoria) {
  //         throw { status: 404 };
  //       }

  //       this.cargarAsesoriaEnFormulario(asesoria);

  //       return this.gestionCreditoService.obtenerDeducibles(idAsesoria);
  //     }),
  //     finalize(() => this.loading.hide())
  //   ).subscribe({
  //     next: deducibles => {
  //       this.deducibles = deducibles;

  //       this.totalSaldoDed = deducibles.reduce(
  //         (acc, value) => acc + value.valor,
  //         0
  //       );

  //       this.totalCuotaDed = deducibles.reduce(
  //         (acc, value) => acc + value.cuota,
  //         0
  //       );
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       if (err.status === 404) {
  //         this.notif.warning(
  //           'Advertencia',
  //           ERP_MESSAGES.REGISTRO_NO_ENCONTRADO,
  //           ConfiguracionNotificacion.configRightTop
  //         );
  //         return;
  //       }

  //       this.notif.error(
  //         'Error',
  //         'Error al consultar asesoría.',
  //         ConfiguracionNotificacion.configRightTop
  //       );
  //     }
  //   });
  // }

  cargarAsesoria(idAsesoria: number): void {
    this.loading.show();

    this.gestionCreditoService.consultarAsesoria(idAsesoria)?.pipe(
      switchMap(asesoria => {
        if (!asesoria) {
          throw { status: 404 };
        }

        this.cargarAsesoriaEnFormulario(asesoria);

        return forkJoin({
          deducibles: this.gestionCreditoService.obtenerDeducibles(idAsesoria),
          saldosVigentes: this.gestionCreditoService.obtenerSaldosVigentes(idAsesoria)
        });
      }),
      finalize(() => this.loading.hide())
    ).subscribe({
      next: ({ deducibles, saldosVigentes }) => {
        this.deducibles = deducibles;
        this.totalSaldoDed = deducibles.reduce((acc, value) => acc + value.valor, 0);
        this.totalCuotaDed = deducibles.reduce((acc, value) => acc + value.cuota, 0);
        // this.saldoCancelar = saldosVigentes.reduce((acc, value) => acc + value.saldoTotalDeuda, 0);

        this.saldosVigentes = saldosVigentes;
        this.totalSaldoPrestamo = saldosVigentes.reduce((acc, value) => acc + value.curEfectivo, 0);
        this.totalInteresCorriente = saldosVigentes.reduce((acc, value) => acc + value.curIntVencidos, 0);
        this.totalInteresMora = saldosVigentes.reduce((acc, value) => acc + value.curIntMora, 0);
        this.totalAbonoCanje = saldosVigentes.reduce((acc, value) => acc + value.curCanje, 0);
        this.totalSaldoTotal = saldosVigentes.reduce((acc, value) => acc + value.saldoTotalDeuda, 0);
        this.totalCuotaSaldosVig = saldosVigentes.reduce((acc, value) => acc + value.curCuota, 0);
        
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.notif.warning('Advertencia', ERP_MESSAGES.REGISTRO_NO_ENCONTRADO, ConfiguracionNotificacion.configRightTop);
          return;
        }

        this.notif.error('Error', 'Error al consultar asesoría.', ConfiguracionNotificacion.configRightTop);
      }
    });

  }

  private cargarAsesoriaEnFormulario(result: ConsultarAsesoriaResponse): void {

    const {
      primerApellido: pa,
      segundoApellido: sa,
      primerNombre: pn,
      segundoNombre: sn
    } = result;

    const nombreAsociado = concatWithSpace(pa, sa, pn, sn);

    this.formEncabezado.patchValue({
      idOficinaAsociado: result.idOficinaAsociado,
      nombreOficinaAsociado: result.oficinaAsociado,
      asesoria: result.idAsesoria,
      tipoDocumento: TipoDocumentoDescripcion[
        result.idTipoDocumento.toString() as TipoDocumento
      ],
      numeroDocumento: result.documento,
      nombreAsociado,
      estado: result.estado,
      relacion: result.relacion,
      idOficina: result.idOficinaAsesoria,
      nombreOficina: result.oficinaAsesoria
    });

    this.idTercero = result.idTercero;
    

    // this.formEncabezado.markAsPristine();
  }

  onClickBuscarAsesosrias() {
    const criterioBusqueda = this.formEncabezado.controls.criterioBusqueda.value;
    const valorBusqueda = this.formEncabezado.controls.busqueda.value;

    if (!valorBusqueda.trim() /* || this.formEncabezado.pristine */) return;

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
          this.notif.warning('Advertencia', ERP_MESSAGES.REGISTRO_NO_ENCONTRADO, ConfiguracionNotificacion.configRightTop);

        }
      }, 
      error: () => {
        this.notif.error('Error', 'Error al buscar asesorias.', ConfiguracionNotificacion.configRightTop);
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


  onBlurDocumento() {
    const numeroDocumentoCtrl = this.formEncabezado.controls.numeroDocumento;
    const numeroDocumento = numeroDocumentoCtrl.value;

    if(!numeroDocumento?.trim()) return;

    this.loading.show();
    this.asesoriaContractualService.BuscarNombreXDocumento(numeroDocumento).subscribe({
      next: result => {
        this.loading.hide();
        if(!result.NumeroDocumento) {
          this.existeElAsociado = false;
          this.btnAbrirModalCrearTercero.nativeElement.click();
          return;
        }
        this.existeElAsociado = true;
        numeroDocumentoCtrl.setValue(result.NumeroDocumento);
        const nombre = concatWithSpace(result.PrimerApellido, result.SegundoApellido, result.PrimerNombre, result.SegundoNombre);
        this.formEncabezado.controls.nombreAsociado.setValue(nombre);
        this.formEncabezado.controls.tipoDocumento.setValue(TipoDocumentoDescripcion[result.TipoDocumento as TipoDocumento]);
        this.btnAbrirModalCrearTercero.nativeElement.click();


      },
      error: () => {
        this.loading.hide();

      }
    })

  }
}
