import { TipoUsuariosService } from '../../../../Services/Maestros/tipoUsuario.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoUsuarioModel } from '../../../../Models/Maestros/tipoUsuario.model';
import { GeneralesService } from '../../../../../app/Services/Productos/generales.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../../../app/Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../../../../app/Services/Login/login.service';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-tipo-usuarios',
  templateUrl: './tipo-usuarios.component.html',
  styleUrls: ['./tipo-usuarios.component.css'],
  providers: [TipoUsuariosService, GeneralesService, ModuleValidationService, LoginService],
  standalone : false
})
export class TipoUsuariosComponent implements OnInit {
  public dataTipoResult : any[] = [];
  public tipoModel: TipoUsuarioModel;
  public estadosTipo = [{ value: '0', descripcion: '-- Seleccione --' },
  { value: '3', descripcion: 'Activo' },
  { value: '4', descripcion: 'Inactivo' }];
  public tipoForm!: FormGroup;
  public isdisabledUpdate = true;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading : boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour : string = ColorPrimario;
  public secondaryColour : string = ColorSecundario;
  private CodModulo : number = 6;
  public DatosUsuario : any = {};
  
  btnGuardar : boolean = false;
  btnActualizar : boolean = true;

  constructor(private tipoService: TipoUsuariosService, private notif: NgxToastService,
    private generalesService: GeneralesService, private moduleValidationService: ModuleValidationService,
    private el: ElementRef, private loginService: LoginService, private router: Router) {
    this.tipoModel = new TipoUsuarioModel();
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ObtenerTipo();
    this.validateForm();
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe((result : any) => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
    this.IrArriba();
  }
  ObtenerTipo() {
    this.loading = true;
    this.tipoService.getTipoUsuario().subscribe((result : any[]) => {
        this.loading = false;
        this.dataTipoResult = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GuardarTipo() {
    this.loading = true;
    if (this.tipoForm.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado.');
    } else {
      this.GuardarLog(this.tipoForm.value, 96, 0, 0, 6); // GUARDAR
      this.tipoService.setTipoUsuario(this.tipoForm.value).subscribe(
        result => {
          this.loading = false;
          if (result) {
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El tipo de usuario se guardó correctamente.');
            this.ObtenerTipo();
          } else {
            this.notif.onDanger('Advertencia', 'Ocurrió un error al guardar el  tipo de usuario.');
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
  }
  ActualizarTipos() {
    this.loading = true;
    if (this.tipoForm.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado.');
    } else {
      this.GuardarLog(this.tipoForm.value, 97, 0, 0,6); // ACTUALIZAR
      this.tipoService.updateTipoUsuario(this.tipoForm.value).subscribe(
        result => {
          this.loading = false;
          if (result) {
            this.isdisabledUpdate = true;
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El  tipo de usuario se actualizó correctamente.');
            this.ObtenerTipo();
          } else {
            this.notif.onDanger('Advertencia', 'Ocurrió un error al actualizar el tipo de usuario.');
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
  }
  MapearDatos(datos : any) {
    this.isdisabledUpdate = false;
    this.btnGuardar = true;
    this.btnActualizar = false;
    this.tipoForm.get('nombre')?.setValue(datos.Nombre);
    this.tipoForm.get('descripcion')?.setValue(datos.Descripcion);
    this.tipoForm.get('idEstado')?.setValue(datos.IdEstado);
    this.tipoForm.get('IdTipoUsuario')?.setValue(datos.IdTipoUsuario);
  }
  GuardarLog(form : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.loading = true;
    this.generalesService.Guardarlog(form, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        this.loading = false;
        console.log(result);
      });
  }
  resetForm() {
    this.isdisabledUpdate = true;
    this.tipoForm.reset();
    this.btnGuardar = false;
    this.btnActualizar = true;
  }
  validateForm() {
    const nombre = new FormControl('', [Validators.required]);
    const descripcion = new FormControl('', [Validators.required]);
    const idEstado = new FormControl('', [Validators.required]);
    const IdTipoUsuario = new FormControl('', []);

    this.tipoForm = new FormGroup({
      nombre: nombre,
      descripcion: descripcion,
      idEstado: idEstado,
      IdTipoUsuario: IdTipoUsuario
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
