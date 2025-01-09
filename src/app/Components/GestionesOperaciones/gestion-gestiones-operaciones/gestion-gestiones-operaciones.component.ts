import { Component, OnInit, ViewChild, ElementRef, Input, Output } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormGroup, ValidatorFn, AbstractControl, FormControl, Validators } from '@angular/forms';

import {
  GestiarModel, GestionModelLog, GestionarCancelacionDto, GestionarReasignacionDto,
  GestionesGestionadasDto
} from '../../../Models/Gestiones/gestiones.model';
import { EventEmitter } from '@angular/core';
import { GestionesService } from '../../../Services/Gestiones/gestiones.service';
import { GeneralesService } from '../../../Services/Productos/generales.service';
import { moduloAGestionar } from '../../../../environments/config.modulos';
import { NgxToastService } from 'ngx-toast-notifier';

const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-gestion-gestiones-operaciones',
  templateUrl: './gestion-gestiones-operaciones.component.html',
  styleUrls: ['./gestion-gestiones-operaciones.component.css'],
  providers: [GestionesService, GeneralesService],
  standalone : false
})
export class GestionGestionesOperacionesComponent implements OnInit {
  //#region declaracion de variables
  @ViewChild('AbrirSolicitud', { static: true }) private AbrirSolicitud!: ElementRef;
  @ViewChild('AbrirSolicitudDetalle', { static: true }) private AbrirSolicitudDetalle!: ElementRef;
  @ViewChild('AbriGestionarGestion', { static: true }) private AbriGestionarGestion!: ElementRef;
  @ViewChild('AbrirRechzarGestion', { static: true }) private AbrirRechzarGestion!: ElementRef;
  @ViewChild('AbrirCancelGestion', { static: true }) private AbrirCancelGestion!: ElementRef;
  @ViewChild('AbrirReasignacion', { static: true }) private AbrirReasignacion!: ElementRef;
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('CerrarModales', { static: true }) CerrarModales!: ElementRef;
  @ViewChild('CerrarModalesCancel', { static: true }) CerrarModalesCancel!: ElementRef;
  @ViewChild('CerrarModalesRechazo', { static: true }) CerrarModalesRechazo!: ElementRef;
  @ViewChild('CerrarModalesGestion', { static: true }) CerrarModalesGestion!: ElementRef;


  @Input() dataDetalleGestion: any;
  @Output() GestionoOpe = new EventEmitter();

  public loading = false;
  public bloquearForm = true;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  public SolicitudGestionForm!: FormGroup;
  public SolicitudGestionDetalleForm!: FormGroup;
  public GestionesForm!: FormGroup;
  public ListaOperaciones: any[] = [];
  public ListaEstados : any[] = [];
  public ListaOperacionesDetalle: any[] = [];
  public ListaEstadosDetalle : any[] = [];
  public DatosUsuario : any;
  public UsuariosAutorizados : any;
  public Modulo : number = 0;

  // GestionesOperacionesComponent

  public Operacion = true;
  public EnviarA : boolean | null = true;
  public Cuenta = true;
  public Documento = true;
  public UsuarioSolicita = true;
  public Estado = true;

  public mostrarSpanAlertaCancel = false;
  public mostrarSpanAlertaRechazo = false;
  public mostrarSpanAlertaGestion = false;
  public mostrarSpanAlertaReasignar = false;
//#endregion
  constructor(private gestionesService: GestionesService, private notificacion: NgxToastService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.ValidarFormulario();
    this.ValidarFormularioDetalle();
    this.ValidarFormularioGestiones();
    this.GestionoOpe.emit('false');
  }

  //#region Metodos principales y de carga
  AbrirDetalleGestion() {
    this.AbrirSolicitud.nativeElement.click();
  }

  AbrirDetalle() {
    this.SolicitudGestionDetalleForm.reset();
    console.log(this.dataDetalleGestion);
    this.gestionesService.ObtenerOperaciones(this.dataDetalleGestion.IdModulo).subscribe(
      result => {
        this.ListaOperacionesDetalle = result;
        result.forEach((elementOpera : any) => {
          if (elementOpera.IdOperacion === this.dataDetalleGestion.IdOperacion) {
            this.SolicitudGestionDetalleForm.get('IdOperacion')?.setValue(elementOpera);
          }
        });
    });

    this.SolicitudGestionDetalleForm.get('Cuenta')?.setValue(this.dataDetalleGestion.Cuenta);
    this.gestionesService.ObtenerEstados().subscribe(
      result => {
        this.ListaEstadosDetalle = result;
        result.forEach((elementEstado : any) => {
          if (elementEstado.IdLista === this.dataDetalleGestion.IdEstado) {
            this.SolicitudGestionDetalleForm.get('IdEstado')?.setValue(elementEstado);
          }
        });
      });

    this.SolicitudGestionDetalleForm.get('Documento')?.setValue(this.dataDetalleGestion.Documento);
    this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.setValue(this.dataDetalleGestion.NombreUsuarioRecibe);
    this.SolicitudGestionDetalleForm.get('UsuarioSolicita')?.setValue(this.dataDetalleGestion.NombreUsuarioSolicita);
    this.SolicitudGestionDetalleForm.get('Observacion')?.setValue(this.dataDetalleGestion.Observacion);
    this.AbrirSolicitudDetalle.nativeElement.click();
  }

