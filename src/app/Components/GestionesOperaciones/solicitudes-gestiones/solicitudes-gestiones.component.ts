import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GestionesService } from '../../../Services/Gestiones/gestiones.service';
import { CuentaModel } from '../../../Models/Productos/cuenta.model';
import { GestionModel, GestionModelLog } from '../../../Models/Gestiones/gestiones.model';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { GeneralesService } from '../../../Services/Productos/generales.service';
import { moduloAGestionar } from '../../../../environments/config.modulos';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-solicitudes-gestiones',
  templateUrl: './solicitudes-gestiones.component.html',
  styleUrls: ['./solicitudes-gestiones.component.css'],
  providers: [GestionesService, GeneralesService],
  standalone : false
})

export class SolicitudesGestionesComponent implements OnInit {
  @ViewChild('AbrirSolicitud', { static: true }) private AbrirSolicitud!: ElementRef;
  @ViewChild('CerrarSolicitud', { static: true }) private CerrarSolicitud!: ElementRef;
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  @Output() emitEventJuridicoSolicitud: EventEmitter<any> = new EventEmitter<any>();
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  public SolicitudGestionForm!: FormGroup;
  public ListaOperaciones: any[] = [];
  public ListaEstados : any[] = [];
  public DatosUsuario : any;
  public UsuariosAutorizados :any;
  public Modulo : number = 0;

  public Operacion = true;
  public EnviarA : boolean | null = true;
  public Cuenta = true;
  public Documento = true;
  public UsuarioSolicita = true;
  public Estado = true;

  constructor(private gestionesService: GestionesService, private notificacion: NgxToastService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.ValidarFormulario();
  }

