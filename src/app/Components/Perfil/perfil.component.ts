import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import  moment from 'moment';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { Router } from '@angular/router';
import { LoginService } from '../../../app/Services/Login/login.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [LoginService],
  standalone : false
})
export class PerfilComponent implements OnInit {
  public perfilFrom!: FormGroup ;
  public dataUser : any = {};

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent! : NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public DatosUsuario : any;
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.validateForm();
    this.GetAndSetDetallesPerfil();
    this.ObtenerDatosUsuario();
    let data : string | null  = localStorage.getItem('Data')
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
  GetAndSetDetallesPerfil() {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));

    this.perfilFrom.get('nombre')?.setValue(this.dataUser.Nombre);
    this.perfilFrom.get('usuario')?.setValue(this.dataUser.Usuario);
    this.perfilFrom.get('tipoIdentificacion')?.setValue(this.dataUser.TipoDocumento);
    this.perfilFrom.get('identificacion')?.setValue(this.dataUser.Documento);
    const _fechaNacimiento = this.dataUser.FechaNacimiento;
    const _fecha = new Date(_fechaNacimiento);
    const fechaFormato = moment(_fecha).format('DD-MM-YYYY');
    this.perfilFrom.get('fechaNacimiento')?.setValue(fechaFormato);
    this.perfilFrom.get('tipoUsuario')?.setValue(this.dataUser.TipoUsuario);
    this.perfilFrom.get('oficina')?.setValue(this.dataUser.Oficina);
    this.perfilFrom.get('area')?.setValue(this.dataUser.Area);
    this.perfilFrom.get('cargo')?.setValue(this.dataUser.Cargo);
    this.perfilFrom.get('extension')?.setValue(this.dataUser.Extension);
    this.perfilFrom.get('email')?.setValue(this.dataUser.Email);
  }
  ObtenerDatosUsuario() {
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
  }
  validateForm() {
    const nombre = new FormControl('', []);
    const usuario = new FormControl('', []);
    const tipoIdentificacion = new FormControl('', []);
    const identificacion = new FormControl('', []);
    const fechaNacimiento = new FormControl('', []);
    const tipoUsuario = new FormControl('', []);
    const oficina = new FormControl('', []);
    const area = new FormControl('', []);
    const cargo = new FormControl('', []);
    const extension = new FormControl('', []);
    const email = new FormControl('', []);

    this.perfilFrom = new FormGroup({
      nombre: nombre,
      usuario: usuario,
      tipoIdentificacion: tipoIdentificacion,
      identificacion: identificacion,
      fechaNacimiento: fechaNacimiento,
      tipoUsuario: tipoUsuario,
      oficina: oficina,
      area: area,
      cargo: cargo,
      extension: extension,
      email: email
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