  AbrirGestionarGestion() {
    this.GestionesForm.reset();
    this.SolicitudGestionDetalleForm.reset();
    console.log(this.dataDetalleGestion);
    this.SolicitudGestionDetalleForm.get('IdOperacion')?.setValue(this.dataDetalleGestion.IdOperacion);
    this.SolicitudGestionDetalleForm.get('Cuenta')?.setValue(this.dataDetalleGestion.IdCuenta);
    this.SolicitudGestionDetalleForm.get('IdEstado')?.setValue(this.dataDetalleGestion.IdEstado);
    this.SolicitudGestionDetalleForm.get('IdGestionOperacion')?.setValue(this.dataDetalleGestion.IdGestionOperacion);
    this.SolicitudGestionDetalleForm.get('Documento')?.setValue(this.dataDetalleGestion.Documento);
    this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.setValue(this.dataDetalleGestion.IdUsuarioRecibe);
    this.SolicitudGestionDetalleForm.get('UsuarioSolicita')?.setValue(this.dataDetalleGestion.IdUsuarioSolicita);
    this.SolicitudGestionDetalleForm.get('IdModulo')?.setValue(this.dataDetalleGestion.IdModulo);
    this.SolicitudGestionDetalleForm.get('IdOficina')?.setValue(this.dataDetalleGestion.IdOficina);
    this.SolicitudGestionDetalleForm.get('Observacion')?.setValue(this.dataDetalleGestion.Observacion);
    this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.setValue('');
    this.AbriGestionarGestion.nativeElement.click();
  }

  AbriRechazoGestion() {
    this.GestionesForm.reset();
    this.SolicitudGestionDetalleForm.reset();
    console.log(this.dataDetalleGestion);
    this.SolicitudGestionDetalleForm.get('IdOperacion')?.setValue(this.dataDetalleGestion.IdOperacion);
    this.SolicitudGestionDetalleForm.get('Cuenta')?.setValue(this.dataDetalleGestion.IdCuenta);
    this.SolicitudGestionDetalleForm.get('IdEstado')?.setValue(this.dataDetalleGestion.IdEstado);
    this.SolicitudGestionDetalleForm.get('IdGestionOperacion')?.setValue(this.dataDetalleGestion.IdGestionOperacion);
    this.SolicitudGestionDetalleForm.get('Documento')?.setValue(this.dataDetalleGestion.Documento);
    this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.setValue(this.dataDetalleGestion.IdUsuarioRecibe);
    this.SolicitudGestionDetalleForm.get('UsuarioSolicita')?.setValue(this.dataDetalleGestion.IdUsuarioSolicita);
    this.SolicitudGestionDetalleForm.get('IdModulo')?.setValue(this.dataDetalleGestion.IdModulo);
    this.SolicitudGestionDetalleForm.get('Observacion')?.setValue(this.dataDetalleGestion.Observacion);
    this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.setValue('');
    this.AbrirRechzarGestion.nativeElement.click();
  }

  AbriCancelarGestion() {
    this.GestionesForm.reset();
    this.SolicitudGestionDetalleForm.reset();
    console.log(this.dataDetalleGestion);
    this.SolicitudGestionDetalleForm.get('IdOperacion')?.setValue(this.dataDetalleGestion.IdOperacion);
    this.SolicitudGestionDetalleForm.get('Cuenta')?.setValue(this.dataDetalleGestion.IdCuenta);
    this.SolicitudGestionDetalleForm.get('IdEstado')?.setValue(this.dataDetalleGestion.IdEstado);
    this.SolicitudGestionDetalleForm.get('IdGestionOperacion')?.setValue(this.dataDetalleGestion.IdGestionOperacion);
    this.SolicitudGestionDetalleForm.get('Documento')?.setValue(this.dataDetalleGestion.Documento);
    this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.setValue(this.dataDetalleGestion.IdUsuarioRecibe);
    this.SolicitudGestionDetalleForm.get('UsuarioSolicita')?.setValue(this.dataDetalleGestion.IdUsuarioSolicita);
    this.SolicitudGestionDetalleForm.get('IdModulo')?.setValue(this.dataDetalleGestion.IdModulo);
    this.SolicitudGestionDetalleForm.get('Observacion')?.setValue(this.dataDetalleGestion.Observacion);
    this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.setValue('');
    this.AbrirCancelGestion.nativeElement.click();
  }

