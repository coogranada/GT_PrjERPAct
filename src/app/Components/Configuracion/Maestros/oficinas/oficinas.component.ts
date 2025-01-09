import { OficinasModel } from '../../../../Models/Maestros/oficinas.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OficinasService } from '../../../../Services/Maestros/oficinas.service';
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
  selector: 'app-oficinas',
  templateUrl: './oficinas.component.html',
  styleUrls: ['./oficinas.component.css'],
  providers: [OficinasService, GeneralesService, ModuleValidationService, LoginService],
  standalone : false
})
export class OficinasComponent implements OnInit {
  public dataOficinaResult : any[] = [];
  public isdisabled = false;
  public isdisabledUpdate = true;
  public oficinasModel: OficinasModel;
  public estadosOficinas = [{ value: '0', descripcion: '-- Seleccione --' },
  { value: '3', descripcion: 'Activo' },
  { value: '4', descripcion: 'Inactivo' }];
  public oficinasFrom!: FormGroup;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading : boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 4;
  public DatosUsuario : any = {};

  btnGuardar = false;
  btnActualizar = true;


  constructor(private oficinasService: OficinasService, private notif: NgxToastService,
    private generalesService: GeneralesService, private moduleValidationService: ModuleValidationService,
    private el: ElementRef, private loginService: LoginService, private router: Router) {
    this.oficinasModel = new OficinasModel();
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ObtenerOficinas();
    this.validateForm();
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe((result : any) => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      }
    );
    this.IrArriba();
  }
  ObtenerOficinas() {
    this.loading = true;
    this.oficinasService.getOficinas().subscribe((result : any) => {
        this.loading = false;
        this.dataOficinaResult = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GuardarOficinas() {
    this.loading = true;
    if (this.oficinasFrom.value.IdEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado valido para realizar el registro',);
    } else {
      this.GuardarLog(this.oficinasFrom.value, 96, 0, 0,4); // GUARDAR
      this.oficinasService.setOficinas(this.oficinasFrom.value).subscribe((result : any) => {
          this.loading = false;
          console.log(result);
          if (result) {
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El registro se realizo correctamente');
            this.ObtenerOficinas();
          } else {
            this.notif.onDanger('Error', 'El registro no se puedo realizar');
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
  ActualizarOficinas() {
    this.loading = true;
    if (this.oficinasFrom.value.idEstado === '0') {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado valido para realizar el registro');
    } else {
      console.log(this.oficinasFrom);
      this.GuardarLog(this.oficinasFrom.value, 97, 0, 0,4); // ACTUALIZAR
      this.oficinasService.updateOficinas(this.oficinasFrom.value).subscribe((result : any) => {
          this.loading = false;
          console.log(result);
          if (result) {
            this.isdisabledUpdate = true;
            this.resetForm();
            this.notif.onSuccess('Exitoso', 'El registro se actualizo correctamente');
            this.ObtenerOficinas();
          } else {
            this.notif.onDanger('Error', 'El registro no se puedo actualizar');
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
    this.oficinasFrom.get('valor')?.setValue(datos.Valor);
    this.oficinasFrom.get('descripcion')?.setValue(datos.Descripcion);
    this.oficinasFrom.get('IdEstado')?.setValue(datos.IdEstado);
    this.oficinasFrom.get('IdLista')?.setValue(datos.IdLista);
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
    this.oficinasFrom.reset();
    this.btnGuardar = false;
    this.btnActualizar = true;
  }
  validateForm() {

    const valor = new FormControl('',[ Validators.required, Validators.pattern('[0-9]*')]);
    const descripcion = new FormControl('', [Validators.required]);
    const IdEstado = new FormControl('',[ Validators.required]);
    const IdOficina = new FormControl('', []);
    const IdLista = new FormControl('', []);
    this.oficinasFrom = new FormGroup({
      valor: valor,
      descripcion: descripcion,
      IdEstado: IdEstado,
      IdOficina: IdOficina,
      IdLista: IdLista
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}