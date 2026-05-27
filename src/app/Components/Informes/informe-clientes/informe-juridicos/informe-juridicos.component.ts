import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { Campo, Filtro } from '../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { ClientesGetListService } from '../../../../Services/Clientes/clientesGetList.service';
import { InformeClientesService } from '../../../../Services/Informes/informe-clientes.service';
import { InformeJuridicoService } from '../../../../Services/Informes/informe-juridico.service';
import { RecursosGeneralesService } from '../../../../Services/Utilidades/recursosGenerales.service';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import { metodosComoConocio } from '../../../../../environments/Maestros.Naturales';
import Swal from "sweetalert2";
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../../Services/shared/loading.service';
declare var $: any;
@Component({
  selector: 'app-informe-juridicos',
  templateUrl: './informe-juridicos.component.html',
  styleUrls: ['./informe-juridicos.component.css'],
  standalone : false
})
export class InformeJuridicosComponent implements OnInit {
  Campos: Campo[] = [];
  Filtros: Filtro[] = [];
  filtrosAgregado: Filtro[] = [];
  filtroSelect: number = 0;
  valida1: boolean = false;
  valida2: boolean = false;
  valueFechaInicial: Date | undefined | any = new Date();
  valueFechaFinal: Date | undefined | any = new Date();
  btnMore: boolean = false;
  fechaMax: any = null;
  fechaMinima: any = null;
  ListRelaciones: any[] = [{ id: 5, descri: "Asociados" }, { id: 15, descri: "Terceros" }];
  ListCIIU : any[] =[];
  ListGenerico: any[] = [];
  ListDepartamentos: any[] = [];
  ListCiudades: any[] = [];
  ListBarrios: any[] = [];
  ListMotivoIngreso: any[] = [];
  ListMetodosComoConocio: any[] = [];
  ListOficinas: any[] = [];
  TituloGenerico: string = "";
  alertGenerico: string = "";
  SelectedCombo: number = 0;
  SelectedNombre: string = "";
  dateBegin: string = "";
  dateEnd: string = "";
  usuario: string = "";
  IsShow: boolean = false;
  IdOficina: number = 0;
  NombreOficina: string = "";
  checkAll: boolean = false;
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';
  @ViewChild('ModalProgressBar', { static: true }) private ModalProgressBar!: ElementRef;
  ProcentajeProgressBar: number = 0;
  search: string = "";
  ShowCampos: any[] = [];
  constructor(private servicesInforme: InformeJuridicoService, private serveceClientes: ClientesGetListService,
    private serviseGeneral: RecursosGeneralesService ,private notif: ToastrService,
    private informeClientesService: InformeClientesService, private loading: LoadingService) { }
    
