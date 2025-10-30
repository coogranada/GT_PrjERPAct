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
import { AlertService } from '../../Services/Alert/alert.service';
const PrimaryWhite = 'rgb(13,165,80)';
const SecondaryGrey = 'rgb(13,165,80,0.7)';
import { detectIncognito } from "detectincognitojs";
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [OficinasService, ClientesGetListService,UsuariosService,WebSocketService,AlertService],
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
  constructor(private loginService: LoginService, private notif: AlertService,
    private environment: EnvironmentService,private usuariosServices: UsuariosService,
    private clientesGetListService: ClientesGetListService,private route : Router,
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
  }
  GetParentescos() {
    this.clientesGetListService.GetParentescos().subscribe(
      (result : any) => {
        localStorage.setItem('parentesco', window.btoa(JSON.stringify(result)));
      },
      (error : any) => {
        const errorMessage = <any>error;
        // this.notif.onDanger('Error', errorMessage);
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
        // this.notif.onDanger('Error', errorMessage);
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
        // this.notif.onDanger('Error', errorMessage);
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
        // this.notif.onDanger('Error', errorMessage);
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
        // this.notif.onDanger('Error', errorMessage);
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
        // this.notif.onDanger('Error', errorMessage);
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
        // this.notif.onDanger('Error', errorMessage);
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
        // this.notif.onDanger('Error', errorMessage);
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

            } else if(this.dataUser.admEstado === 35){
                Swal.fire({
                  title: 'Advertencia',
                  text: '',
                  html: 'Ingreso no permitido. ',
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
            }else {
              this.loading = false;
              localStorage.setItem('userName', window.btoa(JSON.stringify(this.dataUser.Usuario)));
              this.isLoginError = false;
              this.clientesGetListService.GetParentescos().subscribe(
                (result : any) => {
                  this.loginService.GetToken(this.dataUser.IdUsuario).subscribe(async (x : any) => {
                    var res = x;
                    localStorage.setItem('token', res.token);
                    this.ValidarMetodosCarga();
                    localStorage.setItem('parentescoChange', window.btoa(JSON.stringify(result)));
                    let browser = await detectIncognito();
                    let strBrowser: string = browser.browserName + "-" + (browser.isPrivate == true ? "Incognito" : "No Incognito");
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
                     this.loginService.SesionOtroDispositivo(this.dataUser.IdUsuario,strBrowser).subscribe(result => {
                      if(result)
                       {
                         Swal.fire({
                           title: "Advertencia",
                           text: '¿Deseas cerrar la sesión en el navegador anterior?',
                           icon: 'warning',
                           showCancelButton: true,
                           confirmButtonText: 'Si',
                           cancelButtonText: 'No',
                           confirmButtonColor: 'rgb(13,165,80)',
                           cancelButtonColor: 'rgb(160,0,87)',
                           allowOutsideClick: false,
                           allowEscapeKey: false
                         }).then((results : any) => {
                           if (results.value) {
                             this.webSocket.Init();
                             setTimeout(() => {
                              this.webSocket.Send("ClosedSesion",this.dataUser.IdUsuario);
                             }, 700);
                             setTimeout(() => {
                              this.loginService.SetSesionUser(this.SessionUser).subscribe((result : any) => {
                                this.IniciarSesion(payload);
                              },
                              (error : any )  => {
                                console.error('Error SetSesionUser - ' + error);
                              });   
                             }, 1500);
                           }
                          });
                       } else   
                          this.loginService.SetSesionUser(this.SessionUser).subscribe((result : any) => {
                              this.IniciarSesion(payload);
                          },
                          (error : any )  => {
                            console.error('Error SetSesionUser - ' + error);
                          });   
                    });
                  });
                },
                (error : any )  => {
                  const errorMessage = <any>error;
                  // this.notif.onDanger('Error', errorMessage);
                  console.error(errorMessage);
                });
             
            }
          });
      }, (error : any )  => {
        this.loading = false;
         if (error.TipoAlerta == "Error") {
           Swal.fire({
             title: 'Advertencia',
             text: '',
             html: error.Mensaje,
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
  IniciarSesion(payload : any) {
    this.usuariosServices.InsertIpUltimaSesion(payload).subscribe((x : any) => {
     this.route.navigate(["/"]);
     console.clear();     
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

