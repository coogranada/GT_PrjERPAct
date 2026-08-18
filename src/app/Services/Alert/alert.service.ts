import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../environments/config.noticaciones';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor( private notificacion: ToastrService) { }
  onSuccess(titulo : string, mjs : string){
    this.notificacion.success(titulo, mjs, ConfiguracionNotificacion.configRightTop);
  }
  onWarning(titulo : string, mjs : string){
    this.notificacion.warning(titulo, mjs, ConfiguracionNotificacion.configRightTop);
  }
 onDanger(titulo: string, mjs: any) {
  const mensaje = typeof mjs === 'string'? mjs: JSON.stringify(mjs, null, 2);
  this.notificacion.error(titulo, mensaje, ConfiguracionNotificacion.configRightTop);
  }
  
}
