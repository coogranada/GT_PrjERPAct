import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormGroup, FormControl } from '@angular/forms';
import { GestionesService } from '../../../Services/Gestiones/gestiones.service';
import { Estados } from '../../../../environments/Estados';
import { GestionGestionesOperacionesComponent } from '../gestion-gestiones-operaciones/gestion-gestiones-operaciones.component';
import { moduloGestionOperacion } from '../../../../environments/config.modulos';
import { Router } from '@angular/router';
import { GestioOperacionesService } from '../../..//Services/Gestiones/gestioOperaciones.service';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-gestiones-operaciones',
  templateUrl: './gestiones-operaciones.component.html',
  styleUrls: ['./gestiones-operaciones.component.css'],
  providers: [GestionesService, GestioOperacionesService],
  standalone : false
})
export class GestionesOperacionesComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('DetalleGestion', { static: false }) gestionOperacionesComponent!: GestionGestionesOperacionesComponent;
  @Output() emitEventJuridico: EventEmitter <any> = new EventEmitter<any>();
  @Output() emitEventContractual: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  public GestionesOperacionesForm!: FormGroup;

  public ListaGestiones = [] = [];
  public Gestiones : any;
  public GestionesPendientes  : any[] = [];
  public GestionesGestionadas : any[] = [];
  public GestionesEnviadasPendientes : any[] = [];
  public GestionesEnviadasGestionadas : any[] = [];

  public DatosUsuario : any;

  @ViewChild('AbrirDetalleGestion', { static: true }) private AbrirDetalleGestion!: ElementRef;
  constructor(private gestionesService: GestionesService, private notificacion: NgxToastService,
    private router: Router, private gestionServiceOperacion: GestioOperacionesService) { }

  ngOnInit() {
    this.loading = true;
    let dataobj : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(dataobj == null ? "" : dataobj));
    this.ValidarFormulario();
    this.Obtener();
  }
  recibirCambioGestiones(data : any) {
    if (data === 'true') {
      this.GestionesPendientes = [];
      this.GestionesGestionadas = [];
      this.GestionesEnviadasPendientes = [];
      this.GestionesEnviadasGestionadas = [];
      this.ListaGestiones = [];
      this.Obtener();
    }
  }
  Obtener() {
    this.ListaGestiones = [];
    this.GestionesPendientes = [];
    this.GestionesGestionadas = [];
    this.GestionesEnviadasPendientes = [];
    this.GestionesEnviadasGestionadas = [];

    this.GestionesOperacionesForm.get('IdUsuario')?.setValue(this.DatosUsuario.IdUsuario);
    this.gestionesService.Obtener(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        this.loading = false;

        this.ListaGestiones = result;
        if (this.ListaGestiones === null || this.ListaGestiones === undefined) {
          this.notificacion.onWarning('Advertencia', 'No se encontró información.');
        } else {
          const _idUsuario = this.DatosUsuario.IdUsuario;
          this.ListaGestiones.forEach((element : any) => {
            if (element.IdUsuarioRecibe === _idUsuario && element.IdEstado === +Estados.GO_Pendiente) {
              this.GestionesPendientes.push(element);
            } else if (element.IdUsuarioRecibe === _idUsuario && element.IdEstado === +Estados.GO_Gestionada) {
              this.GestionesGestionadas.push(element);
            } else if (element.IdUsuarioSolicita === _idUsuario &&
              (element.IdEstado === +Estados.GO_Pendiente || element.IdEstado === +Estados.GO_Rechazada)) {
              this.GestionesEnviadasPendientes.push(element);
            } else if (element.IdUsuarioSolicita === _idUsuario && element.IdEstado === +Estados.GO_Gestionada) {
              this.GestionesEnviadasGestionadas.push(element);
            }
          });
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  VerDetalle(data : any) {
    this.gestionOperacionesComponent.dataDetalleGestion = data;
    this.AbrirDetalleGestion.nativeElement.click();
  }

  Reasignar(data : any) {
    this.gestionOperacionesComponent.dataDetalleGestion = data;
    this.gestionOperacionesComponent.AbrirReasignarGestion();
  }

  Gestionar(data : any) {
    this.gestionOperacionesComponent.dataDetalleGestion = data;
    this.gestionOperacionesComponent.AbrirGestionarGestion();
  }

  Procesar(data : any) {
    this.loading = true;
    const urlModulo = moduloGestionOperacion.validarGestionOpera(data.IdModulo);
    localStorage.setItem('EsGestion', '1');
    localStorage.setItem('DataGest', JSON.stringify(data));
    this.router.navigate([urlModulo]);
    console.log(data);
  }

  Rechazar(data : any) {
    this.gestionOperacionesComponent.dataDetalleGestion = data;
    this.gestionOperacionesComponent.AbriRechazoGestion();
  }

  Cancelar(data : any) {
    this.gestionOperacionesComponent.dataDetalleGestion = data;
    this.gestionOperacionesComponent.AbriCancelarGestion();
  }

  ValidarFormulario() {
    const IdUsuario = new FormControl('', []);
    const filtrarTabla = new FormControl('', []);
    this.GestionesOperacionesForm = new FormGroup({
      IdUsuario: IdUsuario,
      filtrarTabla: filtrarTabla
    });
  }

}
