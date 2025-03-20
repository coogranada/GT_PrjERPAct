import { Component, OnInit, ElementRef, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { AsesoriaContractualService } from '../../../../../Services/Productos/asesoriaContractual.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe, formatDate } from '@angular/common';
import swal from 'sweetalert2';
import { AlertService } from '../../../../../Services/Alert/alert.service';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
import { LogDataOnEditAsesorExterno, LogDataOnEditAsesoria } from '../../../../../Models/Productos/asesoria-contractual.model';
declare var $: any;
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-asesoria-contractual',
  templateUrl: './asesoria-contractual.component.html',
  styleUrls: ['./asesoria-contractual.component.css'],
  providers: [ModuleValidationService, AsesoriaContractualService, OperacionesService, GeneralesService],
  standalone : false
})
export class AsesoriaContractualComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('ModalContractual', { static: true }) private ModalContractual!: ElementRef;
  @ViewChild('ModalAsesores', { static: true }) private ModalAsesores!: ElementRef;
  @ViewChild('ModalAsesoresExterno', { static: true }) private ModalAsesoresExterno!: ElementRef;
  @ViewChild('ModalAsesoria', { static: true }) private ModalAsesoria!: ElementRef;
  @ViewChild('ModalCreacionNombre', { static: true }) private ModalCreacionNombre!: ElementRef;
  @ViewChild('ModalNombre', { static: true }) private ModalNombre!: ElementRef;
  @ViewChild('CerrarCreacionNombre', { static: true }) private CerrarCreacionNombre!: ElementRef;
  @ViewChild('ModalImpresionAsesoria', { static: true }) private ModalImpresionAsesoria!: ElementRef;
  @ViewChild('tab1', { static: true }) private tab1!: ElementRef;

  private emitEventContractual: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  public asesoriacontractualFrom!: FormGroup;
  public asesoriacontractualOperacionFrom!: FormGroup;
  public AsesorFrom!: FormGroup;
  public creacionFrom!: FormGroup;

  public resultOperaciones : any[] = [];
  public resultProducto : any[] = [];
  public resultRelacion : any[] = [];
  public resultAsesor : any[] = [];
  public resultAsesoresExterno : any[] = [];
  public resultPeriodo : any[] = [];
  public resultAsesoria : any;
  public resultNombre : any;

  public Bloquear : boolean | null = false;
  public BloquearValorTotal : boolean | null = false;
  public BloquearBuscar : boolean | null = false;
  public BloquearNombre : boolean | null = false;
  public BloquearProducto : boolean | null = false;
  public BloquearAsesorExterno : boolean | null = false;
  public BloquearPeriodo : boolean | null = false;
  public BloquearNegociacion : boolean | null = false;
  public BloquearCuotaMes : boolean | null = false;

  public datoAsesorExterno : any;
  public datoRelacion : any;
  public datoProducto : any;
  public datoPlazo : any;
  public datoCuotaMes : any;

  BloquearbtnActalizar : boolean | null = false;
  BloquearbtnGuardar = false;
  btnActualizar = true;
  btnGuardar = true;
  activaNegociacion = false;
  activaHistorial = false;
  obligatorio = false;

  dataUser : any;
  operacionEscogida : string | undefined = '';
  dataHistorial: any[] = [];
  ArrayCondiciones: any;
  dataObjet: any;
  MostrasAlertaProducto = false;
  MostrasAlertaAsociado = false;

  public items = {
    Oficina: {},
    Nombre: {},
    Documento: {},
    NombreProducto: {},
    Producto: {},
    Plazo: {},
    Periodo: {},
    TasaNominal: {},
    TasaEfectiva: {},
    ValorInteres: {},
    ValorTotal: {},
    Modalidad: {},
    Asesor: {},
    Cuota: {},
  };

  private CodModulo = 60;
  public Modulo = this.CodModulo;
  constructor(
    private clientesGetListService: ClientesGetListService,
    private AsesoriaContractualServices: AsesoriaContractualService,
    private notif: AlertService,
    private operacionesService: OperacionesService,
    private generalesService: GeneralesService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  tiposDeDocumento: any;
  isCreationButtonDisabled: boolean = true;
  BloquearNuevoAsociadoForm = true;
  private logDataOnEditAsesoria: LogDataOnEditAsesoria = {};
  private logDataOnEditAsesorExterno: LogDataOnEditAsesorExterno = {};


  ngOnInit() {
    this.NombresCapitaliceBasico();
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ValidateForm();
    this.Operaciones();
    this.Periodo();
    this.ObtenerRelacion();
    this.VolverArriba();
    $('#select').focus().select();
    $('#negociacion').addClass('activar');
    $('#negociacion').addClass('active');
  }
  ngAfterViewInit() {
  }


  onChangeTipoDocumento() {
    this.creacionFrom.get('PrimerNombre')?.enable();
    this.creacionFrom.get('SegundoNombre')?.enable();
    this.creacionFrom.get('PrimerApellido')?.enable();
    this.creacionFrom.get('SegundoApellido')?.enable();
    this.creacionFrom.get('TelefonoAsesoria')?.enable();
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

  onChangeAsociado() {
    this.creacionFrom.get('TipoDocumento')?.reset();
  }

  Operaciones() {
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
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
        this.emitEventContractual.emit(true);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ValorSeleccionado() {
    if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '2') {          // Buscar
      this.generalesService.Autofocus('BuscarAsesoria');
      this.ClearForm();
      this.Bloquear = false;
      this.BloquearValorTotal = false;
      this.BloquearBuscar = null;
      this.BloquearNombre = false;
      this.BloquearProducto = false;
      this.BloquearAsesorExterno = false;
      this.BloquearPeriodo = false;
      this.BloquearNegociacion = false;
      this.BloquearCuotaMes = false;
      this.btnActualizar = true;
      this.MostrasAlertaAsociado = false;
      this.btnGuardar = true;
      this.operacionEscogida = '/Buscar';
      this.devolverTab(1);
      this.tab1.nativeElement.click();
      $('#negociacion').addClass('activar');
      $('#negociacion').addClass('active');
      $('#historial').removeClass('activar');
      $('#historial').removeClass('active');

    } else if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '43') {  // Nueva asesoria
      this.generalesService.Autofocus('SelectNombre');
      this.ClearForm();
      this.MapearDatosUsuario();
      this.Bloquear = false;
      this.BloquearValorTotal = false;
      this.BloquearBuscar = false;
      this.BloquearNombre = null;
      this.BloquearProducto = false;
      this.BloquearAsesorExterno = null;
      this.BloquearPeriodo = false;
      this.BloquearNegociacion = false;
      this.BloquearCuotaMes = false;
      this.MostrasAlertaAsociado = false;
      this.btnActualizar = true;
      this.btnGuardar = false;
      this.asesoriacontractualFrom.get('IdPeriodo')?.setValue(30);
      this.operacionEscogida = '/Nueva asesoría';
      this.devolverTab(1);
      this.tab1.nativeElement.click();
      $('#negociacion').addClass('activar');
      $('#negociacion').addClass('active');
      $('#historial').removeClass('activar');
      $('#historial').removeClass('active');

    } else if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '1') {  // Editar
      if (this.asesoriacontractualFrom.get('NumeroAsesoria')?.value) {
        // this.generalesService.Autofocus('SelectProducto');
        this.VolverAbajo();
        if (this.asesoriacontractualFrom.get('IdProducto')?.value === 207) {
          this.BloquearNegociacion = null;
          this.BloquearCuotaMes = false;
          this.BloquearValorTotal = null;
        } else {
          this.BloquearNegociacion = null;
          this.BloquearCuotaMes = null;
          this.BloquearValorTotal = false;
        }
        this.logDataOnEditAsesoria.ProductoAnterior = this.asesoriacontractualFrom.get('DescripcionProducto')?.value;
        this.logDataOnEditAsesoria.PlazoAnterior = this.asesoriacontractualFrom.get('Plazo')?.value;
        this.logDataOnEditAsesoria.CuotaAnterior = this.asesoriacontractualFrom.get('CuotaMes')?.value;
        this.logDataOnEditAsesoria.ValorTotalAnterior = this.asesoriacontractualFrom.get('ValorPlan')?.value;
        this.logDataOnEditAsesoria.TasaEfectivaAnterior = this.asesoriacontractualFrom.get('TasaEfectiva')?.value;
        this.logDataOnEditAsesoria.TasaNominalAnterior = this.asesoriacontractualFrom.get('TasaNominal')?.value;
        this.logDataOnEditAsesoria.InteresBrutoAnterior = this.asesoriacontractualFrom.get('InteresBruto')?.value;
        this.logDataOnEditAsesoria.RetencionAnterior = this.asesoriacontractualFrom.get('Retencion')?.value;
        this.logDataOnEditAsesoria.TotalInteresesAnterior = this.asesoriacontractualFrom.get('TotalInteres')?.value;
        this.logDataOnEditAsesoria.FechaVencimientoAnterior = this.asesoriacontractualFrom.get('FechaVencimiento')?.value;
        this.Bloquear = false;
        this.BloquearBuscar = false;
        this.BloquearNombre = false;
        this.BloquearProducto = null;
        this.BloquearAsesorExterno = false;
        this.BloquearPeriodo = false;
        this.MostrasAlertaAsociado = false;
        this.btnActualizar = false;
        this.btnGuardar = true;
        this.operacionEscogida = '/Editar';
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        $('#negociacion').addClass('activar');
        $('#negociacion').addClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una asesoría para realizar esta operación.');
        this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '13') { // Reimprimir
      if (this.asesoriacontractualFrom.get('NumeroAsesoria')?.value) {
        this.operacionEscogida = '/Reimprimir';
        this.Bloquear = false;
        this.BloquearValorTotal = false;
        this.BloquearBuscar = false;
        this.BloquearNombre = false;
        this.BloquearProducto = false;
        this.BloquearAsesorExterno = false;
        this.BloquearPeriodo = false;
        this.BloquearNegociacion = false;
        this.BloquearCuotaMes = false;
        this.MostrasAlertaAsociado = false;
        this.btnActualizar = true;
        this.btnGuardar = true;
        this.ModalImpresionAsesoria.nativeElement.click();
        this.GuardarlogAsesoria('', 13);
        this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una asesoría para realizar esta operación.');
        this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '19') { // Cambiar asesor externo
      if (this.asesoriacontractualFrom.get('NumeroAsesoria')?.value) {
        this.generalesService.Autofocus('SelectAsesorExterno');
        this.Bloquear = false;
        this.BloquearValorTotal = false;
        this.BloquearBuscar = false;
        this.BloquearNombre = false;
        this.BloquearProducto = false;
        this.BloquearAsesorExterno = null;
        this.BloquearPeriodo = false;
        this.BloquearNegociacion = false;
        this.BloquearCuotaMes = false;
        this.btnActualizar = false;
        this.BloquearbtnActalizar = false;
        this.MostrasAlertaAsociado = false;
        this.btnGuardar = true;
        this.operacionEscogida = '/ Cambiar asesor externo';
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        $('#negociacion').addClass('activar');
        $('#negociacion').addClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una asesoría para realizar esta operación.');
        this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
      }
    }
  }
  Producto() {
    if (this.asesoriacontractualFrom.get('IdProducto')?.value !== null
      && this.asesoriacontractualFrom.get('IdProducto')?.value !== undefined
      && this.asesoriacontractualFrom.get('IdProducto')?.value !== '') {
      this.CondicionesProducto();
    }
  }
  CondicionesProducto() {
    this.asesoriacontractualFrom.get('IdRelacionTipo')?.setValue(5);
    this.AsesoriaContractualServices.CondicionesProducto(this.asesoriacontractualFrom.value).subscribe(
      result => {
        if (result !== null) {
          this.ArrayCondiciones = result;
          this.asesoriacontractualFrom.get('NombreModalidad')?.setValue(result.NombreModalidad);
          this.BuscarProducto();
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          this.notif.onWarning('Advertencia', result.Mensaje);
          this.asesoriacontractualFrom.get('IdProducto')?.reset();
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarProducto() {
    if (this.ArrayCondiciones !== undefined) {
      let IdProducto = '*';
      let Descripcion = '*';
      if (this.asesoriacontractualFrom.get('IdProducto')?.value !== null
        && this.asesoriacontractualFrom.get('IdProducto')?.value !== undefined
        && this.asesoriacontractualFrom.get('IdProducto')?.value !== '') {
        this.asesoriacontractualFrom.get('DescripcionProducto')?.setValue('');
        IdProducto = this.asesoriacontractualFrom.get('IdProducto')?.value;
      } else if (this.asesoriacontractualFrom.get('DescripcionProducto')?.value !== null
        && this.asesoriacontractualFrom.get('DescripcionProducto')?.value !== undefined
        && this.asesoriacontractualFrom.get('DescripcionProducto')?.value !== '') {
        Descripcion = this.asesoriacontractualFrom.get('DescripcionProducto')?.value;
      }
      this.loading = true;
      this.AsesoriaContractualServices.BuscarProducto(IdProducto, Descripcion).subscribe(
        result => {
          this.loading = false;
          if (result.length === 0) {
            this.notif.onWarning('Alerta', 'No se encontró el producto.');
            this.asesoriacontractualFrom.get('IdProducto')?.reset();
          } else if (result.length === 1) {
            const fechaHoy = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaVigencia = new DatePipe('en-CO').transform(this.ArrayCondiciones.FechaVigencia, 'yyyy/MM/dd');
            if ( fechaHoy != null && fechaVigencia != null && fechaHoy <= fechaVigencia) {
              this.asesoriacontractualFrom.get('IdProducto')?.setValue(result[0].IdProducto);
              this.asesoriacontractualFrom.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
              if (this.asesoriacontractualFrom.get('IdProducto')?.value === 207) {
                this.BloquearNegociacion = null;
                this.BloquearCuotaMes = false;
                this.BloquearValorTotal = null;
                this.obligatorio = true;
              } else {
                this.MostrasAlertaProducto = false;
                this.BloquearNegociacion = null;
                this.BloquearCuotaMes = null;
                this.BloquearValorTotal = false;
                this.obligatorio = false;
              }
              if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '43') {
                this.asesoriacontractualFrom.get('Plazo')?.reset();
                this.asesoriacontractualFrom.get('CuotaMes')?.reset();
                this.asesoriacontractualFrom.get('ValorPlan')?.reset();
                this.asesoriacontractualFrom.get('TasaNominal')?.reset();
                this.asesoriacontractualFrom.get('TasaEfectiva')?.reset();
                this.asesoriacontractualFrom.get('InteresBruto')?.reset();
                this.asesoriacontractualFrom.get('Retencion')?.reset();
                this.asesoriacontractualFrom.get('TotalInteres')?.reset();
              }
              if (this.asesoriacontractualFrom.get('IdProducto')?.value !== this.datoProducto) {
                this.asesoriacontractualFrom.get('Plazo')?.reset();
                this.asesoriacontractualFrom.get('CuotaMes')?.reset();
                this.asesoriacontractualFrom.get('ValorPlan')?.reset();
                this.asesoriacontractualFrom.get('TasaNominal')?.reset();
                this.asesoriacontractualFrom.get('TasaEfectiva')?.reset();
                this.asesoriacontractualFrom.get('InteresBruto')?.reset();
                this.asesoriacontractualFrom.get('Retencion')?.reset();
                this.asesoriacontractualFrom.get('TotalInteres')?.reset();
              }
            } else {
              this.notif.onWarning('Alerta', 'El producto no está vigente.');
              this.asesoriacontractualFrom.get('IdProducto')?.reset();
              this.asesoriacontractualFrom.get('DescripcionProducto')?.reset();
              this.limpiarVigente();
            }
          } else if (result.length > 1) {
            this.resultProducto = result;
            this.ModalContractual.nativeElement.click();

            this.asesoriacontractualFrom.get('Plazo')?.reset();
            this.asesoriacontractualFrom.get('CuotaMes')?.reset();
            this.asesoriacontractualFrom.get('ValorPlan')?.reset();
            this.asesoriacontractualFrom.get('TasaNominal')?.reset();
            this.asesoriacontractualFrom.get('TasaEfectiva')?.reset();
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
  ValidarCampoProducto() {
    if (this.asesoriacontractualFrom.get('DescripcionProducto')?.value !== ''
      && this.asesoriacontractualFrom.get('DescripcionProducto')?.value !== null
      && this.asesoriacontractualFrom.get('DescripcionProducto')?.value !== undefined) {
      this.MostrasAlertaProducto = false;
    } else {
      this.MostrasAlertaProducto = true;
    }
  }
  limpiarVigente() {
    this.asesoriacontractualFrom.get('InteresBruto')?.reset();
    this.asesoriacontractualFrom.get('Retencion')?.reset();
    this.asesoriacontractualFrom.get('TotalInteres')?.reset();
    this.asesoriacontractualFrom.get('Plazo')?.reset();
    this.asesoriacontractualFrom.get('CuotaMes')?.reset();
    this.asesoriacontractualFrom.get('ValorPlan')?.reset();
    this.asesoriacontractualFrom.get('TasaEfectiva')?.reset();
    this.asesoriacontractualFrom.get('TasaNominal')?.reset();
  }
  MapearDatosProductos(datos : any) {
    this.ArrayCondiciones = undefined;
    this.asesoriacontractualFrom.get('IdProducto')?.setValue(datos.IdProducto);
    this.asesoriacontractualFrom.get('DescripcionProducto')?.setValue(datos.DescripcionProducto);
    this.MostrasAlertaProducto = false;
    this.CondicionesProducto();
  }
  ObtenerRelacion() {
    this.AsesoriaContractualServices.ObtenerRelacion().subscribe(
      result => {
        this.resultRelacion = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  MapearDatosUsuario() {
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.asesoriacontractualFrom.get('NombreOficina')?.setValue(this.dataUser.Oficina);
    this.asesoriacontractualFrom.get('NumeroOficina')?.setValue(this.dataUser.NumeroOficina);
    this.asesoriacontractualFrom.get('IdAsesor')?.setValue(this.dataUser.IdAsesor);
    this.asesoriacontractualFrom.get('NombreAsesor')?.setValue(this.dataUser.Nombre);
  }
  BuscarAsesor() {
    let IdAsesor = '*';
    let NombreAsesor = '*';
    if (this.asesoriacontractualFrom.get('IdAsesor')?.value !== null
      && this.asesoriacontractualFrom.get('IdAsesor')?.value !== undefined
      && this.asesoriacontractualFrom.get('IdAsesor')?.value !== '') {
      this.asesoriacontractualFrom.get('NombreAsesor')?.setValue('');
      IdAsesor = this.asesoriacontractualFrom.get('IdAsesor')?.value;
    } else if (this.asesoriacontractualFrom.get('NombreAsesor')?.value !== null
      && this.asesoriacontractualFrom.get('NombreAsesor')?.value !== undefined
      && this.asesoriacontractualFrom.get('NombreAsesor')?.value !== '') {
      NombreAsesor = this.asesoriacontractualFrom.get('NombreAsesor')?.value;
    }

    if (IdAsesor === '*' && NombreAsesor === '*') {
      this.notif.onWarning('Alerta', 'Debe ingresar el documento o el nombre del asesor.');
    } else {
      this.loading = true;
      this.AsesoriaContractualServices.BuscarAsesor(IdAsesor, NombreAsesor).subscribe(
        result => {
          this.loading = false;
          if (result.length === 1) {
            this.MapearDatosAsesor(result);
          } else if (result.length > 1) {
            this.resultAsesor = result;
            this.ModalAsesores.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.onWarning('Alerta', 'No se encontró al asesor.');
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
      this.asesoriacontractualFrom.get('IdAsesor')?.setValue(datos[0].IdAsesor);
      this.asesoriacontractualFrom.get('NombreAsesor')?.setValue(datos[0].Nombre);
      this.asesoriacontractualFrom.get('DocumentoAsesor')?.setValue(datos[0].Documento);
    } else {
      this.asesoriacontractualFrom.get('IdAsesor')?.setValue(datos.IdAsesor);
      this.asesoriacontractualFrom.get('NombreAsesor')?.setValue(datos.Nombre);
      this.asesoriacontractualFrom.get('DocumentoAsesor')?.setValue(datos.Documento);
    }
  }
  BuscarAsesorExternoCodigo() {
    if (this.AsesorFrom.get('strCodigo')?.value !== null
      && this.AsesorFrom.get('strCodigo')?.value !== undefined
      && this.AsesorFrom.get('strCodigo')?.value !== ''
      || this.AsesorFrom.get('strNombre')?.value !== null
      && this.AsesorFrom.get('strNombre')?.value !== undefined
      && this.AsesorFrom.get('strNombre')?.value !== '') {
      this.loading = true;
      this.AsesoriaContractualServices.BuscarAsesorExterno(this.AsesorFrom.value).subscribe(
        result => {
          this.loading = false;
          if (result.length === 1) {
            this.AsesorFrom.get('strCodigo')?.setValue(result[0].intIdAsesor);
            this.AsesorFrom.get('strNombre')?.setValue(result[0].Nombre);
          } else if (result.length > 1) {
            this.resultAsesoresExterno = result;
            this.ModalAsesoresExterno.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró al asesor externo.');
            this.AsesorFrom.get('strCodigo')?.reset();
            this.AsesorFrom.get('strNombre')?.reset();
          }
          if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '19') {
            this.BloquearbtnActalizar = true;
          } else if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '43') {
            this.BloquearbtnGuardar = false;
          }
        },
        error => {
          this.loading = false;
          this.notif.onWarning('Advertencia', 'El valor ingresado no tiene el formato correcto');
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  BuscarAsesorExternoTodos() {
    if (this.AsesorFrom.get('strCodigo')?.value === '       '
      || this.AsesorFrom.get('strCodigo')?.value === null
      && this.AsesorFrom.get('strNombre')?.value === '       '
      || this.AsesorFrom.get('strNombre')?.value === null) {
      this.AsesorFrom.get('strCodigo')?.setValue('');
      this.AsesorFrom.get('strNombre')?.setValue('');
    }

    this.AsesoriaContractualServices.BuscarAsesorExterno(this.AsesorFrom.value).subscribe(
      result => {
        if (result.length > 1) {
          this.resultAsesoresExterno = result;
          this.ModalAsesoresExterno.nativeElement.click();

          if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '19') {
            this['bloquearbtnActalizar'] = true;
          } else if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '43') {
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
          } else {
            this.AsesorFrom.get('strNombre')?.setValue('');
            this.AsesorFrom.get('strCodigo')?.setValue('');
            this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
          }
        }
      },
      error => {
        this.notif.onWarning('Advertencia', 'El valor ingresado no tiene el formato correcto');
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  MapearDatosAsesorExterno(datos : any) {
    this.asesoriacontractualFrom.get('strCodigo')?.setValue(datos.intIdAsesor);
    this.asesoriacontractualFrom.get('strNombre')?.setValue(datos.Nombre);
  }
  Periodo() {
    this.AsesoriaContractualServices.Periodo().subscribe(
      result => {
        this.resultPeriodo = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ValidarPlazo() {
    if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '1') {
      this.asesoriacontractualFrom.get('IdRelacionTipo')?.setValue(5);
      this.AsesoriaContractualServices.CondicionesProducto(this.asesoriacontractualFrom.value).subscribe(
        result => {
          if (result !== null) {
            this.ArrayCondiciones = result;

            if (this.asesoriacontractualFrom.get('Plazo')?.value !== undefined
              && this.asesoriacontractualFrom.get('Plazo')?.value !== null) {

              if (JSON.parse(this.asesoriacontractualFrom.get('Plazo')?.value) >= this.ArrayCondiciones.PlazoMinimo
                && JSON.parse(this.asesoriacontractualFrom.get('Plazo')?.value) <= this.ArrayCondiciones.PlazoMaximo) {
                this.asesoriacontractualFrom.get('TasaEfectiva')?.reset();
                this.asesoriacontractualFrom.get('TasaNominal')?.reset();
                this.asesoriacontractualFrom.get('InteresBruto')?.reset();
                this.asesoriacontractualFrom.get('Retencion')?.reset();
                this.asesoriacontractualFrom.get('TotalInteres')?.reset();

              } else {
                this.notif.onWarning('Advertencia', 'El plazo ingresado no es permitido para este producto.');
              }
            }

          } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
            this.notif.onWarning('Advertencia', result.Mensaje);
            this.asesoriacontractualFrom.get('IdProducto')?.reset();
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    } else {
      if (this.asesoriacontractualFrom.get('Plazo')?.value !== undefined
        && this.asesoriacontractualFrom.get('Plazo')?.value !== null) {
        if (JSON.parse(this.asesoriacontractualFrom.get('Plazo')?.value) >= this.ArrayCondiciones.PlazoMinimo
          && JSON.parse(this.asesoriacontractualFrom.get('Plazo')?.value) <= this.ArrayCondiciones.PlazoMaximo) {
        } else {
          this.notif.onWarning('Advertencia', 'El plazo ingresado no es permitido para este producto.');
          this.asesoriacontractualFrom.get('CuotaMes')?.reset();
          this.asesoriacontractualFrom.get('ValorPlan')?.reset();
          this.asesoriacontractualFrom.get('Plazo')?.reset();
        }
      }
    }
  }
  ValorTotalPlan() {
    if (this.asesoriacontractualFrom.get('CuotaMes')?.value !== undefined
      && this.asesoriacontractualFrom.get('CuotaMes')?.value !== null
      && this.asesoriacontractualFrom.get('CuotaMes')?.value !== 0) {
      if (this.asesoriacontractualFrom.get('CuotaMes')?.value >= this.ArrayCondiciones.SdoMinimo
        && this.asesoriacontractualFrom.get('CuotaMes')?.value <= this.ArrayCondiciones.SdoMaximo) {
        const cuota = +this.asesoriacontractualFrom.get('CuotaMes')?.value;
        const plazo = +this.asesoriacontractualFrom.get('Plazo')?.value;
        this.asesoriacontractualFrom.get('ValorPlan')?.setValue(cuota * plazo);
      } else {
        this.notif.onWarning('Advertencia', 'La cuota mes tiene un monto no permitido para este producto.');
        this.asesoriacontractualFrom.get('ValorPlan')?.reset();
        this.asesoriacontractualFrom.get('CuotaMes')?.reset();

      }
    }
  }
  ValidarValor() {
    if (this.asesoriacontractualFrom.get('ValorPlan')?.value >= this.ArrayCondiciones.SdoMinimo
      && this.asesoriacontractualFrom.get('ValorPlan')?.value <= this.ArrayCondiciones.SdoMaximo) {
    } else {
      this.notif.onWarning('Advertencia', 'El valor total plan tiene un monto no permitido para este producto.');
      this.asesoriacontractualFrom.get('ValorPlan')?.reset();
    }
  }
  ValorTotal() {
    const cuota = +this.asesoriacontractualFrom.get('CuotaMes')?.value;
    const plazo = +this.asesoriacontractualFrom.get('Plazo')?.value;
    this.asesoriacontractualFrom.get('ValorPlan')?.setValue(cuota * plazo);
    if (this.asesoriacontractualFrom.get('IdProducto')?.value === 207) {
      this.asesoriacontractualFrom.get('CuotaMes')?.setValue(null);
    }
  }
  ObtenerTasa() {
    if (this.asesoriacontractualFrom.get('Plazo')?.value !== ''
      && this.asesoriacontractualFrom.get('Plazo')?.value !== undefined
      && this.asesoriacontractualFrom.get('Plazo')?.value !== null) {
      this.loading = true;
      this.AsesoriaContractualServices.ObtenerTasa(this.asesoriacontractualFrom.value).subscribe(
        result => {
          this.loading = false;
          if(result.TasaEfectiva !== 0){
            this.MapearTasa(result);
            this.obtenerintereses();
            this.BloquearbtnActalizar = true;
          } else {
            this.notif.onWarning('Advertencia', 'Tasa no definida');
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
  dataTasaNominal : any;
  dataTasaEfectiva : any;
  MapearTasa(result : any) {
    if (result.TasaEfectiva !== null) {
      const numberNominal = this.returnFormatNum(result.TasaNominal);
      this.asesoriacontractualFrom.get('TasaNominal')?.setValue(numberNominal + "%");
      this.dataTasaNominal = result.TasaNominal;
      const numberEfectiva = this.returnFormatNum(result.TasaEfectiva.toFixed(6));
      this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(numberEfectiva + "%");
      this.dataTasaEfectiva = result.TasaEfectiva.toFixed(6);
    } else {
      this.notif.onWarning('Advertencia', 'No existe tasa para le plazo ingresado.');
      this.asesoriacontractualFrom.get('Plazo')?.reset();
    }
  }
  obtenerintereses() {
    if (this.asesoriacontractualFrom.get('IdProducto')?.value === 207) {
      if (this.asesoriacontractualFrom.get('Plazo')?.value !== ''
        && this.asesoriacontractualFrom.get('Plazo')?.value !== undefined
        && this.asesoriacontractualFrom.get('Plazo')?.value !== null
        || this.asesoriacontractualFrom.get('ValorPlan')?.value !== ''
        && this.asesoriacontractualFrom.get('ValorPlan')?.value !== undefined
        && this.asesoriacontractualFrom.get('ValorPlan')?.value !== null) {
        this.loading = true;

     
      this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(this.dataTasaEfectiva);
      this.asesoriacontractualFrom.get('TasaNominal')?.setValue(this.dataTasaNominal);
        
        this.AsesoriaContractualServices.ObtenerInteresesSemilla(this.asesoriacontractualFrom.value).subscribe(
          result => {
            this.loading = false;
            this.asesoriacontractualFrom.get('InteresBruto')?.setValue(result.toFixed(0));
            this.obtenerRetencion();
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }
    } else {
      if (this.asesoriacontractualFrom.get('Plazo')?.value !== ''
        && this.asesoriacontractualFrom.get('Plazo')?.value !== undefined
        && this.asesoriacontractualFrom.get('Plazo')?.value !== null
        || this.asesoriacontractualFrom.get('CuotaMes')?.value !== ''
        && this.asesoriacontractualFrom.get('CuotaMes')?.value !== undefined
        && this.asesoriacontractualFrom.get('CuotaMes')?.value !== null) {
        this.loading = true;

        this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(this.dataTasaEfectiva);
        this.asesoriacontractualFrom.get('TasaNominal')?.setValue(this.dataTasaNominal);

        this.AsesoriaContractualServices.ObtenerIntereses(this.asesoriacontractualFrom.value).subscribe(
          result => {
            this.loading = false;
            this.asesoriacontractualFrom.get('InteresBruto')?.setValue(result.toFixed(0));
            this.obtenerRetencion();
            const TasaNominal = this.returnFormatNum(this.asesoriacontractualFrom.get('TasaNominal')?.value);
            const TasaNominalFinal = TasaNominal + "%"
            this.asesoriacontractualFrom.get('TasaNominal')?.setValue(TasaNominalFinal);
            const TasaEfectiva = this.returnFormatNum(this.asesoriacontractualFrom.get('TasaEfectiva')?.value);
            const TasaEfectivaFinal = TasaEfectiva + "%"
            this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(TasaEfectivaFinal);

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
  obtenerRetencion() {
    if (this.asesoriacontractualFrom.get('InteresBruto')?.value !== ''
      && this.asesoriacontractualFrom.get('InteresBruto')?.value !== undefined
      && this.asesoriacontractualFrom.get('InteresBruto')?.value !== null) {
      this.loading = true;

      this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(this.dataTasaEfectiva);
        this.asesoriacontractualFrom.get('TasaNominal')?.setValue(this.dataTasaNominal);

      this.AsesoriaContractualServices.ObtenerRetencion(this.asesoriacontractualFrom.value).subscribe(
        result => {
          this.loading = false;
          this.asesoriacontractualFrom.get('Retencion')?.setValue(result.toFixed(0));
          if (result === 0) {
            const interesBruto = this.asesoriacontractualFrom.get('InteresBruto')?.value;
            this.asesoriacontractualFrom.get('TotalInteres')?.setValue(interesBruto);
          } else {
            const retencion = result;
            const interesBruto = this.asesoriacontractualFrom.get('InteresBruto')?.value;
            this.asesoriacontractualFrom.get('TotalInteres')?.setValue(interesBruto - retencion);
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
  LimpiarCampos(Datos : any) {
    if (Datos === 'IdProducto') {
      this.asesoriacontractualFrom.get('DescripcionProducto')?.reset();
    } else if (Datos === 'DescripcionProducto') {
      this.asesoriacontractualFrom.get('IdProducto')?.reset();
    } else if (Datos === 'IdAsesor') {
      this.asesoriacontractualFrom.get('NombreAsesor')?.reset();
    } else if (Datos === 'NombreAsesor') {
      this.asesoriacontractualFrom.get('IdAsesor')?.reset();
    } else if (Datos === 'BuscarDocumento') {
      this.asesoriacontractualFrom.get('BuscarNombre')?.reset();
    } else if (Datos === 'BuscarNombre') {
      this.asesoriacontractualFrom.get('BuscarDocumento')?.reset();
    }
  }
  ClearForm() {
    this.asesoriacontractualFrom.reset();
    this.AsesorFrom.reset();
    this.dataObjet = undefined;
    this.dataHistorial = [];
    this.operacionEscogida = undefined;
    this.Bloquear = false;
    this.BloquearValorTotal = false;
    this.BloquearCuotaMes = false;
    this.BloquearBuscar = false;
    this.BloquearNombre = false;
    this.BloquearProducto = false;
    this.BloquearAsesorExterno = false;
    this.BloquearPeriodo = false;
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
  Limpiar() {
    this.asesoriacontractualFrom.reset();
    this.dataHistorial = [];
    this.operacionEscogida = undefined;
    this.AsesorFrom.reset();
    this.asesoriacontractualOperacionFrom.reset();
    $('#select').focus().select();
    this.dataObjet = undefined;
    this.Bloquear = false;
    this.BloquearValorTotal = false;
    this.BloquearCuotaMes = false;
    this.BloquearBuscar = false;
    this.BloquearNombre = false;
    this.BloquearProducto = false;
    this.BloquearAsesorExterno = false;
    this.BloquearPeriodo = false;
    this.BloquearNegociacion = false;
    this.MostrasAlertaAsociado = false;
    this.MostrasAlertaProducto = false;
    this.btnGuardar = true;
    this.btnActualizar = true;
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
  BuscarAsesoria() {
    let Documento = '*';
    let Nombre = '*';
    let NumeroAsesoria = '*';
    if (this.asesoriacontractualFrom.get('BuscarDocumento')?.value !== null
      && this.asesoriacontractualFrom.get('BuscarDocumento')?.value !== undefined
      && this.asesoriacontractualFrom.get('BuscarDocumento')?.value !== '') {
      this.asesoriacontractualFrom.get('BuscarNombre')?.setValue('');
      this.asesoriacontractualFrom.get('NumeroAsesoria')?.setValue('');
      Documento = this.asesoriacontractualFrom.get('BuscarDocumento')?.value;
    } else if (this.asesoriacontractualFrom.get('BuscarNombre')?.value !== null
      && this.asesoriacontractualFrom.get('BuscarNombre')?.value !== undefined
      && this.asesoriacontractualFrom.get('BuscarNombre')?.value !== '') {
      this.asesoriacontractualFrom.get('BuscarDocumento')?.setValue('');
      this.asesoriacontractualFrom.get('NumeroAsesoria')?.setValue('');
      Nombre = this.asesoriacontractualFrom.get('BuscarNombre')?.value;
    } else if (this.asesoriacontractualFrom.get('NumeroAsesoria')?.value !== null
      && this.asesoriacontractualFrom.get('NumeroAsesoria')?.value !== undefined
      && this.asesoriacontractualFrom.get('NumeroAsesoria')?.value !== '') {
      this.asesoriacontractualFrom.get('BuscarDocumento')?.setValue('');
      this.asesoriacontractualFrom.get('BuscarNombre')?.setValue('');
      NumeroAsesoria = this.asesoriacontractualFrom.get('NumeroAsesoria')?.value;
    }
    if (Documento !== '*' || Nombre !== '*' || NumeroAsesoria !== '*') {
      this.loading = true;
      this.AsesoriaContractualServices.BuscarAsesoria(Documento, Nombre, NumeroAsesoria).subscribe(
        result => {
          this.loading = false;
          if (result.length === 0) {
            this.notif.onWarning('Alerta', 'No se encontró registro.');
            this.ClearForm();
            this.BloquearBuscar = null;
            this.generalesService.Autofocus('BuscarAsesoria');
          } else if (result.length === 1) {
            this.MapearAsesoria(result);
            this.logDataOnEditAsesorExterno.IdAsesorExternoAnterior = this.asesoriacontractualFrom.get('strCodigo')?.value || '';
            this.logDataOnEditAsesorExterno.NombreAsesorExternoAnterior = this.asesoriacontractualFrom.get('strNombre')?.value || '';
            this.logDataOnEditAsesoria.ProductoAnterior = this.asesoriacontractualFrom.get('DescripcionProducto')?.value;
            this.logDataOnEditAsesoria.PlazoAnterior = this.asesoriacontractualFrom.get('Plazo')?.value;
            this.logDataOnEditAsesoria.CuotaAnterior = this.asesoriacontractualFrom.get('CuotaMes')?.value;
            this.logDataOnEditAsesoria.ValorTotalAnterior = this.asesoriacontractualFrom.get('ValorPlan')?.value;
            this.logDataOnEditAsesoria.TasaEfectivaAnterior = this.asesoriacontractualFrom.get('TasaEfectiva')?.value;
            this.logDataOnEditAsesoria.TasaNominalAnterior = this.asesoriacontractualFrom.get('TasaNominal')?.value;
            this.logDataOnEditAsesoria.InteresBrutoAnterior = this.asesoriacontractualFrom.get('InteresBruto')?.value;
            this.logDataOnEditAsesoria.RetencionAnterior = this.asesoriacontractualFrom.get('Retencion')?.value;
            this.logDataOnEditAsesoria.TotalInteresesAnterior = this.asesoriacontractualFrom.get('TotalInteres')?.value;
            this.logDataOnEditAsesoria.FechaVencimientoAnterior = this.asesoriacontractualFrom.get('FechaVencimiento')?.value;
            this.asesoriacontractualFrom.get('BuscarDocumento')?.reset();
            this.asesoriacontractualFrom.get('BuscarNombre')?.reset();
            this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
          } else if (result.length > 1) {
            this.resultAsesoria = result;
            this.ModalAsesoria.nativeElement.click();
            this.asesoriacontractualFrom.get('BuscarDocumento')?.reset();
            this.asesoriacontractualFrom.get('BuscarNombre')?.reset();
            this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
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
  MapearAsesoria(result : any) {
    if (result !== null) {
      let data = localStorage.getItem('Data');
      this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
      if (result.length >= 1) {
        this.dataObjet = result;
        this.asesoriacontractualFrom.get('NumeroAsesoria')?.setValue(this.dataObjet[0].NumeroAsesoria);
        this.asesoriacontractualFrom.get('NumeroDocumento')?.setValue(this.dataObjet[0].NumeroDocumento);
        this.asesoriacontractualFrom.get('Nombre')?.setValue(this.dataObjet[0].PrimerApellido + ' ' + this.dataObjet[0].SegundoApellido +
          ' ' + this.dataObjet[0].PrimerNombre + ' ' + this.dataObjet[0].SegundoNombre);
        this.asesoriacontractualFrom.get('Clase')?.setValue(this.dataObjet[0].IdRelacionTipo);
        this.asesoriacontractualFrom.get('IdProducto')?.setValue(this.dataObjet[0].IdProducto);
        this.datoProducto = this.dataObjet[0].IdProducto;
        this.asesoriacontractualFrom.get('DescripcionProducto')?.setValue(this.dataObjet[0].DescripcionProducto);
        this.asesoriacontractualFrom.get('NumeroOficina')?.setValue(this.dataObjet[0].NumeroOficina);
        this.asesoriacontractualFrom.get('NombreOficina')?.setValue(this.dataObjet[0].DescripcionOficina);
        this.asesoriacontractualFrom.get('IdAsesor')?.setValue(this.dataObjet[0].IdAsesor);
        this.asesoriacontractualFrom.get('NombreAsesor')?.setValue(this.dataObjet[0].PrimerApellidoAsesor + ' ' +
          this.dataObjet[0].SegundoApellidoAsesor + ' ' + this.dataObjet[0].PrimerNombreAsesor + ' ' + this.dataObjet[0].SegundoNombreAsesor);
        this.AsesorFrom.get('strCodigo')?.setValue(this.dataObjet[0].IdAsesorExterno);
        this.datoAsesorExterno = this.dataObjet[0].IdAsesorExterno;
        this.AsesorFrom.get('strNombre')?.setValue(this.dataObjet[0].PrimerApellidoAsesorE + ' ' +
          this.dataObjet[0].SegundoApellidoAsesorE + ' ' + this.dataObjet[0].PrimerNombreAsesorE + ' ' +
          this.dataObjet[0].SegundoNombreAsesoreE);
        this.asesoriacontractualFrom.get('Plazo')?.setValue(this.dataObjet[0].Plazo);
        this.datoPlazo = this.dataObjet[0].Plazo;
        this.asesoriacontractualFrom.get('CuotaMes')?.setValue(this.dataObjet[0].CuotaMes);
        this.datoCuotaMes = this.dataObjet[0].CuotaMes;
        this.asesoriacontractualFrom.get('IdPeriodo')?.setValue(this.dataObjet[0].IdPeriodo);
        const numberNominal = this.returnFormatNum(this.dataObjet[0].ltTasa[0].TasaNominal.toFixed(6));
        this.asesoriacontractualFrom.get('TasaNominal')?.setValue(numberNominal + "%");
        const numberEfectiva = this.returnFormatNum(this.dataObjet[0].ltTasa[0].TasaEfectiva.toFixed(6));
        this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(numberEfectiva + "%");
        this.asesoriacontractualFrom.get('InteresBruto')?.setValue(this.dataObjet[0].InteresxPagar);
        this.asesoriacontractualFrom.get('Retencion')?.setValue(this.dataObjet[0].Retencion);
        this.asesoriacontractualFrom.get('TotalInteres')?.setValue(this.dataObjet[0].InteresxPagar - this.dataObjet[0].Retencion);
        this.asesoriacontractualFrom.get('FechaCreacion')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet[0].FechaCreacion, 'yyyy/MM/dd  HH:mm:ss'));
        this.asesoriacontractualFrom.get('FechaVencimiento')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet[0].FechaVencimiento, 'yyyy/MM/dd  HH:mm:ss'));
        this.asesoriacontractualFrom.get('NombreModalidad')?.setValue(this.dataObjet[0].Nombre);
        this.ValorTotal();
        this.ObtenerHistorial();

        this.items.Oficina = this.asesoriacontractualFrom.get('NombreOficina')?.value;
        this.items.Nombre = this.asesoriacontractualFrom.get('Nombre')?.value;
        this.items.Documento = this.asesoriacontractualFrom.get('NumeroDocumento')?.value;
        this.items.NombreProducto = this.asesoriacontractualFrom.get('DescripcionProducto')?.value;
        this.items.Producto = this.asesoriacontractualFrom.get('IdProducto')?.value;
        this.items.Plazo = this.asesoriacontractualFrom.get('Plazo')?.value;
        this.resultPeriodo.forEach(elementPeriodo => {
          if (this.asesoriacontractualFrom.get('IdPeriodo')?.value === elementPeriodo.IdPeriodo) {
            this.items.Periodo = elementPeriodo.DescripcionPeriodo;
          }
        });
        var TasaEfectivaSin = this.asesoriacontractualFrom.get('TasaEfectiva')?.value;
        TasaEfectivaSin = TasaEfectivaSin.replace("%", "");
        this.items.TasaEfectiva = TasaEfectivaSin;
        var TasaNominalSin = this.asesoriacontractualFrom.get('TasaNominal')?.value;
        TasaNominalSin = TasaNominalSin.replace("%", "");
        this.items.TasaNominal = TasaNominalSin;
        this.items.ValorInteres = this.asesoriacontractualFrom.get('TotalInteres')?.value;
        this.items.ValorTotal = this.asesoriacontractualFrom.get('ValorPlan')?.value;
        this.items.Modalidad = this.asesoriacontractualFrom.get('NombreModalidad')?.value;
        this.items.Asesor = this.asesoriacontractualFrom.get('NombreAsesor')?.value;
        this.items.Cuota = this.asesoriacontractualFrom.get('CuotaMes')?.value;
      } else {
        this.dataObjet = result;
        this.asesoriacontractualFrom.get('NumeroAsesoria')?.setValue(this.dataObjet.NumeroAsesoria);
        this.asesoriacontractualFrom.get('NumeroDocumento')?.setValue(this.dataObjet.NumeroDocumento);
        this.asesoriacontractualFrom.get('Nombre')?.setValue(this.dataObjet.PrimerApellido + ' ' + this.dataObjet.SegundoApellido +
          ' ' + this.dataObjet.PrimerNombre + ' ' + this.dataObjet.SegundoNombre);
        this.asesoriacontractualFrom.get('Clase')?.setValue(this.dataObjet.IdRelacionTipo);
        this.asesoriacontractualFrom.get('IdProducto')?.setValue(this.dataObjet.IdProducto);
        this.datoProducto = this.dataObjet.IdProducto;
        this.asesoriacontractualFrom.get('DescripcionProducto')?.setValue(this.dataObjet.DescripcionProducto);
        this.asesoriacontractualFrom.get('NumeroOficina')?.setValue(this.dataObjet.NumeroOficina);
        this.asesoriacontractualFrom.get('NombreOficina')?.setValue(this.dataObjet.DescripcionOficina);
        this.asesoriacontractualFrom.get('IdAsesor')?.setValue(this.dataObjet.IdAsesor);
        this.asesoriacontractualFrom.get('NombreAsesor')?.setValue(this.dataObjet.PrimerApellidoAsesor + ' ' +
          this.dataObjet.SegundoApellidoAsesor + ' ' + this.dataObjet.PrimerNombreAsesor + ' ' + this.dataObjet.SegundoNombreAsesor);
        this.AsesorFrom.get('strCodigo')?.setValue(this.dataObjet.IdAsesorExterno);
        this.datoAsesorExterno = this.dataObjet.IdAsesorExterno;
        this.AsesorFrom.get('strNombre')?.setValue(this.dataObjet.PrimerApellidoAsesorE + ' ' +
          this.dataObjet.SegundoApellidoAsesorE + ' ' + this.dataObjet.PrimerNombreAsesorE + ' ' +
          this.dataObjet.SegundoNombreAsesoreE);
        this.asesoriacontractualFrom.get('Plazo')?.setValue(this.dataObjet.Plazo);
        this.datoPlazo = this.dataObjet.Plazo;
        this.asesoriacontractualFrom.get('CuotaMes')?.setValue(this.dataObjet.CuotaMes);
        this.datoCuotaMes = this.dataObjet.CuotaMes;
        this.asesoriacontractualFrom.get('IdPeriodo')?.setValue(this.dataObjet.IdPeriodo);
        const numberNominal = this.returnFormatNum(this.dataObjet.ltTasa[0].TasaNominal.toFixed(6));
        this.asesoriacontractualFrom.get('TasaNominal')?.setValue(numberNominal + "%");
        const numberEfectiva = this.returnFormatNum(this.dataObjet.ltTasa[0].TasaEfectiva.toFixed(6));
        this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(numberEfectiva + "%");
        this.asesoriacontractualFrom.get('InteresBruto')?.setValue(this.dataObjet.InteresxPagar);
        this.asesoriacontractualFrom.get('Retencion')?.setValue(this.dataObjet.Retencion);
        this.asesoriacontractualFrom.get('TotalInteres')?.setValue(this.dataObjet.InteresxPagar - this.dataObjet.Retencion);
        this.asesoriacontractualFrom.get('FechaCreacion')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaCreacion, 'yyyy/MM/dd  HH:mm:ss'));
        this.asesoriacontractualFrom.get('FechaVencimiento')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaVencimiento, 'yyyy/MM/dd  HH:mm:ss'));
        this.asesoriacontractualFrom.get('NombreModalidad')?.setValue(this.dataObjet.Nombre);
        this.ValorTotal();
        this.ObtenerHistorial();

        this.items.Oficina = this.asesoriacontractualFrom.get('NombreOficina')?.value;
        this.items.Nombre = this.asesoriacontractualFrom.get('Nombre')?.value;
        this.items.Documento = this.asesoriacontractualFrom.get('NumeroDocumento')?.value;
        this.items.NombreProducto = this.asesoriacontractualFrom.get('DescripcionProducto')?.value;
        this.items.Producto = this.asesoriacontractualFrom.get('IdProducto')?.value;
        this.items.Plazo = this.asesoriacontractualFrom.get('Plazo')?.value;
        this.resultPeriodo.forEach(elementPeriodo => {
          if (this.asesoriacontractualFrom.get('IdPeriodo')?.value === elementPeriodo.IdPeriodo) {
            this.items.Periodo = elementPeriodo.DescripcionPeriodo;
          }
        });
        
        var TasaEfectivaSin = this.asesoriacontractualFrom.get('TasaEfectiva')?.value;
        TasaEfectivaSin = TasaEfectivaSin.replace("%", "");
        this.items.TasaEfectiva = TasaEfectivaSin;
        var TasaNominalSin = this.asesoriacontractualFrom.get('TasaNominal')?.value;
        TasaNominalSin = TasaNominalSin.replace("%", "");
        this.items.TasaNominal = TasaNominalSin;
        this.items.ValorInteres = this.asesoriacontractualFrom.get('TotalInteres')?.value;
        this.items.ValorTotal = this.asesoriacontractualFrom.get('ValorPlan')?.value;
        this.items.Modalidad = this.asesoriacontractualFrom.get('NombreModalidad')?.value;
        this.items.Asesor = this.asesoriacontractualFrom.get('NombreAsesor')?.value;
        this.items.Cuota = this.asesoriacontractualFrom.get('CuotaMes')?.value;
      }
      this.BloquearBuscar = false;
    } else {
      this.notif.onWarning('Advertencia', 'La asesoría no existe.');
      //this.clearCampos();
      this.dataObjet = undefined;
    }
  }
  BotonBuscarAsesoriaContractual() {
    if (this.asesoriacontractualFrom.get('BuscarDocumento')?.value !== null
    && this.asesoriacontractualFrom.get('BuscarDocumento')?.value !== undefined
    && this.asesoriacontractualFrom.get('BuscarDocumento')?.value !== '') {
      this.BuscarXDocumento();
    } else if (this.asesoriacontractualFrom.get('BuscarNombre')?.value !== null
    && this.asesoriacontractualFrom.get('BuscarNombre')?.value !== undefined
    && this.asesoriacontractualFrom.get('BuscarNombre')?.value !== '') {
      this.BuscarXNombre();
    }
  }
  BuscarXDocumento() {
    this.BuscarAsesoria();
    this.BloquearBuscar = false;
  }
  BuscarXNombre() {
      this.BuscarAsesoria();
      this.BloquearBuscar = false;
  }
  BuscarAsesoriaModal(Documento = '*', NumeroAsesoria : string ) {
    let Nombre = '*';
    if (this.asesoriacontractualFrom.get('NumeroDocumento')?.value !== null
      && this.asesoriacontractualFrom.get('NumeroDocumento')?.value !== undefined
      && this.asesoriacontractualFrom.get('NumeroDocumento')?.value !== ''
    ) {
      this.asesoriacontractualFrom.get('Nombre')?.setValue('');
      Documento = this.asesoriacontractualFrom.get('NumeroDocumento')?.value;
    } else if (this.asesoriacontractualFrom.get('Nombre')?.value !== null
      && this.asesoriacontractualFrom.get('Nombre')?.value !== undefined
      && this.asesoriacontractualFrom.get('Nombre')?.value !== ''
    ) {
      Nombre = this.asesoriacontractualFrom.get('Nombre')?.value;
    }
    this.loading = true;
    this.AsesoriaContractualServices.BuscarAsesoria(Documento, '*', NumeroAsesoria).subscribe( // verificar y corregir
      result => {
        this.loading = false;
        if (result.length === 0) {
          this.notif.onWarning('Advertencia', 'No se encontró cuenta de contractual.');
          this.ClearForm();
        } else if (result.length === 1) {
          this.asesoriacontractualFrom.get('BuscarDocumento')?.reset();
          this.asesoriacontractualFrom.get('BuscarNombre')?.reset();
          this.ClearForm();
          this.MapearAsesoria(result);
          this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
        } else if (result.length > 1) {
          this.resultAsesoria = result;
          this.ModalAsesoria.nativeElement.click();
          this.asesoriacontractualFrom.get('BuscarDocumento')?.reset();
          this.asesoriacontractualFrom.get('BuscarNombre')?.reset();
          this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarNombreXDocumento() {
    if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '43') {
      let Documento = '*';
      if (this.asesoriacontractualFrom.get('NumeroDocumento')?.value !== null
        && this.asesoriacontractualFrom.get('NumeroDocumento')?.value !== undefined
        && this.asesoriacontractualFrom.get('NumeroDocumento')?.value !== '') {
          Documento = this.asesoriacontractualFrom.get('NumeroDocumento')?.value;

          if (!/^[a-zA-Z0-9]{3,15}$/.test(Documento)) {
            this.asesoriacontractualFrom.get('Nombre')?.reset();
            return;
          }

          this.loading = true;
          this.AsesoriaContractualServices.BuscarNombreXDocumento(Documento).subscribe(
            result => {
              this.loading = false;
              if (result === null) {
                this.clientesGetListService.GetTipoDocumento().subscribe(
                  result => {
                    this.ModalCreacionNombre.nativeElement.click();
                    this.tiposDeDocumento = result.filter((tipoD: any) => tipoD.Clase !== 8);
                    if (/[a-z]/gi.test(Documento)) this.tiposDeDocumento = this.tiposDeDocumento.filter((tipoD: any) => tipoD.Clase === 9);
                    if (Documento.length < 10) this.tiposDeDocumento = this.tiposDeDocumento.filter((tipoD: any) => tipoD.Clase !== 3);
                  });

                this.creacionFrom.reset();
                this.isCreationButtonDisabled = true;
                this.notif.onWarning('Advertencia', 'No se encontraron datos.');
                this.creacionFrom.get('PrimerNombre')?.reset();
                this.creacionFrom.get('SegundoNombre')?.reset();
                this.creacionFrom.get('PrimerApellido')?.reset();
                this.creacionFrom.get('SegundoApellido')?.reset();
                this.creacionFrom.get('TelefonoAsesoria')?.reset();
                this.asesoriacontractualFrom.get('Nombre')?.reset();
                this.datoRelacion = 15;
              } else if (result !== null) {
                this.asesoriacontractualFrom.get('NumeroDocumento')?.setValue(result.NumeroDocumento);
                this.asesoriacontractualFrom.get('Nombre')?.setValue(result.PrimerApellido + ' ' + result.SegundoApellido +
                  ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
                this.asesoriacontractualFrom.get('Clase')?.setValue(result.IdRelacionTipo);
                this.datoRelacion = result.IdRelacionTipo;
                this.MostrasAlertaAsociado = false;
                this.asesoriacontractualFrom.get('Clase')?.setValue(this.datoRelacion);
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
  BuscarNombreXNombre() {
    let Nombre = '*';
      if (this.asesoriacontractualFrom.get('Nombre')?.value !== null
        && this.asesoriacontractualFrom.get('Nombre')?.value !== undefined
        && this.asesoriacontractualFrom.get('Nombre')?.value !== '') {
          Nombre = this.asesoriacontractualFrom.get('Nombre')?.value;
          this.loading = true;
          this.AsesoriaContractualServices.BuscarNombreXNombre(Nombre).subscribe(
            result => {
              this.loading = false;
              if (result.length === 0) {
                this.notif.onWarning('Advertencia', 'No se encontró el nombre.');
              } else if (result.length === 1) {
                const Documento = result[0].NumeroDocumento;
                this.BuscarNombreModal(Documento);
                this.BloquearProducto = false;
                this.MostrasAlertaAsociado = false;
                this.generalesService.Autofocus('SelectProducto');
              } else if (result.length > 1) {
                this.resultNombre = result;
                this.ModalNombre.nativeElement.click();
                //this.BloquaerProducto = null;
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
  BuscarNombreModal(Documento = '*') {
    this.loading = true;
    this.AsesoriaContractualServices.BuscarNombreXDocumento(Documento).subscribe(
      result => {
        this.loading = false;
        if (result === null) {
          this.notif.onWarning('Advertencia', 'No se encontraron datos.');
          this.creacionFrom.get('PrimerNombre')?.reset();
          this.creacionFrom.get('SegundoNombre')?.reset();
          this.creacionFrom.get('PrimerApellido')?.reset();
          this.creacionFrom.get('SegundoApellido')?.reset();
          this.creacionFrom.get('TelefonoAsesoria')?.reset();
          this.ModalCreacionNombre.nativeElement.click();
          this.asesoriacontractualFrom.get('Nombre')?.reset();
          this.datoRelacion = 15;
        } else if (result !== null) {
          this.asesoriacontractualFrom.get('NumeroDocumento')?.setValue(result.NumeroDocumento);
          this.asesoriacontractualFrom.get('Nombre')?.setValue(result.PrimerApellido + ' ' + result.SegundoApellido +
            ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
          this.asesoriacontractualFrom.get('Clase')?.setValue(result.IdRelacionTipo);
          this.datoRelacion = result.IdRelacionTipo;
          this.MostrasAlertaAsociado = false;
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
  ValidarCampoAsociado() {
    if (this.asesoriacontractualFrom.get('Nombre')?.value !== ''
    && this.asesoriacontractualFrom.get('Nombre')?.value !== null
    && this.asesoriacontractualFrom.get('Nombre')?.value !== undefined) {
      this.MostrasAlertaAsociado = false;
    } else {
      this.MostrasAlertaAsociado = true;
    }
  }
  ActualizarAsesoria() {
    if (this.asesoriacontractualFrom.get('NumeroAsesoria')?.value !== undefined
      && this.asesoriacontractualFrom.get('NumeroAsesoria')?.value !== ''
      && this.asesoriacontractualFrom.get('NumeroAsesoria')?.value !== null) {

      if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '19') {         // Actualizar el asesor externo

        if ((+this.AsesorFrom.get('strCodigo')?.value !== this.datoAsesorExterno)
          && (this.AsesorFrom.get('strCodigo')?.value !== this.datoAsesorExterno)) {
          const IdAsesor = this.AsesorFrom.get('strCodigo')?.value;
          const NombreAsesor = this.AsesorFrom.get('strNombre')?.value;
          if (IdAsesor !== null && IdAsesor !== '' && IdAsesor !== undefined &&
            NombreAsesor !== null && NombreAsesor !== '' && NombreAsesor !== undefined) {
            this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value;
            this.asesoriacontractualFrom.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            this.datoAsesorExterno = +this.AsesorFrom.get('strCodigo')?.value;

            this.loading = true;
            this.AsesoriaContractualServices.EditarAsesorExterno(this.asesoriacontractualFrom.value).subscribe(
              result => {
                this.loading = false;
                this.Bloquear = false;
                this.BloquearValorTotal = false;
                this.BloquearCuotaMes = false;
                this.BloquearBuscar = false;
                this.BloquearNombre = false;
                this.BloquearProducto = false;
                this.BloquearAsesorExterno = false;
                this.BloquearPeriodo = false;
                this.BloquearNegociacion = false;
                this.notif.onSuccess('Exitoso', 'El cambio de asesor externo se actualizó correctamente.'
                  );
                this.logDataOnEditAsesorExterno.IdAsesorExternoActualiza = this.asesoriacontractualFrom.get('strCodigo')?.value || '';
                this.logDataOnEditAsesorExterno.NombreAsesorExternoActualiza = this.asesoriacontractualFrom.get('strNombre')?.value || '';
                this.GuardarlogAsesoria(this.logDataOnEditAsesorExterno, 19);
                this.logDataOnEditAsesorExterno.IdAsesorExternoAnterior = this.asesoriacontractualFrom.get('strCodigo')?.value || '';
                this.logDataOnEditAsesorExterno.NombreAsesorExternoAnterior = this.asesoriacontractualFrom.get('strNombre')?.value || '';
                this.btnActualizar = true;
                this.btnGuardar = true;
                this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
                this.ObtenerHistorial();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              });
          } else if ((IdAsesor === null || IdAsesor === '' || IdAsesor === undefined) &&
            (NombreAsesor === null || NombreAsesor === '' || NombreAsesor === undefined)) {
            this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value;
            this.asesoriacontractualFrom.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            this.datoAsesorExterno = +this.AsesorFrom.get('strCodigo')?.value;

            this.loading = true;
            this.AsesoriaContractualServices.EditarAsesorExterno(this.asesoriacontractualFrom.value).subscribe(
              result => {
                this.loading = false;
                this.loading = false;
                this.Bloquear = false;
                this.BloquearValorTotal = false;
                this.BloquearCuotaMes = false;
                this.BloquearBuscar = false;
                this.BloquearNombre = false;
                this.BloquearProducto = false;
                this.BloquearAsesorExterno = false;
                this.BloquearPeriodo = false;
                this.BloquearNegociacion = false;
                this.notif.onSuccess('Exitoso', 'El Cambio de asesor externo se actualizó correctamente.'
                  );
                this.logDataOnEditAsesorExterno.IdAsesorExternoActualiza = this.asesoriacontractualFrom.get('strCodigo')?.value || '';
                this.logDataOnEditAsesorExterno.NombreAsesorExternoActualiza = this.asesoriacontractualFrom.get('strNombre')?.value || '';
                this.GuardarlogAsesoria(this.logDataOnEditAsesorExterno, 19);
                this.logDataOnEditAsesorExterno.IdAsesorExternoAnterior = this.asesoriacontractualFrom.get('strCodigo')?.value || '';
                this.logDataOnEditAsesorExterno.NombreAsesorExternoAnterior = this.asesoriacontractualFrom.get('strNombre')?.value || '';
                this.btnActualizar = true;
                this.btnGuardar = true;
                this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
                this.ObtenerHistorial();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              });
          } else {
            this.notif.onWarning('Advertencia', 'Debe seleccionar un asesor válido.');
          }
        } else {
          this.notif.onWarning('Advertencia', 'Debe cambiar asesor externo.');
          this['bloquearbtnActalizar'] = false;
        }
      } else if (this.asesoriacontractualOperacionFrom.get('Codigo')?.value === '1') {   // Editar

        if (this.asesoriacontractualFrom.get('IdProducto')?.value === 207) {
          const Plazo = this.asesoriacontractualFrom.get('Plazo')?.value;
          const Valor = this.asesoriacontractualFrom.get('ValorPlan')?.value;
          this.asesoriacontractualFrom.get('CuotaMes')?.setValue(Valor / Plazo);
        }

        if (this.asesoriacontractualFrom.get('IdProducto')?.value !== this.datoProducto
          || this.asesoriacontractualFrom.get('Plazo')?.value !== this.datoPlazo
          || this.asesoriacontractualFrom.get('CuotaMes')?.value !== this.datoCuotaMes) {

          this.loading = true;
          
          var TasaEfectivaSin = this.asesoriacontractualFrom.get('TasaEfectiva')?.value;
          TasaEfectivaSin = TasaEfectivaSin.replace("%", "");
          this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(TasaEfectivaSin);

          var TasaNominalSin = this.asesoriacontractualFrom.get('TasaNominal')?.value;
          TasaNominalSin = TasaNominalSin.replace("%", "");
          this.asesoriacontractualFrom.get('TasaNominal')?.setValue(TasaNominalSin);
          
            this.AsesoriaContractualServices.ActualizarAsesoriaContractual(this.asesoriacontractualFrom.value).subscribe(
              result => {
                this.loading = false;
                this.Bloquear = false;
                this.BloquearValorTotal = false;
                this.BloquearCuotaMes = false;
                this.BloquearBuscar = false;
                this.BloquearNombre = false;
                this.BloquearProducto = false;
                this.BloquearAsesorExterno = false;
                this.BloquearPeriodo = false;
                this.BloquearNegociacion = false;
                this.btnActualizar = true;
                this.btnGuardar = true;
                this.MapearAsesoria(result);
                this.logDataOnEditAsesoria.ProductoActualiza = this.asesoriacontractualFrom.get('DescripcionProducto')?.value;
                this.logDataOnEditAsesoria.PlazoActualiza = this.asesoriacontractualFrom.get('Plazo')?.value;
                this.logDataOnEditAsesoria.CuotaActualiza = this.asesoriacontractualFrom.get('CuotaMes')?.value;
                this.logDataOnEditAsesoria.ValorTotalActualiza = this.asesoriacontractualFrom.get('ValorPlan')?.value;
                this.logDataOnEditAsesoria.TasaEfectivaActualiza = this.asesoriacontractualFrom.get('TasaEfectiva')?.value;
                this.logDataOnEditAsesoria.TasaNominalActualiza = this.asesoriacontractualFrom.get('TasaNominal')?.value;
                this.logDataOnEditAsesoria.InteresBrutoActualiza = this.asesoriacontractualFrom.get('InteresBruto')?.value;
                this.logDataOnEditAsesoria.RetencionActualiza = this.asesoriacontractualFrom.get('Retencion')?.value;
                this.logDataOnEditAsesoria.TotalInteresesActualiza = this.asesoriacontractualFrom.get('TotalInteres')?.value;
                this.logDataOnEditAsesoria.FechaVencimientoActualiza = this.asesoriacontractualFrom.get('FechaVencimiento')?.value;
                this.GuardarlogAsesoria(this.logDataOnEditAsesoria, 1);
                this.logDataOnEditAsesoria.ProductoAnterior = this.asesoriacontractualFrom.get('DescripcionProducto')?.value;
                this.logDataOnEditAsesoria.PlazoAnterior = this.asesoriacontractualFrom.get('Plazo')?.value;
                this.logDataOnEditAsesoria.CuotaAnterior = this.asesoriacontractualFrom.get('CuotaMes')?.value;
                this.logDataOnEditAsesoria.ValorTotalAnterior = this.asesoriacontractualFrom.get('ValorPlan')?.value;
                this.logDataOnEditAsesoria.TasaEfectivaAnterior = this.asesoriacontractualFrom.get('TasaEfectiva')?.value;
                this.logDataOnEditAsesoria.TasaNominalAnterior = this.asesoriacontractualFrom.get('TasaNominal')?.value;
                this.logDataOnEditAsesoria.InteresBrutoAnterior = this.asesoriacontractualFrom.get('InteresBruto')?.value;
                this.logDataOnEditAsesoria.RetencionAnterior = this.asesoriacontractualFrom.get('Retencion')?.value;
                this.logDataOnEditAsesoria.TotalInteresesAnterior = this.asesoriacontractualFrom.get('TotalInteres')?.value;
                this.logDataOnEditAsesoria.FechaVencimientoAnterior = this.asesoriacontractualFrom.get('FechaVencimiento')?.value;

                this.notif.onSuccess('Exitoso', 'El editar se actualizó correctamente.');
                this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
                this.ObtenerHistorial();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
        } else {
          this.notif.onWarning('Advertencia', 'Debe cambiar algún registro para editar.');
          this.BloquearbtnActalizar = false;
        }
      }
      } else {
      this.notif.onWarning('Advertencia',
      'Debe buscar una cuenta para realizar esta operación.');
      }
  }
  dataAsesor : any ;
  GuardarAsesoria() {
    this.asesoriacontractualFrom.get('IdRelacionTipo')?.setValue(this.datoRelacion);
    if (this.creacionFrom.get('PrimerNombre')?.value !== null
      && this.creacionFrom.get('PrimerNombre')?.value !== undefined
      && this.creacionFrom.get('PrimerNombre')?.value !== '') {
      this.asesoriacontractualFrom.get('TipoDocumento')?.setValue(this.creacionFrom.get('TipoDocumento')?.value);
      this.asesoriacontractualFrom.get('PrimerNombre')?.setValue(this.creacionFrom.get('PrimerNombre')?.value);
      this.asesoriacontractualFrom.get('SegundoNombre')?.setValue(this.creacionFrom.get('SegundoNombre')?.value);
      this.asesoriacontractualFrom.get('PrimerApellido')?.setValue(this.creacionFrom.get('PrimerApellido')?.value);
      this.asesoriacontractualFrom.get('SegundoApellido')?.setValue(this.creacionFrom.get('SegundoApellido')?.value);
      this.asesoriacontractualFrom.get('TelefonoAsesoria')?.setValue(this.creacionFrom.get('TelefonoAsesoria')?.value);
    }
    if (this.AsesorFrom.get('strCodigo')?.value !== null
      && this.AsesorFrom.get('strCodigo')?.value !== undefined
      && this.AsesorFrom.get('strCodigo')?.value !== '') {

      this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value;
      this.asesoriacontractualFrom.get('IdAsesorExterno')?.setValue(this.dataAsesor);

        if (this.asesoriacontractualFrom.get('IdProducto')?.value === 207) {
          const Plazo = this.asesoriacontractualFrom.get('Plazo')?.value;
          const Valor = this.asesoriacontractualFrom.get('ValorPlan')?.value;
          this.asesoriacontractualFrom.get('CuotaMes')?.setValue(Valor / Plazo);
        }
      this.loading = true;

      this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(this.dataTasaEfectiva);
      this.asesoriacontractualFrom.get('TasaNominal')?.setValue(this.dataTasaNominal);
      if(!this.asesoriacontractualFrom.get('SegundoNombre')?.value) this.asesoriacontractualFrom.value.SegundoNombre = ''
      if(!this.asesoriacontractualFrom.get('SegundoApellido')?.value) this.asesoriacontractualFrom.value.SegundoApellido = ''
      this.AsesoriaContractualServices.GuardarAsesoriaContractual(this.asesoriacontractualFrom.value).subscribe(
        result => {
          const currentRelacionId = this.asesoriacontractualFrom.get('Clase')?.value;
          const Relacion = this.resultRelacion.find(relacion => relacion.Clase === currentRelacionId).Descripcion;
          const Periodo = this.resultPeriodo.find((p: any) => p.IdPeriodo === this.asesoriacontractualFrom.get('IdPeriodo')?.value).DescripcionPeriodo;
          let logAsesoria: any = {
            Relacion,
            AsesorExterno: this.asesoriacontractualFrom.get('strNombre')?.value,
            Producto: this.asesoriacontractualFrom.get('DescripcionProducto')?.value,
            Plazo: this.asesoriacontractualFrom.get('Plazo')?.value,
            CuotaMes: this.asesoriacontractualFrom.get('CuotaMes')?.value,
            ValorTotalPlan: this.asesoriacontractualFrom.get('ValorPlan')?.value,
            Periodo,
            TasaEfectiva: Number(this.asesoriacontractualFrom.get('TasaEfectiva')?.value)?.toFixed(4) + '%',
            TasaNominal: this.asesoriacontractualFrom.get('TasaNominal')?.value?.toFixed(4) + '%',
            FechaVencimiento:  formatDate(result.FechaVencimiento, 'yyyy/MM/dd HH:mm:ss', 'en'),
            InteresBruto: this.asesoriacontractualFrom.get('InteresBruto')?.value,
            RetencionFuente: this.asesoriacontractualFrom.get('Retencion')?.value,
            TotalInteres: this.asesoriacontractualFrom.get('TotalInteres')?.value

          }
          if (!logAsesoria.AsesorExterno) delete logAsesoria.AsesorExterno;
          let newTerceroData = this.creacionFrom.value;
          if (newTerceroData.TipoDocumento) {
            const tipoDocumento = this.tiposDeDocumento.find((tipoD: any) => tipoD.Clase == newTerceroData.TipoDocumento).Descripcion;
            if(newTerceroData.TipoDocumento == 3) newTerceroData = { RazonSocial: newTerceroData.PrimerNombre, TelefonoAsesoria: newTerceroData.TelefonoAsesoria, TipoDocumento: tipoDocumento }
            logAsesoria = { ...logAsesoria, ...newTerceroData };
            logAsesoria.TipoDocumento = tipoDocumento;
          }

          //Reemplazando null por string vacio
          Object.keys(logAsesoria).forEach(key => {
            if(logAsesoria[key] === null) logAsesoria[key] = '';
          });
          this.loading = false;
          this.Bloquear = false;
          this.BloquearValorTotal = false;
          this.BloquearBuscar = false;
          this.BloquearNombre = false;
          this.BloquearProducto = false;
          this.BloquearAsesorExterno = false;
          this.BloquearPeriodo = false;
          this.BloquearNegociacion = false;
          this.btnActualizar = true;
          this.btnGuardar = true;
          this.BloquearCuotaMes = false;
          this.MapearAsesoria(result);
          this.GuardarlogAsesoria(logAsesoria, 43);
          this.notif.onSuccess('Exitoso', 'La asesoría  se guardó correctamente.');
          this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
          this.ModalImpresionAsesoria.nativeElement.click();
          this.ObtenerHistorial();
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    } else {
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
      }).then((results : any) => {
        if (results.value) {
        } else {
          if (this.asesoriacontractualFrom.get('IdProducto')?.value === 207) {
            const Plazo = this.asesoriacontractualFrom.get('Plazo')?.value;
            const Valor = this.asesoriacontractualFrom.get('ValorPlan')?.value;
            this.asesoriacontractualFrom.get('CuotaMes')?.setValue(Valor / Plazo);
          }
          this.loading = true;

          
          this.asesoriacontractualFrom.get('TasaEfectiva')?.setValue(this.dataTasaEfectiva);
          this.asesoriacontractualFrom.get('TasaNominal')?.setValue(this.dataTasaNominal);

          if(!this.asesoriacontractualFrom.get('SegundoNombre')?.value) this.asesoriacontractualFrom.value.SegundoNombre = ''
          if(!this.asesoriacontractualFrom.get('SegundoApellido')?.value) this.asesoriacontractualFrom.value.SegundoApellido = ''
          this.AsesoriaContractualServices.GuardarAsesoriaContractual(this.asesoriacontractualFrom.value).subscribe(
            result => {
              const currentRelacionId = this.asesoriacontractualFrom.get('Clase')?.value;
              const Relacion = this.resultRelacion.find(relacion => relacion.Clase === currentRelacionId).Descripcion;
              const Periodo = this.resultPeriodo.find((p: any) => p.IdPeriodo === this.asesoriacontractualFrom.get('IdPeriodo')?.value).DescripcionPeriodo;
              let logAsesoria: any = {
                Relacion,
                AsesorExterno: this.asesoriacontractualFrom.get('strNombre')?.value,
                Producto: this.asesoriacontractualFrom.get('DescripcionProducto')?.value,
                Plazo: this.asesoriacontractualFrom.get('Plazo')?.value,
                CuotaMes: this.asesoriacontractualFrom.get('CuotaMes')?.value,
                ValorTotalPlan: this.asesoriacontractualFrom.get('ValorPlan')?.value,
                Periodo,
                TasaEfectiva: Number(this.asesoriacontractualFrom.get('TasaEfectiva')?.value)?.toFixed(4) + '%',
                TasaNominal: this.asesoriacontractualFrom.get('TasaNominal')?.value?.toFixed(4) + '%',
                FechaVencimiento:  formatDate(result.FechaVencimiento, 'yyyy/MM/dd HH:mm:ss', 'en'),
                InteresBruto: this.asesoriacontractualFrom.get('InteresBruto')?.value,
                RetencionFuente: this.asesoriacontractualFrom.get('Retencion')?.value,
                TotalInteres: this.asesoriacontractualFrom.get('TotalInteres')?.value

              }
              if (!logAsesoria.AsesorExterno) delete logAsesoria.AsesorExterno;
              let newTerceroData = this.creacionFrom.value;
              if (newTerceroData.TipoDocumento) {
                const tipoDocumento = this.tiposDeDocumento.find((tipoD: any) => tipoD.Clase == newTerceroData.TipoDocumento).Descripcion;
                if(newTerceroData.TipoDocumento == 3) newTerceroData = { RazonSocial: newTerceroData.PrimerNombre, TelefonoAsesoria: newTerceroData.TelefonoAsesoria, TipoDocumento: tipoDocumento }
                logAsesoria = { ...logAsesoria, ...newTerceroData };
                logAsesoria.TipoDocumento = tipoDocumento;
              }

              //Reemplazando null por string vacio
              Object.keys(logAsesoria).forEach(key => {
                if(logAsesoria[key] === null) logAsesoria[key] = '';
              });
              this.loading = false;
              this.Bloquear = false;
              this.BloquearValorTotal = false;
              this.BloquearCuotaMes = false;
              this.BloquearBuscar = false;
              this.BloquearNombre = false;
              this.BloquearProducto = false;
              this.BloquearAsesorExterno = false;
              this.BloquearPeriodo = false;
              this.BloquearNegociacion = false;
              this.btnActualizar = true;
              this.btnGuardar = true;
              this.MapearAsesoria(result);
              this.GuardarlogAsesoria(logAsesoria, 43);
              this.notif.onSuccess('Exitoso', 'La asesoría  se guardó correctamente.');
              this.asesoriacontractualOperacionFrom.get('Codigo')?.reset();
              this.ModalImpresionAsesoria.nativeElement.click();
              this.ObtenerHistorial();
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        }
      });
    }
  }

  GuardarlogAsesoria(objLog: any, operationNumber: number) {
    const currentDate = formatDate(new Date().toISOString(), 'yyyy/MM/dd HH:mm:ss', 'en');
    this.generalesService.GuardarlogAsesoria(objLog, operationNumber, currentDate, 60, this.asesoriacontractualFrom.get('NumeroAsesoria')?.value)
      .subscribe(
        result => {
          this.loading = false;
          this.ObtenerHistorial()
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
  }

  ObtenerHistorial() {
    const NumeroAsesoria = this.asesoriacontractualFrom.get('NumeroAsesoria')?.value;
    this.AsesoriaContractualServices.ObtenerHistorial(NumeroAsesoria).subscribe(
        result => {
          this.dataHistorial = result.map((data: any) => ({ ...data, Detalles: data.Detalles?.replace(/[{}"]+/gi, '')?.replace(/,/g, ' ') }));
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
  }
  private returnFormatNum(num : string): string {
    num = num.toString();
    num = num.slice(0, (num.indexOf('.')) + 5);
    return num;
  }
  private returnFormatNumImpresion(num : string): string {
    num = num.toString();
    num = num.slice(0, (num.indexOf('.')) + 3);
    return num;
  }
  NombresCapitaliceBasico() {
    let self = this;
    $('#priApe').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
    $('#segApe').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
    $('#priNom').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
    $('#segNom').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  validarValorCampo() {
    // console.log('blur')
  }

  GuardarNombre() {
    const requiredFieldNames = ['PrimerNombre', 'TelefonoAsesoria'];
    if (this.creacionFrom.get('TipoDocumento')?.value != 3) requiredFieldNames.push('PrimerApellido');
    const isSomeRequiredFieldMissing = requiredFieldNames.some(fieldName => !this.creacionFrom.get(fieldName)?.value || !(this.creacionFrom.get(fieldName)?.value + '').trim());
    if (isSomeRequiredFieldMissing) {
      this.notif.onWarning('Advertencia', 'Los campos con asterisco son obligatorios.');
      return;
    }

    function capitalize(str: string) {
      return str.replace(/^\w/, (c) => c.toUpperCase()).toLowerCase();
    }

    const primerNombre = this.creacionFrom.get('PrimerNombre')?.value || '';
    const segundoNombre = this.creacionFrom.get('SegundoNombre')?.value || '';
    const primerApellido = this.creacionFrom.get('PrimerApellido')?.value || '';
    const segundoApellido = this.creacionFrom.get('SegundoApellido')?.value || '';
    const fullName = [primerNombre, segundoNombre, primerApellido, segundoApellido].filter(Boolean).map(n => capitalize(n.trim()) ).join(' ');
    this.asesoriacontractualFrom.get('Nombre')?.setValue(fullName);
    this.BloquearProducto = null;
    this.MostrasAlertaAsociado = false;
    this.CerrarCreacionNombre.nativeElement.click();
    this.asesoriacontractualFrom.get('Clase')?.setValue(15);
  }

  CerrarNombre() {
    this.creacionFrom.reset();
    this.isCreationButtonDisabled = true;
    this.BloquearNuevoAsociadoForm = true;
    this.asesoriacontractualFrom.get('Nombre')?.reset();
    this.asesoriacontractualFrom.get('NumeroDocumento')?.reset();
  }
  VolverArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
  VolverAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
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
    const CuotaMes = new FormControl('', [Validators.pattern('[0-9]*')]);
    const ValorPlan = new FormControl('', [Validators.required]);
    const TasaNominal = new FormControl('', [Validators.required]);
    const TasaEfectiva = new FormControl('', [Validators.required]);
    const NombreOficina = new FormControl('', [Validators.required]);
    const NumeroOficina = new FormControl('', [Validators.required]);
    const IdAsesor = new FormControl('', [Validators.required]);
    const NombreAsesor = new FormControl('', [Validators.required]);
    const IdPeriodo = new FormControl('', [Validators.required]);
    const BuscarDocumento = new FormControl('', [Validators.pattern('[0-9]*')]);
    const BuscarNombre = new FormControl('', []);
    const Nombre = new FormControl('', [Validators.required]);
    const NumeroDocumento = new FormControl('', [Validators.required, Validators.pattern('[0-9a-zA-Z]{3,15}')]);
    const InteresBruto = new FormControl('', []);
    const Retencion = new FormControl('', []);
    const TotalInteres = new FormControl('', []);
    const FechaVencimiento = new FormControl('', []);
    const FechaCreacion = new FormControl('', []);
    const IdAsesorExterno = new FormControl('', []);
    const PrimerNombre = new FormControl({ value: '', disabled: true }, [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const SegundoNombre = new FormControl({ value: '', disabled: true }, [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const PrimerApellido = new FormControl({ value: '', disabled: true }, [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const SegundoApellido = new FormControl({ value: '', disabled: true }, [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const TelefonoAsesoria = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]{10}')]);
    const TipoDocumento = new FormControl('', []);
    const NombreModalidad = new FormControl('', []);

    this.asesoriacontractualFrom = new FormGroup({
      NumeroAsesoria: NumeroAsesoria,
      IdProducto: IdProducto,
      DescripcionProducto: DescripcionProducto,
      IdRelacionTipo: IdRelacionTipo,
      Clase: Clase,
      Plazo: Plazo,
      CuotaMes: CuotaMes,
      ValorPlan: ValorPlan,
      TasaNominal: TasaNominal,
      TasaEfectiva: TasaEfectiva,
      NombreOficina: NombreOficina,
      NumeroOficina: NumeroOficina,
      IdAsesor: IdAsesor,
      NombreAsesor: NombreAsesor,
      strCodigo: strCodigo,
      strNombre: strNombre,
      IdPeriodo: IdPeriodo,
      BuscarDocumento: BuscarDocumento,
      BuscarNombre: BuscarNombre,
      Nombre: Nombre,
      TipoDocumento: TipoDocumento,
      NumeroDocumento: NumeroDocumento,
      InteresBruto: InteresBruto,
      Retencion: Retencion,
      TotalInteres: TotalInteres,
      FechaVencimiento: FechaVencimiento,
      FechaCreacion: FechaCreacion,
      IdAsesorExterno: IdAsesorExterno,
      PrimerNombre: PrimerNombre,
      SegundoNombre: SegundoNombre,
      PrimerApellido: PrimerApellido,
      SegundoApellido: SegundoApellido,
      TelefonoAsesoria: TelefonoAsesoria,
      NombreModalidad: NombreModalidad

    });
    this.asesoriacontractualOperacionFrom = new FormGroup({
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

  }

}
