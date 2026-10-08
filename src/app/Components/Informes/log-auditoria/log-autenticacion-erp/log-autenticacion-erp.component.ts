import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Campo, Filtro } from '../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { InformeClientesService } from '../../../../Services/Informes/informe-clientes.service';
import { InformeLogService } from '../../../../Services/Informes/informe-log.service';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import Swal from "sweetalert2";
import moment from 'moment';
import { LoadingService } from '../../../../Services/shared/loading.service';
import { StorageSecurity } from '../../../../utils/storage-security.util';
import { ERP_MESSAGES, ERP_TOAST } from '../../../../utils/constant';

@Component({
  selector: 'app-log-autenticacion-erp',
  templateUrl: './log-autenticacion-erp.component.html',
  styleUrls: ['./log-autenticacion-erp.component.css'],
  providers: [InformeClientesService],
  standalone : false
})
export class LogAutenticacionErpComponent implements OnInit {
  ListUsuarios: any[] = [];
  Campos: Campo[] = [];
  Filtros: Filtro[] = [];
  filtrosAgregado: Filtro[] = [];
  ListOficinas: any[] = [];
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
  TituloGenerico: string = "";
  alertGenerico: string = "";
  ListGenerico: any[] = [];
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
  idModulo: string = "";
  validBlur: boolean = false;
  @ViewChild('ShowModalListLogs', { static: true }) private ShowModalListLogs!: ElementRef;
  constructor(private serviceLogs: InformeLogService, private notif: ToastrService,
    private informeClientesService: InformeClientesService, private loading: LoadingService) { }

  
  ngOnInit() {
    this.InitVariables();
    this.InitCampos();
    this.getOficinaOrAdmin();
    this.InitFiltros();
  }
    
