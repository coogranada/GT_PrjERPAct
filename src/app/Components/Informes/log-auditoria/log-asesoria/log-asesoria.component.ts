import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Campo, Filtro } from '../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { InformeClientesService } from '../../../../Services/Informes/informe-clientes.service';
import { InformeLogService } from '../../../../Services/Informes/informe-log.service';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import Swal from "sweetalert2";
import moment from 'moment';
import { LoadingService } from '../../../../Services/shared/loading.service';
declare var $: any;
@Component({
  selector: 'app-log-asesoria',
  templateUrl: './log-asesoria.component.html',
  styleUrls: ['./log-asesoria.component.css'],
  providers: [InformeClientesService],
  standalone : false
})
export class LogAsesoriaComponent implements OnInit {
  ColorAnterior5: any;
  Campos: Campo[] = [];
  Filtros: Filtro[] = [];
  filtrosAgregado: Filtro[] = [];
  filtroSelect: number = 0;
  valida1: boolean = false;
  valida2: boolean = false;
  valueFechaInicial: Date = new Date();
  valueFechaFinal: Date  = new Date();;
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
  ListOpciones: any[] = [];
  SelectedCombo: number = 0;
  SelectedNombre: string = "";
  dateBegin: string = "";
  dateEnd: string = "";
  strInput: string = "";
  IdOficina: number = 0;
  NombreOficina: string = "";
  checkAll: boolean = false;
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';
  btnGenerate: boolean = false;
  InformesLog: any[] = [];
  valida1F: Boolean = false;
  valida2F: boolean = false;
  validBlur: boolean = false;
  @ViewChild('ShowModalListLogs', { static: true }) private ShowModalListLogs!: ElementRef;
  constructor(private serviceLogs: InformeLogService, 
    private notif: ToastrService,
    private informeClientesService: InformeClientesService,
    private loading: LoadingService) { }

  
  ngOnInit() {
    this.InitVariables();
    this.InitCampos();
    this.getOficinaOrAdmin();
    this.InitFiltros();  
    $('#SelectFilter').focus().select();
  }
  getInformeList() {
      this.filtroSelect = -2;
      this.MostrarPanel();
    this.setFiltroOficina();
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos: this.Campos,
      TipoInforme: 8,
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
      this.notif.error('Error al generar el informe', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
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
  validar(TituloGenerico : string) {
    this.loading.show();
    let temp: any = null;
     this.informeClientesService.ValidatUsuario(this.strInput).subscribe(x => {
      temp = x;
       if (x.dataBool) {
         this.SelectedNombre = x.data; 
         this.AddFiltro(19, this.SelectedCombo, TituloGenerico, this.SelectedNombre, "", "Es Igual");
         this.limpiarSelected();
       }
        else 
       {
         this.notif.warning("Advertencia","El usuario no existe en el sistema, por favor intenta nueva mente ", ConfiguracionNotificacion.configRightTopNoClose );
         this.strInput = "";
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
  getModulos() {
      this.loading.show();
      this.serviceLogs.GetModulos(3).subscribe(x => {
      this.ListModulos = x;
      this.ListModulos.forEach(f => f.descri = f.Nombre);
      this.ListModulos.forEach(f => f.id = f.IdModulo);
      this.ListGenerico = this.ListModulos;
      this.loading.hide();
    }, err => { 
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  getOperaciones(idModulo : string) {
      this.loading.show();
    this.serviceLogs.GetOperaciones(idModulo).subscribe(x => {
      if(x.length == 0)
      {
        this.filtroSelect = 0;
        this.notif.warning("Advertencia","Modulo sin operación.", ConfiguracionNotificacion.configRightTopNoClose );
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
  getOpciones() {
    this.loading.show();
    this.serviceLogs.GetOpciones().subscribe(x => {
      this.ListOpciones = x;
      this.ListOpciones.forEach(f => f.descri = f.Descripcion);
      this.ListOpciones.forEach(f => f.id = f.IdOpcion);
      this.ListGenerico = this.ListOpciones;
      this.loading.hide();
    }, err => {
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  InitFiltros() {
    this.Filtros = this.serviceLogs.GetFiltrosAsesorias();
    if (this.IdOficina != 3)
      this.Filtros = this.Filtros.filter(x => x.idFiltro != 18);
  }
  InitCampos() {
    this.Campos = this.serviceLogs.GetCamposAsesorias();
  }
  getOficinaOrAdmin()
  {
    let datas = localStorage.getItem("Data");
    var resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    this.IdOficina = Number(resultDataStore.NumeroOficina);
    this.NombreOficina = resultDataStore.Oficina;
  }
  SeleccionaTodoCampos(index : number) {
    if (index == -1) {
      this.Campos.forEach(x => x.check = !this.checkAll);
      this.checkAll = !this.checkAll;
    } else 
      this.Campos[index].check = !this.Campos[index].check
  }
  SelectBlur() {
    if(this.SelectedCombo == 0)
       this.validBlur = true;
  }
  opcionSelectedFilter(value : number) {
    this.ListGenerico = [];
    this.validBlur = false;
    switch (this.filtroSelect.toString()) {
      case "18":  
        this.TituloGenerico = "Oficina: ";
        this.alertGenerico = "La oficina es obligatoria.";
        this.getOficinas();
        break;
      case "19":  
        this.TituloGenerico = "Usuario: ";
        this.alertGenerico = "El usuario es obligatorio.";
        break;
      case "20":
        this.TituloGenerico = "Modulo: ";
        this.alertGenerico = " El modulo es obligatorio.";
        this.getModulos();
        break;
      case "21":
        this.TituloGenerico = "Operación ";
        console.log("dark",this.filtrosAgregado.filter(x => x.idFiltro == 20)[0].idValue.toString())
        if (this.filtrosAgregado.filter(x => x.idFiltro == 20)[0] == null) {
          this.filtroSelect = 0;
          this.notif.warning('Advertencia', 'Debe seleccionar primero un modulo', ConfiguracionNotificacion.configRightTop);
          return
        }
        this.alertGenerico = " La operación es obligatoria.";
        this.getOperaciones(this.filtrosAgregado.filter(x => x.idFiltro == 20)[0].idValue.toString());
        break;
    }
    this.btnMore = false;
  }
  InitVariables() {
    this.fechaMax = moment(new Date()).format('YYYY-MM-DD');
    this.fechaMinima = moment(new Date('1900-01-01')).format('YYYY-MM-DD');
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
      this.notif.warning('Advertencia', 'Filtro seleccionado ya existe', ConfiguracionNotificacion.configRightTop);
      this.limpiarSelected();
      return;
    }
    let s: number = this.filtroSelect;
    if (s == -2) {
      this.DateBeginAndEnd();
      this.AddFiltro(this.filtroSelect, 0, "Fecha", this.dateBegin, this.dateEnd, "Entre");
    }
    else if (s == 18 || s == 20 || s == 21) 
      this.AddFiltro(this.filtroSelect, this.SelectedCombo, this.TituloGenerico, this.SelectedNombre, "", "Es Igual");
    else if (s == 19)
     this.validar(this.TituloGenerico );
   
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
  }
  AddFiltro(id:number,value:number,nombreF :string,valorInicial:string,valorFinal : string,validacion :string) {
    let newRegistro : Filtro = new Filtro();
    newRegistro.idFiltro = id;
    newRegistro.idValue = value;
    newRegistro.NombreFiltro = nombreF;
    newRegistro.ValorInicial = valorInicial;
    newRegistro.ValorFinal = valorFinal;
    newRegistro.Validacion = validacion;
    this.filtrosAgregado.push(newRegistro);
    this.strInput = "";
  }
  eliminarAgregadas(element: Filtro) {
      if (element.idFiltro == 20 && this.filtrosAgregado.filter(x => x.idFiltro == 21 )[0] != null) {
        this.notif.warning('Advertencia', 'Debe eliminar primero la operación.', ConfiguracionNotificacion.configRightTop);
        return
      }
      else
        this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != element.idFiltro);
  }
  GenerarInformeLogs() {
    let temp : Campo[] = this.Campos.filter(x => x.check == true)
    if (temp.length > 0 )
      this.GetCantInforme(true);
    else
      this.notif.warning('Advertencia', 'Debe seleccionar campos.', ConfiguracionNotificacion.configRightTop);    
  }
  GetCantInforme(isDowload: boolean) {
    this.InformesLog = [];
    this.filtroSelect = -2;
    this.MostrarPanel();
    this.setFiltroOficina();
    this.loading.show();
    let payload : any = {
      Filtros: this.filtrosAgregado,
      TipoInforme: 8,
      Accion: 1
    }
     this.serviceLogs.GetCantidadRegistros(payload).subscribe(x => {
       this.loading.hide();
       this.DeletedOficina();
       this.ModalCantidadRegistros(x,isDowload);
     }, err => {
       this.DeletedOficina();
       this.loading.hide();
       const errorMessage = <any>err;
       this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
       console.log(err)
       }
     )
  }
  setFiltroOficina() {
    if (this.IdOficina != 3) 
      this.AddFiltro(18, this.IdOficina,"Oficina", this.NombreOficina,"", "Es Igual");
  }
  DeletedOficina() {
      this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != -2); 
    if (this.IdOficina != 3)
      this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != 18);
  }
  ModalCantidadRegistros(Cant: number, idDowload: boolean) {
      if (Cant == 0) { 
        this.notif.warning('Advertencia', 'No se encuentran registros', ConfiguracionNotificacion.configRightTop);   
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
      this.filtroSelect = -2;
      this.MostrarPanel();
    this.setFiltroOficina();
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos: this.Campos.filter(x => x.check == true),
      TipoInforme: 8,
      Accion: 2
    }
      this.loading.show();
      this.serviceLogs.GenerateInformesJuridicos(payload).subscribe(x => {
      this.loading.hide();
     this.DeletedOficina();
      var baseg4 = x;
      const linkSource = `data:application/xlsx;base64,${baseg4}`;
      const downloadLink = document.createElement("a");
      const fileName = "InformeLogsAsesorias.xlsx";
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
  CambiarColor(fil : number) {
    $(".FilRecip" + this.ColorAnterior5).css("background", "#FFFFFF");
    $(".FilRecip" + fil).css("background", "#e5e5e5");
      this.ColorAnterior5 = fil;
  }
}
