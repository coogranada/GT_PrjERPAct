import { CargosModel } from '../../../../Models/Maestros/cargos.model';
import { CargosService } from '../../../../Services/Maestros/cargos.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css'],
  providers: [CargosService, GeneralesService, ModuleValidationService, LoginService],
  standalone : false
})
export class CargosComponent implements OnInit {
  public dataCargosResult : any[] = [];
  public cargosModel: CargosModel;
  public isdisabledUpdate = true;
  public estadosCargo : any[] = [{ value: '0', descripcion: '-- Seleccione --' },
  { value: '3', descripcion: 'Activo' },
  { value: '4', descripcion: 'Inactivo' }];
  public cargosFrom!: FormGroup;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo : number = 3;
  public PermisosUsuario : any[] = [];
  public BBloquearBotones = false;
  public DatosUsuario : any = {};

  btnGuardar = false;
  btnActualizar = true;

  constructor(private cargoService: CargosService,
    private notif: NgxToastService,
    private generalesService: GeneralesService, private moduleValidationService: ModuleValidationService,
    private el: ElementRef, private loginService: LoginService, private router: Router) {
    this.cargosModel = new CargosModel();
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ObtenerCargos();
    this.validateForm();
    this.ObtenerCargos();
    let data : string | null = localStorage.getItem('Data')
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe((result : any) => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
    this.IrArriba();
  }
  BloquearBotones() {
    this.PermisosUsuario.forEach((element : any) => {
      // Perfiles que tienen acceso al modulo de cargos, PERO NO PUEDEN REALIZAR NINGUNA OPERACION
      if (element.IdPerfil === 60) {
        this.BBloquearBotones = true;
      }
    });
  }
  ObtenerCargos() {
    this.loading = true;
    this.cargoService.getCargos().subscribe(
      (result : any) => {
        this.loading = false;
        this.dataCargosResult = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GuardarCargos() {
    this.loading = true;
    if (this.cargosFrom.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado.');
    } else {
      this.GuardarLog(this.cargosFrom.value, 96, 0, 0,3); //GUARDAR
      this.cargoService.setCargos(this.cargosFrom.value).subscribe(() => {
          this.loading = false;
          this.resetForm();
          this.notif.onSuccess('Exitoso', 'El cargo se guardó correctamente.');
          this.ObtenerCargos();
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
  }
  ActualizarCargos() {
    this.loading = true;
    if (this.cargosFrom.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado.');
    } else {
      this.GuardarLog(this.cargosFrom.value, 97, 0, 0,3); // ACTUALIZAR
      this.cargoService.updateCargos(this.cargosFrom.value).subscribe((result : any) => {
          this.loading = false;
          if (result) {
            this.resetForm();
            this.isdisabledUpdate = true;
            this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
            this.ObtenerCargos();
          } else {
            this.notif.onDanger('Error', 'Ocurrió un error al actualizar el cargo.');
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
    if (!this.BBloquearBotones) {
      this.isdisabledUpdate = false;
      this.btnGuardar = true;
      this.btnActualizar = false;
      this.cargosFrom.get('nombre')?.setValue(datos.Nombre);
      this.cargosFrom.get('descripcion')?.setValue(datos.Descripcion);
      this.cargosFrom.get('idEstado')?.setValue(datos.IdEstado);
      this.cargosFrom.get('idCargo')?.setValue(datos.IdCargo);
    }
  }
  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.loading = true;
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        this.loading = false;
        console.log(result);
      });
  }
  resetForm() {
    this.isdisabledUpdate = true;
    this.cargosFrom.reset();
    this.btnGuardar = false;
    this.btnActualizar = true;
  }
  validateForm() {
    const nombre = new FormControl('', [Validators.required]);
    const descripcion = new FormControl('',[Validators.required]);
    const idEstado = new FormControl('',[Validators.required]);
    const idCargo = new FormControl('', []);

    this.cargosFrom = new FormGroup({
      nombre: nombre,
      descripcion: descripcion,
      idEstado: idEstado,
      idCargo: idCargo
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}