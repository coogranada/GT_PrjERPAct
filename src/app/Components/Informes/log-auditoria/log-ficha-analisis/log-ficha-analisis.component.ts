import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InformeClientesService } from '../../../../Services/Informes/informe-clientes.service';
import { InformeLogService } from '../../../../Services/Informes/informe-log.service';
import Swal from "sweetalert2";
import moment from 'moment';
import { Campo, Filtro } from '../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import { LoadingService } from '../../../../Services/shared/loading.service';
declare var $: any;
@Component({
  selector: 'app-log-ficha-analisis',
  templateUrl: './log-ficha-analisis.component.html',
  styleUrls: ['./log-ficha-analisis.component.css'],
  providers: [InformeClientesService],
  standalone : false
})
export class LogFichaAnalisisComponent implements OnInit {

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
  ListOperaciones: any[] = [];
  SelectedCombo: number = 0;
  SelectedNombre: string = "";
  dateBegin: string = "";
  dateEnd: string = "";
  usuario: string = "";
  IdOficina: number = 0;
  NombreOficina: string = "";
  checkAll: boolean = false;
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';
  btnGenerate: boolean = false;
  InformesLog: any[] = [];
  valida1F: Boolean = false;
  valida2F: boolean = false;
  idModulo: string = "";
  validBlur: boolean = false;
  @ViewChild('ShowModalListLogs', { static: true }) private ShowModalListLogs!: ElementRef;
  constructor(private serviceLogs: InformeLogService, private notif: ToastrService,
    private informeClientesService: InformeClientesService, private loading: LoadingService) { } 

  ngOnInit() {
    this.InitVariables();
    this.InitCampos();

    this.getOficinaOrAdmin();
    this.InitFiltros(this.IdOficina);
  }
  InitVariables() {
    this.fechaMax = moment(new Date()).format('YYYY-MM-DD');
    this.fechaMinima = moment(new Date('1900-01-01')).format('YYYY-MM-DD');
  }
  InitCampos() {
    this.Campos = this.serviceLogs.GetCamposFichaAnalisis();
  }
  getOficinaOrAdmin() {
    let datas = localStorage.getItem("Data");
    var resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    this.IdOficina = Number(resultDataStore.NumeroOficina);
    this.NombreOficina = resultDataStore.Oficina;
  }
  InitFiltros(oficinaOrAdmin: number) {
    this.Filtros = this.serviceLogs.GetFiltrosFichaAnalisis(oficinaOrAdmin, false);
  }
  
