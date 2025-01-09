
import { PermisosService } from '../../../../Services/Maestros/permiso.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PermisosModel } from '../../../../Models/Maestros/permisos.model';
import Swal from 'sweetalert2';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../../Services/Login/login.service';
import { Router } from '@angular/router';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css'],
  providers: [PermisosService, GeneralesService, GeneralesService, ModuleValidationService, LoginService],
  standalone : false
})
export class PermisosComponent implements OnInit {
  public DenegadosResult : any[] = [];
  public PermitidosResult : any[] = [];
  public dataResult : any = {};
  private permisosModel: PermisosModel;
  public permisosForm!: FormGroup;
  public arrayAddPermiso: any;
  public arrayRemovePermiso: any;
  public items = [];
  public selected = [];
  public dropdownList = [];
  public selectedItems = [];
  public bloqueoAgregar : boolean | null = true;
  public bloqueoEliminar = true;
  public selectedRowAdd : number = 0;
  public selectedRowRemove : number = 0;
  public compsreUndefined = undefined;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 8;
  public DatosUsuario : any = {};
  constructor(private permisosService: PermisosService, private elm: ElementRef,
    private notif: NgxToastService, private generalesService: GeneralesService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, private loginService: LoginService,
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
    this.ObtenerPermiso();
   
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
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  ObtenerPermiso() {
    this.loading = true;
    this.permisosService.getPerfiles().subscribe((result :any) => {
        this.loading = false;
        this.dataResult = result;
      },(error : any) => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  ObtenerAllPermisos() {
    this.ObtenerPermisosDenegados();
    this.ObtenerPermisosPermitidos();
  }
  ObtenerPermisosPermitidos() {
    this.loading = true;
    this.selected = [];
    this.permisosModel.IdPerfil = this.permisosForm.controls['selectPermiso'].value;
    this.permisosService.getPermitidos(this.permisosModel).subscribe(result => {
        this.loading = false;
        this.PermitidosResult = result;
        this.permisosForm.get('itemSelect')?.setValue(this.PermitidosResult);
        this.permisosForm.get('selectedItems')?.setValue(this.PermitidosResult);
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  ObtenerPermisosDenegados() {
    this.loading = true;
    this.permisosModel.IdPerfil = this.permisosForm.controls['selectPermiso'].value;
    this.permisosService.getDenegados(this.permisosModel).subscribe((result : any[] ) => {
        this.loading = false;
        this.DenegadosResult = result;
      },(error : any) => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  setClickedRowAdd(index : number) {
    this.selectedRowRemove = 0;
    this.selectedRowAdd = index;
    this.bloqueoAgregar = false;
    this.bloqueoEliminar = true;
  }
  setClickedRowRemove(index : number) {
    this.selectedRowAdd = 0;
    this.selectedRowRemove = index;
    this.bloqueoEliminar = false;
    this.bloqueoAgregar = true;
  }
  AddPermisos($event : any) {
    this.arrayRemovePermiso = [];
    this.bloqueoEliminar = true;
    this.arrayAddPermiso = [];
    if (this.arrayAddPermiso.length <= 0) {
      this.arrayAddPermiso.push($event);
      this.bloqueoAgregar = null;
    }
  }
  RemovePermisos($event : any) {
    this.arrayAddPermiso = [];
    this.bloqueoAgregar = false;
    this.arrayRemovePermiso = [];

    if (this.arrayRemovePermiso.length <= 0) {
      this.arrayRemovePermiso.push($event);
      this.bloqueoEliminar = false;
    }
  }
  sendPermisos() {
    this.loading = true;
    this.permisosModel.IdPerfil = this.permisosForm.get('selectPermiso')?.value;
    this.permisosModel.IdPermiso = this.selectedRowAdd;
    this.permisosModel.IdModulo = this.arrayAddPermiso[0].IdModulo;
    this.GuardarLog(this.permisosModel, 98, 0, 0, 8); // AGREGAR
    this.permisosService.AgregarDenegados(this.permisosModel).subscribe((result : any) => {
        if (result) {
          this.loading = false;
          this.ObtenerAllPermisos();
          this.notif.onSuccess('Exitoso', 'El permiso se guardó correctamente.');
        } else {
          this.notif.onWarning('Advertencia', 'Ocurrió un error al guardar el permiso.');
        }
      },(error : any) => {
        this.loading = false;
        this.notif.onDanger('Error', error);
        console.error('sendPermisos' + error);
      });
    this.selectedRowAdd = 0;
    this.arrayAddPermiso = [];
    this.bloqueoAgregar = true;
  }
  returnPermisos() {
    this.permisosModel.IdPerfil = this.permisosForm.get('selectPermiso')?.value;
    this.permisosModel.IdPermiso = this.selectedRowRemove;
    this.permisosModel.IdModulo = this.arrayRemovePermiso[0].IdModulo;

    Swal.fire({
      title: '¿Desea eliminar el permiso?',
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
        this.GuardarLog(this.permisosModel, 99, 0, 0, 8); //ELIMINAR
        this.permisosService.EliminarPermitidos(this.permisosModel).subscribe(result => {
            if (result) {
              this.ObtenerAllPermisos();
              this.notif.onSuccess('Exitoso', 'El permiso se eliminó correctamente.');
            } else {
              this.notif.onWarning('Advertencia', 'Ocurrió un error al eliminar el permiso.');
            }
          },
          error => {
            this.notif.onDanger('Error', error);
            console.error('returnPermisos' + error);
          });
      }
    });
    this.selectedRowRemove = 0;
    this.arrayRemovePermiso = [];
    this.bloqueoEliminar = true;
  }
  GuardarLog(form : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.loading = true;
    this.generalesService.Guardarlog(form, operacion, cuenta, tercero, modulo).subscribe(result => {
        this.loading = false;
        console.log(result);
      });
  }
  validateForm() {
    const selectPermiso = new FormControl('', [Validators.required]);
    const itemSelect = new FormControl('', [ Validators.required ]);
    const selectedItems = new FormControl('', [ Validators.required ]);

    this.permisosForm = new FormGroup({
      selectPermiso: selectPermiso,
      itemSelect: itemSelect,
      selectedItems: selectedItems
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