  ngOnInit() {
    $('#select').focus().select();
    this.InitVariables();
    this.InitCampos();
    this.getOficinaOrAdmin();
    this.InitFiltros(this.IdOficina); 
   
  }
  getCiiu() {
    this.loading.show();
    this.serveceClientes.GetListCiiu().subscribe((x : any[]) => {
      this.ListCIIU = x;
      this.ListCIIU.forEach(x => x.descri = x.Descripcion);
      this.ListCIIU.forEach(x => x.id = x.Id);
      this.ListGenerico = this.ListCIIU;
      this.loading.hide();
    }, err => {
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  getDepartamentos()
  {
      this.loading.show();
      this.serviseGeneral.GetDepartamentosList(42).subscribe(x => {
      this.ListDepartamentos = x;
      this.ListDepartamentos.forEach(x => x.descri = x.Descripcion);
      this.ListDepartamentos.forEach(x => x.id = x.IdDepartamento);
      this.ListGenerico = this.ListDepartamentos;
      this.loading.hide();
      }, err => { 
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  getCities() {
    let temp: any = this.filtrosAgregado.filter(x => x.idFiltro == 4);
    if (temp[0]) {
        this.loading.show();
        this.serviseGeneral.GetCiudadList(temp[0].idValue).subscribe(x => {
        this.ListCiudades = x;
        this.ListCiudades.forEach(x => x.descri = x.Descripcion);
        this.ListCiudades.forEach(x => x.id = x.IdCiudad);
        this.ListGenerico = this.ListCiudades;
        this.loading.hide();
        }, err => {
        this.loading.hide();
        const errorMessage = <any>err;
        this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
      });
    }
    else {
      this.notif.warning('Advertencia', 'Debe agregar primero un departamento.', ConfiguracionNotificacion.configRightTop);
      this.filtroSelect = 0;
    }
  }
  getBarrio() {
    let temp: any = this.filtrosAgregado.filter(x => x.idFiltro == 5);
    if (temp[0]) { 
        this.loading.show();
        this.serviseGeneral.GetBarrioList(temp[0].idValue).subscribe(x => {
        this.ListBarrios = x;
        this.ListBarrios.forEach(x => x.descri = x.Descripcion)
        this.ListBarrios.forEach(x => x.id = x.IdBarrio)
        this.ListGenerico = this.ListBarrios;
        this.loading.hide();
        }, err => {
        this.loading.hide();
        const errorMessage = <any>err;
        this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
       })
    } else 
    {
      this.notif.warning('Advertencia', 'Debe agregar primero una ciudad.', ConfiguracionNotificacion.configRightTop);
      this.filtroSelect = 0;
    }  
  }
  getComoConocioCoogranada() {
    this.ListMetodosComoConocio = metodosComoConocio;
    this.ListMetodosComoConocio.forEach(x => x.descri = x.Descripcion);
    this.ListMetodosComoConocio.forEach(x => x.id = Number(x.Value));
    this.ListGenerico = this.ListMetodosComoConocio;
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
      this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
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
         this.AddFiltro(10, this.SelectedCombo, this.TituloGenerico, this.SelectedNombre, "", "Es Igual");
         this.limpiarSelected();
       }
        else 
       {
         this.notif.warning("Advertencia","No se encontro el usuario.", ConfiguracionNotificacion.configRightTopNoClose );
         this.usuario = "";
         this.btnMore = false;
       }
       this.loading.hide();
     }, err => {
       this.loading.hide();
       const errorMessage = <any>err;
        this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
     })
  }
  InitFiltros(oficinaOrAdmin : number) {
    this.Filtros = this.servicesInforme.GetFiltros(oficinaOrAdmin, false);
    this.Filtros.sort((a, b) => a.NombreFiltro.localeCompare(b.NombreFiltro));
  }
  InitCampos() {
    this.Campos = this.servicesInforme.GetCampos();
    this.ShowCampos = this.Campos;
  }
  getOficinaOrAdmin()
  {
    let datas = localStorage.getItem("Data");
    var resultDataStore =JSON.parse(window.atob(datas == null ? "" : datas));
    this.IdOficina = Number(resultDataStore.NumeroOficina);
    this.NombreOficina = resultDataStore.Oficina;
  }
  SeleccionaTodoJuridico(index: number, check: boolean) {
    if (index == -1) {
      this.ShowCampos.forEach(x => x.check = !check);
    } else
      this.ShowCampos[index].check = check;
  }
  BlurDate(tipo: number) {
    if (tipo == 1) {
      if (this.valueFechaInicial != undefined)
      this.valida1 = false;
    else
      this.valida1 = true;
    }
    else if (tipo == 2) {
      if (this.valueFechaFinal != undefined)
        this.valida2 = false;
      else
        this.valida2 = true;
    }
  }
  SearchChange() {
    let temp: Campo[] = this.ShowCampos.filter(x => x.check == true);
    let temp2: Campo[] = this.Campos;
    for (let index = 0; index < temp.length; index++) {
      if (temp[index].check)
        temp2 = temp2.filter(x => x.idCampo != temp[index].idCampo);
    }
    if (this.search == "") {
      this.ShowCampos = [];
      this.ShowCampos = temp;
      temp2.forEach(x => this.ShowCampos.push(x));
    }
    else {
      this.ShowCampos = [];
      this.ShowCampos = temp2.filter(x => x.NombreCampo.toLowerCase().includes(this.search.toLowerCase()));
      temp.forEach(x => this.ShowCampos.push(x));
    }  
  }
  opcionSelectedFilter(value : number) {
    this.ListGenerico = [];
    this.TituloGenerico = "";
    this.alertGenerico = "";
    this.SelectedCombo = 0;
    this.valida1 = false; 
    this.valida2 = false; 
    this.valueFechaInicial = undefined;
    this.valueFechaFinal = undefined;
    switch (this.filtroSelect.toString()) {
      case "1":
        this.TituloGenerico = "Fecha creación: ";
        break;
      case "2":
        this.ListGenerico = this.ListRelaciones;
        this.TituloGenerico = "Tipo relación: ";
        this.alertGenerico = " El tipo relación es obligatorio."
        break;
      case "3":
        this.getCiiu();
        this.TituloGenerico = "Actividad económica: ";
        this.alertGenerico = " La actividad económica es obligatoria."
        break;
      case "4":
        this.getDepartamentos();
        this.TituloGenerico = "Departamento: ";
        this.alertGenerico = "El departamento es obligatorio."
        break;
      case "5":  
        this.getCities();
        this.TituloGenerico = "Ciudad: ";
        this.alertGenerico = "La ciudad es obligatoria."
        break;
      case "6":  
        this.getBarrio();
        this.TituloGenerico = "Barrio: ";
        this.alertGenerico = "El barrio es obligatoria."
        break;
      case "7":
        this.TituloGenerico = "Fecha retiro: ";
        break;  
      case "8":  
        this.getComoConocioCoogranada();
        this.TituloGenerico = "Como conoció a Coogranada: ";
        this.alertGenerico = "El como conoció a Coogranada es obligatoria."
        break;
      case "9":  
        this.getOficinas();
        this.TituloGenerico = "Oficina: ";
        this.alertGenerico = "La oficina es obligatoria."
        break;
      case "10":  
        this.TituloGenerico = "Usuario: ";
        this.alertGenerico = "El usuario es obligatorio."
        break;
      case "11":  
        this.TituloGenerico = "Fecha ultima actualización: ";
        break;
      case "12":  
        this.TituloGenerico = "Fecha apertura aportes : ";
        break;
    }
    this.btnMore = false;
  }
  BlurSelect() {
    if (this.SelectedCombo == 0)
      this.valida1 = true; 
    else if (this.SelectedCombo != 0 && this.SelectedCombo != undefined)
      this.valida1 = false; 
  }
  InitVariables() {
    this.fechaMax = moment(new Date()).format('YYYY-MM-DD');
    this.fechaMinima = moment(new Date('1900-01-01')).format('YYYY-MM-DD');
  }
  opcionSelectedCombo(value : number) {   
    if (this.SelectedCombo != 0 && this.SelectedCombo != undefined) {
      this.valida1 = false; 
      this.btnMore = true;
      this.GetSelectedNombre();
    }
    else
      this.btnMore = false;
  }
  GetSelectedNombre() {
    this.SelectedNombre = this.ListGenerico.filter(x => x.id == this.SelectedCombo)[0].descri;
  }
  opcionSelectedFechas(value : number) {
    if (value == 1) {
      if (this.valueFechaInicial.toString() > this.fechaMinima && this.valueFechaInicial  < this.fechaMax)
        this.valida1 = false;
      else 
        this.valida1 = true;
    }
    else if (value == 2) {
      if (this.valueFechaFinal.toString() >= this.fechaMinima && this.valueFechaFinal <= this.fechaMax && this.valueFechaInicial.toString() <= this.valueFechaFinal.toString()) 
          this.valida2 = false;
      else
         this.valida2 = true;
    }
    if (!this.valida1 && !this.valida2)
      this.btnMore = true;
    else
      this.btnMore = false;
  }
  DateBeginAndEnd() {
    this.dateBegin = this.valueFechaInicial.toString().replace("-", "/").replace("-", "/").replace("-", "/");
    this.dateEnd = this.valueFechaFinal.toString().replace("-", "/").replace("-", "/").replace("-", "/");
  }
  MostrarPanel() {
    let temp: any = this.filtrosAgregado.filter(x => x.idFiltro == this.filtroSelect)[0];
    if (temp) {
      this.notif.warning('Advertencia', 'El filtro ya fue ingresado.', ConfiguracionNotificacion.configRightTop);
      this.ResetFecha();
      this.limpiarSelected();
      return;
    }
    let s :number =  this.filtroSelect
    if (s == 1 || s == 7 || s == 11 || s == 12)
    {
      this.DateBeginAndEnd();
      this.AddFiltro(this.filtroSelect, 0, this.TituloGenerico, this.dateBegin, this.dateEnd, "Entre");
    }
    else if (s == 10) {
      this.validar();
      return
    } 
    else if(s == 2 ||s == 3 || s == 4 || s == 5 || s == 6 || s == 8 || s == 9 )
      this.AddFiltro(this.filtroSelect,this.SelectedCombo, this.TituloGenerico, this.SelectedNombre, "", "Es Igual");
    
    this.limpiarSelected();
    this.ResetFecha();
   }
  ResetFecha() {
    this.valueFechaInicial = null;
    this.valueFechaFinal = null;
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
  AddFiltro(id:number,value:number,nombreF :string,valorInicial:string,valorFinal : string,validacion :string) {
    let newRegistro : Filtro = new Filtro();
    newRegistro.idFiltro = id;
    newRegistro.idValue = value;
    newRegistro.NombreFiltro = nombreF;
    newRegistro.ValorInicial = valorInicial;
    newRegistro.ValorFinal = valorFinal;
    newRegistro.Validacion = validacion;
    this.filtrosAgregado.push(newRegistro);
  }
  eliminarAgregadas(element: Filtro) {
    if (element.idFiltro == 5 || element.idFiltro == 4) {
      let temp: any = this.filtrosAgregado.filter(x => x.idFiltro == (Number(element.idFiltro) + 1))[0];
      if (temp) {
        let strTemp : string  = element.idFiltro == 5 ? "barrio" : "ciudad"
        this.notif.warning('Advertencia', 'Debe eliminar primero ' + strTemp +".", ConfiguracionNotificacion.configRightTop);
        return;
      }
    }
    this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != element.idFiltro);
  }
  GenerarInformeJuridicos() {
    let temp: Campo[] = this.ShowCampos.filter(x => x.check == true);
    if (temp.length > 0 )
      this.GetCantInforme();
    else
      this.notif.warning('Advertencia', 'Debe seleccionar campos.', ConfiguracionNotificacion.configRightTop);
      
  }
  GetCantInforme() {
    this.setFiltroOficina();
    this.loading.show();
    let payload : any = {
      Filtros : this.filtrosAgregado
    }
    this.servicesInforme.GetCantidadRegistros(payload).subscribe(x => {
      this.loading.hide();
      this.DeletedOficina();
      this.ModalCantidadRegistros(x);
    }, err => {
      this.DeletedOficina();
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
      }
    )
  }
  setFiltroOficina() {
    if (this.IdOficina != 3) 
      this.AddFiltro(9, this.IdOficina,"Oficina", this.NombreOficina,"", "Es Igual");
  }
  DeletedOficina() {
    if (this.IdOficina != 3)
      this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != 9); 
  }
  ModalCantidadRegistros(Cant : number){
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
      confirmButtonText: "Descargar"
    }).then((result) => {
      if (result.value) {
        this.DescargarInforme(Cant);
      }
    })
  }
  DescargarInforme(cant : number) {
    this.setFiltroOficina();
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos : this.ShowCampos.filter(x => x.check == true)
    }
    this.ModalPrgressBar(cant);
    this.servicesInforme.GenerateInformesJuridicos(payload).subscribe(x => {
      if (this.ProcentajeProgressBar < 95)
      clearInterval(this.inter)
      this.ProcentajeProgressBar = 100;
      this.DeletedOficina();
      var baseg4 = x;
      const linkSource = `data:application/xlsx;base64,${baseg4}`;
      const downloadLink = document.createElement("a");
      const fileName = "InformeJuridicos.xlsx";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      setTimeout(() => { this.CloseModal(); }, 1500);
    },
    err => {
      this.DeletedOficina();
      this.CloseModal();
      const errorMessage = <any>err;
      this.notif.error("Error al generar el informe", errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  ModalPrgressBar(cant : number) {
    this.ProcentajeProgressBar = 0;
    this.loading.hide();
    this.ModalProgressBar.nativeElement.click();
    let tempT: number = cant * 0.05;
    tempT = tempT * 1.15;
    let timer: any = (tempT / 95) * 1000;
    this.inter = setInterval(() => { 
      this.ProcentajeProgressBar += 1;
      if (this.ProcentajeProgressBar >= 95)
        clearInterval(this.inter)
    },timer)
  }
  inter: any = null;
  CloseModal() {
    $('#ModalProgressBar').modal("hide");
  }
}


