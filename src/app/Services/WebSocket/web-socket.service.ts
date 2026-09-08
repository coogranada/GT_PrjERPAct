import { Injectable } from '@angular/core';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { UsuariosService } from '../Maestros/usuarios.service';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { detectIncognito } from 'detectincognitojs';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState
} from '@microsoft/signalr';
import { StorageSecurity } from '../../utils/storage-security.util';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private _hubConnection!: HubConnection;
  private bgSubscription: Subscription | null = null;

  sessionClose: boolean = false;
  timer: number = 10000; //  menos agresivo (antes 1s)

  methodChangeOffice: string = "ChangeOffice";
  methodClosedSesion: string = "ClosedSesion";

  constructor(
    private envirment: EnvironmentService,
    private usuariosServices: UsuariosService,
    private router: Router
  ) {

    window.addEventListener("storage", (event: any) => {
      if (event && event.key === "ChangeState") {

        if (event.newValue === this.methodChangeOffice ||
            event.oldValue === this.methodChangeOffice) {
          window.location.reload();
        }
        else if (event.newValue === this.methodClosedSesion ||
                 event.oldValue === this.methodClosedSesion) {
          this.LogginOut();
        }

        localStorage.removeItem("ChangeState");
      }
    });
  }

  TriggerLocal(strParam: string) {
    localStorage.setItem("ChangeState", strParam);
  }

  Init() {
    try {

      this.sessionClose = false;

      //  Evita re-crear conexión si ya está activa
      if (this._hubConnection &&
        this._hubConnection.state === HubConnectionState.Connected) {
        return;
      }

      //  Crear conexión
      this._hubConnection = new HubConnectionBuilder()
        .withUrl(this.envirment.UrlCore + "/notify", {
          withCredentials: true
        })
        .withAutomaticReconnect()
        .build();

      //  Timeouts ajustados
      this._hubConnection.serverTimeoutInMilliseconds = 120000;
      this._hubConnection.keepAliveIntervalInMilliseconds = 15000;

      //  LIMPIAR handlers antes de registrar
      this._hubConnection.off("ReceiveMessage");
      this._hubConnection.off(this.methodClosedSesion);
      this._hubConnection.off(this.methodChangeOffice);

      //  Handlers
      this._hubConnection.on("ReceiveMessage", (message: any) =>
        this.newMessage(message)
      );

      this._hubConnection.on(this.methodClosedSesion, (message: any) =>
        this.CloseSesion(message)
      );

      this._hubConnection.on(this.methodChangeOffice, (message: any) =>
        this.ChangeOffice(message)
      );

      //  Eventos ciclo vida
      this._hubConnection.onreconnecting(error => {
        console.warn("SignalR reconectando...", error);
      });

      this._hubConnection.onreconnected(connectionId => {
        console.log("SignalR reconectado:", connectionId);

        this.joinGroup();
      });

      this._hubConnection.onclose(error => {
        console.warn("SignalR desconectado", error);
      });

      // Start conexión
      this._hubConnection.start()
        .then(() => {
          console.log("SignalR conectado");
          this.joinGroup();
        })
        .catch(error => {
          console.error("Error iniciando SignalR", error);
        });

    } catch (error) {
      console.error("Error general SignalR", error);
    }
  }

  // Unirse al grupo centralizado
 private joinGroup() {
    const user = StorageSecurity.getData();
    if (!user) {
      return;
    }
    this.Send("JoinGroup", user.IdUsuario);
}

  // BACKGROUND CONTROLADO (sin fugas)
  BackGround() {
    if (this.bgSubscription) return;

    this.bgSubscription = interval(this.timer).subscribe(() => {

      if (
        this._hubConnection &&
        this._hubConnection.state === HubConnectionState.Disconnected &&
        !this.sessionClose
      ) {
        console.warn("Reintentando conexión...");
        this.Init();
      }

    });
  }

  // STOP LIMPIO
  Stop() {

    this.sessionClose = true;

    if (this.bgSubscription) {
      this.bgSubscription.unsubscribe();
      this.bgSubscription = null;
    }

    if (this._hubConnection) {
      this._hubConnection.stop();
    }
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

  // HANDLERS

  newMessage(messages: any) {
    console.log(messages);
  }

  ChangeOffice(messages: any) {
    const obj: any = JSON.parse(messages);
    const user = StorageSecurity.getData();

    detectIncognito().then((result: any) => {

      let browser = {
        browserName: result.browserName,
        isPrivate: result.isPrivate
      }

      if (obj.userId == user.IdUsuario &&
        (obj.payload.browser.browserName != browser.browserName ||
          obj.payload.browser.isPrivate != browser.isPrivate)) {

        this.usuariosServices.ActualizarOficinaUsuario(obj.payload)
          .subscribe(x => {
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

  LogginOut() {
    localStorage.clear();
    this.router.navigateByUrl('/Login');
  }
}