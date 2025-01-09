import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { OperacionesModulosService } from '../../../../Services/Maestros/operaciones-modulos.service';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../../Services/Login/login.service';
import { Router } from '@angular/router';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-operaciones-modulos',
  templateUrl: './operaciones-modulos.component.html',
  styleUrls: ['./operaciones-modulos.component.css'],
  providers: [OperacionesModulosService, GeneralesService, ModuleValidationService, LoginService],
  standalone : false
})
export class OperacionesModulosComponent implements OnInit {
  public operacionesFrom!: FormGroup;


  // public dataOperaciones;
  public ListaModulos : any[] = [];
  public ListaOperacionesDenegadas : any[] | null = [];
  public ListaOperacionesPermitidas : any[] | null = [];
  public bloqueoAgregar : boolean | null = true;
  public bloqueoEliminar = true;
  public filaSeleccionadaAgregar : number = 0;
  public filaSeleccionadaEliminar : number = 0;
  public arrayAddOperacion: any;
  public arrayRemoveOperacion: any;
  public arrayRemove: any;
  public arrayForm: any;
  public compareUndefined = undefined;
  private CodModulo = 50;
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public DatosUsuario : any = {};
  constructor(private operacionesModulosService: OperacionesModulosService,
    private notificacion: NgxToastService, private moduleValidationService: ModuleValidationService, private generalesService: GeneralesService,
    private el: ElementRef, private loginService: LoginService, private router: Router) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ValidarFormulario();
    this.ObtenerModulos();
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
    this.IrArriba();
  }
  ObtenerModulos() {
    this.loading = true;
    this.operacionesModulosService.ObtenerModulos().subscribe((result : any[]) => {
        this.loading = false;
        console.log(result);
        this.ListaModulos = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  OperacionesDenegadas(PModulo : number) {
    this.loading = true;
    this.operacionesModulosService.ObtenerOperacionesDenegadas(PModulo).subscribe((result : any[]) => {
        this.loading = false;
        this.ListaOperacionesDenegadas = result;
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      });
  }
  OperacionesPermitidas(PModulo : number) {
    this.loading = true;
    this.operacionesModulosService.ObtenerOperacionesPermitidas(PModulo).subscribe((result : any[]) => {
        this.loading = false;
        this.ListaOperacionesPermitidas = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  ObtenerPermitidosDenegados() {
    const _idModulo = this.operacionesFrom.get('IdModulo')?.value;
    this.ListaOperacionesDenegadas = null;
    this.ListaOperacionesPermitidas = null;
    if (_idModulo !== '-') {
      this.OperacionesDenegadas(_idModulo);
      this.OperacionesPermitidas(_idModulo);
    }
  }
  ClickAgregar(index : number) {
    this.filaSeleccionadaEliminar = 0;
    this.filaSeleccionadaAgregar = index;
    this.bloqueoAgregar = false;
    this.bloqueoEliminar = true;
  }
  setClickedRowRemove(index : number) {
    this.filaSeleccionadaAgregar = 0;
    this.filaSeleccionadaEliminar = index;
    this.bloqueoEliminar = false;
    this.bloqueoAgregar = true;
  }
  FilaSeleccionadaAgregar($event : any) {
    this.arrayRemoveOperacion = [];
    this.bloqueoEliminar = true;
    this.arrayAddOperacion = [];

    if (this.arrayAddOperacion.length <= 0) {
      this.arrayAddOperacion.push($event);
      this.bloqueoAgregar = null;
    }
  }
  FilaSeleccionadaEliminar($event : any) {
    this.arrayAddOperacion = [];
    this.bloqueoAgregar = false;
    this.arrayRemoveOperacion = [];

    if (this.arrayRemoveOperacion.length <= 0) {
      this.arrayRemoveOperacion.push($event);
      this.bloqueoEliminar = false;
    }
  }
  Agregar() {
    this.loading = true;
    this.arrayRemove = this.arrayAddOperacion[0];
    this.arrayForm = this.operacionesFrom.value;
    this.operacionesFrom.get('IdOperacion')?.setValue(this.arrayRemove.IdOperacion);
    this.GuardarLog(this.operacionesFrom.value, 98, 0, 0, 50); //AGREGAR
    this.operacionesModulosService.Guardar(this.operacionesFrom.value).subscribe((result : any) => {
        if (result) {
          this.loading = false;
          this.operacionesFrom.get('IdModulo')?.setValue(this.arrayForm.IdModulo);
          this.ObtenerPermitidosDenegados();          
          this.notificacion.onSuccess('Exitoso', 'La operación se guardó correctamente.');
        } else {
          this.notificacion.onWarning('Advertencia', 'Ocurrió un error al guardar la operación.');
        }
      },error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      });
    this.filaSeleccionadaAgregar = 0;
    this.arrayAddOperacion = [];
    this.bloqueoAgregar = true;
  }
  Validar() {
    const _idmodulo = this.operacionesFrom.get('IdModulo')?.value;
    this.arrayRemove = this.arrayRemoveOperacion[0];
    this.operacionesFrom.get('IdModulo')?.setValue(_idmodulo);
    this.operacionesFrom.get('IdOperacion')?.setValue(this.arrayRemove.IdOperacion);
    let _usuarios = '';
    let _Mensaje = '';

    this.operacionesModulosService.ObtenerUsuarios(_idmodulo, this.arrayRemove.IdOperacion).subscribe((result : any[]) => {
        this.loading = false;
        if (result !== null && result.length > 0) {
          result.forEach((element : any) => {
            if (_usuarios !== '') {
              _usuarios = _usuarios + ', ' + element.Usuario;
            } else {
              if (result.length === 1) {
                _usuarios = 'El usuario' + _usuarios + ' ' + element.Usuario;
              } else {
                _usuarios = 'Los usuarios' + _usuarios + ' ' + element.Usuario;
              }
            }
          });
          if (result.length === 1) {
            _Mensaje = _usuarios + ' tiene permiso especial para esta operación, ' +
              '¿desea eliminar la permiso especial y asignar el permiso al perfil?';
          } else {
            _Mensaje = _usuarios + ' tienen permiso especial para esta operación, ' +
              '¿desea eliminar la permiso especial y asignar el permiso al perfil?';
          }
          Swal.fire({
            title: '',
            text: _Mensaje,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            confirmButtonColor: 'rgb(13,165,80)',
            cancelButtonColor: 'rgb(160,0,87)',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((results : any) => {
            if (results.value) {
              this.Eliminar();
            }
          });
        } else {
          this.Eliminar();
        }
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      });
  }
  Eliminar() {
    const _idmodulo = this.operacionesFrom.get('IdModulo')?.value;
    this.arrayRemove = this.arrayRemoveOperacion[0];
    this.operacionesFrom.get('IdModulo')?.setValue(_idmodulo);
    this.operacionesFrom.get('IdOperacion')?.setValue(this.arrayRemove.IdOperacion);
    this.GuardarLog(this.operacionesFrom.value, 99, 0, 0, 50); //ElIMINAR
    this.operacionesModulosService.Eliminar(this.operacionesFrom.value).subscribe(resultado => {
        if (resultado) {          
          this.ObtenerPermitidosDenegados();
          this.notificacion.onSuccess('Exitoso','La operación se eliminó correctamente.');
        } else {
          this.notificacion.onWarning('Advertencia', 'Ocurrió un error al eliminar la operación. - ' + resultado);
        }
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
    this.filaSeleccionadaEliminar = 0;
    this.arrayRemoveOperacion = [];
    this.bloqueoEliminar = true;
  }
  ValidarFormulario() {
    const IdModulo = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const IdOperacion = new FormControl('', []);
    const IdUsuario = new FormControl('', []);
    
    this.operacionesFrom = new FormGroup({
      IdModulo: IdModulo,
      IdOperacion: IdOperacion,
      IdUsuario: IdUsuario
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
  GuardarLog(form : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.loading = true;
    this.generalesService.Guardarlog(form, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        this.loading = false;
        console.log(result);
      });
  }
}
