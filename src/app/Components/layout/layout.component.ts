import { Component, OnInit, ViewChild,OnDestroy, ElementRef } from '@angular/core';
import { LoginService } from '../../Services/Login/login.service';
import { NavigationEnd, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { PassEncriptJs } from '../../../app/Models/Generales/PasswordEncript.model';
import { UserIdleService } from 'angular-user-idle';
import { OperacionesService } from '../../../app/Services/Maestros/operaciones.service';
import { UsuariosService } from '../../../app/Services/Maestros/usuarios.service';
import { WebSocketService } from '../../../app/Services/WebSocket/web-socket.service';
import { GeneralesService } from '../../../app/Services/Productos/generales.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { detectIncognito } from 'detectincognitojs';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
declare var $: any;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [DatePipe, LoginService, OperacionesService, UsuariosService, WebSocketService, GeneralesService,Idle],
  standalone: false
})
export class LayoutComponent implements OnInit,OnDestroy {

  //#region Declaracion variables
 public isModalOpen: boolean = false;


  private PassJs = new PassEncriptJs();
  public resulStore: any = null;
  public isLoginError = false;
  public DataUser: any;
  public nameUser: string = "";
  public NombreOficinaActual: string = "";
  public rutaActual: string = "";
  public NombrePaginaActual: string = "";
  public rutaPaginaActual: string = "";
  public FechaActual: any;

  /* Usuarios */
  public GestionesOperaciones = false;
  /* Fin Usuarios */

  /* Configuracion */
  public Configuracion = false;

  //#region Variables Layout
  /* Maestros */
  public Maestros = false;
  public Areas = false;
  public Cargos = false;
  public Oficinas = false;
  public Perfiles = false;
  public UsuariosTipos = false;
  public Modulos = false;
  public Permisos = false;
  public Usuarios = false;
  public GestionEmail = false;
  public ConfiguracionInformes = false;
  public UsuarioProveedores = false;
  public OperacionesPerfiles = false;
  public OperacionesEstado = false;
  public OperacionesModulos = false;
  public PermisosEspeciales = false;
  public ObservacionesModulos = false;
  public GestionBanner = false;
  public Llaves = false;
  /* Fin Maestros */

  /* Maestros productos */
  public MaestrosProdutos = false;
  public MaestrosAhorros = false;
  public ConsecutivoTitulo = false;
  /* Fin Maestros productos */

  /* Informes */
  public InformesConsecutivoTitulo = false;
  public InformesMaestros = false;
  public InformesMaestrosAhorros = false;

  /* Fin Informes */


  /* Transmision de archivos */
  public Transmisionarchivos = false;

  /* Transmision de archivos */
  public Generacionarchivos = false;

  /* Fin Maestros productos */

  /* Fin Configuracion */


  /* Clientes */
  public Clientes = false;
  public Naturales = false;
  public Juridicos = false;
  public Terceros = false;
  public Privilegiados = false;
  public Vetados = false;
  /* Fin Clientes */

  /* Productos */
  public Productos = false;
  public Aportes = false;
  public Ahorros = false;
  public SimuladorAhorro = false;
  public Termino = false;
  public TerminoInterno = false;
  public AsesoriaTermino = false;
  public Contractuales = false;
  public ContractualesInterno = false;
  public AsesoriaContractual = false;
  public Disponibles = false;
  public DisponiblesInterno = false;
  public TarjetaHabientes = false;
  public Gmf = false;
  public CuentasCorriente = false;
  public Creditos = false;
  public SimuladorCredito = false;
  public Score = false;
  public Datacredito = false;
  public FichaAnalisis = false;
  public Seguros = false;
  public Generales = false;
  public Cancelacion = false;
  /*Fin Productos */

  /*  Transacciones Financieras */
  public transaccionesC = false;
  public transaccionesCaja = false;
  public imprimirTransacciones = false;
  public transaccionesFinancieras = false;
  public transaccionesFinancierasInterno = false;
  /* Fin Transacciones Financieras */

  /* Cartera */
  public Cartera = false;
  public GestionCredito = false;
  /* Fin cartera */

  /* Informes */
  public Informes = false;
  public InformesInterno = false;
  public ConciliacionComisiones = false;
  public DebitosAutomaticos = false;
  public GestionOperaciones = false;
  public estadisticos = false;
  public transacciones = false;
  public canalesExternos = false;
  public composicionPortafolio = false;
  public evolucionOficina = false;
  public IndicadoresGerenciales = false;
  public ListaProductos = false;
  public InformeClientes = false;
  public InformeAhorros = false;
  public LogAuditoria = false;
  /* Fin informes */

  /* utilidades */
  public Utilidades = false;
  public CrearNotificaciones = false;
  public DiferenciasSaldos = false;
  /* Fin utilidades */

  /* auditorias */
  public Auditorias = false;
  public AuditoriaScore = false;
  public AuditoriasGmf = false;
  public AuditoriaDatacredito = false;
  /* Fin auditorias */

  /* ***** */

  /* Usuarios */
  public GestionesOperacionesModel: any;
  /* Fin Usuarios */

  /* Configuracion */
  public ConfiguracionModel: any;

