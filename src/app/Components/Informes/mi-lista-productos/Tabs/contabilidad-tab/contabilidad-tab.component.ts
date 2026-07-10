import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service'


@Component({
  selector: 'app-contabilidad-tab',
  templateUrl: './contabilidad-tab.component.html',
  styleUrls: ['./contabilidad-tab.component.css'],
  standalone : false
})
export class ContabilidadTabComponent implements OnInit { 
 @ViewChild('modalImagen', { static: false }) modalImagen!: ElementRef;
  

  constructor(private MiListaProductosService: MiListaProductosService) { }

  ngOnInit() {

  }
  private lngTercero: number = 0;
  public ListTagContabilidad: any[] = [];
  public ColorAnterior: any;
  public ListSubSalud: any[] = [];

  getContabilidad(lngtercero : number) {
    this.ListTagContabilidad.length = 0;
    this.MiListaProductosService.GetConsultaContabilidadMisProdu(this.lngTercero).subscribe(
      result => {
        var item = 0
        if (result != null) {
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              this.ListTagContabilidad[item] = result[i];
              item++;
            }

          }
        }
      }, error => {
        console.log(error);
      });


  }

totalSaldo: number = 0;

getContabilidadSubSalud(lngtercero: number): void {
  this.ListSubSalud = [];
  this.totalSaldo = 0;

  this.MiListaProductosService.getContabilidadSubSalud(lngtercero)
    .subscribe(
      (result: any[]) => {

        this.ListSubSalud = (result || []).map((item: any) => ({
          ...item,
          Saldo: Number((item.Saldo || '0').toString().replace(/,/g, '')),
          ValorMaximo: Number((item.ValorMaximo || '0').toString().replace(/,/g, ''))
        }));

        this.totalSaldo = this.ListSubSalud.reduce(
          (acumulado: number, item: any) => acumulado + item.Saldo,
          0
        );

      },
      (error) => {
        console.error(error);
      }
    );
}


SetlngTercero(lngTercero: number) {
    this.lngTercero = lngTercero;
  }
CambiarColor(fil: number, event: any) {

    const fila = $(event.currentTarget);  
    const tabla = fila.closest("table");

  
    tabla.find("[class*='filconta'], [class*='filcontal'], [class*='strcuentaConta']")
         .css("background", "#FFFFFF");


    tabla.find(".filconta" + fil).css("background", "#e5e5e5");
    tabla.find(".filcontal" + fil).css("background", "#e5e5e5");
    tabla.find(".strcuentaConta" + fil).css("background", "#e5e5e5");

    this.ColorAnterior = fil;
}

public imagenModal: string = '';

VerAyuda(): void {
  this.imagenModal = 'assets/images/ReglamentoSalud.png';
  this.modalImagen.nativeElement.click();
}






}
