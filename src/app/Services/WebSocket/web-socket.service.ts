import { Injectable } from '@angular/core';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { UsuariosService } from '../Maestros/usuarios.service';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginService } from '../Login/login.service';
import { Router } from '@angular/router';
declare const signalR: any;
@Injectable({
  providedIn: 'root'
})
export class WebSocketService  {
  connection: any = null;
  backgroundBool: boolean = false;
  timer: number = 1000;
  constructor(private envirment: EnvironmentService, private usuariosServices: UsuariosService,
    private loginService: LoginService, private router: Router) { 
    window.addEventListener("storage", (even: any) => {
      let storage: any = event;
      if (storage != null && storage.key == "ChangeState") {
        if (storage.newValue == "ChangeOffice" ||  storage.oldValue == "ChangeOffice")
          window.location.reload();
        else if (storage.newValue == "CloseSesion" ||  storage.oldValue == "CloseSesion") {
          this.LogginOut();
        }        
        localStorage.removeItem("ChangeState");
      } 
    });
  } 
  TriggerLocal(strParam : string) {
    localStorage.setItem("ChangeState", strParam );
  }
  ReconnectionSocket(){
    this.Init();
  }
  Init(type : number = 0) {
  try {
    let hubConnection: string = this.envirment.UrlCore + "/notify";
    console.log("ruta",hubConnection)
    this.connection = new signalR.HubConnectionBuilder().withUrl(hubConnection).build();
        this.connection.on("ReceiveMessage", (message : any) => this.newMessage(message));
    this.connection.on("CloseSesion", (message : any) => this.CloseSesion(message));

    this.connection.start().then(() => {
      let data : string | null = localStorage.getItem('Data');
      let user = JSON.parse(window.atob(data == null ? "" : data));
        if (type == 0) {
          if(!this.backgroundBool)
            this.BackGround();
            this.Send("JoinGroup", user.IdUsuario); 
        } else if (type == 1) {
          this.Send("ClosedSesion", user.IdUsuario); 
        }
      }).catch((error : any) => {
        return console.error("Error en la conexxion.",JSON.parse(error));
      });
    } catch (error) {
      console.error("Error en la conexion.",error);
    }
  }
  CloseSesion(message: any) {
    console.log("close sesion", message);
    this.LogginOut();
    this.TriggerLocal("CloseSesion");
    localStorage.removeItem("ChangeState");
  }
  BackGround() {
    this.backgroundBool = true;
    interval(this.timer).pipe(switchMap(() => {
      if (signalR.HubConnectionState.Disconnected == this.connection.state)
        this.Init();
      return [];
    })).subscribe();
  }
  Send(method: string, message: string, other: any = null) {
    console.log("Init send " + method + " MESSAGE  " + message + "  " + other)
    if (other == null)
      this.connection.invoke(method, message);
    else
      this.connection.invoke(method, message, other);
  }
  newMessage(messages: any) {
    console.log(messages);
  }
  LogginOut() {
    localStorage.setItem('Data', "");
    this.router.navigateByUrl('/Login');
    localStorage.removeItem('userName');
    localStorage.removeItem('dataUserConect');
    localStorage.removeItem('TerceroNatura');
    localStorage.removeItem('IdModuloActivo');
    localStorage.removeItem('Data')
  }
}
