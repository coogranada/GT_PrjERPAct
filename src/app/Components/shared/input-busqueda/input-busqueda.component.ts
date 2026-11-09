import { Component, ElementRef, inject, input, output, signal, viewChild, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { ERP_MESSAGES, ERP_TOAST } from '../../../utils/constant';
import { LoadingService } from '../../../Services/shared/loading.service';

export interface LookupColumn {
  field: string;
  header: string;
}

@Component({
  selector: 'app-input-busqueda',
  imports: [ReactiveFormsModule],
  templateUrl: './input-busqueda.component.html'
})
export class InputBusquedaComponent {

  private notif = inject(ToastrService);
  private loading = inject(LoadingService);


  // Visuales
  label = input.required<string>();
  requerido = input<boolean>(false);

  colCodigo = input<number>(2);
  colDescripcion = input<number>(7);
  colBoton = input<number>(1);

  @ViewChild('modal')
  modal!: ElementRef;

  codigoInputRef = viewChild<ElementRef<HTMLInputElement>>('codigoInput');

  //Peticiones
  buscarPorCodigoObs = input.required<
    (codigo: string) => Observable<any>
  >();

  buscarPorDescripcionObs = input.required<
    (texto: string) => Observable<any[]>
  >();

  // Form controls
  codigoControl = input.required<FormControl>();
  descripcionControl = input.required<FormControl>();

  // Modal
  titulo = input<string>('Búsqueda');

  // Tabla
  items: any[] = [];
  columns = input<LookupColumn[]>([]);

  // Estado botón
  disabled = input<boolean>(false);

  // Eventos
  selected = output<any>();

  //Acceso propiedades
  codigoField = input.required<string>();
  descripcionField = input.required<string>();

  mensajeNoEncontrado = input<string>(ERP_MESSAGES.REGISTRO_NO_ENCONTRADO);
  permitirBusquedaVacia = input<boolean>(false);


  private obtenerCodigo(item: any): any {
    return item?.[this.codigoField()];
  }

  private obtenerDescripcion(item: any): any {
    return item?.[this.descripcionField()];
  }

  onCodigoInput() {
    this.descripcionControl().setValue('', { emitEvent: false });
  }

  onDescripcionInput() {
    this.codigoControl().setValue(null, { emitEvent: false });
  }

  buscarPorCodigo(): void {
    const valor = this.codigoControl().value;
    if (!valor) return;

    this.loading.show();
    this.buscarPorCodigoObs()(valor).subscribe({
      next: results => {
        this.loading.hide();
        if (results.length === 0) {
          this.notif.warning(ERP_TOAST.WARNING, this.mensajeNoEncontrado(), ConfiguracionNotificacion.configRightTop);
          return;
        }

        if (results.length === 1) {
          const item = results[0];
          this.mapearDatos(item);
          return;
        }
      },
      error: err => {
        this.loading.hide();
      }
    });
  }

  buscarPorDescripcion(): void {
    const texto = String(
      this.descripcionControl().value ?? ''
    ).replace(/\s{2,}/g, ' ').trim();

    if (!this.permitirBusquedaVacia() && !texto) return;

    this.loading.show();
    this.buscarPorDescripcionObs()(texto).subscribe({
      next: results => {
        this.loading.hide();

        if (results.length === 0) {
          this.notif.warning(ERP_TOAST.WARNING, this.mensajeNoEncontrado(), ConfiguracionNotificacion.configRightTop);
          return;
        }

        if (results.length === 1) {
          const item = results[0];
          this.mapearDatos(item);
          return;
        }

        if (results.length > 1) {
          this.items = results;
          ($(this.modal.nativeElement) as any).modal('show');

        }
      },
      error: () => {
        this.loading.hide();
      }
    });
  }

  mapearDatos(data: any) {
    this.codigoControl().setValue(this.obtenerCodigo(data), { emitEvent: false });
    this.descripcionControl().setValue(this.obtenerDescripcion(data), { emitEvent: false });
    this.selected.emit(data);
  }

  seleccionar(item: any): void {
    this.mapearDatos(item);
    ($(this.modal.nativeElement) as any).modal('hide');
  }

  obtenerValor(item: any, field: string): any {
    return item?.[field];
  }

}