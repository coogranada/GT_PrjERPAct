import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { NgxToastService } from 'ngx-toast-notifier';
import { filter } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [DatePipe, LoginService,OperacionesService,UsuariosService,WebSocketService,GeneralesService],
  standalone : false
})
export class LayoutComponent implements OnInit {

  //#region Declaracion variables
  private PassJs = new PassEncriptJs();
  public resulStore : any = null;
  public isLoginError = false;
  public DataUser : any;
  public nameUser : string = "";
  public NombreOficinaActual : string = "";
  public rutaActual : string = "";
  public NombrePaginaActual : string = "";
  public rutaPaginaActual : string = "";
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
  public FichaAnalisis = false;
  public Seguros = false;
  public Generales = false;
  public Cancelacion = false;
  /*Fin Productos */

  /*  Transacciones Financieras */
  public TransaccionesFinancieras = false;
  public TransaccionesFinancierasInterno = false;
  /* Fin Transacciones Financieras */

  /* Cartera */
  public Cartera = false;
  public CarteraInterno = false;
  /* Fin cartera */

  /* Informes */
  public Informes = false;
  public InformesInterno = false;
  public ConciliacionComisiones = false;
  public DebitosAutomaticos = false;
  public GestionOperaciones = false;
  public InformeClientes = false;
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
  public FichaAnalisisModel: any;
  public SegurosModel: any;
  public GeneralesModel: any;
  public CancelacionModel: any;
  /*Fin Productos */

  /*  Transacciones Financieras */
  public TransaccionesFinancierasModel: any;
  public TransaccionesFinancierasInternoModel: any;
  /* Fin Transacciones Financieras */

  /* Cartera */
  public CarteraModel: any;
  public CarteraInternoModel: any;
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
  public AuditoriasGmfModel: any;
  public ocultarListaDirecciones: boolean = false;
  /* Fin auditorias */
//#endregion

  public mouseStop = null;
  public Time = 1800000; // 1 minuto = 60.000 // dos minutos
  public volverBanner = true;
  public solounaVes = 0;
  public  IDLE_TIMEOUT = 60; // seconds
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

  constructor(private loginService: LoginService, private router: Router, private notif: NgxToastService,
    public datepipe: DatePipe, private userIdle: UserIdleService,
    private operacionesService: OperacionesService,private usuariosServices: UsuariosService,  private webSocket : WebSocketService,private serviceGenerales : GeneralesService) {
  }
  // @HostListener('document:keyup', ['$event'])
  // @HostListener('document:click', ['$event'])
  // @HostListener('document:wheel', ['$event'])
  ip: string = "";
  fechaUltimoIngreso: string = "";
  restart() {
    this.userIdle.resetTimer();
  }
  boolBannner : boolean = false;
  isUsuarioMenuOpen : boolean = false;
  isConfiguracionMenuOpen : boolean = false;
  isMaestroMenuOpen : boolean = false;
  isMaestroProductosMenuOpen : boolean = false;
  isMaestroAhorrosMenuOpen : boolean = false;
  isInformesMenuOpen : boolean = false;
  isInformesMaestroAhorrosMenuOpen : boolean = false;
  isClientesMenuOpen : boolean = false;
  isProductosMenuOpen : boolean = false;
  isProductosAhorrosMenuOpen : boolean = false;
  isProductosAhorrosContractualMenuOpen : boolean = false;
  isProductosAhorrosDisponiblesMenuOpen : boolean = false;
  isProductosAhorrosTerminoMenuOpen : boolean = false;
  isProductosCreditoMenuOpen : boolean = false;
  isProductosSeguroMenuOpen : boolean = false;
  isInformeMenuOpen : boolean = false;
  isInformeEstadisticosMenuOpen : boolean = false;
    // Cambiar a 'false' si deseas ocultarlo por defecto

