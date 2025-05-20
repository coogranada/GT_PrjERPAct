import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { AsesoriaTerminoService } from '../../../../../Services/Productos/asesoriaTermino.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe, formatDate } from '@angular/common';
import swal from 'sweetalert2';
import { LogDataOnEditAsesoria } from '../../../../../Models/Productos/termino/asesoria/asesoria-termino.model';
import { TerminoAhorrosService } from '../../../../../Services/Productos/terminoAhorros.service';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
declare var $: any;
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-asesoria-termino',
  templateUrl: './asesoria-termino.component.html',
  styleUrls: ['./asesoria-termino.component.css'],
  providers: [AsesoriaTerminoService, ModuleValidationService,TerminoAhorrosService, OperacionesService, GeneralesService],
  standalone : false
})
export class AsesoriaTerminoComponent implements OnInit {


  private CodModulo = 77;
  constructor(
    private clientesGetListService: ClientesGetListService,
    private moduleValidationService: ModuleValidationService,
    private el: ElementRef,
    private notif: ToastrService,
    private operacionesService: OperacionesService,
    private TerminoService: TerminoAhorrosService,
    private AsesoriaTerminoServices: AsesoriaTerminoService,
    private generalesService: GeneralesService,) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  @ViewChild('ModalCreacionNombre', { static: true }) private ModalCreacionNombre!: ElementRef;
  @ViewChild('ModalNombre', { static: true }) private ModalNombre!: ElementRef;
  @ViewChild('CerrarCreacionNombre', { static: true }) private CerrarCreacionNombre!: ElementRef;
  @ViewChild('ModalAsesores', { static: true }) private ModalAsesores!: ElementRef;
  @ViewChild('ModalAsesoresExterno', { static: true }) private ModalAsesoresExterno!: ElementRef;
  @ViewChild('ModalTermino', { static: true }) private ModalTermino!: ElementRef;
  @ViewChild('tab1', { static: true }) private tab1!: ElementRef;
  @ViewChild('ModalBuscarAsesoria', { static: true }) private ModalBuscarAsesoria!: ElementRef;
  @ViewChild('ModalImpresion', { static: true }) private ModalImpresion!: ElementRef;

  private emitEventTermino: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  public asesoriaterminoForm!: FormGroup;
  public asesoriaterminoOperacionFrom!: FormGroup;
  public AsesorFrom!: FormGroup;
  public creacionFrom!: FormGroup;
  public AdicionarPuntosFrom!: FormGroup;

  public resultOperaciones : any;
  public resultNombre : any;
  public resultRelacion : any;
  public resultAsesor : any;
  public resultAsesoresExterno : any;
  public resultProducto : any;
  public resultFrecuenciaPago : any;
  public resultPuntosAdicionales : any;
  resultAsesoria: any[] = [];

  public BloquearBuscar : boolean | null = false;
  public BloquearNombre : boolean | null= false;
  public BloquearProducto : boolean | null = false;
  public Bloquear : boolean= false;
  public BloquearPuntosA : boolean | null= false;
  public BloquearAsesorExterno : boolean | null = false;
  public BloquearNegociacion : boolean |null= false;
  public BloquearCalcularIntereces : boolean= false;
  public datoRelacion : any;
  public datoProducto : any;
  public ColorAnterior1: any;
  public ColorAnterior2: any;
  dataUser : any;
  datoTasaNominal : any;
  datoTasaEfectiva : any;
  datoTasaAdicional : any;
  MostrasAlertaAsociado : boolean= false;
  MostrasAlertaProducto : boolean= false;
  BloquearbtnGuardar : boolean= false;
  BloquearbtnActalizar : boolean= false;
  operacionEscogida : string = '';
  dataHistorial: any[] = [];
  ArrayCondiciones: any;
  dataObjet: any;
  selectFrecuencia : boolean = true;
  inputFrecuencia : boolean = false;
  btnActualizar : boolean = true;
  btnGuardar: boolean = true;
  activaNegociacion: boolean = false;
  activaHistorial: boolean = false;
  dataFrecuencia: number = 0;
  showBtnCalcularIntereses: boolean = false;
  private asesorExternoAnterior: { id: number, nombre: string } = {id :0,nombre : ""};
  private logDataOnEditAsesoria: LogDataOnEditAsesoria | any = {};
  private productoAnterior : any;
  private plazoAnterior : any;
  private valorTituloAnterior : any;
  private frecuenciaPagoAnterior : any;
  private puntosAdicionalesAnterior : any;
  linkPdf: string = "";
  private idObjetoSocial: number | undefined;
  private isSavingAsesoria = false;
  tiposDeDocumento: any;
  isCreationButtonDisabled: boolean = true;
  BloquearNuevoAsociadoForm : boolean | null = true;

  ngOnInit() {
    this.ValidateForm();
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.Operaciones();
    this.ObtenerRelacion();

    this.VolverArriba();
    $('#select').focus().select();
    $('#negociacion').addClass('activar');
    $('#negociacion').addClass('active');

    this.asesoriaterminoForm.controls['BuscarDocumento'].disable();
    this.asesoriaterminoForm.controls['BuscarNombre'].disable();
    this.asesoriaterminoForm.controls['NumeroAsesoria'].disable();
  }

  //InputEvent type genera error en el build
  onChangeDataForm(event?: any) {
    this.BloquearbtnActalizar = false;
    this.disableBtnGuardar = false;
    this.BloquearCalcularIntereces = true;
    this.cleanIntereses();   
    if (event && event.target) {
      const inputElement = event.target as HTMLInputElement;
      if(inputElement.getAttribute('formcontrolname') === 'ValorTotal') this.asesoriaterminoForm.get('IdFrecuenciaPago')?.reset();
    }
  }

  getCurrentPuntosAdicionales(): number {
    let puntosAdicionalesId = this.AdicionarPuntosFrom.get('AdicionarPunto')?.value;
    if (puntosAdicionalesId === '--Seleccione--' || !puntosAdicionalesId) puntosAdicionalesId = 56;
    const puntosAdicionalesFound = this.resultPuntosAdicionales.find((punto : any) => punto.IdPuntosAdicionales === puntosAdicionalesId).PuntosAdicionales;
    return puntosAdicionalesFound;
  }

