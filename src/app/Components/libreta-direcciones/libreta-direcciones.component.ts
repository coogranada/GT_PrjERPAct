import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CardUserModel } from '../../../app/Models/Maestros/banner.model';
import { ImagenesBannerServices } from '../../../app/Services/Maestros/imagenes-banner.service';
import { OficinasService } from '../../../app/Services/Maestros/oficinas.service';
import { UsuariosService } from '../../../app/Services/Maestros/usuarios.service';
import { ConfiguracionNotificacion } from '../../../environments/config.noticaciones';
import { NgxToastService } from 'ngx-toast-notifier';

declare var $: any;
@Component({
  selector: 'app-libreta-direcciones',
  templateUrl: './libreta-direcciones.component.html',
  styleUrls: ['./libreta-direcciones.component.css'],
  providers: [OficinasService, NgxToastService, UsuariosService, ImagenesBannerServices],
  standalone : false
})
export class LibretaDireccionesComponent implements OnInit {
   @ViewChild('AbrirEps', { static: true }) private AbrirEps!: ElementRef;
  public habilitarDocumento = false;
  public habilitarNombre = false;
  public habilitarOficina = false;
  public habilitarUsuario = false;
  public habilitarArea = false;
  public habilitaBotonBuscar = false;
  public dataOficina: any;
  public libretaDireccionesFrom: any;
  public tipoConsulta: any;
  public resultArea : any[] = [];
  public resultCargo : any;
  public dataUserArea : any[] = [];
  public MostrarCard = false;
  public dataCardUser : CardUserModel = new CardUserModel();

