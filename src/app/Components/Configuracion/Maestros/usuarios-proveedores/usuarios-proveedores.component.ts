import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChange } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, AbstractControlDirective } from '@angular/forms';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { UsuariosProveedoresService } from '../../../../Services/Maestros/usuarios-proveedores';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;

@Component({
  selector: 'app-usuarios-proveedores',
  templateUrl: './usuarios-proveedores.component.html',
  styleUrls: ['./usuarios-proveedores.component.css'],
  providers: [UsuariosProveedoresService, GeneralesService],
  standalone : false
})
export class UsuariosProveedoresComponent implements OnInit {
  public usuariosproveedoresForm!: FormGroup;
  public selectedEstado : string = "";
  public desactivaActualizar : boolean = true;
  public EstadoUsuarioForm!: FormGroup;
  public UsuarioProveedor : string = "";
  public NumeroDocumento : string = "";
  public NombreProveedor : string = "";
  public Clave : string = "";
  public Email : string = "";
  public FechaInactivacion :string = "";
  public FechaCreacion : string = "";
  public Estado : string = "";
  public usuarios : any[] = [];
  public estadosUsuarioProveedor : any[] = [
    { value: '3', descripcion: 'Activo' },
    { value: '4', descripcion: 'Inactivo' }
  ];

