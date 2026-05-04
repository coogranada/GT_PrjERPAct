import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../app/Services/Login/login.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-aplicaciones-colaborativas',
  templateUrl: './aplicaciones-colaborativas.component.html',
  styleUrls: ['./aplicaciones-colaborativas.component.css'],
  providers: [LoginService],
  standalone : false
})

export class AplicacionesColaborativasComponent implements OnInit {
  public DatosUsuario : any;
  constructor(private loginService: LoginService, private router: Router) {}
  ngOnInit() {
    this.IrArriba();
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      (result : any) => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}


