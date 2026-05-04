import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingComponent } from 'ngx-loading';
import { Campo, Filtro } from '../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { InformeLogService } from '../../../../Services/Informes/informe-log.service';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import Swal from "sweetalert2";
import moment from 'moment';

@Component({
  selector: 'app-log-gestion-clientes',
  templateUrl: './log-gestion-clientes.component.html',
  styleUrls: ['./log-gestion-clientes.component.css'],
  providers: [],
  standalone : false
})
export class LogGestionClientesComponent implements OnInit {

  Campos: Campo[] = [];
  Filtros: Filtro[] = [];
  filtrosAgregado: Filtro[] = [];
  filtroSelect: number = 0;
  valida1: boolean = false;
  valida2: boolean = false;
  valueFechaInicial: Date = new Date();
  valueFechaFinal: Date = new Date();
  clearFechaInicial: boolean = true;
  clearFechaFinal: boolean = true;
  btnMore: boolean = false;
  fechaMax: any = null;
  fechaMinima: any = null;
  ListOficinas: any[] = [];
  TituloGenerico: string = "";
  alertGenerico: string = "";
  ListGenerico: any[] = [];
  ListModulos: any[] = [];
  ListOperaciones: any[] = [];
  SelectedCombo: number = 0;
  SelectedNombre: string = "";
  dateBegin: string = "";
  dateEnd: string = "";
  usuario: string = "";
  loading = false;
  IsShow: boolean = false;
  ngxLoadingComponent!: NgxLoadingComponent;
  IdOficina: number = 0;
  NombreOficina: string = "";
  checkAll: boolean = false;
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';
  btnGenerate: boolean = false;
  InformesLog: any[] = [];
  valida1F: Boolean = false;
  valida2F: boolean = false;
  tipoCliente: number = 1;
  tipoClienteBool1: boolean = true;
  tipoClienteBool2: boolean = false;
  selectedFiltroBool: boolean = false;
  Type: number = 0;
  isShowFechaDesmarcacion: boolean = false;
  isShowFechaMarcacion: boolean = false;
  @ViewChild('ShowModalListLogs', { static: true }) private ShowModalListLogs!: ElementRef;
  constructor(private serviceLogs: InformeLogService, private notif: ToastrService) { }
    
ngOnInit() {
     this.InitVariables();
     this.InitFiltros(this.IdOficina);  
  }
  opcionSelectedTipoCliente(value: number) {
    if (value == 1) {
      this.tipoClienteBool1 = true;
      this.tipoClienteBool2 = false;
    } else {
      this.tipoClienteBool1 = false;
      this.tipoClienteBool2 = true;
    }  
  }
  getInformeList() {
    this.setFiltroFecha();
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos: this.Campos,
      TipoInforme: this.getTypeInforme(),
      Accion: 2
    }
    this.serviceLogs.GetInformeLogs(payload).subscribe(x => { 
      this.InformesLog = x;
      this.filtrosAgregado = [];
      this.isShowFechaDesmarcacion = false;
      this.isShowFechaMarcacion = false;
      this.InformesLog.forEach(x => {
        
        if (x.FechaMarca != null)
          this.isShowFechaMarcacion = true;
        if (x.FechaDesMarca != null)
          this.isShowFechaDesmarcacion = true;
      })
      this.loading = false;
      this.ShowModalListLogs.nativeElement.click();
    }, err => {
      this.filtrosAgregado = [];
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.error("Error al generar el informe", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  InitFiltros(oficinaOrAdmin : number) {
    this.Filtros = this.serviceLogs.GetFiltrosGestionClientesLog();
  }
  getcampos(idFilter: number) {
      if (idFilter != 0) {
        this.Campos = this.serviceLogs.GetCamposGestionClientesLog(idFilter);
        this.selectedFiltroBool = true;
    }
      else {
        this.selectedFiltroBool = false;
        this.Campos = [];
    }
  }
  SeleccionaTodoJuridico(index : number) {
    if (index == -1) {
      this.Campos.forEach(x => x.check = !this.checkAll);
      this.checkAll = !this.checkAll;
    } else 
      this.Campos[index].check = !this.Campos[index].check
  }
  opcionSelectedFilter(value : number) {
    this.checkAll = false;
    this.getcampos(this.filtroSelect)
  }
  InitVariables() {
    this.fechaMax = moment(new Date()).format('YYYY-MM-DD');
    this.fechaMinima = moment(new Date('1900-01-01')).format('YYYY-MM-DD');
  }
  opcionSelectedFechas(value : number) {
    if (value == 1) {
      this.clearFechaInicial = false;
    if ((this.valueFechaInicial.toString() >= this.fechaMinima && this.valueFechaInicial  <= this.fechaMax) || this.valueFechaInicial == this.valueFechaFinal)
      this.valida1F = true;
    else 
      this.valida1F = false;
  }
    else if (value == 2) {
      this.clearFechaFinal = false;
    if ((this.valueFechaFinal.toString() > this.fechaMinima && this.valueFechaFinal <= this.fechaMax && this.valueFechaInicial.toString() < this.valueFechaFinal.toString()) || this.valueFechaInicial == this.valueFechaFinal) 
        this.valida2F = true;
    else
      this.valida2F = false;
  }
  if (this.valida1F && this.valida2F)
    this.btnGenerate = true;
  else
    this.btnGenerate = false;
 }
  DateBeginAndEnd() {
    this.dateBegin = this.valueFechaInicial.toString().replace("-", "/").replace("-", "/").replace("-", "/");
    this.dateEnd = this.valueFechaFinal.toString().replace("-", "/").replace("-", "/").replace("-", "/");
 }
 limpiarSelected() {
  this.btnMore = false;
  this.valida1 = false;
  this.valida2 = false;
  this.SelectedCombo = 0;
  this.SelectedNombre = "";
  this.filtroSelect = 0;
  this.ListGenerico = [];
  this.TituloGenerico = "";
  this.alertGenerico = "";
  this.usuario = "";
  }
 AddFiltro(id: number, value: number, nombreF: string, valorInicial: string, valorFinal: string, validacion: string) {
  let newRegistro : Filtro = new Filtro();
   newRegistro.idFiltro = id;
   newRegistro.idValue = value;
   newRegistro.NombreFiltro = nombreF;
   newRegistro.ValorInicial = valorInicial;
   newRegistro.ValorFinal = valorFinal;
   newRegistro.Validacion = validacion;
   this.filtrosAgregado.push(newRegistro);
 }
  GenerarInformeLogs() {
    let temp : Campo[] = this.Campos.filter(x => x.check == true)
    if (temp.length > 0 )
      this.GetCantInforme(true);
    else
    this.notif.warning('Advertencia', 'Debe seleccionar campos.', ConfiguracionNotificacion.configRightTop);    
  }
  setFiltroFecha() {
    this.DateBeginAndEnd();
      this.AddFiltro(this.filtroSelect, 0, "", this.dateBegin, this.dateEnd, "Entre");
  }
  GetCantInforme(isDowload: boolean) {
    this.InformesLog = [];
    this.setFiltroFecha();
    this.loading = true;
    let payload : any = {
      Filtros: this.filtrosAgregado,
      TipoInforme: this.getTypeInforme(),
      Accion: 1
    }
    this.serviceLogs.GetCantidadRegistros(payload).subscribe(x => {
      this.loading = false;
      this.filtrosAgregado = [];
      this.ModalCantidadRegistros(x,isDowload);
    }, err => {
      this.filtrosAgregado = [];
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  getTypeInforme(): number {
    switch (this.filtroSelect.toString()) {
      case "5":
      case "6":
          this.Type = 2;
        break;
      case "7":
        this.Type = 3;
        break;
      case "8":
        this.Type = 4;
        break;
      case "9":
        case "23":
          this.Type = 5;
        break;
      case "10":
          this.Type = 6;
        break;
    }
    return this.Type;
  }
  ModalCantidadRegistros(Cant: number, idDowload: boolean) {
    if (Cant == 0) { 
      this.notif.warning('Advertencia', 'No hay registros.', ConfiguracionNotificacion.configRightTop);   
      return;
    }
    Swal.fire({
      imageUrl: 'https://www.pgro.org/images/shop/more/493x500_700_121fd5db7d62d33519e2e6bf96d156a3_1618820954excel.png',
      imageWidth: 50,
      imageHeight: 50,
      imageAlt: 'Custom image',
      title: 'El número de registros es: ' + Cant,
      showCancelButton: true,
      cancelButtonColor: "#852662",
      confirmButtonColor: "#269051",
      cancelButtonText: "Cerrar",
      confirmButtonText: idDowload == true ? "Descargar" : "Ver Lista"
    }).then((result) => {
      if (result.value) {
      
        this.loading = true;
        setTimeout(() => {
          if (idDowload)
            this.DescargarInforme();
          else
            this.getInformeList();
        }, 300);
      }
    });
  }
  DescargarInforme() {
    this.setFiltroFecha();
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos: this.Campos.filter(x => x.check == true),
      TipoInforme: this.getTypeInforme(),
      Accion: 2
    }
    this.loading = true;
    let fileName: string = "";
    switch (this.Type)
    {
        case 2:
          fileName = "Informe Logs Gestion Peps.xlsx";
            break;
        case 3:
          fileName = "Informe Logs Solicitud Retiro.xlsx";
            break;
        case 4:
          fileName = "Informe Logs Reingreso.xlsx";
            break;
        case 5:
          fileName = "Informe Logs Tratamiento de Datos.xlsx";
            break;
        case 6:
          fileName = "Informe Logs Seguros.xlsx";
            break;
    }
      this.serviceLogs.GenerateInformesJuridicos(payload).subscribe(x => {
      this.loading = false;
      this.filtrosAgregado = [];
      var baseg4 = x;
      const linkSource = `data:application/xlsx;base64,${baseg4}`;
      const downloadLink = document.createElement("a"); 
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    },
    err => {
        this.filtrosAgregado = [];
        this.loading = false;
        const errorMessage = <any>err;
        this.notif.error("Error al generar el informe", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
    })
  }
  IsShowNow() {
    this.IsShow = true;
  }
  ColorAnterior5: any;
  CambiarColor(fil : number) {
    $(".FilRecip" + this.ColorAnterior5).css("background", "#FFFFFF");
    $(".FilRecip" + fil).css("background", "#e5e5e5");
      this.ColorAnterior5 = fil;
  }
}