    getInformeList() {
        this.filtroSelect = -4;
        this.MostrarPanel();
        this.setFiltroOficina();
    
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos: this.Campos,
      TipoInforme: 14,
      Accion: 2
    }
    this.serviceLogs.GetInformeLogs(payload).subscribe(x => { 
      this.InformesLog = x;
      this.DeleteDate(); 
      this.DeletedOficina()    
      this.loading.hide();
      this.ShowModalListLogs.nativeElement.click();
    }, err => {
      this.DeleteDate(); 
      this.DeletedOficina();    
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al generar el informe", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  InitFiltros() {
      this.Filtros = this.serviceLogs.GetFiltrosAutenticacionErp();
      if (this.IdOficina != 3)
        this.Filtros = this.Filtros.filter(x => x.idFiltro != 3);
  }
  DeletedOficina() {
    this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != -4); 
    if (this.IdOficina != 3)
    this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != 3);
  }
  setFiltroOficina() {
    if (this.IdOficina != 3) 
      this.AddFiltro(3, this.IdOficina,"Oficina", this.NombreOficina,"", "Es Igual");
  }
  getOficinaOrAdmin() {
    const resultDataStore = StorageSecurity.getData();
    if (!resultDataStore) {
      return;
    }
    this.IdOficina = Number(resultDataStore.NumeroOficina);
    this.NombreOficina = resultDataStore.Oficina;
  }
  InitCampos() {
    this.Campos = this.serviceLogs.GetCamposAutenticacionErp();
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
  opcionSelectedFilter(value: number) {
  
    const existe = this.filtrosAgregado.some(
      x => x.idFiltro == this.filtroSelect
    );
  
    if (existe) {
      this.notif.warning(
        ERP_TOAST.WARNING,
        ERP_MESSAGES.FILTRO_DUPLICADO,
        ConfiguracionNotificacion.configRightTop
      );
    
      setTimeout(() => {
        this.filtroSelect = 0;
        this.ListGenerico = [];
        this.TituloGenerico = '';
        this.alertGenerico = '';
      });
    
      return;
    }
  
    this.ListGenerico = [];
    this.validBlur = false;
  
    switch (this.filtroSelect.toString()) {
      case "4":
        this.TituloGenerico = "Usuario: ";
        this.alertGenerico = "El usuario es obligatorio.";
        this.getUsuarios();
        break;
    
      case "3":
        this.getOficinas();
        this.TituloGenerico = "Oficina: ";
        this.alertGenerico = "La oficina es obligatoria.";
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
  
    if (this.filtroSelect == 4) {
    
      this.SelectedNombre = this.ListUsuarios.find(
          x => x.id == this.SelectedCombo )?.descri ?? '';
      
      return;
    }
  
    this.SelectedNombre = this.ListGenerico.find( x => x.id == this.SelectedCombo )?.descri ?? '';
  }
  InitVariables() {
    this.fechaMax = moment(new Date()).format('YYYY-MM-DD');
    this.fechaMinima = moment(new Date('1900-01-01')).format('YYYY-MM-DD');
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
    let s: number = this.filtroSelect;
    if (s == -4) {
      this.DateBeginAndEnd();
      this.AddFiltro(this.filtroSelect, 0, "Fecha", this.dateBegin, this.dateEnd, "Entre");
    }
    else if (s == 4) {
    
      if (this.SelectedCombo == 0) {
        return;
      }
    
      const usuario = String(this.SelectedCombo);
    
      this.AddFiltro(
        4,
        this.SelectedCombo,
        this.TituloGenerico,
        usuario,
        "",
        "Es Igual"
      );
    }
    else if (s == 3)
      this.AddFiltro(this.filtroSelect, this.SelectedCombo, this.TituloGenerico, this.SelectedNombre, "", "Es Igual");
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
    this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != element.idFiltro);
  }
  GenerarInformeLogs() {
    let temp : Campo[] = this.Campos.filter(x => x.check == true)
    if (temp.length > 0 )
      this.GetCantInforme(true);
    else
      this.notif.warning('Advertencia', ERP_MESSAGES.CAMPOS_REQUERIDOS, ConfiguracionNotificacion.configRightTop);    
  }
  GetCantInforme(isDowload: boolean) {
    this.InformesLog = [];
      this.InformesLog = [];
      this.filtroSelect = -4;
      this.MostrarPanel();
      this.setFiltroOficina();
      this.loading.show();
    let payload : any = {
      Filtros: this.filtrosAgregado,
      TipoInforme: 14,
      Accion: 1
    }
    this.serviceLogs.GetCantidadRegistros(payload).subscribe(x => {
       this.DeleteDate(); 
       this.DeletedOficina()    
       this.loading.hide();
       this.ModalCantidadRegistros(x,isDowload);
    }, err => {
       this.DeleteDate(); 
       this.DeletedOficina()    
       this.loading.hide();
       const errorMessage = <any>err;
       this.notif.error("Error al consultar", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
       console.log(err)
    })
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
        }, 300);
      }
    });
  }
    DescargarInforme() {
      this.filtroSelect = -4;
      this.MostrarPanel();
      this.setFiltroOficina();
    // if (this.btnGenerate) {
    //   this.filtroSelect = -4;
    //   this.MostrarPanel();
      
    // }  
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos: this.Campos.filter(x => x.check == true),
      TipoInforme: 14,
      Accion: 2
    }
      this.loading.show();
    this.serviceLogs.GenerateInformesJuridicos(payload).subscribe(x =>
    {
      this.DeletedOficina();
      this.DeleteDate(); 
      this.loading.hide();
      var baseg4 = x;
      const linkSource = `data:application/xlsx;base64,${baseg4}`;
      const downloadLink = document.createElement("a");
      const fileName = "InformeLogsAutenticacionERP.xlsx";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    },
    err => {
      this.DeletedOficina();   
      this.DeleteDate(); 
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error("Error al generar el informe", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err);
    });
  }
  DeleteDate() {
    this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != -4);
  }
  ColorAnterior5: any;
  CambiarColor(fil : number) {
    $(".FilRecip" + this.ColorAnterior5).css("background", "#FFFFFF");
    $(".FilRecip" + fil).css("background", "#e5e5e5");
      this.ColorAnterior5 = fil;
  }

  getUsuarios() {
    this.loading.show();

    this.serviceLogs.GetUsuarios().subscribe(
      response => {

        this.ListUsuarios = response.map(x => ({
          id: x.Usuario,
          descri: x.Descripcion
        }));

        this.loading.hide();
      },
      err => {

        this.loading.hide();

        this.notif.error(
          "Error al consultar",
          err,
          ConfiguracionNotificacion.configRightTopNoClose
        );
      }
    );
  }
}
