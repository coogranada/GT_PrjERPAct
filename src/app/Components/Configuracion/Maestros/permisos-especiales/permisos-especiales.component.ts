import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import Swal from 'sweetalert2';
import { PermisosEspecialesService } from '../../../../Services/Maestros/permisos-especiales.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../../Services/Login/login.service';
import { Router } from '@angular/router';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-permisos-especiales',
  templateUrl: './permisos-especiales.component.html',
  styleUrls: ['./permisos-especiales.component.css'],
  providers: [PermisosEspecialesService, ModuleValidationService, LoginService],
  standalone : false
})
export class PermisosEspecialesComponent implements OnInit {

  public permisosEspecialesFrom!: FormGroup;
  public ListaModulos : any[] | null = [];
  public ListaOperacionesDenegadas = null;
  public ListaOperacionesPermitidas = null;
  public ListaUsuarios : any[] = [];
  public bModulo : boolean | null = false;
  public bOperacion : boolean | null = false;
  public bUsuario : boolean | null = null;
  public bloqueoAgregar : boolean | null = true;
  public bloqueoEliminar = true;
  public filaSeleccionadaAgregar : number = 0;
  public filaSeleccionadaEliminar : number = 0;
  public arrayAddOperacion: any;
  public arrayRemoveOperacion: any;
  public arrayRemove: any;
  public arrayForm: any;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 48;
  public DatosUsuario : any = {};
  constructor(private permisosEspecialesService: PermisosEspecialesService, private notificacion: NgxToastService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, private loginService: LoginService,
    private router: Router) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      }));
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ValidacionesFormulario();
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
    this.IrArriba();
  }
  BuscarUsuario() {
    this.loading = true;
    const _usuario = this.permisosEspecialesFrom.get('Usuario')?.value;
    this.permisosEspecialesService.ObtenerUsuario(_usuario).subscribe(
      result => {
        this.loading = false;
        if (result !== null) {
          this.bModulo = null;
          this.bUsuario = false;
          this.ObtenerModulos(_usuario);
        } else {
          this.notificacion.onWarning('Advertencia', 'No se encontró información.');
        }
      },
      error => {
        this.loading = false;
        this.notificacion.onWarning('Advertencia', error._body);
      });
  }
  ObtenerOperaciones() {
    this.ListaOperacionesDenegadas = null;
    this.ListaOperacionesPermitidas = null;
    this.ObtenerOperacionesDenegadas();
    this.ObtenerOperacionesPermitidas();
  }
  ObtenerOperacionesDenegadas() {
    this.loading = true;
    this.bOperacion = null;
    const _usuario = this.permisosEspecialesFrom.get('Usuario')?.value;
    const _idModulo = this.permisosEspecialesFrom.get('IdModulo')?.value;
    this.permisosEspecialesService.ObtenerOperacionesDenegadas(_idModulo, _usuario).subscribe(
      result => {
        this.loading = false;
        this.ListaOperacionesDenegadas = result;
        if (this.ListaOperacionesDenegadas === null || this.ListaOperacionesDenegadas === undefined) {
          this.notificacion.onWarning('Advertencia', 'No se encontró información.');
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }

  ObtenerOperacionesPermitidas() {
    this.loading = true;
    this.bOperacion = null;
    const _usuario = this.permisosEspecialesFrom.get('Usuario')?.value;
    const _idModulo = this.permisosEspecialesFrom.get('IdModulo')?.value;
    this.permisosEspecialesService.ObtenerOperacionesPermitidas(_idModulo, _usuario).subscribe(
      result => {
        this.loading = false;
        this.ListaOperacionesPermitidas = result;
        if (this.ListaOperacionesPermitidas === null || this.ListaOperacionesPermitidas === undefined) {
          this.notificacion.onWarning('Advertencia', 'No se encontró información.');
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  ObtenerModulos(PstrUsuario : number) {
    this.loading = true;
    this.permisosEspecialesService.ObtenerModulos(PstrUsuario).subscribe(
      result => {
        this.loading = false;
        this.ListaModulos = result;
        if (this.ListaModulos === null) {
          this.notificacion.onWarning('Advertencia', 'No se encontró información.');
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
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
    this.arrayForm = this.permisosEspecialesFrom.value;
    this.permisosEspecialesFrom.get('IdOperacion')?.setValue(this.arrayRemove.IdOperacion);
    this.permisosEspecialesService.Guardar(this.permisosEspecialesFrom.value).subscribe(result => {
        if (result) {
          this.loading = false;
          this.permisosEspecialesFrom.get('IdModulo')?.setValue(this.arrayForm.IdModulo);
          this.ObtenerOperaciones();
          this.notificacion.onSuccess('Exitoso', 'La operación se guardó correctamente.');
        } else {
          this.notificacion.onWarning('Advertencia', 'Ocurrió un error al guardar la operación.');
        }
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      });
    this.filaSeleccionadaAgregar = 0;
    this.arrayAddOperacion = [];
    this.bloqueoAgregar = true;
  }

  Eliminar() {
    const _idmodulo = this.permisosEspecialesFrom.get('IdModulo')?.value;

    console.log(this.arrayRemoveOperacion);
    this.arrayRemove = this.arrayRemoveOperacion[0];
    Swal.fire({
      title: '¿Desea eliminar la operación?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results) => {
      if (results.value) {
        this.permisosEspecialesFrom.get('IdModulo')?.setValue(_idmodulo);
        this.permisosEspecialesFrom.get('IdOperacion')?.setValue(this.arrayRemove.IdOperacion);
        this.permisosEspecialesService.Eliminar(this.permisosEspecialesFrom.value).subscribe(result => {
            if (result) {
              this.ObtenerOperaciones();
              this.notificacion.onSuccess('Exitoso', 'La operación se eliminó correctamente.');
            } else {
              this.notificacion.onWarning('Advertencia','Ocurrió un error al eliminar la operación. - ' + result);
            }
          }, error => {
            this.loading = false;
            const errorJson = JSON.parse(error._body);
            this.notificacion.onDanger('Error', errorJson);
            console.log(error);
          });
      }
    });
    this.filaSeleccionadaEliminar = 0;
    this.arrayRemoveOperacion = [];
    this.bloqueoEliminar = true;
  }
  Limpiar() {
    this.permisosEspecialesFrom.reset();
    this.ListaModulos = null;
    this.ListaOperacionesDenegadas = null;
    this.ListaOperacionesPermitidas = null;
    this.bModulo = false;
    this.bOperacion = false;
    this.bUsuario = null;
  }
  ValidacionesFormulario() {
    const Usuario = new FormControl('', [Validators.required]);
    const IdOperacion = new FormControl('', []);
    const IdModulo = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    this.permisosEspecialesFrom = new FormGroup({
      IdModulo: IdModulo,
      IdOperacion: IdOperacion,
      Usuario: Usuario
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

