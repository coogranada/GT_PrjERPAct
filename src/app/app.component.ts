import { LoginService } from './Services/Login/login.service';
import {  Component, OnInit, ElementRef, Output, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { ClientesGetListService } from './Services/Clientes/clientesGetList.service';
import { OperacionesService } from './Services/Maestros/operaciones.service';
import { RecursosGeneralesService } from './Services/Utilidades/recursosGenerales.service';
import { OficinasService } from './Services/Maestros/oficinas.service';
import Swal from 'sweetalert2'
import { SecurityService } from './Services/Auth/security.service';
import { GestionesService  } from './Services/Gestiones/gestiones.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core'; 
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;
  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone : false,
  providers: [LoginService, ClientesGetListService, OperacionesService,
    GestionesService, RecursosGeneralesService, OficinasService,
    ClientesGetListService,SecurityService,Idle]
})


export class AppComponent implements OnInit,OnDestroy {
  public now = Date.now();
  title = 'app';
  public sub : any = null;
  public subscription : any = null;
  public secondsDisplay : any = null;
  public minutesDisplay : any = null;
  public idUsuario : any = null;
  public resulStore : any = null;
  public moduloActivo : any = null;
  public DataUser : any = null;;
  private validarModulo : boolean = false;

  public DatosUsuario : any = null;
  @Output() permisosEmit: EventEmitter<any> = new EventEmitter();
  // @ViewChild('btnModalBanner', { static: true }) private AbrirModalBanner: ElementRef;
  @ViewChild('btnModelaBannerCloset', { static: true }) private CerrarModalBanner: ElementRef | null = null;
  idLesState = 'Not stared';
  timedOut = false;
  lastPing?: Date | null = null;
  idleState : string = "";
//#endregion
  
  constructor(
    private loginService: LoginService,
    private router: Router,
    private notif: NgxToastService,
    private location: PlatformLocation,
    private clientesGetListService: ClientesGetListService,
    private Security: SecurityService ,
    private idle : Idle ) {

    if (localStorage.getItem('Data') !== null) {
      let data : string | null = localStorage.getItem('Data');
      if(data != null)
        this.resulStore = JSON.parse(window.atob(data));
    } else {
      this.router.navigateByUrl('/Login');
      localStorage.clear();
    }
  }
  ngOnDestroy() {
    this.idle.ngOnDestroy();
  }
  ngOnInit() {
    // console.log('ERP - V.5');
    this.GetCargos();
    this.GetEstadosSeguro();
    this.GetLetra();
    this.GetSeguros();
    this.GetTipoEmpleo();
    setInterval(() => {
      this.TimerRefresToken();
    },3600000);
    
    if (localStorage.getItem('Data') !== null) {
      let data: string | null = localStorage.getItem('Data')
        if(data != null && data != ""){
          console.log("Set inactividad")
          this.DatosUsuario = JSON.parse(window.atob(data));
          this.resulStore = JSON.parse(window.atob(data));
          this.idle.setIdle((60 * 120));  // Tiempo de inactividad antes de activar el timeout
          this.idle.setTimeout(10);  // Tiempo de espera después del idle antes de hacer algo (ej. logout)
          this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);  // Configura las interrupciones (click, teclado, etc.)
        } 
      } else {
        this.router.navigateByUrl('/Login');
        localStorage.clear();
      }

    this.location.onPopState(() => {
      let data : string | null = localStorage.getItem('Data');
      this.resulStore = JSON.parse(window.atob(data == null ? "" : data));
      if (this.resulStore === undefined || this.resulStore === null || this.resulStore === '') {
        this.router.navigateByUrl('/Login');
        localStorage.clear();
      }
    });

    /* Descomentar cuando se publique en pruebas y produccion  Metodo que bloquea el f12 y el pegar o control shif i*/
    $(document).keydown(function (event : any) {
      if (event.keyCode === 123) { // Prevent F12
        return false;
      } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) { // Prevent Ctrl+Shift+I
        return false;
      }
      return true;
    });
    // Metodo que previene el click derecho del mouse en la apliacion
    $(document).on('contextmenu',  { passive: true },function (e : any) {
      e.preventDefault();
    });
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.idleState)
      this.timedOut = false;
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
      console.log(this.idleState)
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState)
      this.timeout();
    });

    // Comienza el monitoreo de inactividad
    this.idle.watch();
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
    } else {
      localStorage.removeItem('userName');
      this.router.navigateByUrl('/Login');
      localStorage.removeItem('userName');
      localStorage.removeItem('dataUserConect');
      localStorage.removeItem('TerceroNatura');
      localStorage.removeItem('IdModuloActivo');
      localStorage.removeItem('Permisos');
    }
  }
  GetLetra() {
    this.clientesGetListService.GetLetras().subscribe(
      result => {
        // this.letraEmit.emit(result);
        // this.dataLetras = result;
        localStorage.setItem('letras', window.btoa(JSON.stringify(result)));
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  GetCargos() {
    this.clientesGetListService.GetCargos().subscribe(
      result => {
        // this.dataCargos = result;
        localStorage.setItem('cargos', window.btoa(JSON.stringify(result)));
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  GetSeguros() {
    const dataSeguros : any[] = [];
    this.clientesGetListService.GetSeguros().subscribe(
      result => {
        result.forEach((element : any) => {
          if (element.Clase !== 20) {
            dataSeguros.push(element);
          }
        });
        // this.dataSeguros = dataSeguros;
        localStorage.setItem('seguros', window.btoa(JSON.stringify(dataSeguros)));
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  GetEstadosSeguro() {
    this.clientesGetListService.GetEstadosSeguro().subscribe(
      result => {
        localStorage.setItem('estadoSeguro', window.btoa(JSON.stringify(result)));
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  GetTipoEmpleo() {
    this.clientesGetListService.GetTipoEmpleo().subscribe(
      result => {
         localStorage.setItem('empleo', window.btoa(JSON.stringify(result)));
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  public timeout() {
    let datauser: string | null = localStorage.getItem('Data');
    if (datauser == null)
      return;
    
    this.DataUser = JSON.parse(window.atob(datauser));
    this.loginService.CerrarSesionUser(this.DataUser.IdUsuario).subscribe(result => { 
      localStorage.clear();
    },error => {
      console.log(error);
      this.notif.onDanger('Error', error);
    });
    
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
        if (result.value) {
          $("#popupBusquedaParroquia").modal('hide');//ocultamos el modal
          $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          $('.modal-backdrop').remove();//eliminamos el backdrop del modal
          window.location.reload();
          this.router.navigate(['Login']);
        }
    });
  }
  public reset(event: any) {
    event.resetEvent;
  } 
  ValidarPermisosAModulos() {
    if (this.resulStore !== null && this.resulStore !== undefined) {
      this.loginService.ObtenerPermisoUsuario(this.resulStore.IdUsuario).subscribe(
        result => {
          if (result !== null && result !== undefined && result !== '') {
            result.forEach((element : any)=> {
              if (window.location.href.includes(element.Descripcion)) {
                this.validarModulo = true;
              } else {
                this.validarModulo = false;
              }
            });
            if (!this.validarModulo) {
              this.router.navigateByUrl('/');
            }
          }
        });
    }
  }
  TimerRefresToken() {
    var token: string | null = this.Security.GetToken();
     if (token != null && token != ""){
       this.loginService.GetToken(this.resulStore.intlngTercero).subscribe((x : any) => {
         var res = x;
         localStorage.setItem('token', res.token);
       });
     } 
  }
}
