import { Component, ElementRef, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { map } from 'rxjs/operators';
import { OperacionesService } from '../../../Services/Maestros/operaciones.service';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { ToastrService } from 'ngx-toastr';
import { StorageSecurity } from '../../../utils/storage-security.util';
declare var $: any;
@Component({
  selector: 'app-log-auditoria',
  templateUrl: './log-auditoria.component.html',
  styleUrls: ['./log-auditoria.component.css'],
  providers: [ ModuleValidationService,OperacionesService],
  standalone : false
})
export class LogAuditoriaComponent implements OnInit {

  
  valueSlectOperacion: number = 0;
  NombreOperacion: string = "";
  Operaciones: any[] = [];//[{ id: 1, descripcion: "Logs General" }, { id: 2, descripcion: "Gestion de clientes" }, { id: 3, descripcion: "item3" }];
  validaOperacion: boolean = true;
  CodModulo : number = 79;
  constructor(private moduleValidationService: ModuleValidationService, private el: ElementRef
    , private operacionesService: OperacionesService, private notif: ToastrService) { 
    this.Permisos();
  }

  ngOnInit() {
    this.GetOperaciones();
    $('#select').focus().select();
    this.IrArriba();
   }

  Permisos() {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  GetOperaciones() {
    const resultDataStore = StorageSecurity.getData();
    if (!resultDataStore) {
      return;
    }
    const payload = {
      IdModulo: this.CodModulo,
      IdUsuario: resultDataStore.IdUsuario,
      IdPerfil: resultDataStore.UsuarioPerfil
    };
    this.operacionesService
      .OperacionesPermitidas(JSON.stringify(payload))
      .subscribe(
        (result: any[]) => {

          result.forEach((element) => {

            if (
              element.IdOperaciones === 91 ||   // Log Generales
              element.IdOperaciones === 92 ||   // Log Gestión de Clientes
              element.IdOperaciones === 93 ||   // Log Mis Productos
              element.IdOperaciones === 94 ||   // Log Asesorías
              element.IdOperaciones === 95 ||   // Log Banner
              element.IdOperaciones === 108 ||  // Log Ficha Análisis
              element.IdOperaciones === 113 ||  // Log Productos Virtuales
              element.IdOperaciones === 114 ||  // Log Autenticación ERP
              element.IdOperaciones === 141 ||  // Log Recaudo Olivos
              element.IdOperaciones === 144     // Log Gestión de Cartera
            ) {
              this.Operaciones.push(element);
            }
          });
        },
        (err) => {
          const errorMessage = <any>err;
          this.notif.error(
            "Error al consultar",
            errorMessage,
            ConfiguracionNotificacion.configRightTopNoClose
          );
          console.log(err);
        }
      );
  }

  opcionSelected()
  {
    if (this.valueSlectOperacion != 0) {
      this.validaOperacion = true;
      this.NombreOperacion = this.Operaciones.filter(x => x.IdOperaciones == this.valueSlectOperacion)[0].ERP_tblOperacion.Descripcion;
    }
    else {
      this.validaOperacion = false;
      this.NombreOperacion = "";
    }     
  }
  operacionBlur() { 
    if (this.valueSlectOperacion == 0) 
      this.validaOperacion = false;
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
