import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AportesService } from '../../../Services/Productos/aportes.service';
import { FormControl, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import swal from 'sweetalert2';
import { DatePipe, formatDate } from '@angular/common';
import { GeneralesService } from '../../../Services/Productos/generales.service';
import { OperacionesService } from '../../../Services/Maestros/operaciones.service';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../../Services/Login/login.service';
import { AperturaCuentaDto, CambiarAsesorDto, CambiarFormaPagoDto } from '../../../Models/Productos/aportesJsonDto';
import { ClientesService } from '../../../Services/Clientes/clientes.service';
import { JuridicosService } from '../../../Services/Clientes/Juridicos.service';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-aportes',
  templateUrl: './aportes.component.html',
  styleUrls: ['./aportes.component.css'],
  providers: [AportesService, GeneralesService, OperacionesService, ModuleValidationService, LoginService,ClientesService,JuridicosService],
  standalone : false
})
export class AportesComponent implements OnInit {

  @ViewChild('ModalAportes', { static: true }) private ModalAportes!: ElementRef;
  @ViewChild('BuscarAsociados', { static: true }) private BuscarAsociados!: ElementRef;
  @ViewChild('ModalAsociados', { static: true }) private ModalAsociados!: ElementRef;
  @ViewChild('ModalAsesores', { static: true }) private ModalAsesores!: ElementRef;
  @ViewChild('ModalAsesoresExterno', { static: true }) private ModalAsesoresExterno!: ElementRef;
  @ViewChild('tab1', { static: true }) private tab1!: ElementRef;
  @ViewChild('tab2', { static: true }) private tab2!: ElementRef;
  @ViewChild('AsesorExterno', { static: true }) private AsesorExterno!: ElementRef;
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public ColorAnterior1: any;
  public ColorAnterior2: any;
  public ColorAnterior3: any;
  public ColorAnterior4: any;
  public ColorAnterior5: any;
  public ColorAnterior6: any;
  dataObjetBeneficiarios: any[] = [];

  public aportesFrom!: FormGroup;
  public aportesOperacionFrom!: FormGroup;
  public AsesorFrom!: FormGroup;
  public CambioEstadoFrom!: FormGroup;
  public resultOperaciones : any;
  public resultProducto: any;
  public resultFormaPago: any;
  public resultUsuario: any;
  public resultEncabezado: any;
  public resultCuenta: any;
  public resultParentesco: any;
  public resultTipoDocumento: any;
  public resultBeneficiario: any;
  public resultAsociados: any;
  public resultAsesores: any;
  public resultAsesoresExterno: any;
  public resultEstados: any;
  public resultComentario: any;
  public dataBeneficiario: any;
  public datoformaPago: any;
  public datoAsesorExterno: any;
  public datoIdOficina: any;
  public datoIdProducto: any;
  public datoIdConsecutivo: any;


  public Bloquear : boolean | null = false;
  public BloquearEstado : boolean | null = false;
  public BloquearFormaPago : boolean | null = false;
  public BloquearDatoBenf : boolean | null = false;
  public BloquearNombreBenf : boolean | null = false;
  public BloquearLimpiarBenefBtn : boolean | null = false;
  public BloquearGuardar : boolean | null = false;
  public BloquearAsociado : boolean | null = false;
  public BloquearBuscar : boolean | null = false;
  public BloquearbtnBenef : boolean | null = false;
  public BloquearDatoBenfBtn : boolean | null = false;
  public BloquearAsesorExterno : boolean | null = false;
  public BloquearConsultaCuenta : boolean | null = false;
  public bloquearbtnActalizar : boolean | null = false;

  public indefinido = undefined;
  public validar = true;

  public saldoInicial : any;
  public revalorizacion: any;
  public saldoCanje: any;
  public saldoEfectivo: any;
  public sumaTotal: any;

  activaSaldos = false;
  activaBeneficiarios = false;
  activaHistorial = false;

  btnGuardar = true;
  btnActualizar = true;
  btnActualizarBeneficiario = true;
  DescriObservacion = true;
  inputEstado = false;
  selectEstado = true;


  btnActualizarBeneficiarios: boolean = false;
  public bloquearDocumentoBenf: boolean = false;
  btnOpcionActualizarBeneficiario = false;
  BenificiariosElminar: any[] = [];
  dataBeneficiarioslist: any; 
  dataBeneficiariosEliminados: any = [] //Beneficiarios eliminados
  beneficiarioAEditarAUX: any = [];
  dataCambioAsesorExterno: any = [];
  dataCambioForma: any = [];
  asociadoModal: any[] = [];
  dataAportes: any;
  dataAsociados: any;
  dataObjet: any;
  btnCambiarEstado: boolean = true; 
  bloquearbtnCambioEstado: boolean = false;
  public datoOficina: any;
  public datoProducto: any;
  public datoNombreProducto: any;
  public datoConsecutivo: any;
  public datoDigito: any;
  datoCambioEstado: any;


  //estado para el detalle
  widthDetalle = 300

