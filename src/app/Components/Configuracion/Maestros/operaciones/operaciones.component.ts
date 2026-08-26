import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';
import { PermisosService } from '../../../../Services/Maestros/permiso.service';
import { ClientesGetListService } from '../../../../Services/Clientes/clientesGetList.service';
import { PermisosModel } from '../../../../Models/Maestros/permisos.model';
import { EstadosOperacionesService } from '../../../../Services/Maestros/estados-operaciones.service';
import Swal from 'sweetalert2';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { reduce, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../../../Services/Login/login.service';
import { AlertService } from '../../../../Services/Alert/alert.service';
import { LoadingService } from '../../../../Services/shared/loading.service';
import { StorageSecurity } from '../../../../utils/storage-security.util';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.css'],
  providers: [OperacionesService, PermisosService, ClientesGetListService,
    EstadosOperacionesService, GeneralesService, ModuleValidationService, LoginService],
    standalone : false
})
export class OperacionesComponent implements OnInit {
  public operacionesFrom!: FormGroup;
  public dataPerfil : any[] = [];
  public dataModulos : any[] = [];
  public dataDenegadas : any[] = [];
  public datapermitidas : any[] = [];
  private permisosModel: PermisosModel;
  public bloqueoAgregar : boolean | null = true;
  public bloqueoEliminar = true;
  public selectedRowAdd : number = 0;
  public selectedRowRemove : number = 0;
  public arrayAddOperacion: any;
  public arrayRemoveOperacion: any;
  public arrayRemove: any;
  public arrayForm: any;
  public compareUndefined = undefined;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 42;
  public DatosUsuario : any = {};
  constructor(private permisosService: PermisosService,
    private operacionesService: OperacionesService,
    private notif: AlertService,
    private generalesService: GeneralesService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef,
    private loginService: LoginService, private router: Router,
    private loading: LoadingService) {
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
    this.ObtenerPerfiles();
    this.DatosUsuario = StorageSecurity.getData();
    
  this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
    this.IrArriba();
  }
  ObtenerPerfiles() {
    this.loading.show();
    this.permisosService.getPerfiles().subscribe((result : any[]) => {
        this.loading.hide();
        this.dataPerfil = result;
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  ObtenerModulosPermitidos() {
    this.loading.show();
    this.operacionesFrom.get('IdModulo')?.reset();
    this.dataDenegadas = [];
    this.datapermitidas = [];
    this.permisosModel.IdPerfil = this.operacionesFrom.get('IdPerfil')?.value;
    this.permisosService.getPermitidos(this.permisosModel).subscribe((result : any[]) => {
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
  OperacionesDenegadas() {
    this.loading.show();
    this.operacionesService.OperacionesDenegadasPerfil(this.operacionesFrom.value).subscribe((result : any[]) => {
        this.loading.hide();
        this.dataDenegadas = result;
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  OperacionesPermitidas() {
    this.loading.show();
    this.operacionesService.OperacionesPermitidasPerfil(this.operacionesFrom.value).subscribe(
      result => {
        this.loading.hide();
        this.datapermitidas = result;
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  ObtenerPermitidosDenegados() {
    this.OperacionesDenegadas();
    this.OperacionesPermitidas();
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
    this.arrayRemoveOperacion = [];
    this.bloqueoEliminar = true;
    this.arrayAddOperacion = [];

    if (this.arrayAddOperacion.length <= 0) {
      this.arrayAddOperacion.push($event);
      this.bloqueoAgregar = null;
    }
  }
  RemovePermisos($event : any) {
    this.arrayAddOperacion = [];
    this.bloqueoAgregar = false;
    this.arrayRemoveOperacion = [];

    if (this.arrayRemoveOperacion.length <= 0) {
      this.arrayRemoveOperacion.push($event);
      this.bloqueoEliminar = false;
    }
  }
  sendPermisos() {
    this.loading.show();
    const _IdPerfil = this.operacionesFrom.get('IdPerfil')?.value;
    const _IdModulo = this.operacionesFrom.get('IdModulo')?.value;
    this.arrayRemove = this.arrayAddOperacion[0];
    this.arrayForm = this.operacionesFrom.value;
    const _IdOperacion = this.arrayRemove.IdOperacion;
    let _usuarios = '';
    let _Mensaje = '';
    this.operacionesService.ObtenerUsuarios(_IdPerfil, _IdModulo, _IdOperacion).subscribe(
      result => {
        this.loading.hide();
        if (result !== null && result.length > 0) {
          result.forEach((element: any) => {
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
            _Mensaje = _usuarios + ' tienen autorpermiso especialización para esta operación, ' +
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
          }).then((results) => {
            this.operacionesFrom.get('IdOperaciones')?.setValue(this.arrayForm.IdOperaciones);
            this.operacionesFrom.get('IdOperacionesPerfil')?.setValue(this.arrayForm.IdOperacionesPerfil);
            this.operacionesFrom.get('IdPerfil')?.setValue(this.arrayForm.IdPerfil);
            this.operacionesFrom.get('IdModulo')?.setValue(this.arrayForm.IdModulo);
            if (results.value) {
              this.operacionesService.EliminarUsuXModXOpe(_IdPerfil, _IdModulo, _IdOperacion).subscribe(
                resultado => {
                  if (resultado) {
                    this.AgregarOperacion();
                  } else {
                    this.notif.onWarning('Advertencia','Ocurrió un error al eliminar el permiso especial. - ' + result);
                  }
                },
                error => {
                  this.loading.hide();
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.log(errorMessage);
                });
            }
          });
        } else {
          this.operacionesFrom.get('IdOperaciones')?.setValue(this.arrayForm.IdOperaciones);
          this.operacionesFrom.get('IdOperacionesPerfil')?.setValue(this.arrayForm.IdOperacionesPerfil);
          this.operacionesFrom.get('IdPerfil')?.setValue(this.arrayForm.IdPerfil);
          this.operacionesFrom.get('IdModulo')?.setValue(this.arrayForm.IdModulo);
          this.AgregarOperacion();
        }
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  AgregarOperacion() {
    this.loading.show();
    this.arrayRemove = this.arrayAddOperacion[0];
    this.arrayForm = this.operacionesFrom.value;
    this.operacionesFrom.get('IdOperaciones')?.setValue(this.arrayRemove.IdOperacion);
    this.GuardarLog(this.operacionesFrom.value, 98, 0, 0, 42); // AGRGAR
    this.operacionesService.GuardarOperacionXPerfil(this.operacionesFrom.value).subscribe(
      result => {
        if (result) {
          this.loading.hide();
          this.operacionesFrom.get('IdOperaciones')?.setValue(this.arrayForm.IdOperaciones);
          this.operacionesFrom.get('IdOperacionesPerfil')?.setValue(this.arrayForm.IdOperacionesPerfil);
          this.operacionesFrom.get('IdPerfil')?.setValue(this.arrayForm.IdPerfil);
          this.operacionesFrom.get('IdModulo')?.setValue(this.arrayForm.IdModulo);
          this.ObtenerPermitidosDenegados();
          this.notif.onSuccess('Exitoso', 'La operación se guardó correctamente.');
        } else {
          this.notif.onWarning('Advertencia', 'Ocurrió un error al guardar la operación.');
        }
      },
      error => {
        this.loading.hide();
        console.error('sendPermisos' + error);
      });
    this.selectedRowAdd = 0;
    this.arrayAddOperacion = [];
    this.bloqueoAgregar = true;
  }
  returnPermisos() {
    const _idperfil = this.operacionesFrom.get('IdPerfil')?.value;
    const _idmodulo = this.operacionesFrom.get('IdModulo')?.value;

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
        this.operacionesFrom.get('IdOperacionesPerfil')?.setValue(this.arrayRemove.IdOperacionesPerfil);
        this.operacionesFrom.get('IdPerfil')?.setValue(_idperfil);
        this.operacionesFrom.get('IdModulo')?.setValue(_idmodulo);
        // this.operacionesFrom.get('IdOperaciones').setValue(this.arrayRemove.IdOperaciones);
        this.GuardarLog(this.operacionesFrom.value, 99, 0, 0, 42); //ELIMINAR
        this.operacionesService.EliminarOperacionXPerfil(this.operacionesFrom.value).subscribe(
          result => {
            if (result) {
              this.ObtenerPermitidosDenegados();
              this.notif.onSuccess('Exitoso', 'La operación se eliminó correctamente.');
            } else {
              this.notif.onWarning('Advertencia',
                'Ocurrió un error al eliminar la operación. - ' + result);
            }
          },
          error => {
            console.error('returnPermisos' + error);
          });
      }
    });
    this.selectedRowRemove = 0;
    this.arrayRemoveOperacion = [];
    this.bloqueoEliminar = true;
  }
  GuardarLog(form : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.loading.show();
    this.generalesService.Guardarlog(form, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        this.loading.hide();
        console.log(result);
      }
    );
  }
  validateForm() {
    const IdPerfil = new FormControl('', [Validators.required]);
    const IdModulo = new FormControl('', [Validators.required]);
    const IdOperaciones = new FormControl('', [Validators.required]);
    const IdOperacionesPerfil = new FormControl('', []);
    const IdUsuario = new FormControl('', []);
    this.operacionesFrom = new FormGroup({
      IdModulo: IdModulo,
      IdPerfil: IdPerfil,
      IdOperaciones: IdOperaciones,
      IdOperacionesPerfil: IdOperacionesPerfil,
      IdUsuario: IdUsuario
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
