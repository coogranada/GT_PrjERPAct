import { LoginService } from './Services/Login/login.service';
import {  Component, OnInit, ElementRef, Output, EventEmitter, ViewChild, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { ClientesGetListService } from './Services/Clientes/clientesGetList.service';
import { OperacionesService } from './Services/Maestros/operaciones.service';
import { RecursosGeneralesService } from './Services/Utilidades/recursosGenerales.service';
import { OficinasService } from './Services/Maestros/oficinas.service';
import { SecurityService } from './Services/Auth/security.service';
import { GestionesService  } from './Services/Gestiones/gestiones.service';
import { AlertService } from './Services/Alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any;
  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone : false,
  providers: [LoginService, ClientesGetListService, OperacionesService,
    GestionesService, RecursosGeneralesService, OficinasService,
    ClientesGetListService,SecurityService]
})
export class AppComponent implements OnInit {

  public resulStore: any = null;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private notif: AlertService,
    private location: PlatformLocation,
    private clientesGetListService: ClientesGetListService,
    private Security: SecurityService
  ) {
    this.loadUserFromStorage();
  }

ngOnInit(): void {

  this.loadUserFromStorage();

  if (!navigator.onLine) {
    this.handleOffline();
  }

  this.setupTokenRefresh();
  this.handleNavigationChanges();
  this.blockDevTools();

  window.addEventListener('error', (event) => {
    console.error('Error global:', event);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada:', event.reason);
  });
}

  // STORAGE
  private loadUserFromStorage(): void {

  const data = localStorage.getItem('Data');

  if (!data) {
    console.warn('No existe información del usuario en LocalStorage');
    this.logout();
    return;
  }

  try {

    const decodedData = atob(data);
    this.resulStore = JSON.parse(decodedData);

    console.log('Usuario cargado correctamente', this.resulStore);

  } catch (error) {

    console.error('Error leyendo Data del LocalStorage:', error);

    this.logout();
  }
  }

  private saveToStorage(key: string, data: any): void {
    localStorage.setItem(key, btoa(JSON.stringify(data)));
  }

  private logout(): void {

  localStorage.clear();

  if (this.router.url !== '/Login') {
    this.router.navigate(['/Login']);
  }
}


 private fetchAndStore(
  serviceCall: any,
  key: string,
  transform?: (data: any) => any
): void {

  serviceCall.subscribe({

    next: (result: any) => {

      const finalData = transform
        ? transform(result)
        : result;

      this.saveToStorage(key, finalData);
    },

    error: (error: HttpErrorResponse) => {

      // Solo registrar el error en consola
      console.error(`Error cargando ${key}:`, error);

      // No mostrar notificación al usuario
    }
    });
  }


  // private initializeCatalogs(): void {
  //   this.GetCargos();
  //   this.GetEstadosSeguro();
  //   this.GetLetra();
  //   this.GetSeguros();
  //   this.GetTipoEmpleo();
  // }

  GetLetra(): void {
    this.fetchAndStore(this.clientesGetListService.GetLetras(), 'letras');
  }

  GetCargos(): void {
    this.fetchAndStore(this.clientesGetListService.GetCargos(), 'cargos');
  }

  GetEstadosSeguro(): void {
    this.fetchAndStore(this.clientesGetListService.GetEstadosSeguro(), 'estadoSeguro');
  }

  GetTipoEmpleo(): void {
    this.fetchAndStore(this.clientesGetListService.GetTipoEmpleo(), 'empleo');
  }

  GetSeguros(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetSeguros(),
      'seguros',
      (result: any[]) => result.filter(x => x.Clase !== 20)
    );
  }

  // TOKEN
  private setupTokenRefresh(): void {
    setInterval(() => this.refreshToken(), 3600000);
  }

  private refreshToken(): void {    
    const refreshToken = this.Security.GetRefreshToken();
    if (!refreshToken || !this.resulStore?.intlngTercero) return;

    this.loginService
      .RefreshToken(refreshToken)
      .subscribe({
        next: (x: any) => {
          localStorage.setItem('token', x.token);
        },
        error: (err) => console.error('Error refrescando token', err)
      });
  }


  // NAVEGACION
  private handleNavigationChanges(): void {
    this.location.onPopState(() => {
      this.loadUserFromStorage();
    });
  }

  // OFFLINE
  @HostListener('window:offline', [])
  onOffline(): void {
    this.handleOffline();
  }

private handleOffline(): void {

  this.notif.onDanger('Sin conexión','No hay conexión a Internet');
  console.warn('Aplicación sin conexión');
}

  // SEGURIDAD UI
  private blockDevTools(): void {
    $(document).keydown((event: any) => {
      if (event.keyCode === 123) return false;
      if (event.ctrlKey && event.shiftKey && event.keyCode === 73) return false;
      return true;
    });

    $(document).on('contextmenu', { passive: true }, (e: any) => {
      e.preventDefault();
    });
  }
}