  AbrirReasignarGestion() {
    this.SolicitudGestionDetalleForm.reset();
    console.log(this.dataDetalleGestion);
    this.gestionesService.ObtenerOperaciones(this.dataDetalleGestion.IdModulo).subscribe(
      result => {
        this.ListaOperacionesDetalle = result;
        result.forEach((elementOpera : any) => {
          if (elementOpera.IdOperacion === this.dataDetalleGestion.IdOperacion) {
            this.SolicitudGestionDetalleForm.get('IdOperacion')?.setValue(elementOpera);
          }
        });
      });

    this.SolicitudGestionDetalleForm.get('Cuenta')?.setValue(this.dataDetalleGestion.Cuenta);
    this.gestionesService.ObtenerEstados().subscribe(
      result => {
        this.ListaEstadosDetalle = result;
        result.forEach((elementEstado : any) => {
          if (elementEstado.IdLista === this.dataDetalleGestion.IdEstado) {
            this.SolicitudGestionDetalleForm.get('IdEstado')?.setValue(elementEstado);
          }
        });
      });

    this.gestionesService.ObtenerUsuariosAutorizados(this.dataDetalleGestion.IdOperacion, this.dataDetalleGestion.IdModulo).subscribe(
        result => {
          this.loading = false;
          this.UsuariosAutorizados = result;
          if (this.UsuariosAutorizados !== null && this.UsuariosAutorizados !== undefined) {
            this.UsuariosAutorizados.forEach((element : any) => {
              element.Nombre = element.Nombre.replace(/,/g, ' ');
            });
          }
      });
    this.SolicitudGestionDetalleForm.get('IdModulo')?.setValue(this.dataDetalleGestion.IdModulo);
    this.SolicitudGestionDetalleForm.get('IdGestionOperacion')?.setValue(this.dataDetalleGestion.IdGestionOperacion);
    this.SolicitudGestionDetalleForm.get('Documento')?.setValue(this.dataDetalleGestion.Documento);
    this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.setValue(this.dataDetalleGestion.NombreUsuarioRecibe);
    this.SolicitudGestionDetalleForm.get('UsuarioSolicita')?.setValue(this.dataDetalleGestion.NombreUsuarioSolicita);
    this.SolicitudGestionDetalleForm.get('Observacion')?.setValue(this.dataDetalleGestion.Observacion);
    this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.reset();
    this.AbrirReasignacion.nativeElement.click();
  }

