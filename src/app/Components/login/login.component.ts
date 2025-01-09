import { LoginService } from '../../Services/Login/login.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ConfiguracionNotificacion } from '../../../environments/config.noticaciones';
import Swal from 'sweetalert2';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { EnvironmentService } from '../../Services/Enviroment/enviroment.service';
import { SessionUser } from '../../Models/Login/login.model';
import { DatePipe } from '@angular/common';
import { ClientesGetListService } from '../..//Services/Clientes/clientesGetList.service';
import { OficinasService } from '../../Services/Maestros/oficinas.service';
import { UsuariosService } from '../../Services/Maestros/usuarios.service';
import { WebSocketService } from '../../Services/WebSocket/web-socket.service';
import { NgxToastService } from 'ngx-toast-notifier';
const PrimaryWhite = 'rgb(13,165,80)';
const SecondaryGrey = 'rgb(13,165,80,0.7)';
//import { detectIncognito } from "src/assets/js/detectionIncognito/detectIncognito";
//eclare var detectIncognito : any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [OficinasService, ClientesGetListService,UsuariosService,WebSocketService,NgxToastService],
  standalone : false
})
  
export class LoginComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent! : NgxLoadingComponent;
  loginFrom! : FormGroup;
  isLoginError = false;
  dataUser : any;
  public FechaActual = Date.now();
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public  SessionUser = new SessionUser();
  constructor(private loginService: LoginService, private notif: NgxToastService,
    private environment: EnvironmentService,private usuariosServices: UsuariosService,
    private clientesGetListService: ClientesGetListService,
    private oficinasService: OficinasService, private webSocket : WebSocketService) {}

  ngOnInit() {
    this.validateForm();
    this.GetProfesion();
    this.GetParentescos();
    this.GetParentescosChange();
    this.GetParentescosPeps();
    this.GetOficinas();
    this.GetMarcar();
    this.GetTipoContacto();
    this.GetConceptosaAll();
    this.GetPeriodosPago();
    //this.dteect();
  }
  getModeName(browserName : string) {
    switch (browserName) {
      case "Safari":
      case "Firefox":
      case "Brave":
      case "Opera":
        return "a Private Window";
        break;
      case "Chrome":
      case "Chromium":
        return "an Incognito Window";
        break;
      case "Internet Explorer":
      case "Edge":
        return "an InPrivate Window";
        break;
    }
    throw new Error("Could not get mode name");
  }
  dteect() {
    // var a = document.getElementById("answer");
    // // We call the detectIncognito function and handle the promise
    // detectIncognito().then(function (result) {
    //   if (result.isPrivate) { // If the result is private, we display a message to the user
    //     alert("<b>Yes</b>. You are using " + result.browserName + " in " + this.getModeName(result.browserName) + ".");
    //   } else { // If the result is not private, we display a message to the user
    //     alert("<b>No</b>. You are using " + result.browserName + " in a regular browser window.");
    //   }
    // }).catch(function (error) { // If there is an error, we display a message to the user & log the error to console
    //   alert("<b>There was an error.</b> Check console for further information. If the problem persists, please <a href='https://github.com/Joe12387/detectIncognito/issues'>report the issue</a> on GitHub.");
    //   console.error(error);
    // });
  }
  GetParentescos() {
    this.clientesGetListService.GetParentescos().subscribe(
      (result : any) => {
        localStorage.setItem('parentesco', window.btoa(JSON.stringify(result)));
      },
      (error : any) => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  GetParentescosChange() {
    this.clientesGetListService.GetParentescos().subscribe(
      (result : any) => {
        localStorage.setItem('parentescoChange', window.btoa(JSON.stringify(result)));
      },
      (error : any ) => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      });
  }
  GetParentescosPeps() {
    this.clientesGetListService.GetParentescosPeps().subscribe(
      (result : any)  => {
        localStorage.setItem('parentescoPeps', window.btoa(JSON.stringify(result)));
      },
      (error : any )  => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      });
  }
  GetTipoContacto() {
    this.clientesGetListService.GetTipoContacto().subscribe(
      (result : any) => {
        localStorage.setItem('contacto', window.btoa(JSON.stringify(result)));
      },
      (error : any )  => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      });
  }
  GetOficinas() {
    this.oficinasService.getOficinas().subscribe(
      (result : any) => {
        localStorage.setItem('oficinas', window.btoa(JSON.stringify(result)));
      },
      (error : any )  => {
        this.notif.onDanger('Error', error);
        console.error(error);
      });
  }
  GetProfesion() {
    this.clientesGetListService.GetProfesion().subscribe(
      (result : any) => {
        localStorage.setItem('profesion', window.btoa(JSON.stringify(result)));
      },
      (error : any )  => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      });
  }
  GetMarcar() {
    this.clientesGetListService.GetMarcas().subscribe(
      (result : any) => {
        localStorage.setItem('marca', window.btoa(JSON.stringify(result)));
      },
      (error : any )  => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      });
  }
  GetConceptosaAll() {
    this.clientesGetListService.GetConceptosAll().subscribe(
      (result : any) => {
        localStorage.setItem('conceptos', window.btoa(JSON.stringify(result)));
      },
      (error : any )  => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      });
  }
  GetPeriodosPago() {
    this.clientesGetListService.GetPeriodosPago().subscribe(
      (result : any) => {
        localStorage.setItem('periodo', window.btoa(JSON.stringify(result)));
      },
      (error : any )  => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      });
  }
