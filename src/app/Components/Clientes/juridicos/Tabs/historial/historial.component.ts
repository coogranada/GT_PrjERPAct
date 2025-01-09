import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import { DatePipe } from '@angular/common';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
  providers: [JuridicosService],
  standalone : false
})
export class HistorialComponent implements OnInit {
  //#region  carga variables comunicacion
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente
  @Input() nitConsultado: any;
  //#endregion
  //#region carga variables
  public siguiente = false;
  public positionTab = 3;
  public bloquearHistoria = true;
  public dataTratamientoLog : any[] = [];
  public dataRetirosLog : any[] = [];
  public dataReingresosLog : any[] = [];
  public mostrarReimprimir = false;
  public condicion = false;
  @Output() emitEventReimprimir: EventEmitter<any> = new EventEmitter<any>();
  public ColorAnterior1: any;
  public ColorAnterior2: any;
  public ColorAnterior3: any;
  //#endregion
  public historialFrom!: FormGroup;

  constructor(private JuridicoServices: JuridicosService, private notif: NgxToastService) { }

  ngOnInit() {
    this.validateHistorial();
  }

   //#region  Metodos de carga
  GetTratamientoLog(juridico : string) {
    this.JuridicoServices.GetTratamientoDatosJuridicoLog(juridico).subscribe(
      resultLog => {

        resultLog.forEach((elementLogTrata : any) => {
          if (elementLogTrata.Acepto === true) {
            elementLogTrata.Acepto = 'Acepto';
          } else {
            elementLogTrata.Acepto = 'No acepto';
          }
          const fechaAceto = new DatePipe('en-CO').transform(
            elementLogTrata.FechaAceptacion, 'yyyy/MM/dd');

          elementLogTrata.FechaAceptacion = fechaAceto;

          const fechaNoAcepto = new DatePipe('en-CO').transform(
            elementLogTrata.fechaNoAceptacion, 'yyyy/MM/dd');

          elementLogTrata.fechaNoAceptacion = fechaNoAcepto;

          this.dataTratamientoLog.push(elementLogTrata);
        });
      },
      error => {
        this.notif.onDanger('Error', error);
        console.error(error);
      });
  }

  AbrirReimprimir(ReingresoId : string) {
    this.emitEventReimprimir.emit({ cargar: '1', consultar: ReingresoId });
  }
  
  GetRetirosLog(tercero : string) {
    this.dataRetirosLog = [];
    this.JuridicoServices.GetRetirosJuridicoLog(tercero).subscribe(
      result => {
        result.forEach((elementReiLog : any) => {
          elementReiLog.FechaRetiro = new DatePipe('en-CO').transform(elementReiLog.FechaRetiro, 'yyyy/MM/dd HH:mm:ss');
          if (elementReiLog.IdAsesor !== 0) {
            this.dataRetirosLog.push(elementReiLog);
          } else {
            this.dataRetirosLog.push(elementReiLog);
          }
        });
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetReingresosLog(tercero : string) {
    this.dataReingresosLog = [];
    this.JuridicoServices.GetReingresosJuridico(tercero).subscribe(
      result => {
        result.forEach((elementReiLog : any) => {
          elementReiLog.FechaReingreso = new DatePipe('en-CO').transform(elementReiLog.FechaReingreso, 'yyyy/MM/dd HH:mm:ss');
          if (elementReiLog.IdAsesor !== 0) {
            this.dataReingresosLog.push(elementReiLog);
          } else {
            this.dataReingresosLog.push(elementReiLog);
          }
        });
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  //#endregion

  //#region Metodos funcionales
  CargarTrasabilidad() {
    this.condicion = true;
    localStorage.setItem('trasabilidad-juridico', window.btoa(JSON.stringify(this.nitConsultado)));
  }
  ResetTrasabilidad() {
    this.condicion = false;
  }
  //#endregion

  //#region Inicializaciones de formularios
  validateHistorial() {
    const FechaCreacion = new FormControl('', [Validators.required]);
    const FechaActualizacion = new FormControl('', []);
    const FechaRetiro = new FormControl('', []);
    const FechaSolicitudRetiro = new FormControl('', []);

    this.historialFrom = new FormGroup({
      FechaCreacion: FechaCreacion,
      FechaActualizacion: FechaActualizacion,
      FechaRetiro: FechaRetiro,
      FechaSolicitudRetiro: FechaSolicitudRetiro
    });


  }

  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".filLogTrata_" + this.ColorAnterior1).css("background", "#FFFFFF");
      $(".filLogTrata_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior1 = fil;
    }
    if (producto === 2) {

      $(".filLogRet_" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".filLogRet_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior2 = fil;
    }
    if (producto === 3) {

      $(".filLogRein_" + this.ColorAnterior3).css("background", "#FFFFFF");
      $(".filLogRein_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior3 = fil;
    }
   
  }
  //#endregion

}
