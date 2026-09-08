import { AreasService } from '../../../../Services/Maestros/areas.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GeneralesService } from '../../../../../app/Services/Productos/generales.service';
import { ModuleValidationService } from '../../../../../app/Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../../../../app/Services/Login/login.service';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from '../../../../Services/Alert/alert.service';
import { LoadingService } from '../../../../Services/shared/loading.service';
import { StorageSecurity } from '../../../../utils/storage-security.util';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css'],
  providers: [AreasService, GeneralesService, ModuleValidationService, LoginService,BrowserAnimationsModule,
    NoopAnimationsModule ],
  standalone : false
})

export class AreasComponent implements OnInit {
  public areasFrom!: FormGroup;
  public isdisabled : boolean = false;
  public isdisabledUpdate : boolean = true;
  public estadosArea : any[] = [{ value: '0', descripcion: '-- Seleccione --' },
  { value: '3', descripcion: 'Activo' },
  { value: '4', descripcion: 'Inactivo' }];
  public dataAreaResult: any[] = [];
  public primaryColour : string = ColorPrimario;
  public secondaryColour : string = ColorSecundario;
  private CodModulo = 2;
  public DatosUsuario : any;

  btnGuardar : boolean = false;
  btnActualizar : boolean = true;

  constructor(private areasService: AreasService, private notif: AlertService,
    private generalesService: GeneralesService, private moduleValidationService: ModuleValidationService,
    private el: ElementRef, private loginService: LoginService, private router: Router,
    private loading: LoadingService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.validateForm();
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ObtenerArea();
    this.DatosUsuario = StorageSecurity.getData();
    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe((result : any ) => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
    this.IrArriba();
  }
  ObtenerArea() {
    this.loading.show();
    this.areasService.getArea().subscribe((result : any[]) => {
        this.loading.hide();
        this.dataAreaResult = result;
      },(error : any) => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GuardarArea() {
    this.loading.show();
    if (this.areasFrom.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado.');
    } else {
      this.GuardarLog(this.areasFrom.value, 96, 0, 0,2); // GUARDAR
      this.areasService.setAreas(this.areasFrom.value).subscribe((result : any) => {
          this.loading.hide();
          console.log("g",result)
          if (result) {
            this.resetForm();
            
           this.notif.onSuccess('Exitoso', 'El área se guardó correctamente.');
            this.ObtenerArea();
          } else {
            this.notif.onDanger('Advertencia', 'Ocurrió un error al guardar el área.');
          }
        },(error : any ) => {
          this.loading.hide();
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log();
        });
    }
  }
  ActualizarArea() {
    this.loading.show();
    if (this.areasFrom.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado.');
    } else {
      this.GuardarLog(this.areasFrom.value, 97, 0, 0,2); // ACTUALIZAR
      this.areasService.updateAreas(this.areasFrom.value).subscribe((result : any) => {
          this.loading.hide();
          console.log(result);
          if (result) {
            this.isdisabledUpdate = true;
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El área se actualizó correctamente.');
            this.ObtenerArea();
          } else {
            this.notif.onDanger('Advertencia', 'Ocurrió un error al actualizar el área.');
          }
        }, (error : any) => {
          this.loading.hide();
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
    this.areasFrom.get('idArea')?.setValue(datos.IdArea);
    this.areasFrom.get('nombre')?.setValue(datos.Nombre);
    this.areasFrom.get('descripcion')?.setValue(datos.Descripcion);
    this.areasFrom.get('idEstado')?.setValue(datos.IdEstado);
  }
  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.loading.show();
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        console.log(result);
        this.loading.hide();
      });
  }
  resetForm() {
    this.isdisabledUpdate = true;
    this.areasFrom.reset();
    this.btnGuardar = false;
    this.btnActualizar = true;
  }
  validateForm() {
    const idArea = new FormControl('', []);
    const nombre = new FormControl('', [Validators.required]);
    const descripcion = new FormControl('', [Validators.required]);
    const idEstado = new FormControl('', [Validators.required]);
    this.areasFrom = new FormGroup({
      idArea: idArea,
      nombre: nombre,
      descripcion: descripcion,
      idEstado: idEstado
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