  /* Maestros */
  public MaestrosModel: any;
  public AreasModel: any;
  public CargosModel: any;
  public OficinasModel: any;
  public PerfilesModel: any;
  public UsuariosTiposModel: any;
  public ModulosModel: any;
  public PermisosModel: any;
  public UsuariosModel: any;
  public GestionEmailModel: any;
  public ConfiguracionInformesModel: any;
  public OperacionesModulosModel: any;
  public OperacionesPerfilesModel: any;
  public OperacionesEstadoModel: any;
  public ObservacionesModulosModel: any;
  public PermisosEspecialesModel: any;
  public GestionBannerModel: any;
  public LlavesModel: any;
  public UsuariosProveedoresModel: any;
  /* Fin Maestros */

  /* Maestros productos */
  public MaestrosProductosModel: any;
  public MaestrosAhorrosModel: any;
  public ConsecutivoTituloModel: any;
  /* Fin Maestros productos */

  /* Informes */
  public InformeConsecutivoTituloModel: any;
  public InformesMaestrosModel: any;
  public InformesMaestrosAhorrosModel: any;
  /* Fin Informes */

  /* Fin Configuracion */

  /* Clientes */
  public ClientesModel: any;
  public NaturalesModel: any;
  public JuridicosModel: any;
  public TercerosModel: any;
  public PrivilegiadosModel: any;
  public VetadosModel: any;
  /* Fin Clientes */

  /* Productos */
  public ProductosModel: any;
  public AportesModel: any;
  public AhorrosModel: any;
  public SimuladorAhorroModel: any;
  public TerminoModel: any;
  public TerminoInternoModel: any;
  public AsesoriaTerminoModel: any;
  public ContractualesModel: any;
  public ContractualesInternoModel: any;
  public AsesoriaContractualModel: any;
  public DisponiblesModel: any;
  public DisponiblesInternoModel: any;
  public TarjetaHabientesModel: any;
  public GmfModel: any;
  public CuentasCorrienteModel: any;
  public CreditosModel: any;
  public SimuladorCreditoModel: any;
  public ScoreModel: any;
  public DatacreditoModel: any;
  public FichaAnalisisModel: any;
  public SegurosModel: any;
  public GeneralesModel: any;
  public CancelacionModel: any;
  /*Fin Productos */

  /*  Transacciones Financieras */
  public TransaccionesFinancierasModel: any;
  public TransaccionesFinancierasInternoModel: any;
  public TransaccionesCModel: any;
  public TransaccionesCajaModel: any;
  public ImprimirTransaccionesModel: any;
  /* Fin Transacciones Financieras */

  /* Cartera */
  public CarteraModel: any;
  public GestionCreditoModel: any;
  /* Fin cartera */

  /* Informes */
  public InformesModel: any;
  public InformesInternoModel: any;
  public ConciliacionComisionesModel: any;
  public DebitosAutomaticosModel: any;
  public GestionOperacionesModel: any;
  public TransaccionesModel: any;
  public CanalesExternosModel: any;
  public ComposisionPortafolioModel: any;
  public EvolucionOficinaModel: any;
  public IndicadoresGerencialesModel: any;
  public ListaMisProductosModel: any;
  public InformeClientesModel: any;
  public InformeAhorrosModel: any;
  public LogAuditoriaModel: any;
  /* Fin informes */

  /* utilidades */
  public UtilidadesModel: any;
  public CrearNotificacionesModel: any;
  public DiferenciasSaldosModel: any;
  /* Fin utilidades */

  /* auditorias */
  public AuditoriasModel: any;
  public AuditoriaScoreModel: any;
  public AuditoriaDatacreditoModel: any;
  public AuditoriasGmfModel: any;
  public ocultarListaDirecciones: boolean = false;
  /* Fin auditorias */
  //#endregion

  public mouseStop = null;
  public Time = 1800000; // 1 minuto = 60.000 // dos minutos
  public volverBanner = true;
  public solounaVes = 0;
  public IDLE_TIMEOUT = 60; // seconds
  public _idleSecondsCounter = 0;
  conutStatus: number = 0;
  oficinaSeleccionada: any = { Descripcion: "", IdLista: 0 };
  isChangeOfice: boolean = false;
  resultOficina: any = [];

  @ViewChild('btnModalBanner', { static: true }) private AbrirModalBanner: ElementRef | null = null;
  @ViewChild('btnModelaBannerCloset', { static: true }) private CerrarModalBanner: ElementRef | null = null;


  //#endregion
  permismosUsuario: any;
  consultarImg: boolean = false;

