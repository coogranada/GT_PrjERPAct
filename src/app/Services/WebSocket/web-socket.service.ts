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
export class WebSocketService {
  connection: any = null;
  backgroundBool: boolean = false;
  timer: number = 1000;
  sessionClose : boolean = false;
  methodChangeOffice : string = "ChangeOffice";
  methodClosedSesion : string = "ClosedSesion";
  private _hubConnection! : HubConnection ;
  constructor(private envirment: EnvironmentService, private usuariosServices: UsuariosService, private router: Router) { 
    window.addEventListener("storage", (even: any) => {
      let storage: any = event;
      if (storage != null && storage.key == "ChangeState") {
        if (storage.newValue == this.methodChangeOffice ||  storage.oldValue == this.methodChangeOffice)
          window.location.reload();
        else if (storage.newValue == this.methodClosedSesion ||  storage.oldValue == this.methodClosedSesion) {
          this.LogginOut();
        }        
        localStorage.removeItem("ChangeState");
      } 
    });
  } 
  TriggerLocal(strParam : string) {
    localStorage.setItem("ChangeState", strParam );
  }

  Init() {
  try {
    this.sessionClose = false;

    // ✅ Si ya existe una conexión activa, NO crear otra
    if (this._hubConnection && 
        this._hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this.envirment.UrlCore + "/notify", {
        withCredentials: true
      })
      .withAutomaticReconnect([
        0,        // reintento inmediato
        3000,     // 3 segundos
        10000,    // 10 segundos
        30000     // 30 segundos
      ])
      .build();

    // ✅ Ajustes CRÍTICOS contra timeouts
    this._hubConnection.serverTimeoutInMilliseconds = 120000; // 2 minutos
    this._hubConnection.keepAliveIntervalInMilliseconds = 15000; // 15 seg

    // ✅ Handlers de eventos
    this._hubConnection.on("ReceiveMessage",
      (message: any) => this.newMessage(message));

    this._hubConnection.on(this.methodClosedSesion,
      (message: any) => this.CloseSesion(message));

    this._hubConnection.on(this.methodChangeOffice,
      (message: any) => this.ChangeOffice(message));

    // ✅ Eventos de ciclo de vida (IMPORTANTE)
    this._hubConnection.onreconnecting(error => {
      console.warn("SignalR reconectando...", error);
    });

    this._hubConnection.onreconnected(connectionId => {
      console.log("SignalR reconectado:", connectionId);

      // Volver a unirse al grupo
      const data = localStorage.getItem('Data');
      if (data) {
        const user = JSON.parse(window.atob(data));
        this.Send("JoinGroup", user.IdUsuario);
      }
    });

    this._hubConnection.onclose(error => {
      console.warn("SignalR desconectado", error);
    });

    // ✅ Iniciar conexión
    this._hubConnection.start()
      .then(() => {
        console.log("SignalR conectado");

        const data = localStorage.getItem('Data');
        if (!data) return;

        const user = JSON.parse(window.atob(data));

        // Unirse al grupo
        this.Send("JoinGroup", user.IdUsuario);
      })
      .catch(error => {
        console.error("Error iniciando SignalR", error);
      });

  } catch (error) {
    console.error("Error general SignalR", error);
  }
}
  Stop(){
  this.sessionClose = true;

  if (this._hubConnection) {
    this._hubConnection.stop();
  }
}
  ChangeOffice(messages : any){
    const obj : any = JSON.parse(messages);
    let data : string | null = localStorage.getItem('Data');
    let user = JSON.parse(window.atob(data == null ? "" : data));
    detectIncognito().then((result : any) =>{
      let browser =  {
        browserName : result.browserName,
        isPrivate : result.isPrivate
      }
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
    this.Stop();
    this.LogginOut();
    this.TriggerLocal("CloseSesion");
    localStorage.removeItem("ChangeState");
  }
  BackGround() {
    this.backgroundBool = true;
    interval(this.timer).pipe(switchMap(() => {
      if (HubConnectionState.Disconnected == this._hubConnection.state && this.sessionClose == false)
        this.Init();
      return [];
    })).subscribe();
  }
  Send(method: string, message: string, other: any = null) {

  if (!this._hubConnection ||
      this._hubConnection.state !== HubConnectionState.Connected) {
    return;
  }

  if (other == null) {
    this._hubConnection.invoke(method, message)
      .catch(err => console.error(err));
  } else {
    this._hubConnection.invoke(method, message, other)
      .catch(err => console.error(err));
  }
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
