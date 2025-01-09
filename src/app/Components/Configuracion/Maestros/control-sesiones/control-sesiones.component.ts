import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../Services/Login/login.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-control-sesiones',
  templateUrl: './control-sesiones.component.html',
  styleUrls: ['./control-sesiones.component.css'],
  standalone : false
})
export class ControlSesionesComponent implements OnInit {
  public dataSession: any[] = [];
  public transForm: any[] = [];

  public UserOnSession: any[] = [];
  public UserOffSession: any[] = [];
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.GetsesionAll();
    this.IrArriba();
  }
  CerrarSesion(data : any) {
    this.loginService.CerrarSesionUser(data).subscribe(
      result => {
        this.GetsesionAll();
      });
  }
  CerrarSesionAll() {
    Swal.fire({
      title: '! Advertencia ¡',
      text: '¿Desea cerrar sesion a todos los usuarios?',
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
        this.loginService.CerrarSesionUsersAll().subscribe((result : any) => {
            this.GetsesionAll();
          });
      } else {
        this.GetsesionAll();
      }
    });
  }
  GetsesionAll() {
    this.dataSession = [];
    this.transForm = [];
    this.UserOnSession = [];
    this.UserOffSession = [];
    this.loginService.GetSesionAllUsers().subscribe((result : any[]) => {
        result.forEach((element : any)=> {
          element.FechaInicioSesion = new DatePipe('en-CO').transform(
          element.FechaInicioSesion, 'yyyy/MM/dd hh:mm:ss');
          this.transForm.push(element);
          if (element.Estado) {
            this.UserOnSession.push(element);
          } else {
            this.UserOffSession.push(element);
          }
        });
        this.dataSession = this.transForm;
      }
    );
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}