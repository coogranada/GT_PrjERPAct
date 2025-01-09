import { ModulosModel } from '../../../../Models/Maestros/modulos.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModulosService } from '../../../../Services/Maestros/modulos.service';
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
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css'],
  providers: [ModulosService, GeneralesService, ModuleValidationService, LoginService],
  standalone : false
})
export class ModulosComponent implements OnInit {
  public dataModulosResult : any[] = [];
  public modulosModel: ModulosModel;
  public isdisabledUpdate : boolean = true;
  public estadosModulo : any[]= [{ value: '0', descripcion: '-- Seleccione --' },
  { value: '3', descripcion: 'Activo' },
  { value: '4', descripcion: 'Inactivo' }];
  public modulosForm!: FormGroup;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading  : boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour : string = ColorPrimario;
  public secondaryColour : string = ColorSecundario;
  private CodModulo : number = 7;
  public DatosUsuario : any = {};
  
  btnGuardar : boolean = false;
  btnActualizar : boolean = true;

  constructor(private modulosService: ModulosService, private notif: NgxToastService,
    private generalesService: GeneralesService, private moduleValidationService: ModuleValidationService,
    private el: ElementRef, private loginService: LoginService, private router: Router) {
    this.modulosModel = new ModulosModel();
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ObtenerModulos();
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
  ObtenerModulos() {
    this.loading = true;
    this.modulosService.getModulos().subscribe(result => {
        this.loading = false;
        this.dataModulosResult = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GuardarModulos() {
    this.loading = true;
    if (this.modulosForm.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado válido para realizar el registro.');
    } else {
      this.GuardarLog(this.modulosForm.value, 96, 0, 0, 7);// GUARDAR
      this.modulosService.setModulos(this.modulosForm.value).subscribe(
        result => {
          this.loading = false;
          console.log(result);
          if (result) {
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El registro se realizó correctamente.');
            this.ObtenerModulos();
          } else {
            this.notif.onDanger('Advertencia', 'El registro no se puedo realizar.');
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
  ActualizarModulos() {
    this.loading = true;
    if (this.modulosForm.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado válido para realizar el registro.');
    } else {
      console.log(this.modulosForm);
      this.GuardarLog(this.modulosForm.value, 97, 0, 0, 7); //ACTUALIZAR
      this.modulosService.updateModulos(this.modulosForm.value).subscribe( result => {
          this.loading = false;
          console.log(result);
          if (result) {
            this.isdisabledUpdate = true;
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
            this.ObtenerModulos();
          } else {
            this.notif.onDanger('Advertencia', 'El registro no se puedo actualizar.');
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
    this.modulosForm.get('nombre')?.setValue(datos.Nombre);
    this.modulosForm.get('descripcion')?.setValue(datos.Descripcion);
    this.modulosForm.get('idEstado')?.setValue(datos.IdEstado);
    this.modulosForm.get('idModulo')?.setValue(datos.IdModulo);
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
    this.modulosForm.reset();
    this.btnGuardar = false;
    this.btnActualizar = true;
  }
  validateForm() {
    const nombre = new FormControl('', [Validators.required]);
    const descripcion = new FormControl('', [Validators.required]);
    const idEstado = new FormControl('', [ Validators.required]);
    const idModulo = new FormControl('', []);

    this.modulosForm = new FormGroup({
      nombre: nombre,
      descripcion: descripcion,
      idEstado: idEstado,
      idModulo: idModulo
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