  constructor(private UsuariosProveedoresServices: UsuariosProveedoresService,
    private notificacion: NgxToastService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.selectedEstado = '-';
    this.validateForm();
    this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
    $("#usuariodisabled").prop('disabled', false);
    $("#NombreDisabled").prop('disabled', false);
    $("#NombreProveedor").prop('disabled', true);
    $("#imgContrasena").click( (event : any )=> {

      var control = $(event.currentTarget);
      var estatus = control.data('activo');
      var icon = control.find('span');
      if (estatus == false) {
        control.data('activo', true);
        $(icon).removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
        $("#txtPassword").attr('type', 'text');
      }
      else {
        control.data('activo', false);
        $(icon).removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
        $("#txtPassword").attr('type', 'password');
      }
    });
    this.UsuariosProveedoresServices.ConsultarProveedores().subscribe(result => {
        this.usuarios = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  BuscarUsuariosProveedores() {
    const NumeroDocumento = this.usuariosproveedoresForm.get('NumeroDocumento')?.value;
    if (NumeroDocumento !== null || NumeroDocumento !== undefined) {
      this.UsuariosProveedoresServices.getBuscarUsuariosProveedores(NumeroDocumento).subscribe( result => {
          if (result !== null) {
            this.selectedEstado = result.Estado;
            this.desactivaActualizar = false;
            $("#usuariodisabled").prop('disabled', true);
            $("#NombreDisabled").prop('disabled', true);
            this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
            this.usuariosproveedoresForm.get('NumeroDocumento')?.setValue(result.NumeroDocumento);
            this.usuariosproveedoresForm.get('Email')?.setValue(result.Email);
            this.Email = result.Email;
            this.Clave = result.Clave;
            this.Estado = result.Estado;
            this.usuariosproveedoresForm.get('UsuarioProveedor')?.setValue(result.UsuarioProveedor);
            this.usuariosproveedoresForm.get('Clave')?.setValue(result.Clave);
            this.usuariosproveedoresForm.get('Estado')?.setValue(result.Estado);
            this.usuariosproveedoresForm.get('NombreProveedor')?.setValue(result.NombreProveedor);
          } else {
            this.usuariosproveedoresForm.reset();
            this.usuariosproveedoresForm.get('Estado')?.setValue('3');
            this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
            this.notificacion.onWarning('Advertencia', 'No se encontró ningún usuario');
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notificacion.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
  }
  valor(value : any) {
    console.log("el valor de change es ");
    console.log(value);
  }
  ActualizarRegistro() {
    var infoActualizar = this.usuariosproveedoresForm.value;
    var Documento = this.usuariosproveedoresForm.get('NumeroDocumento')?.value;
    var emailCambio = this.usuariosproveedoresForm.get('Email')?.value;
    var claveCambio = this.usuariosproveedoresForm.get('Clave')?.value;
    var estadoCambio = this.usuariosproveedoresForm.get('Estado')?.value;
    $("#selectedE").change(function () {
      var estadoCambio_ = $("select option:selected");
    });
    var estadocambio3 = $("#selectedE").val();

    if (emailCambio == this.Email && claveCambio == this.Clave && estadocambio3 == this.Estado) {
      this.notificacion.onWarning('Advertencia', 'El usuario no tiene cambios para actualizar.');
    } else {
      this.GuardarLog(this.usuariosproveedoresForm.value, 97, 0, 0, 71);// ACTUALIZAR
    this.UsuariosProveedoresServices.ActualizaRegistrosProveedores(infoActualizar).subscribe(
      result => {
        if (result == "1") {
          this.usuariosproveedoresForm.reset();
          this.usuariosproveedoresForm.get('Estado')?.setValue('3');
          this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
          this.desactivaActualizar = true;
          this.notificacion.onSuccess('Exitoso', 'El usuario se actualizó correctamente.');
          this.UsuariosProveedoresServices.ConsultarProveedores().subscribe(result => {
              this.usuarios = result;
            },
            error => {
              const errorMessage = <any>error;
              this.notificacion.onDanger('Error', errorMessage);
              console.log(errorMessage);
            })
        } else if (result == "2") {
          this.desactivaActualizar = false;
          this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
          this.notificacion.onWarning('Advertencia', 'El usuario no se actualizó correctamente.');
        }
      },
      error => {
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }) 
    }
  }
  ValidaDocumento() {
    var Documento = this.usuariosproveedoresForm.get('NumeroDocumento')?.value;
    if (Documento != null && Documento != undefined && Documento != "") {
      this.UsuariosProveedoresServices.ValidaDocumento(Documento).subscribe(
        result => {
          if (result != null) {
            if (result.tipoConsulta == 1) {
              this.selectedEstado = result.Estado;
              this.desactivaActualizar = false;
              $("#usuariodisabled").prop('disabled', true);
              $("#NombreDisabled").prop('disabled', true);
              this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
              this.usuariosproveedoresForm.get('NumeroDocumento')?.setValue(result.NumeroDocumento);
              this.usuariosproveedoresForm.get('Email')?.setValue(result.Email);
              this.Email = result.Email;
              this.Clave = result.Clave;
              this.Estado = result.Estado;
              this.usuariosproveedoresForm.get('UsuarioProveedor')?.setValue(result.UsuarioProveedor);
              this.usuariosproveedoresForm.get('Clave')?.setValue(result.Clave);
              this.usuariosproveedoresForm.get('Estado')?.setValue(result.Estado);
              this.usuariosproveedoresForm.get('NombreProveedor')?.setValue(result.NombreProveedor);
            } else {
              this.usuariosproveedoresForm.reset();
              this.desactivaActualizar = true;
              this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
              this.usuariosproveedoresForm.get('Estado')?.setValue('3');
              $("#NombreProveedor").prop('disabled', true);
              $("#usuariodisabled").prop('disabled', false);
              this.usuariosproveedoresForm.get('NumeroDocumento')?.setValue(result.NumeroDocumento);
              this.usuariosproveedoresForm.get('NombreProveedor')?.setValue(result.NombreProveedor);
            }
          } else {
            this.usuariosproveedoresForm.reset();
            this.desactivaActualizar = true;
            $("#usuariodisabled").prop('disabled', false);
            this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
            this.usuariosproveedoresForm.get('Estado')?.setValue('3');
            this.usuariosproveedoresForm.get('NombreProveedor')?.setValue('');
            this.notificacion.onWarning('Advertencia', 'No se encontró información con el documento');
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notificacion.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
  }
  GuardarRegistro() {
    if (this.usuariosproveedoresForm.valid) {
      var infoFormulario = this.usuariosproveedoresForm.value;
      this.UsuariosProveedoresServices.GurdaRegistrosProveedores(infoFormulario).subscribe(
        result => {
          if (result.error == null) {
            var response = result;
            if (response == "1") {
              this.notificacion.onWarning('Advertencia', 'El nombre de usuario ya existe');
            } else if (response == "2") {
              if (this.usuariosproveedoresForm.get('Estado')?.value == 3) {
                infoFormulario.NombreEstado = "Activo";
                this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
              } else {
                infoFormulario.NombreEstado = "Inactivo";
                infoFormulario.FechaCreacion = "No aplica";
              }
              this.GuardarLog(this.usuariosproveedoresForm.value, 96, 0, 0, 71);// GUARDAR
              this.usuariosproveedoresForm.reset();
              this.usuariosproveedoresForm.get('Estado')?.setValue('3');
              this.usuarios.push(infoFormulario);
              this.notificacion.onSuccess('Exitoso', 'El usuario se guardó correctamente.');
            } else if (response == "3") {
              this.notificacion.onWarning('Advertencia', 'Ha ocurrido un error.');
            } else if (response == "4") {
              this.notificacion.onWarning('Advertencia', 'El documento no existe en la base de datos, para poder registrar como usuario de proveedor');
            } else if (response == "5") {
              this.notificacion.onWarning('Advertencia', 'El documento de usuario ya existe');
            }
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notificacion.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
  }
  validateForm() {
    const NumeroDocumento = new FormControl('', [Validators.required]);
    const Email = new FormControl('', [Validators.required]);
    const UsuarioProveedor = new FormControl('', [Validators.required]);
    const Clave = new FormControl('', [Validators.required]);
    const Estado = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const FechaCreacion = new FormControl('', [Validators.required]);
    const NombreProveedor = new FormControl('', [Validators.required]);

    this.usuariosproveedoresForm = new FormGroup({
      NumeroDocumento: NumeroDocumento,
      Email: Email,
      UsuarioProveedor: UsuarioProveedor,
      Clave: Clave,
      Estado: Estado,
      FechaCreacion: FechaCreacion,
      NombreProveedor: NombreProveedor
    });
    this.usuariosproveedoresForm.controls["NombreProveedor"].disable();
  }
  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }
  NuevoRegistro() {
    this.usuariosproveedoresForm.reset();
    $("#NombreUsuario").prop('disabled', true);
    $("#usuariodisabled").prop('disabled', false);
    $("#NombreDisabled").prop('disabled', false);
    this.desactivaActualizar = true;
    this.usuariosproveedoresForm.get('FechaCreacion')?.setValue('N/A');
    this.usuariosproveedoresForm.get('Estado')?.setValue('3');

  }
  GuardarLog(form : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.generalesService.Guardarlog(form, operacion, cuenta, tercero, modulo).subscribe(result => {
        console.log(result);
      }
    );
  }
}

