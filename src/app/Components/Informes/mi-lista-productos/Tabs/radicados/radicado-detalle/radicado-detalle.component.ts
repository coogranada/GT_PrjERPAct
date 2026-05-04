import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DetalleRadicado, EncabezadoRadicado, NegociacionRadicado } from '../../../../../../Models/Informes/MisProductos/mis-producto.model';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-radicado-detalle',
  templateUrl: './radicado-detalle.component.html',
  styleUrl: './radicado-detalle.component.css',
  standalone: false
})
export class RadicadoDetalleComponent {
  @Input() radicadoData!: DetalleRadicado;
  @ViewChild('ModalCalificacionRadicados', { static: true }) private ModalCalificacionRadicados!: ElementRef;

  TipoCliente: number = 0; 

  cerrarAcordeones() {
    $(".NegociaRadicado").prop('checked', false);
    $(".DeducibleRadicado").prop('checked', false);
    $(".saldosVigentesRadicado").prop('checked', false);
    $(".observacionesRadicado").prop('checked', false);
    $(".CodeudoresRadica").prop('checked', false);
    $(".ReferenciasRadica").prop('checked', false);
    $(".DesisionRadicado").prop('checked', false);
    $(".fechasRadicados").prop('checked', false);
  }


  cerrarAcordeone(value : number) {
    if (value == 1) {
      // $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 2) {
      $(".NegociaRadicado").prop('checked', false);
      // $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 3) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      // $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 4) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      // $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 5) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      // $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 6) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      // $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 7) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      // $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 8) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      // $(".fechasRadicados").prop('checked', false);
    }
  }

}