  constructor(private loginService: LoginService, private router: Router, private notif: AlertService,
    public datepipe: DatePipe, private userIdle: UserIdleService,private idle : Idle,
    private operacionesService: OperacionesService, private usuariosServices: UsuariosService, private webSocket: WebSocketService, private serviceGenerales: GeneralesService) {
  }
  ip: string = "";
  fechaUltimoIngreso: string = "";
  restart() {
    this.userIdle.resetTimer();
  }
  boolBannner: boolean = false;
  isUsuarioMenuOpen: boolean = false;
  isConfiguracionMenuOpen: boolean = false;
  isMaestroMenuOpen: boolean = false;
  isMaestroProductosMenuOpen: boolean = false;
  isMaestroAhorrosMenuOpen: boolean = false;
  isInformesMenuOpen: boolean = false;
  isInformesMaestroAhorrosMenuOpen: boolean = false;
  istransmisionarchivosMenuOpen: boolean = false;
  isgeneracionarchivosMenuOpen: boolean = false;
  isClientesMenuOpen: boolean = false;
  isProductosMenuOpen: boolean = false;
  isProductosAhorrosMenuOpen: boolean = false;
  isProductosAhorrosContractualMenuOpen: boolean = false;
  isProductosAhorrosDisponiblesMenuOpen: boolean = false;
  isProductosAhorrosTerminoMenuOpen: boolean = false;
  isProductosCreditoMenuOpen : boolean = false;
  isProductosCarteraMenuOpen : boolean = false;
  isProductosSeguroMenuOpen : boolean = false;
  isInformeMenuOpen : boolean = false;
  isInformeEstadisticosMenuOpen : boolean = false;
  isUtilidadesOpen : boolean = false;
  isAuditoriaOpen : boolean = false;
  isTransaccionesMenuOpen : boolean = false;
  // Método para alternar el estado del menú de Usuario
  toggleUsuarioMenu() {
    this.isUsuarioMenuOpen = !this.isUsuarioMenuOpen;
    this.toggleCloseMenu(1);
  }
  toggleConfiguracionMenu() {
    if (!this.isConfiguracionMenuOpen) {
      this.isMaestroMenuOpen = false;
      this.isMaestroProductosMenuOpen = false;
    }
    this.isConfiguracionMenuOpen = !this.isConfiguracionMenuOpen;
    this.toggleCloseMenu(2);
  }
  toggleMaestroMenu() {
    if (!this.isMaestroMenuOpen) {
      this.isMaestroAhorrosMenuOpen = false;
      this.isMaestroProductosMenuOpen = false;
    }
    this.isMaestroMenuOpen = !this.isMaestroMenuOpen;
    this.toggleCloseMenu(2, 1);
  }
  toggleMaestroProductosMenu() {
    if (!this.isMaestroProductosMenuOpen)
      this.isMaestroAhorrosMenuOpen = false;
    this.isMaestroProductosMenuOpen = !this.isMaestroProductosMenuOpen;
    this.toggleCloseMenu(2, 2);
  }
  toggleMaestroAhorrosMenu() {
    this.isMaestroAhorrosMenuOpen = !this.isMaestroAhorrosMenuOpen;
  }
  toggleInformesMenu() {
    if (!this.isInformesMenuOpen)
      this.isInformesMaestroAhorrosMenuOpen = false;
    this.isInformesMenuOpen = !this.isInformesMenuOpen;
    this.toggleCloseMenu(2, 3);
  }
  toggleInformesMaestroAhorrosMenu() {
    this.isInformesMaestroAhorrosMenuOpen = !this.isInformesMaestroAhorrosMenuOpen;
  }
  toggletransmisionarchivosMenu() {
    this.istransmisionarchivosMenuOpen = !this.istransmisionarchivosMenuOpen;
  }
  togglegeneracionarchivosMenu() {
    this.isgeneracionarchivosMenuOpen = !this.isgeneracionarchivosMenuOpen;
  }
  toggleClientesMenu() {
    this.isClientesMenuOpen = !this.isClientesMenuOpen;
    this.toggleCloseMenu(3);
  }
  toggleProductosMenu() {
    this.isProductosMenuOpen = !this.isProductosMenuOpen;
    this.toggleCloseMenu(4);
  }
  toggleTransaccionesMenu(){
    this.isTransaccionesMenuOpen = !this.isTransaccionesMenuOpen;
    this.toggleCloseMenu(4); //Duda
  }
  toggleProductosAhorrosMenu() {
    this.isProductosAhorrosMenuOpen = !this.isProductosAhorrosMenuOpen;
    this.toggleCloseMenu(4, 1);
  }
  toggleProductosAhorroContractualMenu() {
    this.isProductosAhorrosContractualMenuOpen = !this.isProductosAhorrosContractualMenuOpen;
    this.toggleCloseMenu(4, 2);
  }
  toggleProductosAhorrosDisponiblesMenu() {
    this.isProductosAhorrosDisponiblesMenuOpen = !this.isProductosAhorrosDisponiblesMenuOpen;
    this.toggleCloseMenu(4, 3);
  }
  toggleProductosAhorrosTerminoMenu() {
    this.isProductosAhorrosTerminoMenuOpen = !this.isProductosAhorrosTerminoMenuOpen;
    this.toggleCloseMenu(4, 4);
  }
  toggleProductosCreditoMenu(){
    this.isProductosCreditoMenuOpen = !this.isProductosCreditoMenuOpen;
    this.toggleCloseMenu(4,5);
  }
  toggleProductosCarteraMenu(){
    this.isProductosCarteraMenuOpen = !this.isProductosCarteraMenuOpen;
    this.toggleCloseMenu(4,5);
  }
  toggleProductosSeguroMenu(){
    this.isProductosSeguroMenuOpen = !this.isProductosSeguroMenuOpen;
    this.toggleCloseMenu(4,6);
  }
  toggleInformeMenu(){
    this.isInformeMenuOpen = !this.isInformeMenuOpen;
    this.toggleCloseMenu(5);
  }
  toggleInformeEstadisticosMenu(){
    this.isInformeEstadisticosMenuOpen = !this.isInformeEstadisticosMenuOpen;
  }
  toggleUtilidadesMenu(){
    this.isUtilidadesOpen = !this.isUtilidadesOpen;
    this.toggleCloseMenu(6);
  }
  toggleAuditoriaMenu(){
    this.isAuditoriaOpen = !this.isAuditoriaOpen;
    this.toggleCloseMenu(7);
  }
  toggleCloseMenu(id : number, opcion : number = 0) {
    if(id != 1)this.isUsuarioMenuOpen = false;
    if(id != 2)this.isConfiguracionMenuOpen = false;
    if(id == 2 && opcion == 1){
      this.isMaestroProductosMenuOpen = false;
      this.isInformesMenuOpen = false;
    } else if (id == 2 && opcion == 2) {
      this.isMaestroMenuOpen = false;
      this.isInformesMenuOpen = false;
    } else if (id == 2 && opcion == 3) {
      this.isMaestroMenuOpen = false;
      this.isMaestroProductosMenuOpen = false;
    }
    if (id != 3) this.isClientesMenuOpen = false;
    if (id != 4) {
      this.isProductosMenuOpen = false;
      this.isProductosAhorrosMenuOpen = false;
      this.isProductosAhorrosTerminoMenuOpen = false;
      this.isProductosAhorrosDisponiblesMenuOpen = false;
      this.isProductosAhorrosContractualMenuOpen = false;
    }
    if(id == 4 && opcion == 1){
      this.isProductosSeguroMenuOpen = false;
      this.isProductosCreditoMenuOpen = false;
      this.isProductosAhorrosContractualMenuOpen = false;
      this.isProductosAhorrosDisponiblesMenuOpen = false;
    } else if (id == 4 && opcion == 2) {
      this.isProductosAhorrosDisponiblesMenuOpen = false;
      this.isProductosAhorrosTerminoMenuOpen = false;
    } else if(id == 4 && opcion == 3) {
      this.isProductosAhorrosTerminoMenuOpen = false;
      this.isProductosAhorrosContractualMenuOpen = false;
    } else if(id == 4 && opcion == 4){
      this.isProductosAhorrosContractualMenuOpen = false;
      this.isProductosAhorrosDisponiblesMenuOpen = false;
    }else if(id == 4 && opcion == 5){
      this.isProductosAhorrosMenuOpen = false;
      this.isProductosSeguroMenuOpen = false;
    }else if(id == 4 && opcion == 5){
      this.isProductosAhorrosMenuOpen = false;
      this.isProductosCreditoMenuOpen = false;
    }
    if(id != 5){
      this.isInformeMenuOpen = false;
      this.isInformeEstadisticosMenuOpen = false;
    }
    if(id != 6)
      this.isUtilidadesOpen = false;
    if(id != 7)
      this.isAuditoriaOpen = false;
  }
  public timeout() {
    let datauser: string | null = localStorage.getItem('Data');
    if (datauser == null)
      return;
    
    this.DataUser = JSON.parse(window.atob(datauser));
    this.loginService.CerrarSesionUser(this.DataUser.IdUsuario).subscribe(result => { 
      this.webSocket.Send("ClosedSesion",this.DataUser.IdUsuario);
      Swal.fire({
        title: 'Advertencia',
        text: '',
        html: 'Su session ha caducado ',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Aceptar',       
        confirmButtonColor: 'rgb(13,165,80)',
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((result) => {
        localStorage.clear();
        if (result.value) {
          $("#popupBusquedaParroquia").modal('hide');//ocultamos el modal
          $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          $('.modal-backdrop').remove();//eliminamos el backdrop del modal
          window.location.reload();
          this.router.navigate(['Login']);
        }
    });
      
    },error => {
      console.log(error);
      this.notif.onDanger('Error', error);
    });
  }
  ngOnInit() {

    this.consultarImg = true;

    this.idle.setIdle((60 * 120));  // Tiempo de inactividad antes de activar el timeout
    this.idle.setTimeout(10);  // Tiempo de espera después del idle antes de hacer algo (ej. logout)
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);  // Configura las interrupciones (click, teclado, etc.)
    this.idle.onIdleEnd.subscribe(() => {console.log('No longer idle.')});

    this.idle.onIdleStart.subscribe(() => {console.log('You\'ve gone idle!')});

    this.idle.onTimeout.subscribe(() => {
      console.log('Timed out!')
      this.timeout();
    });

    // Comienza el monitoreo de inactividad
    this.idle.watch();
    // Start watching for user inactivity.
    this.userIdle.startWatching();

    // // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(() => {
      this.boolBannner = true;
    });

    // // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      console.log("Show");

      this.AbrirModalBanner?.nativeElement.click();
      this.restart();
      this.boolBannner = false;
    });

    // this.bnIdle.startWatching(60).subscribe((isTimedOut: boolean) => {
    //   this.AbrirModalBanner.nativeElement.click();
    //   this.bnIdle.stopTimer();
    // });

    this.ocultarListaDirecciones = true;
    let data: string | null = localStorage.getItem('Data')
    if (data != null)
      this.resulStore = JSON.parse(window.atob(data));

    data = localStorage.getItem('Data');
    const dataUser = JSON.parse(window.atob(data == null ? "" : data));
    if (dataUser !== '' && dataUser !== null) {
      this.loginService.ObtenerPermisoUsuario(dataUser.IdUsuario).subscribe(
        result => {
          if (result !== null && result !== undefined && result !== '') {
            try {
              const JsonResul = JSON.stringify(result);
              localStorage.setItem('Permisos', CryptoJS.AES.encrypt(JsonResul.trim(), this.PassJs.pass).toString());
            } catch (error) {
              console.error(error);
            }
            let permi: string | null = localStorage.getItem('Permisos')
            const r1 = JSON.parse(CryptoJS.AES.decrypt(permi == null ? "" : permi, this.PassJs.pass).toString(CryptoJS.enc.Utf8));
          }
          result.forEach((element: any) => {
            /* Configuracion */
            if (element.IdModulo === 63) {
              this.Configuracion = true;
              this.ConfiguracionModel = element;
            }
            /* Maestros */
            else if (element.IdModulo === 1) {
              this.Maestros = true;
              this.MaestrosModel = element;
            }
            else if (element.IdModulo === 2) {
              this.Areas = true;
              this.AreasModel = element;
            }
            else if (element.IdModulo === 3) {
              this.Cargos = true;
              this.CargosModel = element;
            }
            else if (element.IdModulo === 4) {
              this.Oficinas = true;
              this.OficinasModel = element;
            }
            else if (element.IdModulo === 5) {
              this.Perfiles = true;
              this.PerfilesModel = element;
            }
            else if (element.IdModulo === 6) {
              this.UsuariosTipos = true;
              this.UsuariosTiposModel = element;
            }
            else if (element.IdModulo === 7) {
              this.Modulos = true;
              this.ModulosModel = element;
            }
            else if (element.IdModulo === 8) {
              this.Permisos = true;
              this.PermisosModel = element;
            }
            else if (element.IdModulo === 48) {
              this.PermisosEspeciales = true;
              this.PermisosEspecialesModel = element;
            }
            else if (element.IdModulo === 9) {
              this.Usuarios = true;
              this.UsuariosModel = element;
            }
            else if (element.IdModulo === 78) {
              this.GestionEmail = true;
              this.GestionEmailModel = element;
            }
            else if (element.IdModulo === 83) {
              this.ConfiguracionInformes = true;
              this.ConfiguracionInformesModel = element;
            }
            else if (element.IdModulo === 71) {
              this.UsuarioProveedores = true;
              this.UsuariosProveedoresModel = element;
            }
            else if (element.IdModulo === 50) {
              this.OperacionesModulos = true;
              this.OperacionesModulosModel = element;
            }
            else if (element.IdModulo === 42) {
              this.OperacionesPerfiles = true;
              this.OperacionesPerfilesModel = element;
            }
            else if (element.IdModulo === 43) {
              this.OperacionesEstado = true;
              this.OperacionesEstadoModel = element;
            }
            else if (element.IdModulo === 53) {
              this.ObservacionesModulos = true;
              this.ObservacionesModulosModel = element;
            }
            else if (element.IdModulo === 68) {
              this.Llaves = true;
              this.LlavesModel = element;
            }
            /* Fin  Maestros */
            /* Maestros productos */
            else if (element.IdModulo === 64) {
              this.MaestrosProdutos = true;
              this.MaestrosProductosModel = element;
            }
            else if (element.IdModulo === 65) {
              this.MaestrosAhorros = true;
              this.MaestrosAhorrosModel = element;
            }
            else if (element.IdModulo === 66) {
              this.ConsecutivoTitulo = true;
              this.ConsecutivoTituloModel = element;
            }
            else if (element.IdModulo === 67) {
              this.GestionBanner = true;
              this.GestionBannerModel = element;
            }
            /* Fin  Maestros productos*/
            /* Informes */
            else if (element.IdModulo === 72) {
              this.InformesConsecutivoTitulo = true;
              this.InformeConsecutivoTituloModel = element;
            }
            else if (element.IdModulo === 73) {
              this.InformesMaestros = true;
              this.InformesMaestrosModel = element;
            }
            else if (element.IdModulo === 74) {
              this.InformesMaestrosAhorros = true;
              this.InformesMaestrosAhorrosModel = element;
            }
            /* Fin  Informes */
            /* Transmisión archivos */
            else if (element.IdModulo === 81) {
              this.Transmisionarchivos = true;
              this.Generacionarchivos = true;
            }
            /* Fin Transmisión archivos */
            /* Transmisión archivos */
            else if (element.IdModulo === 81) {
                this.Generacionarchivos = true;
            }
             /* Fin Transmisión archivos */

            /* Fin  Configuracion */
            /* Clientes */
            else if (element.IdModulo === 10) {
              this.Clientes = true;
              this.ClientesModel = element;
            }
            else if (element.IdModulo === 11) {
              this.Naturales = true;
              this.NaturalesModel = element;
            }
            else if (element.IdModulo === 12) {
              this.Juridicos = true;
              this.JuridicosModel = element;
            }
            // else if (element.IdModulo === 13) {
            //   this.Terceros = true;
            //   this.TercerosModel = element;
            // }
            
            /* Fin Clientes */

            /* Productos */
            else if (element.IdModulo === 37) {
              this.Productos = true;
              this.ProductosModel = element;
            }
            else if (element.IdModulo === 16) {
              this.Aportes = true;
              this.AportesModel = element;
            }
            else if (element.IdModulo === 17) {
              this.Ahorros = true;
              this.AhorrosModel = element;
            }
            else if (element.IdModulo === 18) {
              this.SimuladorAhorro = true;
              this.SimuladorAhorroModel = element;
            }
            else if (element.IdModulo === 61) {
              this.Termino = true;
              this.TerminoModel = element;
            }
            else if (element.IdModulo === 19) {
              this.TerminoInterno = true;
              this.TerminoInternoModel = element;
            }
            else if (element.IdModulo === 59) {
              this.Contractuales = true;
              this.ContractualesModel = element;
            }
            else if (element.IdModulo === 20) {
              this.ContractualesInterno = true;
              this.ContractualesInternoModel = element;
            }
            else if (element.IdModulo === 21) {
              this.Disponibles = true;
              this.DisponiblesModel = element;
            }
            else if (element.IdModulo === 38) {
              this.DisponiblesInterno = true;
              this.DisponiblesInternoModel = element;
            }
            else if (element.IdModulo === 22) {
              this.TarjetaHabientes = true;
              this.TarjetaHabientesModel = element;
            }
            else if (element.IdModulo === 23) {
              this.Gmf = true;
              this.GmfModel = element;
            }
            // else if (element.IdModulo === 24) {
            //   this.CuentasCorriente = true;
            //   this.CuentasCorrienteModel = element;
            // }
            else if (element.IdModulo === 25) {
              this.Creditos = true;
              this.CreditosModel = element;
            }
            else if (element.IdModulo === 26) {
              this.SimuladorCredito = true;
              this.SimuladorCreditoModel = element;
            }
            else if (element.IdModulo === 27) {
              this.Score = true;
              this.ScoreModel = element;
            }
            else if (element.IdModulo === 84) {
              this.Datacredito = true;
              this.DatacreditoModel = element;
            }
            else if (element.IdModulo === 75) {
              this.FichaAnalisis = true;
              this.FichaAnalisisModel = element;
            }
            else if (element.IdModulo === 28) {
              this.Seguros = true;
              this.SegurosModel = element;
            }
            else if (element.IdModulo === 29) {
              this.Generales = true;
              this.GeneralesModel = element;
            }
            else if (element.IdModulo === 30) {
              this.Cancelacion = true;
              this.CancelacionModel = element;
            }
            else if (element.IdModulo === 60) {
              this.AsesoriaContractual = true;
              this.AsesoriaContractualModel = element;
            }
            else if (element.IdModulo === 77) {
              this.AsesoriaTermino = true;
              this.AsesoriaTerminoModel = element;
            }
            /* Fin Productos */

            /*  Transacciones Financieras */
            else if (element.IdModulo === 86) { 
              this.transaccionesC = true;
              this.TransaccionesCModel = element;
            }
            else if (element.IdModulo === 87) { 
              this.transaccionesCaja = true;
              this.TransaccionesCajaModel = element;
            }
            else if (element.IdModulo === 88) {
              this.imprimirTransacciones = true;
              this.ImprimirTransaccionesModel = element;
            }
            else if (element.IdModulo === 31) {
              this.transaccionesFinancieras = true;
              this.TransaccionesFinancierasModel = element;
            }
            else if (element.IdModulo === 31) {
              this.transaccionesFinancierasInterno = true;
              this.TransaccionesFinancierasInternoModel = element;
            }
            /* Fin Transacciones Financieras */

            /* Cartera */
            else if (element.IdModulo === 32) {
              this.Cartera = true;
              this.CarteraModel = element;
            } else if (element.IdModulo === 45) {
              this.GestionCredito = true;
              this.GestionCreditoModel = element;
            }
            /* Fin cartera */

            /* Informes */
            else if (element.IdModulo === 33) {
              this.Informes = true;
              this.InformesModel = element;
            }
            // else if (element.IdModulo === 46) {
            //   this.InformesInterno = true;
            //   this.InformesInternoModel = element;
            // }
            else if (element.IdModulo === 47) {
              this.ConciliacionComisiones = true;
              this.ConciliacionComisionesModel = element;
            } else if (element.IdModulo === 51) {
              this.DebitosAutomaticos = true;
              this.DebitosAutomaticosModel = element;
            } else if (element.IdModulo === 52) {
              this.GestionOperaciones = true;
              this.GestionOperacionesModel = element;
            } else if (element.IdModulo === 54) {
              this.estadisticos = true;
              this.GestionOperaciones = true;
              this.GestionOperacionesModel = element;
            } else if (element.IdModulo === 55) {
              this.transacciones = true;
              this.GestionOperaciones = true;
              this.TransaccionesModel = element;
            } else if (element.IdModulo === 56) {
              this.canalesExternos = true;
              this.GestionOperaciones = true;
              this.CanalesExternosModel = element;
            } else if (element.IdModulo === 57) {
              this.composicionPortafolio = true;
              this.GestionOperaciones = true;
              this.ComposisionPortafolioModel = element;
            } else if (element.IdModulo === 58) {
              this.evolucionOficina = true;
              this.GestionOperaciones = true;
              this.EvolucionOficinaModel = element;
            } else if (element.IdModulo === 80) {
              this.IndicadoresGerenciales = true;
              this.GestionOperaciones = true;
              this.IndicadoresGerencialesModel = element;
            } else if (element.IdModulo === 69) {
              this.ListaProductos = true;
              this.GestionOperaciones = true;
              this.ListaMisProductosModel = element;
            } else if (element.IdModulo === 76) {
              this.InformeClientes = true;
              this.InformeClientesModel = element;
            } else if (element.IdModulo === 82) {
              this.InformeAhorros = true;
              this.InformeAhorrosModel = element;
            } else if (element.IdModulo === 79) {
              this.LogAuditoria = true;
              this.LogAuditoriaModel = element;
            }
            /* Fin informes */

            /* utilidades */
            else if (element.IdModulo === 39) {
              this.Utilidades = true;
              this.UtilidadesModel = element;
            } else if (element.IdModulo === 40) {
              this.CrearNotificaciones = true;
              this.CrearNotificacionesModel = element;
            } else if (element.IdModulo === 41) {
              this.DiferenciasSaldos = true;
              this.DiferenciasSaldosModel = element;
            }
            /* Fin utilidades */

            /* auditorias */
            else if (element.IdModulo === 34) {
              this.Auditorias = true;
              this.AuditoriasModel = element;
            } else if (element.IdModulo === 35) {
              this.AuditoriaScore = true;
              this.AuditoriaScoreModel = element;
            } else if (element.IdModulo === 36) {
              this.AuditoriasGmf = true;
              this.AuditoriasGmfModel = element;
            } else if (element.IdModulo === 85) {
              this.AuditoriaDatacredito = true;
              this.AuditoriaDatacreditoModel = element;
            }
            /* Fin auditorias */
          });
        },
        error => {
          this.notif.onDanger('Error', error);
          console.error(error);
        });
    }
    this.FechaActual = new Date();
    data = localStorage.getItem('Data');
    this.DataUser = JSON.parse(window.atob(data == null ? "" : data));
    if (this.DataUser != null) {
      this.nameUser = this.DataUser.Usuario;
      this.NombreOficinaActual = this.DataUser.Oficina;
    } else {
      this.router.navigateByUrl('/login');
      this.nameUser = '';
      this.NombreOficinaActual = '';
      localStorage.clear();
    }
    this.VerificarPaginaActual();
    this.GetModuloOfice();
    this.GetIpUltimaSesion();
    this.webSocket.Init();
  }
  GetIpUltimaSesion() {
    this.usuariosServices.GetIpUltimaSesion(this.resulStore.IdUsuario).subscribe(x => {
      this.ip = x.Ip;
      this.fechaUltimoIngreso = x.FechaConexion;
    });
  }
  GetModuloOfice() {
    let pefi: string | null = localStorage.getItem('profiles');
    const resultProfiles = JSON.parse(window.atob(pefi == null ? "" : pefi));
    if (resultProfiles.length > 0) {
      resultProfiles.forEach((element: any) => {
        if (element.IdPerfil == 78) {
          this.ObtenerOficinas();
          this.isChangeOfice = true;
        }
      });
    }
  }
  ObtenerOficinas() {
    this.usuariosServices.getOficinas().subscribe(result => {
      this.resultOficina = result;
    },
      error => {
        console.log(error);
        this.notif.onDanger('Error', error);
      }
    );
  }
  ActualizarOficinaUsuario() {
    let payload: any = {
      IdOficina: this.oficinaSeleccionada.IdLista,
      IdUsuario: this.resulStore.IdUsuario,
      Usuario: this.resulStore.Usuario
    };
    let data: string | null = localStorage.getItem('Data');
    this.resulStore = JSON.parse(window.atob(data == null ? "" : data));
    let numOficeAnterior: string = this.resulStore.NumeroOficina;
    let Oficina: string = this.resulStore.Oficina;

    this.usuariosServices.ActualizarOficinaUsuario(payload).subscribe(x => {
      this.oficinaSeleccionada = { Descripcion: "", IdLista: 0 };
      localStorage.setItem('Data', window.btoa(JSON.stringify(x)));
      this.notif.onSuccess('Exitoso', "El cambio de la oficina se realizó correctamente.");
      setTimeout(() => {
        let logJson: any = {
          OficinaIdAnterior: numOficeAnterior,
          OficinaAnterior: Oficina,
          OficinaIdActualiza: x.NumeroOficina,
          OficinaActualiza: x.Oficina
        };
        this.serviceGenerales.Guardarlog(logJson, 1, null, null, 81).subscribe(result => {
          setTimeout(() => {
            data = localStorage.getItem('Data');
            this.resulStore = JSON.parse(window.atob(data == null ? "" : data));
            
            detectIncognito().then((result : any) =>{
              payload.browser =  {
                browserName : result.browserName,
                isPrivate : result.isPrivate
              }
              let message: string = JSON.stringify({ userId: payload.IdUsuario, payload: payload });
              this.webSocket.Send("ChangeOffice",message, payload.IdUsuario);
              setTimeout(() => {
                this.webSocket.TriggerLocal("ChangeOffice");
                if (this.resulStore == null) {
                  this.webSocket.TriggerLocal("CloseSesion");
                  this.webSocket.CloseSesion("");
              } else {
                 localStorage.removeItem("ChangeState");
                 window.location.reload();
              }
              }, 300);
            });
          }, 1500);
        });
      }, 300);
    });
  }
  ClickOficina() {
    setTimeout(() => {
      $('#selectOficina').focus().select();
    }, 200);
  }
  CambioOficina() {
    if (this.oficinaSeleccionada != null && this.oficinaSeleccionada.Descripcion != "" && this.NombreOficinaActual == this.oficinaSeleccionada.Descripcion) {
      this.notif.onWarning('Advertencia', "Oficina no valida.");
      this.oficinaSeleccionada = { Descripcion: "", IdLista: 0 };
      this.conutStatus = 0;
      setTimeout(() => {
        $('#hiddenButton').focus().select();
        setTimeout(() => {
          $('#hiddenButton').click();
        }, 100);
      }, 100);
      return;
    }

    if (this.oficinaSeleccionada == null || this.oficinaSeleccionada.Descripcion.trim() == "" || this.oficinaSeleccionada.IdLista == 0)
      return;

    if (this.conutStatus == 0)
      this.conutStatus = 1;
    else
      return;

    Swal.fire({
      title: '¿Desea cambiar de Oficina?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results: any) => {
      if (results.value)
        this.ActualizarOficinaUsuario();
      else
        this.oficinaSeleccionada = { Descripcion: "", IdLista: 0 };
      this.conutStatus = 0;
    });
  }
  ngOnDestroy() {
    this.idle.ngOnDestroy();
  }
  stop() {
    this.userIdle.stopTimer();
  }
  stopWatching() {
    this.userIdle.stopWatching();
  }
  startWatching() {
    this.userIdle.startWatching();
  }
  validacionUsuarios() {
    if (localStorage.getItem('Data') !== null && localStorage.getItem('Data') !== undefined) {
      let data: string | null = localStorage.getItem('Data');
      this.resulStore = JSON.parse(window.atob(data == null ? "" : data));
      if (this.resulStore === null) {
        localStorage.removeItem('userName');
        this.router.navigateByUrl('/Login');
        localStorage.removeItem('userName');
        localStorage.removeItem('dataUserConect');
        localStorage.removeItem('TerceroNatura');
        localStorage.removeItem('IdModuloActivo');
        localStorage.removeItem('Permisos');
      }
    }
  }

  VerificarPaginaActual() {
    this.rutaActual = location.hash;
    if (this.rutaActual !== '#/') {
      this.rutaPaginaActual = this.rutaActual;
    } else {
      this.rutaPaginaActual = '';
    }
    this.router.events.subscribe((val) => {
      this.rutaActual = location.hash;
      if (this.rutaActual !== '#/') {
        this.rutaPaginaActual = this.rutaActual;
      } else {
        this.rutaPaginaActual = '';
      }
    });
  }
  LogginOut() {
    this.loginService.CerrarSesionUser(this.DataUser.IdUsuario).subscribe(result => {
      this.isLoginError = false;
      this.webSocket.Send("ClosedSesion",this.DataUser.IdUsuario);
      this.router.navigateByUrl('/Login');
      this.nameUser = '';
      this.NombreOficinaActual = '';
      localStorage.removeItem('userName');
      localStorage.removeItem('dataUserConect');
      localStorage.removeItem('TerceroNatura');
      localStorage.removeItem('IdModuloActivo');
      localStorage.removeItem('Data')
      localStorage.clear();
    }, error => {
      console.log(error);
      this.notif.onDanger('Error', error);
      this.isLoginError = true;
    });
  }
  setModuloLocalStorage(IdModulo: number) {
    let permi: string | null = localStorage.getItem('Permisos');
    const permisosUsuario = JSON.parse(CryptoJS.AES.decrypt(permi == null ? "" : permi, this.PassJs.pass).toString(CryptoJS.enc.Utf8));

    let pr: any = permisosUsuario.find((x: any) => x.IdModulo == IdModulo);
    if (pr == null || pr.IdModulo != IdModulo)
      this.router.navigateByUrl('/');
    else
      localStorage.setItem('IdModuloActivo', window.btoa(JSON.stringify(IdModulo)));
  }
  created(e: any) {
    console.log("create", e)
  }
  destroyed(e: any) {
    console.log("destroyd", e)
  }

  openModal() {
    console.log('Abriendo modal'); 
    this.isModalOpen = true;
  }
  closeModal() {
    console.log('Cerrando modal');
    this.isModalOpen = false;
  }
  
  // Para cerrar si se hace clic fuera del modal
  onBackdropClick(event: MouseEvent) {
    this.closeModal();
  }
  
}