  UpdateAsesoriaTermino() {
    if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '19') {
      const asesorExternoCode = this.asesoriaterminoForm.get('strCodigo')?.value;
      const asesorExternoNombre = this.asesoriaterminoForm.get('strNombre')?.value;

      if ((!asesorExternoCode && asesorExternoNombre) || (asesorExternoCode && !asesorExternoNombre)) {
        this.notif.warning('Advertencia', 'Debe seleccionar asesor externo.', ConfiguracionNotificacion.configRightTop);
        return;
      }

      if (this.asesorExternoAnterior.id === asesorExternoCode) {
        this.notif.warning('Advertencia', 'Debe cambiar asesor externo.', ConfiguracionNotificacion.configRightTop);
        return;
      }

      this.loading = true;
      const NumeroAsesoria = this.asesoriaterminoForm.get('NumeroAsesoria')?.value;
      const logData = {
        IdAsesorExternoAnterior: this.asesorExternoAnterior.id || '',
        NombreAsesorExternoAnterior: this.asesorExternoAnterior.nombre,
        IdAsesorExternoActualiza: asesorExternoCode || '',
        NombreAsesorExternoActualiza: asesorExternoNombre || '',
      };

      this.AsesoriaTerminoServices.EditarAsesorExterno({ IdAsesorExterno: asesorExternoCode, NumeroAsesoria }).subscribe(
        result => {
          this.notif.success('Exitoso', 'El cambio asesor externo se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
          this.loading = false;
          this.BloquearbtnActalizar = true;
          this.btnActualizar = true;
          this.BloquearAsesorExterno = true;
          this.asesoriaterminoOperacionFrom.get('Codigo')?.reset();
          this.asesorExternoAnterior = { id: asesorExternoCode, nombre: this.asesoriaterminoForm.get('strNombre')?.value };
          this.generalesService.GuardarlogAsesoria(logData, 19, formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en'), 77, NumeroAsesoria)
            .subscribe(
              result => {
                this.GetHistorial(NumeroAsesoria);
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              });
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    else if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '1') {
      const requiredFieldNames = ['IdProducto', 'DescripcionProducto', 'Plazo', 'ValorTotal', 'IdFrecuenciaPago', 'TasaNominal', 'TasaEfectiva'];
      const isSomeRequiredFieldMissing = requiredFieldNames.some(fieldName => !this.asesoriaterminoForm.get(fieldName)?.value || !(this.asesoriaterminoForm.get(fieldName)?.value + '').trim());
      if (isSomeRequiredFieldMissing) {
        this.notif.warning('Advertencia', 'Datos incompletos para actualizar asesoria.', ConfiguracionNotificacion.configRightTop);
        return;
      }

      this.loading = true;
      const NumeroAsesoria = this.asesoriaterminoForm.get('NumeroAsesoria')?.value;
      var TasaAdicionalSin = this.asesoriaterminoForm.get('TasaAdicional')?.value;
      TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
      if (TasaAdicionalSin !== this.datoTasaAdicional)
        this.asesoriaterminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);

      let TasaNominal: string = this.asesoriaterminoForm.get('TasaNominal')?.value;
      TasaNominal = TasaNominal.replace("%", "");
      const puntosAdicionales: number = (this.AdicionarPuntosFrom.get('AdicionarPunto')?.value == null || this.AdicionarPuntosFrom.get('AdicionarPunto')?.value === '--Seleccione--') ? 56 : this.AdicionarPuntosFrom.get('AdicionarPunto')?.value;
      let p: number = 0;
      let puntos: any[] = this.resultPuntosAdicionales.filter((x : any) => x.IdPuntosAdicionales == Number(puntosAdicionales));
      if (puntos.length > 0) {
        p = puntos[0].PuntosAdicionales;
        p *= 10;
      }
      const payload = {
        NumeroAsesoria,
        NumeroOficina: this.asesoriaterminoForm.get('NumeroOficina')?.value,
        IdProducto: this.asesoriaterminoForm.get('IdProducto')?.value,
        IdAsesor: this.asesoriaterminoForm.get('IdAsesor')?.value,
        TasaNominal: Number(this.datoTasaNominal),
        NumeroDocumento: this.asesoriaterminoForm.get('NumeroDocumento')?.value,
        Plazo: this.asesoriaterminoForm.get('Plazo')?.value,
        IdFrecuenciaPago: this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value,
        Tasa : 0,
        IdIndicador:0,
        Puntos: 0,
        ValorTitulo: this.asesoriaterminoForm.get('ValorTotal')?.value,
        Retencion: this.asesoriaterminoForm.get('TotalRetencion')?.value,
        Intereses: this.asesoriaterminoForm.get('TotalInteresBruto')?.value,
        Herencia: 0,
        TasaAdicional: this.asesoriaterminoForm.get('TasaAdicional')?.value,
        PuntosAdicionales: p,
        Aportes: this.asesoriaterminoForm.get('TotalAportes')?.value,
        IdRelacion: this.asesoriaterminoForm.get('Clase')?.value,
        IdAsesorExterno : this.asesoriaterminoForm.get('strCodigo')?.value,
      }

      this.logDataOnEditAsesoria.ProductoActualiza = this.asesoriaterminoForm.get('DescripcionProducto')?.value;
      this.logDataOnEditAsesoria.PlazoActualiza = +payload.Plazo;
      this.logDataOnEditAsesoria.ValorTituloActualiza = payload.ValorTitulo;
      this.logDataOnEditAsesoria.FrecuenciaPagoActualiza = this.asesoriaterminoForm.get('DescripcionFrecuenciaPago')?.value;
      this.logDataOnEditAsesoria.PuntosAdicionalesActualiza = this.getCurrentPuntosAdicionales();
      this.logDataOnEditAsesoria.TasaEfectivaActualiza = this.asesoriaterminoForm.get('TasaEfectiva')?.value;
      this.logDataOnEditAsesoria.TasaNominalActualiza = this.asesoriaterminoForm.get('TasaNominal')?.value;
      this.logDataOnEditAsesoria.TasaAportesActualiza = this.asesoriaterminoForm.get('TasaAdicional')?.value.slice(0,-2) + '%';
      this.logDataOnEditAsesoria.FechaVencimientoActualiza = null;
      this.logDataOnEditAsesoria.InteresBrutoActualiza = +this.asesoriaterminoForm.get('InteresBruto')?.value;
      this.logDataOnEditAsesoria.RetencionActualiza = this.asesoriaterminoForm.get('Retencion')?.value;
      this.logDataOnEditAsesoria.AportesActualiza = +this.asesoriaterminoForm.get('Aportes')?.value;
      this.logDataOnEditAsesoria.InteresNetoActualiza = this.asesoriaterminoForm.get('InteresNeto')?.value;
      this.logDataOnEditAsesoria.TotalInteresBrutoActualiza = this.asesoriaterminoForm.get('TotalInteresBruto')?.value;
      this.logDataOnEditAsesoria.TotalRetencionActualiza = this.asesoriaterminoForm.get('TotalRetencion')?.value;
      this.logDataOnEditAsesoria.TotalAportesActualiza = this.asesoriaterminoForm.get('TotalAportes')?.value;
      this.logDataOnEditAsesoria.TotalInteresNetoActualiza = this.asesoriaterminoForm.get('TotalInteresNeto')?.value;

      this.AsesoriaTerminoServices.GuardarAsesoria(payload)
        .subscribe(
         async asesoria => {
            this.loading = false;
            if (asesoria.NumeroAsesoria) {
              this.notif.success('Exitoso', 'La asesoria se actualizó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.loading = false;
              this.BloquearbtnActalizar = false;
              this.btnActualizar = true;
              this.showBtnCalcularIntereses = false;
              this.BloquearCalcularIntereces = false;
              this.BloquearNegociacion = true;
              this.BloquearProducto = true;
              this.selectFrecuencia = true;
              this.inputFrecuencia = false;
              this.BloquearPuntosA = true;
              await this.BotonBuscarAsesoriaTermino();
              this.logDataOnEditAsesoria.FechaVencimientoActualiza = this.asesoriaterminoForm.get('FechaVencimiento')?.value;

              this.generalesService.GuardarlogAsesoria(this.logDataOnEditAsesoria, 1, formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en'), 77, NumeroAsesoria)
                .subscribe(
                  result => {
                    this.GetHistorial(NumeroAsesoria);
                    this.asesoriaterminoOperacionFrom.get('Codigo')?.reset();
                  },
                  error => {
                    this.loading = false;
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  });
            }
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          });
    }
  }
  onChangeAsesorExterno() {
    if (this.asesoriaterminoForm.get('strCodigo')?.value !== '' && this.asesoriaterminoForm.get('strNombre')?.value !== '') {
      this.BloquearbtnActalizar = false;
    }
  }

  onChangeAsociado() {
    this.disableBtnGuardar = false;
    this.asesoriaterminoForm.get('Nombre')?.reset();
  }

  Operaciones() {
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    const arrayExample = [{
      'IdModulo': this.CodModulo,
      'IdUsuario': this.dataUser.IdUsuario,
      'IdOperaciones': '',
      'IdOperacionesPerfil': '',
      'IdPerfil': this.dataUser.idPerfilUsuario
    }];
    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(
      result => {
        this.resultOperaciones = result;
        this.emitEventTermino.emit(true);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ValorSeleccionado() {
    this.btnGuardar = true;
    this.btnActualizar = true;
    this.inputFrecuencia = false;
    this.selectFrecuencia = true;
    this.BloquearAsesorExterno = false;
    this.showBtnCalcularIntereses = false;
    this.selectFrecuencia = true;
    this.inputFrecuencia = false;
    this.BloquearPuntosA = true;
    this.logDataOnEditAsesoria.ProductoAnterior = null;
    if((this.asesoriaterminoForm.controls['NumeroAsesoria'].value == "" || this.asesoriaterminoForm.controls['NumeroAsesoria'].value == null)
      && this.asesoriaterminoOperacionFrom.get('Codigo')?.value !== '2' && this.asesoriaterminoOperacionFrom.get('Codigo')?.value !== '43'){
        this.ClearForm();
      }
    if(this.asesoriaterminoOperacionFrom.get('Codigo')?.value !== '13') this.AdicionarPuntosFrom.reset();
    this.asesoriaterminoForm.controls['BuscarDocumento'].disable();
    this.asesoriaterminoForm.controls['BuscarNombre'].disable();
    this.asesoriaterminoForm.controls['NumeroAsesoria'].disable();
    if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value !== '2' && this.asesoriaterminoOperacionFrom.get('Codigo')?.value !== '43') {
      this.asesoriaterminoForm.controls['BuscarDocumento'].reset();
      this.asesoriaterminoForm.controls['BuscarNombre'].reset();
      this.BotonBuscarAsesoriaTermino(1);
    }
    if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '2') {          // Buscar
      this.generalesService.Autofocus('BuscarAsesoria');
      this.ClearForm();
      this.ObtenerPuntosAdicionales();
      this.BloquearCalcularIntereces = false;
      this.Bloquear = false;
      this.BloquearBuscar = null;
      this.BloquearNombre = false;
      this.BloquearProducto = false;
      this.BloquearAsesorExterno = false;
      this.BloquearNegociacion = false;
      this.btnActualizar = true;
      this.MostrasAlertaAsociado = false;
      this.operacionEscogida = '/Buscar';
      this.devolverTab(1);
      this.tab1.nativeElement.click();
      $('#negociacion').addClass('activar');
      $('#negociacion').addClass('active');
      $('#historial').removeClass('activar');
      $('#historial').removeClass('active');
      this.asesoriaterminoForm.controls['BuscarDocumento'].enable();
      this.asesoriaterminoForm.controls['BuscarNombre'].enable();
      this.asesoriaterminoForm.controls['NumeroAsesoria'].enable();

    } else if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '43') {  // Nueva asesoria
      this.generalesService.Autofocus('SelectNombre');
      this.showBtnCalcularIntereses = true;
      this.ClearForm();
      this.MapearDatosUsuario();
      this.ObtenerPuntosAdicionales();
      this.selectFrecuencia = false;
      this.inputFrecuencia = true;
      this.Bloquear = false;
      this.BloquearBuscar = false;
      this.BloquearNombre = null;
      this.BloquearProducto = false;
      this.BloquearAsesorExterno = null;
      this.BloquearNegociacion = false;
      this.MostrasAlertaAsociado = false;
      this.btnActualizar = true;
      this.btnGuardar = false;
      this.disableBtnGuardar = false;
      this.operacionEscogida = '/Nueva asesoría';
      this.devolverTab(1);
      this.tab1.nativeElement.click();
      $('#negociacion').addClass('activar');
      $('#negociacion').addClass('active');
      $('#historial').removeClass('activar');
      $('#historial').removeClass('active');

    } else if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '1') {  // Editar
      if (this.asesoriaterminoForm.get('NumeroAsesoria')?.value) {
        const creationDate = this.asesoriaterminoForm.get('FechaCreacion')?.value.split(' ')[0];
        const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '/');
        if (creationDate !== currentDate) {
          this.asesoriaterminoOperacionFrom.get('Codigo')?.reset();
          this.notif.warning('Advertencia', 'Asesoría no valida para editar.', ConfiguracionNotificacion.configRightTop);
          return;
        }

        this.generalesService.Autofocus('SelectProducto');
        this.VolverAbajo();
        this.ObtenerPuntosAdicionales();
        this.BloquearNegociacion = null;
        this.Bloquear = false;
        this.BloquearBuscar = false;
        this.BloquearNombre = false;
        this.BloquearProducto = null;
        this.BloquearAsesorExterno = false;
        this.MostrasAlertaAsociado = false;
        this.selectFrecuencia = false;
        this.inputFrecuencia = true;
        this.BloquearPuntosA = null;
        this.btnActualizar = false;
        this.BloquearbtnActalizar = false;
        this.showBtnCalcularIntereses = true;
        this.BloquearCalcularIntereces = false;
        this.btnGuardar = true;
        this.operacionEscogida = '/Editar';
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        $('#negociacion').addClass('activar');
        $('#negociacion').addClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una asesoría para realizar esta operación.',
          ConfiguracionNotificacion.configRightTop);
        this.asesoriaterminoOperacionFrom.get('Codigo')?.reset();
        this.Limpiar();
        this.ClearForm();
      }
    } else if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '13') { // Reimprimir
      if (this.asesoriaterminoForm.get('NumeroAsesoria')?.value) {
        this.operacionEscogida = '/Reimprimir';
        this.Bloquear = false;
        this.BloquearBuscar = false;
        this.BloquearNombre = false;
        this.BloquearProducto = false;
        this.BloquearAsesorExterno = false;
        this.BloquearNegociacion = false;
        this.MostrasAlertaAsociado = false;
        this.btnActualizar = true;
        this.GenerarPdfAsesoria();
        setTimeout(() => {
          this.GetHistorial(this.asesoriaterminoForm.controls['NumeroAsesoria'].value);
        }, 500);
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una asesoría para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.asesoriaterminoOperacionFrom.get('Codigo')?.reset();
        this.Limpiar();
        this.ClearForm();
      }
    } else if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '19') { // Cambiar asesor externo
      if (this.asesoriaterminoForm.get('NumeroAsesoria')?.value) {
        this.generalesService.Autofocus('SelectAsesorExterno');
        this.Bloquear = false;
        this.BloquearBuscar = false;
        this.BloquearNombre = false;
        this.BloquearProducto = false;
        this.BloquearAsesorExterno = null;
        this.BloquearNegociacion = false;
        this.btnActualizar = false;
        this.BloquearbtnActalizar = false;
        this.MostrasAlertaAsociado = false;
        this.operacionEscogida = '/ Cambiar asesor externo';
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        $('#negociacion').addClass('activar');
        $('#negociacion').addClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una asesoría para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.asesoriaterminoOperacionFrom.get('Codigo')?.reset();
        this.Limpiar();
        this.ClearForm();
      }
    } else {
      return null;
    }
    return true;
  }
  GenerarImpresion(itemsSend : any) {
    this.linkPdf = "";
    let pdfinBase64 = null;
    let byteArray = null;
    let newBolb = null;
    let url = null;
    this.loading = true;
    document.querySelector("object")!.data = "";
    document.querySelector("object")!.name = "";
    document.querySelector("object")!.type = "";
    this.AsesoriaTerminoServices.GenerarImpresionTermino(itemsSend).subscribe(
      result => {
        pdfinBase64 = result.FileStream._buffer;
        byteArray = new Uint8Array(
          atob(pdfinBase64)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        newBolb = new Blob([byteArray], { type: "application/pdf" });
        this.linkPdf = URL.createObjectURL(newBolb);
        url = window.URL.createObjectURL(newBolb);
        document.querySelector("object")!.data = url;
        document.querySelector("object")!.name = "Impresion";
        document.querySelector("object")!.type = "application/pdf";
        this.loading = false;
      },
      error => {
        this.loading = false
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(errorMessage);
      }
    );
  }
  ObtenerRelacion() {
    this.AsesoriaTerminoServices.ObtenerRelacion().subscribe(
      result => {
        this.resultRelacion = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ObtenerFrecuenciaPago(plazo : number) {
    this.AsesoriaTerminoServices.ObtenerFrecuenciaPago(plazo).subscribe(
      result => {
        this.resultFrecuenciaPago = result;
        console.log("this.resultFrecuenciaPago ",this.resultFrecuenciaPago )
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ObtenerPuntosAdicionales() {
    this.AsesoriaTerminoServices.ObtenerPuntosAdicionales(0).subscribe(
      result => {
        this.resultPuntosAdicionales = result;
        console.log("puntos adi",this.resultPuntosAdicionales)
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BotonBuscarAsesoriaTermino(operationType: number = 0) {

    return new Promise((resolve, reject) => {
      let documento: string = this.asesoriaterminoForm.controls['BuscarDocumento'].value;
      let nombre: string = this.asesoriaterminoForm.controls['BuscarNombre'].value;
      let numeroAsesoria: string = this.asesoriaterminoForm.controls['NumeroAsesoria'].value;
      if ((documento == null || documento == "") && (nombre == null || nombre == "") && (numeroAsesoria == null || numeroAsesoria == ""))
          return;
      else if (documento != "" || nombre != "" || numeroAsesoria != "") {
        this.AsesoriaTerminoServices.BuscarAsesoria(documento, nombre, numeroAsesoria).subscribe(x => {
          console.log(x)
          if (x.length > 1) {
            this.resultAsesoria = x;
            this.ModalBuscarAsesoria.nativeElement.click();
            this.asesoriaterminoForm.get('BuscarNombre')?.reset();
            this.asesoriaterminoForm.get('BuscarDocumento')?.reset();
          } else if (x.length == 1) {
            this.BloquearBuscar = false;
            if (this.logDataOnEditAsesoria.FechaVencimientoActualiza === null) {
              this.logDataOnEditAsesoria.FechaVencimientoActualiza = new DatePipe('en-CO').transform(x[0].FechaCancelacion, 'yyyy/MM/dd  HH:mm:ss');
            }
  
            this.MapearDatosCuenta(x[0], operationType);
            if (operationType === 0)
              this.asesoriaterminoOperacionFrom.get('Codigo')?.reset();
          } else
            this.notif.warning('Advertencia', 'No se encontró la asesoría.', ConfiguracionNotificacion.configRightTop);
          this.asesoriaterminoForm.get('BuscarNombre')?.reset();
          this.asesoriaterminoForm.get('BuscarDocumento')?.reset();
          resolve('')
        }, error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
          reject('')
        });
      }
    });

  }
  MapearDatosCuenta(dato: any, operationType: number = 0) {
    console.log("Usuario", dato);
    this.asesoriaterminoForm.controls['BuscarDocumento'].disable();
    this.asesoriaterminoForm.controls['BuscarNombre'].disable();
    this.asesoriaterminoForm.controls['NumeroAsesoria'].disable();
    this.asesoriaterminoForm.controls['BuscarDocumento'].reset();
    this.asesoriaterminoForm.controls['BuscarNombre'].reset();
    //info del asesor externo anterior
    const { IdAsesorExterno, PrimerNombreAsesorE, SegundoNombreAsesoreE, PrimerApellidoAsesorE, SegundoApellidoAsesorE, } = dato;
    const nombreCompleto = [PrimerApellidoAsesorE, SegundoApellidoAsesorE, PrimerNombreAsesorE, SegundoNombreAsesoreE].join(' ');
    this.asesorExternoAnterior = { id: IdAsesorExterno, nombre: nombreCompleto };

    // Asignando valores anteriores para validar que no se haga el calculo anterior
    this.productoAnterior = dato.IdProducto;
    this.plazoAnterior = dato.Plazo;
    this.valorTituloAnterior = dato.valorTitulo;
    this.frecuenciaPagoAnterior = dato.DescripcionFrecuenciaPago;
    this.puntosAdicionalesAnterior = dato.intPuntosAdicionales / 10;

    this.BloquearBuscar = false;
    this.asesoriaterminoForm.controls['BuscarDocumento'].reset();
    if (operationType === 0) this.asesoriaterminoOperacionFrom.get('Codigo')?.reset();
    this.asesoriaterminoForm.controls['NumeroAsesoria'].setValue(dato.NumeroAsesoria);
    this.asesoriaterminoForm.controls['NumeroDocumento'].setValue(dato.NumeroDocumento);
    this.asesoriaterminoForm.controls['Nombre'].setValue(dato.PrimerApellido + " " + dato.SegundoApellido + " " + dato.PrimerNombre + " " +  dato.SegundoNombre);
    this.asesoriaterminoForm.controls['Clase'].setValue(dato.IdRelacionTipo);
    this.asesoriaterminoForm.controls['IdAsesor'].setValue(dato.IdAsesor);
    this.asesoriaterminoForm.controls['NombreAsesor'].setValue(dato.PrimerApellidoAsesor + " " + dato.SegundoApellidoAsesor + " " + dato.PrimerNombreAsesor + " " + dato.SegundoNombreAsesor);
    this.asesoriaterminoForm.controls['NumeroOficina'].setValue(dato.NumeroOficina);
    this.asesoriaterminoForm.controls['NombreOficina'].setValue(dato.DescripcionOficina);
    this.AsesorFrom.controls['strCodigo'].setValue(dato.IdAsesorExterno || '');
    this.AsesorFrom.controls['strNombre'].setValue([dato.PrimerApellidoAsesorE, dato.SegundoApellidoAsesorE, dato.PrimerNombreAsesorE, dato.SegundoNombreAsesoreE].join(' ').trim());
    this.asesoriaterminoForm.controls['FechaCreacion'].setValue(new DatePipe('en-CO').transform(dato.FechaCreacion, 'yyyy/MM/dd HH:mm:ss'));
    this.asesoriaterminoForm.controls['FechaVencimiento'].setValue(new DatePipe('en-CO').transform(dato.FechaCancelacion, 'yyyy/MM/dd HH:mm:ss'));
    this.asesoriaterminoForm.controls['IdProducto'].setValue(dato.IdProducto);
    this.asesoriaterminoForm.controls['DescripcionProducto'].setValue(dato.DescripcionProducto);
    this.asesoriaterminoForm.controls['Plazo'].setValue(dato.Plazo);
    this.ObtenerFrecuenciaPago(dato.Plazo);
    this.asesoriaterminoForm.controls['ValorTotal'].setValue(dato.valorTitulo);
    this.asesoriaterminoForm.controls['DescripcionFrecuenciaPago'].setValue(dato.DescripcionFrecuenciaPago);
    this.AdicionarPuntosFrom.controls['AdicionarPunto'].setValue(dato.intPuntosAdicionales);
    this.asesoriaterminoForm.controls['IdFrecuenciaPago'].setValue(dato.IdFrecuenciaPago);
    this.devolverFrecuencia(+dato.IdFrecuenciaPago);
    this.asesoriaterminoForm.get('Variable')?.setValue(this.dataFrecuencia);
    this.MapearInteresesBuscar(dato.InteresxPagar, dato.ValorAportes, dato.Retencion);
    this.asesoriaterminoForm.get('Edad')?.setValue(dato.Edad);
    this.asesoriaterminoForm.get('IdTipoDocumento')?.setValue(dato.IdTipoDocumento);

    this.AdicionarPuntosFrom.get('AdicionarPunto')?.reset();
    this.AdicionarPuntosFrom.get('AdicionarPuntoDescripcion')?.reset();   
    
    if (dato.Tasa !== 0) {
      this.AsesoriaTerminoServices.ObtenerTasaInicial(dato).subscribe(
        result => {
          if (result !== null) {
            result[0].TasaAdicional = dato.TasaAdicional;
            const numberNominal = this.returnFormatNum(result[0].TasaNominal);
            this.asesoriaterminoForm.get('TasaNominal')?.setValue(numberNominal + "%");
            this.datoTasaNominal = + result[0].TasaNominal.toFixed(6);
            const numberEfectiva = this.returnFormatNum(result[0].TasaEfectiva.toFixed(4));
            this.asesoriaterminoForm.get('TasaEfectiva')?.setValue(numberEfectiva + "%");
            this.datoTasaEfectiva = result[0].TasaEfectiva.toFixed(6);
            const numberTasaAdicional = this.returnFormatNum(dato.TasaAdicional.toFixed(4));
            this.asesoriaterminoForm.get('TasaAdicional')?.setValue(numberTasaAdicional + "%");
            this.datoTasaAdicional = result.TasaAdicional;
            if (this.datoTasaAdicional) this.datoTasaAdicional = this.datoTasaAdicional.toFixed(6);
                      
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }

    this.GetHistorial(dato.NumeroAsesoria);

    setTimeout(() => {
      this.BloquearbtnActalizar = false;
      this.BloquearCalcularIntereces = false;
    }, 500);
    
    if (dato.intPuntosAdicionales != null) {
      dato.intPuntosAdicionales /= 10; 
      let puntos: any[] = this.resultPuntosAdicionales.filter((x : any) => x.PuntosAdicionales == Number(dato.intPuntosAdicionales));
      setTimeout(() => {
        this.AdicionarPuntosFrom.get('AdicionarPunto')?.setValue(puntos[0].IdPuntosAdicionales);
        this.AdicionarPuntosFrom.get('AdicionarPuntoDescripcion')?.setValue(dato.intPuntosAdicionales);
        if(dato.Tasa !== 0) this.SumaPuntos();
      }, 700);
    }
  }


  onChangePuntosAdicionales() {
    this.SumaPuntos();
    this.onChangeDataForm();
  }

  async onChangeFrecuenciaPago() {
    this.onChangeDataForm();
    const requiredFieldNames = ['IdProducto', 'DescripcionProducto', 'Plazo', 'ValorTotal', 'IdFrecuenciaPago'];
    const isSomeRequiredFieldMissing = requiredFieldNames.some(fieldName => !this.asesoriaterminoForm.get(fieldName)?.value || !(this.asesoriaterminoForm.get(fieldName)?.value + '').trim());
    if (isSomeRequiredFieldMissing) return;

    await this.ObtenerTasa();
    this.SumaPuntos();
  }

  SumaPuntos() {
    const requiredFieldNames = ['IdProducto', 'DescripcionProducto', 'Plazo', 'ValorTotal', 'IdFrecuenciaPago'];
    const isSomeRequiredFieldMissing = requiredFieldNames.some(fieldName => !this.asesoriaterminoForm.get(fieldName)?.value || !(this.asesoriaterminoForm.get(fieldName)?.value + '').trim());
    if (isSomeRequiredFieldMissing || this.AdicionarPuntosFrom.get('AdicionarPunto')?.value === null) return;
      
    if (this.AdicionarPuntosFrom.get('AdicionarPunto')?.value !== '--Seleccione--') {
     
      this.asesoriaterminoForm.get('TasaEfectiva')?.reset();
      this.asesoriaterminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva + "%");
      this.asesoriaterminoForm.get('TasaNominal')?.reset();
      this.asesoriaterminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal + "%");

      let puntos: any[] = this.resultPuntosAdicionales.filter((x : any) => x.IdPuntosAdicionales == this.AdicionarPuntosFrom.get('AdicionarPunto')?.value);
      const Punto = puntos[0].PuntosAdicionales;
      this.asesoriaterminoForm.get('AdicionarP')?.setValue(Punto);
      this.loading = true;
      let payload: any = this.asesoriaterminoForm.value;
      this.AsesoriaTerminoServices.ObtenerTasaConPuntos(payload).subscribe(
        result => {
          this.loading = false;
          console.log("suma puntos",result)
          this.MapearTasa(result);
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    } else {
      this.notif.warning('Advertencia', 'Debe seleccionar puntos a adicionar.', ConfiguracionNotificacion.configRightTop);
    }
  }
  disableBtnGuardar: boolean = false;
  MapearInteresesBuscar(Interes : number, Aportes : number, Retencion : number) {
    this.asesoriaterminoForm.get('TotalInteresBruto')?.setValue(Interes.toFixed(0));
    this.asesoriaterminoForm.get('TotalAportes')?.setValue(Aportes.toFixed(0));
    this.asesoriaterminoForm.get('TotalRetencion')?.setValue(Retencion.toFixed(0));

    const plazo = this.asesoriaterminoForm.get('Plazo')?.value
    const FrecuenciaPago = +this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value;
    this.devolverFrecuencia(FrecuenciaPago);
    const variable = (plazo / this.dataFrecuencia)
    if (this.dataFrecuencia === 1) {
      const Interes = this.asesoriaterminoForm.get('TotalInteresBruto')?.value;
      const Retencion = this.asesoriaterminoForm.get('TotalRetencion')?.value;
      const Aportes = this.asesoriaterminoForm.get('TotalAportes')?.value;
      this.asesoriaterminoForm.get('TotalInteresNeto')?.setValue(Interes - Retencion - Aportes);
      // Periodo
      const InteresPeriodo = this.asesoriaterminoForm.get('TotalInteresBruto')?.value;
      this.asesoriaterminoForm.get('InteresBruto')?.setValue(InteresPeriodo);
      const RetencionPeriodo = this.asesoriaterminoForm.get('TotalRetencion')?.value;
      this.asesoriaterminoForm.get('Retencion')?.setValue(RetencionPeriodo);
      const AportesPeriodo = this.asesoriaterminoForm.get('TotalAportes')?.value;
      this.asesoriaterminoForm.get('Aportes')?.setValue(AportesPeriodo);
      this.asesoriaterminoForm.get('InteresNeto')?.setValue(InteresPeriodo - RetencionPeriodo - AportesPeriodo);

    } else {
      // Periodo
      const Interes = this.asesoriaterminoForm.get('TotalInteresBruto')?.value;
      this.asesoriaterminoForm.get('InteresBruto')?.setValue(Math.floor(Interes / variable));
      const Retencion = this.asesoriaterminoForm.get('TotalRetencion')?.value;
      this.asesoriaterminoForm.get('Retencion')?.setValue(Math.floor(Retencion / variable));
      const Aportes = this.asesoriaterminoForm.get('TotalAportes')?.value;
      this.asesoriaterminoForm.get('Aportes')?.setValue(Math.floor(Aportes / variable));
      const InteresT = this.asesoriaterminoForm.get('InteresBruto')?.value;
      const RetencionT = this.asesoriaterminoForm.get('Retencion')?.value;
      const AportesT = this.asesoriaterminoForm.get('Aportes')?.value;
      this.asesoriaterminoForm.get('InteresNeto')?.setValue(InteresT - RetencionT - AportesT);
      // totales
      const InteresTotal = this.asesoriaterminoForm.get('TotalInteresBruto')?.value;
      const RetencionTotal = this.asesoriaterminoForm.get('TotalRetencion')?.value;
      const AportesTotal = this.asesoriaterminoForm.get('TotalAportes')?.value;
      this.asesoriaterminoForm.get('TotalInteresNeto')?.setValue(InteresTotal - RetencionTotal - AportesTotal);
    }
  }
  devolverFrecuencia(Id : number) {
    switch (Id) {
      case 30:
        this.dataFrecuencia = 30;
        break;
      case 35:
        this.dataFrecuencia = 60;
        break;
      case 40:
        this.dataFrecuencia = 90;
        break;
      case 45:
        this.dataFrecuencia = 120;
        break;
      case 50:
        this.dataFrecuencia = 180;
        break;
      case 55:
        this.dataFrecuencia = 360;
        break;
      case 60:
        this.dataFrecuencia = 1;
        break;
    }
    this.asesoriaterminoForm.get('Variable')?.setValue(this.dataFrecuencia);
  }
  obtenerintereses() {
    this.asesoriaterminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva);
    this.asesoriaterminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal);
    this.devolverFrecuencia(this.asesoriaterminoForm.controls['IdFrecuenciaPago'].value);
    let payload: any = this.asesoriaterminoForm.value;
    this.AsesoriaTerminoServices.ObtenerIntereses(payload).subscribe(
      result => {
        if (result !== null) {
          this.MapearIntereses(result);
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  MapearIntereses(result : any) {
    console.log("intereses", result);
    this.asesoriaterminoForm.get('TotalInteresBruto')?.setValue(result.InteresBruto.toFixed(0));
    this.asesoriaterminoForm.get('Aportes')?.setValue(result.Aportes.toFixed(0));
    this.obtenerRetencion();

    const TasaNominal = this.returnFormatNum(this.asesoriaterminoForm.get('TasaNominal')?.value);
    const TasaNominalFinal = this.returnFormatNum(Number(TasaNominal).toFixed(6)) + "%"
    this.asesoriaterminoForm.get('TasaNominal')?.setValue(TasaNominalFinal);
    const TasaEfectiva = this.returnFormatNum(this.asesoriaterminoForm.get('TasaEfectiva')?.value);
    const TasaEfectivaFinal = this.returnFormatNum(Number(TasaEfectiva).toFixed(6)) + "%"
    this.asesoriaterminoForm.get('TasaEfectiva')?.setValue(TasaEfectivaFinal);
  }
  obtenerRetencion() {
    if (this.asesoriaterminoForm.get('TotalInteresBruto')?.value !== ''
      && this.asesoriaterminoForm.get('TotalInteresBruto')?.value !== undefined
      && this.asesoriaterminoForm.get('TotalInteresBruto')?.value !== null) {
      this.loading = true;
      this.asesoriaterminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva);
      this.asesoriaterminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal);
      this.asesoriaterminoForm.get('InteresBruto')?.setValue(this.asesoriaterminoForm.get('TotalInteresBruto')?.value);
      this.asesoriaterminoForm.get('TotalInteres')?.setValue(this.asesoriaterminoForm.get('InteresBruto')?.value);
      let payload: any = this.asesoriaterminoForm.value;
      this.AsesoriaTerminoServices.ObtenerRetencionAsesoriaTermino(payload).subscribe(
        result => {
          console.log("Rete", result);
          this.loading = false;
          const retencion = result;
          this.asesoriaterminoForm.get('Retencion')?.setValue(retencion)
          if (this.asesoriaterminoForm.get('IdTipoDocumento')?.value === 3 && this.idObjetoSocial === 2) this.asesoriaterminoForm.get('Retencion')?.setValue(0);
          const plazo = this.asesoriaterminoForm.get('Plazo')?.value
          const FrecuenciaPago = +this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value;
          this.devolverFrecuencia(FrecuenciaPago);
          const variable = (plazo / this.dataFrecuencia)
          console.log("variable", variable)
          if (this.dataFrecuencia === 1) {
            const InteresPeriodo = this.asesoriaterminoForm.get('InteresBruto')?.value;
            this.asesoriaterminoForm.get('TotalInteresBruto')?.setValue(InteresPeriodo);
            const RetencionPeriodo = this.asesoriaterminoForm.get('Retencion')?.value;
            this.asesoriaterminoForm.get('TotalRetencion')?.setValue(RetencionPeriodo);
            const AportesPeriodo = this.asesoriaterminoForm.get('Aportes')?.value;
            this.asesoriaterminoForm.get('TotalAportes')?.setValue(AportesPeriodo);
            this.asesoriaterminoForm.get('InteresNeto')?.setValue(InteresPeriodo - RetencionPeriodo - AportesPeriodo);
            const Interes = this.asesoriaterminoForm.get('TotalInteresBruto')?.value;
            const Retencion = this.asesoriaterminoForm.get('TotalRetencion')?.value;
            const Aportes = this.asesoriaterminoForm.get('TotalAportes')?.value;
            this.asesoriaterminoForm.get('TotalInteresNeto')?.setValue(Interes - Retencion - Aportes);
          } else {
            const InteresPeriodo = this.asesoriaterminoForm.get('InteresBruto')?.value;
            this.asesoriaterminoForm.get('TotalInteresBruto')?.setValue(Math.floor(InteresPeriodo * variable));
            const RetencionPeriodo = this.asesoriaterminoForm.get('Retencion')?.value;
            this.asesoriaterminoForm.get('TotalRetencion')?.setValue(Math.floor(RetencionPeriodo * variable));
            const AportesPeriodo = this.asesoriaterminoForm.get('Aportes')?.value;
            this.asesoriaterminoForm.get('TotalAportes')?.setValue(Math.floor(AportesPeriodo * variable));
            this.asesoriaterminoForm.get('InteresNeto')?.setValue(InteresPeriodo - RetencionPeriodo - AportesPeriodo);
            const Interes = this.asesoriaterminoForm.get('TotalInteresBruto')?.value;
            const Retencion = this.asesoriaterminoForm.get('TotalRetencion')?.value;
            const Aportes = this.asesoriaterminoForm.get('TotalAportes')?.value;
            this.asesoriaterminoForm.get('TotalInteresNeto')?.setValue(Interes - Retencion - Aportes);
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
  }
  ObtenerTasa() {

    return new Promise(resolve => {
      if (this.asesoriaterminoForm.get('Plazo')?.value !== ''
        && this.asesoriaterminoForm.get('Plazo')?.value !== undefined
        && this.asesoriaterminoForm.get('Plazo')?.value !== null
        && this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value !== ''
        && this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value !== undefined
        && this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value !== null) {
        this.loading = true;
        let payload: any = this.asesoriaterminoForm.value;
        this.AsesoriaTerminoServices.ObtenerTasa(payload).subscribe(
          result => {
            resolve('');
            this.loading = false;
            this.disableBtnGuardar = false;
            console.log("tasa", result)
            if (this.resultFrecuenciaPago != null && this.resultFrecuenciaPago.length > 0) {
              let formaPago: any = this.resultFrecuenciaPago.filter((x : any) => x.IdFrecuenciaPago == this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value);
              if (formaPago != null && formaPago.length > 0)
                this.asesoriaterminoForm.get('DescripcionFrecuenciaPago')?.setValue(formaPago[0].DescripcionFrecuenciaPago);
            }

            if (result.TasaEfectiva !== 0) {
              this.MapearTasa(result);
              this.BloquearCalcularIntereces = true;
            } else {
              this.BloquearCalcularIntereces = false;
              this.asesoriaterminoForm.get('Plazo')?.reset();
              this.asesoriaterminoForm.get('TasaNominal')?.reset();
              this.asesoriaterminoForm.get('TasaEfectiva')?.reset();
              this.asesoriaterminoForm.get('TasaAdicional')?.reset();
              this.notif.warning('Advertencia', 'Tasa no definida', ConfiguracionNotificacion.configRightTop);
            }
          },
          error => {
            this.BloquearCalcularIntereces = false;
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          });
      }
    });
  }

  GenerarPdfAsesoria() {
    const tasaEfectiva = this.asesoriaterminoForm.get('TasaEfectiva')?.value;
    const tasaNominal = this.asesoriaterminoForm.get('TasaNominal')?.value;
    const tasaAportes = this.asesoriaterminoForm.get('TasaAdicional')?.value;
    let itemsSend: any = {
      TituliDoc: "FORMATO DE ASESORÍA AHORRO A TERMINO",
      NumeroAsesoria: this.asesoriaterminoForm.get('NumeroAsesoria')?.value,
      Oficina: this.asesoriaterminoForm.controls['NombreOficina'].value,
      NombreAsesor: this.asesoriaterminoForm.controls['NombreAsesor'].value,
      NombreAsociado: this.asesoriaterminoForm.controls['Nombre'].value,
      Documento: this.asesoriaterminoForm.controls['NumeroDocumento'].value,
      Producto: this.asesoriaterminoForm.controls['DescripcionProducto'].value,
      PlazoDias: this.asesoriaterminoForm.controls['Plazo'].value,
      Plazo: this.asesoriaterminoForm.controls['Plazo'].value,
      ValorTitulo: this.asesoriaterminoForm.controls['ValorTotal'].value,
      FrecuenciaPago: this.asesoriaterminoForm.controls['DescripcionFrecuenciaPago'].value,
      AdicionarPunto: this.getCurrentPuntosAdicionales(),
      PuntosAdicionales: this.getCurrentPuntosAdicionales(),
      TasaEfectiva: tasaEfectiva.slice(0, -3) + '%',
      TasaNominal: tasaNominal.slice(0, -3) + '%',
      TasaAportes: tasaAportes.slice(0, -3) + '%',
      FechaVencimiento: this.asesoriaterminoForm.controls['FechaVencimiento'].value,
      InteresBruto: this.asesoriaterminoForm.controls['InteresBruto'].value,
      Retencion: this.asesoriaterminoForm.controls['Retencion'].value,
      Aportes: this.asesoriaterminoForm.controls['Aportes'].value,
      InteresNeto: this.asesoriaterminoForm.controls['InteresNeto'].value,
      TotalInteresBruto: this.asesoriaterminoForm.controls['TotalInteresBruto'].value,
      TotalRetencion: this.asesoriaterminoForm.controls['TotalRetencion'].value,
      TotalAportes: this.asesoriaterminoForm.controls['TotalAportes'].value,
      TotalInteresNeto: this.asesoriaterminoForm.controls['TotalInteresNeto'].value,
      ValorIntereses: this.asesoriaterminoForm.controls['InteresNeto'].value,
    };
    this.GenerarImpresion(itemsSend);
    $("#ImpresionTermino").show();
    this.ModalImpresion.nativeElement.click();
    if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '13') {
      const { TituliDoc, NumeroAsesoria, Oficina, NombreAsesor, NombreAsociado, Documento, PlazoDias, ValorIntereses, AdicionarPunto, ...rest } = itemsSend;
      rest.TasaEfectiva = tasaEfectiva;
      rest.TasaNominal = tasaNominal;
      rest.TasaAportes = tasaAportes;
      this.GuardarlogAsesoria({ ...rest });
    }
    
  }


  MapearTasa(result : any) {
    if (result.TasaEfectiva !== null) {
      const numberNominal = this.returnFormatNum(result.TasaNominal.toFixed(6));
      this.asesoriaterminoForm.get('TasaNominal')?.setValue(numberNominal + "%");
      this.datoTasaNominal = result.TasaNominal.toFixed(6);
      const numberEfectiva = this.returnFormatNum(result.TasaEfectiva.toFixed(6));
      this.asesoriaterminoForm.get('TasaEfectiva')?.setValue(numberEfectiva + "%");
      this.datoTasaEfectiva = result.TasaEfectiva.toFixed(6);

      const numberTasaAdicional = this.returnFormatNum(result.TasaAdicional.toFixed(6));
      this.asesoriaterminoForm.get('TasaAdicional')?.setValue(numberTasaAdicional + "%");
      this.datoTasaAdicional = result.TasaAdicional.toFixed(6);

      if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '1' && !this.logDataOnEditAsesoria.ProductoAnterior) {
        //Mapeando datos para el log al editar una asesoria
        this.logDataOnEditAsesoria.ProductoAnterior = this.asesoriaterminoForm.get('DescripcionProducto')?.value;
        this.logDataOnEditAsesoria.PlazoAnterior = this.asesoriaterminoForm.get('Plazo')?.value;
        this.logDataOnEditAsesoria.ValorTituloAnterior = this.asesoriaterminoForm.get('ValorTotal')?.value;
        this.logDataOnEditAsesoria.FrecuenciaPagoAnterior = this.asesoriaterminoForm.get('DescripcionFrecuenciaPago')?.value;
        this.logDataOnEditAsesoria.PuntosAdicionalesAnterior = this.getCurrentPuntosAdicionales();
        this.logDataOnEditAsesoria.TasaEfectivaAnterior = this.asesoriaterminoForm.get('TasaEfectiva')?.value;
        this.logDataOnEditAsesoria.TasaNominalAnterior = this.asesoriaterminoForm.get('TasaNominal')?.value;
        this.logDataOnEditAsesoria.TasaAportesAnterior = this.asesoriaterminoForm.get('TasaAdicional')?.value;
        this.logDataOnEditAsesoria.FechaVencimientoAnterior = this.asesoriaterminoForm.get('FechaVencimiento')?.value;
        this.logDataOnEditAsesoria.InteresBrutoAnterior = this.asesoriaterminoForm.get('InteresBruto')?.value;
        this.logDataOnEditAsesoria.RetencionAnterior = this.asesoriaterminoForm.get('Retencion')?.value;
        this.logDataOnEditAsesoria.AportesAnterior = this.asesoriaterminoForm.get('Aportes')?.value;
        this.logDataOnEditAsesoria.InteresNetoAnterior = this.asesoriaterminoForm.get('InteresNeto')?.value;
        this.logDataOnEditAsesoria.TotalInteresBrutoAnterior = this.asesoriaterminoForm.get('TotalInteresBruto')?.value;
        this.logDataOnEditAsesoria.TotalRetencionAnterior = this.asesoriaterminoForm.get('TotalRetencion')?.value;
        this.logDataOnEditAsesoria.TotalAportesAnterior = this.asesoriaterminoForm.get('TotalAportes')?.value;
        this.logDataOnEditAsesoria.TotalInteresNetoAnterior = this.asesoriaterminoForm.get('TotalInteresNeto')?.value;
      }

      if (this.isSavingAsesoria) {
        this.Bloquear = false;
        this.BloquearBuscar = false;
        this.BloquearNombre = false;
        this.BloquearProducto = false;
        this.BloquearAsesorExterno = false;
        this.BloquearNegociacion = false;
        this.MostrasAlertaAsociado = false;
        this.btnActualizar = true;
        this.GenerarPdfAsesoria();
        this.isSavingAsesoria = false;
      }

    } else {
      this.BloquearCalcularIntereces = false;
      this.notif.warning('Advertencia', 'No existe tasa para le plazo ingresado.',ConfiguracionNotificacion.configRightTop);
      this.asesoriaterminoForm.get('Plazo')?.reset();
    }
  }
  GetHistorial(numeroAsesoria : number) {
    this.AsesoriaTerminoServices.GetHistorial(numeroAsesoria).subscribe(x => {
      console.log(x);
      this.dataHistorial = x;
      this.dataHistorial.forEach(element => {
        element.Usuario = element.Usuario.replace(new RegExp(',', 'g'), ' ');
        if (element.IdOperacion == 1 || element.IdOperacion == 43 || element.IdOperacion == 13)
          element.JsonDto = "";
        else if (element.JsonDto != null && element.JsonDto != "") {
          const tempchar: string = '"'
          element.JsonDto = element.JsonDto.toString().replace(/{/g, "").replace(/}/g, "").replace(/\[/g, "").replace(/\]/g, "");
          element.JsonDto = element.JsonDto.toString().replace(new RegExp(tempchar, 'g'), '');
          element.JsonDto = element.JsonDto.toString().replace(new RegExp(',', 'g'), '  ');
        }
      });
    }, error => {

    })
  }
  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {
      $(".filApo_" + this.ColorAnterior1).css("background", "#FFFFFF");
      $(".filApo_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior1 = fil;
    }
    if (producto === 2) {
      $(".filAut_" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".filAut_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior2 = fil;
    }
  }
  GuardarAsesoria() {
    const requiredFieldNames = ['NumeroDocumento', 'Nombre', 'IdProducto', 'DescripcionProducto', 'Plazo', 'ValorTotal', 'IdFrecuenciaPago', 'TasaNominal', 'TasaEfectiva'];
    const isSomeRequiredFieldMissing = requiredFieldNames.some(fieldName => !this.asesoriaterminoForm.get(fieldName)?.value || !(this.asesoriaterminoForm.get(fieldName)?.value + '').trim());
    if (isSomeRequiredFieldMissing) {
      this.notif.warning('Advertencia', 'Datos incompletos para guardar asesoria.', ConfiguracionNotificacion.configRightTop);
      return;
    }

    if (this.asesoriaterminoForm.get('Plazo')?.value !== undefined && this.asesoriaterminoForm.get('Plazo')?.value !== null &&
      this.ArrayCondiciones && JSON.parse(this.asesoriaterminoForm.get('Plazo')?.value) >= this.ArrayCondiciones.PlazoMinimo &&
      JSON.parse(this.asesoriaterminoForm.get('Plazo')?.value) <= this.ArrayCondiciones.PlazoMaximo &&
      (Number(this.asesoriaterminoForm.get('Plazo')?.value) % 30) == 0) {
      if (this.asesoriaterminoForm.get('strCodigo')?.value == null || this.asesoriaterminoForm.get('strCodigo')?.value == undefined || this.asesoriaterminoForm.get('strCodigo')?.value == '') {
        swal.fire({
          title: '¿Desea agregar un asesor externo?',
          text: '',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          confirmButtonColor: 'rgb(13,165,80)',
          cancelButtonColor: 'rgb(160,0,87)',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((results) => {
          if (results.value) {
            setTimeout(() => {
              this.generalesService.Autofocus('SelectAsesorExterno');
            }, 500);
            this.VolverArriba();
            return;
          } else
            this.GuardarAsesoria2();
        });
      } else
        this.GuardarAsesoria2();
    }
  }
  GuardarAsesoria2() {
    var TasaAdicionalSin = this.asesoriaterminoForm.get('TasaAdicional')?.value;
    TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
    if (TasaAdicionalSin !== this.datoTasaAdicional)
      this.asesoriaterminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);

    const puntosAdicionales: number = (this.AdicionarPuntosFrom.get('AdicionarPunto')?.value == null || this.AdicionarPuntosFrom.get('AdicionarPunto')?.value === '--Seleccione--') ? 56 : this.AdicionarPuntosFrom.get('AdicionarPunto')?.value;
    this.asesoriaterminoForm.get('FechaCreacion')?.setValue(formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en'));
    console.log('format date', formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en'))
    let p: number = 0;
    let puntos: any[] = this.resultPuntosAdicionales.filter((x : any) => x.IdPuntosAdicionales == Number(puntosAdicionales));
    if (puntos.length > 0) {
      p = puntos[0].PuntosAdicionales;
      p *= 10;
    }
    let payload: any = {
      NumeroAsesoria: 0,
      NumeroOficina: this.asesoriaterminoForm.get('NumeroOficina')?.value,
      IdProducto: this.asesoriaterminoForm.get('IdProducto')?.value,
      IdAsesor: this.asesoriaterminoForm.get('IdAsesor')?.value,
      TasaNominal: Number(this.datoTasaNominal),
      NumeroDocumento: this.asesoriaterminoForm.get('NumeroDocumento')?.value,
      Plazo: this.asesoriaterminoForm.get('Plazo')?.value,
      IdFrecuenciaPago: this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value,
      Tasa : 0,
      IdIndicador:0,
      Puntos: 0,
      ValorTitulo: this.asesoriaterminoForm.get('ValorTotal')?.value,
      Retencion: this.asesoriaterminoForm.get('TotalRetencion')?.value,
      Intereses: this.asesoriaterminoForm.get('TotalInteresBruto')?.value,
      Herencia: 0,
      TasaAdicional: this.asesoriaterminoForm.get('TasaAdicional')?.value,
      PuntosAdicionales: p,
      Aportes: this.asesoriaterminoForm.get('TotalAportes')?.value,
      IdRelacion: this.asesoriaterminoForm.get('Clase')?.value,
      IdAsesorExterno : this.asesoriaterminoForm.get('strCodigo')?.value,
    }
    const newTerceroData = this.creacionFrom.value;
    if(newTerceroData.SegundoNombre === null) newTerceroData.SegundoNombre = '';
    if(newTerceroData.PrimerApellido === null) newTerceroData.PrimerApellido = '';
    if(newTerceroData.SegundoApellido === null) newTerceroData.SegundoApellido = '';
    Object.keys(newTerceroData).forEach(key => {
      newTerceroData[key] = this.capitalize(newTerceroData[key]);
    });
    if (newTerceroData.TipoDocumento) payload = { ...payload, ...newTerceroData };
    console.log("payload", payload)
    this.BloquearPuntosA = false;
    this.BloquearNegociacion = false;
    this.BloquearProducto = false;
    this.showBtnCalcularIntereses = false;
    this.BloquearAsesorExterno = false;
    this.BloquearNombre = false;
    this.btnGuardar = true;
    this.AsesoriaTerminoServices.GuardarAsesoria(payload).subscribe(async x => {
      console.log(x);
      this.inputFrecuencia = false;
      this.selectFrecuencia = true;
      this.notif.success('Exitoso', 'La asesoria se guardo correctamente.', ConfiguracionNotificacion.configRightTop);
      if (x != null && x.NumeroAsesoria != null && x.NumeroAsesoria != 0) {
        this.asesoriaterminoForm.controls['NumeroAsesoria'].setValue(x.NumeroAsesoria);
        await this.BotonBuscarAsesoriaTermino();    
        this.isSavingAsesoria = true;

        const currentRelacionId = this.asesoriaterminoForm.get('Clase')?.value;
        const Relacion = this.resultRelacion.find((relacion : any) => relacion.Clase === currentRelacionId).Descripcion;
        let logAsesoria: any = {
          Relacion,
          AsesorExterno: this.asesoriaterminoForm.get('strNombre')?.value,
          Producto: this.asesoriaterminoForm.get('DescripcionProducto')?.value,
          Plazo: payload.Plazo,
          ValorTitulo: payload.ValorTitulo,
          FrecuenciaPago: this.asesoriaterminoForm.get('DescripcionFrecuenciaPago')?.value,
          PuntosAdicionales: p / 10,
          TasaEfectiva: this.asesoriaterminoForm.get('TasaEfectiva')?.value,
          TasaNominal: this.asesoriaterminoForm.get('TasaNominal')?.value,
          TasaAportes: this.asesoriaterminoForm.get('TasaAdicional')?.value.slice(0,-2) + '%',
          FechaVencimiento: this.asesoriaterminoForm.get('FechaVencimiento')?.value,
          InteresBruto: this.asesoriaterminoForm.get('InteresBruto')?.value,
          Retencion: this.asesoriaterminoForm.get('Retencion')?.value,
          Aportes: this.asesoriaterminoForm.get('Aportes')?.value,
          InteresNeto: this.asesoriaterminoForm.get('InteresNeto')?.value,
          TotalInteresBruto: this.asesoriaterminoForm.get('TotalInteresBruto')?.value,
          TotalRetencion: this.asesoriaterminoForm.get('TotalRetencion')?.value,
          TotalAportes: this.asesoriaterminoForm.get('TotalAportes')?.value,
          TotalInteresNeto: this.asesoriaterminoForm.get('TotalInteresNeto')?.value,
        }
        if (!logAsesoria.AsesorExterno) delete logAsesoria.AsesorExterno;
        let newTerceroData = this.creacionFrom.value;
        if (newTerceroData.TipoDocumento) {
          const tipoDocumento = this.tiposDeDocumento.find((tipoD : any) => tipoD.Clase == newTerceroData.TipoDocumento).Descripcion;
          if(newTerceroData.TipoDocumento == 3) newTerceroData = { RazonSocial: newTerceroData.PrimerNombre, TelefonoAsesoria: newTerceroData.TelefonoAsesoria, TipoDocumento: tipoDocumento }
          logAsesoria = { ...logAsesoria, ...newTerceroData };
          logAsesoria.TipoDocumento = tipoDocumento;
        }        
        this.GuardarlogAsesoria(logAsesoria);
      }
      
    },error => {

    });
  }
  GuardarlogAsesoria(objLog: any) {
    const currentDate = formatDate(new Date().toISOString(), 'yyyy/MM/dd HH:mm:ss', 'en');
    this.generalesService.GuardarlogAsesoria(objLog,this.asesoriaterminoOperacionFrom.get('Codigo')?.value || 43, currentDate,
      77, this.asesoriaterminoForm.controls['NumeroAsesoria'].value).subscribe(
        result => {
          this.loading = false;
          this.GetHistorial(this.asesoriaterminoForm.controls['NumeroAsesoria'].value);
          console.log(result);
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
  }
  BuscarNombreXDocumento() {
    if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '43') {
      let Documento = '*';
      if (this.asesoriaterminoForm.get('NumeroDocumento')?.value !== null
        && this.asesoriaterminoForm.get('NumeroDocumento')?.value !== undefined
        && this.asesoriaterminoForm.get('NumeroDocumento')?.value !== '') {
        Documento = this.asesoriaterminoForm.get('NumeroDocumento')?.value;
        this.loading = true;
        this.AsesoriaTerminoServices.BuscarNombreXDocumento(Documento).subscribe(
          result => {
            this.loading = false;
            if (result === null) {
              this.notif.warning('Advertencia', 'No se encontraron datos.', ConfiguracionNotificacion.configRightTop);
              this.creacionFrom.get('PrimerNombre')?.reset();
              this.creacionFrom.get('SegundoNombre')?.reset();
              this.creacionFrom.get('PrimerApellido')?.reset();
              this.creacionFrom.get('SegundoApellido')?.reset();
              this.creacionFrom.get('TelefonoAsesoria')?.reset();
              this.ModalCreacionNombre.nativeElement.click();
              this.asesoriaterminoForm.get('Nombre')?.reset();
              this.datoRelacion = 15;
            } else if (result !== null) {
              this.asesoriaterminoForm.get('NumeroDocumento')?.setValue(result.NumeroDocumento);
              this.asesoriaterminoForm.get('Nombre')?.setValue(result.PrimerApellido + ' ' + result.SegundoApellido +
                ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
              this.asesoriaterminoForm.get('Clase')?.setValue(result.IdRelacionTipo);
              this.datoRelacion = result.IdRelacionTipo;
              this.MostrasAlertaAsociado = false;
              this.asesoriaterminoForm.get('Clase')?.setValue(this.datoRelacion);
              this.creacionFrom.get('PrimerNombre')?.reset();
              this.creacionFrom.get('SegundoNombre')?.reset();
              this.creacionFrom.get('PrimerApellido')?.reset();
              this.creacionFrom.get('SegundoApellido')?.reset();
              this.creacionFrom.get('TelefonoAsesoria')?.reset();
              this.BloquearProducto = null;
            }
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }
    }
  }
  ValidarCampoAsociado() {
    if (this.asesoriaterminoForm.get('Nombre')?.value !== ''
      && this.asesoriaterminoForm.get('Nombre')?.value !== null
      && this.asesoriaterminoForm.get('Nombre')?.value !== undefined) {
      this.MostrasAlertaAsociado = false;
    } else {
      this.MostrasAlertaAsociado = true;
    }
  }

  validarCero(campo : string){
    if(this.asesoriaterminoForm.get(campo)?.value == 0)
      this.asesoriaterminoForm.get(campo)?.setValue("");
    else if(this.asesoriaterminoForm.get(campo)?.value.length > 0){
      let subStringTemp : string = this.asesoriaterminoForm.get(campo)?.value;
      let subStringTemp0 = subStringTemp.substring(0,1);
      if(subStringTemp0 == "0")
        this.asesoriaterminoForm.get(campo)?.setValue(subStringTemp.substring(1,subStringTemp.length));
    }
  }
  BuscarNombreXNombre() {
    let Nombre = '*';
    if (this.asesoriaterminoForm.get('Nombre')?.value !== null
      && this.asesoriaterminoForm.get('Nombre')?.value !== undefined
      && this.asesoriaterminoForm.get('Nombre')?.value !== '') {
      Nombre = this.asesoriaterminoForm.get('Nombre')?.value;
      this.loading = true;
      this.AsesoriaTerminoServices.BuscarNombreXNombre(Nombre).subscribe(
        result => {
          this.loading = false;
          if (result.length === 0) {
            this.notif.warning('Advertencia', 'No se encontró el nombre.', ConfiguracionNotificacion.configRightTop);
          } else if (result.length === 1) {
            const Documento = result[0].NumeroDocumento;
            this.BuscarNombreModal(Documento);
            this.BloquearProducto = false;
            this.MostrasAlertaAsociado = false;
            this.generalesService.Autofocus('SelectProducto');
          } else if (result.length > 1) {
            this.resultNombre = result;
            this.ModalNombre.nativeElement.click();
            this.BloquearProducto = null;
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  CalcularAsesoria() {
    if (!this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value
      || Number(this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value) == -1
      || !this.asesoriaterminoForm.get('IdProducto')?.value
      || !this.asesoriaterminoForm.get('ValorTotal')?.value
      || !this.asesoriaterminoForm.get('Plazo')?.value) {
      this.notif.warning('Advertencia', 'Datos incompletos para calcular asesoria.', ConfiguracionNotificacion.configRightTop);
      return;
    }

    if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value == '1' && this.asesoriaterminoForm.get('IdProducto')?.value == this.productoAnterior
      && this.asesoriaterminoForm.get('Plazo')?.value == this.plazoAnterior
      && this.asesoriaterminoForm.get('ValorTotal')?.value == this.valorTituloAnterior
      && this.asesoriaterminoForm.get('DescripcionFrecuenciaPago')?.value == this.frecuenciaPagoAnterior
      && this.getCurrentPuntosAdicionales() == this.puntosAdicionalesAnterior) {
        this.notif.warning('Advertencia', 'Debe cambiar datos para calcular asesoria.', ConfiguracionNotificacion.configRightTop);
        return;
      }

      if (this.asesoriaterminoForm.get('TasaEfectiva')?.value !== ''
        && this.asesoriaterminoForm.get('TasaEfectiva')?.value !== undefined
        && this.asesoriaterminoForm.get('TasaEfectiva')?.value !== null
        && this.asesoriaterminoForm.get('TasaNominal')?.value !== ''
        && this.asesoriaterminoForm.get('TasaNominal')?.value !== undefined
        && this.asesoriaterminoForm.get('TasaNominal')?.value !== null) {

        this.asesoriaterminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva);
        this.asesoriaterminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal);
        const FrecuenciaPago = +this.asesoriaterminoForm.get('IdFrecuenciaPago')?.value;
        this.devolverFrecuencia(FrecuenciaPago);
        this.asesoriaterminoForm.get('Variable')?.setValue(this.dataFrecuencia);
        let payload: any = this.asesoriaterminoForm.value;
        this.AsesoriaTerminoServices.ObtenerIntereses(payload).subscribe(
          result => {

            if (result !== null) {
              this.MapearIntereses(result);
              this.disableBtnGuardar = true;
              this.BloquearbtnActalizar = true;
            }
          },
          error => {
            const errorMessage = <any>error;
            console.log(errorMessage);
          });

      } else { 
        this.notif.warning('Advertencia', 'Datos incompletos para calcular asesoria.', ConfiguracionNotificacion.configRightTop);
      }

  }
  BuscarNombreModal(Documento = '*') {
    this.loading = true;
    this.AsesoriaTerminoServices.BuscarAsociado(Documento, '*').subscribe(
      result => {
        this.loading = false;
        this.creacionFrom.reset();
        this.asesoriaterminoForm.get('Edad')?.reset();
        if (result.length === 1) {
          // this.BuscarAsociadoModal(result[0].NumeroDocumento);
          if ((this.asesoriaterminoForm.get('IdProducto')?.value === 302 && result[0].Edad < 75) || (this.asesoriaterminoForm.get('IdProducto')?.value !== 302 && result[0].Edad >= 75)  ) {
            this.cleanNegociacionData();
            this.asesoriaterminoForm.get('IdProducto')?.reset();
            this.asesoriaterminoForm.get('DescripcionProducto')?.reset();
          }
          this.asesoriaterminoForm.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
          this.asesoriaterminoForm.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' + result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
          this.asesoriaterminoForm.get('Clase')?.setValue(result[0].IdRelacionTipo);
          this.asesoriaterminoForm.get('Edad')?.setValue(result[0].Edad);
          this.asesoriaterminoForm.get('IdTipoDocumento')?.setValue(result[0].TipoDocumento);
          this.idObjetoSocial = result[0].IdObjetoSocial;
          this.MostrasAlertaAsociado = false;
          this.BloquearProducto = null;
          this.generalesService.Autofocus('SelectProducto');
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          if (result.Mensaje === 'Gerencia de desarrollo.') {
            swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>' + result.Mensaje + '.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: 'rgb(160, 0, 87)'
            });
          } else if (result.Mensaje === 'Oficial de cumplimiento.') {
            swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'+ result.Mensaje + '.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: 'rgb(160, 0, 87)'
            });
          } else {
            this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
            this.MapearDatosUsuario();
          }
          this.asesoriaterminoForm.get('NumeroDocumento')?.reset();
          this.asesoriaterminoForm.get('Nombre')?.reset();
          this.MapearDatosUsuario();
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(errorMessage);
      }
    );
  }
  BuscarAsociadoXNombre() {
    if (!this.asesoriaterminoForm.get('NumeroDocumento')?.value) {
      this.TerminoService.BuscarAsesor(this.asesoriaterminoForm.get('IdAsesor')?.value, '*').subscribe(
        result => {          
          if (result.length === 1) {
            this.MapearDatosAsesor(result);
            this.Asociado();

          }
        });
    }    
  }

  onChangeTipoDocumento() {
    this.BloquearNuevoAsociadoForm = null;
    this.creacionFrom.get('PrimerNombre')?.reset();
    if (this.creacionFrom.get('TipoDocumento')?.value == 3) {
      this.creacionFrom.get('PrimerNombre')?.reset();
      this.creacionFrom.get('SegundoNombre')?.reset();
      this.creacionFrom.get('PrimerApellido')?.reset();
      this.creacionFrom.get('SegundoApellido')?.reset();
    }  
  }

  onChangeCreacionForm() {
    const requiredFieldNamesWithRegex = [
      { name: 'TipoDocumento', regex: /^\d+$/ },
      { name: 'PrimerNombre', regex: /^(?!\s*$).+/ },
      { name: 'TelefonoAsesoria', regex: /^\d{10}$/ }
    ];
    if (this.creacionFrom.get('TipoDocumento')?.value != 3) {
      requiredFieldNamesWithRegex.push(
        { name: 'PrimerApellido', regex: /^[^\d]+$/ },
        { name: 'SegundoNombre', regex: /^[A-Za-z]*$/ },
        { name: 'SegundoApellido', regex: /^[A-Za-z]*$/ },
      );
      requiredFieldNamesWithRegex[1].regex = /^[^\d]+$/
    }
    const isSomeRequiredFieldMissing = requiredFieldNamesWithRegex.some(field => !field.regex.test(this.creacionFrom.get(field.name)?.value?.trim()));
    this.isCreationButtonDisabled = isSomeRequiredFieldMissing;
  }


  BuscarAsociadoXDocumento() {
    if (/^[a-zA-Z0-9]{3,15}$/.test(this.asesoriaterminoForm.get('NumeroDocumento')?.value)) {
      this.asesoriaterminoForm.get('Nombre')?.reset();
      this.TerminoService.BuscarAsesor(this.asesoriaterminoForm.get('IdAsesor')?.value, '*').subscribe(
        result => {          
          if (result.length === 1) {
            this.MapearDatosAsesor(result);
            this.Asociado();
          }
      });
    }
  }

  Asociado() {
    let Documento = '*';
    let Nombre = '*';
    this.asesoriaterminoForm.get('IdProducto')?.reset();
    this.asesoriaterminoForm.get('DescripcionProducto')?.reset();
    this.cleanNegociacionData();
    this.BloquearProducto = false;
    this.BloquearNegociacion = false;
    this.asesoriaterminoForm.get('TasaAdicional')?.reset();
    if (this.asesoriaterminoForm.get('NumeroDocumento')?.value !== null
      && this.asesoriaterminoForm.get('NumeroDocumento')?.value !== undefined
      && this.asesoriaterminoForm.get('NumeroDocumento')?.value !== ''
      || this.asesoriaterminoForm.get('Nombre')?.value !== null
      && this.asesoriaterminoForm.get('Nombre')?.value !== undefined
      && this.asesoriaterminoForm.get('Nombre')?.value !== '') {

      if (this.asesoriaterminoForm.get('NumeroDocumento')?.value !== null && this.asesoriaterminoForm.get('NumeroDocumento')?.value !== undefined && this.asesoriaterminoForm.get('NumeroDocumento')?.value !== '')
        Documento = this.asesoriaterminoForm.get('NumeroDocumento')?.value;
      else if (this.asesoriaterminoForm.get('Nombre')?.value !== null && this.asesoriaterminoForm.get('Nombre')?.value !== undefined && this.asesoriaterminoForm.get('Nombre')?.value !== '')
        Nombre = this.asesoriaterminoForm.get('Nombre')?.value;

      this.loading = true;
      this.AsesoriaTerminoServices.BuscarAsociado(Documento, Nombre).subscribe(
        result => {
          this.loading = false;
          this.creacionFrom.reset();
          this.asesoriaterminoForm.get('Edad')?.reset();
          if (result.length === 0) {
            this.notif.warning('Advertencia', 'No se encontró el asociado.', ConfiguracionNotificacion.configRightTop);
            if(/^[a-zA-Z0-9]{3,15}$/.test(Documento)) {
              this.clientesGetListService.GetTipoDocumento().subscribe(
                result => {
                  this.ModalCreacionNombre.nativeElement.click();
                  this.tiposDeDocumento = result.filter((tipoD : any)=> tipoD.Clase !== 8);
                  if (/[a-z]/gi.test(Documento)) this.tiposDeDocumento = this.tiposDeDocumento.filter((tipoD : any) => tipoD.Clase === 9);
                  if (Documento.length < 10) this.tiposDeDocumento = this.tiposDeDocumento.filter((tipoD : any) => tipoD.Clase !== 3);
                });
              this.BloquearNuevoAsociadoForm = true;
              this.creacionFrom.reset();
              this.isCreationButtonDisabled = true;
              this.asesoriaterminoForm.get('Nombre')?.reset();
            }
          } else if (result.length === 1) {
            // this.BuscarAsociadoModal(result[0].NumeroDocumento);
            if ((this.asesoriaterminoForm.get('IdProducto')?.value === 302 && result[0].Edad < 75) || (this.asesoriaterminoForm.get('IdProducto')?.value !== 302 && result[0].Edad >= 75)  ) {
              this.cleanNegociacionData();
              this.asesoriaterminoForm.get('IdProducto')?.reset();
              this.asesoriaterminoForm.get('DescripcionProducto')?.reset();
            }
            this.asesoriaterminoForm.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
            this.asesoriaterminoForm.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' + result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
            this.asesoriaterminoForm.get('Clase')?.setValue(result[0].IdRelacionTipo);
            this.asesoriaterminoForm.get('Edad')?.setValue(result[0].Edad);
            this.asesoriaterminoForm.get('IdTipoDocumento')?.setValue(result[0].TipoDocumento);
            this.idObjetoSocial = result[0].IdObjetoSocial;
            this.MostrasAlertaAsociado = false;
            this.BloquearProducto = null;
            this.generalesService.Autofocus('SelectProducto');
          } else if (result.length > 1) {
            this.resultNombre = result;
            this.ModalNombre.nativeElement.click();
            this.BloquearProducto = null;
          } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
            if (result.Mensaje === 'Gerencia de desarrollo.') {
              swal.fire({
                title: '<strong>! Advertencia ¡</strong>',
                text: '',
                icon: 'error',
                animation: false,
                html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>' + result.Mensaje + '.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: 'rgb(160, 0, 87)'
              });
            } else if (result.Mensaje === 'Oficial de cumplimiento.') {
              swal.fire({
                title: '<strong>! Advertencia ¡</strong>',
                text: '',
                icon: 'error',
                animation: false,
                html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'+ result.Mensaje + '.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: 'rgb(160, 0, 87)'
              });
            } else {
              this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
              this.MapearDatosUsuario();
            }
            this.asesoriaterminoForm.get('NumeroDocumento')?.reset();
            this.asesoriaterminoForm.get('Nombre')?.reset();
            this.MapearDatosUsuario();
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
          console.log(errorMessage);
        }
      );
    }
  }
  BuscarAsociadoModal(Documento = '*') {
    let Nombre = '*';
    if (this.asesoriaterminoForm.get('NumeroDocumento')?.value !== null && this.asesoriaterminoForm.get('NumeroDocumento')?.value !== undefined && this.asesoriaterminoForm.get('NumeroDocumento')?.value !== '') {
      this.asesoriaterminoForm.get('Nombre')?.setValue('');
      Documento = this.asesoriaterminoForm.get('NumeroDocumento')?.value;
    } else if (this.asesoriaterminoForm.get('Nombre')?.value !== null && this.asesoriaterminoForm.get('Nombre')?.value !== undefined && this.asesoriaterminoForm.get('Nombre')?.value !== '') {
      Nombre = this.asesoriaterminoForm.get('Nombre')?.value;
    }
    this.loading = true;
    this.AsesoriaTerminoServices.BuscarAsociado(Documento, Nombre).subscribe(
      result => {
        console.log("personas",result)
        this.loading = false;
        this.dataObjet = undefined;
        if (result.length === 0) {
          this.notif.warning('Advertencia', 'No se encontró el asociado.', ConfiguracionNotificacion.configRightTop);
          this.asesoriaterminoForm.get('NumeroDocumento')?.reset();
          this.asesoriaterminoForm.get('Nombre')?.reset();
          this.btnGuardar = false;
        } else if (result.length === 1) {
          if ((this.asesoriaterminoForm.get('IdProducto')?.value === 302 && result[0].Edad < 75) || (this.asesoriaterminoForm.get('IdProducto')?.value !== 302 && result[0].Edad >= 75)  ) {
            this.cleanNegociacionData();
            this.asesoriaterminoForm.get('IdProducto')?.reset();
            this.asesoriaterminoForm.get('DescripcionProducto')?.reset();
          }
            this.asesoriaterminoForm.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
            this.asesoriaterminoForm.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' + result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
            this.asesoriaterminoForm.get('Clase')?.setValue(result[0].IdRelacionTipo);
            this.asesoriaterminoForm.get('Edad')?.setValue(result[0].Edad);
            this.asesoriaterminoForm.get('IdTipoDocumento')?.setValue(result[0].TipoDocumento);
          this.idObjetoSocial = result[0].IdObjetoSocial;
            this.MostrasAlertaAsociado = false;
        } else if (result.length > 1) {
          this.resultNombre = result;
          this.ModalNombre.nativeElement.click();
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          if (result.Mensaje === 'Persona Vetada') {
            swal.fire({
              title: 'Persona vetada',
              text: '',
              icon: 'error',
              confirmButtonColor: 'rgb(160,0,87)',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          } else {
            this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
          }
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(errorMessage);
      }
    );
  }

  capitalize(str: string) {
    if (!str) return str; 
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  GuardarNombre() {
    const requiredFieldNames = ['PrimerNombre', 'TelefonoAsesoria'];
    if (this.creacionFrom.get('TipoDocumento')?.value != 3) requiredFieldNames.push('PrimerApellido');
    const isSomeRequiredFieldMissing = requiredFieldNames.some(fieldName => !this.creacionFrom.get(fieldName)?.value || !(this.creacionFrom.get(fieldName)?.value + '').trim());
    if (isSomeRequiredFieldMissing) {
      this.notif.warning('Advertencia', 'Los campos con asterisco son obligatorios.', ConfiguracionNotificacion.configRightTop);
      return;
    }

    const primerNombre = this.creacionFrom.get('PrimerNombre')?.value || '';
    const segundoNombre = this.creacionFrom.get('SegundoNombre')?.value || '';
    const primerApellido = this.creacionFrom.get('PrimerApellido')?.value || '';
    const segundoApellido = this.creacionFrom.get('SegundoApellido')?.value || '';
    const fullName = [primerNombre, segundoNombre, primerApellido, segundoApellido].filter(Boolean).map(n => this.capitalize(n.trim()) ).join(' ');
    this.asesoriaterminoForm.get('Nombre')?.setValue(fullName);
    this.BloquearProducto = null;
    this.MostrasAlertaAsociado = false;
    this.CerrarCreacionNombre.nativeElement.click();
    this.asesoriaterminoForm.get('Clase')?.setValue(15);
    
  }

  CerrarNombre() {
    this.creacionFrom.reset();
    this.isCreationButtonDisabled = true;
    this.BloquearNuevoAsociadoForm = true;
    this.asesoriaterminoForm.get('Nombre')?.reset();
    this.asesoriaterminoForm.get('NumeroDocumento')?.reset();
  }
  
  BuscarAsesor() {
    let IdAsesor = '*';
    let NombreAsesor = '*';
    if (this.asesoriaterminoForm.get('IdAsesor')?.value !== null
      && this.asesoriaterminoForm.get('IdAsesor')?.value !== undefined
      && this.asesoriaterminoForm.get('IdAsesor')?.value !== '') {
      this.asesoriaterminoForm.get('NombreAsesor')?.setValue('');
      IdAsesor = this.asesoriaterminoForm.get('IdAsesor')?.value;
    } else if (this.asesoriaterminoForm.get('NombreAsesor')?.value !== null
      && this.asesoriaterminoForm.get('NombreAsesor')?.value !== undefined
      && this.asesoriaterminoForm.get('NombreAsesor')?.value !== '') {
      NombreAsesor = this.asesoriaterminoForm.get('NombreAsesor')?.value;
    }

    if (IdAsesor === '*' && NombreAsesor === '*') {
      this.notif.warning('Alerta', 'Debe ingresar el documento o el nombre del asesor.', ConfiguracionNotificacion.configRightTop);
    } else {
      this.loading = true;
      this.AsesoriaTerminoServices.BuscarAsesor(IdAsesor, NombreAsesor).subscribe(
        result => {
          this.loading = false;
          if (result.length === 1) {
            this.MapearDatosAsesor(result);
          } else if (result.length > 1) {
            this.resultAsesor = result;
            this.ModalAsesores.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.warning('Alerta', 'No se encontró al asesor.', ConfiguracionNotificacion.configRightTop);
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  MapearDatosAsesor(datos : any) {
    if (datos.length >= 1) {
      this.asesoriaterminoForm.get('IdAsesor')?.setValue(datos[0].IdAsesor);
      this.asesoriaterminoForm.get('NombreAsesor')?.setValue(datos[0].Nombre);
    } else {
      this.asesoriaterminoForm.get('IdAsesor')?.setValue(datos.IdAsesor);
      this.asesoriaterminoForm.get('NombreAsesor')?.setValue(datos.Nombre);
    }
  }
  BuscarAsesorExternoCodigo(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    const target = event.target as HTMLElement;
    const asesorExternoCode = this.asesoriaterminoForm.get('strCodigo')?.value;
    const asesorExternoNombre = this.asesoriaterminoForm.get('strNombre')?.value;
    if (
      relatedTarget === null
      || (relatedTarget && relatedTarget.tagName !== 'BUTTON')
      && (asesorExternoCode || (asesorExternoNombre && asesorExternoNombre.trim()))
    ) {

      const searchData = { strCodigo: asesorExternoCode, strNombre: asesorExternoNombre };
      if (target.id === 'SelectAsesorExterno') searchData.strNombre = ''; //Esto es para que cuando se haga el blur en el codigo, busque por codigo y no por nombre.

      this.loading = true;
      this.AsesoriaTerminoServices.BuscarAsesorExterno(searchData).subscribe(
        result => {
          this.loading = false;
          if (result.length === 1) {
            this.AsesorFrom.get('strCodigo')?.setValue(result[0].intIdAsesor);
            this.AsesorFrom.get('strNombre')?.setValue(result[0].Nombre);
          } else if (result.length > 1) {
            this.resultAsesoresExterno = result;
            // this.ModalAsesoresExterno.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.warning('Advertencia', 'No se encontró al asesor externo.', ConfiguracionNotificacion.configRightTop);
            this.AsesorFrom.get('strCodigo')?.reset();
            this.AsesorFrom.get('strNombre')?.reset();
          }
          if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '19') {
            this.BloquearbtnActalizar = true;
          } else if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '43') {
            this.BloquearbtnGuardar = false;
          }
        },
        error => {
          this.loading = false;
          this.notif.warning('Advertencia', 'El valor ingresado no tiene el formato correcto',ConfiguracionNotificacion.configRightTopNoClose);
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }

  }
  MapearDatosAsesorExterno(datos : any) {
    this.asesoriaterminoForm.get('strCodigo')?.setValue(datos.intIdAsesor);
    this.asesoriaterminoForm.get('strNombre')?.setValue(datos.Nombre);
    this.BloquearbtnActalizar = true;
  }
  BuscarAsesorExternoTodos() {
    this.AsesorFrom.get('strNombre')?.setValue(this.AsesorFrom.get('strNombre')?.value ? this.AsesorFrom.get('strNombre')?.value.trim() : '');

    this.AsesoriaTerminoServices.BuscarAsesorExterno(this.AsesorFrom.value).subscribe(
      result => {
        if (result.length > 1) {
          this.resultAsesoresExterno = result;
          console.log(this.ModalAsesores.nativeElement);
          this.ModalAsesoresExterno.nativeElement.click();

          if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '19') {
          } else if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '43') {
            this.btnGuardar = false;
          }
        } else {
          if (result.length !== 0) {
            this.AsesorFrom.get('strNombre')?.reset();
            this.AsesorFrom.get('strCodigo')?.reset();
            result.forEach((elementt : any) => {
              this.AsesorFrom.get('strNombre')?.setValue(elementt.Nombre);
              this.AsesorFrom.get('strCodigo')?.setValue(elementt.intIdAsesor);
            });
            this.BloquearbtnActalizar = true;
          } else {
            this.AsesorFrom.get('strNombre')?.setValue('');
            this.AsesorFrom.get('strCodigo')?.setValue('');
            this.notif.warning('Advertencia', 'No se encontró el asesor externo.', ConfiguracionNotificacion.configRightTop);
          }
        }
      },
      error => {
        this.notif.warning('Advertencia', 'El valor ingresado no tiene el formato correcto',
          ConfiguracionNotificacion.configRightTopNoClose);
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  Producto() {
    if(this.asesoriaterminoForm.get('IdProducto')?.value && ('' + this.asesoriaterminoForm.get('IdProducto')?.value).trim()) this.CondicionesProducto();
  }

  CondicionesProducto() {
    this.asesoriaterminoForm.get('IdRelacionTipo')?.setValue(5);
    this.AsesoriaTerminoServices.CondicionesProducto(this.asesoriaterminoForm.value).subscribe(
      result => {
        if (result !== null) {
          this.ArrayCondiciones = result;
          console.log("condiciones de p",this.ArrayCondiciones )
          this.asesoriaterminoForm.get('NombreModalidad')?.setValue(result.NombreModalidad);
          this.BuscarProducto();
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
          this.asesoriaterminoForm.get('IdProducto')?.reset();
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  cleanNegociacionData() {
    this.asesoriaterminoForm.get('Plazo')?.reset();
    this.asesoriaterminoForm.get('ValorTotal')?.reset();
    this.asesoriaterminoForm.get('TasaNominal')?.reset();
    this.asesoriaterminoForm.get('TasaEfectiva')?.reset();
    this.asesoriaterminoForm.get('IdFrecuenciaPago')?.reset()
    this.asesoriaterminoForm.get('DescripcionFrecuenciaPago')?.reset();
    this.AdicionarPuntosFrom.reset();
    this.cleanIntereses();
    this.BloquearbtnActalizar = false;
    this.BloquearCalcularIntereces = false;

  }

  cleanIntereses() {
    this.asesoriaterminoForm.get('Retencion')?.reset();
    this.asesoriaterminoForm.get('TotalRetencion')?.reset();
    this.asesoriaterminoForm.get('InteresNeto')?.reset();
    this.asesoriaterminoForm.get('TotalInteres')?.reset();
    this.asesoriaterminoForm.get('InteresBruto')?.reset();
    this.asesoriaterminoForm.get('TotalInteresBruto')?.reset();
    this.asesoriaterminoForm.get('Aportes')?.reset();
    this.asesoriaterminoForm.get('TotalAportes')?.reset();
    this.asesoriaterminoForm.get('TotalInteresNeto')?.reset();
  }

  BuscarProducto() {
    if (this.ArrayCondiciones !== undefined) {
      let IdProducto = '*';
      let Descripcion = '*';
      if (this.asesoriaterminoForm.get('IdProducto')?.value !== null
        && this.asesoriaterminoForm.get('IdProducto')?.value !== undefined
        && this.asesoriaterminoForm.get('IdProducto')?.value !== '') {
        this.asesoriaterminoForm.get('DescripcionProducto')?.setValue('');
        IdProducto = this.asesoriaterminoForm.get('IdProducto')?.value;
      } else if (this.asesoriaterminoForm.get('DescripcionProducto')?.value !== null
        && this.asesoriaterminoForm.get('DescripcionProducto')?.value !== undefined
        && this.asesoriaterminoForm.get('DescripcionProducto')?.value !== '') {
        Descripcion = this.asesoriaterminoForm.get('DescripcionProducto')?.value;
      }
      this.loading = true;
      console.log(IdProducto,Descripcion)
      this.AsesoriaTerminoServices.BuscarProducto(IdProducto, Descripcion).subscribe(
        result => {
          this.loading = false;
          this.BloquearPuntosA = false;
          if (result.length === 0) {
            this.notif.warning('Alerta', 'No se encontró el producto.', ConfiguracionNotificacion.configRightTop);
            this.asesoriaterminoForm.get('IdProducto')?.reset();
          } else if (result.length === 1) {
            const producto = result[0].IdProducto;
            const edad = this.asesoriaterminoForm.get('Edad')?.value;
            const idTipoDocumento = this.creacionFrom.get('TipoDocumento')?.value;
            if (producto === 302) {
              if (this.asesoriaterminoForm.get('IdTipoDocumento')?.value === 3 || idTipoDocumento == '3') {
                 this.asesoriaterminoForm.get('IdProducto')?.setValue("");
                 this.asesoriaterminoForm.get('DescripcionProducto')?.setValue("");
                 this.notif.warning('Advertencia', 'Producto no valido para un asociado jurídico.', ConfiguracionNotificacion.configRightTop);
                 return;
               }
               
               if (edad >= 75 || (idTipoDocumento && idTipoDocumento != '3' && idTipoDocumento != '4' && idTipoDocumento != '7')) {
                 this.asesoriaterminoForm.get('IdProducto')?.setValue(producto);
                 this.asesoriaterminoForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
                 this.MostrasAlertaProducto = false;
               } else {
                 this.notif.warning('Advertencia', 'Edad del asociado no valida para este producto.', ConfiguracionNotificacion.configRightTop);
                 this.asesoriaterminoForm.get('IdProducto')?.reset();
                 this.asesoriaterminoForm.get('DescripcionProducto')?.reset();
                 return;
               }
             }
            const fechaHoy = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaVigencia = new DatePipe('en-CO').transform(this.ArrayCondiciones.FechaVigencia, 'yyyy/MM/dd');
            if (fechaHoy != null && fechaVigencia != null && fechaHoy <= fechaVigencia) {

              if (edad >= 75 && producto !== 302) {
                this.notif.warning('Advertencia', 'Edad del asociado no valida para este producto.', ConfiguracionNotificacion.configRightTop);
                this.asesoriaterminoForm.get('IdProducto')?.reset();
                this.asesoriaterminoForm.get('DescripcionProducto')?.reset();
                return;
              }

              this.asesoriaterminoForm.get('IdProducto')?.setValue(producto);
              this.asesoriaterminoForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
              if (this.asesoriaterminoForm.get('IdProducto')?.value === 307) {
                this.BloquearNegociacion = null;
                this.BloquearPuntosA = null;
              } else {
                this.MostrasAlertaProducto = false;
                this.BloquearNegociacion = null;
                this.BloquearPuntosA = null;
              }
              
              if (this.asesoriaterminoForm.get('IdProducto')?.value != this.productoAnterior) {
                this.cleanNegociacionData();
              }
            } else {
              this.notif.warning('Alerta', 'El producto no está vigente.', ConfiguracionNotificacion.configRightTop);
              this.asesoriaterminoForm.get('IdProducto')?.reset();
              this.asesoriaterminoForm.get('DescripcionProducto')?.reset();
              this.BloquearPuntosA = false;
              this.limpiarVigente();
            }
          } else if (result.length > 1) {
            this.resultProducto = result;
            this.ModalTermino.nativeElement.click();
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  MapearDatosProductos(datos : any) {
    this.ArrayCondiciones = undefined;
    this.asesoriaterminoForm.get('IdProducto')?.setValue(datos.IdProducto);
    this.asesoriaterminoForm.get('DescripcionProducto')?.setValue(datos.DescripcionProducto);
    this.MostrasAlertaProducto = false;
    this.CondicionesProducto();
  }
  limpiarVigente() {
    this.asesoriaterminoForm.get('InteresBruto')?.reset();
    this.asesoriaterminoForm.get('Retencion')?.reset();
    this.asesoriaterminoForm.get('TotalInteres')?.reset();
    this.asesoriaterminoForm.get('Plazo')?.reset();
    this.asesoriaterminoForm.get('ValorTotal')?.reset();
    this.asesoriaterminoForm.get('TasaEfectiva')?.reset();
    this.asesoriaterminoForm.get('TasaNominal')?.reset();
  }
  MapearDatosUsuario() {
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    this.asesoriaterminoForm.get('NombreOficina')?.setValue(this.dataUser.Oficina);
    this.asesoriaterminoForm.get('NumeroOficina')?.setValue(this.dataUser.NumeroOficina);
    this.asesoriaterminoForm.get('IdAsesor')?.setValue(this.dataUser.IdAsesor);
    this.asesoriaterminoForm.get('NombreAsesor')?.setValue(this.dataUser.Nombre);
  }
  ValidarPlazo() {
    if (this.asesoriaterminoForm.get('Plazo')?.value === this.logDataOnEditAsesoria.PlazoAnterior) return;

    this.asesoriaterminoForm.get('IdFrecuenciaPago')?.reset();
    this.asesoriaterminoForm.get('DescripcionFrecuenciaPago')?.reset();
    if (this.asesoriaterminoOperacionFrom.get('Codigo')?.value === '1') {
      this.asesoriaterminoForm.get('IdRelacionTipo')?.setValue(5);
      this.AsesoriaTerminoServices.CondicionesProducto(this.asesoriaterminoForm.value).subscribe(
        result => {
          if (result !== null) {

            this.ArrayCondiciones = result;
            console.log( "Validar plazo ",this.ArrayCondiciones)
            if (this.asesoriaterminoForm.get('Plazo')?.value !== undefined && this.asesoriaterminoForm.get('Plazo')?.value !== null) {
              if (JSON.parse(this.asesoriaterminoForm.get('Plazo')?.value) >= this.ArrayCondiciones.PlazoMinimo && JSON.parse(this.asesoriaterminoForm.get('Plazo')?.value) <= this.ArrayCondiciones.PlazoMaximo) {
                this.asesoriaterminoForm.get('TasaEfectiva')?.reset();
                this.asesoriaterminoForm.get('TasaNominal')?.reset();
                //  LOS DEMAS CAMPOS
                this.ObtenerFrecuenciaPago(this.asesoriaterminoForm.get('Plazo')?.value);

              } else {
                this.asesoriaterminoForm.get('Plazo')?.reset();
                this.notif.warning('Advertencia', 'El plazo ingresado no es permitido para este producto.',ConfiguracionNotificacion.configRightTop);
              }
            }

          } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
            this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
            this.asesoriaterminoForm.get('IdProducto')?.reset();
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    } else {
      if (this.asesoriaterminoForm.get('Plazo')?.value) {
        this.ObtenerFrecuenciaPago(this.asesoriaterminoForm.get('Plazo')?.value);
        if (JSON.parse(this.asesoriaterminoForm.get('Plazo')?.value) >= this.ArrayCondiciones.PlazoMinimo
          && JSON.parse(this.asesoriaterminoForm.get('Plazo')?.value) <= this.ArrayCondiciones.PlazoMaximo) {
        } else {
          this.notif.warning('Advertencia', 'El plazo ingresado no es permitido para este producto.', ConfiguracionNotificacion.configRightTop);
          this.asesoriaterminoForm.get('ValorTotal')?.reset();
          this.asesoriaterminoForm.get('Plazo')?.reset();
        }
      }
    }
  }
  ValidarValor() {
    if (this.asesoriaterminoForm.get('Plazo')?.value !== undefined
      && this.asesoriaterminoForm.get('Plazo')?.value !== null
      && this.asesoriaterminoForm.get('Plazo')?.value !== 0) {

      const valorTitulo = this.asesoriaterminoForm.get('ValorTotal')?.value;
      if (valorTitulo && valorTitulo < this.ArrayCondiciones.sngMontoApe) {
        this.notif.warning('Advertencia', 'El valor total tiene un monto no permitido para este producto.',ConfiguracionNotificacion.configRightTop);
        this.asesoriaterminoForm.get('ValorTotal')?.reset();
      }

    }
  }
  ValidarValorCampo(campoJquery : string, campoAngular : string) {
    const lentghCampo = $('#' + campoJquery + '').val();
    if (lentghCampo > 0) {
      if ($('#' + campoJquery + '').val() === '') {
        this.notif.warning('Advertencia', 'El campo no puede contener espacios.', ConfiguracionNotificacion.Cerrar);
        this.asesoriaterminoForm.get('' + campoAngular + '')?.reset();
      }
    }
  }
  ValidarCampoProducto() {
    if (this.asesoriaterminoForm.get('DescripcionProducto')?.value !== ''
      && this.asesoriaterminoForm.get('DescripcionProducto')?.value !== null
      && this.asesoriaterminoForm.get('DescripcionProducto')?.value !== undefined) {
      this.MostrasAlertaProducto = false;
    } else {
      this.MostrasAlertaProducto = true;
    }
  }
  Limpiar() {
    this.asesoriaterminoForm.reset();
    this.dataHistorial = [];
    this.operacionEscogida = "";
    this.AsesorFrom.reset();
    this.AdicionarPuntosFrom.reset();
    this.BloquearPuntosA = false;
    this.BloquearCalcularIntereces = false;
    this.showBtnCalcularIntereses = false;
    this.asesoriaterminoOperacionFrom.reset();
    $('#select').focus().select();
    this.dataObjet = undefined;
    this.Bloquear = false;
    this.BloquearBuscar = false;
    this.BloquearNombre = false;
    this.BloquearProducto = false;
    this.BloquearAsesorExterno = false;
    this.BloquearNegociacion = false;
    this.MostrasAlertaAsociado = false;
    this.MostrasAlertaProducto = false;
    this.btnGuardar = true;
    this.disableBtnGuardar = false;
    this.btnActualizar = true;
    this.devolverTab(1);
    this.tab1.nativeElement.click();
    $('#negociacion').addClass('activar');
    $('#negociacion').addClass('active');
    $('#historial').removeClass('activar');
    $('#historial').removeClass('active');
  }
  private returnFormatNum(num : string): string {
    if (num == null)
      return "0.0000";
    num = num.toString();
    num = num.slice(0, (num.indexOf('.')) + 5);
    return num;
  }
  LimpiarCampos(Datos : any) {
    if (Datos === 'IdProducto') {
      this.asesoriaterminoForm.get('DescripcionProducto')?.reset();
    } else if (Datos === 'DescripcionProducto') {
      this.asesoriaterminoForm.get('IdProducto')?.reset();
    } else if (Datos === 'IdAsesor') {
      this.asesoriaterminoForm.get('NombreAsesor')?.reset();
    } else if (Datos === 'NombreAsesor') {
      this.asesoriaterminoForm.get('IdAsesor')?.reset();
    } else if (Datos === 'BuscarDocumento') {
      this.asesoriaterminoForm.get("NumeroAsesoria")?.reset();
      this.asesoriaterminoForm.get('BuscarNombre')?.reset();
    } else if (Datos === 'BuscarNombre') {
      this.asesoriaterminoForm.get("NumeroAsesoria")?.reset();
      this.asesoriaterminoForm.get('BuscarDocumento')?.reset();
    } else if (Datos === 'NumeroAsesoria') {
      this.asesoriaterminoForm.get("BuscarNombre")?.reset();
      this.asesoriaterminoForm.get('BuscarDocumento')?.reset();
    }
  }
  ClearForm() {
    this.asesoriaterminoForm.controls["IdFrecuenciaPago"].reset();
    this.asesoriaterminoForm.reset();
    this.AsesorFrom.reset();
    this.dataObjet = undefined;
    this.dataHistorial = [];

    this.operacionEscogida = "";
    this.Bloquear = false;
    this.BloquearBuscar = false;
    this.BloquearNombre = false;
    this.BloquearProducto = false;
    this.BloquearAsesorExterno = false;
    this.BloquearNegociacion = false;
    this.MostrasAlertaAsociado = false;
    this.MostrasAlertaProducto = false;
    this.devolverTab(1);
    this.tab1.nativeElement.click();
    $('#negociacion').addClass('activar');
    $('#negociacion').addClass('active');
    $('#historial').removeClass('activar');
    $('#historial').removeClass('active');
  }
  devolverTab(tab : number) {
    switch (tab) {
      case 1:
        this.activaNegociacion = true;
        this.activaHistorial = false;
        break;
    }
  }
  VolverAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }
  VolverArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
  ValidateForm() {
    const Codigo = new FormControl('', [Validators.required]);
    const strCodigo = new FormControl('', [Validators.pattern('[0-9]*')]);
    const strNombre = new FormControl('', []);
    const strTipo = new FormControl('', []);
    const NumeroAsesoria = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdProducto = new FormControl('', [Validators.pattern('[0-9]*')]);
    const DescripcionProducto = new FormControl('', [Validators.required]);
    const IdRelacionTipo = new FormControl('', []);
    const Clase = new FormControl('', [Validators.required]);
    const Plazo = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const ValorTotal = new FormControl('', [Validators.required]);
    const TasaNominal = new FormControl('', [Validators.required]);
    const TasaEfectiva = new FormControl('', [Validators.required]);
    const TasaAdicional = new FormControl('', []);
    const NombreOficina = new FormControl('', [Validators.required]);
    const NumeroOficina = new FormControl('', [Validators.required]);
    const IdAsesor = new FormControl('', [Validators.required]);
    const NombreAsesor = new FormControl('', [Validators.required]);
    const IdFrecuenciaPago = new FormControl('', [Validators.required]);
    const DescripcionFrecuenciaPago = new FormControl('', [Validators.required]);
    const BuscarDocumento = new FormControl('', [Validators.pattern('[0-9]*')]);
    const BuscarNombre = new FormControl('', []);
    const Nombre = new FormControl('', [Validators.required]);
    const NumeroDocumento = new FormControl('', [Validators.required, Validators.pattern('[0-9a-zA-Z]{3,15}')]);
    const InteresPeriodo = new FormControl('', []);
    const Retencion = new FormControl('', []);
    const TotalRetencion = new FormControl('', []);
    const GMFRetencion = new FormControl('', []);
    const TotalInteresPlazo= new FormControl('', []);
    const FechaVencimiento = new FormControl('', []);
    const FechaCreacion = new FormControl('', []);
    const IdAsesorExterno = new FormControl('', []);
    const PrimerNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const SegundoNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const PrimerApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const SegundoApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const TelefonoAsesoria = new FormControl('', [Validators.pattern('[0-9]{10}')]);
    const TipoDocumento = new FormControl('', []);
    const NombreModalidad = new FormControl('', []);
    const AdicionarPunto = new FormControl('', []);
    const AdicionarP = new FormControl('', []);
    const AdicionarPuntoDescripcion  = new FormControl('', []);
    const InteresBruto = new FormControl('', []);
    const TotalInteresBruto = new FormControl('', []);
    const Aportes = new FormControl('', []);
    const TotalAportes = new FormControl('', []);
    const InteresNeto = new FormControl('', []);
    const TotalInteresNeto = new FormControl('', []);
    const Variable = new FormControl(0, []);
    const TotalInteres = new FormControl(0, []);
    const Edad =  new FormControl(0, []);
    const IdTipoDocumento =  new FormControl(0, []);
    this.asesoriaterminoForm = new FormGroup({
      Edad: Edad,
      IdTipoDocumento : IdTipoDocumento,
      NumeroAsesoria: NumeroAsesoria,
      IdProducto: IdProducto,
      DescripcionProducto: DescripcionProducto,
      IdRelacionTipo : IdRelacionTipo,
      Clase: Clase,
      AdicionarP : AdicionarP,
      Plazo: Plazo,
      ValorTotal: ValorTotal,
      TasaNominal: TasaNominal,
      TasaEfectiva: TasaEfectiva,
      TasaAdicional: TasaAdicional,
      NombreOficina: NombreOficina,
      NumeroOficina: NumeroOficina,
      IdAsesor: IdAsesor,
      NombreAsesor: NombreAsesor,
      strCodigo: strCodigo,
      strNombre: strNombre,
      IdFrecuenciaPago: IdFrecuenciaPago,
      DescripcionFrecuenciaPago: DescripcionFrecuenciaPago,
      BuscarDocumento: BuscarDocumento,
      BuscarNombre: BuscarNombre,
      Nombre: Nombre,
      NumeroDocumento: NumeroDocumento,
      InteresPeriodo: InteresPeriodo,
      Retencion: Retencion,
      TotalRetencion: TotalRetencion,
      GMFRetencion: GMFRetencion,
      TotalInteresPlazo: TotalInteresPlazo,
      FechaVencimiento: FechaVencimiento,
      FechaCreacion: FechaCreacion,
      IdAsesorExterno: IdAsesorExterno,
      PrimerNombre: PrimerNombre,
      SegundoNombre: SegundoNombre,
      PrimerApellido: PrimerApellido,
      SegundoApellido: SegundoApellido,
      TelefonoAsesoria: TelefonoAsesoria,
      NombreModalidad: NombreModalidad,
      InteresBruto: InteresBruto,
      TotalInteresBruto: TotalInteresBruto,
      Aportes: Aportes,
      TotalAportes: TotalAportes,
      InteresNeto: InteresNeto,
      TotalInteresNeto: TotalInteresNeto,
      Variable: Variable,
      TotalInteres : TotalInteres
    });
    this.asesoriaterminoOperacionFrom = new FormGroup({
      Codigo: Codigo,
    });
    this.AsesorFrom = new FormGroup({
      strCodigo: strCodigo,
      strNombre: strNombre,
      strTipo: strTipo
    });
    this.creacionFrom = new FormGroup({
      PrimerNombre: PrimerNombre,
      SegundoNombre: SegundoNombre,
      PrimerApellido: PrimerApellido,
      SegundoApellido: SegundoApellido,
      TelefonoAsesoria: TelefonoAsesoria,
      TipoDocumento: TipoDocumento
    });

    this.AdicionarPuntosFrom = new FormGroup({
      AdicionarPunto: AdicionarPunto,
      AdicionarPuntoDescripcion : AdicionarPuntoDescripcion
    });

  }
}
