import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../environments/config.noticaciones';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private notificacion: ToastrService
  ) { }

  onSuccess(titulo: string, mjs: string): void {
    this.notificacion.success(
      mjs,
      titulo,
      ConfiguracionNotificacion.configRightTop
    );
  }

  onWarning(titulo: string, mjs: string): void {
    this.notificacion.warning(
      mjs,
      titulo,
      ConfiguracionNotificacion.configRightTop
    );
  }

  onDanger(titulo: string, mjs: any): void {

    const mensaje =
      typeof mjs === 'string'
        ? mjs
        : JSON.stringify(mjs, null, 2);

    this.notificacion.error(
      mensaje,
      titulo,
      ConfiguracionNotificacion.configRightTop
    );
  }
}