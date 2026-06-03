import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstadosOperacionesService } from '../../../../Services/Maestros/estados-operaciones.service';
import { PermisosService } from '../../../../Services/Maestros/permiso.service';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { ModulosService } from '../../../../Services/Maestros/modulos.service';
import { PermisosModel } from '../../../../Models/Maestros/permisos.model';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../../Services/Login/login.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../Services/Alert/alert.service';
import { LoadingService } from '../../../../Services/shared/loading.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-estados-operaciones',
  templateUrl: './estados-operaciones.component.html',
  styleUrls: ['./estados-operaciones.component.css'],
  providers: [EstadosOperacionesService, PermisosService, GeneralesService, ModulosService, ModuleValidationService, LoginService],
  standalone : false
})
export class EstadosOperacionesComponent implements OnInit {

  public estadosOperacionesFrom!: FormGroup;
  public dataOperacion : any[] = [];
  public dataEstados : any[] = [];
  public dataEstadoOperacion : any[] = [];
  public dataResultSave : any;
  public isdisabled = false;
  public dataPerfil: any;
  public dataModulos: any;
  private permisosModel: PermisosModel;
  public DatosUsuario : any = {};
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 43;
  constructor(private estadosOperacionesService: EstadosOperacionesService, 
    private notif: AlertService,    private permisosService: PermisosService, 
    private generalesService: GeneralesService, private modulosService: ModulosService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, 
    private loginService: LoginService, private loading: LoadingService,
    private router: Router) {
    this.permisosModel = new PermisosModel();
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.validateForm();
    this.ObtenerOperacionXEstado();
    this.ObtenerOperaciones();
    this.ObtenerEstados();
    this.ObtenerPerfiles();
    let data : string | null = localStorage.getItem('Data')
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
    this.IrArriba();
  }
  ObtenerOperaciones() {
    this.loading.show();
    this.estadosOperacionesService.ObtenerOperaciones().subscribe((result : any[]) => {
        this.loading.hide();
        this.dataOperacion = result;
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  ObtenerEstados() {
    this.loading.show();
    this.estadosOperacionesService.ObtenerEstados().subscribe(result => {
        this.loading.hide();
        this.dataEstados = result;
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  ObtenerPerfiles() {
    this.loading.show();
    this.permisosService.getPerfiles().subscribe(
      result => {
        this.loading.hide();
        this.dataPerfil = result;
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  ObtenerModulosPermitidos() {
    this.loading.show();
    this.permisosModel.IdPerfil = +this.estadosOperacionesFrom.get('IdPerfil')?.value;

    this.permisosService.getPermitidos(this.permisosModel).subscribe(
      result => {
        this.loading.hide();
        console.log(result);
        this.dataModulos = result;
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
    }
  ObtenerOperacionXEstado() {
    this.loading.show();
    this.estadosOperacionesService.ObtenerOperacionXEstado().subscribe(
      result => {
        this.loading.hide();
        this.dataEstadoOperacion = result;
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GuardarEstadosXOperacion() {
    this.loading.show();
    let validator = false;
    this.dataEstadoOperacion.forEach((element : any )=> {
      if (!validator) {
        if (element.IOperacion === +this.estadosOperacionesFrom.value.IdOperacion &&
          element.IdEstado === +this.estadosOperacionesFrom.value.IdEstado &&
          element.IdPerfil === +this.estadosOperacionesFrom.value.IdPerfil &&
          element.IdModulo === +this.estadosOperacionesFrom.value.IdModulo) {
          this.notif.onDanger('Advertencia', 'La operación ya se encuentra asignada a ese estado y perfil.');
          this.loading.hide();
          validator = true;
        } else {
          validator = false;
        }
      }
    });

    if (!validator) {
      this.GuardarLog(this.estadosOperacionesFrom.value, 39, 0, 0);
      this.estadosOperacionesService.GuardarEstadosXOperacion(this.estadosOperacionesFrom.value).subscribe(
        result => {
          this.loading.hide();
          this.dataResultSave = result;
          this.notif.onSuccess('Exitoso', 'El registro se realizó correctamente.');
          this.ObtenerOperacionXEstado();
        },
        error => {
          this.loading.hide();
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
  }
  EliminarEstadosXOperacion(data : any) {
    this.loading.show();
    console.log(data);
    this.GuardarLog(data, 39, 0, 0);
    this.estadosOperacionesService.EliminarOperacionXEstado(data.IdOperacionXEstado).subscribe(
      result => {
        this.loading.hide();
        this.notif.onSuccess('Exitoso', 'El registro se eliminó correctamente.');
        this.ObtenerOperacionXEstado();
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GuardarLog(form : any, operacion : number, cuenta : number, tercero : number) {
    this.loading.show();
    this.generalesService.Guardarlog(form, operacion, cuenta, tercero, 43).subscribe(
      result => {
        this.loading.hide();
        console.log(result);
      });
  }
  validateForm() {
    const IdOperacion = new FormControl('', [Validators.required]);
    const IdEstado = new FormControl('', [Validators.required]);
    const IdPerfil = new FormControl('', [Validators.required]);
    const IdModulo = new FormControl('', [Validators.required]);
    this.estadosOperacionesFrom = new FormGroup({
      IdOperacion: IdOperacion,
      IdEstado: IdEstado,
      IdPerfil: IdPerfil,
      IdModulo: IdModulo
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
