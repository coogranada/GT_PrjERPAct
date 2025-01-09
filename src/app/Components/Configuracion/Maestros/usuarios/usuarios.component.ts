import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UsuariosModel } from '../../../../Models/Maestros/usuarios.model';
import { UsuariosService } from '../../../../Services/Maestros/usuarios.service';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import moment from 'moment';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../../../Services/Login/login.service';
import { ImagenesBannerServices } from '../../../../Services/Maestros/imagenes-banner.service';
import { UsuariosImagenModel } from '../../../../Models/Maestros/banner.model';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [UsuariosService, GeneralesService, ModuleValidationService, LoginService, ImagenesBannerServices],
  standalone : false
})

export class UsuariosComponent implements OnInit {
  //#region Variables
  public resultDocumento : any[] =[];
  public resultArea : any[] = [];
  public resultCargo : any[] = [];
  public resultOficina : any[] = [];
  public resultPerfiles : any[] = [];
  public usuariosModel: UsuariosModel;
  public selectedTipo : number | null = 0;
  public selectedArea : number | null= 0;
  public selectedCargo : number | null = 0;
  public selectedOficina : number | null = 0;
  public selectedEstado : any;
  public estadosUsuarios = [
    { value: '3', descripcion: 'Activo' },
    { value: '4', descripcion: 'Inactivo' }];
  public usuariosFrom!: FormGroup;
  public base64textString: string | null = "";
  public bannerArrayModel = new UsuariosImagenModel();
  public bloqueoBtnAgregar : boolean | null = true;
  public isdisabled = true;
  public disableActualizar = true;

  public Usuarios : any[] = [];
  public items : any[] = [];
  public infoForm: any;
  public ColorAnterior1: any;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 9;
  public DatosUsuario : any = {};
  public IdUserSearchs : any;
  //#endregion
  
