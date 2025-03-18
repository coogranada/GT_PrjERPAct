import { Injectable } from '@angular/core';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { UsuariosService } from '../Maestros/usuarios.service';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { detectIncognito } from 'detectincognitojs';
import {HubConnection,HubConnectionBuilder,HubConnectionState} from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService  {
  connection: any = null;
  backgroundBool: boolean = false;
  timer: number = 1000;
  methodChangeOffice : string = "ChangeOffice";
  private _hubConnection! : HubConnection ;
  constructor(private envirment: EnvironmentService, private usuariosServices: UsuariosService, private router: Router) { 
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
      this._hubConnection = new HubConnectionBuilder().withUrl(this.envirment.UrlCore + "/notify").build();
      this._hubConnection.on("ReceiveMessage", (message : any) => this.newMessage(message));
      this._hubConnection.on("CloseSesion", (message : any) => this.CloseSesion(message));
      this._hubConnection.on(this.methodChangeOffice, (message : any) => this.ChangeOffice(message));
      this._hubConnection.start().then(() => {
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
               return console.error("Error en la conexxion.",error);
             });
    }
    catch(error : any){ 
    }
  }
  Stop(){
      this._hubConnection.stop();
  }
  ChangeOffice(messages : any){
    const obj : any = JSON.parse(messages);
    //console.log("Payload",obj);
    let data : string | null = localStorage.getItem('Data');
    let user = JSON.parse(window.atob(data == null ? "" : data));
    detectIncognito().then((result : any) =>{
      let browser =  {
        browserName : result.browserName,
        isPrivate : result.isPrivate
      }
      //console.log("browser",browser)
      if(obj.userId == user.IdUsuario && (obj.payload.browser.browserName != browser.browserName || obj.payload.browser.isPrivate != browser.isPrivate)){
        this.usuariosServices.ActualizarOficinaUsuario(obj.payload).subscribe(x => {
          localStorage.setItem('Data', window.btoa(JSON.stringify(x)));
          this.Stop();
          window.location.reload();
        });
      }
    });
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
      if (HubConnectionState.Disconnected == this._hubConnection.state)
        this.Init();
      return [];
    })).subscribe();
  }
  Send(method: string, message: string, other: any = null) {
    console.log("Init send " + method + " MESSAGE  " + message + "  " + other)
    if (other == null)
      this._hubConnection.invoke(method, message);
    else
      this._hubConnection.invoke(method, message, other);
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