  constructor(private oficinasService: OficinasService, private notif: NgxToastService, private usuariosServices: UsuariosService,
    private ImagenesBannerServices: ImagenesBannerServices) { }
  ngOnInit() {
    this.validarLibretaDirecciones();
    this.GetAreas();
    this.GetOficinas();
    this.GetCargos();
  }
  GetOficinas() {
    this.oficinasService.getOficinas().subscribe(result => {
        this.dataOficina = result;
      },
      error => {
        this.notif.onDanger('Error', error);
        console.error(error);
      });
  }
  validarTipoConsulta(value : any) {
    this.MostrarCard = false;
    this.dataCardUser = new CardUserModel();
    this.tipoConsulta = value.TipoConsulta;
    if (value.TipoConsulta == 1) {
      this.habilitarArea = true;
      this.habilitaBotonBuscar = true;
      this.habilitarNombre = false;
      this.habilitarDocumento = false;
      this.habilitarOficina = false;
      this.habilitarUsuario = false;
      this.resetInputs();
      this.AgregarValidacionesArea();
      this.RemoverValidacionesDocumento();
      this.RemoverValidacionesNombre();
      this.RemoverValidacionesOficina();
      this.RemoverValidacionesUsuario();
      $('#area').focus();
    } else if (value.TipoConsulta == 2) {
      this.habilitarDocumento = true;
      this.habilitaBotonBuscar = true;
      this.habilitarArea = false;
      this.habilitarNombre = false;
      this.habilitarOficina = false;
      this.habilitarUsuario = false;
      this.resetInputs();
      this.RemoverValidacionesArea();
      this.AgregarValidacionesDocumento();
      this.RemoverValidacionesNombre();
      this.RemoverValidacionesOficina();
      this.RemoverValidacionesUsuario();
      $('#documento').focus();
    } else if (value.TipoConsulta == 3) {
      this.habilitarOficina = false;
      this.habilitarArea = false;
      this.habilitarDocumento = false;
      this.habilitarNombre = true;
      this.habilitaBotonBuscar = true;
      this.habilitarUsuario = false;
      this.resetInputs();
      this.RemoverValidacionesArea();
      this.RemoverValidacionesDocumento();
      this.AgregarValidacionesNombre();
      this.RemoverValidacionesOficina();
      this.RemoverValidacionesUsuario();
      $('#nombre').focus();
    } else if (value.TipoConsulta == 4) {
      this.habilitarUsuario = false;
      this.habilitarArea = false;
      this.habilitarOficina = true;
      this.habilitaBotonBuscar = true;
      this.habilitarDocumento = false;
      this.habilitarNombre = false;
      this.resetInputs();
      this.RemoverValidacionesArea();
      this.RemoverValidacionesDocumento();
      this.RemoverValidacionesNombre();
      this.AgregarValidacionesOficina();
      this.RemoverValidacionesUsuario();
      $('#oficina').focus();
    } else if (value.TipoConsulta == 5) {
      this.habilitarUsuario = true;
      this.habilitaBotonBuscar = true;
      this.habilitarArea = false;
      this.habilitarOficina = false;
      this.habilitarDocumento = false;
      this.habilitarNombre = false;
      this.resetInputs();
      this.RemoverValidacionesArea();
      this.RemoverValidacionesDocumento();
      this.RemoverValidacionesNombre();
      this.RemoverValidacionesOficina();
      this.AgregarValidacionesUsuario();
      $('#usuario').focus();
    }
  }
  resetInputs() {
    this.libretaDireccionesFrom.get('Documento').reset();
    this.libretaDireccionesFrom.get('Nombre').reset();
    this.libretaDireccionesFrom.get('Oficina').reset();
    this.libretaDireccionesFrom.get('Usuario').reset();
    this.libretaDireccionesFrom.get('Area').reset();
  }
  ConsultarUsuario() {
    if (!this.libretaDireccionesFrom.valid) {
      this.ValidarErrorForm(this.libretaDireccionesFrom);
    } else {
      const tipo = +this.libretaDireccionesFrom.get('TipoConsulta').value;
      if (tipo === 1) {
        this.ConsultarUserrAll(tipo, this.libretaDireccionesFrom.get('Area').value);
      } else if (tipo === 2) {
        this.ConsultarUserDocumento(this.libretaDireccionesFrom.get('Documento').value);
      } else if (tipo === 3) {
        this.ConsultarUserrAll(tipo, this.libretaDireccionesFrom.get('Nombre').value);
      } else if (tipo === 4) {
        this.ConsultarUserrAll(tipo, this.libretaDireccionesFrom.get('Oficina').value);
      } else if (tipo === 5) {
        this.ConsultarUserUsuario(this.libretaDireccionesFrom.get('Usuario').value);
      }
    }
  }
  ConsultarUserId(id : number) {
    this.ImagenesBannerServices.BuscarUsuarioXId(id).subscribe(
      result => {
        console.log(result);
        this.MapearCard(result, '');
      });
  }
  ConsultarUserDocumento(docu : string) {
    this.ImagenesBannerServices.BuscarUsuarioXDocumento(docu).subscribe(result => {
        if (result.IdEstado === 3) {
          console.log(result);
          this.MapearCard(result, '');
        } else {
          this.notif.onWarning('Advertencia', 'Usuario inactivo.');
          this.libretaDireccionesFrom.get('Documento').reset();
        }
      });
  }
  ConsultarUserUsuario(usuario : string) {
    this.ImagenesBannerServices.BuscarUsuarioXUsuario(usuario).subscribe(result => {
        if (result.IdEstado === 3) {
          console.log(result);
          this.MapearCard(result, '');
        } else {
          this.notif.onWarning('Advertencia', 'Usuario inactivo.');
          this.libretaDireccionesFrom.get('Usuario').reset();
        }
      });
  }
  OcultarCampos() {
    this.habilitarArea = false;
    this.habilitarNombre = false;
    this.habilitarDocumento = false;
    this.habilitarOficina = false;
    this.habilitarUsuario = false;
    this.habilitaBotonBuscar = false;
  }
  ConsultarUserrAll(tipo : number, dato : string) {
    this.dataUserArea = [];
    this.ImagenesBannerServices.BuscarUsuarioAll(tipo, dato).subscribe(result => {
        result.forEach((element : any) => {
          let nameNew = '';
          const arrayName = element.Nombre.split(',');
          arrayName.forEach((elementName : any ) => {
            nameNew = nameNew + ' ' + elementName;
          });
          element.Nombre = nameNew;
          this.resultArea.forEach((elementarea : any ) => {
            if (elementarea.IdArea == element.IdArea) {
              element.IdArea = elementarea.Nombre;
            }
          });
          this.resultCargo.forEach((elementcargo : any ) => {
            if (elementcargo.IdCargo == element.IdCargo) {
              element.IdCargo = elementcargo.Nombre;
            }
          });
          this.dataUserArea.push(element);
        });
        this.AbrirEps.nativeElement.click();
      });
  }
  GetAreas() {
    this.usuariosServices.getAreasActivas().subscribe((result : any ) => {
        this.resultArea = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  GetCargos() {
    this.usuariosServices.getCargosActivos().subscribe( result => {
        this.resultCargo = result;
      },
      error => {    
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  MapearCard(data : any, img : string) {
    if (data !== null) {
      this.dataCardUser = new CardUserModel();
      this.dataCardUser.ImgUser = img;

      this.ImagenesBannerServices.ConsultarImgenUser(data.IdUsuario).subscribe(
        result => {
          if (result !== null) {
            this.dataCardUser.ImgUser = 'data:image/png;base64,' + result.Base64String + '';
          } else {
            this.dataCardUser.ImgUser = null;
          }
        });

      let nameNew = '';
      const arrayName = data.Nombre.split(',');
      arrayName.forEach((elementName : any) => {
        nameNew = nameNew + ' ' + elementName;
      });
      this.dataCardUser.NombreUsuario = this.transform(nameNew);

      this.dataCardUser.Usuario = data.Usuario;
      this.dataCardUser.Identificacion = data.Documento;
      this.dataCardUser.Cumpleanos = data.FechaNacimiento;
      this.dataCardUser.Extencion = data.Extension;
      this.dataCardUser.Celular = data.Celular;
      this.dataCardUser.Correo = data.Email;

      this.resultArea.forEach((elementArea : any ) => {
        if (elementArea.IdArea === data.IdArea) {
          this.dataCardUser.Area = elementArea.Nombre;
        }
      });
      this.resultCargo.forEach((elementCargo : any ) => {
        if (elementCargo.IdCargo === data.IdCargo) {
          this.dataCardUser.Cargo = elementCargo.Nombre;
        }
      });
      this.dataOficina.forEach((elementOficina : any) => {
        if (elementOficina.IdLista === data.IdOficina) {
          this.dataCardUser.Oficina = elementOficina.Descripcion;
        }
      });
      this.MostrarCard = true;
      this.resetInputs();
      this.OcultarCampos();
      this.libretaDireccionesFrom.get('TipoConsulta').reset();
    } else {
      this.resetInputs();
    }
  }
  transform(value: string): string {
    let first = value.substr(0, 1).toUpperCase();
    return first + value.substr(1);
  }
  RemoverValidacionesDocumento() {
    this.libretaDireccionesFrom.controls['Documento'].setErrors(null);
    this.libretaDireccionesFrom.controls['Documento'].clearValidators();
    this.libretaDireccionesFrom.controls['Documento'].setValidators(null);
  }
  RemoverValidacionesNombre() {
    this.libretaDireccionesFrom.controls['Nombre'].setErrors(null);
    this.libretaDireccionesFrom.controls['Nombre'].clearValidators();
    this.libretaDireccionesFrom.controls['Nombre'].setValidators(null);
  }
  RemoverValidacionesUsuario() {
    this.libretaDireccionesFrom.controls['Usuario'].setErrors(null);
    this.libretaDireccionesFrom.controls['Usuario'].clearValidators();
    this.libretaDireccionesFrom.controls['Usuario'].setValidators(null);
  }
  RemoverValidacionesOficina() {
    this.libretaDireccionesFrom.controls['Oficina'].setErrors(null);
    this.libretaDireccionesFrom.controls['Oficina'].clearValidators();
    this.libretaDireccionesFrom.controls['Oficina'].setValidators(null);
  }
  RemoverValidacionesArea() {
    this.libretaDireccionesFrom.controls['Area'].setErrors(null);
    this.libretaDireccionesFrom.controls['Area'].clearValidators();
    this.libretaDireccionesFrom.controls['Area'].setValidators(null);
  }
  AgregarValidacionesNombre() {
    this.libretaDireccionesFrom.controls['Nombre'].setValidators([Validators.required, Validators.pattern('[A-Za-z0-9& ]+')]);
    this.libretaDireccionesFrom.controls['Nombre'].setErrors({ 'incorrect': true });
    this.libretaDireccionesFrom.controls['Nombre'].updateValueAndValidity();
  }
  AgregarValidacionesArea() {
    this.libretaDireccionesFrom.controls['Area'].setValidators([Validators.required]);
    this.libretaDireccionesFrom.controls['Area'].setErrors({ 'incorrect': true });
    this.libretaDireccionesFrom.controls['Area'].updateValueAndValidity();
  }
  AgregarValidacionesDocumento() {
    this.libretaDireccionesFrom.controls['Documento'].setValidators([Validators.required, Validators.pattern('^[0-9]*')]);
    this.libretaDireccionesFrom.controls['Documento'].setErrors({ 'incorrect': true });
    this.libretaDireccionesFrom.controls['Documento'].updateValueAndValidity();
  }
  AgregarValidacionesOficina() {
    this.libretaDireccionesFrom.controls['Oficina'].setValidators([Validators.required]);
    this.libretaDireccionesFrom.controls['Oficina'].setErrors({ 'incorrect': true });
    this.libretaDireccionesFrom.controls['Oficina'].updateValueAndValidity();
  }
  AgregarValidacionesUsuario() {
    this.libretaDireccionesFrom.controls['Usuario'].setValidators([Validators.required, Validators.pattern('[A-Za-z0-9& ]+')]);
    this.libretaDireccionesFrom.controls['Usuario'].setErrors({ 'incorrect': true });
    this.libretaDireccionesFrom.controls['Usuario'].updateValueAndValidity();
  }
  ValidarErrorForm(formulario: any) {
    Object.keys(formulario.controls).forEach(field => { // {1}
      const control = formulario.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }
  LimpiarCampo() {
    this.libretaDireccionesFrom.get('Documento').reset();
    this.libretaDireccionesFrom.get('Nombre').reset();
    this.libretaDireccionesFrom.get('Oficina').reset();
    this.libretaDireccionesFrom.get('Usuario').reset();
    this.libretaDireccionesFrom.get('Area').reset();
  }
  validarLibretaDirecciones() { 
    const TipoConsulta = new FormControl('', []);
    const Documento = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*')]);
    const Nombre = new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9& ]+')]);
    const Oficina = new FormControl('', [Validators.required]);
    const Usuario = new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9& ]+')]);
    const Area = new FormControl('', [Validators.required]);
    this.libretaDireccionesFrom = new FormGroup({
      TipoConsulta: TipoConsulta,
      Documento: Documento,
      Nombre: Nombre,
      Oficina: Oficina,
      Usuario: Usuario,
      Area: Area
    });
  }
}
