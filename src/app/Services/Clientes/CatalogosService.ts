import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ClientesGetListService } from './clientesGetList.service';
import { OficinasService } from '../Maestros/oficinas.service';
import { AlertService } from '../Alert/alert.service';
import { StorageSecurity } from '../../utils/storage-security.util';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(
    private clientesGetListService: ClientesGetListService,
    private oficinasService: OficinasService,
    private notif: AlertService
  ) { }

  private saveToStorage(key: string, data: any): void {
    StorageSecurity.saveItem(key, data);
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
        this.notif.onDanger('Error', error.message);
        console.error(error);
      }
    });
  }

  // =========================
  // LOGIN COMPONENT
  // =========================

  GetProfesion(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetProfesion(),
      'profesion'
    );
  }

  GetParentescos(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetParentescos(),
      'parentesco'
    );
  }

  GetParentescosChange(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetParentescos(),
      'parentescoChange'
    );
  }

  GetParentescosPeps(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetParentescosPeps(),
      'parentescoPeps'
    );
  }

  GetTipoContacto(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetTipoContacto(),
      'contacto'
    );
  }

  GetOficinas(): void {
    this.fetchAndStore(
      this.oficinasService.getOficinas(),
      'oficinas'
    );
  }

  GetMarcar(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetMarcas(),
      'marca'
    );
  }

  GetConceptosaAll(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetConceptosAll(),
      'conceptos'
    );
  }

  GetPeriodosPago(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetPeriodosPago(),
      'periodo'
    );
  }

  // =========================
  // APP COMPONENT
  // =========================

  GetLetra(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetLetras(),
      'letras'
    );
  }

  GetCargos(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetCargos(),
      'cargos'
    );
  }

  GetEstadosSeguro(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetEstadosSeguro(),
      'estadoSeguro'
    );
  }

  GetTipoEmpleo(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetTipoEmpleo(),
      'empleo'
    );
  }

  GetSeguros(): void {
    this.fetchAndStore(
      this.clientesGetListService.GetSeguros(),
      'seguros',
      (result: any[]) =>
        result.filter(x => x.Clase !== 20)
    );
  }

  // =========================
  // CARGA COMPLETA
  // =========================

  cargarCatalogos(): void {

    this.GetProfesion();
    this.GetParentescos();
    this.GetParentescosChange();
    this.GetParentescosPeps();
    this.GetOficinas();
    this.GetMarcar();
    this.GetTipoContacto();
    this.GetConceptosaAll();
    this.GetPeriodosPago();

    this.GetCargos();
    this.GetEstadosSeguro();
    this.GetLetra();
    this.GetSeguros();
    this.GetTipoEmpleo();
  }

  // =========================
  // CARGAR SOLO SI NO EXISTEN
  // =========================



  cargarCatalogosSiNoExisten(): void {

    if (!StorageSecurity.getItem('profesion')) {
      this.GetProfesion();
    }

    if (!StorageSecurity.getItem('parentesco')) {
      this.GetParentescos();
    }

    if (!StorageSecurity.getItem('parentescoChange')) {
      this.GetParentescosChange();
    }

    if (!StorageSecurity.getItem('parentescoPeps')) {
      this.GetParentescosPeps();
    }

    if (!StorageSecurity.getItem('oficinas')) {
      this.GetOficinas();
    }

    if (!StorageSecurity.getItem('marca')) {
      this.GetMarcar();
    }

    if (!StorageSecurity.getItem('contacto')) {
      this.GetTipoContacto();
    }

    if (!StorageSecurity.getItem('conceptos')) {
      this.GetConceptosaAll();
    }

    if (!StorageSecurity.getItem('periodo')) {
      this.GetPeriodosPago();
    }

    if (!StorageSecurity.getItem('cargos')) {
      this.GetCargos();
    }

    if (!StorageSecurity.getItem('estadoSeguro')) {
      this.GetEstadosSeguro();
    }

    if (!StorageSecurity.getItem('letras')) {
      this.GetLetra();
    }

    if (!StorageSecurity.getItem('seguros')) {
      this.GetSeguros();
    }

    if (!StorageSecurity.getItem('empleo')) {
      this.GetTipoEmpleo();
    }
  }
  
}