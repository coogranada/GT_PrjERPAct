import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfiguracionInformesService } from '../../../../../Services/Informes/configuracion-informes.service';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';



@Component({
  selector: 'app-configuracion-informes',
  templateUrl: './configuracion-informes.component.html',
  styleUrl: './configuracion-informes.component.css',
  providers: [OperacionesService, ModuleValidationService],
  standalone: false
})
export class ConfiguracionInformesComponent implements OnInit  {
  CodModulo: number = 83
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';

  public configuracionInformes : any = [];
  tipos: any = [];
  parametros: any = [];
  modulos: any = [];
  selectedRow: any = null;

  
  constructor(private configuracionInformesS: ConfiguracionInformesService,  private notif: ToastrService,  private el: ElementRef, private moduleValidationService: ModuleValidationService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  ngOnInit() {
    this.IrArriba();
    this.obtenerConfiguracionInformes();
  }

  selectRow(parametro: any) {
    this.selectedRow = parametro;
  }

  obtenerConfiguracionInformes() {
    this.configuracionInformesS.ObtenerConfiguracionInformes().subscribe({
      next: (respuesta) => {
        this.configuracionInformes = respuesta;
      },
      error: (err) => {
        console.error('Error al cargar configuración informes:', err);
      }
    });
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

}