  constructor(private usuariosServices: UsuariosService, private notificacion: NgxToastService,
    private generalesService: GeneralesService, private moduleValidationService: ModuleValidationService,
    private el: ElementRef, private loginService: LoginService, private router: Router, private ImagenesBannerServices: ImagenesBannerServices) {
    this.usuariosModel = new UsuariosModel();
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
    this.TipoIdentificacion();
    this.AreasActivas();
    this.CargosActivos();
    this.PerfilesActivos();
    this.ObtenerOficinas();
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
    this.usuariosServices.GetConsultarUsuarios().subscribe(result => {
        this.Usuarios = result;
        console.log(result);
      },
      error => {
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }); 
  }
  TipoIdentificacion() {
    this.loading = true;
    this.usuariosServices.getTipoIdentificacion().subscribe(result => {
        this.loading = false;
        this.resultDocumento = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  AreasActivas() {
    this.loading = true;
    this.usuariosServices.getAreasActivas().subscribe(
      result => {
        this.loading = false;
        this.resultArea = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  CargosActivos() {
    this.loading = true;
    this.usuariosServices.getCargosActivos().subscribe(
      result => {
        this.loading = false;
        this.resultCargo = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  ObtenerOficinas() {
    this.loading = true;
    this.usuariosServices.getOficinas().subscribe(
      result => {
        this.loading = false;
        this.resultOficina = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  PerfilesActivos() {
    this.loading = true;
    this.usuariosServices.getPerfilesActivos().subscribe(
      result => {
        this.loading = false;
        this.resultPerfiles = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  handleFileSelect(evt : any) {
    var files = evt.target.files;
    if (files[0].type === "image/jpeg" || files[0].type === "image/jpg"
      || files[0].type === "image/png" || files[0].type === "image/gif") {
      var file = files[0];
      var fileSize = files[0].size;
      if (fileSize < 6000) {
        this.base64textString = '';
        this.notificacion.onWarning('Advertencia', 'El tamaño de la imagen es muy pequeña.');
        this.usuariosFrom.get('Base64String')?.reset();
      } else if (fileSize > 500000) {
        this.base64textString = '';
        this.notificacion.onWarning('Advertencia', 'El tamaño de la imagen es muy grande.');
        this.usuariosFrom.get('Base64String')?.reset();
      } else {
        if (files && file) {
          var reader = new FileReader();
          reader.onload = this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
          // this.bloqueoBtnAgregar = null;
        }
      }
    } else {
      this.base64textString = '';
      this.notificacion.onWarning('Advertencia', 'Este tipo de archivo no esta permitido.');
      this.usuariosFrom.get('Base64String')?.reset();
    }
  }
  _handleReaderLoaded(readerEvt : any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }
  GuardarImagenUsuario(info: any) {
    this.bannerArrayModel = new UsuariosImagenModel();
    this.bannerArrayModel.IdImagenUsuario = 0;
    this.bannerArrayModel.Base64String = this.base64textString;
    this.bannerArrayModel.IdUsuario = info.IdUsuario;
    this.bannerArrayModel.UsuarioModifico = info.Usuario;
    this.bannerArrayModel.FechaCreacion = new Date();
    this.bannerArrayModel.FechaModificacion = this.bannerArrayModel.FechaCreacion;
    this.ImagenesBannerServices.setImagenUser(this.bannerArrayModel).subscribe(result => {}, error => {
      console.error('Error al realizar el registro: ' + error);
      this.notificacion.onDanger('Error', 'No se pudo realizar el registro - Error: ' + error);
        this.bannerArrayModel = new UsuariosImagenModel();
    });
  }
  GuardarUsuarios() {
    if (this.usuariosFrom.valid) {
    this.loading = true;
    const nombreCompleto = this.usuariosFrom.get('Nombre')?.value + ','
      + this.usuariosFrom.get('SegundoNombre')?.value + ','
      + this.usuariosFrom.get('Apellido')?.value + ','
      + this.usuariosFrom.get('SegundoApellido')?.value;
    this.usuariosFrom.get('Nombre')?.setValue(nombreCompleto);

    this.usuariosFrom.get('IdArea')?.setValue(this.usuariosFrom.get('AreaL')?.value.IdArea);
    this.usuariosFrom.get('IdCargo')?.setValue(this.usuariosFrom.get('CargoL')?.value.IdCargo);
    this.usuariosFrom.get('IdOficina')?.setValue(this.usuariosFrom.get('OficinaL')?.value.IdLista);
      this.infoForm = this.usuariosFrom.value;
      this.GuardarLog('Registro usuario' + JSON.stringify(this.infoForm), 96, 0, 0, 9); // GUARDAR
     this.usuariosServices.setUsuario(this.usuariosFrom.value).subscribe(
       result => {
         this.loading = false;
         if (result) {           
           this.usuariosFrom.reset();
           this.items = [];
           this.notificacion.onSuccess('Exitoso', 'El usuario se guardó correctamente.');           
           this.GuardarImagenUsuario(result);
         } else {
           this.items = [];
           this.notificacion.onDanger('Error', 'Ocurrió un error al guardar el usuario.');
         }
       },error => {
         this.loading = false;
         const errorMessage = <any>error;
         this.notificacion.onDanger('Error', errorMessage);
         console.log(errorMessage);
       });
    } else {
      this.ValidErrorForm(this.usuariosFrom);
    }
  }
  BuscarUsuarios(Campo : any) {
    this.base64textString = null;
    this.loading = true;
    if (Campo === 'Documento') {
      this.usuariosFrom.get('Usuario')?.reset();
      this.usuariosFrom.get('Usuario')?.setValue('');
    } else if (Campo === 'Usuario') {
      this.usuariosFrom.get('Documento')?.reset();
      this.usuariosFrom.get('Documento')?.setValue('');
    }
    this.items = [];
    this.usuariosServices.getBuscarUsuario(this.usuariosFrom.value).subscribe(
      result => {
        this.loading = false;
        if (result.error === null) {
          this.bloqueoBtnAgregar = null;
          this.disableActualizar = false;
          this.isdisabled = true;
          this.usuariosFrom.reset();
          const cadena = result.Nombre.split(',');

          this.selectedTipo = result.IdTipoDocumento;
          this.selectedArea = result.IdArea;
          this.selectedCargo = result.IdCargo;
          this.selectedOficina = result.IdOficina;
          this.selectedEstado = result.IdEstado;

          this.usuariosFrom.get('Nombre')?.setValue(cadena[0]);
          if (cadena[1] !== 'null') {
            this.usuariosFrom.get('SegundoNombre')?.setValue(cadena[1]);
          } else {
            this.usuariosFrom.get('SegundoNombre')?.setValue('');
          }

          this.usuariosFrom.get('Apellido')?.setValue(cadena[2]);

          if (cadena[3] !== 'null') {
            this.usuariosFrom.get('SegundoApellido')?.setValue(cadena[3]);
          } else {
            this.usuariosFrom.get('SegundoApellido')?.setValue('');
          }
          result.Perfiles.forEach((element : any) => {
            this.items.push(element);
            this.usuariosFrom.get('Perfiles')?.setValue(this.items);
          });
          this.resultArea.forEach((elementArea : any) => {
            if (elementArea.IdArea === result.IdArea) {
              this.usuariosFrom.get('AreaL')?.setValue(elementArea.Nombre);
              this.usuariosFrom.get('IdArea')?.setValue(elementArea.IdArea);
            }
          });
          this.resultCargo.forEach(elementCargo => {
            if (elementCargo.IdCargo === result.IdCargo) {
              this.usuariosFrom.get('CargoL')?.setValue(elementCargo.Nombre);
              this.usuariosFrom.get('IdCargo')?.setValue(elementCargo.IdCargo);
            }
          });
          this.resultOficina.forEach((elementOficina : any) => {
            if (elementOficina.IdLista === result.IdOficina) {
              this.usuariosFrom.get('OficinaL')?.setValue(elementOficina.Descripcion);
              this.usuariosFrom.get('IdOficina')?.setValue(elementOficina.IdLista);
            }
          });
          this.usuariosFrom.get('IdEstado')?.setValue(result.IdEstado);
          this.usuariosFrom.get('IdTipoDocumento')?.setValue(result.IdTipoDocumento);
          this.usuariosFrom.get('Documento')?.setValue(result.Documento);
          this.usuariosFrom.get('Extension')?.setValue(result.Extension);
          this.usuariosFrom.get('Usuario')?.setValue(result.Usuario);
          const dateString = result.FechaNacimiento;
          const newDate = new Date(dateString);
          const fechaStringNew = moment(newDate).format('YYYY-MM-DD');
          this.usuariosFrom.get('FechaNacimiento')?.setValue(fechaStringNew);
          this.usuariosFrom.get('Email')?.setValue(result.Email);
          this.usuariosFrom.get('Celular')?.setValue(result.Celular);
          this.usuariosFrom.get('IdUsuario')?.setValue(result.IdUsuario);
          this.IdUserSearchs = result.IdUsuario;
          this.usuariosFrom.get('Autorizador')?.setValue(result.Autorizador);

        } else {
          this.isdisabled = false;
          this.selectedTipo = null;
          this.selectedArea = null;
          this.selectedCargo = null;
          this.selectedOficina = null;
          this.selectedEstado = null;
          this.disableActualizar = true;
          this.bloqueoBtnAgregar = true;
          this.usuariosFrom.reset();
          this.notificacion.onWarning('Advertencia', result.error.Mensaje);
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  CambioArea() {
    this.usuariosFrom.get('IdArea')?.setValue(null);
  }
  CambioCargo() {
    this.usuariosFrom.get('IdCargo')?.setValue(null);
  }
  CambioOficina() {
    this.usuariosFrom.get('IdOficina')?.setValue(null);
  }
  ActualizarUsuarios() { 
    if (this.usuariosFrom.valid) {
    this.loading = true;
    const nombreCompleto = this.usuariosFrom.get('Nombre')?.value + ','
      + this.usuariosFrom.get('SegundoNombre')?.value + ','
      + this.usuariosFrom.get('Apellido')?.value + ','
      + this.usuariosFrom.get('SegundoApellido')?.value;
    this.usuariosFrom.get('Nombre')?.setValue(nombreCompleto);

    if (this.usuariosFrom.get('IdArea')?.value === null) {
      this.usuariosFrom.get('IdArea')?.setValue(this.usuariosFrom.get('AreaL')?.value.IdArea);
    } if (this.usuariosFrom.get('IdCargo')?.value === null) {
      this.usuariosFrom.get('IdCargo')?.setValue(this.usuariosFrom.get('CargoL')?.value.IdCargo);
    } if (this.usuariosFrom.get('IdOficina')?.value === null) {
      this.usuariosFrom.get('IdOficina')?.setValue(this.usuariosFrom.get('OficinaL')?.value.IdLista);
    }
      this.infoForm = this.usuariosFrom.value;  
      this.GuardarLog(this.infoForm, 97, 0, 0, 9);// ACTUALIZAR
     this.usuariosServices.updateUsuario(this.usuariosFrom.value).subscribe(result => {
         this.loading = false;
         if (result) {           
           this.bloqueoBtnAgregar = true;
           this.disableActualizar = true;
           this.notificacion.onSuccess('Exitoso', 'El usuario se actualizó correctamente.');
           this.items = [];
           this.isdisabled = false;          
           this.usuariosFrom.reset();
         } else {
           this.disableActualizar = true;
           this.notificacion.onDanger('Error', 'Ocurrió un error al actualizar el usuario.');
         }
       },
       error => {
         this.loading = false;
         const errorMessage = <any>error;
         this.notificacion.onDanger('Error', error);
         console.log(errorMessage);
       });
    } else {
      this.ValidErrorForm(this.usuariosFrom);
    }
  }
  ActualizarImagenUsuario() {
    if (this.base64textString !== null && this.base64textString !== undefined && this.base64textString !== '') {
      // aqui consumir los datos del usuario encontrado
      let data : string | null = localStorage.getItem('Data');
      const resultUserConect = JSON.parse(window.atob(data == null ? "" : data));
      this.bannerArrayModel = new UsuariosImagenModel();
      this.bannerArrayModel.IdImagenUsuario = 0;
      this.bannerArrayModel.Base64String = this.base64textString;
      this.bannerArrayModel.IdUsuario = this.IdUserSearchs;
      this.bannerArrayModel.UsuarioModifico = resultUserConect.Usuario;
      this.bannerArrayModel.FechaCreacion = new Date();
      this.bannerArrayModel.FechaModificacion = this.bannerArrayModel.FechaCreacion;

      this.ImagenesBannerServices.updateImagenUsere(this.bannerArrayModel).subscribe(
        result => {
          this.notificacion.onSuccess('Exitoso', 'La imagen se actualizo correctamente.');
          this.usuariosFrom.reset()
        }, error => {
          console.error('Error al realizar el registro: ' + error);
          this.notificacion.onDanger('Error', 'No se pudo realizar el registro - Error: ' + error);
          this.bannerArrayModel = new UsuariosImagenModel();
      });
    } else {
      this.notificacion.onWarning('Advertencia', 'Debe seleccionar una imagen para realizar esta operación.');
    }
  }
  addTags(data : any) {
    let _existePerfil = false;
    if (this.items.length === 0) {
      this.items.push(this.usuariosFrom.get('Perfil')?.value);
      this.usuariosFrom.get('Perfiles')?.setValue(this.items);
      _existePerfil = true;
    } else {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].IdPerfil === this.usuariosFrom.get('Perfil')?.value.IdPerfil) {
          _existePerfil = true;
        }
      }
    }
    if (!_existePerfil) {
      this.items.push(this.usuariosFrom.get('Perfil')?.value);
      this.usuariosFrom.get('Perfiles')?.setValue(this.items);
    }
  }
  RemovedTags($event : any) {
    const indexDelete = this.items.findIndex(status => status.IdPerfil === $event.IdPerfil);
    this.items.splice(indexDelete, 1);
  }
  GuardarLog(form : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.generalesService.Guardarlog(form, operacion, cuenta, tercero, modulo).subscribe( result => {
        this.loading = false;
        console.log(result);
      });
  }
  Nuevo() {
    this.usuariosFrom.reset();
    this.bloqueoBtnAgregar = true;
    this.disableActualizar = true;
    this.isdisabled = false;
    this.items = [];
  }
  validateForm() {
    const IdTipoDocumento = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const Documento = new FormControl('', [Validators.required]);
    const Nombre = new FormControl('', [Validators.required]);
    const Apellido = new FormControl('', [Validators.required]);
    const AreaL = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const CargoL = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const OficinaL = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const IdArea = new FormControl('', []);
    const IdCargo = new FormControl('', []);
    const IdOficina = new FormControl('', []);
    const Usuario = new FormControl('', [Validators.required]);
    const FechaNacimiento = new FormControl('', [Validators.required]);
    const Email = new FormControl('', [Validators.required]);
    const IdEstado = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const Celular = new FormControl('', [Validators.pattern('^[0-9]*'),Validators.maxLength(10),Validators.minLength(10)]);
    const SegundoNombre = new FormControl('', []);
    const SegundoApellido = new FormControl('', []);
    const Extension = new FormControl('', []);
    const Perfil = new FormControl('', []);
    const Perfiles = new FormControl('', []);
    const IdUsuario = new FormControl('', []);
    const Autorizador = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const Base64String = new FormControl('', []);
  
    this.usuariosFrom = new FormGroup({
      Celular : Celular,
      Documento: Documento,
      IdTipoDocumento: IdTipoDocumento,
      Nombre: Nombre,
      Apellido: Apellido,
      IdArea: IdArea,
      IdCargo: IdCargo,
      IdOficina: IdOficina,
      AreaL: AreaL,
      CargoL: CargoL,
      OficinaL: OficinaL,
      Usuario: Usuario,
      FechaNacimiento: FechaNacimiento,
      Email: Email,
      IdEstado: IdEstado,
      SegundoNombre: SegundoNombre,
      SegundoApellido: SegundoApellido,
      Extension: Extension,
      Perfil: Perfil,
      Perfiles: Perfiles,
      IdUsuario: IdUsuario,
      Autorizador: Autorizador,
      Base64String: Base64String
    });
  }
  // Valida que el campo no contenga el caracter que llega como parametro
  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }
  ValidErrorForm(formulario: any) {
    Object.keys(formulario.controls).forEach(field => { // {1}
      const control = formulario.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
  CambiarColor(fil : any, producto : number) {
    if (producto === 1) {
      $(".filUsuario_" + this.ColorAnterior1).css("background", "#FFFFFF");
      $(".filUsuario_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior1 = fil;
    }
  }
}