  getInformeList() {
    this.filtroSelect = 0;
    this.MostrarPanel();
    this.setFiltroOficina();
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos: this.GetCamposByFilter(true),
      TipoInforme: 12,
      Accion: 2
    }
    this.serviceLogs.GetInformeLogs(payload).subscribe(x => {
      this.InformesLog = x;
      this.DeletedOficina();
      this.loading.hide();
      this.ShowModalListLogs.nativeElement.click();
    }, err => {
      this.DeletedOficina();
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al generar el informe", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  getOficinas() {
    this.loading.show();
    this.informeClientesService.getOficinas().subscribe(x => {
      this.ListOficinas = x;
      this.ListOficinas.forEach(x => x.descri = x.Descripcion);
      this.ListOficinas.forEach(x => x.id = Number(x.Valor));
      this.ListGenerico = this.ListOficinas;
      this.loading.hide();
    }, err => {
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  validar() {
    this.loading.show();
    let temp: any = null;
    this.informeClientesService.ValidatUsuario(this.usuario).subscribe(x => {
      temp = x;
      if (x.dataBool) {
        this.SelectedNombre = x.data;
        this.AddFiltro(4, this.SelectedCombo, this.TituloGenerico, this.SelectedNombre, "", "Es Igual");
        this.limpiarSelected();
      }
      else {
        this.notif.warning("Advertencia", "No se encontro el usuario.", ConfiguracionNotificacion.configRightTopNoClose);
        this.usuario = "";
        this.btnMore = false;
      }
      this.loading.hide();
    }, err => {
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  getOperaciones(idModulo: string) {
    this.loading.show();
    this.serviceLogs.GetOperaciones(idModulo).subscribe(x => {
      if (x.length == 0) {
        this.filtroSelect = 0;
        this.notif.warning("Advertencia", "Modulo sin operación.", ConfiguracionNotificacion.configRightTopNoClose);
      }
      else {
        this.ListOperaciones = x;
        this.ListOperaciones.forEach(f => f.descri = f.Descripcion);
        this.ListOperaciones.forEach(f => f.id = f.IdOperacion);
        this.ListGenerico = this.ListOperaciones;
      }
      this.loading.hide();
    }, err => {
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  SeleccionaTodoJuridico(index : number) {
    if (index == -1) {
      this.Campos.forEach(x => x.check = !this.checkAll);
      this.checkAll = !this.checkAll;
    } else
      this.Campos[index].check = !this.Campos[index].check
  }
  SelectBlur() {
    if (this.SelectedCombo == 0)
      this.validBlur = true;
  }
  opcionSelectedFilter(value : number) {
    this.ListGenerico = [];
    this.validBlur = false;
    switch (this.filtroSelect.toString()) {
      case "2":
        this.TituloGenerico = "Operación: ";
        this.alertGenerico = " La operación es obligatoria."
        this.getOperaciones("75");
        break;
        case "3":
        this.getOficinas();
        this.TituloGenerico = "Oficina: ";
        this.alertGenerico = "La oficina es obligatoria."
        break;
      case "24":
        this.getOficinas();
        this.TituloGenerico = "Oficina radicado: ";
        this.alertGenerico = "La oficina radicado es obligatoria."
        break;
      case "4":
        this.TituloGenerico = "Usuario: ";
        this.alertGenerico = "El usuario es obligatorio."
        break;
    }
    this.btnMore = false;
  }
  opcionSelectedCombo(value : number) {
    if (this.SelectedCombo != 0 && this.SelectedCombo != undefined) {
      this.valida1 = true;
      this.btnMore = true;
      this.GetSelectedNombre();
    }
    else {
      this.valida1 = false;
      this.btnMore = false;
    }
  }
  GetSelectedNombre() {
    this.SelectedNombre = this.ListGenerico.filter(x => x.id == this.SelectedCombo)[0].descri;
  }
  opcionSelectedFechas(value : number) {
    if (value == 1) {
      if ((this.valueFechaInicial.toString() >= this.fechaMinima && this.valueFechaInicial <= this.fechaMax) || this.valueFechaInicial == this.valueFechaFinal)
        this.valida1F = true;
      else
        this.valida1F = false;
    
      this.clearFechaInicial = false;
    }
    else if (value == 2) {
      if ((this.valueFechaFinal.toString() > this.fechaMinima && this.valueFechaFinal <= this.fechaMax && this.valueFechaInicial.toString() < this.valueFechaFinal.toString()) || this.valueFechaInicial == this.valueFechaFinal)
        this.valida2F = true;
      else
        this.valida2F = false;
    
      this.clearFechaFinal = false;
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
  MostrarPanel() {
    let temp: any = this.filtrosAgregado.filter(x => x.idFiltro == this.filtroSelect)[0];
    if (temp) {
      this.notif.warning('Advertencia', 'El filtro ya fue ingresado.', ConfiguracionNotificacion.configRightTop);
      this.limpiarSelected();
      return;
    }
    let s: number = this.filtroSelect
    if (s == 0) {
      this.DateBeginAndEnd();
      this.AddFiltro(this.filtroSelect, 0, "Fecha", this.dateBegin, this.dateEnd, "Entre");
    }
    else if (s == 1 || s == 2 || s == 3 || s == 24) {
      if (s == 1 )
        this.idModulo = this.SelectedCombo.toString();
      this.AddFiltro(this.filtroSelect, this.SelectedCombo, this.TituloGenerico, this.SelectedNombre, "", "Es Igual");
    }
    else if (s == 4) {
      this.validar();
      return
    }
    this.limpiarSelected();
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
    let newRegistro: Filtro = new Filtro();
    newRegistro.idFiltro = id;
    newRegistro.idValue = value;
    newRegistro.NombreFiltro = nombreF;
    newRegistro.ValorInicial = valorInicial;
    newRegistro.ValorFinal = valorFinal;
    newRegistro.Validacion = validacion;
    this.filtrosAgregado.push(newRegistro);
  }
  eliminarAgregadas(element: Filtro) {
    if (element.idFiltro == 1 && this.filtrosAgregado.filter(x => x.idFiltro == 2)[0] != null) {
      this.notif.warning('Advertencia', 'Debe eliminar primero la operación.', ConfiguracionNotificacion.configRightTop);
      return
    }
    else
      this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != element.idFiltro);
    if (element.idFiltro == 1)
      this.idModulo = "";
  }
  GenerarInformeLogs() {
    let temp: Campo[] = this.Campos.filter(x => x.check == true);

    if (temp.length > 0)
      this.GetCantInforme(true);
    else
      this.notif.warning('Advertencia', 'Debe seleccionar campos.', ConfiguracionNotificacion.configRightTop);
  }
  GetCantInforme(isDowload: boolean) {
    this.InformesLog = [];
    this.filtroSelect = 0;
    this.MostrarPanel();
    this.setFiltroOficina();
    this.loading.show();
    let payload: any = {
      Filtros: this.filtrosAgregado,
      TipoInforme: 12,//this.getTipoInforme(),
      Accion: 1
    }
    this.serviceLogs.GetCantidadRegistros(payload).subscribe(x => {
      this.loading.hide();
      this.DeletedOficina();
      this.ModalCantidadRegistros(x, isDowload);
    }, err => {
      this.DeletedOficina();
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  setFiltroOficina() {
    if (this.IdOficina != 3)
      this.AddFiltro(3, this.IdOficina, "Oficina", this.NombreOficina, "", "Es Igual");
  }
  DeletedOficina() {
    this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != 0);
    if (this.IdOficina != 3)
      this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != 3);
  }
  ModalCantidadRegistros(Cant: number, idDowload: boolean) {
    if (Cant == 0) {
      this.notif.warning('Advertencia', 'No hay registros', ConfiguracionNotificacion.configRightTop);
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
      Swal.close();
      if (result.value) {
        this.loading.show();
        setTimeout(() => {
          if (idDowload)
            this.DescargarInforme();
          else
            this.getInformeList();
        }, 300)
       
      }
    });
  }
  DescargarInforme() {
    this.filtroSelect = 0;
    this.MostrarPanel();
    this.setFiltroOficina();
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos: this.GetCamposByFilter(false),
      TipoInforme: 12,
      Accion: 2
    }
    this.loading.show();
    this.serviceLogs.GenerateInformesJuridicos(payload).subscribe(x => {
      this.loading.hide();
      this.DeletedOficina();
      var baseg4 = x;
      const linkSource = `data:application/xlsx;base64,${baseg4}`;
      const downloadLink = document.createElement("a");
      const fileName = "InformeLogsFichaAnalisis.xlsx";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    },
      err => {
        this.DeletedOficina();
        this.loading.hide();
        const errorMessage = <any>err;
        this.notif.error("Error al generar el informe", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
      })
  }
  GetCamposByFilter(descarga: boolean) {
    if (descarga)
      return this.Campos;
    else
      return this.Campos.filter(x => x.check == true || x.idCampo == 7);
  }
  public ColorAnterior5: any;
  CambiarColor(fil : number) {
    $(".FilRecip" + this.ColorAnterior5).css("background", "#FFFFFF");
    $(".FilRecip" + fil).css("background", "#e5e5e5");
      this.ColorAnterior5 = fil;
  }
}