//juanes
  isAuthenticated() {
    localStorage.removeItem('token');
    const now: Date = new Date();
    this.loading = true;
    this.loginService.userAuthentication(this.loginFrom.value).subscribe(
      (data: any) => {
        this.loading = false;
        localStorage.setItem('Data', window.btoa(JSON.stringify(data)));
        this.dataUser = data;
        this.SessionUser.Estado = true;
        this.SessionUser.IdUsuario = this.dataUser.IdUsuario;
        this.SessionUser.IdSesionxUsuario = 0;
        this.SessionUser.Oficina = this.dataUser.Oficina;
        const FechaFormat = new DatePipe('en-CO').transform(now, 'yyyy/MM/dd hh:mm:ss');
        this.SessionUser.FechaInicioSesion = FechaFormat;
        this.loginService.PerfilesUsuario(this.dataUser.IdUsuario).subscribe(
          (perfil: any) => {
            localStorage.setItem('profiles', window.btoa(JSON.stringify(perfil)));
            if (this.dataUser.IdEstado === 4) {
              Swal.fire({
                title: 'Advertencia',
                text: '',
                html: 'El usuario se encuentra en estado inactivo. ',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonText: '<i class="glyphicon glyphicon-log-out"></i>  Cerrar',
                cancelButtonText: 'No',
                confirmButtonColor: 'rgb(13,165,80)',
                cancelButtonColor: 'rgb(160,0,87)',
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then((results : any) => {
                if (results.value) {
                  localStorage.removeItem('Data');
                  this.dataUser = null;
                }
              });

            } else {
              this.loading = false;
              localStorage.setItem('userName', window.btoa(JSON.stringify(this.dataUser.Usuario)));
              this.isLoginError = false;
              this.loginService.SetSesionUser(this.SessionUser).subscribe(
                (result : any) => {
                  this.clientesGetListService.GetParentescos().subscribe(
                    (result : any) => {
                      this.loginService.GetToken(this.dataUser.IdUsuario).subscribe((x : any) => {
                        var res = x;
                        localStorage.setItem('token', res.token);
                        this.ValidarMetodosCarga();
                        localStorage.setItem('parentescoChange', window.btoa(JSON.stringify(result)));
                        let browser: any = navigator;
                        let strBrowser: string = browser.userAgentData.brands[1].brand;
                        let perfilLog: any[] = perfil;
                        perfilLog.forEach(x => {
                          delete x.$id;
                          delete x.IdPerfilUsuario;
                        });
                        let payload: any = {
                          UserId : this.dataUser.IdUsuario,
                          Browser: strBrowser,
                          IdOficina: this.dataUser.NumeroOficina,
                          IdTercero: this.dataUser.lngTercero,
                          Json : JSON.stringify(perfilLog)
                        };
                        this.IniciarSesion(payload);
                        // this.loginService.SesionOtroDispositivo(this.dataUser.IdUsuario,strBrowser).subscribe(result => {
                        //   if(result)
                        //   {
                        //     swal({
                        //       title: "Advertencia",
                        //       text: '¿Deseas cerrar la sesión en el navegador anterior?',
                        //       type: 'warning',
                        //       showCancelButton: true,
                        //       confirmButtonText: 'Si',
                        //       cancelButtonText: 'No',
                        //       confirmButtonColor: 'rgb(13,165,80)',
                        //       cancelButtonColor: 'rgb(160,0,87)',
                        //       allowOutsideClick: false,
                        //       allowEscapeKey: false
                        //     }).then((results) => {
                        //       if (results.value) {
                        //         //this.webSocket.Init(1);
                        //         setTimeout(() => {
                        //           this.IniciarSesion(payload);
                        //         }, 500);
                               
                        //       }
                        //      });
                        //   }
                        //   else 
                            
                        // });
                      });
                    },
                    (error : any )  => {
                      const errorMessage = <any>error;
                      this.notif.onDanger('Error', errorMessage);
                      console.error(errorMessage);
                    });
                },
                (error : any )  => {
                  console.error('Error SetSesionUser - ' + error);
                }
              );
            }
          });
      }, (error : any )  => {
        this.loading = false;
        if (error.includes('El usuario se encuentra en estado inactivo.')) {
          Swal.fire({
            title: 'Advertencia',
            text: '',
            html:'El usuario se encuentra en estado inactivo. ',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: '<i class="glyphicon glyphicon-log-out"></i>  Cerrar',
            cancelButtonText: 'No',
            confirmButtonColor: 'rgb(13,165,80)',
            cancelButtonColor: 'rgb(160,0,87)',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((results : any) => {
            if (results.value) {
              localStorage.removeItem('Data');
              this.dataUser = null;
            }
          });
        } else {
          this.loginFrom.controls["Clave"].reset();
          console.log(error);
          this.notif.onDanger('Error', error);
          this.isLoginError = true;
        }
      });
  }
  checkIncognito(): Promise<boolean>{
    return new Promise((resolve) => {
      const fs = (window as any).RequestFileSystem || (window as any).webkitRequestFileSystem;
      if (!fs)
        resolve(false);
      else
        fs((window as any).TEMPORARY, 100, () =>{resolve(false)}, () =>{true})
    })
  }
 async detectionModeIncognito(){
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();
      console.log(usage + " +++ " + quota);
      if (typeof quota === 'number' && quota < 120000000)
        console.log("incognito");
      else
        console.log("not ing")
   }
   else
   console.log("can't not detected")
  }
  IniciarSesion(payload : any) {
    this.usuariosServices.InsertIpUltimaSesion(payload).subscribe((x : any) => {
     window.location.reload();
     window.location.href = this.environment.UrlFront;
    });
  }
  ValidarMetodosCarga(): any {
    const dataProfesion = localStorage.getItem('profesion');
    if (dataProfesion === undefined || dataProfesion === null) {
      this.GetProfesion();
    }
    const dataParent = localStorage.getItem('parentesco');
    if (dataParent === undefined || dataParent === null) {
      this.GetParentescos();
    }
    const dataParentPesp = localStorage.getItem('parentescoPeps');
    if (dataParentPesp === undefined || dataParentPesp === null) {
      this.GetParentescosPeps();
    }
    const dataOficina = localStorage.getItem('oficinas');
    if (dataOficina === undefined || dataOficina === null) {
      this.GetOficinas();
    }
    const dataMarca = localStorage.getItem('marca');
    if (dataMarca === undefined || dataMarca === null) {
      this.GetMarcar();
    }
    const dataTipo = localStorage.getItem('contacto');
    if (dataTipo === undefined || dataTipo === null) {
      this.GetTipoContacto();
    }
    const dataConcepto = localStorage.getItem('conceptos');
    if (dataConcepto === undefined || dataConcepto === null) {
      this.GetConceptosaAll();
    }
    const dataPeriodo = localStorage.getItem('periodo');
    if (dataPeriodo === undefined || dataPeriodo === null) {
      this.GetPeriodosPago();
    }
  }
  validateForm() {
    const Usuario = new FormControl('',
      [
        Validators.required
      ]);
    const Clave = new FormControl('',
      [
        Validators.required
      ]);

    this.loginFrom = new FormGroup({
      Usuario: Usuario,
      Clave: Clave,
    });
  }
}

