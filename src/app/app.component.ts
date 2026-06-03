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
    if (!navigator.onLine) {
      this.handleOffline();
    }

    this.initializeCatalogs();
    this.setupTokenRefresh();
    this.handleNavigationChanges();
    this.blockDevTools();
  }

  // STORAGE
  private loadUserFromStorage(): void {
    const data = localStorage.getItem('Data');

    if (!data) {
      this.logout();
      return;
    }

    try {
      this.resulStore = JSON.parse(atob(data));
    } catch {
      this.logout();
    }
  }

  private saveToStorage(key: string, data: any): void {
    localStorage.setItem(key, btoa(JSON.stringify(data)));
  }

  private logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/Login');
  }


  private fetchAndStore(serviceCall: any, key: string, transform?: (data: any) => any): void {
    serviceCall.subscribe({
      next: (result: any) => {
        const finalData = transform ? transform(result) : result;
        this.saveToStorage(key, finalData);
      },
      
      error: (error: HttpErrorResponse) => {
      this.notif.onDanger('Error', error.message);
      console.error(error);
      }
    });
  }

  private initializeCatalogs(): void {
    this.GetCargos();
    this.GetEstadosSeguro();
    this.GetLetra();
    this.GetSeguros();
    this.GetTipoEmpleo();
  }

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
    const token = this.Security.GetToken();

    if (!token || !this.resulStore?.intlngTercero) return;

    this.loginService
      .GetToken(this.resulStore.intlngTercero)
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
    location.reload();
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


