import { CrearNotificacionesService } from '../../../Services/Utilidades/crearNotificaciones.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { OperacionesService } from '../../../Services/Maestros/operaciones.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../Services/Login/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../Services/shared/loading.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-crear-notificaciones',
  templateUrl: './crear-notificaciones.component.html',
  styleUrls: ['./crear-notificaciones.component.css'],
  providers: [CrearNotificacionesService, ModuleValidationService, LoginService, OperacionesService],
  standalone : false
})

export class CrearNotificacionesComponent implements OnInit {
  public notificacionesFrom!: FormGroup;
  public NotificacionesOperacionFrom!: FormGroup;
  public bDocumento : any;
  public bCuenta : any;
  public bTipoNotificacion : any;
  public bActivacion : any;
  public bEstado : any;
  public bActualizaSaldo : any;
  public ListadoCuentas: any;
  public bNumeroTarjeta : any;
  public ListadoTipoNotificaciones: any[] = [];
  public ListadoEstado: any;
  public NumTarjeta : any;
  public DatosUsuario: any;
  public bPanelDatos: any;
  public bPanelDatosActivacion: any;
  public bConsultar: any;
  public resultOperaciones: any;
  dataUser: any;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 40;
  constructor(private crearNotificacionesService: CrearNotificacionesService, private notificacion: ToastrService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, private loginService: LoginService,
    private operacionesService: OperacionesService,private router: Router, private loading: LoadingService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.bPanelDatos = false;
    this.bPanelDatosActivacion = false;
    this.ListadoCuentas = null;
    this.ListadoTipoNotificaciones = [];
    this.ListadoEstado = null;
    this.NumTarjeta = null;
    this.bTipoNotificacion = false;
    this.bActivacion = false;
    this.bEstado = false;
    this.bActualizaSaldo = false;
    this.bNumeroTarjeta = false;

    this.ObtenerDatosUsuario();
    this.validarFormulario();
    this.Operaciones();
    let datas = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(datas == null ? "" : datas));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      }
    );

    this.IrArriba();
  }
  Operaciones() {
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    const arrayExample = [{
      'IdModulo': this.CodModulo,
      'IdUsuario': this.dataUser.IdUsuario,
      'IdOperaciones': '',
      'IdOperacionesPerfil': '',
      'IdPerfil': this.dataUser.idPerfilUsuario
    }];
    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(
      result => {
        this.resultOperaciones = result;
        // this.emitEventContractual.emit(true);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ValorSeleccionado() {
    this.Limpiar();
  }

  ObtenerDatosUsuario() {
    let datas = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(datas == null ? "" : datas));
  }

  ObtenerCuentas() {
    this.loading.show();
    this.crearNotificacionesService.ObtenerCuentas(this.notificacionesFrom.get('Documento')?.value.trim()).subscribe(
      result => {
        if (this.ListadoCuentas !== null && this.ListadoCuentas.length === 0) {
          this.notificacion.warning('Advertencia', 'No se encontró información.', ConfiguracionNotificacion.configRightTop);
          this.bDocumento = null;
          this.Limpiar();
        } else if (this.NotificacionesOperacionFrom.get('Codigo')?.value === '73') {
          this.notificacionesFrom.get('NumeroTarjeta')?.reset();
          this.bPanelDatos = true;
          this.bDocumento = null;
          this.ListadoCuentas = result;
          
        } else if (this.NotificacionesOperacionFrom.get('Codigo')?.value === '74') {
          this.notificacionesFrom.get('NumeroTarjeta')?.reset();
          this.notificacionesFrom.get('TipoNotificacion')?.reset();
          this.notificacionesFrom.get('Estado')?.reset();
          this.notificacionesFrom.get('ActualizaSaldo')?.reset();
          this.bPanelDatosActivacion = true;
          this.bDocumento = null;
          this.crearNotificacionesService.FiltrarCuentas(this.notificacionesFrom.get('Documento')?.value.trim()).subscribe(
            resultF => {
              this.ListadoCuentas = resultF;
            },
            error => {
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        } 
        this.loading.hide();
      },
      error => {
        this.loading.hide();
        const errorJson = JSON.parse(error._body);
        this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
        console.log(error);
      }
    );
  }

  ObtenerTarjeta() {
    this.loading.show();
    this.bTipoNotificacion = null;
    this.ListadoEstado = [];
    this.ListadoTipoNotificaciones = [];
    this.notificacionesFrom.get('TipoNotificacion')?.setValue('-');
    this.notificacionesFrom.get('Estado')?.setValue('-');
    this.notificacionesFrom.get('ActualizaSaldo')?.setValue('-');
    this.bTipoNotificacion = null;
    this.crearNotificacionesService.ObtenerTarjeta(this.notificacionesFrom.get('NumeroCuenta')?.value).subscribe(
      result => {
        this.loading.hide();
        if (result === null) {
          this.notificacionesFrom.get('NumeroTarjeta')?.setValue('');
        } else {
          this.notificacionesFrom.get('NumeroTarjeta')?.setValue(result.NumeroTarjeta);
        }
        this.ObtenerTipoNotificaciones();
      },
      error => {
        this.loading.hide();
        const errorJson = JSON.parse(error._body);
        this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
        console.log(error);
      }
    );
  }

  ObtenerTipoNotificaciones() {
    this.loading.show();
    const _NumTarjeta = this.notificacionesFrom.get('NumeroTarjeta')?.value;
    this.crearNotificacionesService.ObtenerTipoNotificaciones().subscribe(
      result => {
        this.loading.hide();
        if (result === null || result.length === 0) {
          this.notificacion.warning('Advertencia', 'No se encontró información.', ConfiguracionNotificacion.configRightTop);
        } else {
          if (_NumTarjeta === null || _NumTarjeta === '') {
            for (let i = 0; i < result.length; i++) {
              if (result[i].Valor !== '5' && result[i].Valor !== '6' && result[i].Valor !== '7') {
                this.ListadoTipoNotificaciones.push(result[i]);
              }
            }
          } else {
            this.ListadoTipoNotificaciones = result;
          }
        }
        if (this.NotificacionesOperacionFrom.get('Codigo')?.value  === '74') {
          this.notificacionesFrom.get('TipoNotificacion')?.setValue('5');
          this.ObtenerEstados();
        }
      },
      error => {
        this.loading.hide();
        const errorJson = JSON.parse(error._body);
        this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
        console.log(error);
      }
    );
  }

  ObtenerEstados() {
    this.loading.show();
    this.bEstado = null;
    this.notificacionesFrom.get('Estado')?.setValue('-');
    const _tipoNotificacion = this.notificacionesFrom.get('TipoNotificacion')?.value;
    if (_tipoNotificacion === '5' || _tipoNotificacion === '6' || _tipoNotificacion === '7') {
      this.crearNotificacionesService.ObtenerEstadosTarjetas().subscribe(
        result => {
          this.loading.hide();
          this.ListadoEstado = result;
          if (this.ListadoEstado === null && this.ListadoEstado.length === 0) {
            this.notificacion.warning('Advertencia', 'No se encontró información.', ConfiguracionNotificacion.configRightTop);
          }
          if (this.NotificacionesOperacionFrom.get('Codigo')?.value  === '74') {
            this.notificacionesFrom.get('Estado')?.setValue('00');
            this.notificacionesFrom.get('ActualizaSaldo')?.setValue('Si');
          }
        },
        error => {
          this.loading.hide();
          const errorJson = JSON.parse(error._body);
          this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
          console.log(error);
        }
      );
    } else {
      this.crearNotificacionesService.ObtenerEstadosCuentas().subscribe(
        result => {
          this.loading.hide();
          this.ListadoEstado = result;
          if (this.ListadoEstado === null && this.ListadoEstado.length === 0) {
            this.notificacion.warning('Advertencia', 'No se encontró información.', ConfiguracionNotificacion.configRightTop);
          }
        },
        error => {
          this.loading.hide();
          const errorJson = JSON.parse(error._body);
          this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
          console.log(error);
        }
      );
    }
  }

  CrearNotificacion() {
    this.loading.show();
    this.notificacionesFrom.get('Usuario')?.setValue(this.DatosUsuario.Usuario);
    if (this.notificacionesFrom.get('ActualizaSaldo')?.value === 'Si') {
      this.notificacionesFrom.get('ActualizaSaldo')?.setValue(1);
    } else if (this.notificacionesFrom.get('ActualizaSaldo')?.value === 'No') {
      this.notificacionesFrom.get('ActualizaSaldo')?.setValue(0);
    }
    if (this.NotificacionesOperacionFrom.get('Codigo')?.value === '73') {
      this.notificacionesFrom.get('ActivacionRemota')?.setValue('0');

      this.crearNotificacionesService.CrearNotificacion(this.notificacionesFrom.value).subscribe(
        result => {
          this.loading.hide();
          if (result.Mensaje.includes('notificacion creada correctamente')) {
            this.notificacion.success('Exitoso', 'La notificación se guardó correctamente.', ConfiguracionNotificacion.configRightTop);
            this.Limpiar();
          }
        },
        error => {
          this.loading.hide();
          const errorJson = JSON.parse(error._body);
          this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
          console.log(error);
        }
      );

    } else  if (this.NotificacionesOperacionFrom.get('Codigo')?.value === '74') {
      this.notificacionesFrom.get('ActivacionRemota')?.setValue('1');

      if (this.notificacionesFrom.get('NumeroTarjeta')?.value !== null
        && this.notificacionesFrom.get('NumeroTarjeta')?.value !== undefined
        && this.notificacionesFrom.get('NumeroTarjeta')?.value !== '') {
        
        this.crearNotificacionesService.CrearNotificacion(this.notificacionesFrom.value).subscribe(
          result => {
            this.loading.hide();
            if (result.Mensaje.includes('notificacion creada correctamente')) {
              this.notificacion.success('Exitoso', 'La notificación se guardó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.Limpiar();
            }
          },
          error => {
            this.loading.hide();
            const errorJson = JSON.parse(error._body);
            this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
            console.log(error);
          }
        );
      } else {
        this.loading.hide();
        this.notificacion.warning('Advertencia', 'La cuenta seleccionada no tiene número de tarjeta asignada', ConfiguracionNotificacion.configRightTop);        
      }



    }

    
  }

  Limpiar() {
    this.notificacionesFrom.reset();
    this.bDocumento = null;
    this.ListadoCuentas = null;
    this.ListadoEstado = null;
    this.ListadoTipoNotificaciones = [];
    this.bPanelDatos = false;
    this.bPanelDatosActivacion = false;
    this.bTipoNotificacion = false;
    this.bActivacion = false;
    this.bEstado = false;
    this.bActualizaSaldo = false;
  }



  ActualizarSaldo() {
    this.bActualizaSaldo = null;
  }

  validarFormulario() {
    const Documento = new FormControl('', [Validators.required]);
    const NumeroCuenta = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const TipoNotificacion = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const Estado = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const ActualizaSaldo = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const NumeroTarjeta = new FormControl('', []);
    const Usuario = new FormControl('', []);
    const Codigo = new FormControl('', []);
    const ActivacionRemota = new FormControl('', []);

    this.notificacionesFrom = new FormGroup({
      Documento: Documento,
      NumeroCuenta: NumeroCuenta,
      TipoNotificacion: TipoNotificacion,
      Estado: Estado,
      ActualizaSaldo: ActualizaSaldo,
      NumeroTarjeta: NumeroTarjeta,
      Usuario: Usuario,
      ActivacionRemota: ActivacionRemota
    });

    this.NotificacionesOperacionFrom = new FormGroup({
      Codigo: Codigo
    });
  }

  // Valida que el campo no contenga el caracter que llega como parametro
  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }


  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

}