  AbrirSolicitudGestion(PModulo: number, PCuenta: CuentaModel, PDocumento: string) {
    let _abrirModal = false;
    this.Limpiar();
    if ((PCuenta.IdOficina === null || PCuenta.IdOficina === undefined || PCuenta.IdOficina === 0) &&
      (PCuenta.IdProducto === null || PCuenta.IdProducto === undefined || PCuenta.IdProducto === 0) &&
      (PCuenta.IdConsecutivo === null || PCuenta.IdConsecutivo === undefined || PCuenta.IdConsecutivo === 0) &&
      (PDocumento === null || PDocumento === undefined || PDocumento === '')) {
      this.notificacion.onWarning('Advertencia','Debe ingresar la cuenta o el documento del asociado.');
    } else {
      this.Modulo = PModulo;
      this.SolicitudGestionForm.get('IdModulo')?.setValue(this.Modulo);
      this.ObtenerOperaciones(PModulo.toString());
      this.ObtenerEstados();
      if ((PCuenta.IdOficina === null || PCuenta.IdOficina === undefined || PCuenta.IdOficina === 0) &&
        (PCuenta.IdProducto === null || PCuenta.IdProducto === undefined || PCuenta.IdProducto === 0) &&
        (PCuenta.IdConsecutivo === null || PCuenta.IdConsecutivo === undefined || PCuenta.IdConsecutivo === 0)) {
        this.SolicitudGestionForm.get('Cuenta')?.setValue('');
      } else {
        this.GenerarCuenta(PCuenta.IdOficina.toString(), PCuenta.IdProducto.toString(), PCuenta.IdConsecutivo.toString(), PCuenta.IdDigito.toString());
        this.SolicitudGestionForm.get('IdOficina')?.setValue(PCuenta.IdOficina);
        this.SolicitudGestionForm.get('IdProducto')?.setValue(PCuenta.IdProducto);
        this.SolicitudGestionForm.get('IdConsecutivo')?.setValue(PCuenta.IdConsecutivo);
        this.SolicitudGestionForm.get('IdDigito')?.setValue(PCuenta.IdDigito);
      }

      if ((PDocumento === null || PDocumento === undefined || PDocumento === '')) {
        this.SolicitudGestionForm.get('Documento')?.setValue('');
      } else {

        this.SolicitudGestionForm.get('Documento')?.setValue(PDocumento);
      }

      _abrirModal = true;
      this.ObtenerDatosUsuario();
    }
    if (_abrirModal) {
      this.AbrirSolicitud.nativeElement.click();
    }
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
      if (_operacion.IdOperacion !== 1 && _operacion.IdOperacion !== 2 && _operacion.IdOperacion !== 23 ) {
        this.ObtenerUsuariosAutorizados(_operacion.IdOperacion);
        this.EnviarA = null;
      } else {
        this.notificacion.onWarning('Advertencia','Esta operacion no esta permitida.');
        this.SolicitudGestionForm.get('IdOperacion')?.reset();
      }
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
        if (this.ListaEstados !== null && this.ListaEstados !== undefined) {
          this.ListaEstados.forEach(element => {
            if (element.IdLista === 5542) {
            this.SolicitudGestionForm.get('IdEstado')?.setValue(element);
          }
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

  Enviar() {
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
    const UsuarioRecibe = this.SolicitudGestionForm.get('IdUsuarioRecibe')?.value.IdUsuario;
    if (this.DatosUsuario.IdUsuario !== UsuarioRecibe) {
      this.loading = true;
      if ((this.SolicitudGestionForm.get('Cuenta')?.value === null ||
        this.SolicitudGestionForm.get('Cuenta')?.value === undefined ||
        this.SolicitudGestionForm.get('Cuenta')?.value === '') &&
        (this.SolicitudGestionForm.get('Documento')?.value === null ||
          this.SolicitudGestionForm.get('Documento')?.value === undefined ||
          this.SolicitudGestionForm.get('Documento')?.value === '')) {
        this.CerrarSolicitud.nativeElement.click();
        this.notificacion.onWarning('Advertencia', 'Debe ingresar la cuenta o el documento.');
      }

      const _objGestionesModel = new GestionModel();
      _objGestionesModel.IdModulo = this.SolicitudGestionForm.get('IdModulo')?.value;
      _objGestionesModel.IdOperacion = this.SolicitudGestionForm.get('IdOperacion')?.value.IdOperacion;
      _objGestionesModel.NombreOperacion = this.SolicitudGestionForm.get('IdOperacion')?.value.Descripcion;
      _objGestionesModel.IdEstado = this.SolicitudGestionForm.get('IdEstado')?.value.IdLista;
      _objGestionesModel.NombreEstado = this.SolicitudGestionForm.get('IdEstado')?.value.Valor;

      _objGestionesModel.ObjCuenta = {
        IdOficina: +this.SolicitudGestionForm.get('IdOficina')?.value,
        IdProducto: +this.SolicitudGestionForm.get('IdProducto')?.value,
        IdConsecutivo: +this.SolicitudGestionForm.get('IdConsecutivo')?.value,
        IdDigito: +this.SolicitudGestionForm.get('IdDigito')?.value
      };

      _objGestionesModel.Cuenta = this.SolicitudGestionForm.get('Cuenta')?.value;
      _objGestionesModel.Documento = this.SolicitudGestionForm.get('Documento')?.value;
      _objGestionesModel.IdUsuarioSolicita = this.SolicitudGestionForm.get('IdUsuarioSolicita')?.value;
      _objGestionesModel.NombreUsuarioSolicita = this.SolicitudGestionForm.get('NombreUsuarioSolicita')?.value;
      _objGestionesModel.IdUsuarioRecibe = this.SolicitudGestionForm.get('IdUsuarioRecibe')?.value.IdUsuario;
      _objGestionesModel.Observacion = this.SolicitudGestionForm.get('Observacion')?.value;
      _objGestionesModel.urlModulo = moduloAGestionar.validarModuloGestionar(_objGestionesModel.IdModulo);

      const _objGestionesModelLog = new GestionModelLog();
      _objGestionesModelLog.IdModulo = this.SolicitudGestionForm.get('IdModulo')?.value;
      _objGestionesModelLog.IdOperacion = this.SolicitudGestionForm.get('IdOperacion')?.value.IdOperacion;
      _objGestionesModelLog.NombreOperacion = this.SolicitudGestionForm.get('IdOperacion')?.value.Descripcion;
      _objGestionesModelLog.IdEstado = this.SolicitudGestionForm.get('IdEstado')?.value.IdLista;
      _objGestionesModelLog.NombreEstado = this.SolicitudGestionForm.get('IdEstado')?.value.Valor;

      _objGestionesModelLog.ObjCuenta = {
        IdCuenta: 0,
        IdOficina: +this.SolicitudGestionForm.get('IdOficina')?.value,
        IdProducto: +this.SolicitudGestionForm.get('IdProducto')?.value,
        IdConsecutivo: +this.SolicitudGestionForm.get('IdConsecutivo')?.value,
        IdDigito: +this.SolicitudGestionForm.get('IdDigito')?.value
      };

      _objGestionesModelLog.Cuenta = this.SolicitudGestionForm.get('Cuenta')?.value;
      _objGestionesModelLog.Documento = this.SolicitudGestionForm.get('Documento')?.value;
      _objGestionesModelLog.IdUsuarioSolicita = this.SolicitudGestionForm.get('IdUsuarioSolicita')?.value;
      _objGestionesModelLog.NombreUsuarioSolicita = this.SolicitudGestionForm.get('NombreUsuarioSolicita')?.value;
      _objGestionesModelLog.IdUsuarioRecibe = this.SolicitudGestionForm.get('IdUsuarioRecibe')?.value.IdUsuario;
      _objGestionesModelLog.Observacion = this.SolicitudGestionForm.get('Observacion')?.value;

      this.gestionesService.Guardar(JSON.stringify(_objGestionesModel)).subscribe(
        result => {
          this.loading = false;
          if (result !== null && result.ObjAlertasDto !== null) {
            if (result.ObjAlertasDto.TipoAlerta === 'Error') {
              this.CerrarSolicitud.nativeElement.click();
              this.notificacion.onWarning('Advertencia.', result.ObjAlertasDto.Mensaje);
            }
          } else {
            this.GuardarLogGestionOperaciones(result);
            this.CerrarSolicitud.nativeElement.click();
            this.notificacion.onSuccess('Exitoso', 'La solicitud se envió correctamente.');
          }
        },
        error => {
          this.loading = false;
          const errorJson = JSON.parse(error._body);
          this.notificacion.onDanger('Error', errorJson);
          console.log(error);
        }
      );
    } else {
      this.SolicitudGestionForm.get('IdUsuarioRecibe')?.reset();
      this.notificacion.onWarning('Advertencia', 'No se puede asignar la gestión al mismo usuario.');
    }
  }

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
    const IdJuridico = new FormControl('', []);

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
      IdModulo: IdModulo,
      IdJuridico: IdJuridico
    });
  }

  GuardarLogGestionOperaciones(objectDto : any) {
    this.generalesService.GuardarlogGestionOperaciones(objectDto).subscribe(
      result => {
        // tslint:disable-next-line:no-console
         console.info('El registro del log se realizo correctamente');
      }
    );
  }

  cerrarModal() {
    this.emitEventJuridicoSolicitud.emit(true);
  }

  // Valida que el campo no contenga el caracter que llega como parametro
  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }
}
