import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-configuracion-informes',
  templateUrl: './configuracion-informes.component.html',
  styleUrl: './configuracion-informes.component.css',
  standalone: false
})
export class ConfiguracionInformesComponent implements OnInit  {
  CodModulo: number = 83
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';

  tipos: any = [];
  configuraciones: any = [];
  parametros: any = [];
  modulos: any = [];




  ngOnInit() {
    this.IrArriba();
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

}
