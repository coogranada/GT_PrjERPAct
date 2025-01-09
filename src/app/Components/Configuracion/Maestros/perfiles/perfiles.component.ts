import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PerfilesService } from '../../../../Services/Maestros/perfiles.service';
import { PerfilesModel } from '../../../../Models/Maestros/perfiles.model';
import { GeneralesService } from '../../../../../app/Services/Productos/generales.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../../../app/Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../../../app/Services/Login/login.service';
import { Router } from '@angular/router';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css'],
  providers: [PerfilesService, GeneralesService, ModuleValidationService, LoginService],
  standalone : false
})
export class PerfilesComponent implements OnInit {
  public dataPerfilesResult : any[] = [];
  public perfilesModel: PerfilesModel;
  public isdisabledUpdate = true;
  public estadosPerfiles = [{ value: '0', descripcion: '-- Seleccione --' },
  { value: '3', descripcion: 'Activo' },
  { value: '4', descripcion: 'Inactivo' }];
  public perfilesFrom!: FormGroup;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 5;
  public PermisosUsuario : any[] = [];
  public BBloquearBotones = false;
  public DatosUsuario : any = {};

  btnGuardar = false;
  btnActualizar = true;

  constructor(private prfilesService: PerfilesService, private notif: NgxToastService, private generalesService: GeneralesService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, private loginService: LoginService,
    private router: Router) {
    this.perfilesModel = new PerfilesModel();
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ObtenerPerfiles();
    this.validateForm();
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
  BloquearBotones() {
    this.PermisosUsuario.forEach((element : any) => {
      // Perfiles que tienen acceso al modulo de perfiles, PERO NO PUEDEN REALIZAR NINGUNA OPERACION
      if (element.IdPerfil === 60) {
        this.BBloquearBotones = true;
      }
    });
  }
  ObtenerPerfiles() {
    this.prfilesService.getPerfiles().subscribe(
      result => {
        this.dataPerfilesResult = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GuardarPerfiles() {
    if (this.perfilesFrom.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado.');
    } else {
      this.GuardarLog(this.perfilesFrom.value, 96, 0, 0, 5); //GUARDAR
      this.prfilesService.setPerfiles(this.perfilesFrom.value).subscribe(result => {
          if (result) {
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El perfil se guardó correctamente.');
            this.ObtenerPerfiles();
          } else {
            this.notif.onDanger('Advertencia', 'Ocurrió un error al guardar el perfil.');
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', error);
          console.log(errorMessage);
        });
    }
  }
  ActualizarPerfiles() {
    if (this.perfilesFrom.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado.');
    } else {
      this.GuardarLog(this.perfilesFrom.value, 97, 0, 0,5); // ACTUALIZAR
      this.prfilesService.updatePerfiles(this.perfilesFrom.value).subscribe((result : any) => {
          console.log(result);
          if (result) {
            this.isdisabledUpdate = true;
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El perfil se actualizó correctamente.');
            this.ObtenerPerfiles();
          } else {
            this.notif.onDanger('Advertencia', 'Ocurrió un error al actualizar el perfil.');
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', error);
          console.log(errorMessage);
        });
    }
  }
  MapearDatos(datos : any) {
    if (!this.BBloquearBotones) {
      this.isdisabledUpdate = false;
      this.btnGuardar = true;
      this.btnActualizar = false;
      this.perfilesFrom.get('nombre')?.setValue(datos.Nombre);
      this.perfilesFrom.get('descripcion')?.setValue(datos.Descripcion);
      this.perfilesFrom.get('idEstado')?.setValue(datos.IdEstado);
      this.perfilesFrom.get('idPerfil')?.setValue(datos.IdPerfil);
    }
  }
  GuardarLog(form : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.generalesService.Guardarlog(form, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        console.log(result);
      });
  }
  resetForm() {
    this.isdisabledUpdate = true;
    this.perfilesFrom.reset();
    this.btnGuardar = false;
    this.btnActualizar = true;
  }
  validateForm() {
    const nombre = new FormControl('', [Validators.required]);
    const descripcion = new FormControl('',[Validators.required]);
    const idEstado = new FormControl('', [Validators.required]);
    const idPerfil = new FormControl('', []);

    this.perfilesFrom = new FormGroup({
      nombre: nombre,
      descripcion: descripcion,
      idEstado: idEstado,
      idPerfil: idPerfil
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}