  dataHistorial: any[] = [];
  dataUser: any;
  dataAsesor: any;
  dataModulo: any;
  array: any[] = [];
  resultGuardar: any;
  contardor: any;
  FechaActual: string = "";
  dataObservacion: any;
  indexBeneficiarios : number = 0;
  operacionEscogida = '';
  private CodModulo = 16;
  public DatosUsuario: any;
  constructor(private aportesServices: AportesService,
    private notif: NgxToastService,
    private generalesService: GeneralesService,
    private operacionesService: OperacionesService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef,
    private loginService: LoginService, private router: Router, private clientesService: ClientesService,
  private JuridicosService : JuridicosService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.NombresCapitaliceBasico();
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.activaSaldos = true;
    this.ValidateForm();
    this.Operaciones();
    this.FormaPago();
    this.Parentesco();
    this.ObtenerTipoDocumento();
    this.VolverArriba();
    $('#select').focus().select();
    localStorage.removeItem('TerceroAportes');
    this.aportesFrom.get('DocumentoBeneficiario')?.disable();
    let data = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
  }
  ValorSeleccionado() {
    this.aportesFrom.get('Porcentaje')?.setValue("");
    this.aportesFrom.get('DatosParentesco')?.setValue("");
    this.aportesFrom.get('DocumentoBeneficiario')?.setValue("");
    this.aportesFrom.get('Porcentaje')?.disable();
    this.aportesFrom.get('DatosParentesco')?.disable();
    this.aportesFrom.get('DocumentoBeneficiario')?.disable();
    this.LimpiarBeneficiarior();
    this.BloquearLimpiarBenefBtn = false;
    this.btnOpcionActualizarBeneficiario = true;
    this.bloquearbtnActalizar = false;
    this.bloquearDocumentoBenf = false;
    this.btnActualizarBeneficiarios = false;
    this.btnCambiarEstado = true;
    this.BloquearDatoBenf = null;
  if (((this.aportesFrom.get('IdEstado')?.value  == 25 || this.aportesFrom.get('IdEstado')?.value  == 10) && this.aportesOperacionFrom.get('Codigo')?.value  != '2' ) &&  this.aportesOperacionFrom.get('Codigo')?.value  != '10')
    {
      this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
      this.aportesOperacionFrom.get('Codigo')?.reset()
      return;
    }
    this.dataObjetBeneficiarios = [];
    if (this.aportesOperacionFrom.get('Codigo')?.value  !== '2' && this.aportesOperacionFrom.get('Codigo')?.value  !== '10' &&
    this.aportesOperacionFrom.get('Codigo')?.value  !== '40' && this.aportesOperacionFrom.get('Codigo')?.value  !== '13')
      this.BuscarPorCuenta(true);
    if (this.aportesOperacionFrom.get('Codigo')?.value  === '10') {         // Apertura Cuenta
      let data = localStorage.getItem('Data');
      this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
      localStorage.removeItem('TerceroAportes');
      if (this.dataUser.NumeroOficina === '3') {
        this.notif.onWarning('Advertencia', 'No se puede abrir una cuenta en la oficina de administración.');
        this.BloquearBuscar = false;
        this.BloquearConsultaCuenta = false;        
        this.clearFrom();
        this.LimpiarBeneficiarior();        
      } else {
        this.generalesService.Autofocus('selectAsociado');
        this.clearFormAportes();
        this.clearFrom();
        this.LimpiarBeneficiarior();
        this.MapearDatosUsuario();
        this.Encabezado();
        this.OperacionPermitida();
        this.operacionEscogida = '/Apertura cuenta';
        this.BloquearDatoBenf = false;
        this.BloquearNombreBenf = false;
        this.BloquearFormaPago = null;
        this.BloquearGuardar = null;
        this.BloquearAsociado = null;
        this.BloquearAsesorExterno = null;
        this.BloquearbtnBenef = null;
        this.BloquearBuscar = false;
        this.BloquearEstado = false;
        this.BloquearConsultaCuenta = false;
        this.btnActualizar = true;
        this.btnActualizarBeneficiario = true;
        this.btnGuardar = false;
        this.bloquearbtnActalizar = false;
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        this.btnCambiarEstado = true;
        this.selectEstado = true;
        this.inputEstado = false;
        this.generalesService.Autofocus('SelectBuscar');
        $('#beneficiarios').removeClass('activar');
        $('#beneficiarios').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      }
    } else if (this.aportesOperacionFrom.get('Codigo')?.value  === '21') {  // Cambiar forma de pago
      if (this.aportesFrom.get('IdOficina')?.value  !== null
        && this.aportesFrom.get('IdOficina')?.value  !== undefined
        && this.aportesFrom.get('IdOficina')?.value  !== ''
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== null
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== undefined
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== ''
        && this.aportesFrom.get('IdConsecutivo')?.value  !== null
        && this.aportesFrom.get('IdConsecutivo')?.value  !== undefined
        && this.aportesFrom.get('IdConsecutivo')?.value  !== ''
        && this.aportesFrom.get('IdDigito')?.value  !== null
        && this.aportesFrom.get('IdDigito')?.value  !== undefined
        && this.aportesFrom.get('IdDigito')?.value  !== ''
        && this.aportesFrom.get('NumeroDocumento')?.value  !== null
        && this.aportesFrom.get('NumeroDocumento')?.value  !== undefined
        && this.aportesFrom.get('NumeroDocumento')?.value  !== ''
      ) {
        this.operacionEscogida = '/Cambiar forma de pago';
        this.generalesService.Autofocus('selectFormaPago');
        this.aportesFrom.get('DocumentoBeneficiario')?.disable();
        this.BloquearAsociado = false;
        this.BloquearFormaPago = null;
        this.BloquearGuardar = null;
        this.BloquearEstado = false;
        this.BloquearConsultaCuenta = false;
        this.BloquearBuscar = false;
        this.btnActualizar = false;
        this.btnActualizarBeneficiario = true;
        this.btnGuardar = true;
        this.BloquearAsesorExterno = false;
        this.BloquearDatoBenf = false;
        this.BloquearNombreBenf = false;
        this.BloquearbtnBenef = false;
        this.selectEstado = true;
        this.inputEstado = false;
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        this.generarCambioFormaPago('Anterior');
        $('#beneficiarios').removeClass('activar');
        $('#beneficiarios').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.aportesOperacionFrom.get('Codigo')?.reset();
        this.clearFormAportes();
        this.BloquearAsociado = false;
        this.BloquearAsesorExterno = false;
        this.BloquearFormaPago = false;
        this.dataObservacion = undefined;
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        $('#beneficiarios').removeClass('activar');
        $('#beneficiarios').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      }
    } else if (this.aportesOperacionFrom.get('Codigo')?.value  === '2') {   // Buscar
      this.generalesService.Autofocus('selectBuscar');
      this.aportesFrom.get('DocumentoBeneficiario')?.disable();
      this.clearFrom();
      localStorage.removeItem('TerceroAportes');
      this.operacionEscogida = '/Buscar';
      this.BloquearAsociado = false;
      this.BloquearBuscar = null;
      this.BloquearConsultaCuenta = null;
      this.BenificiariosElminar = [];
      this.BloquearFormaPago = false;
      this.BloquearDatoBenf = false;
      this.BloquearNombreBenf = false;
      this.BloquearGuardar = false;
      this.BloquearEstado = false;
      this.btnGuardar = true;
      this.btnActualizar = true;
      this.selectEstado = true;
      this.inputEstado = false;
      this.btnActualizarBeneficiario = true;
      this.BloquearAsesorExterno = false;
      this.BloquearbtnBenef = false;
      this.bloquearbtnActalizar = false;
      this.devolverTab(1);
      this.tab1.nativeElement.click();
      this.clearFrom;
      $('#beneficiarios').removeClass('activar');
      $('#beneficiarios').removeClass('active');
      $('#historial').removeClass('activar');
      $('#historial').removeClass('active');
    } else if (this.aportesOperacionFrom.get('Codigo')?.value  === '11') {  //  Adicionar/Eliminar Beneficiarios
      if (this.aportesFrom.get('IdOficina')?.value  !== null
        && this.aportesFrom.get('IdOficina')?.value  !== undefined
        && this.aportesFrom.get('IdOficina')?.value  !== ''
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== null
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== undefined
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== ''
        && this.aportesFrom.get('IdConsecutivo')?.value  !== null
        && this.aportesFrom.get('IdConsecutivo')?.value  !== undefined
        && this.aportesFrom.get('IdConsecutivo')?.value  !== ''
        && this.aportesFrom.get('IdDigito')?.value  !== null
        && this.aportesFrom.get('IdDigito')?.value  !== undefined
        && this.aportesFrom.get('IdDigito')?.value  !== ''
        && this.aportesFrom.get('NumeroDocumento')?.value  !== null
        && this.aportesFrom.get('NumeroDocumento')?.value  !== undefined
        && this.aportesFrom.get('NumeroDocumento')?.value  !== ''
      ) {
        this.operacionEscogida = '/Adicionar y/o eliminar beneficiario';
        setTimeout((x : any) => {
          this.generalesService.Autofocus('selectbnf');
        }, 400);
        this.BloquearAsociado = false;
        this.BloquearDatoBenf = false;
        this.BloquearDatoBenfBtn = true;
        this.BloquearNombreBenf = false;
        this.BloquearBuscar = false;
        this.BloquearFormaPago = false;
        this.BloquearConsultaCuenta = false;
        this.BloquearGuardar = null;
        this.BloquearbtnBenef = null;
        this.BloquearEstado = false;
        this.btnActualizar = true;
        this.selectEstado = true;
        this.inputEstado = false;
        this.btnActualizarBeneficiario = false;
        this.btnOpcionActualizarBeneficiario = false;
        this.btnGuardar = true;
        this.BloquearAsesorExterno = false;
        this.bloquearbtnActalizar = false;
        this.devolverTab(2);
        this.BloquearLimpiarBenefBtn = false;
        this.tab2.nativeElement.click();
        this.VolverAbajo();
        $('#Saldos').removeClass('activar');
        $('#Saldos').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.aportesOperacionFrom.get('Codigo')?.reset();
        this.clearFormAportes();
        this.BloquearAsociado = false;
        this.BloquearAsesorExterno = false;
        this.BloquearFormaPago = false;
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        $('#beneficiarios').removeClass('activar');
        $('#beneficiarios').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      }
    } else if (this.aportesOperacionFrom.get('Codigo')?.value  === '19') {  // Cambiar asesor externo
      if (this.aportesFrom.get('IdOficina')?.value  !== null
        && this.aportesFrom.get('IdOficina')?.value  !== undefined
        && this.aportesFrom.get('IdOficina')?.value  !== ''
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== null
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== undefined
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== ''
        && this.aportesFrom.get('IdConsecutivo')?.value  !== null
        && this.aportesFrom.get('IdConsecutivo')?.value  !== undefined
        && this.aportesFrom.get('IdConsecutivo')?.value  !== ''
        && this.aportesFrom.get('IdDigito')?.value  !== null
        && this.aportesFrom.get('IdDigito')?.value  !== undefined
        && this.aportesFrom.get('IdDigito')?.value  !== ''
        && this.aportesFrom.get('NumeroDocumento')?.value  !== null
        && this.aportesFrom.get('NumeroDocumento')?.value  !== undefined
        && this.aportesFrom.get('NumeroDocumento')?.value  !== ''
      ) {
        this.AsesorExterno.nativeElement.focus();
        this.operacionEscogida = '/Cambiar asesor externo';
        this.generalesService.Autofocus('AsesorExterno');
        this.aportesFrom.get('DocumentoBeneficiario')?.disable();
        this.BloquearAsociado = false;
        this.BloquearFormaPago = false;
        this.BloquearGuardar = null;
        this.BloquearEstado = false;
        this.BloquearConsultaCuenta = false;
        this.BloquearBuscar = false;
        this.btnActualizar = false;
        this.btnActualizarBeneficiario = true;
        this.btnGuardar = true;
        this.BloquearAsesorExterno = null;
        this.BloquearDatoBenf = false;
        this.BloquearNombreBenf = false;
        this.BloquearbtnBenef = false;
        this.bloquearbtnActalizar = false;
        this.selectEstado = true;
        this.inputEstado = false;
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        this.generarCambioAsesor('Anterior')
        $('#beneficiarios').removeClass('activar');
        $('#beneficiarios').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.aportesOperacionFrom.get('Codigo')?.reset();
        this.clearFormAportes();
        this.BloquearAsociado = false;
        this.BloquearAsesorExterno = false;
        this.BloquearFormaPago = false;
        this.dataObservacion = undefined;
        this.devolverTab(1);
        this.tab1.nativeElement.click();
        $('#beneficiarios').removeClass('activar');
        $('#beneficiarios').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
      }
    
      

    } else if (this.aportesOperacionFrom.get('Codigo')?.value  === '9') {   // Cambio de estado
      if (this.aportesFrom.get('IdOficina')?.value  !== null
        && this.aportesFrom.get('IdOficina')?.value  !== undefined
        && this.aportesFrom.get('IdOficina')?.value  !== ''
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== null
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== undefined
        && this.aportesFrom.get('IdProductoCuenta')?.value  !== ''
        && this.aportesFrom.get('IdConsecutivo')?.value  !== null
        && this.aportesFrom.get('IdConsecutivo')?.value  !== undefined
        && this.aportesFrom.get('IdConsecutivo')?.value  !== ''
        && this.aportesFrom.get('IdDigito')?.value  !== null
        && this.aportesFrom.get('IdDigito')?.value  !== undefined
        && this.aportesFrom.get('IdDigito')?.value  !== ''
      ) {
        if (this.aportesFrom.get('IdEstado')?.value  !== 25 && this.aportesFrom.get('IdEstado')?.value  !== 10) {
          if (this.aportesFrom.get('IdEstado')?.value  === 20) {
            this.bloquearbtnCambioEstado = false;
          }
          if (this.DatosUsuario.NumeroOficina != "3" && this.DatosUsuario.NumeroOficina != this.aportesFrom.get('IdOficina')?.value ) {
            this.notif.onWarning('Advertencia', 'Cuenta tiene otra oficina asignada.');
            this.aportesOperacionFrom.get('Codigo')?.reset();
            return;
          }
          console.log("222",this.dataObjet.IdTipoDocumento )
          this.datoCambioEstado = this.aportesFrom.get('IdEstado')?.value ;
          this.ObtenerEstado();
          this.inputEstado = true;
          this.selectEstado = false;
          this.BloquearEstado = null;
          this.btnCambiarEstado = false;
          this.btnActualizar = true;
          this.btnGuardar = true;
          this.BloquearAsesorExterno = false;
          this.bloquearbtnActalizar = false;
          this.operacionEscogida = '/ Cambio de estado';
        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.aportesOperacionFrom.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.aportesOperacionFrom.get('Codigo')?.reset();
      }
    }
    this.ResetValorSeleccionado();
  }

  selectEstadoActivo() {
    this.bloquearbtnCambioEstado = true;
  }

  cambiarEstado() {
    let tempListEstados: any[] = [
      { id: 45, descripcion: "Nuevo" },
      { id: 5, descripcion: "Activa" },
      { id: 10, descripcion: "Anulada" },
      { id: 20, descripcion: "Bloqueado" },
      { id: 30, descripcion: "Embargada" }];
    let estadoLog: any = {
      EstadoAnterior: tempListEstados.filter(x => x.id == this.datoCambioEstado)[0].descripcion,
      EstadoActualiza: tempListEstados.filter(x => x.id == this.aportesFrom.get('IdEstado')?.value )[0].descripcion,
    }
    if (this.aportesFrom.get('IdEstado')?.value  === '10') { // Anular
      this.aportesServices.getAnularCuenta(this.aportesFrom.value).subscribe(
        result => {
          if (result.AlertasDto !== null) {
            this.aportesFrom.get('IdEstado')?.setValue(this.datoCambioEstado);
          this.notif.onWarning('Advertencia', result.AlertasDto.Mensaje);
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnCambiarEstado = true;
          this.bloquearbtnCambioEstado = false;
          this.CambioEstadoFrom.reset();
          this.aportesOperacionFrom.get('Codigo')?.reset();
        } else {
          this.inputEstado = false;
            this.notif.onSuccess('Exitoso', 'El cambio estado se realizó correctamente.');
            let payload: any = {
              idRelacion : 15,
              idTercero : this.aportesFrom.get('LngTercero')?.value ,
              idTipoDocumento :this.dataObjet.IdTipoDocumento,
              idTutor : null,
              userWork : this.dataUser.Usuario
            }
           
            setTimeout(() => {
               if(this.dataObjet.IdTipoDocumento  != 3)
                this.CambiarRelacion(payload);
               else
                 this.CambiarRelacionJuridico(payload);
              this.Guardarlog(estadoLog);
              this.selectEstado = true;
              this.BuscarPorCuenta();
              this.CambioEstadoFrom.reset();
              this.btnCambiarEstado = true;
              this.aportesOperacionFrom.get('Codigo')?.reset();
              setTimeout(() => {
                this.ObtenerHistorial();
              }, 1200);
            }, 500);
        }
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
        this.aportesOperacionFrom.get('Codigo')?.reset();
      });
    }
  }
  CambiarRelacionJuridico(payload: any) {        
    this.JuridicosService.CambiarRelacion(this.dataObjet.LngTercero, "15", this.dataObjet.NumeroDocumento, this.dataUser.Usuario, this.dataObjet.IdObjetoSocial).subscribe(x => {
      console.log(x)
    });
  }
  CambiarRelacion(payload: any) {
    this.clientesService.CambiarRelacion(payload).subscribe(x => {
      console.log("relacion",x)
    });
  }
 ResetValorSeleccionado(tipo: number = 0) {
        if (this.aportesOperacionFrom.get('Codigo')?.value  != '10'
          && this.aportesOperacionFrom.get('Codigo')?.value  != '21'
          && this.aportesOperacionFrom.get('Codigo')?.value  != '2'
          && this.aportesOperacionFrom.get('Codigo')?.value  != '11'
          && this.aportesOperacionFrom.get('Codigo')?.value  != '19'
          && this.aportesOperacionFrom.get('Codigo')?.value  != '9')
            this.aportesOperacionFrom.get('Codigo')?.reset();
        if (tipo == 1 && this.aportesOperacionFrom.get('Codigo')?.value  == '2')
          this.aportesOperacionFrom.get('Codigo')?.reset();
      }
 
  FormaPagoSeleccionada() {
    if (this.aportesFrom.get('IdFormaPago')?.value  === '0') {
      this.bloquearbtnActalizar = true;
    } else if (this.aportesFrom.get('IdFormaPago')?.value  === '1') {
      this.bloquearbtnActalizar = true;
    } else if (this.aportesFrom.get('IdFormaPago')?.value  === '2') {
      this.ÖbtenerConvenio();
    }
  }
  MapearDatosUsuario() {
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.aportesFrom.get('NombreOficina')?.setValue(this.dataUser.Oficina);
    this.aportesFrom.get('NumeroOficina')?.setValue(this.dataUser.NumeroOficina);
    this.aportesFrom.get('IdAsesor')?.setValue(this.dataUser.IdAsesor);
    this.aportesFrom.get('NombreAsesor')?.setValue(this.dataUser.Nombre);
  }
  MapearDatosAsesor(datos : any) {
    if (datos.length >= 1) {
      this.aportesFrom.get('IdAsesor')?.setValue(datos[0].IdAsesor);
      this.aportesFrom.get('NombreAsesor')?.setValue(datos[0].Nombre);
    } else {
      this.aportesFrom.get('IdAsesor')?.setValue(datos.IdAsesor);
      this.aportesFrom.get('NombreAsesor')?.setValue(datos.Nombre);
    }
  }
  MapearDatosAsesorExterno(datos : any) {
    this.AsesorFrom.get('strCodigo')?.setValue(datos.intIdAsesor);
    this.AsesorFrom.get('strNombre')?.setValue(datos.Nombre);
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
    this.loading = true;
    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(
      result => {
        this.loading = false;
        this.resultOperaciones = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  Encabezado() {
    this.loading = true;
    this.aportesServices.getEncabezado().subscribe(
      result => {
        this.loading = false;
        this.aportesFrom.get('IdProducto')?.setValue(result[1].IdProducto);
        this.aportesFrom.get('DescripcionProducto')?.setValue(result[1].DescripcionProducto);
        this.aportesFrom.get('IdEstado')?.setValue(result[0].IdEstado);
        this.aportesFrom.get('DescripcionEstado')?.setValue(result[0].DescripcionEstado);
        this.aportesFrom.get('DescripcionFormaPago')?.setValue(result[2].DescripcionFormaPago);
        this.aportesFrom.get('IdFormaPago')?.setValue(result[2].IdFormaPago);
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ObtenerEstado() {
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    let idmoduloActivo = localStorage.getItem('IdModuloActivo');
    const arrayExample = {
      'IdOperacion': +this.aportesOperacionFrom.get('Codigo')?.value ,
      'IdPerfil': this.dataUser.idPerfilUsuario,
      'IdModulo': JSON.parse(window.atob(idmoduloActivo == null ? "" : idmoduloActivo))
    };
    this.loading = true;
    this.operacionesService.ObtenerEstadosXOperacionesData(arrayExample).subscribe(
      result => {
        setTimeout(() => {
          this.resultEstados = result;
          this.aportesFrom.get('IdEstado')?.setValue("0");
          $('#SelectEstadoCuenta').focus().select();
          this.loading = false;
        }, 1000);
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarProducto() {
    let IdProducto = '*';
    let Descripcion = '*';
    if (this.aportesFrom.get('IdProducto')?.value  !== null
      && this.aportesFrom.get('IdProducto')?.value  !== undefined
      && this.aportesFrom.get('IdProducto')?.value  !== '') {
      this.aportesFrom.get('DescripcionProducto')?.setValue('');
      IdProducto = this.aportesFrom.get('IdProducto')?.value ;
    } else if (this.aportesFrom.get('DescripcionProducto')?.value  !== null
      && this.aportesFrom.get('DescripcionProducto')?.value  !== undefined
      && this.aportesFrom.get('DescripcionProducto')?.value  !== '') {
      Descripcion = this.aportesFrom.get('DescripcionProducto')?.value ;
    }
    this.loading = true;
    this.aportesServices.getBuscarProducto(IdProducto, Descripcion).subscribe(
      result => {
        this.loading = false;
        if (result.length === 0) {
          this.notif.onWarning('Advertencia', 'No se encontró el producto.');
        } else if (result.length === 1) {
          this.aportesFrom.get('IdProducto')?.setValue(result[0].IdProducto);
          this.aportesFrom.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
        } else if (result.length > 1) {
          this.resultProducto = result;
          this.ModalAportes.nativeElement.click();
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  MapearDatosProductos(datos : any) {
    this.aportesFrom.get('IdProducto')?.setValue(datos.IdProducto);
    this.aportesFrom.get('DescripcionProducto')?.setValue(datos.DescripcionProducto);
  }
  BuscarPorCuenta(actualizar : boolean = false) {
    if (this.aportesFrom.get('IdOficina')?.value  !== ''
      && this.aportesFrom.get('IdOficina')?.value  !== undefined
      && this.aportesFrom.get('IdOficina')?.value  !== null
      && this.aportesFrom.get('IdProductoCuenta')?.value  !== ''
      && this.aportesFrom.get('IdProductoCuenta')?.value  !== undefined
      && this.aportesFrom.get('IdProductoCuenta')?.value  !== null
      && this.aportesFrom.get('IdConsecutivo')?.value  !== ''
      && this.aportesFrom.get('IdConsecutivo')?.value  !== undefined
      && this.aportesFrom.get('IdConsecutivo')?.value  !== null
      && this.aportesFrom.get('IdDigito')?.value  !== ''
      && this.aportesFrom.get('IdDigito')?.value  !== undefined
      && this.aportesFrom.get('IdDigito')?.value  !== null
    ) {
      this.Bloquear = false;
      this.BloquearFormaPago = false;
      this.BloquearDatoBenf = false;
      this.BloquearNombreBenf = false;
      this.BloquearGuardar = false;
      this.BloquearAsociado = false;
      this.BloquearBuscar = false;
      this.BloquearbtnBenef = false;
      this.loading = true;
      this.generalesService.Autofocus('SelectBuscar');
      this.aportesServices.getBuscarCuenta(this.aportesFrom.value).subscribe(
        result => {
          this.loading = false;
          if (result !== null) {
            if (result.Beneficiarios !== null && result.Beneficiarios !== undefined) {
              result.Beneficiarios.forEach(( elementBeneficiarios :  any) => {
                this.resultParentesco.forEach(( elementParentesco :  any) => {
                  if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                    elementBeneficiarios.DatosParentesco = elementParentesco;
                  }
                });
              });
            }
            this.ResetValorSeleccionado(1);
            this.MapearDatosCuenta(result);
          } else {
            this.notif.onWarning('Advertencia', 'La cuenta no existe.');
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
          this.notif.onWarning('Advertencia', 'La cuenta no existe.');
          this.clearBeneficiario();
          this.clearCampos();
          this.aportesFrom.get('IdOficina')?.reset();
          this.aportesFrom.get('IdProductoCuenta')?.reset();
          this.aportesFrom.get('IdConsecutivo')?.reset();
          this.aportesFrom.get('IdDigito')?.reset();
          this.BloquearBuscar = null;
          this.dataObjet = undefined;
        }
      );
    } else if(actualizar == false){
      this.notif.onWarning('Advertencia', 'Número de cuenta incompleto.');
    }
  }
  BuscarDatosCuenta(IdOficina : number, IdProductoCuenta : number, IdConsecutivo : number, IdDigito : number) {
    this.loading = true;
    this.aportesServices.getBuscarCuenta
      ({ 'IdOficina': IdOficina, 'IdProductoCuenta': IdProductoCuenta, 'IdConsecutivo': IdConsecutivo, 'IdDigito': IdDigito }).subscribe(
        result => {
          this.loading = false;
          if (result.Beneficiarios !== null && result.Beneficiarios !== undefined) {
            result.Beneficiarios.forEach(( elementBeneficiarios :  any) => {
              this.resultParentesco.forEach(( elementParentesco :  any) => {
                if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                  elementBeneficiarios.DatosParentesco = elementParentesco;
                }
              });
            });
          }
          this.MapearDatosCuenta(result);
          this.btnActualizar = true;
          this.btnActualizarBeneficiario = true;
          this.btnGuardar = true;
          this.aportesOperacionFrom.get('Codigo')?.reset();
          this.BloquearFormaPago = false;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
  }
  MapearDatosCuenta(result : any) {
    this.loading = true;
    console.log("usu",result)
    if (result !== null) {
      this.loading = false;
      let data = localStorage.getItem('Data');
      this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
      if (result.length >= 1) {
        this.dataObjet = result[0];
        localStorage.setItem('TerceroAportes', this.dataObjet.LngTercero);

        this.aportesFrom.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
        this.aportesFrom.get('LngTercero')?.setValue(this.dataObjet.LngTercero);
        this.aportesFrom.get('IdCuenta')?.setValue(this.dataObjet.IdCuenta);
        this.aportesFrom.get('NumeroDocumento')?.setValue(this.dataObjet.NumeroDocumento);
        this.aportesFrom.get('Nombre')?.setValue(this.dataObjet.PrimerApellido + ' ' + this.dataObjet.SegundoApellido + ' ' + this.dataObjet.PrimerNombre + ' ' + this.dataObjet.SegundoNombre);
        this.aportesFrom.get('IdAsesor')?.setValue(this.dataObjet.IdAsesor);
        if (this.aportesFrom.get('IdAsesor')?.value  === 2) {
          this.aportesFrom.get('NombreAsesor')?.setValue('Coogranada');
        } else {
          this.aportesFrom.get('NombreAsesor')?.setValue(this.dataObjet.PrimerApellidoAsesor + ' ' + this.dataObjet.SegundoApellidoAsesor + ' ' + this.dataObjet.PrimerNombreAsesor + ' ' + this.dataObjet.SegundoNombreAsesor);
        }
        this.aportesFrom.get('NumeroOficina')?.setValue(this.dataObjet.IdOficina);
        this.aportesFrom.get('NombreOficina')?.setValue(this.dataObjet.DescripcionOficina);
        this.aportesFrom.get('IdOficina')?.setValue(this.dataObjet.IdOficina);
        this.datoIdOficina = +this.dataObjet.IdOficina;
        this.datoOficina = this.dataObjet.IdOficina;
        this.datoProducto = this.dataObjet.IdProducto;
        this.datoConsecutivo = this.dataObjet.IdConsecutivo;
        this.datoDigito = this.dataObjet.IdDigito;
        this.datoNombreProducto = this.dataObjet.DescripcionProducto;
        this.datoCambioEstado = this.dataObjet.IdEstado;
        this.aportesFrom.get('IdProducto')?.setValue(this.dataObjet.IdProducto);
        this.datoIdProducto = +this.dataObjet.IdProducto;
        this.aportesFrom.get('DescripcionProducto')?.setValue(this.dataObjet.DescripcionProducto);
        this.aportesFrom.get('IdEstado')?.setValue(this.dataObjet.IdEstado);
        this.aportesFrom.get('DescripcionEstado')?.setValue(this.dataObjet.DescripcionEstado);
        this.aportesFrom.get('IdFormaPago')?.setValue(this.dataObjet.IdFormaPago);
        this.datoformaPago = +this.dataObjet.IdFormaPago;
        this.aportesFrom.get('DescripcionFormaPago')?.setValue(this.dataObjet.DescripcionFormaPago);
        this.aportesFrom.get('IdProductoCuenta')?.setValue(this.dataObjet.IdProducto);
        this.aportesFrom.get('IdConsecutivo')?.setValue(this.dataObjet.IdConsecutivo);
        this.datoIdConsecutivo = +this.dataObjet.IdConsecutivo;
        this.aportesFrom.get('IdDigito')?.setValue(this.dataObjet.IdDigito);
        this.aportesFrom.get('DescripcionOperacion')?.setValue(this.dataObjet.DescripcionOperacion);
        this.aportesFrom.get('Efectivo')?.setValue(this.dataObjet.Efectivo);
        this.aportesFrom.get('Canje')?.setValue(this.dataObjet.Canje);
        this.aportesFrom.get('SaldoInicial')?.setValue(this.dataObjet.SaldoInicial);
        this.aportesFrom.get('SaldoRevalorizacion')?.setValue(this.dataObjet.ValorRevalorizacion);
        this.aportesFrom.get('SaldoTotal')?.setValue(this.dataObjet.SaldoTotal);
        this.AsesorFrom.get('strCodigo')?.setValue(this.dataObjet.IdAsesorExterno);
        this.datoAsesorExterno = +this.dataObjet.IdAsesorExterno;
        this.AsesorFrom.get('strNombre')?.setValue(this.dataObjet.PrimerNombreAsesorE + ' ' + this.dataObjet.SegundoNombreAsesoreE + ' ' + this.dataObjet.PrimerApellidoAsesorE + ' ' + this.dataObjet.SegundoApellidoAsesorE);
        this.ValorTotal();
        this.ObtenerHistorial();
        this.aportesFrom.get('FechaApertura')?.setValue(new DatePipe('en-CO').transform(this.dataObjet.FechaApertura, 'yyyy/MM/dd  HH:mm:ss'));
        this.aportesFrom.get('FechaUltimaTrans')?.setValue(new DatePipe('en-CO').transform(this.dataObjet.FechaUltimaTrans, 'yyyy/MM/dd  HH:mm:ss'));
        if (this.dataObjet.FechaCancelacion != null) {
          this.aportesFrom.get('FechaCancelacion')?.setValue(new DatePipe('en-CO').transform(this.dataObjet.FechaCancelacion, 'yyyy/MM/dd  HH:mm:ss'));
        } else {
          this.aportesFrom.get('FechaCancelacion')?.reset();
        }
        if (this.dataObjet.FechaRevalorizacion != null) {
          this.aportesFrom.get('fechaRevalorizacion')?.setValue(new DatePipe('en-CO').transform(this.dataObjet.FechaRevalorizacion, 'yyyy/MM/dd  HH:mm:ss'));
        } else {
          this.aportesFrom.get('fechaRevalorizacion')?.reset();
        }
      } else {

        this.dataObjet = result;
       
        localStorage.setItem('TerceroAportes', this.dataObjet.LngTercero);
        this.aportesFrom.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
        this.aportesFrom.get('IdCuenta')?.setValue(this.dataObjet.IdCuenta);
        this.aportesFrom.get('LngTercero')?.setValue(this.dataObjet.LngTercero);
        this.aportesFrom.get('NumeroDocumento')?.setValue(this.dataObjet.NumeroDocumento);
        this.aportesFrom.get('Nombre')?.setValue(this.dataObjet.PrimerApellido + ' ' + this.dataObjet.SegundoApellido + ' ' + this.dataObjet.PrimerNombre + ' ' + this.dataObjet.SegundoNombre);
        this.aportesFrom.get('IdAsesor')?.setValue(this.dataObjet.IdAsesor);
        if (this.aportesFrom.get('IdAsesor')?.value  === 2) {
          this.aportesFrom.get('NombreAsesor')?.setValue('Coogranada');
        } else {
          this.aportesFrom.get('NombreAsesor')?.setValue(this.dataObjet.PrimerApellidoAsesor + ' ' + this.dataObjet.SegundoApellidoAsesor + ' ' + this.dataObjet.PrimerNombreAsesor + ' ' + this.dataObjet.SegundoNombreAsesor);
        }
        this.aportesFrom.get('NumeroOficina')?.setValue(this.dataObjet.IdOficina);
        this.aportesFrom.get('NombreOficina')?.setValue(this.dataObjet.DescripcionOficina);
        this.aportesFrom.get('IdOficina')?.setValue(this.dataObjet.IdOficina);
        this.datoIdOficina = +this.dataObjet.IdOficina;
        this.aportesFrom.get('IdProducto')?.setValue(this.dataObjet.IdProducto);
        this.datoIdProducto = +this.dataObjet.IdProducto;
        this.aportesFrom.get('DescripcionProducto')?.setValue(this.dataObjet.DescripcionProducto);
        this.aportesFrom.get('IdEstado')?.setValue(this.dataObjet.IdEstado);
        this.aportesFrom.get('DescripcionEstado')?.setValue(this.dataObjet.DescripcionEstado);
        this.aportesFrom.get('IdFormaPago')?.setValue(this.dataObjet.IdFormaPago);
        this.datoformaPago = +this.dataObjet.IdFormaPago;
        this.aportesFrom.get('DescripcionFormaPago')?.setValue(this.dataObjet.DescripcionFormaPago);
        this.aportesFrom.get('IdProductoCuenta')?.setValue(this.dataObjet.IdProducto);
        this.aportesFrom.get('IdConsecutivo')?.setValue(this.dataObjet.IdConsecutivo);
        this.datoIdConsecutivo = +this.dataObjet.IdConsecutivo;
        this.aportesFrom.get('IdDigito')?.setValue(this.dataObjet.IdDigito);
        this.aportesFrom.get('DescripcionOperacion')?.setValue(this.dataObjet.DescripcionOperacion);
        this.aportesFrom.get('Efectivo')?.setValue(this.dataObjet.Efectivo);
        this.aportesFrom.get('Canje')?.setValue(this.dataObjet.Canje);
        this.aportesFrom.get('SaldoInicial')?.setValue(this.dataObjet.SaldoInicial);
        this.aportesFrom.get('SaldoRevalorizacion')?.setValue(this.dataObjet.ValorRevalorizacion);
        this.aportesFrom.get('SaldoTotal')?.setValue(this.dataObjet.SaldoTotal);
        this.AsesorFrom.get('strCodigo')?.setValue(this.dataObjet.IdAsesorExterno);
        this.datoAsesorExterno = +this.dataObjet.IdAsesorExterno;
        this.AsesorFrom.get('strNombre')?.setValue(this.dataObjet.PrimerNombreAsesorE + ' ' + this.dataObjet.SegundoNombreAsesoreE + ' ' + this.dataObjet.PrimerApellidoAsesorE + ' ' + this.dataObjet.SegundoApellidoAsesorE);
        this.ValorTotal();
        this.ObtenerHistorial();
        this.aportesFrom.get('FechaApertura')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaApertura, 'yyyy/MM/dd  HH:mm:ss'));
        this.aportesFrom.get('FechaUltimaTrans')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaUltimaTrans, 'yyyy/MM/dd  HH:mm:ss'));
        if (this.dataObjet.FechaCancelacion != null) {
          this.aportesFrom.get('FechaCancelacion')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.FechaCancelacion, 'yyyy/MM/dd  HH:mm:ss'));
        } else {
          this.aportesFrom.get('FechaCancelacion')?.reset();
        }
        if (this.dataObjet.FechaRevalorizacion != null) {
          this.aportesFrom.get('fechaRevalorizacion')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.FechaRevalorizacion, 'yyyy/MM/dd  HH:mm:ss'));
        } else {
          this.aportesFrom.get('fechaRevalorizacion')?.reset();
        }
      }
      console.log("cuenta",this.dataObjet)
      if (this.dataObjet.Beneficiarios != null && this.dataObjet.Beneficiarios.length > 0) {
        this.dataObjetBeneficiarios = this.dataObjet.Beneficiarios;
        this.dataObjetBeneficiarios = this.dataObjetBeneficiarios.sort((a, b) => {
          const A = new Date(a.FechaMatricula).getTime();
          const B = new Date(b.FechaMatricula).getTime();
          if (A > B)
            return -1;
          if (A < B)
            return 1;
          return 0;
        });
        this.dataObjetBeneficiarios.forEach(( elementBeneficiarios :  any) => {
          elementBeneficiarios.Accion = "DB";
          this.resultParentesco.forEach(( elementParentesco :  any) => {
            if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
              elementBeneficiarios.DatosParentesco = elementParentesco;
            }
          });
        });
      } else {
        this.dataObjetBeneficiarios = [];
      }
        this.BloquearConsultaCuenta = false;
        this.BloquearBuscar = true;
    } else {
      this.notif.onWarning('Advertencia', 'No se encontró información.');
      this.clearBeneficiario();
      this.clearCampos();
      this.dataObjet = undefined;
    }
    this.aportesFrom.get('BuscarDocumento')?.reset();
    this.aportesFrom.get('BuscarNombre')?.reset();
  }
  BuscarAsociado() {
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    let Documento = '*';
    let Nombre = '*';
    let Oficina = this.dataUser.NumeroOficina;
    if (this.aportesFrom.get('NumeroDocumento')?.value  !== null
      && this.aportesFrom.get('NumeroDocumento')?.value  !== undefined
      && this.aportesFrom.get('NumeroDocumento')?.value  !== ''
      || this.aportesFrom.get('Nombre')?.value  !== null
      && this.aportesFrom.get('Nombre')?.value  !== undefined
      && this.aportesFrom.get('Nombre')?.value  !== '') {

      if (this.aportesFrom.get('NumeroDocumento')?.value  !== null
        && this.aportesFrom.get('NumeroDocumento')?.value  !== undefined
        && this.aportesFrom.get('NumeroDocumento')?.value  !== '') {
        Documento = this.aportesFrom.get('NumeroDocumento')?.value ;
      } else if (this.aportesFrom.get('Nombre')?.value  !== null
        && this.aportesFrom.get('Nombre')?.value  !== undefined
        && this.aportesFrom.get('Nombre')?.value  !== '') {
        Nombre = this.aportesFrom.get('Nombre')?.value ;
      }
      Oficina = this.dataUser.NumeroOficina;
      this.loading = true;
      this.aportesServices.BuscarAsociado(Documento, Nombre, Oficina).subscribe(
        result => {
          this.loading = false;
          this.clearBeneficiario();
          this.dataObjet = undefined;
          this.BloquearDatoBenf = false;
          this.BloquearNombreBenf = false;
          if (result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró el asociado.');
            this.btnGuardar = false;
          } else if (result.length === 1) {
            this.aportesFrom.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
            this.aportesFrom.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' + result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
            localStorage.setItem('TerceroAportes', result[0].lngTercero);
            this.aportesFrom.get('LngTercero')?.setValue(result[0].lngTercero);
            this.BloquearDatoBenf = null;
            this.BloquearNombreBenf = false;
          } else if (result.length > 1) {
            this.dataAsociados = result;
            this.ModalAsociados.nativeElement.click();
            this.BloquearDatoBenf = null;
            this.BloquearNombreBenf = false;
          } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
            if (result.Mensaje === 'Gerencia de desarrollo.') {
              swal.fire({
                title: '<strong>! Advertencia ¡</strong>',
                text: '',
                icon: 'error',
                animation: false,
                html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                  + result.Mensaje + '.',
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
                html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                  + result.Mensaje + '.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: 'rgb(160, 0, 87)'
              });
            } else {
              this.notif.onWarning('Advertencia', result.Mensaje);
              this.clearFrom();
              this.MapearDatosUsuario();
              this.Encabezado();
              this.OperacionPermitida();
              this.btnGuardar = false;
              this.BloquearFormaPago = null;
              this.BloquearGuardar = null;
              this.BloquearAsociado = null;
              this.BloquearbtnBenef = null;
              this.BloquearBuscar = false;
              this.BloquearConsultaCuenta = false;
            }
            this.clearFrom();
            this.MapearDatosUsuario();
            this.Encabezado();
            this.OperacionPermitida();
            this.btnGuardar = false;
            this.BloquearFormaPago = null;
            this.BloquearGuardar = null;
            this.BloquearAsociado = null;
            this.BloquearbtnBenef = null;
            this.BloquearBuscar = false;
            this.BloquearConsultaCuenta = false;
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
  BuscarAsociadoModal(Documento = '*') {
    let Nombre = '*';
    let Oficina = '*';
    if (this.aportesFrom.get('NumeroDocumento')?.value  !== null
      && this.aportesFrom.get('NumeroDocumento')?.value  !== undefined
      && this.aportesFrom.get('NumeroDocumento')?.value  !== ''
    ) {
      this.aportesFrom.get('Nombre')?.setValue('');
      Documento = this.aportesFrom.get('NumeroDocumento')?.value ;
    } else if (this.aportesFrom.get('Nombre')?.value  !== null
      && this.aportesFrom.get('Nombre')?.value  !== undefined
      && this.aportesFrom.get('Nombre')?.value  !== ''
    ) {
      Nombre = this.aportesFrom.get('Nombre')?.value ;
    }
    Oficina = this.dataUser.NumeroOficina;
    this.loading = true;
    this.aportesServices.BuscarAsociado(Documento, Nombre, Oficina).subscribe(
      result => {
        this.loading = false;
        this.clearBeneficiario();
        this.dataObjet = undefined;
        this.BloquearDatoBenf = false;
        this.BloquearNombreBenf = false;
        if (result.length === 0) {
          this.notif.onWarning('Advertencia', 'No se encontró el asociado.');
          this.btnGuardar = false;
        } else if (result.length === 1) {
          this.aportesFrom.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
          this.aportesFrom.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' +
            result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
          this.aportesFrom.get('LngTercero')?.setValue(result[0].lngTercero);
          this.BloquearDatoBenf = null;
          this.BloquearNombreBenf = false;
        } else if (result.length > 1) {
          this.resultAsociados = result;
          this.ModalAsociados.nativeElement.click();
          this.BloquearDatoBenf = null;
          this.BloquearNombreBenf = false;
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          if (result.Mensaje === 'Persona Vetada.') {
            swal.fire({
              title: 'Persona vetada',
              text: '',
              icon: 'error',
              confirmButtonColor: 'rgb(160,0,87)',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
            this.clearFrom();
            this.MapearDatosUsuario();
            this.Encabezado();
            this.OperacionPermitida();
            this.btnGuardar = false;
            this.BloquearFormaPago = null;
            this.BloquearGuardar = null;
            this.BloquearAsociado = null;
            this.BloquearbtnBenef = null;
            this.BloquearBuscar = false;
            this.BloquearConsultaCuenta = false;
          } else {
            this.notif.onWarning('Advertencia', result.Mensaje);
            this.clearFrom();
            this.MapearDatosUsuario();
            this.Encabezado();
            this.OperacionPermitida();
            this.btnGuardar = false;
            this.BloquearFormaPago = null;
            this.BloquearGuardar = null;
            this.BloquearAsociado = null;
            this.BloquearbtnBenef = null;
            this.BloquearBuscar = false;
            this.BloquearConsultaCuenta = false;
          }
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  MapearDatosAsociados(datos : any) {
    this.aportesFrom.get('NumeroDocumento')?.setValue(datos.NumeroDocumento);
    this.aportesFrom.get('Nombre')?.setValue(datos.PrimerApellido + ' ' + datos.SegundoApellido + ' ' + datos.PrimerNombre + ' ' + datos.SegundoNombre);
  }
  BotonBuscarAportes() {
    if (this.aportesFrom.get('BuscarDocumento')?.value  !== null
    && this.aportesFrom.get('BuscarDocumento')?.value  !== undefined
    && this.aportesFrom.get('BuscarDocumento')?.value  !== '') {
      this.BuscarCuentaPorDocumento(); 
    } else if (this.aportesFrom.get('BuscarNombre')?.value  !== null
    && this.aportesFrom.get('BuscarNombre')?.value  !== undefined
    && this.aportesFrom.get('BuscarNombre')?.value  !== '') {
      this.BuscarCuentaPorNombre();
    }
  }
  BuscarCuentaPorDocumento() {
      this.loading = true;
      this.aportesServices.getBuscarPorDocumento(this.aportesFrom.value).subscribe(
        result => {
          if (this.aportesOperacionFrom.get('Codigo')?.value  === '2') {
            
            this.aportesOperacionFrom.get('Codigo')?.reset();
          }
          this.loading = false;
          if (result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró registro.');
            this.clearFrom();
            this.generalesService.Autofocus('selectBuscar');
          } else if (result.length <= 1) {
            this.aportesFrom.get('BuscarDocumento')?.reset();
            if (result.length > 0) {
              this.clearFrom();
              if (result[0].Beneficiarios !== null && result[0].Beneficiarios !== undefined) {
                result[0].Beneficiarios.forEach(( elementBeneficiarios :  any) => {
                  this.resultParentesco.forEach(( elementParentesco :  any) => {
                    if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                      elementBeneficiarios.DatosParentesco = elementParentesco;
                    }
                  });
                  elementBeneficiarios.Accion = 'DB';
                });
              }
              this.MapearDatosCuenta(result);
              this.btnActualizar = true;
              this.btnActualizarBeneficiario = true;
              this.btnGuardar = true;
            }
          } else if (result.length > 1) {
            this.dataAsociados = result;
            this.BuscarAsociados.nativeElement.click();
            this.aportesFrom.get('BuscarDocumento')?.reset();
          } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
            this.notif.onWarning('Advertencia', result.Mensaje);
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
  }
  BuscarCuentaPorNombre() {
      if (this.aportesFrom.get('BuscarNombre')?.value  !== undefined) {
        this.loading = true;
        this.aportesServices.getBuscarPorNombre(this.aportesFrom.value).subscribe(
          result => {
            this.loading = false;
            this.aportesFrom.get('BuscarNombre')?.reset();
            if (result.length === 0) {
              this.notif.onWarning('Advertencia', 'No se encontró registro.');
              this.clearFormAportes();
              this.BloquearBuscar = null;
              this.generalesService.Autofocus('selectBuscarNombre');
            } else if (result.length === null) {
              this.notif.onWarning('Advertencia', 'No se encontró registro.');
              this.clearFormAportes();
              this.BloquearBuscar = null;
              this.generalesService.Autofocus('selectBuscarNombre');
            } else if (result.length === 1) {
              this.clearFrom();
              if (result[0].Beneficiarios !== null && result[0].Beneficiarios !== undefined) {
                result[0].Beneficiarios.forEach(( elementBeneficiarios :  any) => {
                  this.resultParentesco.forEach(( elementParentesco :  any) => {
                    if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                      elementBeneficiarios.DatosParentesco = elementParentesco;
                    }
                  });
                  elementBeneficiarios.Accion = 'DB';
                });
              }
              this.MapearDatosCuenta(result);
              this.btnActualizar = true;
              this.btnActualizarBeneficiario = true;
              this.btnGuardar = true;
            } else {
              this.dataAsociados = result;
              this.BuscarAsociados.nativeElement.click();
              this.btnActualizar = true;
              this.btnActualizarBeneficiario = true;
              this.btnGuardar = true;
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
  BuscarAsesor() {
    let IdAsesor = '*';
    let NombreAsesor = '*';

    if (this.aportesFrom.get('IdAsesor')?.value  !== null
      && this.aportesFrom.get('IdAsesor')?.value  !== undefined
      && this.aportesFrom.get('IdAsesor')?.value  !== '') {
      this.aportesFrom.get('NombreAsesor')?.setValue('');
      IdAsesor = this.aportesFrom.get('IdAsesor')?.value ;
    } else if (this.aportesFrom.get('NombreAsesor')?.value  !== null
      && this.aportesFrom.get('NombreAsesor')?.value  !== undefined
      && this.aportesFrom.get('NombreAsesor')?.value  !== '') {
      NombreAsesor = this.aportesFrom.get('NombreAsesor')?.value ;
    }

    if (IdAsesor === '*' && NombreAsesor === '*') {
      this.notif.onWarning('Advertencia', 'Debe ingresar el documento o el nombre del asesor.');
    } else {
      this.loading = true;
      this.aportesServices.getBuscarAsesor(IdAsesor, NombreAsesor).subscribe(
        result => {
          this.loading = false;
          if (result.length === 1) {
            this.MapearDatosAsesor(result);
          } else if (result.length > 1) {
            this.resultAsesores = result;
            this.ModalAsesores.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
            this.aportesFrom.get('IdAsesor')?.reset();
            this.aportesFrom.get('NombreAsesor')?.reset();
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
  }
  BuscarAsesorExternoCodigo() {
    if (this.AsesorFrom.get('strCodigo')?.value  !== null
      && this.AsesorFrom.get('strCodigo')?.value  !== undefined
      && this.AsesorFrom.get('strCodigo')?.value  !== ''
      || this.AsesorFrom.get('strNombre')?.value  !== null
      && this.AsesorFrom.get('strNombre')?.value  !== undefined
      && this.AsesorFrom.get('strNombre')?.value  !== '') {
        this.loading = true;
      this.aportesServices.getBuscarAsesorExterno(this.AsesorFrom.value).subscribe(
        result => {
          this.loading = false;
          if (result.length === 1) {
            this.AsesorFrom.get('strCodigo')?.setValue(result[0].intIdAsesor);
            this.AsesorFrom.get('strNombre')?.setValue(result[0].Nombre);
          } else if (result.length > 1) {
            this.resultAsesoresExterno = result;
            this.ModalAsesoresExterno.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
            this.AsesorFrom.get('strCodigo')?.reset();
            this.AsesorFrom.get('strNombre')?.reset();
          }
          this.bloquearbtnActalizar = true;
        },
        error => {
          this.loading = false;
          this.notif.onWarning('Advertencia', 'El valor ingresado no tiene el formato correcto.');
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    this.bloquearbtnActalizar = true;
  }
  BuscarAsesorExternoTodos() {
    if (this.AsesorFrom.value.strNombre !== '' && this.AsesorFrom.value.strNombre !== null) {
      this.AsesorFrom.get('strCodigo')?.setValue('');
    } else if (this.AsesorFrom.value.strCodigo !== '' && this.AsesorFrom.value.strCodigo !== null) {
      this.AsesorFrom.get('strNombre')?.setValue('');
    } else {
      this.AsesorFrom.get('strCodigo')?.setValue('');
      this.AsesorFrom.get('strNombre')?.setValue('');
    }

    this.aportesServices.getBuscarAsesorExterno(this.AsesorFrom.value).subscribe(
      result => {
        if (result.length > 1) {
          this.resultAsesoresExterno = result;
          this.ModalAsesoresExterno.nativeElement.click();
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
        this.notif.onWarning('Advertencia', 'El valor ingresado no tiene el formato correcto.');
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  FormaPago() {
    this.loading = true;
    this.aportesServices.getFormaPago().subscribe(
      result => {
        this.loading = false;
        this.resultFormaPago = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  OperacionPermitida() {
    this.loading = true;
    this.aportesServices.getOperacionPermitida().subscribe(
      result => {
        this.loading = false;
        this.aportesFrom.get('DescripcionOperacion')?.setValue(result[0].DescripcionOperacion);
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  clearFormAportes() {
    this.dataObjet = undefined;
    this.resultEstados = undefined;
    this.aportesOperacionFrom.reset();
    this.aportesFrom.reset();
    this.btnGuardar = true;
    this.btnActualizar = true;
    this.btnActualizarBeneficiario = true;
    this.BloquearDatoBenf = false;
    this.BloquearNombreBenf = false;
    this.BloquearConsultaCuenta = false;
    this.BloquearBuscar = false;
    this.BloquearFormaPago = false;
    this.BloquearAsesorExterno = false;
    this.BloquearAsociado = false;
    this.AsesorFrom.reset();
    this.LimpiarBeneficiarior();
    this.dataHistorial = [];
    this.dataObjetBeneficiarios = [];
    this.devolverTab(1);
    this.tab1.nativeElement.click();
    this.aportesFrom.get('DocumentoBeneficiario')?.disable();
    $('#beneficiarios').removeClass('activar');
    $('#beneficiarios').removeClass('active');
    $('#historial').removeClass('activar');
    $('#historial').removeClass('active');
  }
  clearFrom() {
    this.dataObjet = undefined;
    this.aportesFrom.reset();
    this.btnGuardar = true;
    this.btnActualizar = true;
    this.btnActualizarBeneficiario = true;
    this.dataObservacion = undefined;
    this.AsesorFrom.reset();
    this.dataHistorial = [];
  }
  clearCampos() {
    this.aportesFrom.get('NumeroOficina')?.reset();
    this.aportesFrom.get('NombreOficina')?.reset();
    this.aportesFrom.get('NumeroDocumento')?.reset();
    this.aportesFrom.get('Nombre')?.reset();
    this.aportesFrom.get('IdProducto')?.reset();
    this.aportesFrom.get('DescripcionProducto')?.reset();
    this.aportesFrom.get('IdAsesor')?.reset();
    this.aportesFrom.get('NombreAsesor')?.reset();
    this.aportesFrom.get('DescripcionEstado')?.reset();
    this.aportesFrom.get('DescripcionOperacion')?.reset();
    this.aportesFrom.get('IdFormaPago')?.reset();
    this.aportesFrom.get('SaldoInicial')?.reset();
    this.aportesFrom.get('Canje')?.reset();
    this.aportesFrom.get('SaldoRevalorizacion')?.reset();
    this.aportesFrom.get('Efectivo')?.reset();
    this.aportesFrom.get('SaldoTotal')?.reset();
    this.aportesFrom.get('FechaApertura')?.reset();
    this.aportesFrom.get('FechaUltimaTrans')?.reset();
    this.aportesFrom.get('FechaCancelacion')?.reset();
    this.aportesFrom.get('fechaRevalorizacion')?.reset();
    this.AsesorFrom.get('strCodigo')?.reset();
    this.AsesorFrom.get('strNombre')?.reset();
    this.dataHistorial = [];
  }
  LimpiarCampos(Datos : any) {
    if (Datos === 'NumeroDocumento') {
      this.aportesFrom.get('Nombre')?.reset();
    } else if (Datos === 'Nombre') {
      this.aportesFrom.get('NumeroDocumento')?.reset();
    } else if (Datos === 'IdAsesor') {
      this.aportesFrom.get('NombreAsesor')?.reset();
    } else if (Datos === 'NombreAsesor') {
      this.aportesFrom.get('IdAsesor')?.reset();
    } else if (Datos === 'IdProducto') {
      this.aportesFrom.get('DescripcionProducto')?.reset();
    } else if (Datos === 'DescripcionProducto') {
      this.aportesFrom.get('IdProducto')?.reset();
    } else if (Datos === 'BuscarDocumento') {
      this.aportesFrom.get('BuscarNombre')?.reset();
    } else if (Datos === 'BuscarNombre') {
      this.aportesFrom.get('BuscarDocumento')?.reset();
    } else if (Datos === 'strCodigo') {
      this.AsesorFrom.get('strNombre')?.reset();
    } else if (Datos === 'strNombre') {
      this.AsesorFrom.get('strCodigo')?.reset();
    }
  }
  ManejoBotonesBeneficiarios(operacion: string) {
    if (operacion == 'inicio') {//para cuando recién se ingresa a la operación 11
      this.BloquearDatoBenfBtn = true;
      this.BloquearLimpiarBenefBtn = true;
      this.bloquearbtnActalizar = true;
    }else if (operacion == 'cambio') {//esta operacion es para cuando cambia alguno de los campos de este formulario
      let campos = this.aportesFrom.value;
      if (this.ValidarVacio(campos.DocumentoBeneficiario) && this.ValidarVacio(campos.Porcentaje) && this.ValidarVacio(campos.PrimerNombre) && this.ValidarVacio(campos.PrimerApellido) && this.ValidarVacio(campos.DatosParentesco)) {
        this.BloquearDatoBenfBtn = null;
      } else {
        this.BloquearDatoBenfBtn = true;
      }
      if (this.ValidarVacio(campos.DocumentoBeneficiario) || this.ValidarVacio(campos.Porcentaje) || this.ValidarVacio(campos.PrimerNombre) || this.ValidarVacio(campos.PrimerApellido) || this.ValidarVacio(campos.DatosParentesco)) {
        this.BloquearLimpiarBenefBtn = null; //se puso en null para que active el botón limpiar desde el principio
      } else {
        this.BloquearLimpiarBenefBtn = null;
      }
    } else if (operacion == 'agregar' || operacion == 'eliminar') { // esta operación es para cuando se agrega o se elimina un beneficiario
      let sumaPorcentaje = 0;
      this.dataObjet.Beneficiarios.forEach((element : any) => {
        sumaPorcentaje = sumaPorcentaje + +element.Porcentaje;
      });
    }
  }
  ValidarVacio(dato:string) {
    return (dato !== null && dato !== undefined && dato !== '') ? true : false;
  }
  Parentesco() {
    this.loading = true;
    this.aportesServices.getParentesco().subscribe(
      result => {
        this.loading = false;
        this.resultParentesco = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerTipoDocumento() {
    this.aportesServices.getTipoDocumento().subscribe(
      result => {
        this.resultTipoDocumento = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  BuscarBenefeciario() {
    let DocValue: string = this.aportesFrom.get('DocumentoBeneficiario')?.value ;
    if (DocValue == null || DocValue == "")
        return
    const DocBeneficiario = this.aportesFrom.get('DocumentoBeneficiario')?.value .toString().trim();
    let temp: any = this.dataObjetBeneficiarios.filter(x => x.NumeroDocumento == DocBeneficiario)[0];
    if (temp != null) {
      this.aportesFrom.get('DocumentoBeneficiario')?.setValue("");
      this.notif.onWarning('Advertencia', 'El beneficiario ya fue ingresado.');
      this.aportesFrom.get('DocumentoBeneficiario')?.reset();
      return;
    }
    if (this.aportesFrom.get('DocumentoBeneficiario')?.valid === true) {
      if (this.aportesFrom.get('DocumentoBeneficiario')?.value  !== null
        && this.aportesFrom.get('DocumentoBeneficiario')?.value  !== undefined
        && this.aportesFrom.get('DocumentoBeneficiario')?.value  !== ''
      ) {
        if (this.aportesFrom.get('DocumentoBeneficiario')?.value .trim() !== this.aportesFrom.get('NumeroDocumento')?.value ) {
          if (this.dataObjetBeneficiarios.length == 0) {
            this.loading = true;
            this.aportesServices.BuscarBeneficiario(this.aportesFrom.get('DocumentoBeneficiario')?.value ).subscribe(
              result => {
                this.loading = false;
                if (result != null && result.Mensaje != null && (result.Mensaje == "Gerencia de desarrollo." || result.Mensaje == "Oficial de cumplimiento.")) {
                  this.AlertVetado(result.Mensaje);
                  this.aportesFrom.get('DocumentoBeneficiario')?.reset();
                }
                else if (result === null) {
                  const PrimerNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                  const SegundoNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                  const PrimerApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                  const SegundoApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);

                  this.aportesFrom.removeControl("PrimerNombre");
                  this.aportesFrom.removeControl("SegundoNombre");
                  this.aportesFrom.removeControl("PrimerApellido");
                  this.aportesFrom.removeControl("SegundoApellido");

                  this.aportesFrom.addControl("PrimerNombre", PrimerNombre);
                  this.aportesFrom.addControl("SegundoNombre", SegundoNombre);
                  this.aportesFrom.addControl("PrimerApellido", PrimerApellido);
                  this.aportesFrom.addControl("SegundoApellido", SegundoApellido);
                  this.notif.onWarning('Advertencia', 'No se encontró el beneficiario. Ingrese los datos para crearlo.');
                  this.BloquearNombreBenf = null;
                  this.bloquearDocumentoBenf = true;
                  this.aportesFrom.get('PrimerNombre')?.reset();
                  this.aportesFrom.get('SegundoNombre')?.reset();
                  this.aportesFrom.get('PrimerApellido')?.reset();
                  this.aportesFrom.get('SegundoApellido')?.reset();
                  this.aportesFrom.get('IdTipoDocumento')?.reset();
                  this.aportesFrom.get('Porcentaje')?.setValue("");
                  this.aportesFrom.get('DatosParentesco')?.setValue("");
                  this.aportesFrom.get('Porcentaje')?.enable();
                  this.aportesFrom.get('DatosParentesco')?.enable();
                } else {
                  if (result.IdEstado === 32) {
                    this.notif.onWarning('Alerta', 'Beneficiario con estado fallecido.');
                    this.aportesFrom.get('DocumentoBeneficiario')?.reset();

                  } else {
                    this.bloquearDocumentoBenf = true;
                    const PrimerNombre = new FormControl('');
                    const SegundoNombre = new FormControl('');
                    const PrimerApellido = new FormControl('');
                    const SegundoApellido = new FormControl('');
                    this.aportesFrom.removeControl("PrimerNombre");
                    this.aportesFrom.removeControl("SegundoNombre");
                    this.aportesFrom.removeControl("PrimerApellido");
                    this.aportesFrom.removeControl("SegundoApellido");
                    
                    this.aportesFrom.addControl("PrimerNombre", PrimerNombre);
                    this.aportesFrom.addControl("SegundoNombre", SegundoNombre);
                    this.aportesFrom.addControl("PrimerApellido", PrimerApellido);
                    this.aportesFrom.addControl("SegundoApellido", SegundoApellido);

                    this.aportesFrom.get('PrimerNombre')?.setValue(result.PrimerNombre);
                    this.aportesFrom.get('SegundoNombre')?.setValue(result.SegundoNombre);
                    this.aportesFrom.get('PrimerApellido')?.setValue(result.PrimerApellido);
                    this.aportesFrom.get('SegundoApellido')?.setValue(result.SegundoApellido);
                    this.aportesFrom.get('IdTipoDocumento')?.setValue(result.IdTipoDocumento);
                    this.aportesFrom.get('Porcentaje')?.setValue("");
                    this.aportesFrom.get('DatosParentesco')?.setValue("");
                    this.aportesFrom.get('Porcentaje')?.enable();
                    this.aportesFrom.get('DatosParentesco')?.enable();
                    this.BloquearNombreBenf = false;
                  }
                }
              },
              error => {
                this.loading = false;
                this.notif.onWarning('Alerta', 'Número de documento incorrecto.');
              }
            );
          } else {
            this.validar = false;
            const CedulaDigitada = this.aportesFrom.get('DocumentoBeneficiario')?.value ;
            this.dataObjetBeneficiarios.forEach(elementB => {
              if (elementB.NumeroDocumento === CedulaDigitada) {
                this.validar = true;
              }
            });
            if (this.validar) {
              this.notif.onWarning('Advertencia', 'El beneficiario ya fue ingresado.');
              this.aportesFrom.get('DocumentoBeneficiario')?.reset();
              this.clearBeneficiario();
            } else {
              this.aportesServices.BuscarBeneficiario(this.aportesFrom.get('DocumentoBeneficiario')?.value ).subscribe(
                result => {
                  if (result != null && result.Mensaje != null && (result.Mensaje == "Gerencia de desarrollo." || result.Mensaje == "Oficial de cumplimiento."))
                    this.AlertVetado(result.Mensaje);
                  else if (result === null) {
                    const PrimerNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                    const SegundoNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                    const PrimerApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                    const SegundoApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);

                    this.aportesFrom.removeControl("PrimerNombre");
                    this.aportesFrom.removeControl("SegundoNombre");
                    this.aportesFrom.removeControl("PrimerApellido");
                    this.aportesFrom.removeControl("SegundoApellido");

                    this.aportesFrom.addControl("PrimerNombre", PrimerNombre);
                    this.aportesFrom.addControl("SegundoNombre", SegundoNombre);
                    this.aportesFrom.addControl("PrimerApellido", PrimerApellido);
                    this.aportesFrom.addControl("SegundoApellido", SegundoApellido);
                    this.loading = false;
                    this.notif.onWarning('Advertencia', 'No se encontró el beneficiario. Ingrese los datos para crearlo.');
                    this.BloquearNombreBenf = null;
                    this.bloquearDocumentoBenf = true;

                    this.aportesFrom.get('PrimerNombre')?.reset();
                    this.aportesFrom.get('SegundoNombre')?.reset();
                    this.aportesFrom.get('PrimerApellido')?.reset();
                    this.aportesFrom.get('SegundoApellido')?.reset();
                    this.aportesFrom.get('Porcentaje')?.reset();
                    this.aportesFrom.get('DatosParentesco')?.reset();
                    this.aportesFrom.get('Porcentaje')?.enable();
                    this.aportesFrom.get('DatosParentesco')?.enable();
                  } else {
                    if (result.IdEstado === 32) {
                      this.notif.onWarning('Alerta', 'Beneficiario con estado fallecido.');
                      this.aportesFrom.get('DocumentoBeneficiario')?.reset();

                    } else {
                      const PrimerNombre = new FormControl('');
                      const SegundoNombre = new FormControl('');
                      const PrimerApellido = new FormControl('');
                      const SegundoApellido = new FormControl('');

                      this.aportesFrom.removeControl("PrimerNombre");
                      this.aportesFrom.removeControl("SegundoNombre");
                      this.aportesFrom.removeControl("PrimerApellido");
                      this.aportesFrom.removeControl("SegundoApellido");

                      this.aportesFrom.addControl("PrimerNombre", PrimerNombre);
                      this.aportesFrom.addControl("SegundoNombre", SegundoNombre);
                      this.aportesFrom.addControl("PrimerApellido", PrimerApellido);
                      this.aportesFrom.addControl("SegundoApellido", SegundoApellido);
  
                      this.bloquearDocumentoBenf = true;
                      this.aportesFrom.get('PrimerNombre')?.setValue(result.PrimerNombre);
                      this.aportesFrom.get('SegundoNombre')?.setValue(result.SegundoNombre);
                      this.aportesFrom.get('PrimerApellido')?.setValue(result.PrimerApellido);
                      this.aportesFrom.get('SegundoApellido')?.setValue(result.SegundoApellido);
                      this.aportesFrom.get('IdTipoDocumento')?.setValue(result.IdTipoDocumento);
                      this.aportesFrom.get('Porcentaje')?.setValue("");
                      this.aportesFrom.get('DatosParentesco')?.setValue("");
                      this.aportesFrom.get('Porcentaje')?.enable();
                      this.aportesFrom.get('DatosParentesco')?.enable();
                      this.BloquearNombreBenf = false;
                    }
                  }
                },
                error => {
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.log(errorMessage);
                }
              );
            }
          }
        } else {
          this.notif.onWarning('Advertencia', 'El beneficiario debe ser diferente al titular.');
          this.aportesFrom.get('DocumentoBeneficiario')?.reset();
        }
      }
    }
  }
  AlertVetado(Mensaje: string) {
    this.BloquearNombreBenf = false;
    this.bloquearDocumentoBenf = false;
    this.aportesFrom.get('PrimerNombre')?.reset();
    this.aportesFrom.get('SegundoNombre')?.reset();
    this.aportesFrom.get('PrimerApellido')?.reset();
    this.aportesFrom.get('SegundoApellido')?.reset();
    this.aportesFrom.get('IdTipoDocumento')?.reset();
    this.aportesFrom.get('DatosParentesco')?.setValue("");
    this.aportesFrom.get('Porcentaje')?.disable();
    this.aportesFrom.get('DatosParentesco')?.disable();
    this.aportesFrom.get('DocumentoBeneficiario')?.setValue("")
    swal.fire({
      title: '<strong>! Advertencia ¡</strong>',
      text: '',
      icon: 'error',
      animation: false,
      html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
        + Mensaje + '.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: 'rgb(160, 0, 87)'
    });
  }

  AgregarBeneficiario() {
    if (this.aportesFrom.controls['PrimerNombre'].valid == false
      || this.aportesFrom.controls['SegundoNombre'].valid == false
      || this.aportesFrom.controls['PrimerApellido'].valid == false
      || this.aportesFrom.controls['SegundoApellido'].valid == false)
    {
      this.notif.onWarning('Advertencia', 'Datos incorrectos.');
      return;
    } 
    let Accion: string = "Crear";
    let IdBeneficiario: number = 0;
    let fechaMatricula = formatDate(new Date(), 'yyyy/MM/dd  HH:mm', 'en'); 
    if (this.aportesFrom.get('DatosParentesco')?.value  !== null
      && this.aportesFrom.get('DatosParentesco')?.value  !== undefined
      && this.aportesFrom.get('DatosParentesco')?.value  !== ''
      && this.aportesFrom.get('Porcentaje')?.value  !== null
      && this.aportesFrom.get('Porcentaje')?.value  !== undefined
      && this.aportesFrom.get('Porcentaje')?.value  !== ''
      && this.aportesFrom.get('DocumentoBeneficiario')?.value  !== null
      && this.aportesFrom.get('DocumentoBeneficiario')?.value  !== undefined
      && this.aportesFrom.get('DocumentoBeneficiario')?.value  !== ''
      && ((this.aportesFrom.get('PrimerApellido')?.value  !== null && this.aportesFrom.get('PrimerApellido')?.value  !== undefined && this.aportesFrom.get('PrimerApellido')?.value  !== '') || this.aportesFrom.get('IdTipoDocumento')?.value  == 3)
      && this.aportesFrom.get('PrimerNombre')?.value  !== null
      && this.aportesFrom.get('PrimerNombre')?.value  !== undefined
      && this.aportesFrom.get('PrimerNombre')?.value  !== ''
      && this.aportesFrom.get('IdTipoDocumento')?.value  !== null
      && this.aportesFrom.get('IdTipoDocumento')?.value  !== undefined
      && this.aportesFrom.get('IdTipoDocumento')?.value  !== '') {
      if (!(this.aportesFrom.get('Porcentaje')?.value  > 0)) {
        this.notif.onWarning('Advertencia', 'El porcentaje debe ser mayor que 0.');
        return;
      }
      if (this.indexBeneficiarios != -1) {
        if (this.dataObjetBeneficiarios[this.indexBeneficiarios].Porcentaje == this.aportesFrom.get('Porcentaje')?.value  && this.dataObjetBeneficiarios[this.indexBeneficiarios].DatosParentesco == this.aportesFrom.get('DatosParentesco')?.value  && this.dataObjetBeneficiarios[this.indexBeneficiarios].NumeroDocumento == this.aportesFrom.get('DocumentoBeneficiario')?.value ) {
          this.notif.onWarning('Advertencia', ' Debe cambiar el beneficiario.');
          return;
        }
        if (this.dataObjetBeneficiarios[this.indexBeneficiarios].Accion == "DB" || this.dataObjetBeneficiarios[this.indexBeneficiarios].Accion == "Actualizar") {
          IdBeneficiario = this.dataObjetBeneficiarios[this.indexBeneficiarios].IdBeneficiarioAportes;
          Accion = "Actualizar";
          fechaMatricula = this.dataObjetBeneficiarios[this.indexBeneficiarios].FechaMatricula
        }
        let tempList: any[] = this.dataObjetBeneficiarios;
        tempList = tempList.filter(x => x != this.dataObjetBeneficiarios[this.indexBeneficiarios])
        let Sum: number = 0;
        tempList.forEach(element => {
          Sum = Sum + +element.Porcentaje;
        });
        Sum = Sum + +this.aportesFrom.get('Porcentaje')?.value ;
        if (Sum > 100) {
          this.notif.onWarning('Advertencia', 'La suma del porcentaje supera el 100%.');
          return
        }
        this.dataObjetBeneficiarios.splice(this.indexBeneficiarios, 1);
      }
      let totalSuma = 0;
      let sumaPorcentaje = 0;
      if (this.aportesFrom.get('Porcentaje')?.value  === 0) {
        this.notif.onWarning('Advertencia', 'El porcentaje debe tener un valor diferente a cero (0).');
      } else {

        this.dataObjetBeneficiarios.forEach(element => {
          sumaPorcentaje = sumaPorcentaje + +element.Porcentaje;
        });
        totalSuma = sumaPorcentaje + +this.aportesFrom.get('Porcentaje')?.value ;
        if (totalSuma <= 100) {
          this.btnActualizarBeneficiarios = true;
          this.dataObjetBeneficiarios.push({
            'Accion': Accion,
            'IdCuenta': Number(this.aportesFrom.get('IdCuenta')?.value ),
            'IdBeneficiarioAportes': IdBeneficiario,
            'IdTipoDocumento': Number(this.aportesFrom.get('IdTipoDocumento')?.value ),
            'DescripcionTipoDocumento': this.resultTipoDocumento.filter((x : any) => x.Clase == this.aportesFrom.get('IdTipoDocumento')?.value )[0].Descripcion,
            'NumeroDocumento': this.aportesFrom.get('DocumentoBeneficiario')?.value ,
            'Porcentaje': this.aportesFrom.get('Porcentaje')?.value ,
            'PrimerNombre': this.aportesFrom.get('PrimerNombre')?.value ,
            'SegundoNombre': this.aportesFrom.get('SegundoNombre')?.value ,
            'PrimerApellido': this.aportesFrom.get('PrimerApellido')?.value ,
            'SegundoApellido': this.aportesFrom.get('SegundoApellido')?.value ,
            'IdParentesco': this.aportesFrom.get('DatosParentesco')?.value ,
            'DatosParentesco': this.resultParentesco.filter((x : any) => x.Clase == this.aportesFrom.get('DatosParentesco')?.value )[0].Descripcion,
            'FechaMatricula': fechaMatricula
          });
          this.indexBeneficiarios = -1;
          this.clearBeneficiario();
          this.BloquearNombreBenf = false;
          this.bloquearbtnActalizar = true;
          this.bloquearDocumentoBenf = false;
          this.aportesFrom.get('DocumentoBeneficiario')?.enable();
          this.aportesFrom.get('DatosParentesco')?.disable();
          this.aportesFrom.get('Porcentaje')?.disable();
          this.aportesFrom.get('IdTipoDocumento')?.disable();
        } else {
          this.notif.onWarning('Advertencia', 'La suma del porcentaje supera el 100%.');
        }
        
      }
    } else {
      this.notif.onWarning('Advertencia', 'Los datos están incompletos.');
    }
  }

  LimpiarBeneficiarior() {
    if (this.dataObjetBeneficiarios.filter(x => x.Accion == "Actualizar" || x.Accion == "Crear")[0] != null)
      this.btnActualizarBeneficiarios = true;

    this.indexBeneficiarios = -1;
    this.clearBeneficiario();
  }

  clearBeneficiario() {
    this.aportesFrom.get('DocumentoBeneficiario')?.reset();
    this.aportesFrom.get('DatosParentesco')?.reset();
    this.aportesFrom.get('PrimerApellido')?.reset();
    this.aportesFrom.get('SegundoApellido')?.reset();
    this.aportesFrom.get('PrimerNombre')?.reset();
    this.aportesFrom.get('SegundoNombre')?.reset();
    this.aportesFrom.get('Porcentaje')?.reset();
    this.aportesFrom.get('IdTipoDocumento')?.reset();
    this.aportesFrom.get('DocumentoBeneficiario')?.enable();
    this.indexBeneficiarios = -1;
  }
  
  IndiceAEliminarBenf(index : number) {
    if (this.dataObjetBeneficiarios[index].Accion == "DB" || this.dataObjetBeneficiarios[index].Accion == "Actualizar")
      this.BenificiariosElminar.push({
        'Accion': "Eliminar",
        'IdBeneficiarioAportes': this.dataObjetBeneficiarios[index].IdBeneficiarioAportes,
        'NumeroDocumento': this.dataObjetBeneficiarios[index].NumeroDocumento,
        'Porcentaje': this.dataObjetBeneficiarios[index].Porcentaje,
        'PrimerNombre': this.dataObjetBeneficiarios[index].PrimerNombre,
        'SegundoNombre': this.dataObjetBeneficiarios[index].SegundoNombre,
        'PrimerApellido': this.dataObjetBeneficiarios[index].PrimerApellido,
        'SegundoApellido': this.dataObjetBeneficiarios[index].SegundoApellido,
        'DatosParentesco': this.resultParentesco.filter((x : any) => x.Clase == this.dataObjetBeneficiarios[index].IdParentesco)[0].Descripcion,
        'FechaMatricula' : this.dataObjetBeneficiarios[index].FechaMatricula
      });

    this.btnActualizarBeneficiarios = true;
    this.dataObjetBeneficiarios.splice(index, 1);
    this.bloquearbtnActalizar = true;
    this.indexBeneficiarios = -1;
    this.bloquearDocumentoBenf = true;
  }
  IndiceAEditarBenf(index : number, datos : any) {
    this.btnActualizarBeneficiarios = false;
    this.aportesFrom.get('IdTipoDocumento')?.setValue(datos.IdTipoDocumento);
    this.aportesFrom.get('DocumentoBeneficiario')?.setValue(datos.NumeroDocumento);
    this.aportesFrom.get('PrimerApellido')?.setValue(datos.PrimerApellido);
    this.aportesFrom.get('SegundoApellido')?.setValue(datos.SegundoApellido);
    this.aportesFrom.get('PrimerNombre')?.setValue(datos.PrimerNombre);
    this.aportesFrom.get('SegundoNombre')?.setValue(datos.SegundoNombre);
    this.aportesFrom.get('PrimerNombre')?.setValue(datos.PrimerNombre);

    this.aportesFrom.get('DatosParentesco')?.setValue(datos.IdParentesco);
    this.aportesFrom.get('Porcentaje')?.setValue(datos.Porcentaje);
    this.aportesFrom.get('DatosParentesco')?.enable();
    this.aportesFrom.get('Porcentaje')?.enable();
    this.aportesFrom.get('DocumentoBeneficiario')?.disable();
    this.BloquearNombreBenf = false;
    this.indexBeneficiarios = index;
    this.bloquearDocumentoBenf = true;
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
  validarValorCampo(campoJquery : string, campoAngular : string) {
    const lentghCampo = $('#' + campoJquery + '').val();
    if (lentghCampo.length > 0) {
      if ($('#' + campoJquery + '').val().trim() === '') {
        this.notif.onWarning('Advertencia', 'El campo no puede contener espacios.');
        this.aportesFrom.get('' + campoAngular + '')?.reset();
      }
    }
    this.ManejoBotonesBeneficiarios('cambio');
  }
  ValidacionPuntoComa($event : any) {
    const Numero = $event;
    const key = Numero.keyCode;

    if (key === 46 || key === 44) {
      Numero.preventDefault();
    }
  }
  GuardarAportes() {
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.aportesFrom.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
    this.aportesFrom.get('IdProducto')?.setValue(400); // PENDIENTE SI ACTIVA OTRO PRODUCTO DE APORTES SE DEBE QUITAR
    this.aportesFrom.get('IdAsesor')?.setValue(this.dataUser.IdAsesor);
    this.aportesFrom.get('NumeroOficina')?.setValue(this.dataUser.NumeroOficina);
    this.BloquearAsociado = false;
    this.BloquearFormaPago = false;
    this.BloquearDatoBenf = false;
    this.BloquearNombreBenf = false;
    this.aportesFrom.get('Beneficiarios')?.setValue(this.dataObjetBeneficiarios);
    if (this.AsesorFrom.get('strCodigo')?.value  !== null
      && this.AsesorFrom.get('strCodigo')?.value  !== undefined
      && this.AsesorFrom.get('strCodigo')?.value  !== '') {
      this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value ;
      this.aportesFrom.get('IdAsesorExterno')?.setValue(this.dataAsesor);
      
      if (this.dataObjetBeneficiarios.length > 0) {
        
        
        let sumaPorcentaje = 0;
        let totalSuma;
        this.dataObjetBeneficiarios.forEach(element => {
          sumaPorcentaje = sumaPorcentaje + +element.Porcentaje;
        });
        totalSuma = sumaPorcentaje + +this.aportesFrom.get('Porcentaje')?.value ;
        if (totalSuma === 100) {
          this.loading = true;
          this.aportesServices.getGuardarAportes(this.aportesFrom.value).subscribe(
            result => {
              this.loading = false;
              this.aportesFrom.get('IdCuenta')?.setValue(result.IdCuenta);
              this.aportesFrom.get('FechaApertura')?.setValue(result.FechaApertura);
              this.BloquearDatoBenf = false;
              this.BloquearNombreBenf = false;
              this.BloquearAsociado = false;
              this.BloquearbtnBenef = false;
              this.BloquearAsesorExterno = false;
              this.BloquearFormaPago = false;
              this.btnOpcionActualizarBeneficiario = false;
              this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
              this.btnGuardar = true;
              this.Bloquear = false;
              this.Guardarlog(10);
              if (result.Beneficiarios !== null && result.Beneficiarios !== undefined) {
                result.Beneficiarios.forEach((elementBeneficiarios : any) => {
                  this.resultParentesco.forEach((elementParentesco : any) => {
                    if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                      elementBeneficiarios.DatosParentesco = elementParentesco;
                    }
                  });
                });
              }
              this.MapearDatosCuenta(result);
              this.BuscarPorCuenta();
              this.ObtenerHistorial();
              this.VolverArriba();
              this.aportesOperacionFrom.get('Codigo')?.reset();
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        } else {
          this.notif.onWarning('Advertencia', 'La suma del porcentaje debe ser igual al 100%.');
        }
      } else {
        this.aportesFrom.get('Beneficiarios')?.setValue(this.dataObjetBeneficiarios);
        this.loading = true;
        this.aportesServices.getGuardarAportes(this.aportesFrom.value).subscribe(
          result => {
            this.loading = false;
            this.aportesFrom.get('IdCuenta')?.setValue(result.IdCuenta);
            this.aportesFrom.get('FechaApertura')?.setValue(result.FechaApertura);
            this.BloquearDatoBenf = false;
            this.BloquearNombreBenf = false;
            this.BloquearAsociado = false;
            this.BloquearbtnBenef = false;
            this.BloquearAsesorExterno = false;
            this.BloquearFormaPago = false;
            this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
            this.btnOpcionActualizarBeneficiario = false;
            this.btnGuardar = true;
            this.Bloquear = false;
            this.Guardarlog(10);
            if (result.Beneficiarios !== null && result.Beneficiarios !== undefined) {
              result.Beneficiarios.forEach(( elementBeneficiarios :  any) => {
                this.resultParentesco.forEach(( elementParentesco :  any) => {
                  if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                    elementBeneficiarios.DatosParentesco = elementParentesco;
                  }
                });
              });
            }
            this.MapearDatosCuenta(result);
            this.BuscarPorCuenta();
            this.ObtenerHistorial();
            this.VolverArriba();
            this.aportesOperacionFrom.get('Codigo')?.reset();
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }
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
      }).then((results) => {
        if (results.value) {
        } else {
          if (this.dataObjet !== undefined) {
            
            this.aportesFrom.get('Beneficiarios')?.setValue(this.dataObjetBeneficiarios);
            let sumaPorcentaje = 0;
            let totalSuma;
            this.dataObjetBeneficiarios.forEach(element => {
              sumaPorcentaje = sumaPorcentaje + +element.Porcentaje;
            });
            totalSuma = sumaPorcentaje + +this.aportesFrom.get('Porcentaje')?.value ;
            if (totalSuma === 100) {
              this.loading = true;
              this.aportesServices.getGuardarAportes(this.aportesFrom.value).subscribe(
                result => {
                  this.loading = false;
                  this.aportesFrom.get('IdCuenta')?.setValue(result.IdCuenta);
                  this.aportesFrom.get('FechaApertura')?.setValue(result.FechaApertura);
                  this.BloquearDatoBenf = false;
                  this.BloquearNombreBenf = false;
                  this.BloquearAsociado = false;
                  this.BloquearbtnBenef = false;
                  this.BloquearAsesorExterno = false;
                  this.BloquearFormaPago = false;
                  this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                  this.btnOpcionActualizarBeneficiario = false;
                  this.btnGuardar = true;
                  this.Bloquear = false;
                  this.Guardarlog(10);
                  if (result.Beneficiarios !== null && result.Beneficiarios !== undefined) {
                    result.Beneficiarios.forEach(( elementBeneficiarios :  any) => {
                      this.resultParentesco.forEach(( elementParentesco :  any) => {
                        if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                          elementBeneficiarios.DatosParentesco = elementParentesco;
                        }
                      });
                    });
                  }
                  this.MapearDatosCuenta(result);
                  this.BuscarPorCuenta();
                  this.ObtenerHistorial();
                  this.VolverArriba();
                  this.aportesOperacionFrom.get('Codigo')?.reset();
                },
                error => {
                  this.loading = false;
                  const errorMessage = <any>error;
                  console.log(errorMessage);
                }
              );
            } else {
              this.notif.onWarning('Advertencia', 'La suma del porcentaje debe ser igual al 100%.');
            }
          } else {
            this.loading = true;
            this.aportesServices.getGuardarAportes(this.aportesFrom.value).subscribe(
              result => {
                this.loading = false;
                this.aportesFrom.get('IdCuenta')?.setValue(result.IdCuenta);
                this.aportesFrom.get('FechaApertura')?.setValue(result.FechaApertura);
                this.BloquearDatoBenf = false;
                this.BloquearNombreBenf = false;
                this.BloquearAsociado = false;
                this.BloquearbtnBenef = false;
                this.BloquearAsesorExterno = false;
                this.BloquearFormaPago = false;
                this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                this.btnOpcionActualizarBeneficiario = false;
                this.btnGuardar = true;
                this.Bloquear = false;
                this.Guardarlog(10);
                if (result.Beneficiarios !== null && result.Beneficiarios !== undefined) {
                  result.Beneficiarios.forEach(( elementBeneficiarios :  any) => {
                    this.resultParentesco.forEach(( elementParentesco :  any) => {
                      if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                        elementBeneficiarios.DatosParentesco = elementParentesco;
                      }
                    });
                  });
                }
                this.MapearDatosCuenta(result);
                this.BuscarPorCuenta();
                this.ObtenerHistorial();
                this.VolverArriba();
                this.aportesOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          }
        }
      });
    }
  }
  ActualizarBeneficiarios() {
    let sum: any = 0;
    this.dataObjetBeneficiarios.forEach(x => { sum = sum + Number(x.Porcentaje) });
    if (sum != 100 && this.dataObjetBeneficiarios.length > 0) {
      this.notif.onWarning('Advertencia', 'La suma del porcentaje debe ser igual al 100%.');
      return;
    }
    this.loading = true;
    this.btnActualizarBeneficiarios = false;
    this.BenificiariosElminar.forEach(x => this.dataObjetBeneficiarios.push(x));
    this.aportesServices.getActualizaBeneficiarios(this.dataObjetBeneficiarios).subscribe(x => {
      this.bloquearDocumentoBenf = false;
      this.btnActualizarBeneficiario = true;
      this.notif.onSuccess('Exitoso', 'Se adicionó y/o eliminó beneficiario correctamente.');
      this.btnOpcionActualizarBeneficiario = true;
      this.clearBeneficiario();
      let beneficiariosLog: any[] = [];
      this.dataObjetBeneficiarios.forEach(x => {
        beneficiariosLog.push({
          Accion: x.Accion == "Crear" ? "Adicionar" : x.Accion,
          TipoDocumento: x.DescripcionTipoDocumento,
          Documento: x.NumeroDocumento,
          Nombre: x.PrimerApellido + " " + (x.SegundoApellido == null ? '' : x.SegundoApellido) + " " + x.PrimerNombre + " " + (x.SegundoNombre == null ? '' : x.SegundoNombre),
          Porcentaje: x.Porcentaje + "%",
          Parentesco: x.DatosParentesco.Descripcion == null ? x.DatosParentesco : x.DatosParentesco.Descripcion,
          FechaMatricula: new DatePipe('en-CO').transform(x.FechaMatricula, 'yyyy/MM/dd  HH:mm:ss')
        });
      });
      beneficiariosLog = beneficiariosLog.filter(x => x.Accion != "DB");
      beneficiariosLog.forEach(x => {
        if (x.Accion == "Adicionar" || x.Accion == "Actualizar")
          delete x.FechaMatricula;
      });
      this.Guardarlog(beneficiariosLog);
      
      setTimeout(() => {
        this.ObtenerHistorial();
        this.aportesOperacionFrom.get('Codigo')?.reset();
        this.BuscarPorCuenta();
      }, 300);
      this.aportesFrom.get('DocumentoBeneficiario')?.disable();
      this.loading = false;
      this.BenificiariosElminar = [];
      this.dataObjetBeneficiarios = [];
    }, err => {
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.onDanger('Error', errorMessage);
      console.log(errorMessage);
      this.BenificiariosElminar = [];
      this.dataObjetBeneficiarios = this.dataObjetBeneficiarios.filter(x => x.Accion != "Eliminar");
    });
  }
  ActualizarAportes() {
    if (this.aportesFrom.get('IdOficina')?.value  !== null
      && this.aportesFrom.get('IdOficina')?.value  !== undefined
      && this.aportesFrom.get('IdOficina')?.value  !== ''
      && this.aportesFrom.get('IdProductoCuenta')?.value  !== null
      && this.aportesFrom.get('IdProductoCuenta')?.value  !== undefined
      && this.aportesFrom.get('IdProductoCuenta')?.value  !== ''
      && this.aportesFrom.get('IdConsecutivo')?.value  !== null
      && this.aportesFrom.get('IdConsecutivo')?.value  !== undefined
      && this.aportesFrom.get('IdConsecutivo')?.value  !== ''
      && this.aportesFrom.get('IdDigito')?.value  !== null
      && this.aportesFrom.get('IdDigito')?.value  !== undefined
      && this.aportesFrom.get('IdDigito')?.value  !== '') {
      this.aportesFrom.get('IdOficina')?.setValue(this.datoIdOficina);
      this.aportesFrom.get('IdProducto')?.setValue(this.datoIdProducto);
      this.aportesFrom.get('IdConsecutivo')?.setValue(this.datoIdConsecutivo);
      if (this.aportesOperacionFrom.get('Codigo')?.value  === '21') {         // Actualizar la forma de pago
        if (+this.aportesFrom.get('IdFormaPago')?.value  !== this.datoformaPago) {
          this.datoformaPago = +this.aportesFrom.get('IdFormaPago')?.value ;
          this.loading = true;
          this.aportesServices.getEditarFormaPago(this.aportesFrom.value).subscribe(
            result => {
              this.loading = false;
              this.BloquearDatoBenf = false;
              this.BloquearNombreBenf = false;
              this.BloquearAsociado = false;
              this.BloquearbtnBenef = false;
              this.notif.onSuccess('Exitoso', 'El cambio de forma de pago se realizó correctamente.');
              this.btnGuardar = true;
              this.aportesFrom.get('IdCuenta')?.setValue(result.IdCuenta);
              this.btnActualizar = true;
              this.btnActualizarBeneficiario = true;
              this.BloquearFormaPago = false;
              this.VolverArriba();
              this.Guardarlog();
              this.aportesOperacionFrom.get('Codigo')?.reset();
              this.ObtenerHistorial();
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        } else {
          this.notif.onWarning('Advertencia', 'Debe cambiar forma de pago.');
          this.bloquearbtnActalizar = false;
        }
      }  else if (this.aportesOperacionFrom.get('Codigo')?.value  === '19') {  // Actualizar el asesor externo
        if ((+this.AsesorFrom.get('strCodigo')?.value  !== this.datoAsesorExterno)
          && (this.AsesorFrom.get('strCodigo')?.value  !== this.datoAsesorExterno)) {
          const IdAsesor = this.AsesorFrom.get('strCodigo')?.value ;
          const NombreAsesor = this.AsesorFrom.get('strNombre')?.value ;

          if (IdAsesor !== null && IdAsesor !== '' && IdAsesor !== undefined &&
            NombreAsesor !== null && NombreAsesor !== '' && NombreAsesor !== undefined) {
            this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value ;
            this.aportesFrom.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            this.datoAsesorExterno = +this.AsesorFrom.get('strCodigo')?.value ;

            this.aportesServices.getEditarAsesorExterno(this.aportesFrom.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearDatoBenf = false;
                this.BloquearNombreBenf = false;
                this.BloquearAsociado = false;
                this.BloquearbtnBenef = false;
                this.notif.onSuccess('Exitoso', 'El cambio asesor externo se realizó correctamente.'
                  );
                this.btnGuardar = true;
                this.Guardarlog();
                this.aportesFrom.get('IdCuenta')?.setValue(result.IdCuenta);                
                this.btnActualizar = true;
                this.btnActualizarBeneficiario = true;
                this.BloquearFormaPago = false;
                this.BloquearAsesorExterno = false;
                this.aportesOperacionFrom.get('Codigo')?.reset();
                this.ObtenerHistorial();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              });

            this.ObtenerHistorial();
          } else if ((IdAsesor === null || IdAsesor === '' || IdAsesor === undefined) &&
            (NombreAsesor === null || NombreAsesor === '' || NombreAsesor === undefined)) {
            this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value ;
            this.aportesFrom.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            this.datoAsesorExterno = +this.AsesorFrom.get('strCodigo')?.value ;

            this.aportesServices.getEditarAsesorExterno(this.aportesFrom.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearDatoBenf = false;
                this.BloquearNombreBenf = false;
                this.BloquearAsociado = false;
                this.BloquearbtnBenef = false;
                this.notif.onSuccess('Exitoso', 'El Cambio asesor externo se realizó correctamente.'
                  );
                this.btnGuardar = true;
                this.Guardarlog();
                this.aportesFrom.get('IdCuenta')?.setValue(result.IdCuenta);
                this.ObtenerHistorial();
                this.btnActualizar = true;
                this.btnActualizarBeneficiario = true;
                this.BloquearFormaPago = false;
                this.BloquearAsesorExterno = false;
                this.aportesOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              });
            this.ObtenerHistorial();
          } else {
            this.notif.onWarning('Advertencia', 'Debe seleccionar un asesor válido.');
          }

        } else {
          this.notif.onWarning('Advertencia', 'Debe cambiar asesor externo.');
          this.bloquearbtnActalizar = false;
        }
      }
    }
  }
  getUser() {
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.aportesFrom.get('IdUserLogin')?.setValue(this.dataUser.IdAsesor);
  }
  ObtenerHistorial() {
    this.loading = true;
    const IdOficina = this.aportesFrom.get('IdOficina')?.value ;
    const IdProductoCuenta = this.aportesFrom.get('IdProductoCuenta')?.value ;
    const IdConsecutivo = this.aportesFrom.get('IdConsecutivo')?.value ;
    const IdDigito = this.aportesFrom.get('IdDigito')?.value ;
    this.aportesServices.ObtenerHistorial
      ({ 'IdOficina': IdOficina, 'IdProductoCuenta': IdProductoCuenta, 'IdConsecutivo': IdConsecutivo, 'IdDigito': IdDigito  }).subscribe(
        result => {
          this.loading = false;
          this.dataHistorial = result;
          this.dataHistorial.forEach(element => {
            if (element.Operacion == 10)
              element.Detalles = "";
            else if (element.Detalles != null && element.Detalles != "") {
              const tempchar: string = '"'
              element.Detalles = element.Detalles.toString().replace(/{/g, "").replace(/}/g, "").replace(/\[/g, "").replace(/\]/g, "");
              element.Detalles = element.Detalles.toString().replace(new RegExp(tempchar, 'g'), '');
              element.Detalles = element.Detalles.toString().replace(new RegExp(',', 'g'), '  ');
              element.Detalles = element.Detalles.toString().replace(/\\/g, '');
              this.longitudDetalle(element.Detalles)
            }
          });
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
  }
  longitudDetalle(detalle: string) {
    let longitud = detalle.length * 8
    if (longitud >= this.widthDetalle) {
      this.widthDetalle = longitud
    }
  }
  armarJsonDto(obj: any, accion: string) {
    let dato  = {
      'NumeroDocumento': obj.NumeroDocumento,
      'DatosParentesco': obj.DatosParentesco,
      'PrimerApellido': obj.PrimerApellido,
      'SegundoApellido': obj.SegundoApellido,
      'PrimerNombre': obj.PrimerNombre,
      'SegundoNombre': obj.SegundoNombre,
      'Porcentaje': obj.Porcentaje,
      'Accion' : accion
    }
    this.dataBeneficiariosEliminados.push(dato); 
  }
  generarAportesDto() {
    let data : any = new AperturaCuentaDto();
    data.Documento = this.aportesFrom.get('NumeroDocumento')?.value 
    data.Nombre = this.aportesFrom.get('Nombre')?.value 
    data.Oficina = this.aportesFrom.get('NombreOficina')?.value  
    data.IdProducto = this.aportesFrom.get('IdProducto')?.value 
    data.Producto = this.aportesFrom.get('DescripcionProducto')?.value 
    data.OperacionPermitida = this.aportesFrom.get('DescripcionOperacion')?.value  
    data.IdAsesor = this.aportesFrom.get('IdAsesor')?.value 
    data.Asesor = this.aportesFrom.get('NombreAsesor')?.value 
    data.Estado = this.aportesFrom.get('DescripcionEstado')?.value 
    data.IdAsesorExterno = this.AsesorFrom.get('strCodigo')?.value 
    data.AsesorExterno = this.AsesorFrom.get('strNombre')?.value 
    data.FormaPago = this.aportesFrom.get('DescripcionFormaPago')?.value 
    if (this.dataObjet != undefined && this.dataObjet.Beneficiarios != null && this.dataObjet.Beneficiarios.length > 0) {
      if ("Beneficiarios" in this.dataObjet) {
        data.Beneficiarios = []
        this.dataObjet.Beneficiarios.forEach((bene : any) => {
          let snBenef = bene.SegundoNombre == null ? '' : bene.SegundoNombre
          let pnBenef = bene.PrimerNombre == null ? '' : bene.PrimerNombre
          let saBenef = bene.SegundoApellido == null ? '' : bene.SegundoApellido
          let paBenef = bene.PrimerApellido == null ? '' : bene.PrimerApellido
          let nombre = `${paBenef} ${saBenef} ${pnBenef} ${snBenef}`
          data.Beneficiarios.push({
            "DocumentoBeneficiario": bene.NumeroDocumento,
            "NombreBeneficiario": nombre,
            "Porcentaje": bene.Porcentaje,
            "Parentesco": bene.DatosParentesco.Descripcion
          })
        });
      }
    }
    for (let clave in data){
      if (data[clave] == null || data[clave] == "") {
        delete data[clave];
      }
    }
    return data;
  }
  generarCambioAsesor(cambio:string) {
    let data = new CambiarAsesorDto();
    let form = this.AsesorFrom.value
    if (cambio == 'Anterior') {
      data.IdAsesorExternoAnterior = form.strCodigo == null ? '' : form.strCodigo;
      data.AsesorExternoAnterior = form.strNombre == null ? '' : form.strNombre;
    } else if (cambio=='Actualiza') {
      data = this.dataCambioAsesorExterno;
      data.IdAsesorExternoActualiza = form.strCodigo == null ? '' : form.strCodigo;
      data.AsesorExternoActualiza = form.strNombre == null ? '' : form.strNombre;
    }
    this.dataCambioAsesorExterno = data
    return this.dataCambioAsesorExterno; 
  }
  generarCambioFormaPago(cambio:string) {
    let data = new CambiarFormaPagoDto();
    if (cambio == 'Anterior') {
      data.FormaPagoAnterior = this.obtenerFormaPago() 
    } else if (cambio == 'Actualiza') {
      data = this.dataCambioForma;
      data.FormaPagoActualiza = this.obtenerFormaPago()
    }
    this.dataCambioForma = data
    return this.dataCambioForma; 
  }
  obtenerFormaPago() {
    let descripcion = '';
    this.resultFormaPago.forEach((fp : any) => {
      if (fp.IdFormaPago == this.aportesFrom.get('IdFormaPago')?.value ) {
        descripcion = fp.DescripcionFormaPago;
      }
    });
    return descripcion;
  }
  Guardarlog(Aporteslog: any = null) {
    this.loading = true;
    if (Aporteslog == 10) {
      const fecha =  new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd  HH:mm:ss');
      this.generalesService.GuardarlogProductos(this.generarAportesDto(), 10,
      this.aportesFrom.get('IdCuenta')?.value , this.aportesFrom.get('LngTercero')?.value , 16).subscribe(
        result => {
          this.loading = false;
          this.aportesOperacionFrom.get('Codigo')?.reset();
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    } else {
      let datos: any;
      if (this.aportesOperacionFrom.get('Codigo')?.value  == '11' || this.aportesOperacionFrom.get('Codigo')?.value  == '9')
        datos = Aporteslog;
      else if (this.aportesOperacionFrom.get('Codigo')?.value  == '19')
        datos = this.generarCambioAsesor('Actualiza');
      else
        datos = this.generarCambioFormaPago('Actualiza');

      this.generalesService.Guardarlog(datos, this.aportesOperacionFrom.get('Codigo')?.value ,
      this.aportesFrom.get('IdCuenta')?.value , this.aportesFrom.get('LngTercero')?.value , 16).subscribe(
        result => {
          this.loading = false;

        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  ValorTotal() {
    const Canje = +this.aportesFrom.get('Canje')?.value ;
    const Efectivo = +this.aportesFrom.get('Efectivo')?.value ;
    this.aportesFrom.get('SaldoTotal')?.setValue(Canje + Efectivo);
  }
  VolverArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
  VolverAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }
  ValidarNumero() {
    const valor = this.aportesFrom.get('Porcentaje')?.value ;
    if (valor < 0 || valor === null) {
      this.aportesFrom.get('Porcentaje')?.setValue(0);
    }


  }
  ValidarIdOficina() {
    if (this.aportesFrom.get('IdOficina')?.valid === false) {
      this.aportesFrom.get('IdOficina')?.reset();
    }
  }
  ValidarIdProducto() {
    if (this.aportesFrom.get('IdProductoCuenta')?.valid === false) {
      this.aportesFrom.get('IdProductoCuenta')?.reset();
    }
  }
  ValidarIdConsecutivo() {
    if (this.aportesFrom.get('IdConsecutivo')?.valid === false) {
      this.aportesFrom.get('IdConsecutivo')?.reset();
    }
  }
  ValidarIdDigito() {
    if (this.aportesFrom.get('IdDigito')?.valid === false) {
      this.aportesFrom.get('IdDigito')?.reset();
    }
  }
  ValidarDocumento() {
    const valor = this.aportesFrom.get('DocumentoBeneficiario')?.value ;
    if (valor < 0 || valor === null) {
      this.aportesFrom.get('DocumentoBeneficiario')?.setValue(0);
    }
    if (this.aportesFrom.get('DocumentoBeneficiario')?.valid === false) {
      this.aportesFrom.get('IdTipoDocumento')?.reset();
      this.aportesFrom.get('DocumentoBeneficiario')?.reset();
      this.aportesFrom.get('PrimerApellido')?.reset();
      this.aportesFrom.get('SegundoApellido')?.reset();
      this.aportesFrom.get('PrimerNombre')?.reset();
      this.aportesFrom.get('SegundoNombre')?.reset();
      this.aportesFrom.get('DatosParentesco')?.reset();
      this.aportesFrom.get('Porcentaje')?.reset();
    }
  }
  ÖbtenerConvenio() {
    this.loading = true;
    this.aportesServices.getÖbtenerConvenioAportes(this.aportesFrom.value).subscribe(
      result => {
        this.loading = false;
        if (result.length === 1) {
          this.bloquearbtnActalizar = true;
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          this.notif.onWarning('Advertencia', result.Mensaje);
          this.aportesFrom.get('IdFormaPago')?.setValue('0');
        } else {
          this.bloquearbtnActalizar = true;
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  devolverTab(tab : number) {
    switch (tab) {
      case 1:
        this.activaSaldos = true;
        this.activaBeneficiarios = false;
        this.activaHistorial = false;
        break;
      case 2:
        this.activaSaldos = false;
        this.activaBeneficiarios = true;
        this.activaHistorial = false;
        break;
      case 3:
        this.activaSaldos = false;
        this.activaBeneficiarios = false;
        this.activaHistorial = true;
        break;
    }
  }
  CambiarColor(fil : number, producto : number) {
     
    if (producto === 1) {
      $(".filApo_" + this.ColorAnterior1).css("background", "#FFFFFF");
      $(".filApo_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior1 = fil;
    }
    if (producto === 2) {
      $(".FilBenf_" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".FilBenf_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior2 = fil;
    }
  }

  ValidateForm() {
    const Codigo = new FormControl('', [Validators.required]);
    const IdProducto = new FormControl('', [Validators.required]);
    const DescripcionProducto = new FormControl('', [Validators.required]);
    const IdFormaPago = new FormControl('', []);
    const IdEstado = new FormControl('', []);
    const Nombre = new FormControl('', [Validators.required]);
    const NumeroDocumento = new FormControl('', [Validators.required]);
    const NombreOficina = new FormControl('', [Validators.required]);
    const NumeroOficina = new FormControl('', [Validators.required]);
    const IdAsesor = new FormControl('', [Validators.required]);
    const NombreAsesor = new FormControl('', [Validators.required]);
    const DescripcionFormaPago = new FormControl('', [Validators.required]);
    const DescripcionEstado = new FormControl('', [Validators.required]);
    const DescripcionOperacion = new FormControl('', [Validators.required]);
    const IdConsecutivo = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdOficina = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdDigito = new FormControl('', [Validators.pattern('[0-9]*')]);
    const BuscarDocumento = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdProductoCuenta = new FormControl('', [Validators.pattern('[0-9]*')]);
    const BuscarNombre = new FormControl('', []);
    const Efectivo = new FormControl('', []);
    const Canje = new FormControl('', []);
    const SaldoRevalorizacion = new FormControl('', []);
    const SaldoTotal = new FormControl('', []);
    const SaldoInicial = new FormControl('', []);
    const FechaApertura = new FormControl('', []);
    const FechaUltimaTrans = new FormControl('', []);
    const FechaCancelacion = new FormControl('', []);
    const fechaRevalorizacion = new FormControl('', []);
    const DatosParentesco = new FormControl('', []);
    const PrimerNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const SegundoNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const PrimerApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const SegundoApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const DocumentoBeneficiario = new FormControl('', [Validators.pattern('^[0-9]*')]);
    const IdTipoDocumento = new FormControl('', []);
    const Porcentaje = new FormControl('', [Validators.pattern('^[0-9]*')]);
    const IdUserLogin = new FormControl('', []);
    const Beneficiarios = new FormControl('', []);
    const IdCuenta = new FormControl('', []);
    const IdUsuarioSGF = new FormControl('', []);
    const strCodigo = new FormControl('', []);
    const strNombre = new FormControl('', []);
    const IdComentario = new FormControl('', []);
    const strTipo = new FormControl('', []);
    const Observacion = new FormControl('', []);
    const IdTipoObservacion = new FormControl('', []);
    const lngCuenta = new FormControl('', []);
    const lngTercero = new FormControl('', []);
    const IdAsesorExterno = new FormControl('', []);
    const LngTercero = new FormControl('', []);

    this.aportesFrom = new FormGroup({
      Nombre: Nombre,
      NumeroDocumento: NumeroDocumento,
      IdProducto: IdProducto,
      DescripcionProducto: DescripcionProducto,
      IdFormaPago: IdFormaPago,
      DescripcionFormaPago: DescripcionFormaPago,
      IdEstado: IdEstado,
      DescripcionEstado: DescripcionEstado,
      DescripcionOperacion: DescripcionOperacion,
      NombreOficina: NombreOficina,
      NumeroOficina: NumeroOficina,
      IdAsesor: IdAsesor,
      NombreAsesor: NombreAsesor,
      IdConsecutivo: IdConsecutivo,
      IdOficina: IdOficina,
      IdDigito: IdDigito,
      BuscarDocumento: BuscarDocumento,
      IdProductoCuenta: IdProductoCuenta,
      BuscarNombre: BuscarNombre,
      Efectivo: Efectivo,
      Canje: Canje,
      SaldoInicial: SaldoInicial,
      SaldoTotal: SaldoTotal,
      SaldoRevalorizacion: SaldoRevalorizacion,
      FechaApertura: FechaApertura,
      FechaUltimaTrans: FechaUltimaTrans,
      FechaCancelacion: FechaCancelacion,
      DatosParentesco: DatosParentesco,
      PrimerNombre: PrimerNombre,
      SegundoNombre: SegundoNombre,
      PrimerApellido: PrimerApellido,
      SegundoApellido: SegundoApellido,
      DocumentoBeneficiario: DocumentoBeneficiario,
      IdTipoDocumento: IdTipoDocumento,
      Porcentaje: Porcentaje,
      fechaRevalorizacion: fechaRevalorizacion,
      Beneficiarios: Beneficiarios,
      IdUserLogin: IdUserLogin,
      IdCuenta: IdCuenta,
      IdUsuarioSGF: IdUsuarioSGF,
      IdComentario: IdComentario,
      IdAsesorExterno: IdAsesorExterno,
      LngTercero: LngTercero
    });

    this.aportesOperacionFrom = new FormGroup({
      Codigo: Codigo,
    });
    this.AsesorFrom = new FormGroup({
      strCodigo: strCodigo,
      strNombre: strNombre,
      strTipo: strTipo
    });
    this.CambioEstadoFrom = new FormGroup({
      lngTercero: lngTercero,
      lngCuenta: lngCuenta,
      Observacion: Observacion,
      IdTipoObservacion: IdTipoObservacion
    });
  }
}

