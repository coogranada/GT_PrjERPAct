import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HtmlToService } from '../../../Services/Utilidades/html-to.service';
import { PrintService } from '../../../Services/General/print.service';

declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-formato-asesoria',
  templateUrl: './formato-asesoria.component.html',
  styleUrls: ['./formato-asesoria.component.css'],
  standalone : false
})
export class FormatoAsesoriaComponent implements OnInit {

  @ViewChild('abrirFormatAsesoria', { static: true }) private abrirFormatAsesoria!: ElementRef;
  public Datos: any;
  public Fecha : Date = new Date();

  public Undefined = undefined;


  constructor(private printService : PrintService) { }

  ngOnInit() {
    }

  AbrirFormatoAsesoria(items: any) {
    this.Datos = items;
    this.Fecha = new Date();
    this.abrirFormatAsesoria.nativeElement.click();
  }

  limpiarModal() {
    this.Datos = undefined;
  }

  print() {
    this.printService.printArea('FormatAsesoria','');
  }
}
