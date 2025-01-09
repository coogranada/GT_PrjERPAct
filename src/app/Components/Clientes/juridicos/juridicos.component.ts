import { DatePipe, formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, DoCheck } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { fromEvent, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from '../../../app.component';
import { ServiceSolictedModel, SolicitudServiciosModel } from '../../../Models/Clientes/Juridicos/SolicitudServiciosModel';
import { EnvioMotivoJuridicoModel, MotivoRetiroJuridicoModel } from '../../../Models/Clientes/motivoRetiro.model';
import { AsesorModel, AsesorModelPpal } from '../../../Models/Generales/Asesor.model';
import { OperacionesModel } from '../../../Models/Maestros/operaciones.model';
import { CuentaModel } from '../../../Models/Productos/cuenta.model';
import { ClientesGetListService } from '../../../Services/Clientes/clientesGetList.service';
import { JuridicosService } from '../../../Services/Clientes/Juridicos.service';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { GestioOperacionesService } from '../../../Services/Gestiones/gestioOperaciones.service';
import { LoginService } from '../../../Services/Login/login.service';
import { OficinasService } from '../../../Services/Maestros/oficinas.service';
import { OperacionesService } from '../../../Services/Maestros/operaciones.service';
import { GeneralesService } from '../../../Services/Productos/generales.service';
import { RecursosGeneralesService } from '../../../Services/Utilidades/recursosGenerales.service';
import swal from 'sweetalert2';
import { GestionesOperacionesComponent } from '../../GestionesOperaciones/gestiones-operaciones/gestiones-operaciones.component';
import { SolicitudesGestionesComponent } from '../../GestionesOperaciones/solicitudes-gestiones/solicitudes-gestiones.component';
import { AccionistasComponent } from './Tabs/accionistas/accionistas.component';
import { ContactoComponent } from './Tabs/contacto/contacto.component';
import { EntrevistaComponent } from './Tabs/entrevista/entrevista.component';
import { FinancieraComponent } from './Tabs/financiera/financiera.component';
import { HistorialComponent } from './Tabs/historial/historial.component';
import { InfoJuridicosComponent } from './Tabs/info-juridicos/info-juridicos.component';
import { PatrimonioComponent } from './Tabs/patrimonio/patrimonio.component';
import { ReferenciasComponent } from './Tabs/referencias/referencias.component';
import { RepresentanteLegalComponent } from './Tabs/representante-legal/representante-legal.component';
import { SolicitudServiciosJuridicosComponent } from '../../Formatos-impresion/solicitud-servicios-juridicos/solicitud-servicios-juridicos.component';
import { ClientesService } from '../../../Services/Clientes/clientes.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { Cardinales, Divisas, Inmueble, Vias }  from '../../../../environments/Maestros.Naturales';
import { NgxToastService } from 'ngx-toast-notifier';
//import { ProviderAst } from '@angular/compiler';
declare var $: any;
const PrimaryWhite = 'rgb(13,165,80)';
const SecondaryGrey = 'rgb(13,165,80,0.7)';
@Component({
  selector: 'app-juridicos',
  templateUrl: './juridicos.component.html',
  styleUrls: ['./juridicos.component.css'],
  providers: [ModuleValidationService, OperacionesService, OficinasService,
    ClientesGetListService, RecursosGeneralesService, JuridicosService,
    GeneralesService, GestioOperacionesService, LoginService,ClientesService],
    standalone : false
})
export class JuridicosComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck  {
   
  //#region Variables internas modal o btn
  @ViewChild('AbrirListaJuridicosModal', { static: false }) AbrirListaJuridicosModal!: ElementRef;
  //#endregion
  //#region Declaracion variables de comunicacion
  @ViewChild('infoJuridicoComponent', { static: false }) infoJuridicoComponent!: InfoJuridicosComponent;
  @ViewChild('contactoComponet', { static: false }) contactoComponet!: ContactoComponent;
  @ViewChild('financieraComponent', { static: false }) financieraComponent!: FinancieraComponent;
  @ViewChild('patrimonioComponent', { static: false }) patrimonioComponent!: PatrimonioComponent;
  @ViewChild('representanteComponent', { static: false }) representanteComponent!: RepresentanteLegalComponent;
  @ViewChild('accionistasComponent', { static: false }) accionistasComponent!: AccionistasComponent;
  @ViewChild('referenciasComponent', { static: false }) referenciasComponent!: ReferenciasComponent;
  @ViewChild('entrevistaComponent', { static: false }) entrevistaComponent!: EntrevistaComponent;
  @ViewChild('historialComponent', { static: false }) historialComponent!: HistorialComponent;
  @ViewChild('GesOperaComponent', { static: false }) GesOperaComponent!: GestionesOperacionesComponent;
  @ViewChild('SolicitudGestion', { static: false }) solicitudesGestionesComponent!: SolicitudesGestionesComponent;
  @ViewChild('SolicitudServicios', { static: false }) solicitudesServiciosJuridicoComponent!: SolicitudServiciosJuridicosComponent;
  
  
  //#region Botones|
  // Botones sgiuiente tab
  @ViewChild('botonBasico', { static: true }) private botonBasico!: ElementRef;
  @ViewChild('botonContacto', { static: true }) private botonContacto!: ElementRef;
  @ViewChild('botonFinanciero', { static: true }) private botonFinanciero!: ElementRef;
  @ViewChild('botonPatrimonio', { static: true }) private botonPatrimonio!: ElementRef;
  @ViewChild('botonRepresentante', { static: true }) private botonRepresentante!: ElementRef;
  @ViewChild('botonConRepresentante', { static: true }) private botonConRepresentante!: ElementRef;
  @ViewChild('botonAccionistas', { static: true }) private botonAccionistas!: ElementRef;
  @ViewChild('botonReferencia', { static: true }) private botonReferencia!: ElementRef;
  @ViewChild('botonEntrevista', { static: true }) private botonEntrevista!: ElementRef;
  @ViewChild('botonHistorial', { static: true }) private botonHistorial!: ElementRef;

  @ViewChild('AbrirSolicitudGestion', { static: true }) private AbrirSolicitudGestion!: ElementRef;
  @ViewChild('AbrirSolicituJuridico', { static: false }) AbrirSolicituJuridico!: ElementRef;
  @ViewChild('AbrirModalServicios', { static: false }) AbrirModalServicios!: ElementRef;
  @ViewChild('AbrirImpresionServicios', { static: false }) AbrirImpresionServicios!: ElementRef;
  @ViewChild('AbrirRetiro', { static: true }) private AbrirRetiro!: ElementRef;
  @ViewChild('AbrirModalCorrespondencia', { static: true }) private AbrirModalCorrespondencia!: ElementRef;
  @ViewChild('CerrarCorrespondencia', { static: true }) private CerrarCorrespondencia!: ElementRef;
  @ViewChild('openSolicitudRetiro', { static: true }) private openSolicitudRetiro!: ElementRef;
  @ViewChild('openSolicitudRetiroReimprimir', { static: true }) private openSolicitudRetiroReimprimir!: ElementRef;
  //#endregion

  @ViewChild('AppComponent', { static: true }) appComponent!: AppComponent;
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  parentMessage = 'message from parent basico y contacto';
  otraMas = 'esta es otra';
  mostrarBotonesSiguiente = false; // Muestra todos los botones (siguientes) de los tabs
  mostrarBotonesActualizar = false;  // Muestra todos los botones (siguientes) de los tabs
  mostrarBotonesAgregar = false; // Muestra todos los botones (siguientes) de los tabs
  mostrarBotonesLimpiar = false;  // Muestra todos los botones (siguientes) de los tabs
  mostrarBotonesLimpiarInfo = false;
  @Output() mostrarBotonesCambiar = false;
  @Output() LimpiarTrasabilidad = new EventEmitter<boolean>();
  mostrarBotonesMarcarDesmarcar = false;
  ObservacionRetiro = false;
  mostarErrorMotivoDescripcion = false;
  infoEstado: any;
  DataBasico: any;
  DataInfoJuridico: any;
  DataContacto: any;
  DataRepresentaContacto: any;
  DataFinanciero: any;

  public DatosEnviados: any;
  //#endregion
  //#region Declaracion formularios
  public juridicosFrom: any;
  public serviciosFrom: any;
  public solicitudRetiroForm!: FormGroup;
  public Correspondenciasform!: FormGroup;
  //#endregion

  ProDescripcionOpe = '1';
  OperacionMarcada : string | undefined = '1';
  ProAprobacion : any;
  ProOficina : any;
  ProNit :any;
  ProRazonSocial : any;
  ProAsesor : any;
  ProAsesorExterno : any;
  ProRelacion : any;

  //#region Declaracion variables funacionales
  private moduloLocal :any;
  public dataOperaciones :any;
  private resultDataStore : any;

  public activarBasico = false;
  public activarContacto = false;
  public activarFinanciero = false;
  public activarPatrimonio = false;
  public activarRepLegal = false;
  public activarContactoRep = false;
  public activarAccionista = false;
  public activarReferencias = false;
  public activarEntrevista = false;
  public activarHistorial = false;
  public mostrarOficina = false;
  public ActivarBtnOpciones = false;

  //#endregion
  //#region Declaracion variables de bloqueo


  public bloquearForm = true;
  public bloquearBuscar : boolean | null = true;
  public bloquearNombre : boolean | null = true;
  public bloquearOficina: boolean | null = true;
  public AsessorNecesario = true;
  public BlockServicios = true;
  public BlockServiciosInput : boolean | null = null;
  public BlockVincula : boolean | null = null;
  public motrarErrorDeudor = false;
  public BlockDeudor =  null;
  public motrarErrorCredito = false;
  public mostrarErrorMotivo = false;
  public mostrarErrorCorrespondencia = false;
  public bloquearModalServicios =  null;
  public fechaRetiro = null;
  //#endregion
  //#region Declaracion variable de carga
  public dataOficinas : any[] = [];
  public condicion = false;
  public condicionBaisco = true;
  private operacionesModel: OperacionesModel;
  public listaJuridicos : any[] = [];
  public dataMotivos: any;
  public dataArrayMotivo: any[] = [];
  public dataCorrespondencia: any[] = [];
  public JuridicoSeleccionado: any;
  public dataRetiroLog = [];
  @Input() dataCiudad: any;
  //#endregion
  //#region Declaracion variable
  public infoTabAll = {
    JuridicoDto: {},
    BasicosDto: {},
    ContactoDto: {},
    FinancieroDto: {},
    PatrimonioDto: {},
    RepresentanteDto: {},
    AccionistaDto: {},
    ReferenciasDto: {},
    EntrevistaDto: {},
    tratamientoDto: {},
    userWork: '',
    Representa: 0
  };
  private CodModulo = 12;
  public Modulo = this.CodModulo;
  public dataDepartamentosAll: any;
  public dataCiudadesAll: any;
  public dataPaisesAll: any;
  public dataBarriosAll: any;
  // public Modulo = this.CodModulo;
  public CuentaSolicitud: CuentaModel = new CuentaModel;
  public DocumentoSolicitud : any;
  public OpcionSeleccionada: any;
  public objMotivo = new MotivoRetiroJuridicoModel();
  public objMotivoEnvio = new EnvioMotivoJuridicoModel();
  public dataSendPrint = new SolicitudServiciosModel();
  public dataServiceSolicited = new ServiceSolictedModel();
  public motivoEnvioJson: any;
  public motivoEnvioRetiroJson: any;
  public operacionSeleccion = 0;
  private dataGestionOperacion: any;
  public documentoConsultar: any;
  private emitEventJuridico: EventEmitter<boolean> = new EventEmitter<boolean>();
  private emitEventComunicacionInfo: EventEmitter<any> = new EventEmitter<any>();
  public retiro: any;
  public juridico: any;
  public nitJuridicoGuardado: any;
  //#endregion
  public DatosUsuario : any;
  operacionesSubscription: Subscription;
  ciudadSubscription!: Subscription ;
  letrasSubscription!: Subscription;
  divisasSubscription!: Subscription;
  estadosSubscription!: Subscription;
  public dataDivisas: any;
  public dataImuebles: any;
  public dataCardinal: any;
  public dataVias: any;
  public obliAsteriscoPadre = true;
  btnBuscar = true;

  esReimpresion = false;
  constructor(private moduleValidationService: ModuleValidationService, private el: ElementRef,
    private operacionesService: OperacionesService, private notif: NgxToastService, private oficinasService: OficinasService,
    private clientesGetListService: ClientesGetListService, private recursosGeneralesService: RecursosGeneralesService,
    private juridicosService: JuridicosService, private generalesService: GeneralesService,
    private gestionServiceOperacion: GestioOperacionesService, private loginService: LoginService, private router: Router,
    private clientesService: ClientesService) {
      let data : string | null = localStorage.getItem('Data');
      this.resultDataStore  = JSON.parse(window.atob(data == null ? "" : data));
    this.moduloLocal = 12;
    const arrayExample = [{
      'IdModulo': this.moduloLocal,
      'IdUsuario': this.resultDataStore.IdUsuario,
      'IdPerfil': this.resultDataStore.UsuarioPerfil
    }];
    this.operacionesSubscription = this.operacionesService.OperacionesPermitidasNaturales(arrayExample[0]).subscribe(
      result => {
        this.dataOperaciones = result;
      },
      error => {
        this.notif.onDanger('Error', error);
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => resulr);
    this.operacionesModel = new OperacionesModel();
   
    this.dataCardinal = Cardinales;
    this.dataDivisas = Divisas;
    this.dataImuebles = Inmueble;
    this.dataVias = Vias;
  }

  ngOnInit() { 
    this.generalesService.Autofocus('operacionJs');

    this.IrArriba();
    this.GetCiudad();
    this.GetPaisesList();
    this.GetEstado();
    this.GetOficinas();

    this.condicion = true;
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.validateJuridicos();
    this.validateServicios();
    this.validateSolicitudRetiro();
    this.ValidateCorrespondencia();
    this.DestinoCapitalice();
    
    this.activarBasico = true;
    this.BloquearTabs();
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
    
    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      }
    );
    this.IrArriba();
  }

  ngAfterViewInit() {
    let data : string | null = localStorage.getItem('Data');
    const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
    this.infoJuridicoComponent.emitEventOficina.subscribe(result => {
      if (result) {
        this.bloquearOficina = true;
        this.juridicosFrom.get('operacion')?.reset();
        this.consultarJuridicosNit(this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value);
      }
    });

    this.infoJuridicoComponent.emitEventResetOperacion.subscribe(reset => {
      if (reset) {
        this.juridicosFrom.get('operacion')?.reset();
        this.consultarJuridicosNit(this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value);
      }
    });

    this.entrevistaComponent.emitEventEntrevista.subscribe(res => {
      if (res) {
        this.juridicosFrom.get('operacion')?.reset();
        this.consultarJuridicosNit(this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value);
      }
      this.BloquearCamposFormularios();
    });
 
    this.entrevistaComponent.emitEventGuardado.subscribe(res => {
      this.loading = true;
      if (+res.cargar === 1) {
        this.LimpiarFormularios();
        this.ActivarBtnOpciones = false;
        this.nitJuridicoGuardado = res.consultar;
        // realiza la consulta del asociado guardado
        this.consultarJuridicosNit(res.consultar);
        this.infoTabAll = {
          JuridicoDto: {},
          BasicosDto: {},
          ContactoDto: {},
          FinancieroDto: {},
          PatrimonioDto: {},
          RepresentanteDto: {},
          AccionistaDto: {},
          ReferenciasDto: {},
          EntrevistaDto: {},
          tratamientoDto: {},
          userWork: '',
          Representa: 0
        };
        // aqui abre el modal de correspondencia
        this.juridicosService.ObtenerContactosPrincpales(res.consultarTercero).subscribe(
        result => {
          this.dataCorrespondencia = result;
          if(+res.relacion === 15) { // aqui valido si guardo un tercero solo dejo modificar codeudor
            this.bloquearModalServicios = null;
            this.BlockDeudor = null;
          } else {
            this.bloquearModalServicios = null;
            this.BlockDeudor = null;
          }
          this.AbrirModalCorrespondencia.nativeElement.click();
        },
        error => {
          console.error('Error consultar deudor - ' + error);
        });
      }
    });

    this.historialComponent.emitEventReimprimir.subscribe(res => {
      if (+res.cargar === 1) {
        this.Reimprimir(res.consultar,this.JuridicoSeleccionado);
      }
    });
    // Metdod para mapear la gestion de operaciones
    this.emitEventJuridico.subscribe(res => {
      const GetOperacion = Number(localStorage.getItem('EsGestion'));
      if (GetOperacion === 1) {
        this.loading = true;
        let datages : string | null = localStorage.getItem('DataGest')
        this.dataGestionOperacion = JSON.parse(datages == null ? "" : datages);
        localStorage.removeItem('EsGestion');
        localStorage.removeItem('DataGest');
        this.MapearGestion(this.dataGestionOperacion);
      }
    });

    this.solicitudesGestionesComponent.emitEventJuridicoSolicitud.subscribe(res => {
        if (res) {
          this.juridicosFrom.get('operacion')?.reset();
        }
    })

    this.contactoComponet.emitEventContacto.subscribe(res => {
      this.juridicosService.ObtenerContactosPrincpales(res.tercero).subscribe(
        result => {
          this.dataCorrespondencia = result;
          this.AbrirModalCorrespondencia.nativeElement.click();
        },
        error => {
          console.error('Error consultar deudor - ' + error);
        });
    })

    this.emitEventComunicacionInfo.subscribe(res => {
      this.infoJuridicoComponent.emitEventComunicacion.emit(res);
    });

    this.infoJuridicoComponent.clienteSeleccionado.subscribe(res => {
      console.log(res);
    
      this.financieraComponent.clienteSeleccionado = res.tipoClienteSelect;
      this.patrimonioComponent.clienteSeleccionado = res.tipoClienteSelect;
      this.representanteComponent.clienteSeleccionado = res.tipoClienteSelect;
      this.accionistasComponent.clienteSeleccionado = res.tipoClienteSelect;
      this.referenciasComponent.clienteSeleccionado = res.tipoClienteSelect;
      this.entrevistaComponent.clienteSeleccionado = res.tipoClienteSelect;
      this.contactoComponet.tipoCliente = res.tipoClienteSelect;

      // asignacion de asterisco
      if (res.tipoClienteSelect === 5 && res.isProveedor === false) { // Asociado
      this.contactoComponet.obligatoriCliente = true;
      this.financieraComponent.obligatoriCliente = true;
      this.patrimonioComponent.obligatoriCliente = true;
      this.representanteComponent.obligatoriCliente = true;
      this.accionistasComponent.obligatoriCliente = true;
      this.referenciasComponent.obligatoriCliente = true;
      } else  if(res.tipoClienteSelect === 15 && res.isProveedor === false){ // Tercero
        this.contactoComponet.obligatoriCliente = true;
        this.financieraComponent.obligatoriCliente = true;
        this.patrimonioComponent.obligatoriCliente = true;
        this.representanteComponent.obligatoriCliente = true;
        this.accionistasComponent.obligatoriCliente = false;
        this.referenciasComponent.obligatoriCliente = false;
      } else if (res.tipoClienteSelect === 15 && res.isProveedor === true) { // Tercero proveedores 
        this.contactoComponet.obligatoriCliente = true;
        this.financieraComponent.obligatoriCliente = false;
        this.patrimonioComponent.obligatoriCliente = false;
        this.representanteComponent.obligatoriCliente = false;
        this.accionistasComponent.obligatoriCliente = false;
        this.referenciasComponent.obligatoriCliente = false;
      }
    });

    this.contactoComponet.PrecargarPais.subscribe(res => {
      this.PreCargarPais();
    });

    this.referenciasComponent.PrecargarPais.subscribe(res => {
      this.PreCargarPais();
    })
  }

  ngOnDestroy() {
    this.operacionesSubscription.unsubscribe();
    this.ciudadSubscription.unsubscribe();
    // this.letrasSubscription.unsubscribe();
    // this.divisasSubscription.unsubscribe();
    this.estadosSubscription.unsubscribe();
  }
  ngDoCheck() {
    var operacionM = $('#OperacionMarcada').val();
    var proDescrip = $('#ProDescripcionOpe').val();  
    if (Number(operacionM) === 1 && Number(proDescrip) === 1){
      this.OperacionMarcada = undefined;
      this.ProDescripcionOpe = ' ';
      $('#OperacionMarcada').val(0);
      $('#ProDescripcionOpe').val(0); 
    } else {
      $('#OperacionMarcada').val(0);
      $('#ProDescripcionOpe').val(0); 
    }    
  }
  

  //#region Comunicacion componentes
  SolicitarGestion() {
    this.CuentaSolicitud = new CuentaModel();
    this.CuentaSolicitud = {
      IdOficina: 0,
      IdProducto: 0,
      IdConsecutivo: 0,
      IdDigito: 0
    };
    this.AbrirSolicitudGestion.nativeElement.click();
  }

  MapearGestion(dataMap : any) {
    this.juridicosFrom.get('buscar')?.setValue(dataMap.Documento);
    this.juridicosFrom.get('operacion')?.setValue(dataMap.IdOperacion);
    this.OperacionSeleccionadaOperaciones();
    if (dataMap.Documento !== '' && dataMap.Documento !== undefined && dataMap.Documento !== null) {
      this.juridicosService.BuscarJuridicosAll(dataMap.Documento, '*').subscribe(
        result => {
          this.CargarTabs(result);
          this.JuridicoSeleccionado = result.JuridicoDto.IdJuridico;
          this.entrevistaComponent.idJuridicoSearch = result.JuridicoDto.IdJuridico;
          this.entrevistaComponent.fechaMatricula = result.JuridicoDto.FechaMatricula;

          // this.juridicosFrom.get('nombre')?.reset();
          // this.juridicosFrom.get('operacion')?.reset();
          this.loading = false;
        },
        error => {
          this.notif.onDanger('Error', 'Los datos no se cargaron correctamente - ' + error);
        }
      );
    }
  }
  //#endregion

  //#region  Generales Tab
  OperacionSeleccionada() {
    this.BloquearCamposFormularios();
    this.mostrarOficina = false;
    this.LimpiarTrasabilidad.emit(true);
    localStorage.setItem('IdModuloActivo', window.btoa(JSON.stringify(this.CodModulo)));
    this.GetPaises();
    this.GetVias(this.dataVias);
    this.GetCardinalidad(this.dataCardinal);
    this.GetLetra();
    this.GetDivisas(this.dataDivisas);
    this.GetImuebles(this.dataImuebles);
    
    const operaSeleccionada = +this.juridicosFrom.get('operacion')?.value;
    this.operacionSeleccion = operaSeleccionada;
    let data : string | null = localStorage.getItem('Data');
    const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
    this.operacionesModel.idOperacion = operaSeleccionada;
    this.operacionesModel.idPerfil = resultPerfil.idPerfilUsuario;
    this.operacionesModel.idModulo = this.CodModulo;
    this.infoJuridicoComponent.bloquearEstado = true;
    if (operaSeleccionada === null || operaSeleccionada === undefined || operaSeleccionada === 0) {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una operación.');
      this.organizarTab(1);
      this.SiguienteTab(1);
    } else {
      this.EnviarOperacionFormularios(operaSeleccionada);
      if (operaSeleccionada !== 2 && operaSeleccionada !== 5 && operaSeleccionada !== 23 && operaSeleccionada !== 31 && operaSeleccionada !== 9
        && operaSeleccionada !== 1) {
          let data : string | null = localStorage.getItem('Data');
        const DataUserLog = JSON.parse(window.atob(data == null ? "" : data));
        if (DataUserLog.NumeroOficina !== '3') {
          this.gestionatrOperacionSeleccionada(operaSeleccionada, resultPerfil);        
        } else {
          this.notif.onWarning('Advertencia', 'Esta operacion no se puede realizar en la oficina administración.');
          this.ProDescripcionOpe = ' ';
          this.OperacionMarcada = undefined;
          this.organizarTab(1);
          this.SiguienteTab(1);
       } 
      } else {
        this.esReimpresion = false;
        if (operaSeleccionada === 2) { // Buscar
          let state = localStorage.getItem('state');
          this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
          this.OpcionSeleccionada = '/Buscar';

          this.ProAprobacion = '0';
          this.ProOficina = '0';
          this.ProNit = '0';
          this.ProRazonSocial = '0';
          this.ProAsesor = '0';
          this.ProAsesorExterno = '0';
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
          this.OperacionMarcada = undefined;
      
          this.btnBuscar = false;
          this.juridicosFrom.get('oficina')?.setValue(null);
          this.juridicosFrom.get('buscar')?.reset();
          this.juridicosFrom.get('nombre')?.reset();
          this.generalesService.AgregarDisabled('estadoJur');
          this.ActivarBtnOpciones = false;
          this.LimpiarFormBusqueda();
          this.bloquearBuscar = null;
          this.bloquearNombre = null;
          this.bloquearOficina = true;
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.IrArriba();
          this.infoJuridicoComponent.infoJuridicoFrom?.reset();
          this.LimpiarFormularios();
          this.desbloquearTabs();
          this.mostrarBotonesCambiar = false;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.NitConsultado = null;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.BloquearFormularios();
          this.BloquearCamposInfoJuridico();
            this.patrimonioComponent.SumaActivos = 0;
            this.patrimonioComponent.SumaPasivos = 0;
            this.patrimonioComponent.TotalPatrimonio = 0;
            this.entrevistaComponent.DesbloquearRespuesta3 = true;
            this.entrevistaComponent.DesbloquearRespuesta13 = true;
            this.entrevistaComponent.DesbloquearRespuesta16 = true;
            this.infoJuridicoComponent.MostrarConvenio = false;
            this.entrevistaComponent.MostrarFechaExento = false;
          // });
        } else if (operaSeleccionada === 5) { // Creacion de asoaciados juridicos
          let data = localStorage.getItem('Data');
          const DataUserLog = JSON.parse(window.atob(data == null ? "" : data));
          this.OpcionSeleccionada = '/Creación juridico';

          this.ProAprobacion = '0';
          this.ProOficina = '0';
          this.ProNit = '0';
          this.ProRazonSocial = '0';
          this.ProAsesor = '0';
          this.ProAsesorExterno = '0';
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
          this.OperacionMarcada = undefined;
     
          this.btnBuscar = true;
          this.juridicosFrom.get('oficina')?.setValue(null);
          this.infoJuridicoComponent.infoJuridicoFrom?.reset();
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(resultPerfil.IdAsesor);
              this.infoJuridicoComponent.infoJuridicoFrom.get('NombreAsesor')?.setValue(resultPerfil.Nombre);          
              this.LimpiarFormularios();
              this.LimpiarFormBusqueda();
              this.condicion = true;
              this.bloquearOficina = true;
              this.OficinaSeleccionada(resultPerfil);
              this.bloquearBuscar = true;
              this.bloquearNombre = true;
              this.botonBasico.nativeElement.click();
              this.organizarTab(1);
              this.BloquearTabs();
              this.DesbloquearFormularios();
              this.infoJuridicoComponent.NitConsultado = null;
              this.mostrarBotonesSiguiente = true;
              this.mostrarBotonesAgregar = true;
              this.mostrarBotonesActualizar = false;
              this.mostrarBotonesLimpiar = true;
              this.mostrarBotonesLimpiarInfo = true;
              this.mostrarBotonesMarcarDesmarcar = false;
              this.ActivarBtnOpciones = true;
              this.infoJuridicoComponent.bloquearNit = null;
              this.infoJuridicoComponent.bloquearRazonSocial = null;
              this.infoJuridicoComponent.bloquearAsesor = true;
              this.infoJuridicoComponent.bloquearAsesorExt = true;
              this.infoJuridicoComponent.bloquearRelacion = null;
              this.infoJuridicoComponent.bloquearEstado = true;
              this.entrevistaComponent.MostrarFechaTratamiento = false;
              this.patrimonioComponent.SumaActivos = 0;
              this.patrimonioComponent.SumaPasivos = 0;
              this.patrimonioComponent.TotalPatrimonio = 0;
              this.entrevistaComponent.tratamientoForm.get('checkTratamiento')?.setValue(true);
              this.entrevistaComponent.tratamientoForm.get('checkDebitoAutomatico')?.setValue(true);
              this.patrimonioComponent.patrimonioFrom.get('ActivosNoCorrientes')?.setValue(0);
              this.patrimonioComponent.patrimonioFrom.get('OtrosActivos')?.setValue(0);
              this.patrimonioComponent.patrimonioFrom.get('ObligacionesFinancieras')?.setValue(0);
              this.patrimonioComponent.patrimonioFrom.get('CuentaPorPagar')?.setValue(0);
              this.patrimonioComponent.patrimonioFrom.get('OtrosPasivos')?.setValue(0);
              this.PreCargarPais();
              this.infoJuridicoComponent.PreguntaAsesorExt = false;
        } else if (operaSeleccionada === 31) { // Aprobar y o negrar ingreso
          this.AlertaProbaroNegar(operaSeleccionada);

        } else if (operaSeleccionada === 23) { // Gestion operaciones
          let data = localStorage.getItem('Data');
           const DataUserLog = JSON.parse(window.atob(data == null ? "" : data));
          if (DataUserLog.NumeroOficina !== '3') {
            const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
            if (strNit === '' || strNit === null || strNit === undefined) {
              this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
              this.juridicosFrom.get('operacion')?.reset();
              this.BloquearTodo();
              this.organizarTab(1);
              this.SiguienteTab(1);
            } else {
               const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
              if (valueState.IdEstado === 42) {
                this.juridicosFrom.get('operacion')?.reset();
                this.MostrarMensajeAlerta(valueState);
                this.BloquearCamposFormularios();
                this.infoJuridicoComponent.mostrarCambiar = false;
              } else {
                this.btnBuscar = true;
                this.bloquearBuscar = true;
                this.bloquearNombre = true;
                this.bloquearOficina = true;
                this.mostrarBotonesCambiar = true;
                this.mostrarBotonesSiguiente = false;
                this.mostrarBotonesAgregar = false;
                this.mostrarBotonesActualizar = false;
                this.mostrarBotonesLimpiar = false;
                this.mostrarBotonesLimpiarInfo = false;
                this.mostrarBotonesMarcarDesmarcar = false;
                this.infoJuridicoComponent.bloquearNit = true;
                this.infoJuridicoComponent.bloquearAsesor = true;
                this.infoJuridicoComponent.bloquearAsesorExt = true;
                this.infoJuridicoComponent.disableAsesorPpal = true;
                this.infoJuridicoComponent.disableAsesorExt = true;
                this.infoJuridicoComponent.bloquearRazonSocial = true;
                this.infoJuridicoComponent.bloquearRelacion = true;
                this.entrevistaComponent.MostrarFechaTratamiento = false;
                this.SolicitarGestion();
                this.BloquearCamposInfoJuridico();
                this.BloquearCamposFormularios();
              }
            }
          } else {
            this.notif.onWarning('Advertencia', 'Esta operacion no se puede realizar en la oficina administración.');
          }
        } else if (operaSeleccionada === 1) { // Editar          
          this.AlertaEditar();       
        } else {
          this.juridicosFrom.get('operacion')?.reset();
          this.notif.onWarning('Advertencia', 'Esta operacion aún no ha sido habilitada.');
        }
      }
    }
  }
  AlertaEditar() {
    // Valida que la operacion seleccionada si tenga un cambio
    if (this.OperacionMarcada === '20') {
      if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
        this.OperacionMarcada = undefined;
        this.ProOficina = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '29') {
      if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
        this.OperacionMarcada = undefined;
        this.ProNit = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '30') {
      if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
        this.OperacionMarcada = undefined;
        this.ProRazonSocial = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '26') {
      if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
        this.OperacionMarcada = undefined;
        this.ProAsesor = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '19') {
      if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
        this.OperacionMarcada = undefined;
        this.ProAsesorExterno = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '4') {
      if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
        this.OperacionMarcada = undefined;
        this.ProRelacion = '0';
        this.ProDescripcionOpe = ' ';
      }
    }
    // Alerta para las operaciones que si tienen cambio
    if (this.OperacionMarcada !== undefined) {
      swal.fire({
        title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
          //Deja la operacion  como  estaba
          if (this.OperacionMarcada === '31') {
            let state = localStorage.getItem('state');
            this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
            this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
              if (elementEstado.IdEstado === this.ProAprobacion) {
                this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
              }
            });

          } else if (this.OperacionMarcada === '20') {
            this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
          } else if (this.OperacionMarcada === '29') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
          } else if (this.OperacionMarcada === '30') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
          } else if (this.OperacionMarcada === '26') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
            this.infoJuridicoComponent.GetAsesorCodigo();
          } else if (this.OperacionMarcada === '19') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
            this.infoJuridicoComponent.GetAsesorExternoCodigo();
          } else if (this.OperacionMarcada === '4') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
          }
          // Continua normal y limpia las variables
          this.Editar();
          this.ProAprobacion = '0';
          this.ProOficina = '0';
          this.ProNit = '0';
          this.ProRazonSocial = '0';
          this.ProAsesor = '0';
          this.ProAsesorExterno = '0';
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
          this.OperacionMarcada = undefined;

        } else {
          // regresa a la operacion anterior como  estaba antes
          if (this.OperacionMarcada === '31') {
            +this.juridicosFrom.get('operacion')?.setValue('31');
            this.AprobaroNegar(31);
          } else if (this.OperacionMarcada === '20') {
            +this.juridicosFrom.get('operacion')?.setValue('20');
            this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            this.CambiarOficinaO(20);
          } else if (this.OperacionMarcada === '29') {
            +this.juridicosFrom.get('operacion')?.setValue('29');
            this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            this.CambiarNit(29);
          } else if (this.OperacionMarcada === '30') {
            +this.juridicosFrom.get('operacion')?.setValue('30');
            this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            this.CambiaRazonSocial(30);
          } else if (this.OperacionMarcada === '26') {
            +this.juridicosFrom.get('operacion')?.setValue('26');
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
            this.infoJuridicoComponent.GetAsesorCodigo();
            this.CambiarAsesor(26);
          } else if (this.OperacionMarcada === '19') {
            +this.juridicosFrom.get('operacion')?.setValue('19');
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
            this.infoJuridicoComponent.GetAsesorExternoCodigo();
            this.CambiarAsesorExterno(19);
          } else if (this.OperacionMarcada === '4') {
            +this.juridicosFrom.get('operacion')?.setValue('4');
            this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            this.CambiarRelacion(4);
          }
        }
      });

    } else {
      // entra a la operacion por primer vez
      this.Editar();
    }   
  }
  AlertaProbaroNegar(operaSeleccionada : any) {
    // Valida que la operacion seleccionada si tenga un cambio
    if (this.OperacionMarcada === '20') {
      if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
        this.OperacionMarcada = undefined;
        this.ProOficina = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '29') {
      if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
        this.OperacionMarcada = undefined;
        this.ProNit = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '30') {
      if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
        this.OperacionMarcada = undefined;
        this.ProRazonSocial = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '26') {
      if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
        this.OperacionMarcada = undefined;
        this.ProAsesor = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '19') {
      if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
        this.OperacionMarcada = undefined;
        this.ProAsesorExterno = '0';
        this.ProDescripcionOpe = ' ';
      }
    } else if (this.OperacionMarcada === '4') {
      if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
        this.OperacionMarcada = undefined;
        this.ProRelacion = '0';
        this.ProDescripcionOpe = ' ';
      }
    }
    // Alerta para las operaciones que si tienen cambio
    if (this.OperacionMarcada !== undefined) {
      swal.fire({
        title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
          //Deja la operacion  como  estaba
          if (this.OperacionMarcada === '31') {
            let data = localStorage.getItem('state');
            this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(data == null ? "" : data));
            this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any)=> {
              if (elementEstado.IdEstado === this.ProAprobacion) {
                this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
              }
            });

          } else if (this.OperacionMarcada === '20') {
            this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
          } else if (this.OperacionMarcada === '29') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
          } else if (this.OperacionMarcada === '30') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
          } else if (this.OperacionMarcada === '26') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
            this.infoJuridicoComponent.GetAsesorCodigo();
          } else if (this.OperacionMarcada === '19') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
            this.infoJuridicoComponent.GetAsesorExternoCodigo();
          } else if (this.OperacionMarcada === '4') {
            this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
          }
          // Continua normal y limpia las variables
          this.AprobaroNegar(operaSeleccionada);
          this.ProOficina = '0';
          this.ProNit = '0';
          this.ProRazonSocial = '0';
          this.ProAsesor = '0';
          this.ProAsesorExterno = '0';
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
          this.OperacionMarcada = undefined;

        } else {
          // regresa a la operacion anterior como  estaba antes
          if (this.OperacionMarcada === '31') {
            +this.juridicosFrom.get('operacion')?.setValue('31');
            this.AprobaroNegar(31);
          } else if (this.OperacionMarcada === '20') {
            +this.juridicosFrom.get('operacion')?.setValue('20');
            this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            this.CambiarOficinaO(20);
          } else if (this.OperacionMarcada === '29') {
            +this.juridicosFrom.get('operacion')?.setValue('29');
            this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            this.CambiarNit(29);
          } else if (this.OperacionMarcada === '30') {
            +this.juridicosFrom.get('operacion')?.setValue('30');
            this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            this.CambiaRazonSocial(30);
          } else if (this.OperacionMarcada === '26') {
            +this.juridicosFrom.get('operacion')?.setValue('26');
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
            this.infoJuridicoComponent.GetAsesorCodigo();
            this.CambiarAsesor(26);
          } else if (this.OperacionMarcada === '19') {
            +this.juridicosFrom.get('operacion')?.setValue('19');
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
            this.infoJuridicoComponent.GetAsesorExternoCodigo();
            this.CambiarAsesorExterno(19);
          } else if (this.OperacionMarcada === '4') {
            +this.juridicosFrom.get('operacion')?.setValue('4');
            this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            this.CambiarRelacion(4);
          }
        }
      });

    } else {
      // entra a la operacion por primer vez
      this.AprobaroNegar(operaSeleccionada);
    }
  }
  AprobaroNegar(operaSeleccionada : any) {
    let data = localStorage.getItem('Data');
    const DataUserLog = JSON.parse(window.atob(data == null ? "" : data));
    this.operacionesModel.idOperacion = operaSeleccionada;
    this.operacionesModel.idPerfil = DataUserLog.idPerfilUsuario;
    this.operacionesModel.idModulo = this.CodModulo;
    const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
    if (strNit === '' || strNit === null || strNit === undefined) {
      this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
      this.juridicosFrom.get('operacion')?.reset();
      this.BloquearTodo();
    } else {
      const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
      if (valueState.IdEstado === 55 || valueState.IdEstado === 5) {
        this.juridicosFrom.get('operacion')?.reset();
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
      } else {
        this.btnBuscar = true;
        this.operacionesService.ObtenerEstadosXOperacionesData(this.operacionesModel).subscribe(
          resultEstados => {
            this.ProAprobacion = this.infoJuridicoComponent.infoJuridicoFrom.value.Estado.IdEstado;
            this.ProDescripcionOpe = 'Visto bueno requisitos' 
            this.OperacionMarcada = '31';
            this.ActivarBtnOpciones = false;
            this.condicion = true;
            this.bloquearBuscar = true;
            this.bloquearNombre = true;
            this.bloquearOficina = true;
            this.infoJuridicoComponent.mostrarCambiar = true;
            this.mostrarBotonesSiguiente = false;
            this.mostrarBotonesAgregar = false;
            this.mostrarBotonesActualizar = false;
            this.mostrarBotonesLimpiar = false;
            this.mostrarBotonesLimpiarInfo = false;
            this.mostrarBotonesMarcarDesmarcar = false;
            this.entrevistaComponent.MostrarFechaTratamiento = false;
            this.botonBasico.nativeElement.click();
            this.organizarTab(1);
            this.BloquearTabs();
            this.infoJuridicoComponent.bloquearEstado = true;
            this.infoJuridicoComponent.bloquearForm = true;
            this.infoJuridicoComponent.bloquearAsesor = true;
            this.infoJuridicoComponent.bloquearAsesorExt = true;
            this.infoJuridicoComponent.disableAsesorPpal = true;
            this.infoJuridicoComponent.disableAsesorExt = true;
            this.infoJuridicoComponent.bloquearNit = true;
            this.infoJuridicoComponent.bloquearRazonSocial = true;
            this.infoJuridicoComponent.bloquearRelacion = true;
            this.infoJuridicoComponent.dataEstados = resultEstados;
            this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
            this.BloquearCamposInfoJuridico();
            this.IrAbajo();
            this.BloquearCamposFormularios();
            this.emitEventComunicacionInfo.emit({ 'nameInput': 'estadoJur' });

          });
      }
    }
  }
  Editar() {
    let data = localStorage.getItem('Data');
    const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
    const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
    if (strNit === '' || strNit === null || strNit === undefined) {
      this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
      this.juridicosFrom.get('operacion')?.reset();
      this.BloquearTodo();
    } else {
      const valueState = this.infoJuridicoComponent.infoJuridicoFrom.value.Estado;
      if (valueState !== null && valueState !== undefined) {
        if (this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value.IdEstado !== 42) {
          this.btnBuscar = true;
          this.GestionEstadoEditar(resultPerfil);
        } else {
          this.juridicosFrom.get('operacion')?.reset();
          this.MostrarMensajeAlerta(this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value);
          this.BloquearCamposFormularios();
        }

      } else if (valueState === null || valueState == undefined) {
        this.GestionEstadoEditar(resultPerfil);
      } else {
        this.juridicosFrom.get('operacion')?.reset();
        this.MostrarMensajeAlerta(this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value);
        this.BloquearCamposFormularios();
      }
    }
  }
  CambiarOficinaO(operaSeleccionada : any)
  {    
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        this.OpcionSeleccionada = '/Cambiar oficina';
        this.mostrarOficina = true;
        this.ProOficina = this.juridicosFrom.get('oficina')?.value;
        this.ProDescripcionOpe = 'Cambiar oficina'
        this.OperacionMarcada = '20';
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Cambiar oficina';
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = null;
          this.ActivarBtnOpciones = false;
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.ActivarBtnOpciones = false;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.generalesService.Autofocus('oficinaJuridico');
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.OpcionSeleccionada = '/Cambiar oficina';
      this.mostrarOficina = true;
      this.ProOficina = this.juridicosFrom.get('oficina')?.value;
      this.ProDescripcionOpe = 'Cambiar oficina'
      this.OperacionMarcada = '20';
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Cambiar oficina';
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.bloquearOficina = null;
        this.ActivarBtnOpciones = false;
        this.botonBasico.nativeElement.click();
        this.organizarTab(1);
        this.BloquearTabs();
        this.infoJuridicoComponent.mostrarCambiar = true;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesLimpiarInfo = false;
        this.mostrarBotonesMarcarDesmarcar = false;
        this.ActivarBtnOpciones = false;
        this.infoJuridicoComponent.bloquearEstado = true;
        this.infoJuridicoComponent.bloquearAsesor = true;
        this.infoJuridicoComponent.bloquearAsesorExt = true;
        this.infoJuridicoComponent.disableAsesorPpal = true;
        this.infoJuridicoComponent.disableAsesorExt = true;
        this.infoJuridicoComponent.bloquearRelacion = true;
        this.infoJuridicoComponent.bloquearNit = true;
        this.infoJuridicoComponent.bloquearRazonSocial = true;
        this.entrevistaComponent.MostrarFechaTratamiento = false;
        this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
        this.BloquearCamposInfoJuridico();
        this.BloquearCamposFormularios();
        this.generalesService.Autofocus('oficinaJuridico');
      }
    }


    
  }
  Reingreso() {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47) {
        let data = localStorage.getItem('Data');
        const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
        this.OpcionSeleccionada = '/Reingreso';
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
          const fechaSolRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
          if (valueState.IdEstado !== 55 && (this.fechaRetiro === null || this.fechaRetiro === undefined || this.fechaRetiro === '')
            && (fechaSolRetiro !== null && fechaSolRetiro !== undefined && fechaSolRetiro !== '')) {
            this.notif.onWarning('Advertencia','El asociado tiene una solicitud de retiro pendiente.');
            this.juridicosFrom.get('operacion')?.reset();

          } else {
            if (valueState.IdEstado === 5 || valueState.IdEstado === 55 &&
              (this.fechaRetiro !== null || this.fechaRetiro !== undefined || this.fechaRetiro !== '')) {
              const tercero = this.JuridicoSeleccionado;
              this.juridicosService.GetDateReingresoJuridico(tercero).subscribe(
                result => {
                  if (result === null) { // valida si el asociado ya tiene una solicitud de reingreso

                    const fechaSolRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
                    const fechaTabRetiro = this.historialComponent.historialFrom.get('FechaRetiro')?.value;
                    const estadoAsociado = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
                    if ((result === null || result === '') && (fechaSolRetiro === null || fechaSolRetiro === '') &&
                      (fechaTabRetiro === null || fechaTabRetiro === '') && (estadoAsociado.IdEstado !== 55)) {
                      this.notif.onWarning('Advertencia', 'El asociado se encuentra activo, esta operación no se puede realizar.');
                      this.juridicosFrom.get('operacion')?.reset();
                    } else {
                      const fechaActual = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en');
                      const fecha1 = moment(fechaTabRetiro, 'YYYY-MM-DD');
                      const fecha2 = moment(fechaActual, 'YYYY-MM-DD');
                      const diff = fecha2.diff(fecha1, 'months', true);
                      if (diff >= 6) {

                        swal.fire({
                          title: 'Advertencia',
                          text: '',
                          html: '¿Desea realizar el reingreso? ',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Si',
                          cancelButtonText: 'No',
                          confirmButtonColor: 'rgb(13,165,80)',
                          cancelButtonColor: 'rgb(160,0,87)',
                          allowOutsideClick: false,
                          allowEscapeKey: false
                        }).then((result : any) => {
                          if (result.value) {
                            this.GuardarLog('Se realiza el reingreso', 16, 0, this.JuridicoSeleccionado,12);
                            this.juridicosService.ReingresoJuridico(this.JuridicoSeleccionado, 47, resultPerfil.lngTercero).subscribe(
                              result => {
                                if (result) {
                                  this.bloquearBuscar = true;
                                  this.bloquearNombre = true;
                                  this.ActivarBtnOpciones = false;
                                  this.juridicosFrom.get('operacion')?.reset();
                                  this.BloquearFormulariosNoLimpia();
                                  this.BloquearCamposFormularios();
                                  this.BloquearCamposInfoJuridico();
                                  this.notif.onSuccess('Exitoso', 'El reingreso se realizo correctamente.');                                  
                                  this.ProDescripcionOpe = ' ';
                                  this.OperacionMarcada = undefined;
                                  this.IrArriba();
                                  this.organizarTab(1);
                                  this.botonBasico.nativeElement.click();
                                  this.consultarJuridicosNit(this.JuridicoSeleccionado);
                                }
                              }
                            )
                          } else {
                            this.ActivarBtnOpciones = false;
                            this.juridicosFrom.get('operacion')?.reset();
                            this.BloquearCamposFormularios();
                            this.BloquearCamposInfoJuridico();
                          }
                        });

                      } else if (fechaTabRetiro === null || fechaTabRetiro === undefined || fechaTabRetiro === '' && estadoAsociado.IdEstado === 55) {
                        swal.fire({
                          title: 'Advertencia',
                          text: '',
                          html: '¿Desea realizar el reingreso? ',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Si',
                          cancelButtonText: 'No',
                          confirmButtonColor: 'rgb(13,165,80)',
                          cancelButtonColor: 'rgb(160,0,87)',
                          allowOutsideClick: false,
                          allowEscapeKey: false
                        }).then((result : any) => {
                          if (result.value) {
                            this.GuardarLog('Se realiza el reingreso', 16, 0, this.JuridicoSeleccionado,12);
                            this.juridicosService.ReingresoJuridico(this.JuridicoSeleccionado, 47, resultPerfil.lngTercero).subscribe(
                              result => {
                                if (result) {
                                  this.bloquearBuscar = true;
                                  this.bloquearNombre = true;
                                  this.ActivarBtnOpciones = false;
                                  this.juridicosFrom.get('operacion')?.reset();
                                  this.BloquearFormulariosNoLimpia();
                                  this.BloquearCamposFormularios();
                                  this.BloquearCamposInfoJuridico();
                                  this.notif.onSuccess('Exitoso', 'El reingreso se realizo correctamente.');
                                  this.ProDescripcionOpe = ' ';
                                  this.OperacionMarcada = undefined;
                                  this.IrArriba();
                                  this.organizarTab(1);
                                  this.botonBasico.nativeElement.click();
                                  this.consultarJuridicosNit(this.JuridicoSeleccionado);
                                }
                              }
                            )
                          } else {
                            this.ActivarBtnOpciones = false;
                            this.juridicosFrom.get('operacion')?.reset();
                            this.BloquearCamposFormularios();
                            this.BloquearCamposInfoJuridico();
                          }
                        });
                      } else {
                        this.notif.onWarning('Advertencia',
                          'No cumple con el tiempo establecido por la Cooperativa para realizar el reingreso.');
                        this.juridicosFrom.get('operacion')?.reset();
                      }
                    }
                  } else {
                    this.notif.onWarning('Advertencia', 'El asociado ya tiene una solicitud de reingreso.');
                    this.juridicosFrom.get('operacion')?.reset();
                    this.ActivarBtnOpciones = false;
                    this.BloquearCamposFormularios();
                    this.BloquearCamposInfoJuridico();
                  }
                });
            } else {
              this.notif.onWarning('Advertencia',
                'El estado del asociado es activo.');
              this.juridicosFrom.get('operacion')?.reset();
            }
          }
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      let data = localStorage.getItem('Data');
      const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
      this.OpcionSeleccionada = '/Reingreso';
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
        const fechaSolRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
        if (valueState.IdEstado !== 55 && (this.fechaRetiro === null || this.fechaRetiro === undefined || this.fechaRetiro === '')
          && (fechaSolRetiro !== null && fechaSolRetiro !== undefined && fechaSolRetiro !== '')) {
          this.notif.onWarning('Advertencia',
            'El asociado tiene una solicitud de retiro pendiente.',);
          this.juridicosFrom.get('operacion')?.reset();

        } else {
          if (valueState.IdEstado === 5 || valueState.IdEstado === 55 &&
            (this.fechaRetiro !== null || this.fechaRetiro !== undefined || this.fechaRetiro !== '')) {
            const tercero = this.JuridicoSeleccionado;
            this.juridicosService.GetDateReingresoJuridico(tercero).subscribe(
              result => {
                if (result === null) { // valida si el asociado ya tiene una solicitud de reingreso

                  const fechaSolRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
                  const fechaTabRetiro = this.historialComponent.historialFrom.get('FechaRetiro')?.value;
                  const estadoAsociado = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
                  if ((result === null || result === '') && (fechaSolRetiro === null || fechaSolRetiro === '') &&
                    (fechaTabRetiro === null || fechaTabRetiro === '') && (estadoAsociado.IdEstado !== 55)) {
                    this.notif.onWarning('Advertencia',
                      'El asociado se encuentra activo, esta operación no se puede realizar.');
                    this.juridicosFrom.get('operacion')?.reset();
                  } else {
                    const fechaActual = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en');
                    const fecha1 = moment(fechaTabRetiro, 'YYYY-MM-DD');
                    const fecha2 = moment(fechaActual, 'YYYY-MM-DD');
                    const diff = fecha2.diff(fecha1, 'months', true);
                    if (diff >= 6) {

                      swal.fire({
                        title: 'Advertencia',
                        text: '',
                        html: '¿Desea realizar el reingreso? ',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Si',
                        cancelButtonText: 'No',
                        confirmButtonColor: 'rgb(13,165,80)',
                        cancelButtonColor: 'rgb(160,0,87)',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                      }).then((result) => {
                        if (result.value) {
                          this.GuardarLog('Se realiza el reingreso', 16, 0, this.JuridicoSeleccionado,12);
                          this.juridicosService.ReingresoJuridico(this.JuridicoSeleccionado, 47, resultPerfil.lngTercero).subscribe(
                            result => {
                              if (result) {
                                this.bloquearBuscar = true;
                                this.bloquearNombre = true;
                                this.ActivarBtnOpciones = false;
                                this.juridicosFrom.get('operacion')?.reset();
                                this.BloquearFormulariosNoLimpia();
                                this.BloquearCamposFormularios();
                                this.BloquearCamposInfoJuridico();
                                this.notif.onSuccess('Exitoso', 'El reingreso se realizo correctamente.');
                                this.ProDescripcionOpe = ' ';
                                this.OperacionMarcada = undefined;
                                this.IrArriba();
                                this.organizarTab(1);
                                this.botonBasico.nativeElement.click();
                                this.consultarJuridicosNit(this.JuridicoSeleccionado);
                              }
                            }
                          )
                        } else {
                          this.ActivarBtnOpciones = false;
                          this.juridicosFrom.get('operacion')?.reset();
                          this.BloquearCamposFormularios();
                          this.BloquearCamposInfoJuridico();
                        }
                      });

                    } else if (fechaTabRetiro === null || fechaTabRetiro === undefined || fechaTabRetiro === '' && estadoAsociado.IdEstado === 55) {
                      swal.fire({
                        title: 'Advertencia',
                        text: '',
                        html: '¿Desea realizar el reingreso? ',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Si',
                        cancelButtonText: 'No',
                        confirmButtonColor: 'rgb(13,165,80)',
                        cancelButtonColor: 'rgb(160,0,87)',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                      }).then((result) => {
                        if (result.value) {
                          this.GuardarLog('Se realiza el reingreso', 16, 0, this.JuridicoSeleccionado,12);
                          this.juridicosService.ReingresoJuridico(this.JuridicoSeleccionado, 47, resultPerfil.lngTercero).subscribe(
                            result => {
                              if (result) {
                                this.bloquearBuscar = true;
                                this.bloquearNombre = true;
                                this.ActivarBtnOpciones = false;
                                this.juridicosFrom.get('operacion')?.reset();
                                this.BloquearFormulariosNoLimpia();
                                this.BloquearCamposFormularios();
                                this.BloquearCamposInfoJuridico();
                                this.notif.onSuccess('Exitoso', 'El reingreso se realizo correctamente.');
                                this.ProDescripcionOpe = ' ';
                                this.OperacionMarcada = undefined;
                                this.IrArriba();
                                this.organizarTab(1);
                                this.botonBasico.nativeElement.click();
                                this.consultarJuridicosNit(this.JuridicoSeleccionado);
                              }
                            }
                          )
                        } else {
                          this.ActivarBtnOpciones = false;
                          this.juridicosFrom.get('operacion')?.reset();
                          this.BloquearCamposFormularios();
                          this.BloquearCamposInfoJuridico();
                        }
                      });
                    } else {
                      this.notif.onWarning('Advertencia',
                        'No cumple con el tiempo establecido por la Cooperativa para realizar el reingreso.');
                      this.juridicosFrom.get('operacion')?.reset();
                    }
                  }
                } else {
                  this.notif.onWarning('Advertencia', 'El asociado ya tiene una solicitud de reingreso.');
                  this.juridicosFrom.get('operacion')?.reset();
                  this.ActivarBtnOpciones = false;
                  this.BloquearCamposFormularios();
                  this.BloquearCamposInfoJuridico();
                }
              });
          } else {
            this.notif.onWarning('Advertencia',
              'El estado del asociado es activo.');
            this.juridicosFrom.get('operacion')?.reset();
          }
        }
      }
    }
   
  } 
  imprimir() {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47) {
        let data = localStorage.getItem('Data');
        const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
        this.OpcionSeleccionada = '/Imprimir afiliación';
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.esReimpresion = true;
          this.ActivarBtnOpciones = false;
          this.serviciosFrom.get('Oficina')?.setValue(resultPerfil.Oficina);
          this.serviciosFrom.get('Asesor')?.setValue(resultPerfil.Nombre);
          this.AbrirModalServicios.nativeElement.click();
          this.BloquearCamposFormularios();
          this.BloquearFormulariosNoLimpia();
          this.BloquearCamposInfoJuridico();
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      let data = localStorage.getItem('Data');
      const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
      this.OpcionSeleccionada = '/Imprimir afiliación';
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.esReimpresion = true;
        this.ActivarBtnOpciones = false;
        this.serviciosFrom.get('Oficina')?.setValue(resultPerfil.Oficina);
        this.serviciosFrom.get('Asesor')?.setValue(resultPerfil.Nombre);
        this.AbrirModalServicios.nativeElement.click();
        this.BloquearCamposFormularios();
        this.BloquearFormulariosNoLimpia();
        this.BloquearCamposInfoJuridico();
      }
    }
  }
  CambiarNit(operaSeleccionada : any) {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Cambiar Nit';
          this.ProNit = this.infoJuridicoComponent.infoJuridicoFrom.value.Nit;
          this.ProDescripcionOpe = 'Cambiar Nit'
          this.OperacionMarcada = '29';
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.ActivarBtnOpciones = false;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = null;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.emitEventComunicacionInfo.emit({ 'nameInput': 'nit' });
        }
      } else {   
          this.MostrarMensajeAlerta(valueState);
          this.BloquearCamposFormularios();
          this.infoJuridicoComponent.mostrarCambiar = false;
          this.entrevistaComponent.entrevistaModelLst = [];        
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Cambiar Nit';
        this.ProNit = this.infoJuridicoComponent.infoJuridicoFrom.value.Nit;
        this.ProDescripcionOpe = 'Cambiar Nit'
        this.OperacionMarcada = '29';
        this.botonBasico.nativeElement.click();
        this.organizarTab(1);
        this.BloquearTabs();
        this.BloquearCamposInfoJuridico();
        this.BloquearCamposFormularios();
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.bloquearOficina = true;
        this.ActivarBtnOpciones = false;
        this.infoJuridicoComponent.mostrarCambiar = true;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesLimpiarInfo = false;
        this.mostrarBotonesMarcarDesmarcar = false;
        this.infoJuridicoComponent.bloquearNit = null;
        this.infoJuridicoComponent.bloquearRazonSocial = true;
        this.infoJuridicoComponent.bloquearAsesor = true;
        this.infoJuridicoComponent.bloquearAsesorExt = true;
        this.infoJuridicoComponent.disableAsesorPpal = true;
        this.infoJuridicoComponent.disableAsesorExt = true;
        this.infoJuridicoComponent.bloquearRelacion = true;
        this.infoJuridicoComponent.bloquearEstado = true;
        this.entrevistaComponent.MostrarFechaTratamiento = false;
        this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
        this.emitEventComunicacionInfo.emit({ 'nameInput': 'nit' });
      }
    }
  }
  CambiaRazonSocial(operaSeleccionada : any) {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Cambiar razon social';
          this.ProRazonSocial = this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial;
          this.ProDescripcionOpe = 'Cambiar razón social'
          this.OperacionMarcada = '30';
          this.BloquearCamposFormularios();
          this.BloquearCamposInfoJuridico();
          this.ActivarBtnOpciones = false;
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearRazonSocial = null;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.emitEventComunicacionInfo.emit({ 'nameInput': 'razon' });
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Cambiar razon social';
        this.ProRazonSocial = this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial;
        this.ProDescripcionOpe = 'Cambiar razón social'
        this.OperacionMarcada = '30';
        this.BloquearCamposFormularios();
        this.BloquearCamposInfoJuridico();
        this.ActivarBtnOpciones = false;
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.bloquearOficina = true;
        this.infoJuridicoComponent.mostrarCambiar = true;
        this.infoJuridicoComponent.mostrarCambiar = true;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesMarcarDesmarcar = false;
        this.infoJuridicoComponent.bloquearRazonSocial = null;
        this.infoJuridicoComponent.bloquearNit = true;
        this.infoJuridicoComponent.bloquearEstado = true;
        this.infoJuridicoComponent.bloquearAsesor = true;
        this.infoJuridicoComponent.bloquearAsesorExt = true;
        this.infoJuridicoComponent.disableAsesorPpal = true;
        this.infoJuridicoComponent.disableAsesorExt = true;
        this.infoJuridicoComponent.bloquearRelacion = true;
        this.entrevistaComponent.MostrarFechaTratamiento = false;
        this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
        this.botonBasico.nativeElement.click();
        this.organizarTab(1);
        this.BloquearTabs();
        this.emitEventComunicacionInfo.emit({ 'nameInput': 'razon' });
      }
    }


   
  }
  CambiarAsesor(operaSeleccionada : any) {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Cambiar asesor';
          this.ProAsesor = this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor;
          this.ProDescripcionOpe = 'Cambiar asesor'
          this.OperacionMarcada = '26';
          this.ActivarBtnOpciones = false;
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearAsesor = null;
          this.infoJuridicoComponent.disableAsesorPpal = null;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.IrAbajo();
          this.emitEventComunicacionInfo.emit({ 'nameInput': 'asesor' });
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Cambiar asesor';
        this.ProAsesor = this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor;
        this.ProDescripcionOpe = 'Cambiar asesor'
        this.OperacionMarcada = '26';
        this.ActivarBtnOpciones = false;
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.bloquearOficina = true;
        this.infoJuridicoComponent.mostrarCambiar = true;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesLimpiarInfo = false;
        this.mostrarBotonesMarcarDesmarcar = false;
        this.infoJuridicoComponent.bloquearNit = true;
        this.infoJuridicoComponent.bloquearRazonSocial = true;
        this.infoJuridicoComponent.bloquearAsesor = null;
        this.infoJuridicoComponent.disableAsesorPpal = null;
        this.infoJuridicoComponent.bloquearAsesorExt = true;
        this.infoJuridicoComponent.disableAsesorExt = true;
        this.infoJuridicoComponent.bloquearRelacion = true;
        this.entrevistaComponent.MostrarFechaTratamiento = false;
        this.infoJuridicoComponent.bloquearEstado = true;
        this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
        this.BloquearCamposInfoJuridico();
        this.BloquearCamposFormularios();
        this.botonBasico.nativeElement.click();
        this.organizarTab(1);
        this.BloquearTabs();
        this.IrAbajo();
        this.emitEventComunicacionInfo.emit({ 'nameInput': 'asesor' });
      }
    }
  }
  CambiarAsesorExterno(operaSeleccionada : any) {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Cambiar asesor externo';
          this.ProAsesorExterno = this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt;
          this.ProDescripcionOpe = 'Cambiar asesor externo'
          this.OperacionMarcada = '19';
          this.ActivarBtnOpciones = false;
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearAsesorExt = null;
          this.infoJuridicoComponent.disableAsesorExt = null;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.IrAbajo();
          this.emitEventComunicacionInfo.emit({ 'nameInput': 'asesorExterno' });
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Cambiar asesor externo';
        this.ProAsesorExterno = this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt;
        this.ProDescripcionOpe = 'Cambiar asesor externo'
        this.OperacionMarcada = '19';
        this.ActivarBtnOpciones = false;
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.bloquearOficina = true;
        this.infoJuridicoComponent.mostrarCambiar = true;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesLimpiarInfo = false;
        this.mostrarBotonesMarcarDesmarcar = false;
        this.infoJuridicoComponent.bloquearNit = true;
        this.infoJuridicoComponent.bloquearRazonSocial = true;
        this.infoJuridicoComponent.bloquearAsesorExt = null;
        this.infoJuridicoComponent.disableAsesorExt = null;
        this.infoJuridicoComponent.bloquearAsesor = true;
        this.infoJuridicoComponent.disableAsesorPpal = true;
        this.entrevistaComponent.MostrarFechaTratamiento = false;
        this.infoJuridicoComponent.bloquearEstado = true;
        this.infoJuridicoComponent.bloquearRelacion = true;
        this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
        this.BloquearCamposInfoJuridico();
        this.BloquearCamposFormularios();
        this.botonBasico.nativeElement.click();
        this.organizarTab(1);
        this.BloquearTabs();
        this.IrAbajo();
        this.emitEventComunicacionInfo.emit({ 'nameInput': 'asesorExterno' });
      }
    }



    
  }
  CambiarFechaActualizacion() {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Cambiar fecha actualización';
          swal.fire({
            title: 'Advertencia',
            text: '',
            html: '¿Desea actualizar la fecha? ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            confirmButtonColor: 'rgb(13,165,80)',
            cancelButtonColor: 'rgb(160,0,87)',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.value) {
              this.bloquearBuscar = true;
              this.bloquearNombre = true;
              this.infoJuridicoComponent.CambiarFechaActualizacion();
            }
            else {
              this.ActivarBtnOpciones = false;
              this.juridicosFrom.get('operacion')?.reset();
              // this.BloquearTodo();
              this.BloquearCamposFormularios();
              this.BloquearCamposInfoJuridico();
            }
          });
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Cambiar fecha actualización';
        swal.fire({
          title: 'Advertencia',
          text: '',
          html: '¿Desea actualizar la fecha? ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          confirmButtonColor: 'rgb(13,165,80)',
          cancelButtonColor: 'rgb(160,0,87)',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result : any) => {
          if (result.value) {
            this.bloquearBuscar = true;
            this.bloquearNombre = true;
            this.infoJuridicoComponent.CambiarFechaActualizacion();
          }
          else {
            this.ActivarBtnOpciones = false;
            this.juridicosFrom.get('operacion')?.reset();
            // this.BloquearTodo();
            this.BloquearCamposFormularios();
            this.BloquearCamposInfoJuridico();
          }
        });
      }
    }
  }
  CambiarRelacion(operaSeleccionada : any) {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Cambiar relación';
          this.ProRelacion = this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion;
          this.ProDescripcionOpe = 'Cambiar relación'
          this.OperacionMarcada = '4';
          this.ActivarBtnOpciones = false;
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          // this.IrAbajo();
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.bloquearRelacion = null;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.emitEventComunicacionInfo.emit({ 'nameInput': 'relacion' });
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Cambiar relación';
        this.ProRelacion = this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion;
        this.ProDescripcionOpe = 'Cambiar relación'
        this.OperacionMarcada = '4';
        this.ActivarBtnOpciones = false;
        this.BloquearCamposInfoJuridico();
        this.BloquearCamposFormularios();
        this.botonBasico.nativeElement.click();
        this.organizarTab(1);
        this.BloquearTabs();
        // this.IrAbajo();
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.bloquearOficina = true;
        this.infoJuridicoComponent.mostrarCambiar = true;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesLimpiarInfo = false;
        this.mostrarBotonesMarcarDesmarcar = false;
        this.infoJuridicoComponent.bloquearNit = true;
        this.infoJuridicoComponent.bloquearRazonSocial = true;
        this.infoJuridicoComponent.bloquearAsesorExt = true;
        this.infoJuridicoComponent.disableAsesorExt = true;
        this.infoJuridicoComponent.bloquearAsesor = true;
        this.infoJuridicoComponent.disableAsesorPpal = true;
        this.entrevistaComponent.MostrarFechaTratamiento = false;
        this.infoJuridicoComponent.bloquearEstado = true;
        this.infoJuridicoComponent.bloquearRelacion = null;
        this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
        this.emitEventComunicacionInfo.emit({ 'nameInput': 'relacion' });
      }
    }


    
  }
  MarcarTratamientosDatos() {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Marcar tratamiento datos';
          this.ActivarBtnOpciones = false;
          this.mostrarBotonesCambiar = false;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = true;
          this.entrevistaComponent.mostrarMarcarDesmarcar = true;
          this.entrevistaComponent.MostrarFechaTratamiento = true;
          this.entrevistaComponent.bloquearCheckTratamiento = null;
          this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(null);
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.labelBoton = 'Marcar';
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.organizarTab(9);
          this.BloquearTabs();
          this.botonEntrevista.nativeElement.click();
          this.IrAbajo();
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Marcar tratamiento datos';
        this.ActivarBtnOpciones = false;
        this.mostrarBotonesCambiar = false;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesLimpiarInfo = false;
        this.mostrarBotonesMarcarDesmarcar = true;
        this.entrevistaComponent.mostrarMarcarDesmarcar = true;
        this.entrevistaComponent.MostrarFechaTratamiento = true;
        this.entrevistaComponent.bloquearCheckTratamiento = null;
        this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(null);
        this.infoJuridicoComponent.bloquearRelacion = true;
        this.entrevistaComponent.labelBoton = 'Marcar';
        this.BloquearCamposInfoJuridico();
        this.BloquearCamposFormularios();
        this.organizarTab(9);
        this.BloquearTabs();
        this.botonEntrevista.nativeElement.click();
        this.IrAbajo();
      }
    }


    
  }
  DesmarcarTratamientoDatos() {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Desmarcar tratamiento datos.';
          this.ActivarBtnOpciones = false;
          this.mostrarBotonesCambiar = false;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = true;
          this.entrevistaComponent.mostrarMarcarDesmarcar = true;
          this.entrevistaComponent.MostrarFechaTratamiento = true;
          this.entrevistaComponent.bloquearCheckTratamiento = null;
          this.entrevistaComponent.MostrarFechaExento = false;
          this.entrevistaComponent.bloquearCheckExento = false;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(null);
          this.entrevistaComponent.labelBoton = 'Desmarcar';
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.organizarTab(9);
          this.BloquearTabs();
          this.botonEntrevista.nativeElement.click();
          this.IrAbajo();
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Desmarcar tratamiento datos.';
        this.ActivarBtnOpciones = false;
        this.mostrarBotonesCambiar = false;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesLimpiarInfo = false;
        this.mostrarBotonesMarcarDesmarcar = true;
        this.entrevistaComponent.mostrarMarcarDesmarcar = true;
        this.entrevistaComponent.MostrarFechaTratamiento = true;
        this.entrevistaComponent.bloquearCheckTratamiento = null;
        this.entrevistaComponent.MostrarFechaExento = false;
        this.entrevistaComponent.bloquearCheckExento = false;
        this.infoJuridicoComponent.bloquearRelacion = true;
        this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(null);
        this.entrevistaComponent.labelBoton = 'Desmarcar';
        this.BloquearCamposInfoJuridico();
        this.BloquearCamposFormularios();
        this.organizarTab(9);
        this.BloquearTabs();
        this.botonEntrevista.nativeElement.click();
        this.IrAbajo();
      }
    }


    
  }
  SolicitudRertiro() {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          this.OpcionSeleccionada = '/Solicitud de retiro';
          const solicitudRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
          const EstadoRetiro = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
          // const fechaRetiro = this.historialComponent.historialFrom.get('FechaRetiro')?.value;
          if (solicitudRetiro === null || solicitudRetiro === undefined || solicitudRetiro === '') {
            if (this.fechaRetiro === null || this.fechaRetiro === undefined || this.fechaRetiro === '') {
              if (EstadoRetiro.IdEstado !== 55) {
                this.ActivarBtnOpciones = false;
                this.GetMotivosRetiro();
                this.BloquearCamposInfoJuridico();
                this.BloquearCamposFormularios();
              } else {
                this.notif.onWarning('Advertencia', 'El asociado ya tiene una solicitud de retiro.');
                this.juridicosFrom.get('operacion')?.reset();
                this.historialComponent.mostrarReimprimir = true;
                this.infoJuridicoComponent.bloquearRelacion = true;
                this.organizarTab(10);
                this.botonHistorial.nativeElement.click();
              }
            } else {
              this.notif.onWarning('Advertencia', 'El asociado se encuentra retirado.');
              this.juridicosFrom.get('operacion')?.reset();
              this.historialComponent.mostrarReimprimir = true;
              this.infoJuridicoComponent.bloquearRelacion = true;
              this.organizarTab(10);
              this.botonHistorial.nativeElement.click();
            }
          } else {
            this.notif.onWarning('Advertencia', 'El asociado ya tiene una solicitud de retiro.');
            this.juridicosFrom.get('operacion')?.reset();
            this.historialComponent.mostrarReimprimir = true;
            this.infoJuridicoComponent.bloquearRelacion = true;
            this.organizarTab(10);
            this.botonHistorial.nativeElement.click();
          }
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        this.OpcionSeleccionada = '/Solicitud de retiro';
        const solicitudRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
        const EstadoRetiro = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
        // const fechaRetiro = this.historialComponent.historialFrom.get('FechaRetiro')?.value;
        if (solicitudRetiro === null || solicitudRetiro === undefined || solicitudRetiro === '') {
          if (this.fechaRetiro === null || this.fechaRetiro === undefined || this.fechaRetiro === '') {
            if (EstadoRetiro.IdEstado !== 55) {
              this.ActivarBtnOpciones = false;
              this.GetMotivosRetiro();
              this.BloquearCamposInfoJuridico();
              this.BloquearCamposFormularios();
            } else {
              this.notif.onWarning('Advertencia', 'El asociado ya tiene una solicitud de retiro.');
              this.juridicosFrom.get('operacion')?.reset();
              this.historialComponent.mostrarReimprimir = true;
              this.infoJuridicoComponent.bloquearRelacion = true;
              this.organizarTab(10);
              this.botonHistorial.nativeElement.click();
            }
          } else {
            this.notif.onWarning('Advertencia', 'El asociado se encuentra retirado.');
            this.juridicosFrom.get('operacion')?.reset();
            this.historialComponent.mostrarReimprimir = true;
            this.infoJuridicoComponent.bloquearRelacion = true;
            this.organizarTab(10);
            this.botonHistorial.nativeElement.click();
          }
        } else {
          this.notif.onWarning('Advertencia', 'El asociado ya tiene una solicitud de retiro.');
          this.juridicosFrom.get('operacion')?.reset();
          this.historialComponent.mostrarReimprimir = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.organizarTab(10);
          this.botonHistorial.nativeElement.click();
        }
      }
    }   
  }
  CancelacionSolicitudRetiro() {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        let data = localStorage.getItem('Data');
        const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.OpcionSeleccionada = '/Cancelar solicitud de retiro';
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        } else {
          const solicitudRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
          if (solicitudRetiro !== null && solicitudRetiro !== undefined && solicitudRetiro !== '') {
            swal.fire({
              title: 'Advertencia',
              text: '',
              html: '¿Desea cancelar la solicitud de retiro? ',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si',
              cancelButtonText: 'No',
              confirmButtonColor: 'rgb(13,165,80)',
              cancelButtonColor: 'rgb(160,0,87)',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then((result) => {
              if (result.value) {
                this.ActivarBtnOpciones = false;
                this.GuardarLog(this.JuridicoSeleccionado, 24, 0, this.JuridicoSeleccionado,12);
                this.juridicosService.CancelarSolicitudRetiroJuridico(
                  this.JuridicoSeleccionado, resultPerfil.lngTercero, formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en')).subscribe(resultFecha => {
                    if (resultFecha) {
                      this.notif.onSuccess('Exitoso', 'La solicitud de retiro se canceló correctamente.');
                      this.ProDescripcionOpe = ' ';
                      this.OperacionMarcada = undefined;
                      this.juridicosFrom.get('operacion')?.reset();
                      this.botonBasico.nativeElement.click();
                      this.organizarTab(1);
                      this.consultarJuridicosNit(this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value);
                    }
                    else {
                      this.notif.onDanger('Error', 'La solicitud de retiro no se canceló correctamente.');
                      this.juridicosFrom.get('operacion')?.reset();
                    }
                  });
              }
              else {
                this.ActivarBtnOpciones = false;
                this.juridicosFrom.get('operacion')?.reset();
              }
            });
          }
          else {
            this.notif.onWarning('Advertencia', 'No hay una solicitud de retiro.');
            this.juridicosFrom.get('operacion')?.reset();
            this.historialComponent.mostrarReimprimir = false;
            this.organizarTab(1);
            this.SiguienteTab(1);
            // this.botonHistorial.nativeElement.click();
          }
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      let data = localStorage.getItem('Data');
      const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.OpcionSeleccionada = '/Cancelar solicitud de retiro';
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      } else {
        const solicitudRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
        if (solicitudRetiro !== null && solicitudRetiro !== undefined && solicitudRetiro !== '') {
          swal.fire({
            title: 'Advertencia',
            text: '',
            html: '¿Desea cancelar la solicitud de retiro? ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            confirmButtonColor: 'rgb(13,165,80)',
            cancelButtonColor: 'rgb(160,0,87)',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.value) {
              this.ActivarBtnOpciones = false;
              this.GuardarLog(this.JuridicoSeleccionado, 24, 0, this.JuridicoSeleccionado, 12);
              this.juridicosService.CancelarSolicitudRetiroJuridico(
                this.JuridicoSeleccionado, resultPerfil.lngTercero, formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en')).subscribe(resultFecha => {
                  if (resultFecha) {
                    this.notif.onSuccess('Exitoso', 'La solicitud de retiro se canceló correctamente.');
                    this.ProDescripcionOpe = ' ';
                    this.OperacionMarcada = undefined;
                    this.juridicosFrom.get('operacion')?.reset();
                    this.botonBasico.nativeElement.click();
                    this.organizarTab(1);
                    this.consultarJuridicosNit(this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value);
                  }
                  else {
                    this.notif.onDanger('Error', 'La solicitud de retiro no se canceló correctamente.');
                    this.juridicosFrom.get('operacion')?.reset();
                  }
                });
            }
            else {
              this.ActivarBtnOpciones = false;
              this.juridicosFrom.get('operacion')?.reset();
            }
          });
        }
        else {
          this.notif.onWarning('Advertencia', 'No hay una solicitud de retiro.');
          this.juridicosFrom.get('operacion')?.reset();
          this.historialComponent.mostrarReimprimir = false;
          this.organizarTab(1);
          this.SiguienteTab(1);
          // this.botonHistorial.nativeElement.click();
        }
      }
    }
  }
  MarcarcionExentoGmf() {
    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.OpcionSeleccionada = '/Marcar exento del GMF';
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          const exentoGmf = this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.value;
          if (!exentoGmf) {
            this.ActivarBtnOpciones = false;
            this.mostrarBotonesCambiar = false;
            this.mostrarBotonesSiguiente = false;
            this.mostrarBotonesAgregar = false;
            this.mostrarBotonesActualizar = false;
            this.mostrarBotonesLimpiar = false;
            this.mostrarBotonesLimpiarInfo = false;
            this.mostrarBotonesMarcarDesmarcar = true;
            this.entrevistaComponent.mostrarMarcarDesmarcar = true;
            // this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.setValue(true);
            this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(null);
            this.entrevistaComponent.MostrarFechaTratamiento = false;
            this.entrevistaComponent.bloquearCheckTratamiento = true;
            this.entrevistaComponent.bloquearFechaExento = null;
            this.entrevistaComponent.MostrarFechaExento = true;
            this.entrevistaComponent.bloquearCheckExento = true;
            this.infoJuridicoComponent.bloquearRelacion = true;
            this.entrevistaComponent.mostrarMarcarDesmarcar = true;
            this.entrevistaComponent.labelBoton = 'Marcar';
            this.BloquearCamposInfoJuridico();
            this.BloquearCamposFormularios();
            this.organizarTab(9);
            this.BloquearTabs();
            this.botonEntrevista.nativeElement.click();
            this.IrAbajo();
          } else {
            this.juridicosFrom.get('operacion')?.reset();
            this.notif.onWarning('Advertencia', 'El GMF ya se encuentra marcado.');
          }
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.OpcionSeleccionada = '/Marcar exento del GMF';
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        const exentoGmf = this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.value;
        if (!exentoGmf) {
          this.ActivarBtnOpciones = false;
          this.mostrarBotonesCambiar = false;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = true;
          this.entrevistaComponent.mostrarMarcarDesmarcar = true;
          // this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.setValue(true);
          this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(null);
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.entrevistaComponent.bloquearCheckTratamiento = true;
          this.entrevistaComponent.bloquearFechaExento = null;
          this.entrevistaComponent.MostrarFechaExento = true;
          this.entrevistaComponent.bloquearCheckExento = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.mostrarMarcarDesmarcar = true;
          this.entrevistaComponent.labelBoton = 'Marcar';
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.organizarTab(9);
          this.BloquearTabs();
          this.botonEntrevista.nativeElement.click();
          this.IrAbajo();
        } else {
          this.juridicosFrom.get('operacion')?.reset();
          this.notif.onWarning('Advertencia', 'El GMF ya se encuentra marcado.');
        }
      }
    }


  
  }
  Desmarcarexentogmf() {

    const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
    if (valueState !== null) {
      if (valueState.IdEstado != 42 && valueState.IdEstado != 47 && valueState.IdEstado != 55) {
        this.bloquearBuscar = true;
        this.bloquearNombre = true;
        this.OpcionSeleccionada = '/Desmarcar exento del GMF estado';
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
        else {
          const exentoGmf = this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.value;
          if (exentoGmf) {
            this.ActivarBtnOpciones = false;
            this.mostrarBotonesCambiar = false;
            this.mostrarBotonesSiguiente = false;
            this.mostrarBotonesAgregar = false;
            this.mostrarBotonesActualizar = false;
            this.mostrarBotonesLimpiar = false;
            this.mostrarBotonesLimpiarInfo = false;
            this.mostrarBotonesMarcarDesmarcar = true;
            this.entrevistaComponent.mostrarMarcarDesmarcar = true;
            this.entrevistaComponent.MostrarFechaTratamiento = false;
            // this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.setValue(false);
            this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(null);
            this.entrevistaComponent.bloquearCheckTratamiento = null;
            this.entrevistaComponent.bloquearFechaExento = null;
            this.entrevistaComponent.MostrarFechaExento = true;
            this.infoJuridicoComponent.bloquearRelacion = true;
            this.entrevistaComponent.labelBoton = 'Desmarcar';
            this.BloquearCamposInfoJuridico();
            this.BloquearCamposFormularios();
            this.organizarTab(9);
            this.BloquearTabs();
            this.botonEntrevista.nativeElement.click();
            this.IrAbajo();
          } else {
            this.juridicosFrom.get('operacion')?.reset();
            this.notif.onWarning('Advertencia', 'El GMF ya se encuentra desmarcado.');
            this.organizarTab(1);
            this.SiguienteTab(1);
          }
        }
      } else {
        this.MostrarMensajeAlerta(valueState);
        this.BloquearCamposFormularios();
        this.infoJuridicoComponent.mostrarCambiar = false;
        this.entrevistaComponent.entrevistaModelLst = [];
      }
    } else {
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.OpcionSeleccionada = '/Desmarcar exento del GMF estado';
      const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
      if (strNit === '' || strNit === null || strNit === undefined) {
        this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
        this.juridicosFrom.get('operacion')?.reset();
        this.BloquearTodo();
        this.organizarTab(1);
        this.SiguienteTab(1);
      }
      else {
        const exentoGmf = this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.value;
        if (exentoGmf) {
          this.ActivarBtnOpciones = false;
          this.mostrarBotonesCambiar = false;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = true;
          this.entrevistaComponent.mostrarMarcarDesmarcar = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          // this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.setValue(false);
          this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(null);
          this.entrevistaComponent.bloquearCheckTratamiento = null;
          this.entrevistaComponent.bloquearFechaExento = null;
          this.entrevistaComponent.MostrarFechaExento = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.labelBoton = 'Desmarcar';
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.organizarTab(9);
          this.BloquearTabs();
          this.botonEntrevista.nativeElement.click();
          this.IrAbajo();
        } else {
          this.juridicosFrom.get('operacion')?.reset();
          this.notif.onWarning('Advertencia', 'El GMF ya se encuentra desmarcado.');
          this.organizarTab(1);
          this.SiguienteTab(1);
        }
      }
    }    
  }
  private GestionEstadoEditar(resultPerfil : any) {
    this.OpcionSeleccionada = '/Editar';
    this.ActivarBtnOpciones = true;
    this.bloquearBuscar = true;
    this.bloquearNombre = true;
    this.bloquearOficina = true;
    this.desbloquearTabs();
    this.DesbloquearFormularios();
    this.infoJuridicoComponent.bloquearEstado = true;
    this.OficinaSeleccionada(resultPerfil);
    this.mostrarBotonesSiguiente = false;
    this.mostrarBotonesAgregar = true;
    this.mostrarBotonesActualizar = true;
    this.mostrarBotonesLimpiar = true;
    this.mostrarBotonesLimpiarInfo = false;
    this.mostrarBotonesMarcarDesmarcar = false;
    this.infoJuridicoComponent.bloquearAsesor = true;
    this.infoJuridicoComponent.bloquearAsesorExt = true;
    this.infoJuridicoComponent.disableAsesorPpal = true;
    this.infoJuridicoComponent.disableAsesorExt = true;
    this.infoJuridicoComponent.bloquearNit = true;
    this.infoJuridicoComponent.bloquearRazonSocial = true;
    this.infoJuridicoComponent.bloquearRelacion = true;
    this.infoJuridicoComponent.mostrarActualizar = true;
    this.entrevistaComponent.MostrarFechaTratamiento = false;
    this.infoJuridicoComponent.mostrarCambiar = false;
    const pregunta3 = this.entrevistaComponent.entrevistaForm.get('RPregunta6Si')?.value;
    const pregunta13 = this.entrevistaComponent.entrevistaForm.get('RPregunta14Si')?.value;
    const pregunta16 = this.entrevistaComponent.entrevistaForm.get('RPregunta17Si')?.value;
    if (pregunta3) {
      this.entrevistaComponent.DesbloquearRespuesta3 = null;
    }
    if (pregunta13) {
      this.entrevistaComponent.DesbloquearRespuesta13 = null;
    }
    if (pregunta16) {
      this.entrevistaComponent.DesbloquearRespuesta16 = null;
    }
    this.BloquearCamposInfoJuridico();
    if (this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.value !== null &&
      this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.value !== undefined &&
      this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.value !== 0 &&
      this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.value !== '') {
      this.infoJuridicoComponent.bloqCiudad = null;
      this.infoJuridicoComponent.bloqDeparta = null;
      this.AgregarValidadoresDepaCiu();
    } else {
      this.EliminarValidadoresDepaCiu();
      this.infoJuridicoComponent.bloqCiudad = true;
      this.infoJuridicoComponent.bloqDeparta = true;
    }

  }

  private MostrarMensajeAlerta(valueState: any) {
     this.juridicosFrom.get('operacion')?.reset();
      if (valueState.IdEstado === 5) {
          this.infoJuridicoComponent.bloquearAsesor = false;
          this.infoJuridicoComponent.bloquearAsesorExt = false;
          this.notif.onWarning('Advertencia', 'El estado del asociado es activo.');
        this.ProDescripcionOpe = ' ';
        this.OperacionMarcada = undefined;
          this.BloquearCamposFormularios();
          this.infoJuridicoComponent.mostrarCambiar = false;
      } else if (valueState.IdEstado === 55) { // valida si esta retirado
          this.infoJuridicoComponent.bloquearAsesor = false;
          this.infoJuridicoComponent.bloquearAsesorExt = false;
          this.notif.onWarning('Advertencia', 'El estado del asociado es retirado.');
         this.ProDescripcionOpe = ' ';
         this.OperacionMarcada = undefined;
          this.BloquearCamposFormularios();
          this.infoJuridicoComponent.mostrarCambiar = false;
      } else if  (valueState.IdEstado === 42 ) {
          this.infoJuridicoComponent.bloquearAsesor = false;
          this.infoJuridicoComponent.bloquearAsesorExt = false;
            this.notif.onWarning('Advertencia', 'El estado del asociado es Negado.');
        this.ProDescripcionOpe = ' ';
        this.OperacionMarcada = undefined;
          this.BloquearCamposFormularios();
          this.infoJuridicoComponent.mostrarCambiar = false;
      } else if( valueState.IdEstado === 47) {
          this.infoJuridicoComponent.bloquearAsesor = false;
          this.infoJuridicoComponent.bloquearAsesorExt = false;
          this.notif.onWarning('Advertencia', 'El asociado esta pendiente por aprobación.');
        this.ProDescripcionOpe = ' ';
        this.OperacionMarcada = undefined;
          this.BloquearCamposFormularios();
          this.infoJuridicoComponent.mostrarCambiar = false;
      } 
    this.SiguienteTab(1);
    this.organizarTab(1);
    this.BloquearCamposFormularios();
  }

  private gestionatrOperacionSeleccionada(operaSeleccionada: number, resultPerfil: any) {
     this.esReimpresion = false;
    if (operaSeleccionada === 20) { // Cambiar oficina
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.CambiarOficinaO(operaSeleccionada);
            this.ProAprobacion = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19)
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.CambiarOficinaO(operaSeleccionada);       
      }       
    }
    else if (operaSeleccionada === 16) { // Reingreso
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.Reingreso();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.Reingreso();
      }  
    }
    else if (operaSeleccionada === 3) { // Imprimir afiliación
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.imprimir();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.imprimir();
      }  
    }
    else if (operaSeleccionada === 29) { // Cambiar Nit
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.CambiarNit(operaSeleccionada);
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.CambiarNit(operaSeleccionada);
      }  
    }
    else if (operaSeleccionada === 30) { // Cambiar razon Social
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.CambiaRazonSocial(operaSeleccionada);
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.CambiaRazonSocial(operaSeleccionada);
      }  
    }
    else if (operaSeleccionada === 26) { // Cambiar asesor
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? ""  : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.CambiarAsesor(operaSeleccionada);
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.CambiarAsesor(operaSeleccionada);
      }  
    }
    else if (operaSeleccionada === 19) { // Cambiar asesor externo
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.CambiarAsesorExterno(operaSeleccionada);
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.CambiarAsesorExterno(operaSeleccionada);
      }  
    }
    else if (operaSeleccionada === 6) { // Cambiar Fecha actializacion
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.CambiarFechaActualizacion();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.CambiarFechaActualizacion();
      }  
    }
    else if (operaSeleccionada === 4) { // Cambiar Relacion
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } 
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            }
            // Continua normal y limpia las variables
            this.CambiarRelacion(operaSeleccionada);
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } 
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.CambiarRelacion(operaSeleccionada);
      }  
    }
    else if (operaSeleccionada === 14) { // Marcar trataiento de datos
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.MarcarTratamientosDatos();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.MarcarTratamientosDatos();
      }  
    }
    else if (operaSeleccionada === 22) { // Desmarcar tratamiento de datos
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.DesmarcarTratamientoDatos();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.DesmarcarTratamientoDatos();
      }  
    }
    else if (operaSeleccionada === 15) { // Solicitud de retiro
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.SolicitudRertiro();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.SolicitudRertiro();
      }  
    }
    else if (operaSeleccionada === 24) { // Cancelar Solicitud de retiro
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.CancelacionSolicitudRetiro();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.CancelacionSolicitudRetiro();
      }  
    }
    else if (operaSeleccionada === 41) { // Marcar exento del GMF
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.MarcarcionExentoGmf();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.MarcarcionExentoGmf();
      }  
    }
    else if (operaSeleccionada === 42) { // Desmarcar exento del GMF
      // Valida que la operacion seleccionada si tenga un cambio
      if (this.OperacionMarcada === '20') {
        if (this.ProOficina === this.juridicosFrom.get('oficina')?.value) {
          this.OperacionMarcada = undefined;
          this.ProOficina = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '29') {
        if (this.ProNit === this.infoJuridicoComponent.infoJuridicoFrom.value.Nit) {
          this.OperacionMarcada = undefined;
          this.ProNit = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '30') {
        if (this.ProRazonSocial === this.infoJuridicoComponent.infoJuridicoFrom.value.RazonSocial) {
          this.OperacionMarcada = undefined;
          this.ProRazonSocial = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '26') {
        if (this.ProAsesor === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesor) {
          this.OperacionMarcada = undefined;
          this.ProAsesor = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '19') {
        if (this.ProAsesorExterno === this.infoJuridicoComponent.infoJuridicoFrom.value.CodigoAsesorExt) {
          this.OperacionMarcada = undefined;
          this.ProAsesorExterno = '0';
          this.ProDescripcionOpe = ' ';
        }
      } else if (this.OperacionMarcada === '4') {
        if (this.ProRelacion === this.infoJuridicoComponent.infoJuridicoFrom.value.Relacion) {
          this.OperacionMarcada = undefined;
          this.ProRelacion = '0';
          this.ProDescripcionOpe = ' ';
        }
      }
      // Alerta para las operaciones que si tienen cambio
      if (this.OperacionMarcada !== undefined) {
        swal.fire({
          title: '¿No se confirmó el cambio en la operacion anterior, ' + this.ProDescripcionOpe + ', desea continuar?',
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
            //Deja la operacion  como  estaba
            if (this.OperacionMarcada === '31') {
              let state = localStorage.getItem('state');
              this.infoJuridicoComponent.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
              this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
                if (elementEstado.IdEstado === this.ProAprobacion) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
                  this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
                }
              });

            } else if (this.OperacionMarcada === '20') {
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
            } else if (this.OperacionMarcada === '29') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
            } else if (this.OperacionMarcada === '30') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
            } else if (this.OperacionMarcada === '26') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
            } else if (this.OperacionMarcada === '19') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
            } else if (this.OperacionMarcada === '4') {
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
            }
            // Continua normal y limpia las variables
            this.Desmarcarexentogmf();
            this.ProAprobacion = '0';
            this.ProOficina = '0';
            this.ProNit = '0';
            this.ProRazonSocial = '0';
            this.ProAsesor = '0';
            this.ProAsesorExterno = '0';
            this.ProRelacion = '0';

          } else {
            // regresa a la operacion anterior como  estaba antes
            if (this.OperacionMarcada === '31') {
              +this.juridicosFrom.get('operacion')?.setValue('31');
              this.AprobaroNegar(31);
            } else if (this.OperacionMarcada === '20') {
              +this.juridicosFrom.get('operacion')?.setValue('20');
              this.juridicosFrom.get('oficina')?.setValue(this.ProOficina);
              this.CambiarOficinaO(20);
            } else if (this.OperacionMarcada === '29') {
              +this.juridicosFrom.get('operacion')?.setValue('29');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(this.ProNit);
              this.CambiarNit(29);
            } else if (this.OperacionMarcada === '30') {
              +this.juridicosFrom.get('operacion')?.setValue('30');
              this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(this.ProRazonSocial);
              this.CambiaRazonSocial(30);
            } else if (this.OperacionMarcada === '26') {
              +this.juridicosFrom.get('operacion')?.setValue('26');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(this.ProAsesor);
              this.infoJuridicoComponent.GetAsesorCodigo();
              this.CambiarAsesor(26);
            } else if (this.OperacionMarcada === '19') {
              +this.juridicosFrom.get('operacion')?.setValue('19');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(this.ProAsesorExterno);
              this.infoJuridicoComponent.GetAsesorExternoCodigo();
              this.CambiarAsesorExterno(19);
            } else if (this.OperacionMarcada === '4') {
              +this.juridicosFrom.get('operacion')?.setValue('4');
              this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(this.ProRelacion);
              this.CambiarRelacion(4);
            }
          }
        });

      } else {
        // entra a la operacion por primer vez
        this.Desmarcarexentogmf();
      }  
    }
    else {
      this.juridicosFrom.get('operacion')?.reset();
      this.notif.onWarning('Advertencia', 'Esta operacion aún no ha sido habilitada.');
    }
  }

  private BloquearCampos(operacion : any) {
    this.infoJuridicoComponent.bloquearAsesor = false;
    this.infoJuridicoComponent.bloquearAsesorExt = false;
  }

  OperacionSeleccionadaOperaciones() {
    this.GetPaises();
    this.GetVias(this.dataVias);
    this.GetCardinalidad(this.dataCardinal);
    const operaSeleccionada = +this.juridicosFrom.get('operacion')?.value;
    this.operacionSeleccion = operaSeleccionada;
    let state = localStorage.getItem('Data');
    const resultPerfil = JSON.parse(JSON.parse(window.atob(state == null ? "" : state)));
    this.operacionesModel.idOperacion = operaSeleccionada;
    this.operacionesModel.idPerfil = resultPerfil.idPerfilUsuario;
    this.operacionesModel.idModulo = this.CodModulo;

    this.EnviarOperacionFormularios(operaSeleccionada);
    if (operaSeleccionada !== 2 && operaSeleccionada !== 5) {
      const valueState = this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.value;
      // if (valueState.IdEstado != 42) {
      if (operaSeleccionada === 9) {          // Cambiar estado
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.operacionesService.ObtenerEstadosXOperacionesData(this.operacionesModel).subscribe(
            resultEstados => {
              this.ActivarBtnOpciones = false;
              this.condicion = true;
              this.bloquearBuscar = true;
              this.bloquearNombre = true;
              this.bloquearOficina = true;
              // this.mostrarBotonesCambiar = true;
              this.infoJuridicoComponent.mostrarCambiar = true;
              this.mostrarBotonesSiguiente = false;
              this.mostrarBotonesAgregar = false;
              this.mostrarBotonesActualizar = false;
              this.mostrarBotonesLimpiar = false;
              this.mostrarBotonesLimpiarInfo = false;
              this.mostrarBotonesMarcarDesmarcar = false;
              this.entrevistaComponent.MostrarFechaTratamiento = false;
              this.botonBasico.nativeElement.click();
              this.organizarTab(1);
              this.BloquearTabs();
              this.infoJuridicoComponent.bloquearForm = true;
              this.infoJuridicoComponent.bloquearAsesor = true;
              this.infoJuridicoComponent.bloquearAsesorExt = true;
              this.infoJuridicoComponent.disableAsesorPpal = true;
              this.infoJuridicoComponent.disableAsesorExt = true;
              this.infoJuridicoComponent.bloquearRelacion = true;
              this.infoJuridicoComponent.bloquearNit = true;
              this.infoJuridicoComponent.bloquearRazonSocial = true;
              this.infoJuridicoComponent.dataEstados = resultEstados;
              this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
              this.BloquearCamposInfoJuridico();
              this.IrAbajo();
              this.BloquearCamposFormularios();
            });
        }
      } else if (operaSeleccionada === 20) {  // Cambiar oficina
        this.mostrarOficina = true;
        this.OpcionSeleccionada = '/Cambiar oficina';
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.juridicosFrom.get('oficina')?.reset();
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = null;
          this.ActivarBtnOpciones = false;
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.ActivarBtnOpciones = false;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
        }

      } else if (operaSeleccionada === 1) {   // Editar
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          const pregunta3 = this.entrevistaComponent.entrevistaForm.get('RPregunta6Si')?.value;
          const pregunta13 = this.entrevistaComponent.entrevistaForm.get('RPregunta14Si')?.value;
          const pregunta16 = this.entrevistaComponent.entrevistaForm.get('RPregunta17Si')?.value;
          if (pregunta3) {
            this.entrevistaComponent.DesbloquearRespuesta3 = null;
          }
          if (pregunta13) {
            this.entrevistaComponent.DesbloquearRespuesta13 = null;
          }
          if (pregunta16) {
            this.entrevistaComponent.DesbloquearRespuesta16 = null;
          }
          this.ActivarBtnOpciones = true;
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.DesbloquearFormularios();
          this.infoJuridicoComponent.bloquearEstado = true;
          this.OficinaSeleccionada(resultPerfil);
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = true;
          this.mostrarBotonesActualizar = true;
          this.mostrarBotonesLimpiar = true;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.BloquearCamposInfoJuridico();
           if (this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.value !== null &&
            this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.value !== undefined &&
            this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.value !== 0 &&
            this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.value !== '') {
            this.infoJuridicoComponent.bloqCiudad = null;
            this.infoJuridicoComponent.bloqDeparta = null;
          } else {
            this.infoJuridicoComponent.bloqCiudad = true;
            this.infoJuridicoComponent.bloqDeparta = true;
          }
        }
      } else if (operaSeleccionada === 16) {  // Reingreso
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {

        }
      } else if (operaSeleccionada === 3) {   // Imprimir afiliación
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.serviciosFrom.get('Oficina')?.setValue(resultPerfil.Oficina);
          this.serviciosFrom.get('Asesor')?.setValue(resultPerfil.Nombre);
          this.AbrirModalServicios.nativeElement.click();
        }
      } else if (operaSeleccionada === 23) {  // Gestion operaciones
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado juridico para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.mostrarBotonesCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.SolicitarGestion();
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
        }
      } else if (operaSeleccionada === 29) {  // Cambiar Nit
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado juridico para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          // this.mostrarBotonesCambiar = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = null;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
        }
      } else if (operaSeleccionada === 30) {  // Cambiar razon Social
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.BloquearCamposFormularios();
          this.BloquearCamposInfoJuridico();
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          // this.mostrarBotonesCambiar = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearRazonSocial = null;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
        }
      } else if (operaSeleccionada === 31) {  // Aprobar y o negrar ingreso
          this.operacionesService.ObtenerEstadosXOperacionesData(this.operacionesModel).subscribe(
            resultEstados => {
              this.ActivarBtnOpciones = false;
              this.condicion = true;
              this.bloquearBuscar = true;
              this.bloquearNombre = true;
              this.bloquearOficina = true;
              // this.mostrarBotonesCambiar = true;
              this.infoJuridicoComponent.mostrarCambiar = true;
              this.mostrarBotonesSiguiente = false;
              this.mostrarBotonesAgregar = false;
              this.mostrarBotonesActualizar = false;
              this.mostrarBotonesLimpiar = false;
              this.mostrarBotonesLimpiarInfo = false;
              this.mostrarBotonesMarcarDesmarcar = false;
              this.entrevistaComponent.MostrarFechaTratamiento = false;
              this.botonBasico.nativeElement.click();
              this.organizarTab(1);
              this.BloquearTabs();
              this.infoJuridicoComponent.bloquearEstado = null;
              this.infoJuridicoComponent.bloquearForm = true;
              this.infoJuridicoComponent.bloquearAsesor = true;
              this.infoJuridicoComponent.bloquearAsesorExt = true;
              this.infoJuridicoComponent.disableAsesorPpal = true;
              this.infoJuridicoComponent.disableAsesorExt = true;
              this.infoJuridicoComponent.bloquearNit = true;
              this.infoJuridicoComponent.bloquearRazonSocial = true;
              this.infoJuridicoComponent.bloquearRelacion = true;
              this.infoJuridicoComponent.dataEstados = resultEstados;
              this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
              this.BloquearCamposInfoJuridico();
              this.IrAbajo();
              this.BloquearCamposFormularios();
            });
        
      } else if (operaSeleccionada === 26) {  // Cambiar asesor
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          // this.mostrarBotonesCambiar = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearAsesor = null;
          this.infoJuridicoComponent.disableAsesorPpal = null;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.IrAbajo();
        }
      } else if (operaSeleccionada === 19) {  // Cambiar asesor externo
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          // this.mostrarBotonesCambiar = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearAsesorExt = null;
          this.infoJuridicoComponent.disableAsesorExt = null;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.IrAbajo();
        }
      } else if (operaSeleccionada === 6) {   // Cambiar Fecha actializacion
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          swal.fire({
            title: 'Advertencia',
            text: '',
            html: '¿Desea actualizar la fecha? ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            confirmButtonColor: 'rgb(13,165,80)',
            cancelButtonColor: 'rgb(160,0,87)',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.value) {
              this.infoJuridicoComponent.CambiarFechaActualizacion();
            } else {
              this.juridicosFrom.get('operacion')?.reset();
              this.BloquearTodo();
              this.BloquearCamposFormularios();
              this.BloquearCamposInfoJuridico();
            }
          });
        }
      } else if (operaSeleccionada === 4) {   // Cambiar Relacion
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.bloquearBuscar = true;
          this.bloquearNombre = true;
          this.bloquearOficina = true;
          this.infoJuridicoComponent.mostrarCambiar = true;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = false;
          this.infoJuridicoComponent.bloquearNit = true;
          this.infoJuridicoComponent.bloquearRazonSocial = true;
          this.infoJuridicoComponent.bloquearAsesorExt = true;
          this.infoJuridicoComponent.disableAsesorExt = true;
          this.infoJuridicoComponent.bloquearAsesor = true;
          this.infoJuridicoComponent.disableAsesorPpal = true;
          this.entrevistaComponent.MostrarFechaTratamiento = false;
          this.infoJuridicoComponent.bloquearEstado = true;
          this.infoJuridicoComponent.bloquearRelacion = null;
          this.infoJuridicoComponent.OperacionActual = operaSeleccionada;
          this.BloquearCamposInfoJuridico();
          this.BloquearCamposFormularios();
          this.botonBasico.nativeElement.click();
          this.organizarTab(1);
          this.BloquearTabs();
          this.IrAbajo();
        }
      } else if (operaSeleccionada === 14) {  // Marcar trataiento de dato
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.entrevistaComponent.tratamientoForm.get('checkTratamiento')?.setValue(true);
          this.mostrarBotonesCambiar = false;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = true;
          this.entrevistaComponent.MostrarFechaTratamiento = true;
          this.entrevistaComponent.bloquearCheckTratamiento = null;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.labelBoton = 'Marcar';
          this.organizarTab(9);
          this.botonEntrevista.nativeElement.click();
          this.IrAbajo();
        }
      } else if (operaSeleccionada === 22) {  // Desmarcar tratamiento de datos
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          this.entrevistaComponent.tratamientoForm.get('checkTratamiento')?.setValue(null);
          this.mostrarBotonesCambiar = false;
          this.mostrarBotonesSiguiente = false;
          this.mostrarBotonesAgregar = false;
          this.mostrarBotonesActualizar = false;
          this.mostrarBotonesLimpiar = false;
          this.mostrarBotonesLimpiarInfo = false;
          this.mostrarBotonesMarcarDesmarcar = true;
          this.entrevistaComponent.MostrarFechaTratamiento = true;
          this.entrevistaComponent.bloquearCheckTratamiento = null;
          this.infoJuridicoComponent.bloquearRelacion = true;
          this.entrevistaComponent.labelBoton = 'Desmarcar';
          this.organizarTab(9);
          this.botonEntrevista.nativeElement.click();
          this.IrAbajo();
        }
      } else if (operaSeleccionada === 15) {  // Solicitud de retiro
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia','Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          const solicitudRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
          if (solicitudRetiro === null || solicitudRetiro === undefined || solicitudRetiro === '') {
            this.GetMotivosRetiro();
          } else {
            this.notif.onWarning('Advertencia','El asociado ya cuenta con una solicitud de retiro.');
            this.juridicosFrom.get('operacion')?.reset();
            this.historialComponent.mostrarReimprimir = true;
            this.infoJuridicoComponent.bloquearRelacion = true;
            this.organizarTab(10);
            this.botonHistorial.nativeElement.click();
          }
        }
      } else if (operaSeleccionada === 24) {  // Cancelar Solicitud de retiro
        const strNit = this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value;
        if (strNit === '' || strNit === null || strNit === undefined) {
          this.notif.onWarning('Advertencia', 'Debe buscar un asociado para realizar esta operación.');
          this.juridicosFrom.get('operacion')?.reset();
          this.BloquearTodo();
        } else {
          const solicitudRetiro = this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.value;
          if (solicitudRetiro !== null && solicitudRetiro !== undefined && solicitudRetiro !== '') {
            swal.fire({
              title: 'Advertencia',
              text: '',
              html: '¿Desea cancelar la solicitud de retiro? ',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si',
              cancelButtonText: 'No',
              confirmButtonColor: 'rgb(13,165,80)',
              cancelButtonColor: 'rgb(160,0,87)',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then((result) => {
              if (result.value) {
                this.GuardarLog(this.JuridicoSeleccionado, 24, 0, this.JuridicoSeleccionado, 12); // NOTERCERO
                this.juridicosService.CancelarSolicitudRetiroJuridico(this.JuridicoSeleccionado, resultPerfil.lngTercero,
                  formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en')).subscribe(
                    resultFecha => {
                      if (resultFecha) {
                        this.notif.onSuccess('Exitoso',
                          'La solicitud de retiro se canceló correctamente.');
                        this.ProDescripcionOpe = ' ';
                        this.OperacionMarcada = undefined;
                        this.juridicosFrom.get('operacion')?.reset();
                        this.botonBasico.nativeElement.click();
                        this.organizarTab(1);
                      } else {
                        this.notif.onDanger('Error',
                          'La solicitud de retiro no se canceló correctamente.');
                        this.juridicosFrom.get('operacion')?.reset();
                      }
                    }
                  );
              } else {
                this.juridicosFrom.get('operacion')?.reset();
              }
            });
          } else {
            this.notif.onWarning('Advertencia','No hay una solicitud de retiro.');
            this.juridicosFrom.get('operacion')?.reset();
            this.historialComponent.mostrarReimprimir = false;
            this.organizarTab(1);
            this.botonHistorial.nativeElement.click();
          }
        }
      } else {
        this.juridicosFrom.get('operacion')?.reset();
        this.notif.onWarning('Advertencia', 'Esta operacion aún no ha sido habilitada.');
      }
      // } else {
      //   this.juridicosFrom.get('operacion')?.reset();
      //   this.notif.onWarning('Advertencia', 'El estado del asoaciado no permite realizar esta operación');
      // }
    } else {
      if (operaSeleccionada === 2) { // Buscar
        this.OpcionSeleccionada = '/Buscar';
        this.juridicosFrom.get('oficina')?.setValue(null);
        this.juridicosFrom.get('buscar')?.reset();
        this.juridicosFrom.get('nombre')?.reset();
        this.ActivarBtnOpciones = false;
        this.LimpiarFormBusqueda();
        this.bloquearBuscar = null;
        this.bloquearNombre = null;
        this.bloquearOficina = true;
        this.botonBasico.nativeElement.click();
        this.organizarTab(1);
        this.IrArriba();
        this.infoJuridicoComponent.infoJuridicoFrom?.reset();
        this.LimpiarFormularios();
        this.desbloquearTabs();
        this.mostrarBotonesCambiar = false;
        this.mostrarBotonesSiguiente = false;
        this.mostrarBotonesAgregar = false;
        this.mostrarBotonesActualizar = false;
        this.mostrarBotonesLimpiar = false;
        this.mostrarBotonesLimpiarInfo = false;
        this.infoJuridicoComponent.bloquearAsesor = true;
        this.infoJuridicoComponent.bloquearAsesorExt = true;
        this.infoJuridicoComponent.disableAsesorPpal = true;
        this.infoJuridicoComponent.disableAsesorExt = true;
        this.infoJuridicoComponent.bloquearRazonSocial = true;
        this.infoJuridicoComponent.bloquearNit = true;
        this.infoJuridicoComponent.bloquearRelacion = true;
        this.mostrarBotonesMarcarDesmarcar = false;
        this.entrevistaComponent.MostrarFechaTratamiento = false;
        this.BloquearFormularios();
        this.BloquearCamposInfoJuridico();
        this.patrimonioComponent.SumaActivos = 0;
        this.patrimonioComponent.SumaPasivos = 0;
        this.patrimonioComponent.TotalPatrimonio = 0;
        this.entrevistaComponent.DesbloquearRespuesta3 = true;
        this.entrevistaComponent.DesbloquearRespuesta13 = true;
        this.entrevistaComponent.DesbloquearRespuesta16 = true;

      } else if (operaSeleccionada === 5) { // Creacion de asoaciados juridicos
        this.OpcionSeleccionada = '/Creación juridico';
        this.juridicosFrom.get('oficina')?.setValue(null);
        this.infoJuridicoComponent.infoJuridicoFrom?.reset();
        this.operacionesService.ObtenerEstadosXOperacionesData(this.operacionesModel).subscribe(
          resultEstados => {
            this.infoJuridicoComponent.dataEstados = resultEstados;
            resultEstados.forEach((elementEsta : any) => {
              if (elementEsta.IdEstado === 47) {
                this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
              }
            });
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(resultPerfil.IdAsesor);
            this.infoJuridicoComponent.infoJuridicoFrom.get('NombreAsesor')?.setValue(resultPerfil.Nombre);
            this.LimpiarFormularios();
            this.LimpiarFormBusqueda();
            this.condicion = true;
            this.bloquearOficina = true;
            this.OficinaSeleccionada(resultPerfil);
            this.bloquearBuscar = true;
            this.bloquearNombre = true;
            this.botonBasico.nativeElement.click();
            this.organizarTab(1);
            this.BloquearTabs();
            this.DesbloquearFormularios();
            this.mostrarBotonesSiguiente = true;
            this.mostrarBotonesAgregar = true;
            this.mostrarBotonesActualizar = false;
            this.mostrarBotonesLimpiar = true;
            this.mostrarBotonesLimpiarInfo = true;
            this.mostrarBotonesMarcarDesmarcar = false;
            this.ActivarBtnOpciones = true;
            this.infoJuridicoComponent.bloquearNit = null;
            this.infoJuridicoComponent.bloquearRazonSocial = null;
            this.infoJuridicoComponent.bloquearAsesor = true;
            this.infoJuridicoComponent.bloquearAsesorExt = true;
            this.infoJuridicoComponent.bloquearRelacion = null;
            this.entrevistaComponent.MostrarFechaTratamiento = false;
            this.patrimonioComponent.SumaActivos = 0;
            this.patrimonioComponent.SumaPasivos = 0;
            this.patrimonioComponent.TotalPatrimonio = 0;
            this.entrevistaComponent.tratamientoForm.get('checkTratamiento')?.setValue(true);
            this.entrevistaComponent.tratamientoForm.get('checkDebitoAutomatico')?.setValue(true);
            this.patrimonioComponent.patrimonioFrom.get('ActivosNoCorrientes')?.setValue(0);
            this.patrimonioComponent.patrimonioFrom.get('OtrosActivos')?.setValue(0);
            this.patrimonioComponent.patrimonioFrom.get('ObligacionesFinancieras')?.setValue(0);
            this.patrimonioComponent.patrimonioFrom.get('CuentaPorPagar')?.setValue(0);
            this.patrimonioComponent.patrimonioFrom.get('OtrosPasivos')?.setValue(0);
          });
      }
    }

  }

  GetOficinas() {
    // this.oficinasService.getOficinas().subscribe(
    //   resultOfi => {
        let ofi = localStorage.getItem('oficinas');
        this.dataOficinas = JSON.parse(window.atob(ofi == null ? "" : ofi));
      // },
      // error => {
      //   this.notif.onDanger('Error', error);
      //   console.error(error);
      // });
  }

  GetPaises() {
    this.condicion = true;
    this.clientesGetListService.GetPaises('').subscribe(
      result => {
        // this.entrevistaComponent.dataPaises = result;
        this.solicitudesServiciosJuridicoComponent.dataPaises = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetPaisesList() {
    this.condicion = true;
    this.recursosGeneralesService.GetPaisesList().subscribe(
      result => {
        this.dataPaisesAll = result;
        this.entrevistaComponent.dataPais = result;
        this.infoJuridicoComponent.dataPais = result;
        this.contactoComponet.dataPais = result;
        this.representanteComponent.dataPaisExpedicion = result;
        this.representanteComponent.dataPaisNacimiento = result;
        this.referenciasComponent.dataPais = result;
        this.recursosGeneralesService.GetCiudadList(0).subscribe(
          resultCiu => {
            this.dataCiudadesAll = resultCiu;
            this.representanteComponent.dataCiudadesAll = resultCiu;
            this.recursosGeneralesService.GetDepartamentosList(0).subscribe(
              resultDepart => {
                this.dataDepartamentosAll = resultDepart;
                this.representanteComponent.dataDepartamentosAll = resultDepart;
                this.recursosGeneralesService.GetBarrioList(0).subscribe(
                  resultBarrios => {
                    this.dataBarriosAll = resultBarrios;
                    this.representanteComponent.dataBarriosAll = resultBarrios;
                    this.emitEventJuridico.emit(true);
                  });
              });
          });
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetVias(result : any) {
    // this.clientesGetListService.GetVias().subscribe(
    //   result => {
        this.contactoComponet.dataVias = result;
        // this.contatoRepresentanteComponent.dataVias = result;
    //   },
    //   error => {
    //     const errorMessage = <any>error;
    //     this.notif.onDanger('Error', errorMessage);
    //     console.error(errorMessage);
    //   }
    // );
  }

  GetLetra() {
    this.clientesGetListService.GetLetras().subscribe(
      result => {
        this.contactoComponet.dataLetras = result;
        // this.contatoRepresentanteComponent.dataLetras = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetCardinalidad(result : any) {
    // this.clientesGetListService.GetCardinales().subscribe(
    //   result => {
        this.contactoComponet.dataCardinal = result;
        // this.contatoRepresentanteComponent.dataCardinal = result;
    //   },
    //   error => {
    //     const errorMessage = <any>error;
    //     this.notif.onDanger('Error', errorMessage);
    //     console.error(errorMessage);
    //   }
    // );
  }

  GetImuebles(result : any) {
    // this.clientesGetListService.GetImuebles().subscribe(
    //   result => {
        this.contactoComponet.dataImuebles = result;
        // this.contatoRepresentanteComponent.dataImuebles = result;
    //   },
    //   error => {
    //     const errorMessage = <any>error;
    //     this.notif.onDanger('Error', errorMessage);
    //     console.error(errorMessage);
    //   }
    // );
  }

   GetDivisas(result : any) {
  //   this.divisasSubscription = this.clientesGetListService.GetDivisas().subscribe(
  //     result => {
        this.entrevistaComponent.dataDivisas = result;
        this.solicitudesServiciosJuridicoComponent.dataDivisas = result;
  //     },
  //     error => {
  //       const errorMessage = <any>error;
  //       this.notif.onDanger('Error', errorMessage);
  //       console.error(errorMessage);
  //     }
  //   );
  }

  GetEstado() {
    this.estadosSubscription = this.clientesGetListService.GetEstado().subscribe(
      result => {
        localStorage.setItem('state', window.btoa(JSON.stringify(result)));
        this.infoJuridicoComponent.dataEstados = result;

      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetCiudad() {
    this.ciudadSubscription = this.clientesGetListService.GetCiudad('C').subscribe(
      result => {
        this.dataCiudad = result;
    });
  }

  GetMotivosRetiro() {
    this.clientesGetListService.GetMotivosRetiro().subscribe(
      result => {
        result.forEach((element : any) => {
          if (element.IdRazonRetiro !== 3 && element.IdRazonRetiro !== 4 && element.IdRazonRetiro !== 8) {
            this.dataArrayMotivo.push(element);
          }
        });
        this.dataMotivos = this.dataArrayMotivo;
        this.solicitudRetiroForm.get('idMotivo')?.setValue('0');
         this.AbrirRetiro.nativeElement.click();
        // this.botonSiguiente.nativeElement.click();
        // this.removeActiveTab();
        // this.devolverTab(1);
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  organizarTab(tab : number) {
    this.RemoverActiveTabs();
    switch (tab) {
      case 1:
        this.activarBasico = true;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        break;
      case 2:
        $('#juridicoTab').removeClass('activar');
        $('#juridicoTab').removeClass('active');
        this.activarBasico = false;
        this.activarContacto = true;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        break;
      case 3:
        $('#juridicoTab').removeClass('activar');
        $('#juridicoTab').removeClass('active');
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = true;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        break;
      case 4:
        $('#juridicoTab').removeClass('activar');
        $('#juridicoTab').removeClass('active');
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = true;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        break;
      case 5:
        $('#juridicoTab').removeClass('activar');
        $('#juridicoTab').removeClass('active');
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = true;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        break;
      // case 6:
      //   $('#juridicoTab').removeClass('activar');
      //   $('#juridicoTab').removeClass('active');
      //   this.activarBasico = false;
      //   this.activarContacto = false;
      //   this.activarFinanciero = false;
      //   this.activarPatrimonio = false;
      //   this.activarRepLegal = false;
      //   this.activarContactoRep = true;
      //   this.activarAccionista = false;
      //   this.activarReferencias = false;
      //   this.activarEntrevista = false;
      //   this.activarHistorial = false;
      //   break;
      case 7:
        $('#juridicoTab').removeClass('activar');
        $('#juridicoTab').removeClass('active');
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = true;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        break;
      case 8:
        $('#juridicoTab').removeClass('activar');
        $('#juridicoTab').removeClass('active');
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = true;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        break;
      case 9:
        $('#juridicoTab').removeClass('activar');
        $('#juridicoTab').removeClass('active');
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = true;
        this.activarHistorial = false;
        break;
      case 10:
        $('#juridicoTab').removeClass('activar');
        $('#juridicoTab').removeClass('active');
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = true;
        break;
    }
  }

  desbloquearTabs() {
    $('#contactoTab').removeClass('bloquearTab');
    $('#financieroTab').removeClass('bloquearTab');
    $('#patrimonioTab').removeClass('bloquearTab');
    $('#repLegalTab').removeClass('bloquearTab');
    $('#contactoTabRep').removeClass('bloquearTab');
    $('#accionistasTab').removeClass('bloquearTab');
    $('#referenciaTab').removeClass('bloquearTab');
    $('#entrevistaTab').removeClass('bloquearTab');
    $('#hitorialTab').removeClass('bloquearTab');
  }

  BloquearTabs() {
    // $('#juridicoTab').addClass('bloquearTab');
    $('#contactoTab').addClass('bloquearTab');
    $('#financieroTab').addClass('bloquearTab');
    $('#patrimonioTab').addClass('bloquearTab');
    $('#repLegalTab').addClass('bloquearTab');
    $('#contactoTabRep').addClass('bloquearTab');
    $('#accionistasTab').addClass('bloquearTab');
    $('#referenciaTab').addClass('bloquearTab');
    $('#entrevistaTab').addClass('bloquearTab');
    $('#hitorialTab').addClass('bloquearTab');
  }

  RemoverActiveTabs() {

    $('#contactoTab').removeClass('activar');
    $('#contactoTab').removeClass('active');

    $('#financieroTab').removeClass('activar');
    $('#financieroTab').removeClass('active');

    $('#patrimonioTab').removeClass('activar');
    $('#patrimonioTab').removeClass('active');

    $('#repLegalTab').removeClass('activar');
    $('#repLegalTab').removeClass('active');

    $('#contactoTabRep').removeClass('activar');
    $('#contactoTabRep').removeClass('active');

    $('#accionistasTab').removeClass('activar');
    $('#accionistasTab').removeClass('active');

    $('#referenciaTab').removeClass('activar');
    $('#referenciaTab').removeClass('active');

    $('#entrevistaTab').removeClass('activar');
    $('#entrevistaTab').removeClass('active');

    $('#hitorialTab').removeClass('activar');
    $('#hitorialTab').removeClass('active');
  }

  SiguienteTab($event : any) {
    this.organizarTab($event);
   switch ($event) {
     case 1:
       this.botonBasico.nativeElement.click();
     break;
     case 2:
       $('#contactoTab').removeClass('bloquearTab');
       this.botonContacto.nativeElement.click();
     break;
     case 3:
       $('#financieroTab').removeClass('bloquearTab');
       this.botonFinanciero.nativeElement.click();
      break;
      case 4:
       $('#patrimonioTab').removeClass('bloquearTab');
       this.botonPatrimonio.nativeElement.click();
      break;
      case 5:
       $('#repLegalTab').removeClass('bloquearTab');
       this.botonRepresentante.nativeElement.click();
      break;
      case 6:
       $('#contactoTabRep').removeClass('bloquearTab');
       this.botonConRepresentante.nativeElement.click();
      break;
      case 7:
       $('#accionistasTab').removeClass('bloquearTab');
       this.botonAccionistas.nativeElement.click();
      break;
      case 8:
       $('#referenciaTab').removeClass('bloquearTab');
       this.botonReferencia.nativeElement.click();
      break;
      case 9:
       $('#entrevistaTab').removeClass('bloquearTab');
       this.botonEntrevista.nativeElement.click();
      break;
      case 10:
       this.botonHistorial.nativeElement.click();
      break;
    }
  }

  LimpiarFormBusqueda() {
    this.juridicosFrom.get('buscar')?.reset();
    this.juridicosFrom.get('nombre')?.reset();
  }

  BloquearFormularios() {
    this.infoJuridicoComponent.bloquearForm = true;
    this.infoJuridicoComponent.bloquearRelacion = true;
    this.infoJuridicoComponent.bloquearEstado = true;
    this.infoJuridicoComponent.infoJuridicoFrom?.reset();
    this.infoJuridicoComponent.bloqDeparta = true;
    this.infoJuridicoComponent.bloqCiudad = true;

    this.contactoComponet.bloquearForm = true;
    this.contactoComponet.dataTable = [];
    this.contactoComponet.contactoFrom?.reset();
    this.contactoComponet.LimpiarCamposForm();

    this.financieraComponent.bloquearForm = true;
    this.financieraComponent.dataTableEgresos = [];
    this.financieraComponent.dataTableIngresos = [];
    this.financieraComponent.financieraFrom?.reset();

    this.patrimonioComponent.bloquearForm = true;
    this.patrimonioComponent.patrimonioFrom?.reset();

    this.representanteComponent.bloquearForm = true;
    this.representanteComponent.representanteFrom?.reset();

    this.accionistasComponent.bloquearForm = true;
    this.accionistasComponent.bloquearFormAcc = true;
    this.accionistasComponent.accionistasFrom?.reset();
    this.accionistasComponent.itemAccionistas = [];

    this.referenciasComponent.bloquearForm = true;
    this.referenciasComponent.itemsReferencias = [];

    this.entrevistaComponent.bloquearForm = true;
    this.entrevistaComponent.entrevistaForm?.reset();

    this.mostrarBotonesSiguiente = false;
    this.mostrarBotonesAgregar = false;
    this.mostrarBotonesActualizar = false;
    this.mostrarBotonesLimpiar = false;
  }

  BloquearFormulariosNoLimpia() {
    this.infoJuridicoComponent.bloquearForm = true;
    this.infoJuridicoComponent.bloquearRelacion = true;
    this.infoJuridicoComponent.bloquearEstado = true;
    this.infoJuridicoComponent.bloqDeparta = true;
    this.infoJuridicoComponent.bloqCiudad = true;
    this.contactoComponet.bloquearForm = true;
    this.financieraComponent.bloquearForm = true;
    this.patrimonioComponent.bloquearForm = true;
    this.representanteComponent.bloquearForm = true;
    this.accionistasComponent.bloquearForm = true;
    this.referenciasComponent.bloquearForm = true;
    this.entrevistaComponent.bloquearForm = true;
    this.mostrarBotonesSiguiente = false;
    this.mostrarBotonesAgregar = false;
    this.mostrarBotonesActualizar = false;
    this.mostrarBotonesLimpiar = false;

    this.contactoComponet.bloquearCampoDir = true;
    this.contactoComponet.ocultarDireccion = true;
    this.contactoComponet.bloquearContPpal = true;
    this.contactoComponet.ocultarDireccion = true;
    this.contactoComponet.ocultarDireccionSeleccionada = true;
    this.contactoComponet.ocultarTelefonos = true;
    this.contactoComponet.ocultarEmail = true;
    this.contactoComponet.ocultarCelular = true;

    this.accionistasComponent.bloquearFormAcc = true;
    
    this.referenciasComponent.ocultarComerciales = true;
    this.referenciasComponent.ocultarFinancieras = true;

  }

  EnviarOperacionFormularios(operacion : any) {
    this.entrevistaComponent.OperacionSeleccionada = operacion;
    this.entrevistaComponent.OperacionActual = operacion;
    this.infoJuridicoComponent.OperacionActual = operacion;
    this.representanteComponent.OperacionActual = operacion;
    this.referenciasComponent.OperacionActual = operacion;
    this.patrimonioComponent.OperacionActual = operacion;
    this.contactoComponet.OperacionActual = operacion;
    this.accionistasComponent.OperacionActual = operacion;
    this.financieraComponent.OperacionActual = operacion;
  }

  DesbloquearFormularios() {
    this.infoJuridicoComponent.bloquearForm = null;
    this.contactoComponet.bloquearForm = null;
    this.financieraComponent.bloquearForm = null;
    this.patrimonioComponent.bloquearForm = null;
    this.representanteComponent.bloquearForm = null;
    this.accionistasComponent.bloquearForm = null;
    this.referenciasComponent.bloquearForm = null;
    this.entrevistaComponent.bloquearForm = null;
  }

  LimpiarFormularios() {
    this.contactoComponet.dataTable = [];
    this.contactoComponet.contactoFrom?.reset();
    this.contactoComponet.LimpiarCamposForm();

    this.financieraComponent.dataTableEgresos = [];
    this.financieraComponent.dataTableIngresos = [];
    this.financieraComponent.financieraFrom?.reset();
    this.financieraComponent.SumaEgresos = 0;
    this.financieraComponent.SumaIngresos = 0;

    this.patrimonioComponent.patrimonioFrom?.reset();

    this.representanteComponent.representanteFrom?.reset();
    this.representanteComponent.datatableRepresenta = [];

    this.accionistasComponent.accionistasFrom?.reset();
    this.accionistasComponent.itemAccionistas = [];
    this.accionistasComponent.accionistaModelLst = [];

    this.referenciasComponent.referenciasFrom?.reset();
    this.referenciasComponent.referenciaModelLst = [];
    this.referenciasComponent.itemsReferencias = [];

    this.entrevistaComponent.entrevistaForm?.reset();

    this.entrevistaComponent.tratamientoForm?.reset();

    this.historialComponent.historialFrom?.reset();
    this.historialComponent.dataRetirosLog = [];
    this.historialComponent.dataTratamientoLog = [];
    this.fechaRetiro = null;

    return true;
  }

  LimpiarFormulariosInicial() {
    this.contactoComponet.contactoFrom?.reset();
    this.financieraComponent.financieraFrom?.reset();
    this.patrimonioComponent.patrimonioFrom?.reset();
    this.representanteComponent.representanteFrom?.reset();
    this.accionistasComponent.accionistasFrom?.reset();
    this.entrevistaComponent.entrevistaForm?.reset();
    this.entrevistaComponent.tratamientoForm?.reset();
    this.historialComponent.historialFrom?.reset();
    return true;
  }

  OficinaSeleccionada(result : any) {
    this.dataOficinas.forEach(elementOfi => {
      if (+elementOfi.Valor === +result.NumeroOficina) {
        this.juridicosFrom.get('oficina')?.setValue(elementOfi.Descripcion);
        this.infoJuridicoComponent.OficinaSeleccionada = elementOfi;
      }
    });
  }

  BloquearCamposInfoJuridico() {
    this.infoJuridicoComponent.AsessorNecesario = true;
    this.infoJuridicoComponent.bloqDeparta = true;
    this.infoJuridicoComponent.bloqCiudad = true;
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  IrAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }

  BloquearCamposFormularios() {
    
    this.infoJuridicoComponent.bloquearForm = true;
    this.infoJuridicoComponent.bloqDeparta = true;
    this.infoJuridicoComponent.bloqCiudad = true;
    this.infoJuridicoComponent.mostrarActualizar = false;
    this.infoJuridicoComponent.mostrarSiguiente = false;
    this.infoJuridicoComponent.mostrarNuevoInfo = false;
    this.infoJuridicoComponent.bloquearEstado = true;
    this.infoJuridicoComponent.bloquearRazonSocial = true;
    this.infoJuridicoComponent.bloquearNit = true;
    this.infoJuridicoComponent.bloquearRelacion = true;
 
    this.contactoComponet.bloquearForm = true;
    this.financieraComponent.bloquearForm = true;
    this.patrimonioComponent.bloquearForm = true;
    this.representanteComponent.bloquearForm = true;
    this.accionistasComponent.bloquearForm = true;
    this.referenciasComponent.bloquearForm = true;
    this.entrevistaComponent.bloquearForm = true;

    this.generalesService.AgregarDisabled('estadoJur');   
    
  }

  ResetOperation() {
    this.juridicosFrom.get('operacion')?.reset();
    // this.solicitudRetiroForm.get('idMotivo')?.setValue('0');
    // this.solicitudRetiroForm.get('ObservacionMotivo')?.reset();
    // this.basicosFrom.get('operacion')?.reset();
    // this.mostrarBtn = false;
    // this.ObservacionRetiro = false;
    // this.mostarErrorMotivoDescripcion = false;
  }

  validarOtroMotivo() {
    
    const MotivoEscogido = this.solicitudRetiroForm.get('idMotivo')?.value;
    if (MotivoEscogido === '12' || MotivoEscogido === '11') {
      this.ObservacionRetiro = true;
      this.mostrarErrorMotivo = false;
    } else {
      this.ObservacionRetiro = false;
      this.mostarErrorMotivoDescripcion = false;
      this.mostrarErrorMotivo = false;
      this.solicitudRetiroForm.get('ObservacionMotivo')?.reset();
    }
  }

  SetDataSolicituretiro() {
    this.objMotivoEnvio = new EnvioMotivoJuridicoModel();
    const dataForm = this.solicitudRetiroForm.value;
    if (dataForm.idMotivo === '' || dataForm.idMotivo === null || dataForm.idMotivo === '0') {
      this.solicitudRetiroForm.get('idMotivo')?.setValue('0');
      // this.notif.onWarning('Advertencia', 'Debe seleccionar un motivo de retiro.',
      //   ConfiguracionNotificacion.configRightTop);
      this.mostrarErrorMotivo = true;
      // this.juridicosFrom.get('operacion')?.reset();
      // this.AbrirRetiro.nativeElement.click();
      // this.botonBasico.nativeElement.click();
    } else {
      if (dataForm.idMotivo === '12' || dataForm.idMotivo === '11') {
        if (dataForm.ObservacionMotivo === '' || dataForm.ObservacionMotivo === null) {
          this.mostarErrorMotivoDescripcion = true;
        } else {
          this.juridicosFrom.get('operacion')?.reset();
          this.AbrirRetiro.nativeElement.click();
          this.botonBasico.nativeElement.click();
          this.solicitudRetiroForm?.reset();
          this.mostarErrorMotivoDescripcion = false;
          // aqui realizar el registro
          let data = localStorage.getItem('Data');
          const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
          let solucitudR = localStorage.getItem('solicituRetiroJson');
          const resulMotivoEnvio = JSON.parse(window.atob(solucitudR == null ? "" : solucitudR));
          this.objMotivo.Descripcion = this.solicitudRetiroForm.get('ObservacionMotivo')?.value;
          this.objMotivo.FechaRetiro = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en');
          this.objMotivo.IdJuridico = this.JuridicoSeleccionado;
          this.objMotivo.IdAsesor = resultPerfil.lngTercero;
          this.objMotivo.MotivoRetiro = +dataForm.idMotivo;

          this.objMotivoEnvio.Nombre = resulMotivoEnvio.Nombre;
          this.objMotivoEnvio.Documento = resulMotivoEnvio.Documento;
          this.objMotivoEnvio.Motivo = this.solicitudRetiroForm.get('idMotivo')?.value;
          this.objMotivoEnvio.Otro = this.objMotivo.Descripcion;
          this.objMotivoEnvio.Celular = resulMotivoEnvio.Celular;
          this.objMotivoEnvio.Direccion = resulMotivoEnvio.Direccion;
          this.objMotivoEnvio.TelefonoEmpresa = resulMotivoEnvio.TelefonoEmpresa;
          this.objMotivoEnvio.NombreAsesor = resultPerfil.Nombre;
          this.objMotivoEnvio.Email = resulMotivoEnvio.Email;
          this.objMotivoEnvio.CiudadExpedicion = resulMotivoEnvio.CiudadExpedicion;
          this.objMotivoEnvio.Empresa = resulMotivoEnvio.Empresa;

          this.motivoEnvioJson = JSON.stringify(this.objMotivoEnvio);

          this.GuardarLog(this.objMotivo, this.operacionSeleccion, 0, this.JuridicoSeleccionado, 12);
          this.juridicosService.GuardarRetiroJuridico(this.objMotivo).subscribe(
            result => {
              this.mostrarBotonesSiguiente = false;
              this.mostrarBotonesAgregar = false;
              this.mostrarBotonesActualizar = false;
              this.mostrarBotonesLimpiar = false;
              this.BloquearCamposFormularios();
              this.openSolicitudRetiro.nativeElement.click();
              this.juridicosFrom.get('operacion')?.reset();
              this.consultarJuridicosNit(this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value);
            }, error => {
              // this.motivoEnvioJson = null;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.error(errorMessage);
            });
        }
      } else {
        this.juridicosFrom.get('operacion')?.reset();
        this.AbrirRetiro.nativeElement.click();
        this.botonBasico.nativeElement.click();
        this.solicitudRetiroForm?.reset();
        this.mostarErrorMotivoDescripcion = false;
        let data = localStorage.getItem('Data');
        const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
        let solucitudR = localStorage.getItem('solicituRetiroJson');
        const resulMotivoEnvio = JSON.parse(window.atob(solucitudR == null ? "" : solucitudR));
        // aqui realizar el registro
       
        // this.objMotivo.Descripcion = this.solicitudRetiroForm.get('ObservacionMotivo')?.value;
        this.objMotivo.Descripcion = this.solicitudRetiroForm.get('ObservacionMotivo')?.value;
        this.objMotivo.FechaRetiro = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en');
        this.objMotivo.IdJuridico = this.JuridicoSeleccionado;
        this.objMotivo.IdAsesor = resultPerfil.lngTercero;
        this.objMotivo.MotivoRetiro = +dataForm.idMotivo;

        this.objMotivoEnvio.Nombre = resulMotivoEnvio.Nombre;
        this.objMotivoEnvio.Documento = resulMotivoEnvio.Documento;
        this.objMotivoEnvio.Motivo = dataForm.idMotivo;
        this.objMotivoEnvio.Otro = this.objMotivo.Descripcion;
        this.objMotivoEnvio.Celular = resulMotivoEnvio.Celular;
        this.objMotivoEnvio.Direccion = resulMotivoEnvio.Direccion;
        this.objMotivoEnvio.TelefonoEmpresa = resulMotivoEnvio.TelefonoEmpresa;
        this.objMotivoEnvio.NombreAsesor = resultPerfil.Nombre;
        this.objMotivoEnvio.Email = resulMotivoEnvio.Email;
        this.objMotivoEnvio.CiudadExpedicion = resulMotivoEnvio.CiudadExpedicion;
        this.objMotivoEnvio.Empresa = resulMotivoEnvio.Empresa;

        this.motivoEnvioJson = JSON.stringify(this.objMotivoEnvio);
        this.GuardarLog(this.objMotivo, this.operacionSeleccion, 0, this.JuridicoSeleccionado,12);
        this.juridicosService.GuardarRetiroJuridico(this.objMotivo).subscribe(
          result => {
            this.mostrarBotonesSiguiente = false;
            this.mostrarBotonesAgregar = false;
            this.mostrarBotonesActualizar = false;
            this.mostrarBotonesLimpiar = false;
            this.ObservacionRetiro = false;
            this.solicitudRetiroForm?.reset();
            this.BloquearCamposFormularios();
            this.openSolicitudRetiro.nativeElement.click();
            this.juridicosFrom.get('operacion')?.reset();
            this.consultarJuridicosNit(this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value);
          }, error => {
            this.motivoEnvioJson = null;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.error(errorMessage);
          });
      }
    }
  }

  Reimprimir(idRetiroLog : any, idJuridico : any) {
    this.retiro = idRetiroLog;
    this.juridico = idJuridico;
    this.openSolicitudRetiroReimprimir.nativeElement.click();
  }

  BloquearTodo() {
    this.juridicosFrom.get('oficina')?.setValue(null);
      this.juridicosFrom.get('buscar')?.reset();
      this.juridicosFrom.get('nombre')?.reset();
      this.ActivarBtnOpciones = false;
      this.LimpiarFormBusqueda();
      this.bloquearBuscar = true;
      this.bloquearNombre = true;
      this.bloquearOficina = true;
      this.infoJuridicoComponent.bloquearEstado = true;
      this.botonBasico.nativeElement.click();
      this.organizarTab(1);
      this.IrArriba();
      this.infoJuridicoComponent.infoJuridicoFrom?.reset();
      this.LimpiarFormularios();
      this.desbloquearTabs();
      this.mostrarBotonesCambiar = false;
      this.mostrarBotonesSiguiente = false;
      this.mostrarBotonesAgregar = false;
      this.mostrarBotonesActualizar = false;
      this.mostrarBotonesLimpiar = false;
      this.mostrarBotonesLimpiarInfo = false;
      this.infoJuridicoComponent.bloquearAsesor = true;
      this.infoJuridicoComponent.bloquearAsesorExt = true;
      this.infoJuridicoComponent.disableAsesorPpal = true;
      this.infoJuridicoComponent.disableAsesorExt = true;
      this.infoJuridicoComponent.bloquearRazonSocial = true;
      this.infoJuridicoComponent.bloquearNit = true;
      this.infoJuridicoComponent.bloquearRelacion = true;
      this.infoJuridicoComponent.bloquearEstado= true;
      this.mostrarBotonesMarcarDesmarcar = false;
      this.entrevistaComponent.MostrarFechaTratamiento = false;
      this.BloquearFormularios();
      this.BloquearCamposInfoJuridico();
      this.patrimonioComponent.SumaActivos = 0;
      this.patrimonioComponent.SumaPasivos = 0;
      this.patrimonioComponent.TotalPatrimonio = 0;
  }

  PreCargarPais() {

      this.infoJuridicoComponent.dataPais.forEach((elementPais : any) => {
        if (elementPais.IdPais === 42 ) {
          this.infoJuridicoComponent.infoJuridicoFrom.get('Pais')?.setValue(elementPais.IdPais);
          this.contactoComponet.contactoFrom.get('Pais')?.setValue(elementPais.IdPais);
          this.referenciasComponent.referenciasFrom.get('Pais')?.setValue(elementPais.IdPais);
          this.contactoComponet.PaisMapper = elementPais;
          this.referenciasComponent.PaisMapper = elementPais;
          this.recursosGeneralesService.GetDepartamentosList(elementPais.IdPais).subscribe(
            result => {
              if (result.length > 0) {
                  // //aqui se agregan los validadores de depa y ciu
                  // this.infoJuridicoComponent.AgregarValidadoresDepaCiu();
                  this.infoJuridicoComponent.bloqDeparta = null;
                  this.infoJuridicoComponent.dataDepartamentos = result;             
                  this.referenciasComponent.bloqDeparta = null;
                  this.referenciasComponent.dataDepartamentos = result;
                
                  this.contactoComponet.bloqDeparta = null;
                  this.contactoComponet.dataDepartamentos = result;
                  this.contactoComponet.contactoFrom.controls['Pais'].setErrors(null);
                  this.contactoComponet.contactoFrom.controls['Pais'].clearValidators();
                  this.contactoComponet.contactoFrom.controls['Pais'].setValidators(null);
              }
            },
            error => {
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.error(errorMessage);
            }
          );
        }
      });
  }
  //#endregion

  //#region Metodos Funcionales

  BotonBuscarJuridico() {
    const Documento = this.juridicosFrom.get('buscar')?.value;
    const Nombre = this.juridicosFrom.get('nombre')?.value;
    if (Documento !== null && Documento !== undefined && Documento !== " ") {
    this.consultarJuridicosNit(Documento); 
    }
    if (Nombre !== null || Nombre !==  undefined && Nombre !== " ") {
      this.consultarJuridicosRazon(Nombre);
    }
  }

  consultarJuridicosNit(nit : string) {
    if (nit !== '' && nit !== undefined && nit !== null ) {
      localStorage.setItem('trasabilidad-juridico', window.btoa(JSON.stringify(nit)));
       this.LimpiarFormularios();
       this.loading = true;
      this.juridicosService.BuscarJuridicosAll(nit, '*').subscribe(
        result => {
          this.loading = false;
          if (result !== null) {
            if (result.JuridicoDto !== null) {
              this.CargarTabs(result);
              this.JuridicoSeleccionado = result.JuridicoDto.IdJuridico;
              this.entrevistaComponent.idJuridicoSearch = result.JuridicoDto.IdJuridico;
              this.entrevistaComponent.fechaMatricula = result.JuridicoDto.FechaMatricula;
              this.bloquearBuscar = true;
              this.bloquearNombre = true;
              this.juridicosFrom.get('operacion')?.reset();
              this.btnBuscar = true;
              this.ActivarAsteriscosEditar(result.BasicosDto.IdRelacion);
              this.loading = false;
            } else {
              this.loading = false;
            }
          } else {
            this.notif.onWarning('Advertencia', 'No se encontró registro.');
            this.loading = false;
            this.juridicosFrom.get('buscar')?.reset();
            this.juridicosFrom.get('nombre')?.reset();
            this.generalesService.Autofocus('BuscarDocumento');
          }
        },
        error => {
          this.loading = false;
          this.notif.onWarning('Advertencia', 'No existen datos realizar la consulta.');
          console.error('Error' + error);
          this.juridicosFrom.get('buscar')?.reset();
          this.juridicosFrom.get('nombre')?.reset();
        }
      );
    }
  }

  ActivarAsteriscosEditar(Relacion : number){
    if (Relacion === 5) { // Asociado
      this.contactoComponet.obligatoriCliente = true;
      this.financieraComponent.obligatoriCliente = true;
      this.patrimonioComponent.obligatoriCliente = true;
      this.representanteComponent.obligatoriCliente = true;
      this.accionistasComponent.obligatoriCliente = true;
      this.referenciasComponent.obligatoriCliente = true;
      } else  if(Relacion === 15){ // Tercero
        this.contactoComponet.obligatoriCliente = true;
        this.financieraComponent.obligatoriCliente = true;
        this.patrimonioComponent.obligatoriCliente = true;
        this.representanteComponent.obligatoriCliente = true;
        this.accionistasComponent.obligatoriCliente = false;
        this.referenciasComponent.obligatoriCliente = false;
      } 
  }

  consultarJuridicosRazon(razon : any) {
    if (razon !== '' && razon !== undefined && razon !== null) {
      if (razon.length >= 3) {
        this.LimpiarFormularios();
        this.juridicosService.BuscarJuridicoList(razon).subscribe(
          result => {
            if (result.length !== 0) {
            console.log(result);
            // abrir el modal
            this.AbrirListaJuridicosModal.nativeElement.click();
            this.listaJuridicos = result;
            } else {
              this.notif.onWarning('Advertencia', 'No se encontró  registro.');
              this.juridicosFrom.get('buscar')?.reset();
              this.juridicosFrom.get('nombre')?.reset();
            this.generalesService.Autofocus('BuscarNombre');
            }
          },
          error => {
            this.notif.onWarning('Advertencia', 'No existen datos realizar la consulta');
            this.juridicosFrom.get('buscar')?.reset();
            this.juridicosFrom.get('nombre')?.reset();
            console.error('Error' + error);
          });
      } else {
        this.notif.onWarning('Advertencia', 'Ingrese mas de tres caracteres para realizar la busqueda.');
      }
    }
  }

  CargarTabs(result : any) {
    this.mostrarOficina = true;

    this.infoJuridicoComponent.dataCiudades = this.dataCiudadesAll;
    this.infoJuridicoComponent.dataDepartamentos = this.dataDepartamentosAll;
    this.infoJuridicoComponent.dataPais = this.dataPaisesAll;

    this.contactoComponet.dataCiudades = this.dataCiudadesAll;
    this.contactoComponet.dataDepartamentos = this.dataDepartamentosAll;
    this.contactoComponet.dataPais = this.dataPaisesAll;

    this.referenciasComponent.dataCiudades = this.dataCiudadesAll;
    this.referenciasComponent.dataDepartamentos = this.dataDepartamentosAll;
    this.referenciasComponent.dataPais = this.dataPaisesAll;

    console.log(result);
    console.log(result.JuridicoDto);

    if ((result.JuridicoDto !== null && result.JuridicoDto !== undefined) && 
      ( result.BasicosDto !== null && result.BasicosDto !== undefined)) {
      this.CargarDataFormularioBaisco(result.JuridicoDto, result.BasicosDto);
    } else {
      this.CargarDatosFormularioBasicoInicial(result.JuridicoDto, result);
    }

    if (result.ContactoDto !== null ) {
      if (result.ContactoDto.length > 0) {
        this.CargarDataFormularioContacto(result.ContactoDto);
      } else { 
        this.objMotivoEnvio.Celular = '';
        this.objMotivoEnvio.Direccion = '';
        this.objMotivoEnvio.Email = '';
        this.objMotivoEnvio.Telefono = '';
        this.objMotivoEnvio.TelefonoEmpresa = '';
      }
    }
    if (result.FinancieroDto !== null ) {
      if (result.FinancieroDto.length > 0) {
        this.CargarDataFormularioFinanciero(result.FinancieroDto);
      }
    }
    if (result.PatrimonioDto !== null ) {
      this.CargarDataFormularioPatrimonio(result.PatrimonioDto);
    } else {
      this.CargarDataFormularioPatrimonio(result.PatrimonioDto);
    }
    if (result.RepresentanteDto !== null ) {
      if (result.JuridicoDto !== null) {
        this.CargarDataFormularioRepresentante(result.RepresentanteDto, result.JuridicoDto.IdJuridico);
      }
    } else {
      if (result.JuridicoDto !== null) {
        this.CargarDataFormularioRepresentanteEdit(result.JuridicoDto.IdJuridico);
      }
    }
    if (result.AccionistaDto !== null ) {
      if (result.AccionistaDto.length > 0) {
        this.CargarDataFormularioAccionistas(result.AccionistaDto);
      }
    }
    if (result.ReferenciasDto !== null ) { 
      if (result.ReferenciasDto.length > 0) {
        this.CargarDataFormularioReferencias(result.ReferenciasDto);
      }
    }
    if (result.EntrevistaDto !== null ) {
      if (result.EntrevistaDto.length > 0) {
        this.CargarDataFormularioEntrevista(result.EntrevistaDto, result.TratamientoDto, result.BasicosDto);
      }
    }
    //Cargar data Historial
    if (result.JuridicoDto !== null && result.BasicosDto !== null) {
        this.CargarDataFormularioHistorial(result);
    }
    if (result.TratamientoDto !== null) {
      this.CargarDataTratamientoDatos(result.TratamientoDto);
    }
  }

  limpiarRazon(campo : string) {
    this.juridicosFrom.get(campo)?.reset();
  }

  limpiarNit(campo : string) {
    this.juridicosFrom.get(campo)?.reset();
  }

  CargarDataFormularioBaisco(data : any, dataBasico : any) {
    this.infoJuridicoComponent.JuridicoEdit = data.IdJuridico;
    this.contactoComponet.JuridicoEdit = data.IdJuridico;
    this.entrevistaComponent.JuridicoEdit = data.IdJuridico;
    this.financieraComponent.JuridicoEdit =  data.IdJuridico;
    this.accionistasComponent.JuridicoEdit = data.IdJuridico;
    this.referenciasComponent.JuridicoEdit = data.IdJuridico;
    this.patrimonioComponent.JuridicoEdit = data.IdJuridico;
    if ( this.dataOficinas !== null) {
      this.dataOficinas .forEach(element => {
        if (+element.Valor === dataBasico.IdOficina) {
          this.juridicosFrom.get('oficina')?.setValue(element.Descripcion);
          this.infoJuridicoComponent.OficinaMapper = element;
        }
      });
    }
    if (dataBasico.IdCiudad !== null && dataBasico.IdCiudad !== undefined) {
      // this.AgregarValidadoresDepaCiu();
      this.dataCiudadesAll.forEach((elementCiu : any) => {
        if (elementCiu.IdCiudad === dataBasico.IdCiudad) {
          this.infoJuridicoComponent.infoJuridicoFrom.get('Ciudad')?.setValue(elementCiu.IdCiudad);
          this.infoJuridicoComponent.CiudadMapper = elementCiu;
          this.infoJuridicoComponent.CiudadMapperUpda = elementCiu;
          // this.infoJuridicoComponent.bloqCiudad = null;
          this.dataDepartamentosAll.forEach((elementDep : any) => {
            if (elementDep.IdDepartamento === elementCiu.IdDepartamento) {
              this.infoJuridicoComponent.DepartMapper = elementDep;
              this.infoJuridicoComponent.DepartMapperUpd = elementDep;
              // this.infoJuridicoComponent.bloqDeparta = null;
              this.infoJuridicoComponent.infoJuridicoFrom.get('Departamento')?.setValue(elementDep.IdDepartamento);
              this.dataPaisesAll.forEach((elementPais : any) => {
                if (elementPais.IdPais === elementDep.IdPais) {
                  this.infoJuridicoComponent.infoJuridicoFrom.get('Pais')?.setValue(elementPais.IdPais);
                  this.infoJuridicoComponent.PaisMapper = elementPais;
                }
              });
            }
          });
        }
      });
    } else {
      if (dataBasico.IdPais !== null && dataBasico.IdPais !== undefined) {
        this.EliminarValidadoresDepaCiu();
          this.dataPaisesAll.forEach((elementPais : any)  => {
            if (elementPais.IdPais === dataBasico.IdPais) {
              this.infoJuridicoComponent.PaisMapper = elementPais;
              this.infoJuridicoComponent.infoJuridicoFrom.get('Pais')?.setValue(elementPais.IdPais);
            }
          });
      }
    }
    this.representanteComponent.juridicoEdit = data.IdJuridico;
    this.infoJuridicoComponent.infoJuridicoFrom.get('IdJuridico')?.setValue(data.IdJuridico);
    this.infoJuridicoComponent.infoJuridicoFrom.get('IdJuridicoInfo')?.setValue(dataBasico.IdJuridicoInfo);
    this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(data.Nit);
    
    this.objMotivoEnvio.Documento = data.Nit;
    this.DocumentoSolicitud = data.Nit;
    this.documentoConsultar =  data.Nit;
    this.infoJuridicoComponent.NitConsultado = data.Nit;
    this.historialComponent.nitConsultado = data.Nit;
    if (dataBasico.IdRelacion === 15) {
      this.BlockDeudor = null;
      this.bloquearModalServicios = null;
    } else {
       this.BlockDeudor = null;
      this.bloquearModalServicios = null;
    }
    this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.setValue(dataBasico.IdRelacion);
    this.infoJuridicoComponent.relacionAnterior = dataBasico.IdRelacion;
    this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(data.RazonSocial);
    this.infoJuridicoComponent.RazonSocialMapper = data.RazonSocial;
    this.objMotivoEnvio.Nombre = data.RazonSocial;

    this.infoJuridicoComponent.infoJuridicoFrom.get('Conocio')?.setValue(dataBasico.ConocioCoogranada);
    this.infoJuridicoComponent.infoJuridicoFrom.get('OtroPor')?.setValue(dataBasico.OtroPor);
    if (dataBasico.ConocioCoogranada === 7 || dataBasico.ConocioCoogranada === 6) {
      this.infoJuridicoComponent.MostrarOtroPor = true;
    } else {
      this.infoJuridicoComponent.MostrarOtroPor = false;
    }
    if (dataBasico.FechaConstitucion !== null) {
      const dateString = dataBasico.FechaConstitucion;
      const newDate = new Date(dateString);
      const fechaStringNew = moment(newDate).format('YYYY-MM-DD');
      this.infoJuridicoComponent.infoJuridicoFrom.get('FechaConstitucion')?.setValue(fechaStringNew);
    } else {
      this.infoJuridicoComponent.infoJuridicoFrom.get('FechaConstitucion')?.setValue(null);
    }
    if (dataBasico.Estrato !== 0) {
      this.infoJuridicoComponent.infoJuridicoFrom.get('Estrato')?.setValue(dataBasico.Estrato);
    } else {
      this.infoJuridicoComponent.infoJuridicoFrom.get('Estrato')?.setValue(null);
    }
    

    this.clientesGetListService.GetListCiiu().subscribe(
      resultCiu => {
        resultCiu.forEach((elemCiu : any) => {
          if (elemCiu.Id === +dataBasico.CIIU) {
            this.infoJuridicoComponent.infoJuridicoFrom.get('Ciiu')?.setValue(elemCiu.Id);
            this.infoJuridicoComponent.CiiuMapper = elemCiu;
            this.infoJuridicoComponent.infoJuridicoFrom.get('ActividadEconomica')?.setValue(elemCiu.Descripcion);
            this.infoJuridicoComponent.ActividadMapper = elemCiu;
          }
        });
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
    if (dataBasico.IdTipoLocal !== null) {
       this.infoJuridicoComponent.infoJuridicoFrom.get('TipoLocal')?.setValue(dataBasico.IdTipoLocal);
    } else {
      
    }
   
    if (dataBasico.IdTipoSociedad !== null) {
       this.infoJuridicoComponent.infoJuridicoFrom.get('TipoSociedad')?.setValue(dataBasico.IdTipoSociedad);
    } else {
      
    }
   
    if (dataBasico.IdObjetoSocial !== null) {
      this.infoJuridicoComponent.infoJuridicoFrom.get('ObjetoSocial')?.setValue(dataBasico.IdObjetoSocial);
    } else {
      
    }

    this.infoJuridicoComponent.dataEstados.forEach((elementEstado : any) => {
      if (elementEstado.IdEstado === dataBasico.IdEstado) {
        this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.reset();
        this.infoJuridicoComponent.infoJuridicoFrom.get('Estado')?.setValue(elementEstado);
        this.infoJuridicoComponent.AnteriorEstadoSeleccion = elementEstado;
      }
    });

    const modelAsesorExt = new AsesorModel();
    modelAsesorExt.strCodigo = dataBasico.IdAsesorExterno;
    modelAsesorExt.strNombre = '';
    modelAsesorExt.strTipo = '';
    if (dataBasico.IdAsesorExterno !== null && dataBasico.IdAsesorExterno !== undefined && dataBasico.IdAsesorExterno !== '') {
       this.clientesGetListService.GetAsesorExterno(modelAsesorExt).subscribe(
      result => {
          if (result.length !== 0) {
            result.forEach((elements : any) => {
              this.infoJuridicoComponent.infoJuridicoFrom.get('NombreAsesorExt')?.setValue(elements.Nombre);
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(elements.intIdAsesor);
              this.objMotivoEnvio.NombreAsesor = elements.Nombre;
              localStorage.setItem('solicituRetiroJson', window.btoa(JSON.stringify(this.objMotivoEnvio)));
            });
          } else {
            this.infoJuridicoComponent.infoJuridicoFrom.get('NombreAsesorExt')?.setValue('');
            this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue('');
          }
      },
      error => {
        this.notif.onDanger('Error', error);
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
    }


    const modelAsesor = new AsesorModelPpal();
    modelAsesor.strCodigoAse = dataBasico.IdAsesorMatriculo;
    modelAsesor.strNombreAse = '';
    modelAsesor.strTipoAse = '';
    if (dataBasico.IdAsesorMatriculo === 2) {
      this.infoJuridicoComponent.infoJuridicoFrom.get('NombreAsesor')?.setValue('Coogranada');
      this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(2);
    } else {
      if (dataBasico.IdAsesorMatriculo !== null && dataBasico.IdAsesorMatriculo !== undefined && dataBasico.IdAsesorMatriculo !== '') {
        this.clientesGetListService.GetAsesor(modelAsesor).subscribe(
          result => {
            if (result.length !== 0) {
              result.forEach((elementex : any) => {
                this.infoJuridicoComponent.infoJuridicoFrom.get('NombreAsesor')?.setValue(elementex.Nombre);
                this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue(elementex.IdAsesor);
                // this.terceroSave.get('IdAsesorExterno')?.setValue(elementex.lngTercero);
              });
            } else {
              this.infoJuridicoComponent.infoJuridicoFrom.get('NombreAsesor')?.setValue('');
              this.infoJuridicoComponent.infoJuridicoFrom.get('CodigoAsesor')?.setValue('');
              // this.terceroSave.get('IdAsesorExterno')?.reset();
              // this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
            }
          },
          error => {
            this.notif.onDanger('Error', error);
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }
    }
  
    if (dataBasico.ExentoGMF === 1) {
      this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.setValue(true);
    } else if (dataBasico.ExentoGMF === 0) {
      this.entrevistaComponent.tratamientoForm.get('checkExentoGMF')?.setValue(false);
    }
    
    this.entrevistaComponent.tratamientoForm.get('checkDebitoAutomatico')?.setValue(dataBasico.DebitoAutomatico)
    this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(
      new DatePipe('en-CO').transform(new Date(dataBasico.FechaExencionGMF), 'yyyy/MM/dd HH:mm:ss'));

    localStorage.setItem('solicituRetiroJson', window.btoa(JSON.stringify(this.objMotivoEnvio)));
  }

  CargarDatosFormularioBasicoInicial(data : any, rest : any) {
     if (rest.TipoConvenio !== 0 && rest.TipoConvenio !== null && rest.TipoConvenio !== undefined ) {
      this.infoJuridicoComponent.infoJuridicoFrom.get('IdJuridico')?.setValue(data.IdJuridico);
      this.representanteComponent.representanteFrom.get('IdJuridico')?.setValue(data.IdJuridico);
      this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.setValue(data.Nit);
      this.objMotivoEnvio.Documento = data.Nit;
      this.DocumentoSolicitud = data.Nit;
      this.infoJuridicoComponent.infoJuridicoFrom.get('RazonSocial')?.setValue(data.RazonSocial);
      this.objMotivoEnvio.Nombre = data.RazonSocial;
      if (rest.TipoConvenio !== null && rest.TipoConvenio != undefined) {
        this.infoJuridicoComponent.MostrarConvenio = true;
        rest.TipoConvenio.forEach((element :any) => {
          if (element.intTipo === 1) {
            this.infoJuridicoComponent.infoJuridicoFrom.get('nomina')?.setValue('Libranza');
            this.infoJuridicoComponent.infoJuridicoFrom.get('nro')?.setValue(element.intConvenio);
          } else if (element.intTipo === 2)  {
            this.infoJuridicoComponent.infoJuridicoFrom.get('nomina')?.setValue('Nomina');
            this.infoJuridicoComponent.infoJuridicoFrom.get('nro')?.setValue(element.intConvenio);
          } else {
            this.infoJuridicoComponent.MostrarConvenio = false;
            this.infoJuridicoComponent.infoJuridicoFrom.get('IdJuridico')?.reset;
          }
        });
        
      } else {
        this.infoJuridicoComponent.MostrarConvenio = false;
        this.infoJuridicoComponent.infoJuridicoFrom.get('IdJuridico')?.reset;
      }
    } else {
      
    }
  }

  CargarDataFormularioFinanciero(data : any) {
    if (data !== null && data.length > 0) {
      data.forEach((element : any) => {
        this.clientesGetListService.GetConceptosJuridicos(element.IdCategoria).subscribe(
          result => {
            this.financieraComponent.dataConceptos = result;
            this.financieraComponent.dataConceptos.forEach((elementConcepto :any) => {
              if (elementConcepto.IdConcepto === element.IdJuridicoConcepto) {
                this.financieraComponent.financieraFrom.get('IdJuridicoFinanciera')?.setValue(element.IdJuridicoFinanciera);
                this.financieraComponent.financieraFrom.get('IdJuridico')?.setValue(element.IdTercero);
                this.financieraComponent.DataRequired.CategoriasData.forEach(elementCateg => {
                  if (elementCateg.Id === element.IdCategoria) {
                    this.financieraComponent.financieraFrom.get('Categoria')?.setValue(elementCateg);
                  }
                });
                this.financieraComponent.financieraFrom.get('Concepto')?.setValue(elementConcepto);
                this.financieraComponent.financieraFrom.get('Valor')?.setValue(element.Valor);
                this.financieraComponent.financieraFrom.get('Observacion')?.setValue(element.Descripcion);

                if (element.IdCategoria === 1) {
                  this.financieraComponent.SumaIngresos = this.financieraComponent.SumaIngresos + element.Valor;
                  this.financieraComponent.dataTableIngresos.push(this.financieraComponent.financieraFrom.value);
                } else {
                  this.financieraComponent.SumaEgresos = this.financieraComponent.SumaEgresos + element.Valor;
                  this.financieraComponent.dataTableEgresos.push(this.financieraComponent.financieraFrom.value);
                }
              }
              this.financieraComponent.financieraFrom?.reset();
            });
          });
      });
    } else {
      
    }
  }

  CargarDataFormularioContacto(data : any) {
    this.contactoComponet.dataTable = [];
    if (data.length > 0) {
      data.forEach((elementData : any) => {
        if (elementData.IdBarrio !== null && elementData.IdBarrio !== undefined && elementData.IdBarrio !== 0) {
          this.dataBarriosAll.forEach((elementBarr :any) => {
            if (elementBarr.IdBarrio === elementData.IdBarrio) {
              this.contactoComponet.contactoFrom.get('Barrio')?.setValue(elementBarr);
              if (elementData.IdCiudad !== null && elementData.IdCiudad !== undefined &&  elementData.IdCiudad !== 0) {
                this.dataCiudadesAll.forEach((elementCiu : any) => {
                  if (elementCiu.IdCiudad === elementData.IdCiudad) {
                    this.contactoComponet.contactoFrom.get('Ciudad')?.setValue(elementCiu);
                    this.dataDepartamentosAll.forEach((elementDep : any) => {
                      if (elementDep.IdDepartamento === elementCiu.IdDepartamento) {
                        this.contactoComponet.contactoFrom.get('Departamento')?.setValue(elementDep);
                        this.dataPaisesAll.forEach((elementPais : any) => {
                          if (elementPais.IdPais === elementDep.IdPais) {
                            this.contactoComponet.contactoFrom.get('Pais')?.setValue(elementPais);
                            this.contactoComponet.dataContacto.forEach((tipoCon :any) => {
                              if (tipoCon.Id === elementData.IdTipoContacto) {
                                this.contactoComponet.contactoFrom.get('TipoContacto')?.setValue(tipoCon);
                              }
                            });

                            this.contactoComponet.contactoFrom.get('contactoPpal')?.setValue(elementData.ContactoPrincipal);
                            if (elementData.IdTipoContacto === 8) {
                              this.contactoComponet.contactoFrom.get('DescripcionAdress')?.setValue(elementData.Descripcion);
                              this.contactoComponet.contactoFrom.get('DescripcionAdressIds')?.setValue(elementData.DescripcionIds);
                              if (elementData.ContactoPrincipal) {
                                this.objMotivoEnvio.Direccion = elementData.Descripcion;
                              }
                            } else if (elementData.IdTipoContacto === 3) {
                              this.contactoComponet.contactoFrom.get('Email')?.setValue(elementData.Descripcion);
                              if (elementData.ContactoPrincipal) {
                                  this.objMotivoEnvio.Email = elementData.Descripcion;
                                } else {
                                  this.objMotivoEnvio.Email = elementData.Descripcion;
                                }
                            } else if (elementData.IdTipoContacto === 7) {
                              this.contactoComponet.contactoFrom.get('Telefonos')?.setValue(elementData.Descripcion);
                            } else if (elementData.IdTipoContacto === 6) {
                              this.contactoComponet.contactoFrom.get('Celular')?.setValue(elementData.Descripcion);
                              if (elementData.ContactoPrincipal) {
                                  this.objMotivoEnvio.Celular = elementData.Descripcion;
                                } else {
                                  if (elementData.IdTipoContacto === 6) {
                                    this.objMotivoEnvio.Celular = elementData.Descripcion;
                                  }
                                }
                            }
                            this.contactoComponet.contactoFrom.get('IdJuridico')?.setValue(elementData.IdJuridico);
                            // this.contactoComponet.JuridicoEdit = elementData.IdTercero;
                            this.contactoComponet.contactoFrom.get('IdJuridicoContacto')?.setValue(elementData.IdJuridicoContacto);
                            this.contactoComponet.dataTable.push(this.contactoComponet.contactoFrom.value);
                            this.contactoComponet.contactoFrom?.reset();
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
          });
          localStorage.setItem('solicituRetiroJson', window.btoa(JSON.stringify(this.objMotivoEnvio)));
        } else {
          
          if (elementData.IdCiudad !== null && elementData.IdCiudad !== undefined && elementData.IdCiudad !== ''
          && elementData.IdCiudad !== 0) {
            this.dataCiudadesAll.forEach((elementCiu :any) => {
              if (elementCiu.IdCiudad === elementData.IdCiudad) {
                this.contactoComponet.contactoFrom.get('Ciudad')?.setValue(elementCiu);
                this.dataDepartamentosAll.forEach((elementDep :any) => {
                  if (elementDep.IdDepartamento === elementCiu.IdDepartamento) {
                    this.contactoComponet.contactoFrom.get('Departamento')?.setValue(elementDep);
                    this.dataPaisesAll.forEach((elementPais : any) => {
                      if (elementPais.IdPais === elementDep.IdPais) {
                        this.contactoComponet.contactoFrom.get('Pais')?.setValue(elementPais);
                        this.contactoComponet.dataContacto.forEach((tipoCon : any) => {
                          if (tipoCon.Id === elementData.IdTipoContacto) {
                            this.contactoComponet.contactoFrom.get('TipoContacto')?.setValue(tipoCon);
                          }
                        });

                        this.contactoComponet.contactoFrom.get('contactoPpal')?.setValue(elementData.ContactoPrincipal);
                        if (elementData.IdTipoContacto === 8) {
                          this.contactoComponet.contactoFrom.get('DescripcionAdress')?.setValue(elementData.Descripcion);
                          this.contactoComponet.contactoFrom.get('DescripcionAdressIds')?.setValue(elementData.DescripcionIds);
                          if (elementData.ContactoPrincipal) {
                            this.objMotivoEnvio.Direccion = elementData.Descripcion;
                          }
                        } else if (elementData.IdTipoContacto === 3) {
                          this.contactoComponet.contactoFrom.get('Email')?.setValue(elementData.Descripcion);
                          if (elementData.ContactoPrincipal) {
                            this.objMotivoEnvio.Email = elementData.Descripcion;
                          } else {
                            this.objMotivoEnvio.Email = elementData.Descripcion;
                          }
                        } else if (elementData.IdTipoContacto === 7) {
                          this.contactoComponet.contactoFrom.get('Telefonos')?.setValue(elementData.Descripcion);
                        } else if (elementData.IdTipoContacto === 6) {
                          this.contactoComponet.contactoFrom.get('Celular')?.setValue(elementData.Descripcion);
                          if (elementData.ContactoPrincipal) {
                            this.objMotivoEnvio.Celular = elementData.Descripcion;
                          } else {
                            if (elementData.IdTipoContacto === 6) {
                              this.objMotivoEnvio.Celular = elementData.Descripcion;
                            }
                          }
                        }
                        this.contactoComponet.contactoFrom.get('IdJuridico')?.setValue(elementData.IdTercero);
                        this.contactoComponet.JuridicoEdit = elementData.IdTercero;
                        this.contactoComponet.contactoFrom.get('IdJuridicoContacto')?.setValue(elementData.IdJuridicoContacto);
                        this.contactoComponet.dataTable.push(this.contactoComponet.contactoFrom.value);
                        this.contactoComponet.contactoFrom?.reset();
                      }
                    });
                  }
                });
              }
            });
          } else {
            if (elementData.IdPais !== null && elementData.IdPais !== undefined
              && elementData.IdPais !== '' && elementData.IdPais !== 0) {
              this.dataPaisesAll.forEach((elementPais : any) => {
                if (elementPais.IdPais === elementData.IdPais) {
                  this.contactoComponet.contactoFrom.get('Pais')?.setValue(elementPais);
                  this.contactoComponet.dataContacto.forEach((tipoCon : any) => {
                    if (tipoCon.Id === elementData.IdTipoContacto) {
                      this.contactoComponet.contactoFrom.get('TipoContacto')?.setValue(tipoCon);
                    }
                  });

                  this.contactoComponet.contactoFrom.get('contactoPpal')?.setValue(elementData.ContactoPrincipal);
                  if (elementData.IdTipoContacto === 8) {
                    this.contactoComponet.contactoFrom.get('DescripcionAdress')?.setValue(elementData.Descripcion);
                    this.contactoComponet.contactoFrom.get('DescripcionAdressIds')?.setValue(elementData.DescripcionIds);
                    if (elementData.ContactoPrincipal) {
                      this.objMotivoEnvio.Direccion = elementData.Descripcion;
                    }
                  } else if (elementData.IdTipoContacto === 3) {
                    this.contactoComponet.contactoFrom.get('Email')?.setValue(elementData.Descripcion);
                    if (elementData.ContactoPrincipal) {
                      this.objMotivoEnvio.Email = elementData.Descripcion;
                    } else {
                      this.objMotivoEnvio.Email = elementData.Descripcion;
                    }
                  } else if (elementData.IdTipoContacto === 7) {
                    this.contactoComponet.contactoFrom.get('Telefonos')?.setValue(elementData.Descripcion);
                  } else if (elementData.IdTipoContacto === 6) {
                    this.contactoComponet.contactoFrom.get('Celular')?.setValue(elementData.Descripcion);
                    if (elementData.ContactoPrincipal) {
                      this.objMotivoEnvio.Celular = elementData.Descripcion;
                    } else {
                      if (elementData.IdTipoContacto === 6) {
                        this.objMotivoEnvio.Celular = elementData.Descripcion;
                      }
                    }
                  }
                  this.contactoComponet.contactoFrom.get('IdJuridico')?.setValue(elementData.IdTercero);
                  this.contactoComponet.JuridicoEdit = elementData.IdTercero;
                  this.contactoComponet.contactoFrom.get('IdJuridicoContacto')?.setValue(elementData.IdJuridicoContacto);
                  this.contactoComponet.dataTable.push(this.contactoComponet.contactoFrom.value);
                  this.contactoComponet.contactoFrom?.reset();
                }
              });
            }
          }

          if (elementData.IdTipoContacto !== 8) {

            this.contactoComponet.dataContacto.forEach((tipoCon : any) => {
              if (tipoCon.Id === elementData.IdTipoContacto) {
                this.contactoComponet.contactoFrom.get('TipoContacto')?.setValue(tipoCon);
              }
            });

            this.contactoComponet.contactoFrom.get('contactoPpal')?.setValue(elementData.ContactoPrincipal);
            if (elementData.IdTipoContacto === 8) {
              this.contactoComponet.contactoFrom.get('DescripcionAdress')?.setValue(elementData.Descripcion);
              this.contactoComponet.contactoFrom.get('DescripcionAdressIds')?.setValue(elementData.DescripcionIds);
              if (elementData.ContactoPrincipal) {
                this.objMotivoEnvio.Direccion = elementData.Descripcion;
              }
            } else if (elementData.IdTipoContacto === 3) {
              this.contactoComponet.contactoFrom.get('Email')?.setValue(elementData.Descripcion);
              if (elementData.ContactoPrincipal) {
                this.objMotivoEnvio.Email = elementData.Descripcion;
              } else {
                this.objMotivoEnvio.Email = elementData.Descripcion;
              }

            } else if (elementData.IdTipoContacto === 7) {
              this.contactoComponet.contactoFrom.get('Telefonos')?.setValue(elementData.Descripcion);
              this.objMotivoEnvio.TelefonoEmpresa = elementData.Descripcion;
            } else if (elementData.IdTipoContacto === 6) {
              this.contactoComponet.contactoFrom.get('Celular')?.setValue(elementData.Descripcion);
              if (elementData.ContactoPrincipal) {
                this.objMotivoEnvio.Celular = elementData.Descripcion;
              } else {
                if (elementData.IdTipoContacto === 6) {
                  this.objMotivoEnvio.Celular = elementData.Descripcion;
                }
              }
            }
            this.contactoComponet.contactoFrom.get('IdJuridico')?.setValue(elementData.IdTercero);
            this.contactoComponet.contactoFrom.get('IdJuridicoContacto')?.setValue(elementData.IdJuridicoContacto);
            this.contactoComponet.dataTable.push(this.contactoComponet.contactoFrom.value);
            this.contactoComponet.contactoFrom?.reset();
          } else {
            this.contactoComponet.contactoFrom.get('DescripcionAdress')?.setValue(elementData.Descripcion);
            this.contactoComponet.contactoFrom.get('DescripcionAdressIds')?.setValue(elementData.DescripcionIds);
          }
        }
      });
    } else {
      this.objMotivoEnvio.Celular = '';
      this.objMotivoEnvio.Direccion = '';
      this.objMotivoEnvio.Email = '';
      this.objMotivoEnvio.Telefono = '';
      this.objMotivoEnvio.TelefonoEmpresa = '';
    }
    localStorage.setItem('solicituRetiroJson', window.btoa(JSON.stringify(this.objMotivoEnvio)));
  }

  CargarDataFormularioPatrimonio(data : any) {
    if (data !== null) {
     
      this.patrimonioComponent.patrimonioFrom.get('IdJuridicoPatrimonio')?.setValue(data.IdJuridicoPatrimonio);
      
      this.patrimonioComponent.patrimonioFrom.get('IdJuridico')?.setValue(data.IdTercero);
      
      if (data.ActivosCorrientes === null || data.ActivosCorrientes === undefined) {
        this.patrimonioComponent.patrimonioFrom.get('ActivosCorrientes')?.setValue(0);
      } else {
        this.patrimonioComponent.patrimonioFrom.get('ActivosCorrientes')?.setValue(data.ActivosCorrientes);
      }
      
      if (data.ActivosNoCorrientes === null || data.ActivosNoCorrientes === undefined) {
         this.patrimonioComponent.patrimonioFrom.get('ActivosNoCorrientes')?.setValue(0);
      } else {
        this.patrimonioComponent.patrimonioFrom.get('ActivosNoCorrientes')?.setValue(data.ActivosNoCorrientes);
      }
      
      if (data.OtrosActivos === null || data.OtrosActivos === undefined) {
        this.patrimonioComponent.patrimonioFrom.get('OtrosActivos')?.setValue(0);
      } else {
         this.patrimonioComponent.patrimonioFrom.get('OtrosActivos')?.setValue(data.OtrosActivos);
      }

      if (data.ObligacionesFinancieras === null || data.ObligacionesFinancieras === undefined) {
        this.patrimonioComponent.patrimonioFrom.get('ObligacionesFinancieras')?.setValue(0);
      } else {
        this.patrimonioComponent.patrimonioFrom.get('ObligacionesFinancieras')?.setValue(data.ObligacionesFinancieras);
      }

      if (data.CuentasPorPagar === null || data.CuentasPorPagar === undefined) {
        this.patrimonioComponent.patrimonioFrom.get('CuentaPorPagar')?.setValue(0);
      } else {
        this.patrimonioComponent.patrimonioFrom.get('CuentaPorPagar')?.setValue(data.CuentasPorPagar);
      }

      if (data.OtrosPasivos === null || data.OtrosPasivos === undefined) {
        this.patrimonioComponent.patrimonioFrom.get('OtrosPasivos')?.setValue(0);
      } else {
        this.patrimonioComponent.patrimonioFrom.get('OtrosPasivos')?.setValue(data.OtrosPasivos);
      }

      this.patrimonioComponent.SumaActivos = 0;
      this.patrimonioComponent.TotalPatrimonio = 0;
      this.patrimonioComponent.SumaPasivos = 0;

      this.patrimonioComponent.SumaActivos = +data.ActivosCorrientes +
        +data.ActivosNoCorrientes + +data.OtrosActivos;

      this.patrimonioComponent.SumaPasivos = +data.ObligacionesFinancieras +
        +data.CuentasPorPagar + +data.OtrosPasivos;

      this.patrimonioComponent.TotalPatrimonio = +this.patrimonioComponent.TotalPatrimonio +
        +this.patrimonioComponent.SumaActivos - +this.patrimonioComponent.SumaPasivos;
    } else {
        this.patrimonioComponent.patrimonioFrom.get('ActivosCorrientes')?.setValue(0);
        this.patrimonioComponent.patrimonioFrom.get('ActivosNoCorrientes')?.setValue(0);
        this.patrimonioComponent.patrimonioFrom.get('OtrosActivos')?.setValue(0);
        this.patrimonioComponent.patrimonioFrom.get('ObligacionesFinancieras')?.setValue(0);
        this.patrimonioComponent.patrimonioFrom.get('CuentaPorPagar')?.setValue(0);
        this.patrimonioComponent.patrimonioFrom.get('OtrosPasivos')?.setValue(0);
    }
  }

  CargarDataFormularioRepresentante(data : any, id : any) {
    let CiudadConcatenadaNac = '';
    let CiudadConcatenadaExp = '';
    let CiudadContatctos = '';
    if (data !== null) {
      if (data.IdCiudadNac !== 0 && data.IdCiudadNac !== null && data.IdCiudadNac !== undefined &&
        data.IdCiudadExp !== 0 && data.IdCiudadExp !== null && data.IdCiudadExp !== undefined) {
        this.dataCiudad.forEach((elementCiu : any) => {
          if (elementCiu.IdCiudad === data.IdCiudadNac) {

            this.representanteComponent.representanteFrom.get('CiudadNaci')?.setValue(elementCiu.Descripcion);
            this.representanteComponent.CiudadMapperNac = elementCiu;
          } else {
            this.dataCiudadesAll.forEach((elementNuv :any) => {
              if (elementNuv.IdCiudad === data.IdCiudadNac) {
                CiudadConcatenadaNac = elementNuv.Descripcion;
                this.representanteComponent.CiudadMapperNac = elementNuv;
                this.dataDepartamentosAll.forEach((elementDep : any) => {
                  if (elementDep.IdDepartamento === elementNuv.IdDepartamento) {
                    CiudadConcatenadaNac = CiudadConcatenadaNac + ' - ' + elementDep.Descripcion;
                    this.dataPaisesAll.forEach((elementPais : any) => {
                      if (elementDep.IdPais === elementPais.IdPais) {
                        CiudadConcatenadaNac = CiudadConcatenadaNac + ' - ' + elementPais.Descripcion;
                        this.representanteComponent.representanteFrom.get('CiudadNaci')?.setValue(CiudadConcatenadaNac);
                      }
                    });
                  }
                });
              }
            });
          }
          if (elementCiu.IdCiudad === data.IdCiudadExp) {
            this.representanteComponent.representanteFrom.get('CiudadExpe')?.setValue(elementCiu.Descripcion);
            this.representanteComponent.CiudadMapperExp = elementCiu;
          } else {
            this.dataCiudadesAll.forEach((elementNuv : any) => {
              if (elementNuv.IdCiudad === data.IdCiudadExp) {
                CiudadConcatenadaExp = elementNuv.Descripcion;
                this.representanteComponent.CiudadMapperNac = elementNuv;
                this.dataDepartamentosAll.forEach((elementDep : any) => {
                  if (elementDep.IdDepartamento === elementNuv.IdDepartamento) {
                    CiudadConcatenadaExp = CiudadConcatenadaExp + ' - ' + elementDep.Descripcion;
                    this.dataPaisesAll.forEach((elementPais : any) => {
                      if (elementDep.IdPais === elementPais.IdPais) {
                        CiudadConcatenadaExp = CiudadConcatenadaExp + ' - ' + elementPais.Descripcion;
                        this.representanteComponent.representanteFrom.get('CiudadExpe')?.setValue(CiudadConcatenadaExp);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
      
      this.representanteComponent.representanteFrom.get('IdJuridico')?.setValue(id);
      this.representanteComponent.representanteFrom.get('IdTercero')?.setValue(id);
      this.representanteComponent.representanteFrom.get('IdRepresenta')?.setValue(data.IdTercero);
    
      this.representanteComponent.dataTipoDocumento.forEach((elementTipoDoc : any) => {
        if (elementTipoDoc.Clase === data.IdTipoIdentificacion) {
          this.representanteComponent.representanteFrom.get('TipoDocumento')?.setValue(elementTipoDoc);
        }
      });
      this.representanteComponent.representanteFrom.get('NumeroDocumento')?.setValue(data.NumeroDocumento);
      this.representanteComponent.representanteFrom.get('PrimerNombre')?.setValue(data.PrimerNombre);
      this.representanteComponent.representanteFrom.get('SegundoNombre')?.setValue(data.SegundoNombre);
      this.representanteComponent.representanteFrom.get('PrimerApellido')?.setValue(data.PrimerApellido);
      this.representanteComponent.representanteFrom.get('SegundoApellido')?.setValue(data.SegundoApellido);
      if (data.IdProfesion !== 0 && data.IdProfesion !== null && data.IdProfesion !== undefined) {
        console.log('Paso validacion a el foreach de dataProfesion');
        this.representanteComponent.dataProfesion.forEach((elementProfe : any) => {
          if (elementProfe.Clase === data.IdProfesion) {
            console.log('salio bien el foreach de dataProfesion');
            this.representanteComponent.representanteFrom.get('Profesion')?.setValue(elementProfe.Descripcion);
            this.representanteComponent.modelProfesion = elementProfe;
          }
        });
      }
      if (data.IdCargo !== 0 && data.IdCargo !== null && data.IdCargo !== undefined) {
        console.log('Paso validacion a el foreach de dataCargos');
        this.representanteComponent.dataCargos.forEach((elementCarg : any) => {
          if (elementCarg.Clase === data.IdCargo) {
            console.log('salio bien el foreach de dataProfesion');
            this.representanteComponent.representanteFrom.get('Cargo')?.setValue(elementCarg.Descripcion);
            this.representanteComponent.modelCargo = elementCarg;
          }
        });
      }
      const dateStringExp = data.FechaExpedicion;
      const newDateExp = new Date(dateStringExp);
      newDateExp.setMinutes(newDateExp.getMinutes() + newDateExp.getTimezoneOffset());
      const fechaStringNewExp = moment(newDateExp).format('YYYY-MM-DD');
      this.representanteComponent.representanteFrom.get('FechaExpedicion')?.setValue(fechaStringNewExp);

      const dateStringNac = data.FechaNacimiento;
      const newDateNac = new Date(dateStringNac);
      newDateNac.setMinutes(newDateNac.getMinutes() + newDateNac.getTimezoneOffset());
      const fechaStringNewNac = moment(newDateNac).format('YYYY-MM-DD');
      this.representanteComponent.representanteFrom.get('FechaNacimiento')?.setValue(fechaStringNewNac);

      if (data.Pregunta1 === 'true') {
        this.representanteComponent.representanteFrom.get('Representante1Si')?.setValue(true);
        this.representanteComponent.representanteFrom.get('Representante1No')?.setValue(false);
      } else {
        this.representanteComponent.representanteFrom.get('Representante1Si')?.setValue(false);
        this.representanteComponent.representanteFrom.get('Representante1No')?.setValue(true);
      }
      if (data.Pregunta2 === 'true') {
        this.representanteComponent.representanteFrom.get('Representante2Si')?.setValue(true);
        this.representanteComponent.representanteFrom.get('Representante2No')?.setValue(false);
      } else {
        this.representanteComponent.representanteFrom.get('Representante2Si')?.setValue(false);
        this.representanteComponent.representanteFrom.get('Representante2No')?.setValue(true);
      }

      this.representanteComponent.datatableRepresenta = [];
      // this.clientesGetListService.GetRepresentate(data.NumeroDocumento).subscribe(
      //   result => {
      if (data.ListContacto !== null) {
        this.representanteComponent.dataTipoContacto.forEach((elementDataContacto : any) => {
          data.ListContacto.forEach((elementCont : any) => {
            if (elementCont.ContactoPrincipal) {
              this.loading = true;
              if (elementDataContacto.Id === elementCont.IdTipoContacto) {
                if (elementCont.IdCiudad !== undefined && elementCont.IdCiudad !== null && elementCont.IdCiudad !== 0) {
                  this.dataBarriosAll.forEach((elementBarrio : any) => {
                    if (elementBarrio.IdBarrio === elementCont.IdBarrio) {
                      CiudadContatctos = elementBarrio.Descripcion;
                    }
                  });
                  this.dataCiudadesAll.forEach((elementNuv : any) => {
                    if (elementNuv.IdCiudad === elementCont.IdCiudad) {
                      CiudadContatctos = CiudadContatctos + ' ' + elementNuv.Descripcion;
                      this.dataDepartamentosAll.forEach((elementDep  : any) => {
                        if (elementDep.IdDepartamento === elementNuv.IdDepartamento) {
                          CiudadContatctos = CiudadContatctos + ' - ' + elementDep.Descripcion;
                          elementCont.IdCiudad = CiudadContatctos;
                          elementCont.IdTipoContacto = elementDataContacto.Nombre;
                          this.representanteComponent.datatableRepresenta.push(elementCont);
                          this.loading = false;
                        }
                      });
                    }
                  });
                } else {
                  elementCont.IdTipoContacto = elementDataContacto.Nombre;
                  this.representanteComponent.datatableRepresenta.push(elementCont);
                  this.loading = false;
                }

              }
            }
          });
        });
      }
      this.loading = false;
        // });
    }
  }

  CargarDataFormularioRepresentanteEdit( id : string) {
    this.representanteComponent.representanteFrom.get('IdJuridico')?.setValue(id);
    this.representanteComponent.representanteFrom.get('IdTercero')?.setValue(id);
  }

  CargarDataFormularioHistorial(data : any) {

    this.historialComponent.historialFrom.get('FechaCreacion')?.setValue(
      new DatePipe('en-CO').transform(data.JuridicoDto.FechaMatricula, 'yyyy/MM/dd HH:mm:ss'));

    if (data.BasicosDto.FechaModificacion !== null && data.BasicosDto.FechaModificacion !== undefined &&
      data.BasicosDto.FechaModificacion !== '') {
         this.historialComponent.historialFrom.get('FechaActualizacion')?.setValue(
      new DatePipe('en-CO').transform(new Date(data.BasicosDto.FechaModificacion), 'yyyy/MM/dd HH:mm:ss'));
    } else {
      this.historialComponent.historialFrom.get('FechaActualizacion')?.setValue('');
    }

    if (data.BasicosDto.FechaRetiro !== null && data.BasicosDto.FechaRetiro !== undefined &&
      data.BasicosDto.FechaRetiro !== '') {
      this.fechaRetiro = data.BasicosDto.FechaRetiro;
      this.historialComponent.historialFrom.get('FechaRetiro')?.setValue(
      new DatePipe('en-CO').transform(data.BasicosDto.FechaRetiro, 'yyyy/MM/dd HH:mm:ss'));
    } else {
      this.historialComponent.historialFrom.get('FechaRetiro')?.setValue('');
    }

    if (data.BasicosDto.FechaSolicitudRetiro !== null && data.BasicosDto.FechaSolicitudRetiro !== undefined &&
      data.BasicosDto.FechaSolicitudRetiro !== '') {
      this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.setValue(
        new DatePipe('en-CO').transform(data.BasicosDto.FechaSolicitudRetiro, 'yyyy/MM/dd HH:mm:ss'));
    } else {
      this.historialComponent.historialFrom.get('FechaSolicitudRetiro')?.setValue('');
    }

    this.historialComponent.GetTratamientoLog(data.JuridicoDto.IdJuridico);
    this.historialComponent.GetRetirosLog(data.JuridicoDto.IdJuridico);
    this.historialComponent.GetReingresosLog(data.JuridicoDto.IdJuridico);
  }

  CargarDataFormularioAccionistas(data : any) {
    data.forEach((element : any) => {
      this.accionistasComponent.accionistasFrom.get('IdJuridicoAccionista')?.setValue(element.IdJuridicoAccionista);
      this.accionistasComponent.accionistasFrom.get('IdJuridico')?.setValue(element.IdTercero);
      this.accionistasComponent.dataTipoDocumento.forEach(elementTipo => {
        if (elementTipo.Clase === element.IdTipoIdentificacion) {
          this.accionistasComponent.accionistasFrom.get('TipoDocumento')?.setValue(elementTipo);
        }
      });
      this.accionistasComponent.accionistasFrom.get('NumeroDocumento')?.setValue(element.NumeroDocumento);
      this.accionistasComponent.accionistasFrom.get('RazonNombre')?.setValue(element.RazonSocial);
      if (element.VinculoPeps) {
        element.VinculoPeps = '1';
      } else {
        element.VinculoPeps = '2';
      }
      this.accionistasComponent.accionistasFrom.get('EsPeps')?.setValue(element.VinculoPeps);
      this.accionistasComponent.accionistasFrom.get('Participacion')?.setValue(element.Participacion);
      this.accionistasComponent.accionistasFrom.get('IdPersonaAccionista')?.setValue(element.IdPersonaAccionista);
      this.accionistasComponent.itemAccionistas.push(this.accionistasComponent.accionistasFrom.value);
      this.accionistasComponent.accionistasFrom?.reset();
    });
  }

  CargarDataFormularioReferencias(data : any) {
    data.forEach((element : any) => {
      this.referenciasComponent.DataRequired.ReferenciaData.forEach(elementRef => {
        if (elementRef.Id === element.IdTipoReferencia) {
          this.referenciasComponent.referenciasFrom.get('TipoReferencia')?.setValue(elementRef);

            if (element.IdTipoReferencia === 1) {
              this.referenciasComponent.referenciasFrom.get('NombreEmpresa')?.setValue(element.Descripcion);
              this.referenciasComponent.referenciasFrom.get('TelefonoUno')?.setValue(element.Telefono);
            } else if (element.IdTipoReferencia === 3) {
              this.referenciasComponent.referenciasFrom.get('Entidad')?.setValue(element.Descripcion);
              this.referenciasComponent.referenciasFrom.get('Telefono')?.setValue(element.Telefono);
            }
          this.referenciasComponent.referenciasFrom.get('TelefonoDos')?.setValue(element.Telefono2);

          if (+element.IdCiudad !== null && +element.IdCiudad !== undefined &&
            element.IdCiudad !== '' && +element.IdCiudad !== 0) {
            this.dataCiudadesAll.forEach((elementCiu : any) => {
              if (elementCiu.IdCiudad === element.IdCiudad) {
                this.referenciasComponent.referenciasFrom.get('Ciudad')?.setValue(elementCiu);
                this.referenciasComponent.CiudadMapper = elementCiu;
                this.dataDepartamentosAll.forEach((elementDep : any) => {
                  if (elementDep.IdDepartamento === elementCiu.IdDepartamento) {
                    this.referenciasComponent.referenciasFrom.get('Departamento')?.setValue(elementDep);
                    this.referenciasComponent.DepartMapper = elementDep;
                    this.dataPaisesAll.forEach((elementPais : any) => {
                      if (elementPais.IdPais === elementDep.IdPais) {
                        this.referenciasComponent.PaisMapper = elementCiu;
                        this.referenciasComponent.referenciasFrom.get('Pais')?.setValue(elementPais);
                      }
                    });
                  }
                });
              }
            });
          } else {
            if (element.IdPais !== null && element.IdPais !== undefined &&
              element.IdPais !== '' && element.IdPais !== 0) {
              this.dataPaisesAll.forEach((elementPais : any) => {
                if (elementPais.IdPais === element.IdPais) {
                  this.referenciasComponent.PaisMapper = elementPais;
                  this.referenciasComponent.referenciasFrom.get('Pais')?.setValue(elementPais);
                }
              });
            }
          }

          this.referenciasComponent.referenciasFrom.get('IdJuridicoReferencia')?.setValue(element.IdJuridicoReferencia);
          this.referenciasComponent.referenciasFrom.get('IdJuridico')?.setValue(element.IdTercero);
          this.referenciasComponent.referenciasFrom.get('Oficina')?.setValue(element.IdOficina);
          this.referenciasComponent.referenciasFrom.get('Producto')?.setValue(element.Producto);

          this.referenciasComponent.itemsReferencias.push(this.referenciasComponent.referenciasFrom.value);
          this.referenciasComponent.referenciasFrom?.reset();
          }
      });
    });
  }

  CargarDataFormularioEntrevista(data : any, trata : any, debito : any) {
    data.forEach((elementEntr : any) => {
      if ( elementEntr.NumeroPregunta === 6 || elementEntr.NumeroPregunta === 14
        || elementEntr.NumeroPregunta === 17 || elementEntr.NumeroPregunta === 28) {
        if (elementEntr.Respuesta === 'true') {
          this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'Si')?.setValue(true);
          this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'No')?.setValue(false);
        } else {
          this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'Si')?.setValue(false);
          this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'No')?.setValue(true);
        }
      }
      if (elementEntr.NumeroPregunta === 8
        || elementEntr.NumeroPregunta === 9 || elementEntr.NumeroPregunta === 10) {
        if (elementEntr.Respuesta === 'true') {
          this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'Si')?.setValue(true);
        } else {
          this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'Si')?.setValue(false);
        }
        
      }
    
      if (elementEntr.NumeroPregunta === 7 
        || elementEntr.NumeroPregunta === 11 || elementEntr.NumeroPregunta === 13
        || elementEntr.NumeroPregunta === 24 || elementEntr.NumeroPregunta === 29) {
        this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'Si')?.setValue(elementEntr.Respuesta);
      }

      if (elementEntr.NumeroPregunta === 12 || elementEntr.NumeroPregunta === 15 ||
        elementEntr.NumeroPregunta === 18) {
        this.entrevistaComponent.dataPais.forEach((elementPais : any) => {
          if (elementPais.IdPais === +elementEntr.Respuesta) {
            this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'Si')?.setValue(elementPais.IdPais);
          }
        });
      }
      if (elementEntr.NumeroPregunta === 25 || elementEntr.NumeroPregunta === 19 ||
          elementEntr.NumeroPregunta === 16) {
        this.entrevistaComponent.dataDivisas.forEach((elementDivsa : any) => {
          if (elementDivsa.Id === +elementEntr.Respuesta) {
            this.entrevistaComponent.entrevistaForm.get('RPregunta' + elementEntr.NumeroPregunta + 'Si')?.setValue(elementDivsa);
          }
        });
      }
      this.entrevistaComponent.entrevistaForm.get('IdEntrevista')?.setValue(elementEntr.IdEntrevista);
      this.entrevistaComponent.entrevistaForm.get('IdTercero')?.setValue(elementEntr.IdTercero);
    });
    if(trata !== null && trata !== undefined) {
      this.entrevistaComponent.tratamientoForm.get('checkTratamiento')?.setValue(trata.Acepto);
    }
    this.entrevistaComponent.tratamientoForm.get('checkDebitoAutomatico')?.setValue(debito.DebitoAutomatico);
    this.juridicosFrom.get('operacion')?.reset();
  }

  CargarDataTratamientoDatos(data : any) {
    // if (data.Acepto) {
    //   this.entrevistaComponent.MostrarFechaTratamiento = true;
    // } else {
    //   this.entrevistaComponent.MostrarFechaTratamiento = false;
    // }
    this.entrevistaComponent.tratamientoForm.get('checkTratamiento')?.setValue(data.Acepto);
    this.entrevistaComponent.tratamientoForm.get('fechaTrataManual')?.setValue(
      formatDate(data.FechaAceptacion, 'yyyy-MM-dd HH:mm:ss', 'en')); 
    this.loading = false;
  }

  SeleccionarOficina() {
    const jurudicoSeleccion = +this.infoJuridicoComponent.infoJuridicoFrom.get('Relacion')?.value;
    const oficinaSeleccion = this.juridicosFrom.get('oficina')?.value;
    if (jurudicoSeleccion === 5) {
      if (oficinaSeleccion.IdLista === 89) {
        this.notif.onWarning('Advertencia', 'No se puede realizar el cambio de oficina a administración.');
        this.juridicosFrom.get('oficina')?.reset();
      } else {
        this.infoJuridicoComponent.OficinaChanged = this.juridicosFrom.get('oficina')?.value;
      }
    } else {
      this.infoJuridicoComponent.OficinaChanged = this.juridicosFrom.get('oficina')?.value;
    }
   
   
  }

  valirdarPlazo() {
    const plazo = this.serviciosFrom.get('plazoDeseado')?.value;
    if (+plazo > 180) {
      this.serviciosFrom.get('plazoDeseado')?.reset();
    }
  }
  value : any;
  validarCaracteresEspecialesDestino() {
    const patt = new RegExp('/^[ 0-9áéíóúüñ]*$/');
    const pattReplace = new RegExp('[^ 0-9áéíóúüñ]+');
    let self = this;
    $('#destinoServicio').on('input', function (e : any) {
      if (!patt.test(self.value)) {
        self.value = self.value.replace(pattReplace, '');
      }
    });
  }

  AbrirImpresionJuridicos() {
    // this.CargarServicios = 1;
    const esVinculacion = this.serviciosFrom.get('esVinculacion')?.value;
    this.EnvioDataImpresion();
    // aqui valiar si los campos vienen llenos es para credito

    if (esVinculacion) {
      this.GuardarLog('Imprimir afiliación - Asociado Juridico - ' + + this.documentoConsultar, 3, 0, this.JuridicoSeleccionado,12);
      
      } else {
       this.GuardarLog('Imprimir afiliación - Asociado Juridico - ' + this.documentoConsultar, 3, 0, this.JuridicoSeleccionado,12);
      }
 
    if ((this.serviciosFrom.value.montoSolicitado !== '' && this.serviciosFrom.value.montoSolicitado !== null && 
    this.serviciosFrom.value.montoSolicitado !== undefined) &&
      (this.serviciosFrom.value.plazoDeseado !== '' && this.serviciosFrom.value.plazoDeseado !== null && this.serviciosFrom.value.plazoDeseado !== undefined) &&
      (this.serviciosFrom.value.Destino !== '' && this.serviciosFrom.value.Destino !== null && this.serviciosFrom.value.Destino !== undefined)) {
      this.motrarErrorCredito = false;
       localStorage.setItem('Credito', 'true');

      if (esVinculacion && esVinculacion !== null) {
        localStorage.setItem('Vinculacion', 'true');
        localStorage.setItem('Actualizacion', 'false');
      } else {
        localStorage.setItem('Vinculacion', 'false');
        localStorage.setItem('Actualizacion', 'true');
      }
      localStorage.setItem('DataService', JSON.stringify(this.serviciosFrom.value));
      this.SetDataServicioSolicitado(this.serviciosFrom.value);

      this.AbrirSolicituJuridico.nativeElement.click();
      this.juridicosFrom.get('operacion')?.reset();
      this.BlockServiciosInput = null;
      this.serviciosFrom?.reset();

    } else if ((this.serviciosFrom.value.montoSolicitado === '' || this.serviciosFrom.value.montoSolicitado === null || 
    this.serviciosFrom.value.montoSolicitado === undefined) &&
      (this.serviciosFrom.value.plazoDeseado === '' || this.serviciosFrom.value.plazoDeseado === null || this.serviciosFrom.value.plazoDeseado === undefined) &&
      (this.serviciosFrom.value.Destino === '' || this.serviciosFrom.value.Destino === null || this.serviciosFrom.value.Destino === undefined)) {
      this.motrarErrorCredito = false;
      localStorage.setItem('Credito', 'false');
      if (esVinculacion && esVinculacion !== null) {
        localStorage.setItem('Vinculacion', 'true');
        localStorage.setItem('Actualizacion', 'false');
      } else {
        localStorage.setItem('Vinculacion', 'false');
        localStorage.setItem('Actualizacion', 'true');
      }
      localStorage.setItem('DataService', JSON.stringify(this.serviciosFrom.value));
      this.SetDataServicioSolicitado(this.serviciosFrom.value);

      this.AbrirSolicituJuridico.nativeElement.click();
      this.juridicosFrom.get('operacion')?.reset();
      this.BlockServiciosInput = null;
      this.serviciosFrom?.reset();
    } else {
      this.motrarErrorCredito = true;
    }
  }

  EnvioDataImpresion() {
    this.dataSendPrint.ListObjetoSocial = this.infoJuridicoComponent.dataObjetoSocial;
    this.dataSendPrint.ListOficinas = this.dataOficinas;
    this.dataSendPrint.ListPais = this.dataPaisesAll;
    this.dataSendPrint.ListProfesion = this.representanteComponent.dataProfesion;
    this.dataSendPrint.ListDepartamento = this.dataDepartamentosAll;
    this.dataSendPrint.ListCiudad = this.dataCiudadesAll;
    this.dataSendPrint.ListBarrios = this.dataBarriosAll;
    this.dataSendPrint.ListCategorias = this.financieraComponent.dataCategoria;
    this.dataSendPrint.ListConceptos = this.financieraComponent.dataConceptos;
    this.dataSendPrint.ListTipoDocumento = this.representanteComponent.dataTipoDocumento;
    this.dataSendPrint.ListRelaciones = this.infoJuridicoComponent.dataRelacion;
    this.dataSendPrint.ListTipoLocal = [{ 'id': 1, 'value': 'Propio' }, { 'id': 2, 'value': 'Arrendado' }];
    this.dataSendPrint.ListTipoSociedad = this.infoJuridicoComponent.dataTiposociedad;
    this.dataSendPrint.ListConocioCoogra = this.infoJuridicoComponent.metodosConocio;
    this.dataSendPrint.ListVias = this.contactoComponet.dataVias;
    this.dataSendPrint.ListLetras = this.contactoComponet.dataLetras;
    this.dataSendPrint.ListInmuebles = this.contactoComponet.dataImuebles;
    this.dataSendPrint.ListTipoContato = this.contactoComponet.dataContacto;
    this.dataSendPrint.ListMoneda = this.entrevistaComponent.dataDivisas;
    this.dataSendPrint.ListTipoReferencias = this.referenciasComponent.dataReferencias;
    this.dataSendPrint.ListCargos = this.representanteComponent.dataCargos;
    this.dataSendPrint.ListCIIU = this.infoJuridicoComponent.dataListCiiu;
  }

  LimpiarDataImpresion() {
    this.dataSendPrint.ListObjetoSocial = this.infoJuridicoComponent.dataObjetoSocial;
    this.dataSendPrint.ListOficinas = this.dataOficinas;
    this.dataSendPrint.ListPais = this.dataPaisesAll;
    this.dataSendPrint.ListProfesion = this.representanteComponent.dataProfesion;
    this.dataSendPrint.ListDepartamento = this.dataDepartamentosAll;
    this.dataSendPrint.ListCiudad = this.dataCiudadesAll;
    this.dataSendPrint.ListBarrios = this.dataBarriosAll;
    this.dataSendPrint.ListCategorias = this.financieraComponent.dataCategoria;
    this.dataSendPrint.ListConceptos = this.financieraComponent.dataConceptos;
    this.dataSendPrint.ListTipoDocumento = this.representanteComponent.dataTipoDocumento;
    this.dataSendPrint.ListRelaciones = this.infoJuridicoComponent.dataRelacion;
    this.dataSendPrint.ListTipoLocal = [{ 'id': 1, 'value': 'Propio' }, { 'id': 2, 'value': 'Arrendado' }];
    this.dataSendPrint.ListTipoSociedad = this.infoJuridicoComponent.dataTiposociedad;
    this.dataSendPrint.ListConocioCoogra = this.infoJuridicoComponent.metodosConocio;
    this.dataSendPrint.ListVias = this.contactoComponet.dataVias;
    this.dataSendPrint.ListLetras = this.contactoComponet.dataLetras;
    this.dataSendPrint.ListInmuebles = this.contactoComponet.dataImuebles;
    this.dataSendPrint.ListTipoContato = this.contactoComponet.dataContacto;
    this.dataSendPrint.ListMoneda = this.entrevistaComponent.dataDivisas;
    this.dataSendPrint.ListTipoReferencias = this.referenciasComponent.dataReferencias;
    this.dataSendPrint.ListCargos = this.representanteComponent.dataCargos;
    this.dataSendPrint.ListCIIU = this.infoJuridicoComponent.dataListCiiu;
  }

  SetDataServicioSolicitado(data : any) {
    this.dataServiceSolicited.Asesor = data.Asesor;
    this.dataServiceSolicited.Destino = data.Destino;
    this.dataServiceSolicited.Oficina = data.Oficina;
    this.dataServiceSolicited.EsVinculacion = data.esVinculacion;
    this.dataServiceSolicited.Monto = data.montoSolicitado;
    this.dataServiceSolicited.Plazo = data.plazoDeseado;
    this.dataServiceSolicited.DocumentoDeudor = data.NumeroDocumento;
    this.dataServiceSolicited.NombreDeudor = data.NombreDeudor;
    this.dataServiceSolicited.TipoDoc = data.TipoDocumento;
  }

  AbrirCorrespondenciaImpresion() {
    
    // aqui tengo que guardar la correspondencia y abrir el modal de servicios
    let data = localStorage.getItem('Data')
    const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
    const operacion = +this.juridicosFrom.get('operacion')?.value;
    // const tercero = localStorage.getItem('TerceroNatura');
   
      if (operacion === 1) {
        if (this.Correspondenciasform.value.SeleccionCorrespondencia !== null &&
          this.Correspondenciasform.value.SeleccionCorrespondencia !== undefined &&
          this.Correspondenciasform.value.SeleccionCorrespondencia !== "") {
          this.mostrarErrorCorrespondencia = false;
          this.CerrarCorrespondencia.nativeElement.click();
          console.log('datos a guardar en contacto - ' + this.Correspondenciasform.value);
          this.juridicosService.EditarCorrespondecia(this.JuridicoSeleccionado,
            this.Correspondenciasform.value.SeleccionCorrespondencia).subscribe(
              result => {
                this.Correspondenciasform?.reset();
              });
        } else {
          this.mostrarErrorCorrespondencia = true;
        }
      } else {
        if (this.Correspondenciasform.value.SeleccionCorrespondencia !== null &&
          this.Correspondenciasform.value.SeleccionCorrespondencia !== undefined &&
           this.Correspondenciasform.value.SeleccionCorrespondencia !== "") {
          this.mostrarErrorCorrespondencia = false;
          this.CerrarCorrespondencia.nativeElement.click();
          const corresSelecion = this.Correspondenciasform.get('SeleccionCorrespondencia')?.value;
          console.log('datos a guardar en contacto - ' + this.Correspondenciasform.value);
          this.juridicosService.EditarCorrespondecia(this.JuridicoSeleccionado, corresSelecion).subscribe(
            result => {
              this.Correspondenciasform?.reset();
              this.mostrarBotonesCambiar = false;
              this.mostrarBotonesSiguiente = false;
              this.mostrarBotonesAgregar = false;
              this.mostrarBotonesActualizar = false;
              this.mostrarBotonesLimpiar = false;
              this.mostrarBotonesLimpiarInfo = false;
              this.infoJuridicoComponent.bloquearAsesor = true;
              this.infoJuridicoComponent.bloquearAsesorExt = true;
              this.infoJuridicoComponent.disableAsesorPpal = true;
              this.infoJuridicoComponent.disableAsesorExt = true;
              this.infoJuridicoComponent.bloquearRazonSocial = true;
              this.infoJuridicoComponent.bloquearNit = true;
              this.infoJuridicoComponent.bloquearRelacion = true;
              this.infoJuridicoComponent.bloqDeparta = true;
              this.infoJuridicoComponent.bloqCiudad = true;
              this.mostrarBotonesMarcarDesmarcar = false;
              this.entrevistaComponent.MostrarFechaTratamiento = false;
              this.juridicosFrom.get('operacion')?.reset();
              this.BloquearFormulariosNoLimpia();
              this.SiguienteTab(1);
              this.BloquearCamposFormularios();
              this.BloquearCamposInfoJuridico();
              this.consultarJuridicosNit(this.nitJuridicoGuardado);
              this.serviciosFrom.get('esVinculacion')?.setValue(true);
              this.BlockVincula = true;
              // abrir el modal de servicio solicitado
              this.serviciosFrom.get('Oficina')?.setValue(resultPerfil.Oficina);
              this.serviciosFrom.get('Asesor')?.setValue(resultPerfil.Nombre);
              this.AbrirModalServicios.nativeElement.click();
            });
        } else {
          this.mostrarErrorCorrespondencia = true;
        }
      }
    
  }

  ValidarCorrespondencia() {
    this.mostrarErrorCorrespondencia = false;
    if (+this.Correspondenciasform.value.SeleccionCorrespondencia === 0) {
      this.mostrarErrorCorrespondencia = true;
      this.notif.onWarning('Advertencia', 'Debe seleccionar una opción valida.');
      this.Correspondenciasform.get('SeleccionCorrespondencia')?.reset()
    } 
  }

  consultarDeudor(documento : string) {
    if (documento === '' || documento === null || documento === undefined) {
      this.BlockServiciosInput = null;
      this.serviciosFrom.get('NumeroDocumento')?.reset();
      this.serviciosFrom.get('NombreDeudor')?.reset();
    } else {
      if (this.infoJuridicoComponent.infoJuridicoFrom.get('Nit')?.value !== documento) {
        this.motrarErrorDeudor = false;
        this.BlockServiciosInput = true;
        this.clientesService.GetPersonsXDocument(documento).subscribe(
          result => {
            if (result !== null) {
              if (result.PrimerNombre === null || result.PrimerNombre === undefined) {
                result.PrimerNombre = '';
              }
              if (result.SegundoNombre === null || result.SegundoNombre === undefined) {
                result.SegundoNombre = '';
              }
              if (result.PrimerApellido === null || result.PrimerApellido === undefined) {
                result.PrimerApellido = '';
              }
              if (result.SegundoApellido === null || result.SegundoApellido === undefined) {
                result.SegundoApellido = '';
              }
              this.serviciosFrom.get('NombreDeudor')?.setValue(
                result.PrimerNombre + ' ' + result.SegundoNombre + ' ' +
                result.PrimerApellido + ' ' + result.SegundoApellido);
              this.serviciosFrom.get('TipoDocumento')?.setValue(result.IdTipoDocumento);
            } else {
              this.serviciosFrom.get('NombreDeudor')?.reset();
              this.serviciosFrom.get('NumeroDocumento')?.reset();
            }
          }, error => {
            console.error('Error consultar deudor - ' + error);
          });
      } else {
        this.motrarErrorDeudor = true;
        this.serviciosFrom.get('NumeroDocumento')?.reset();
        this.serviciosFrom.get('NombreDeudor')?.reset();
      }
    }
  }

  bloquearServicios(documento : string) {
    this.motrarErrorDeudor = false;
    if (documento === null || documento === undefined) {
      this.BlockServiciosInput = null;
    } else {
      this.BlockServiciosInput = null;
    }
  }

  bloquearDeudor() {
    const monto = this.serviciosFrom.get('montoSolicitado')?.value;
    const plazo = this.serviciosFrom.get('plazoDeseado')?.value;
    const destino = this.serviciosFrom.get('Destino')?.value ;

    if ((monto === '' || monto === null || monto === undefined) && (plazo === '' || plazo === null || plazo === undefined)
      && (destino === '' || destino === null || destino === undefined)) {
      this.BlockDeudor = null;
      this.BlockServiciosInput = null;
    } else {
      this.BlockDeudor = null;
      this.BlockServiciosInput = null;
    }
  }

  //#endregion

  //#region Inicializaciones formulario
  validateJuridicos() {
    const operacion = new FormControl('', [Validators.required]);
    const buscar = new FormControl('', []);
    const nombre = new FormControl('', []);
    const oficina = new FormControl('', []);

    this.juridicosFrom = new FormGroup({
      operacion: operacion,
      buscar: buscar,
      nombre: nombre,
      oficina: oficina
    });
  }

  validateServicios() {
    const servicioSolicitado = new FormControl('', []);
    const montoSolicitado = new FormControl('', [Validators.pattern('^[0-9]*')]);
    const plazoDeseado = new FormControl('', [Validators.pattern('^[0-9]*')]);
    const Destino = new FormControl('', []);
    const Oficina = new FormControl('', []);
    const Asesor = new FormControl('', []);
    const EsAsociado = new FormControl('', []);
    const NombreDudor = new FormControl('', []);
    const tipoIdentificacion = new FormControl('', []);
    const DocumentoDeudor = new FormControl('', []);
    const operacionSeleccionada = new FormControl('', []);
    const esVinculacion = new FormControl('', []);
    const NumeroDocumento = new FormControl('', [Validators.pattern('^[0-9]*')]);
    const NombreDeudor = new FormControl('', []);
    const TipoDocumento = new FormControl('', []);

    this.serviciosFrom = new FormGroup({
      servicioSolicitado: servicioSolicitado,
      montoSolicitado: montoSolicitado,
      plazoDeseado: plazoDeseado,
      Destino: Destino,
      Oficina: Oficina,
      Asesor: Asesor,
      EsAsociado: EsAsociado,
      NombreDudor: NombreDudor,
      tipoIdentificacion: tipoIdentificacion,
      DocumentoDeudor: DocumentoDeudor,
      operacionSeleccionada: operacionSeleccionada,
      esVinculacion: esVinculacion,
      NumeroDocumento: NumeroDocumento,
      NombreDeudor: NombreDeudor,
      TipoDocumento: TipoDocumento
    });
  }

  validateSolicitudRetiro() {
     const idMotivo = new FormControl('', []);
    const ObservacionMotivo = new FormControl('', []);

    this.solicitudRetiroForm = new FormGroup({
      idMotivo: idMotivo,
      ObservacionMotivo: ObservacionMotivo
    });
  }

  ValidateCorrespondencia() {
    const SeleccionCorrespondencia = new FormControl('', []);

    this.Correspondenciasform = new FormGroup({
      SeleccionCorrespondencia: SeleccionCorrespondencia
    });
  }

  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        // console.log(new Date, result);
      }
    );
  }

  private EliminarValidadoresDepaCiu() {
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Departamento'].setErrors(null);
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Departamento'].clearValidators();
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Departamento'].setValidators(null);

    this.infoJuridicoComponent.infoJuridicoFrom.controls['Ciudad'].setErrors(null);
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Ciudad'].clearValidators();
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Ciudad'].setValidators(null);
  }

  private AgregarValidadoresDepaCiu() {
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Departamento'].setValidators([Validators.required]);
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Departamento'].setErrors({ 'incorrect': true });
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Departamento'].updateValueAndValidity();

    this.infoJuridicoComponent.infoJuridicoFrom.controls['Ciudad'].setValidators([Validators.required]);
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Ciudad'].setErrors({ 'incorrect': true });
    this.infoJuridicoComponent.infoJuridicoFrom.controls['Ciudad'].updateValueAndValidity();
  }
  
  DestinoCapitalice() {
    let self = this;
    $('#destinoModal').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  //#endregion
}