  GenerarCuenta(PIdOficina : string, PProducto : string, PConsecutivo : string, PDigito : string) {
    this.loading = true;
    this.gestionesService.GenerarCuenta(PIdOficina, PProducto, PConsecutivo, PDigito).subscribe(
      result => {
        this.loading = false;
        const _cuenta = result;
        this.SolicitudGestionForm.get('Cuenta')?.setValue(_cuenta);
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  ObtenerOperaciones(PModulo : string) {
    this.loading = true;
    this.gestionesService.ObtenerOperaciones(PModulo).subscribe(
      result => {
        this.loading = false;
        this.ListaOperaciones = result;
        this.ListaOperacionesDetalle = result;
        this.SolicitudGestionForm.get('IdOperacion')?.setValue('-');
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  OperacionSeleccionada() {
    this.UsuariosAutorizados = null;
    const _operacion = this.SolicitudGestionForm.get('IdOperacion')?.value;
    if (_operacion !== null && _operacion !== undefined && _operacion !== '-') {
      this.ObtenerUsuariosAutorizados(_operacion.IdOperacion);
      this.EnviarA = null;
    } else {
      this.EnviarA = false;
      this.SolicitudGestionForm.get('IdUsuarioRecibe')?.setValue('');
    }
  }

  ValidarSeleccionUsuario() {
    const _usuario = this.SolicitudGestionForm.get('IdUsuarioRecibe')?.value;
    if (_usuario !== null) {
      if (_usuario.IdUsuario === null || _usuario.IdUsuario === undefined) {
        this.notificacion.onWarning('Advertencia','Debe seleccionar un usuario.');
        this.SolicitudGestionForm.get('IdUsuarioRecibe')?.reset();
      }
    }
  }

  Limpiar() {
    this.SolicitudGestionForm.get('IdOperacion')?.setValue('');
    this.SolicitudGestionForm.get('Cuenta')?.setValue('');
    this.SolicitudGestionForm.get('Documento')?.setValue('');
    this.SolicitudGestionForm.get('IdEstado')?.setValue('');
    this.SolicitudGestionForm.get('Observacion')?.setValue('');
    this.SolicitudGestionForm.get('IdUsuarioSolicita')?.setValue('');
    this.SolicitudGestionForm.get('UsuarioSolicita')?.setValue('');
    this.SolicitudGestionForm.get('NombreUsuarioSolicita')?.setValue('');
    this.SolicitudGestionForm.get('IdUsuarioRecibe')?.setValue('');
    this.SolicitudGestionForm.get('IdOficina')?.setValue('');
    this.SolicitudGestionForm.get('IdProducto')?.setValue('');
    this.SolicitudGestionForm.get('IdConsecutivo')?.setValue('');
    this.SolicitudGestionForm.get('IdDigito')?.setValue('');
  }

  Enviar() {

  }

  ObtenerDatosUsuario() {
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
    this.SolicitudGestionForm.get('UsuarioSolicita')?.setValue(this.DatosUsuario.Usuario);
    this.SolicitudGestionForm.get('IdUsuarioSolicita')?.setValue(this.DatosUsuario.IdUsuario);
    this.SolicitudGestionForm.get('NombreUsuarioSolicita')?.setValue(this.DatosUsuario.Nombre);
  }

  ObtenerEstados() {
    this.loading = true;
    this.gestionesService.ObtenerEstados().subscribe(
      result => {
        this.loading = false;
        this.ListaEstados = result;
        this.ListaEstadosDetalle = result;
        if (this.ListaEstados !== null && this.ListaEstados !== undefined) {
          this.SolicitudGestionForm.get('IdEstado')?.setValue(result[0]);
        }
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  ObtenerUsuariosAutorizados(POperacion: any) {
    this.loading = true;
    this.gestionesService.ObtenerUsuariosAutorizados(POperacion, this.Modulo.toString()).subscribe(
      result => {
        this.loading = false;
        this.UsuariosAutorizados = result;
        if (this.UsuariosAutorizados !== null && this.UsuariosAutorizados !== undefined) {
          this.UsuariosAutorizados.forEach((element : any) => {
            element.Nombre = element.Nombre.replace(/,/g, ' ');
          });
        }
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }
  //#endregion

  //#region Metodos funcionales
  GestionarGestio(data : any, opera : any) {
    const observa = this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.value;
    if (observa !== null && observa !== undefined && observa !== '') {
      const _objGestionarModel = new GestiarModel();
      console.log(this.dataDetalleGestion);
      _objGestionarModel.IdGestionOperacion = data.IdGestionOperacion;
      _objGestionarModel.IdEstado = opera;
      _objGestionarModel.ObservacionGestion = data.ObservacionGestion;
      _objGestionarModel.FechaActualizacion = null;

      // aqui agregar el modelo para enviar al log mañana.
      const _objGestionesModel = new GestionModelLog();
      _objGestionesModel.IdUsuarioSolicita = data.UsuarioSolicita;
      _objGestionesModel.IdUsuarioRecibe = data.IdUsuarioRecibe;
      _objGestionesModel.IdModulo = data.IdModulo;
      _objGestionesModel.IdOperacion = data.IdOperacion;
      _objGestionesModel.IdEstado = opera;
      _objGestionesModel.Documento = data.Documento;
      _objGestionesModel.Observacion = data.Observacion;
      _objGestionesModel.Cuenta = data.Cuenta;
      _objGestionesModel.ObservacionGestion = data.ObservacionGestion;
      _objGestionesModel.FechaSolicitud = this.dataDetalleGestion.FechaSolicitud;
      _objGestionesModel.IdGestionOperacion = data.IdGestionOperacion;

      // aqui se llena el objeto de la gestion realizada
      const _objGestionesGestionadas = new GestionesGestionadasDto();
      _objGestionesGestionadas.UsuarioSolicita = this.dataDetalleGestion.NombreUsuarioSolicita;
      _objGestionesGestionadas.UsuarioRecibe = this.dataDetalleGestion.NombreUsuarioRecibe;
      _objGestionesGestionadas.IdUsuarioRecibe = this.dataDetalleGestion.IdUsuarioSolicita;
      _objGestionesGestionadas.FechaSolicitud = this.dataDetalleGestion.FechaSolicitud;
      _objGestionesGestionadas.IdGestionOperacion = data.IdGestionOperacion;
      _objGestionesGestionadas.NombreOperacion = this.dataDetalleGestion.NombreOperacion;
      _objGestionesGestionadas.Estado = opera;
      _objGestionesGestionadas.Documento = data.Documento;
      _objGestionesGestionadas.Cuenta = this.dataDetalleGestion.Cuenta;
      _objGestionesGestionadas.Observacion = data.ObservacionGestion;

      _objGestionarModel.GestionDto = _objGestionesGestionadas;


      this.gestionesService.GestionarGestion(JSON.stringify(_objGestionarModel)).subscribe(
        result => {
          if (result) {
            this.notificacion.onSuccess('Exitoso', 'La gestion se realizó correctamente.');
            this.mostrarSpanAlertaGestion = false;
            this.CerrarModalesGestion.nativeElement.click();
            this.GuardarLogGestionOperaciones(_objGestionesModel);
            this.GestionoOpe.emit('true');
          } else {
            this.GestionoOpe.emit('false');
            this.notificacion.onWarning('Advertencia', 'La gestión no se realizo correctamente.');
          }
        });
    } else {
      this.mostrarSpanAlertaGestion = true;
    }
  }

  GestionarRechazo(data : any, opera : any) {
    const observa = this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.value;
    if (observa !== null && observa !== undefined && observa !== '') {
    const _objGestionarModel = new GestiarModel();
    console.log(this.dataDetalleGestion);
    _objGestionarModel.IdGestionOperacion = data.IdGestionOperacion;
    _objGestionarModel.IdEstado = opera;
    _objGestionarModel.ObservacionGestion = data.ObservacionGestion;
    _objGestionarModel.FechaActualizacion = null;

    // aqui agregar el modelo para enviar al log mañana.
    const _objGestionesModel = new GestionModelLog();
    _objGestionesModel.IdUsuarioSolicita = data.UsuarioSolicita;
    _objGestionesModel.IdUsuarioRecibe = data.IdUsuarioRecibe;
    _objGestionesModel.IdModulo = data.IdModulo;
    _objGestionesModel.IdOperacion = data.IdOperacion;
    _objGestionesModel.IdEstado = opera;
    _objGestionesModel.Documento = data.Documento;
    _objGestionesModel.Observacion = data.Observacion;
    _objGestionesModel.Cuenta = data.Cuenta;
    _objGestionesModel.ObservacionGestion = data.ObservacionGestion;
    _objGestionesModel.FechaSolicitud = this.dataDetalleGestion.FechaSolicitud;
    _objGestionesModel.IdGestionOperacion = data.IdGestionOperacion;

    // aqui agrega el modelo para el rechazo
    const _objGestionRechazo = new GestionarCancelacionDto();
    _objGestionRechazo.UsuarioSolicita = this.dataDetalleGestion.NombreUsuarioSolicita;
    _objGestionRechazo.UsuarioRecibe = this.dataDetalleGestion.NombreUsuarioRecibe;
    _objGestionRechazo.IdUsuarioRecibe = this.dataDetalleGestion.IdUsuarioSolicita;
    _objGestionRechazo.NombreOperacion = this.dataDetalleGestion.NombreOperacion;
    _objGestionRechazo.Estado = opera;
    _objGestionRechazo.Documento = data.Documento;
    _objGestionRechazo.IdGestionOperacion = this.dataDetalleGestion.IdGestionOperacion;
    _objGestionRechazo.Cuenta = this.dataDetalleGestion.Cuenta;
    _objGestionRechazo.Observacion = data.ObservacionGestion;
    _objGestionRechazo.FechaSolicitud = this.dataDetalleGestion.FechaSolicitud;

    _objGestionarModel.CancelacionDto = _objGestionRechazo;

    this.gestionesService.GestionarGestion(JSON.stringify(_objGestionarModel)).subscribe(
      result => {
        if (result) {
          this.notificacion.onSuccess('Exitoso', 'La gestion se realizó correctamente.');
          this.CerrarModalesRechazo.nativeElement.click();
          this.GuardarLogGestionOperaciones(_objGestionesModel);
          this.GestionoOpe.emit('true');
        } else {
          this.GestionoOpe.emit('false');
          this.notificacion.onWarning('Advertencia', 'La gestión no se realizo correctamente.');
        }
      });
    } else {
      this.mostrarSpanAlertaRechazo = true;
    }
  }

  GestionarReasignacion(data : any, opera : any) {
      if (this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.value !== undefined &&
        this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.value !== null &&
        this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.value !== '') {
          let datao : string | null = localStorage.getItem('Data');
        this.DatosUsuario = JSON.parse(window.atob(datao == null ? "" : datao));
        const UsuarioRecibe = this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.value.IdUsuario;
        if (this.DatosUsuario.IdUsuario !== UsuarioRecibe) {
          if (this.SolicitudGestionDetalleForm.get('Observacion')?.value !== undefined &&
            this.SolicitudGestionDetalleForm.get('Observacion')?.value !== null &&
            this.SolicitudGestionDetalleForm.get('Observacion')?.value !== '') {
            const _objGestionarModel = new GestiarModel();
            console.log(this.dataDetalleGestion);
            _objGestionarModel.IdGestionOperacion = Number(data.IdGestionOperacion);
            _objGestionarModel.IdEstado = opera;
            _objGestionarModel.ObservacionGestion = data.Observacion;
            _objGestionarModel.FechaActualizacion = null;
            _objGestionarModel.IdUsuarioEnvie = data.IdUsuarioRecibe.IdUsuario;

            // aqui agregar el modelo para enviar al log mañana.
            const _objGestionesModel = new GestionModelLog();
            _objGestionesModel.IdUsuarioSolicita = this.dataDetalleGestion.IdUsuarioSolicita;
            if (data.IdUsuarioRecibe.IdUsuario !== undefined && data.IdUsuarioRecibe.IdUsuario !== null) {
              _objGestionesModel.IdUsuarioRecibe = data.IdUsuarioRecibe.IdUsuario;
            } else {
              _objGestionesModel.IdUsuarioRecibe = data.IdUsuarioRecibe;
            }

            _objGestionesModel.IdModulo = data.IdModulo;
            if (data.IdOperacion.IdOperacion !== undefined && data.IdOperacion.IdOperacion !== null) {
              _objGestionesModel.IdOperacion = data.IdOperacion.IdOperacion;
            } else {
              _objGestionesModel.IdOperacion = data.IdOperacion;
            }
            _objGestionesModel.IdEstado = opera;
            _objGestionesModel.Documento = data.Documento;
            _objGestionesModel.Observacion = data.Observacion;
            _objGestionesModel.Cuenta = data.Cuenta;
            _objGestionesModel.ObservacionGestion = data.Observacion;
            _objGestionesModel.FechaSolicitud = this.dataDetalleGestion.FechaSolicitud;
            _objGestionesModel.IdGestionOperacion = data.IdGestionOperacion;

            // aqui se asigna al modelo de reasignar
            const _objGestionReasignacion = new GestionarReasignacionDto();
            _objGestionReasignacion.UsuarioSolicita = this.dataDetalleGestion.NombreUsuarioSolicita;
            _objGestionReasignacion.UsuarioRecibeViejo = this.dataDetalleGestion.NombreUsuarioRecibe;
            _objGestionReasignacion.IdUsuarioRecibeViejo = this.dataDetalleGestion.IdUsuarioRecibe;
            _objGestionReasignacion.UsuarioRecibeNuevo = data.IdUsuarioRecibe.Nombre;
            _objGestionReasignacion.IdUsuarioRecibeNuevo = data.IdUsuarioRecibe.IdUsuario;
            _objGestionReasignacion.NombreOperacion = this.dataDetalleGestion.NombreOperacion;
            _objGestionReasignacion.Estado = opera;
            _objGestionReasignacion.Documento = data.Documento;
            _objGestionReasignacion.IdGestionOperacion = this.dataDetalleGestion.IdGestionOperacion;
            _objGestionReasignacion.Cuenta = data.Cuenta;
            _objGestionReasignacion.Observacion = data.Observacion;
            _objGestionReasignacion.FechaSolicitud = this.dataDetalleGestion.FechaSolicitud;
            const urlModulo = moduloAGestionar.validarModuloGestionar(data.IdModulo);
            // window.open('/' + urlModulo + '');
            _objGestionReasignacion.urlModulo = urlModulo;

            _objGestionarModel.ReasinacionDto = _objGestionReasignacion;

            this.gestionesService.GestionarGestion(_objGestionarModel).subscribe(
              result => {
                if (result) {
                  this.mostrarSpanAlertaReasignar = false;
                  this.notificacion.onSuccess('Exitoso', 'La gestion se reasignó correctamente.');
                  this.CerrarModales.nativeElement.click();
                  //  mirar como recargar los datos de la tabla
                  this.GuardarLogGestionOperaciones(_objGestionesModel);
                  this.GestionoOpe.emit('true');
                } else {
                  this.GestionoOpe.emit('false');
                  this.notificacion.onWarning('Advertencia', 'La gestión no se reasignó correctamente.');
                }
              });
          } else {
            this.mostrarSpanAlertaReasignar = true;
          }
        } else {
        this.SolicitudGestionDetalleForm.get('IdUsuarioRecibe')?.reset();
          this.notificacion.onWarning('Advertencia', 'No se puede asignar la gestión al mismo usuario.');
      }
      } else {
        this.notificacion.onWarning('Advertencia', 'Debe seleccionar un destinatario');
      }
  }

  GestionarCancelacion(data : any, opera : any) {
    const observa = this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.value;
    if (observa !== null && observa !== undefined && observa !== '') {
      this.mostrarSpanAlertaCancel = false;
      const _objGestionarModel = new GestiarModel();
      console.log(this.dataDetalleGestion);
      _objGestionarModel.IdGestionOperacion = data.IdGestionOperacion;
      _objGestionarModel.IdEstado = opera;
      _objGestionarModel.ObservacionGestion = data.ObservacionGestion;
      _objGestionarModel.FechaActualizacion = null;

      // aqui agregar el modelo para enviar al log mañana.
      const _objGestionesModel = new GestionModelLog();
      _objGestionesModel.IdUsuarioSolicita = data.UsuarioSolicita;
      _objGestionesModel.IdUsuarioRecibe = data.IdUsuarioRecibe;
      _objGestionesModel.IdModulo = data.IdModulo;
      _objGestionesModel.IdOperacion = data.IdOperacion;
      _objGestionesModel.IdEstado = opera;
      _objGestionesModel.Documento = data.Documento;
      _objGestionesModel.Observacion = data.Observacion;
      _objGestionesModel.Cuenta = data.Cuenta;
      _objGestionesModel.ObservacionGestion = data.ObservacionGestion;
      _objGestionesModel.FechaSolicitud = this.dataDetalleGestion.FechaSolicitud;
      _objGestionesModel.IdGestionOperacion = data.IdGestionOperacion;

      // aqui agrega el modelo para el rechazo
      const _objGestionRechazo = new GestionarCancelacionDto();
      _objGestionRechazo.UsuarioSolicita = this.dataDetalleGestion.NombreUsuarioSolicita;
      _objGestionRechazo.UsuarioRecibe = this.dataDetalleGestion.NombreUsuarioRecibe;
      _objGestionRechazo.IdUsuarioRecibe = this.dataDetalleGestion.IdUsuarioRecibe;
      _objGestionRechazo.NombreOperacion = this.dataDetalleGestion.NombreOperacion;
      _objGestionRechazo.Estado = opera;
      _objGestionRechazo.Documento = data.Documento;
      _objGestionRechazo.IdGestionOperacion = this.dataDetalleGestion.IdGestionOperacion;
      _objGestionRechazo.Cuenta = this.dataDetalleGestion.Cuenta;
      _objGestionRechazo.Observacion = data.ObservacionGestion;
      _objGestionRechazo.FechaSolicitud = this.dataDetalleGestion.FechaSolicitud;

      _objGestionarModel.CancelacionDto = _objGestionRechazo;

      this.gestionesService.GestionarGestion(JSON.stringify(_objGestionarModel)).subscribe(
        result => {
          if (result) {
            this.mostrarSpanAlertaCancel = false;
            this.CerrarModalesCancel.nativeElement.click();
            this.notificacion.onSuccess('Exitoso', 'La gestión se realizó correctamente.');
            this.GuardarLogGestionOperaciones(_objGestionesModel);
            this.GestionoOpe.emit('true');
          } else {
            this.GestionoOpe.emit('false');
            this.notificacion.onWarning('Advertencia', 'La gestión no se realizo correctamente.');
          }
      });
    } else {
      this.mostrarSpanAlertaCancel = true;
    }
  }

  validarValueObservacionCancel() {
    const observa = this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.value;
    if (observa !== null && observa !== undefined && observa !== '') {
      this.mostrarSpanAlertaCancel = false;
    } else {
      this.mostrarSpanAlertaCancel = true;
    }
  }

  validarValueObservacionRechazo() {
    const observa = this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.value;
    if (observa !== null && observa !== undefined && observa !== '') {
      this.mostrarSpanAlertaRechazo = false;
    } else {
      this.mostrarSpanAlertaRechazo = true;
    }
  }

  validarValueObservacionGestion() {
    const observa = this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.value;
    if (observa !== null && observa !== undefined && observa !== '') {
      this.mostrarSpanAlertaGestion = false;
    } else {
      this.mostrarSpanAlertaGestion = true;
    }
  }

  validarValueObservacionReasignar() {
    const observa = this.SolicitudGestionDetalleForm.get('ObservacionGestion')?.value;
    if (observa !== null && observa !== undefined && observa !== '') {
      this.mostrarSpanAlertaReasignar = false;
    } else {
      this.mostrarSpanAlertaCancel = true;
    }
  }

  GuardarLogGestionOperaciones(objectDto : any) {
    this.generalesService.GuardarlogGestionOperaciones(objectDto).subscribe(
      result => {
        // tslint:disable-next-line:no-console
        console.info('El registro del log se realizo correctamente');
      }
    );
  }
  //#endregion

  //#region  Validacion de formularios
  ValidarFormulario() {
    const IdOperacion = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const Cuenta = new FormControl('', []);
    const Documento = new FormControl('', []);
    const IdEstado = new FormControl('', [Validators.required]);
    const Observacion = new FormControl('', []);
    const IdUsuarioSolicita = new FormControl('', [Validators.required]);
    const UsuarioSolicita = new FormControl('', [Validators.required]);
    const NombreUsuarioSolicita = new FormControl('', []);
    const IdUsuarioRecibe = new FormControl('', [Validators.required]);
    const IdOficina = new FormControl('', []);
    const IdProducto = new FormControl('', []);
    const IdConsecutivo = new FormControl('', []);
    const IdDigito = new FormControl('', []);
    const IdModulo = new FormControl('', []);

    this.SolicitudGestionForm = new FormGroup({
      IdOperacion: IdOperacion,
      Cuenta: Cuenta,
      Documento: Documento,
      IdEstado: IdEstado,
      Observacion: Observacion,
      IdUsuarioSolicita: IdUsuarioSolicita,
      UsuarioSolicita: UsuarioSolicita,
      NombreUsuarioSolicita: NombreUsuarioSolicita,
      IdUsuarioRecibe: IdUsuarioRecibe,
      IdOficina: IdOficina,
      IdProducto: IdProducto,
      IdConsecutivo: IdConsecutivo,
      IdDigito: IdDigito,
      IdModulo: IdModulo
    });
  }

  ValidarFormularioDetalle() {
    const IdOperacion = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const IdGestionOperacion = new FormControl('', []);
    const Cuenta = new FormControl('', []);
    const Documento = new FormControl('', []);
    const IdEstado = new FormControl('', [Validators.required]);
    const Observacion = new FormControl('', []);
    const IdUsuarioSolicita = new FormControl('', [Validators.required]);
    const UsuarioSolicita = new FormControl('', [Validators.required]);
    const NombreUsuarioSolicita = new FormControl('', []);
    const IdUsuarioRecibe = new FormControl('', [Validators.required]);
    const IdOficina = new FormControl('', []);
    const IdProducto = new FormControl('', []);
    const IdConsecutivo = new FormControl('', []);
    const IdDigito = new FormControl('', []);
    const IdModulo = new FormControl('', []);
    const ObservacionGestion = new FormControl('', []);

    this.SolicitudGestionDetalleForm = new FormGroup({
      IdOperacion: IdOperacion,
      IdGestionOperacion: IdGestionOperacion,
      Cuenta: Cuenta,
      Documento: Documento,
      IdEstado: IdEstado,
      Observacion: Observacion,
      IdUsuarioSolicita: IdUsuarioSolicita,
      UsuarioSolicita: UsuarioSolicita,
      NombreUsuarioSolicita: NombreUsuarioSolicita,
      IdUsuarioRecibe: IdUsuarioRecibe,
      IdOficina: IdOficina,
      IdProducto: IdProducto,
      IdConsecutivo: IdConsecutivo,
      IdDigito: IdDigito,
      IdModulo: IdModulo,
      ObservacionGestion: ObservacionGestion
    });
  }

  ValidarFormularioGestiones() {
    const IdOperacion = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const IdGestionOperacion = new FormControl('', []);
    const Cuenta = new FormControl('', []);
    const Documento = new FormControl('', []);
    const IdEstado = new FormControl('', [Validators.required]);
    const Observacion = new FormControl('', []);
    const IdUsuarioSolicita = new FormControl('', [Validators.required]);
    const UsuarioSolicita = new FormControl('', [Validators.required]);
    const NombreUsuarioSolicita = new FormControl('', []);
    const IdUsuarioRecibe = new FormControl('', [Validators.required]);
    const IdOficina = new FormControl('', []);
    const IdProducto = new FormControl('', []);
    const IdConsecutivo = new FormControl('', []);
    const IdDigito = new FormControl('', []);
    const IdModulo = new FormControl('', []);

    this.GestionesForm = new FormGroup({
      IdOperacion: IdOperacion,
      IdGestionOperacion: IdGestionOperacion,
      Cuenta: Cuenta,
      Documento: Documento,
      IdEstado: IdEstado,
      Observacion: Observacion,
      IdUsuarioSolicita: IdUsuarioSolicita,
      UsuarioSolicita: UsuarioSolicita,
      NombreUsuarioSolicita: NombreUsuarioSolicita,
      IdUsuarioRecibe: IdUsuarioRecibe,
      IdOficina: IdOficina,
      IdProducto: IdProducto,
      IdConsecutivo: IdConsecutivo,
      IdDigito: IdDigito,
      IdModulo: IdModulo
    });
  }
  //#endregion

  // Valida que el campo no contenga el caracter que llega como parametro
  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }

}