  // Método para alternar el estado del menú de Usuario
  toggleUsuarioMenu() {
    this.isUsuarioMenuOpen = !this.isUsuarioMenuOpen;
    this.toggleCloseMenu(1);
  }
  toggleConfiguracionMenu(){
    if(!this.isConfiguracionMenuOpen){
      this.isMaestroMenuOpen = false;
      this.isMaestroProductosMenuOpen = false;
    }   
    this.isConfiguracionMenuOpen = !this.isConfiguracionMenuOpen;
    this.toggleCloseMenu(2);
  }
  toggleMaestroMenu() {
    if(!this.isMaestroMenuOpen){
      this.isMaestroAhorrosMenuOpen = false;
      this.isMaestroProductosMenuOpen = false;
    }
    this.isMaestroMenuOpen = !this.isMaestroMenuOpen;
    this.toggleCloseMenu(2,1);
  }
  toggleMaestroProductosMenu(){
    if(!this.isMaestroProductosMenuOpen)
      this.isMaestroAhorrosMenuOpen = false;
    this.isMaestroProductosMenuOpen = !this.isMaestroProductosMenuOpen;
    this.toggleCloseMenu(2,2);
  }
  toggleMaestroAhorrosMenu(){
    this.isMaestroAhorrosMenuOpen = !this.isMaestroAhorrosMenuOpen;
  }
  toggleInformesMenu(){
    if(!this.isInformesMenuOpen)
      this.isInformesMaestroAhorrosMenuOpen = false;
    this.isInformesMenuOpen = !this.isInformesMenuOpen;
    this.toggleCloseMenu(2,3);
  }
  toggleInformesMaestroAhorrosMenu(){
    this.isInformesMaestroAhorrosMenuOpen = !this.isInformesMaestroAhorrosMenuOpen;
  }
  toggleClientesMenu(){
    this.isClientesMenuOpen = !this.isClientesMenuOpen;
    this.toggleCloseMenu(3);
  }
  toggleProductosMenu(){
    this.isProductosMenuOpen = !this.isProductosMenuOpen;
    this.toggleCloseMenu(4);
  }
  toggleProductosAhorrosMenu(){
    this.isProductosAhorrosMenuOpen = !this.isProductosAhorrosMenuOpen;
    this.toggleCloseMenu(4,1);
  }
  toggleProductosAhorroContractualMenu(){
    this.isProductosAhorrosContractualMenuOpen = !this.isProductosAhorrosContractualMenuOpen;
    this.toggleCloseMenu(4,2);
  }
  toggleProductosAhorrosDisponiblesMenu(){
    this.isProductosAhorrosDisponiblesMenuOpen = !this.isProductosAhorrosDisponiblesMenuOpen;
    this.toggleCloseMenu(4,3);
  }
  toggleProductosAhorrosTerminoMenu(){
    this.isProductosAhorrosTerminoMenuOpen = !this.isProductosAhorrosTerminoMenuOpen;
    this.toggleCloseMenu(4,4);
  }
  toggleProductosCreditoMenu(){
    this.isProductosCreditoMenuOpen = !this.isProductosCreditoMenuOpen;
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
  toggleCloseMenu(id : number, opcion : number = 0) {
    if(id != 1)this.isUsuarioMenuOpen = false;
    if(id != 2)this.isConfiguracionMenuOpen = false;
    if(id == 2 && opcion == 1){
      this.isMaestroProductosMenuOpen = false;
      this.isInformesMenuOpen = false;
    }else if(id == 2 && opcion == 2){
      this.isMaestroMenuOpen = false;
      this.isInformesMenuOpen = false;
    }else if(id == 2 && opcion == 3){
      this.isMaestroMenuOpen = false;
      this.isMaestroProductosMenuOpen = false;
    }
    if(id != 3)this.isClientesMenuOpen = false;
    if(id != 4){
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
    }else if(id == 4 && opcion == 2){
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
  }
  ngOnInit() {
   
    this.consultarImg = true;


    // Start watching for user inactivity.
    this.userIdle.startWatching();

    // // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(() =>{
        this.boolBannner = true;
    });

    // // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() =>{
      console.log("Show");
    
      this.AbrirModalBanner?.nativeElement.click();
      this.restart();
      this.boolBannner = false;
    }
     );
     
    // this.bnIdle.startWatching(60).subscribe((isTimedOut: boolean) => {
    //   this.AbrirModalBanner.nativeElement.click();
    //   this.bnIdle.stopTimer();
    // });

    this.ocultarListaDirecciones = true;
    let data : string | null = localStorage.getItem('Data')
    if(data != null)
      this.resulStore = JSON.parse(window.atob(data));
    //#region  variablesJquery
    /* Usuarios */
    $('#gestionesOperaciones').hide();
    /* Fin Usuarios */

  /* Configuracion */
    $('#configuracion').hide();

  /* Maestros */
    $('#maestros').hide();
    $('#areas').hide();
    $('#cargos').hide();
    $('#oficinas').hide();
    $('#perfiles').hide();
    $('#usuariosTipos').hide();
    $('#modulos').hide();
    $('#permisos').hide();
    $('#usuarios').hide();
    $('#usuariosproveedores').hide();
    $('#GestionEmail').hide();

    $('#operacionesPerfiles').hide();
    $('#operacionesEstado').hide();
    $('#operacionesModulos').hide();
    $('#observacionesModulos').hide();
    $('#permisosEspeciales').hide();
    $('#servidores').hide();
    $('#oficinasServidores').hide();
    $('#controlSession').hide();
    $('#imagenesBanner').hide();
    $('#llaves').hide();
  /* Fin Maestros */

  /* Maestros productos */
  $('#maestrosproductos').hide();
  $('#maestrosahorros').hide();
  $('#consecutivotitulo').hide();
   /* Fin Maestros productos */

  /* Informes*/
  $('#informeconsecutivotitulo').hide();
  $('#informesmaestros').hide();
  $('#informesmaestrosahorros').hide();
  /* Fin informes */

  /* Fin Configuracion */

    /* Clientes */
    $('#clientes').hide();
    $('#naturales').hide();
    $('#juridicos').hide();
    $('#terceros').hide();
    $('#privilegiados').hide();
    $('#vetados').hide();
    /* Fin Clientes */

    /* Productos */
    $('#productos').hide();
    $('#aportes').hide();
    $('#ahorros').hide();
    $('#simuladorAhorro').hide();
    $('#termino').hide();
    $('#TerminoInterno').hide();
    $('#asesoriatermino').hide();
    $('#contractuales').hide();
    $('#contractualesInterno').hide();
    $('#asesoriacontractual').hide();
    $('#disponibles').hide();
    $('#disponiblesInterno').hide();
    $('#tarjetaHabientes').hide();
    $('#gmf').hide();
    $('#cuentasCorriente').hide();
    $('#creditos').hide();
    $('#simuladorCredito').hide();
    $('#score').hide();
    $('#fichaAnalisis').hide();
    $('#seguros').hide();
    $('#general').hide();
    $('#cancelacion').hide();
    /*Fin Productos */

    /*  Transacciones Financieras */
    $('#transaccionesFinancieras').hide();
    $('#transaccionesFinancierasInterno').hide();
    /* Fin Transacciones Financieras */

    /* Cartera */
    $('#cartera').hide();
    $('#carteraInterno').hide();
    /* Fin cartera */

    /* Informes */
    $('#informes').hide();
    $('#informesInterno').hide();
    $('#conciliacionComisiones').hide();
    $('#debitosautomaticos').hide();
    $('#gestionOperaciones').hide();
    $('#estadisticos').hide();
    $('#transacciones').hide();
    $('#canalesExternos').hide();
    $('#composisionPortafolio').hide();
    $('#evolucionOficina').hide();
    $('#IndicadoresGerenciales').hide();
    $('#ListaProductos').hide();
    $('#informeclientes').hide();
    $('#logauditoria').hide();
    /* Fin informes */

    /* utilidades */
    $('#utilidades').hide();
    $('#crearNotificaciones').hide();
    $('#diferenciasSaldos').hide();
    $('#consultaRecaudoEpm').hide();
    /* Fin utilidades */

    /* auditorias */
    $('#auditorias').hide();
    $('#auditoriaScore').hide();
    $('#auditoriasGmf').hide();
    /* Fin auditorias */
    //#endregion
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

          result.forEach((element : any) => {
            /* Usuarios */
            // if (element.IdModulo === 1) {
            //   $('#gestionesOperaciones').show();
            //   this.GestionesOperaciones = true;
            //   this.GestionesOperacionesModel = element;
            // }
            /* Fin Usuarios */

          /* Configuracion */
            if (element.IdModulo === 63) {
            $('#configuracion').show();
            this.Configuracion = true;
            this.ConfiguracionModel = element;
            }
            /* Maestros */
            if (element.IdModulo === 1) {
              $('#maestros').show();
              this.Maestros = true;
              this.MaestrosModel = element;
            }
            if (element.IdModulo === 2) {
              $('#areas').show();
              this.Areas = true;
              this.AreasModel = element;
            }
            if (element.IdModulo === 3) {
              $('#cargos').show();
              this.Cargos = true;
              this.CargosModel = element;
            }
            if (element.IdModulo === 4) {
              $('#oficinas').show();
              this.Oficinas = true;
              this.OficinasModel = element;
            }
            if (element.IdModulo === 5) {
              $('#perfiles').show();
              this.Perfiles = true;
              this.PerfilesModel = element;
            }
            if (element.IdModulo === 6) {
              $('#usuariosTipos').show();
              this.UsuariosTipos = true;
              this.UsuariosTiposModel = element;
            }
            if (element.IdModulo === 7) {
              $('#modulos').show();
              this.Modulos = true;
              this.ModulosModel = element;
            }
            if (element.IdModulo === 8) {
              $('#permisos').show();
              this.Permisos = true;
              this.PermisosModel = element;
            }
            if (element.IdModulo === 48) {
              $('#permisosEspeciales').show();
              this.PermisosEspeciales = true;
              this.PermisosEspecialesModel = element;
            }
            if (element.IdModulo === 9) {
              $('#usuarios').show();
              this.Usuarios = true;
              this.UsuariosModel = element;
            }

            if (element.IdModulo === 78) {
              $('#GestionEmail').show();
              this.GestionEmail = true;
              this.GestionEmailModel = element;
            }

            if (element.IdModulo === 71) {
              $('#usuariosproveedores').show();
              this.UsuarioProveedores = true;
              this.UsuariosProveedoresModel = element;
            }
            if (element.IdModulo === 50) {
              $('#operacionesModulos').show();
              this.OperacionesModulos = true;
              this.OperacionesModulosModel = element;
            }
            if (element.IdModulo === 42) {
              $('#operacionesPerfiles').show();
              this.OperacionesPerfiles = true;
              this.OperacionesPerfilesModel = element;
            }
            if (element.IdModulo === 43) {
              $('#operacionesEstado').show();
              this.OperacionesEstado = true;
              this.OperacionesEstadoModel = element;
            }
            if (element.IdModulo === 53) {
              $('#controlSession').show();
              this.ObservacionesModulos = true;
              this.ObservacionesModulosModel = element;
            }
            if (element.IdModulo === 68) {
              $('#llaves').show();
              this.Llaves = true;
              this.LlavesModel = element;
            }
            /* Fin  Maestros */

            /* Maestros productos */
            if (element.IdModulo === 64) {
              $('#maestrosproductos').show();
              this.MaestrosProdutos = true;
              this.MaestrosProductosModel = element;
            }
            if (element.IdModulo === 65) {
              $('#maestrosahorros').show();
              this.MaestrosAhorros = true;
              this.MaestrosAhorrosModel = element;
            }
            if (element.IdModulo === 66) {
              $('#consecutivotitulo').show();
              this.ConsecutivoTitulo = true;
              this.ConsecutivoTituloModel = element;
            }
            if (element.IdModulo === 67) {
              $('#GestionBanner').show();
              this.GestionBanner = true;
              this.GestionBannerModel = element;
            }
           /* Fin  Maestros productos*/

            /* Informes */

            if (element.IdModulo === 72) {
              $('#informeconsecutivotitulo').show();
              this.InformesConsecutivoTitulo = true;
              this.InformeConsecutivoTituloModel = element;
            }
             if (element.IdModulo === 73) {
               $('#informesmaestros').show();
               this.InformesMaestros = true;
               this.InformesMaestrosModel = element;
            }
            if (element.IdModulo === 74) {
              $('#informesmaestrosahorros').show();
              this.InformesMaestrosAhorros = true;
              this.InformesMaestrosAhorrosModel = element;
            }

            /* Fin  Informes */

            /* Fin  Configuracion */

            /* Clientes */
            if (element.IdModulo === 10) {
              $('#clientes').show();
              this.Clientes = true;
              this.ClientesModel = element;
            }
            if (element.IdModulo === 11) {
              $('#naturales').show();
              this.Naturales = true;
              this.NaturalesModel = element;
            }
            if (element.IdModulo === 12) {
              $('#juridicos').show();
              this.Juridicos = true;
              this.JuridicosModel = element;
            }
            if (element.IdModulo === 13) {
              $('#terceros').show();
              this.Terceros = true;
              this.TercerosModel = element;
            }
            if (element.IdModulo === 14) {
              $('#privilegiados').show();
              this.Privilegiados = true;
              this.PrivilegiadosModel = element;
            }
            if (element.IdModulo === 15) {
              $('#vetados').show();
              this.Vetados = true;
              this.VetadosModel = element;
            }
            /* Fin Clientes */

            /* Productos */
            if (element.IdModulo === 37) {
              $('#productos').show();
              this.Productos = true;
              this.ProductosModel = element;
            }
            if (element.IdModulo === 16) {
              $('#aportes').show();
              this.Aportes = true;
              this.AportesModel = element;
            }
            if (element.IdModulo === 17) {
              $('#ahorros').show();
              this.Ahorros = true;
              this.AhorrosModel = element;
            }
            if (element.IdModulo === 18) {
              $('#simuladorAhorro').show();
              this.SimuladorAhorro = true;
              this.SimuladorAhorroModel = element;
            }
            if (element.IdModulo === 61) {
              $('#termino').show();
              this.Termino = true;
              this.TerminoModel = element;
            }
            if (element.IdModulo === 19) {
              $('#TerminoInterno').show();
              this.TerminoInterno = true;
              this.TerminoInternoModel = element;
            }
            if (element.IdModulo === 59) {
              $('#contractuales').show();
              this.Contractuales = true;
              this.ContractualesModel = element;
            }
            if (element.IdModulo === 20) {
              $('#contractualesInterno').show();
              this.ContractualesInterno = true;
              this.ContractualesInternoModel = element;
            }
            if (element.IdModulo === 21) {
              $('#disponibles').show();
              this.Disponibles = true;
              this.DisponiblesModel = element;
            }
            if (element.IdModulo === 38) {
              $('#disponiblesInterno').show();
              this.DisponiblesInterno = true;
              this.DisponiblesInternoModel = element;
            }
            if (element.IdModulo === 22) {
              $('#tarjetaHabientes').show();
              this.TarjetaHabientes = true;
              this.TarjetaHabientesModel = element;
            }
            if (element.IdModulo === 23) {
              $('#gmf').show();
              this.Gmf = true;
              this.GmfModel = element;
            }
            if (element.IdModulo === 24) {
              $('#cuentasCorriente').show();
              this.CuentasCorriente = true;
              this.CuentasCorrienteModel = element;
            }
            if (element.IdModulo === 25) {
              $('#creditos').show();
              this.Creditos = true;
              this.CreditosModel = element;
            }
            if (element.IdModulo === 26) {
              $('#simuladorCredito').show();
              this.SimuladorCredito = true;
              this.SimuladorCreditoModel = element;
            }
            if (element.IdModulo === 27) {
              $('#score').show();
              this.Score = true;
              this.ScoreModel = element;
            }
            if (element.IdModulo === 75) {
              $('#fichaAnalisis').show();
              this.FichaAnalisis = true;
              this.FichaAnalisisModel = element;
            }
            if (element.IdModulo === 28) {
              $('#seguros').show();
              this.Seguros = true;
              this.SegurosModel = element;
            }
            if (element.IdModulo === 29) {
              $('#general').show();
              this.Generales = true;
              this.GeneralesModel = element;
            }
            if (element.IdModulo === 30) {
              $('#cancelacion').show();
              this.Cancelacion = true;
              this.CancelacionModel = element;
            }
            if (element.IdModulo === 60) {
              $('#asesoriacontractual').show();
              this.AsesoriaContractual = true;
              this.AsesoriaContractualModel = element;
            }
            if (element.IdModulo === 77) {
              $('#asesoriatermino').show();
              this.AsesoriaTermino = true;
              this.AsesoriaTerminoModel = element;
            }
            /* Fin Productos */

            /*  Transacciones Financieras */
            if (element.IdModulo === 31) {
              $('#transaccionesFinancieras').show();
              this.TransaccionesFinancieras = true;
              this.TransaccionesFinancierasModel = element;
            }
            if (element.IdModulo === 31) {
              $('#transaccionesFinancierasInterno').show();
              this.TransaccionesFinancierasInterno = true;
              this.TransaccionesFinancierasInternoModel = element;
            }
            /* Fin Transacciones Financieras */

            /* Cartera */
            if (element.IdModulo === 32) {
              $('#cartera').show();
              this.Cartera = true;
              this.CarteraModel = element;
            }
            if (element.IdModulo === 45) {
              $('#carteraInterno').show();
              this.CarteraInterno = true;
              this.CarteraInternoModel = element;
            }
            /* Fin cartera */

            /* Informes */
            if (element.IdModulo === 33) {
              $('#informes').show();
              this.Informes = true;
              this.InformesModel = element;
            }
            if (element.IdModulo === 46) {
              $('#informesInterno').show();
              this.InformesInterno = true;
              this.InformesInternoModel = element;
            }
            if (element.IdModulo === 47) {
              $('#conciliacionComisiones').show();
              this.ConciliacionComisiones = true;
              this.ConciliacionComisionesModel = element;
            }
            if (element.IdModulo === 51) {
              $('#debitosautomaticos').show();
              this.DebitosAutomaticos = true;
              this.DebitosAutomaticosModel = element;
            }
            if (element.IdModulo === 52) {
              $('#gestionOperaciones').show();
              this.GestionOperaciones = true;
              this.GestionOperacionesModel = element;
            }
            if (element.IdModulo === 54) {
              $('#estadisticos').show();
              this.GestionOperaciones = true;
              this.GestionOperacionesModel = element;
            }
            if (element.IdModulo === 55) {
              $('#transacciones').show();
              this.GestionOperaciones = true;
              this.TransaccionesModel = element;
            }
             if (element.IdModulo === 56) {
               $('#canalesExternos').show();
              this.GestionOperaciones = true;
               this.CanalesExternosModel = element;
            }
             if (element.IdModulo === 57) {
               $('#composisionPortafolio').show();
              this.GestionOperaciones = true;
               this.ComposisionPortafolioModel = element;
            }
            if (element.IdModulo === 58) {
              $('#evolucionOficina').show();
              this.GestionOperaciones = true;
              this.EvolucionOficinaModel = element;
            }
            if (element.IdModulo === 80) {
              $('#IndicadoresGerenciales').show();
              this.GestionOperaciones = true;
              this.IndicadoresGerencialesModel = element;
            }
            if (element.IdModulo === 69) {
              $('#ListaProductos').show();
              this.GestionOperaciones = true;
              this.ListaMisProductosModel = element;
            }
            if (element.IdModulo === 76) {
              $('#informeclientes').show();
              this.InformeClientes = true;
              this.InformeClientesModel = element;
            }
            if (element.IdModulo === 79) {
              $('#logauditoria').show();
              this.LogAuditoria = true;
              this.LogAuditoriaModel = element;
            }
            /* Fin informes */

            /* utilidades */
            if (element.IdModulo === 39) {
              $('#utilidades').show();
              this.Utilidades = true;
              this.UtilidadesModel = element;
            }
            if (element.IdModulo === 40) {
              $('#crearNotificaciones').show();
              this.CrearNotificaciones = true;
              this.CrearNotificacionesModel = element;
            }
            if (element.IdModulo === 41) {
              $('#diferenciasSaldos').show();
              this.DiferenciasSaldos = true;
              this.DiferenciasSaldosModel = element;
            }
            /* Fin utilidades */

            /* auditorias */
            if (element.IdModulo === 34) {
              $('#auditorias').show();
              this.Auditorias = true;
              this.AuditoriasModel = element;
            }
            if (element.IdModulo === 35) {
              $('#auditoriaScore').show();
              this.AuditoriaScore = true;
              this.AuditoriaScoreModel = element;
            }
            if (element.IdModulo === 36) {
              $('#auditoriasGmf').show();
              this.AuditoriasGmf = true;
              this.AuditoriasGmfModel = element;
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
    //this.webSocket.Init();
  }
  GetIpUltimaSesion() {
    this.usuariosServices.GetIpUltimaSesion(this.resulStore.IdUsuario).subscribe(x => {
      this.ip = x.Ip;
      this.fechaUltimoIngreso = x.FechaConexion;
    });
  }
  GetModuloOfice() {
    let pefi : string | null = localStorage.getItem('profiles');
    const resultProfiles = JSON.parse(window.atob(pefi == null ? "" : pefi));
    if (resultProfiles.length > 0) {
      resultProfiles.forEach((element : any) => {
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
      Usuario : this.resulStore.Usuario
    };
    let data : string | null = localStorage.getItem('Data');
    this.resulStore = JSON.parse(window.atob(data == null ? "" : data));
    let numOficeAnterior : string = this.resulStore.NumeroOficina;
    let Oficina: string = this.resulStore.Oficina; 
    
    this.usuariosServices.ActualizarOficinaUsuario(payload).subscribe(x => {
      this.oficinaSeleccionada = { Descripcion: "", IdLista: 0 };
      localStorage.setItem('Data', window.btoa(JSON.stringify(x)));
      this.notif.onSuccess('Exitoso', "El cambio de la oficina se realizo con exito.");
      setTimeout(() => {
        let logJson: any = {
          OficinaIdAnterior: numOficeAnterior,
          OficinaAnterior: Oficina,
          OficinaIdActualiza: x.NumeroOficina,
          OficinaActualiza : x.Oficina
        };
        this.serviceGenerales.Guardarlog(logJson, 1, null, null, 81).subscribe(result => {
         // this.webSocket.TriggerLocal("ChangeOffice");
          setTimeout(() => {
            data = localStorage.getItem('Data');
            this.resulStore = JSON.parse(window.atob(data == null ? "" : data));
            if (this.resulStore == null) {
              // this.webSocket.TriggerLocal("CloseSesion");
              // this.webSocket.CloseSesion("");
            } else {
              localStorage.removeItem("ChangeState");
              window.location.reload();
            }
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
      this.oficinaSeleccionada =  { Descripcion: "", IdLista: 0 };
      this.conutStatus = 0;
      setTimeout(() => {
        $('#hiddenButton').focus().select();
        setTimeout(() => {
          $('#hiddenButton').click();
        }, 100);
      }, 100);
      return;
    }

    if(this.oficinaSeleccionada == null || this.oficinaSeleccionada.Descripcion.trim() == "" || this.oficinaSeleccionada.IdLista == 0)
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
    }).then((results : any) => {
      if (results.value)
        this.ActualizarOficinaUsuario();
      else
        this.oficinaSeleccionada = { Descripcion: "", IdLista: 0 };
      this.conutStatus = 0;
     });
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
      let data : string | null = localStorage.getItem('Data');
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
        this.router.navigateByUrl('/Login');
        this.nameUser = '';
        this.NombreOficinaActual = '';
        localStorage.removeItem('userName');
        localStorage.removeItem('dataUserConect');
        localStorage.removeItem('TerceroNatura');
        localStorage.removeItem('IdModuloActivo');
        localStorage.removeItem('Data')
        localStorage.clear();
      },error => {
        console.log(error);
        this.notif.onDanger('Error', error);
        this.isLoginError = true;
      });
  }
  setModuloLocalStorage(IdModulo : number) {
    let permi : string | null = localStorage.getItem('Permisos');
    const permisosUsuario = JSON.parse(CryptoJS.AES.decrypt(permi == null ? "" : permi, this.PassJs.pass).toString(CryptoJS.enc.Utf8));

    let pr : any = permisosUsuario.find((x : any) => x.IdModulo == IdModulo);
    if (pr == null || pr.IdModulo != IdModulo)
      this.router.navigateByUrl('/');
    else
      localStorage.setItem('IdModuloActivo', window.btoa(JSON.stringify(IdModulo)));
  }
  created( e : any){
    console.log("create",e)
  }
  destroyed( e : any){
    console.log("destroyd",e)
  }
}

