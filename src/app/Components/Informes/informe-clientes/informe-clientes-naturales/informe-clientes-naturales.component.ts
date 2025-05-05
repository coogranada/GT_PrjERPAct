import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientesGetListService } from '../../../../Services/Clientes/clientesGetList.service';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { InformeClientesService } from '../../../../Services/Informes/informe-clientes.service';
import { LoginService } from '../../../../Services/Login/login.service';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';
import { Router } from '@angular/router';
import { RecursosGeneralesService } from '../../../../Services/Utilidades/recursosGenerales.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Campo, Filtro } from '../../../../Models/Informes/informe-clientes/informe-clientes.model';
import moment from 'moment';
import { metodosComoConocio } from '../../../../../environments/Maestros.Naturales';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-informe-clientes-naturales',
  templateUrl: './informe-clientes-naturales.component.html',
  styleUrls: ['./informe-clientes-naturales.component.css'],
  providers: [InformeClientesService, ModuleValidationService, LoginService, OperacionesService, ClientesGetListService],
  standalone : false
})
export class InformeClientesNaturalesComponent implements OnInit {
  fechaMax: any = null;
  fechaMinima: any = null;
  CodModulo = 76;
  Campos: Campo[] = [];
  ShowCampos: Campo[] = [];
  search: string = "";
  checkAll: boolean = false;
  Filtros: Filtro[] = [];
  IdOficina: number = 0;
  NombreOficina: string = "";
  filtroSelect: number = 0;
  btnMore: boolean = false;
  filtrosAgregado: Filtro[] = [];
  TituloGenerico: string = "";
  alertGenerico: string = "";
  loading: boolean = false;
  ListGenerico: any[] = [];
  ListRelaciones: any[] = [{ id: 5, descri: "Asociados" },{ id: 10, descri: "Menores" }, { id: 15, descri: "Terceros" }];
  ListTipoDoc: any[] = [];
  ListEstado : any[] = [{ id: 5, descri: "Activa"},{ id: 32, descri: "Fallecido"},{ id: 55, descri: "Retirado" }]
  ListGenero: any[] = [{ id: 1, descri: "Femenino" }, { id: 2, descri: "Masculino" }]
  ListEstadoCivil : any[] = [{ id: 5, descri: "Casado" }, { id: 20, descri: "Separado" },{ id: 25, descri: "Soltero" }, { id: 30, descri: "Unión libre" },{ id: 35, descri: "Viudo" }]
  ListMetodosComoConocio: any[] = [];
  ListEstrato: any[] = [{ id: 1, descri: "1" }, { id: 2, descri: "2" },{ id: 3, descri: "3" }, { id: 4, descri: "4" },{ id: 5, descri: "5" }, { id: 6, descri: "6" },];
  ListTipoEmpleo: any[] = [];
  ListTipoOcupacion: any[] = [];
  ListProfesion: any[] = [];
  ListPaises: any[] = [];
  ListDepartamento: any[] = [];
  ListCiudad: any[] = [];
  ListBarrio: any[] = [];
  ListOficina: any[] = [];
  ListPepsAdministrador : any[] = [{ id: 1, descri: "No" }, { id: 2, descri: "Si" }];
  ListMotivosIngreso: any[] = [];
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';
  SelectedNombre: string = "";
  SelectedCombo: number = 0;
  valueFechaInicial: any = new Date();
  valueFechaFinal: any = new Date();
  EdadInicial: number | null = null;
  EdadFinal: number | null = null;
  valida1: boolean = false;
  valida2: boolean = false;
  EdadInicialMayorEdadFinal: boolean = false;
  dateBegin: string = "";
  dateEnd: string = "";
  @ViewChild('ModalProgressBar', { static: true }) private ModalProgressBar!: ElementRef;
  ProcentajeProgressBar: number = 0;
  constructor(private clientesGetListService: ClientesGetListService, private informeClientesService: InformeClientesService,
    private notif: ToastrService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, private loginService: LoginService,private serviseGeneral : RecursosGeneralesService,
    private router: Router,
    private operacionesService:OperacionesService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
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
    this.Campos = this.informeClientesService.GetCampos();
    this.ShowCampos = this.Campos;
  }
  getOficinaOrAdmin()
  {
    let datas = localStorage.getItem("Data");
    var resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    this.IdOficina = Number(resultDataStore.NumeroOficina);
    this.NombreOficina = resultDataStore.Oficina;
  }
  InitFiltros(oficinaOrAdmin : number) {
    this.Filtros = this.informeClientesService.GetFiltros(oficinaOrAdmin, false);
    this.Filtros = this.Filtros.sort((a, b) => a.NombreFiltro.localeCompare(b.NombreFiltro))
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
    this.EdadInicialMayorEdadFinal = false;
    this.EdadInicial = null;
    this.EdadFinal = null;

    switch (this.filtroSelect.toString()) {
      case "1":
        this.TituloGenerico = "Fecha afiliación: ";
        break;
      case "2":
        this.TituloGenerico = "Tipo relación: ";
        this.alertGenerico = "El tipo relación es obligatorio.";
        this.ListGenerico = this.ListRelaciones;
        break;
      case "3":
        this.TituloGenerico = "Tipo documento: ";
        this.alertGenerico = " El tipo documento es obligatorio.";
        this.GetTipoDocumento();
        break;
      case "4":
        this.TituloGenerico = "Estado: ";
        this.alertGenerico = "El estado es obligatorio.";
        this.ListGenerico = this.ListEstado;
        break;
      case "5":  
        this.TituloGenerico = "Género: ";
        this.alertGenerico = "El género es obligatorio.";
        this.ListGenerico = this.ListGenero;
        break;
      case "6":  
        this.TituloGenerico = "Estado civil: ";
        this.alertGenerico = "El estado civil es obligatorio.";
        this.ListGenerico = this.ListEstadoCivil;
        break;
      case "7":  
        this.TituloGenerico = "Como conoció a Coogranada: ";
        this.alertGenerico = "El como conoció a Coogranada es obligatoria.";
        this.GetComoConocioCoogranada();
        break;
      case "8":  
        this.TituloGenerico = "Motivo ingreso: ";
        this.alertGenerico = "El motivo ingreso es obligatorio.";
        this.GetMotivosIngreso();
        break;
      case "9":  
        this.TituloGenerico = "Estrato: ";
        this.alertGenerico = "El estrato es obligatorio.";
        this.ListGenerico = this.ListEstrato;
        break;
      case "10":  
        this.TituloGenerico = "Tipo empleo: ";
        this.alertGenerico = "El tipo empleo es obligatorio.";
        this.GetTipoEmpleo()
        break;
      case "11":  
        this.TituloGenerico = "Tipo ocupación: ";
        this.alertGenerico = "El tipo ocupación es obligatorio.";
        this.GetTipoOcupacion();
        break;
      case "13":  
        this.TituloGenerico = "Profesión: ";
        this.alertGenerico = "La profesión es obligatoria.";
        this.GetProfesion();
        break;
      case "14":  
        this.TituloGenerico = "Rango de Edad: ";
        this.alertGenerico = "";
        break;
      case "17":  
        this.TituloGenerico = "Fecha retiro: ";
        this.alertGenerico = "";
        break;
      case "18":  
        this.TituloGenerico = "País:";
        this.alertGenerico = "El país es obligatorio.";
        this.GetPaises();
        break;
      case "19":  
        this.TituloGenerico = "Departamento:";
        this.alertGenerico = "El departamento es obligatorio.";
        this.GetDepartamentos();
        break; 
      case "20":  
        this.TituloGenerico = "Ciudad:";
        this.alertGenerico = "La ciudad es obligatorio.";
        this.GetCiudades();
        break;
      case "21":  
        this.TituloGenerico = "Barrio:";
        this.alertGenerico = "El barrio es obligatorio.";
        this.GetBarrios();
        break;
      case "22":  
        this.TituloGenerico = "Oficina:";
        this.alertGenerico = "La oficina es obligatoria.";
        this.GetOficinas();
        break;
      case "24":  
        this.TituloGenerico = "Peps:";
        this.alertGenerico = "El peps es obligatorio.";
        this.ListGenerico = this.ListPepsAdministrador;
        break;
      case "25":  
        this.TituloGenerico = "Administra recursos públicos:";
        this.alertGenerico = "El administra recursos públicos es obligatorio.";
        this.ListGenerico = this.ListPepsAdministrador;
        break;
      case "26":  
        this.TituloGenerico = "Fecha Ultima Actualización";
        break;
      case "27":  
        this.TituloGenerico = "Regimen tributario:";
        this.alertGenerico = "El regimen tributario es obligatorio.";
        this.ListGenerico = [{ id:2, descri:"Simple" }, { id:1, descri:"No responsable" }]
        break;
    }
    this.btnMore = false;
  }
  GetMotivosIngreso() {
    this.loading = true;
    this.clientesGetListService.GetMotivoIngreso().subscribe(
      result => {
        this.ListMotivosIngreso = result;
        this.ListMotivosIngreso.forEach(x => x.descri = x.Descripcion);
        this.ListMotivosIngreso.forEach(x => x.id = x.Clase);
        this.ListGenerico = this.ListMotivosIngreso;
        this.loading = false;
      },
      err => {
        this.loading = false;
        const errorMessage = <any>err;
        this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
       })
  }
  GetOficinas() {
    this.loading = true;
    this.informeClientesService.getOficinas().subscribe(
      result => {
        this.ListOficina = result;
        this.ListOficina.forEach(x => x.descri = x.Descripcion);
        this.ListOficina.forEach(x => x.id = x.Valor);
        this.ListGenerico = this.ListOficina;
        this.loading = false;
      },err =>  { 
        this.loading = false;
        const errorMessage = <any>err;
        this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
      });
  }
  GetBarrios() {
    let tempCiudad: Filtro = this.filtrosAgregado.filter(x => x.idFiltro == 20)[0];
    if (tempCiudad == null) {
      this.notif.warning('Advertencia', 'Debe agregar primero una ciudad.', ConfiguracionNotificacion.configRightTop);
      this.filtroSelect = 0;
    }     
    else {
        this.loading = true;
        this.serviseGeneral.GetBarrioList(tempCiudad.idValue).subscribe(x => {
        this.ListBarrio = x;
        this.ListBarrio.forEach(x => x.descri = x.Descripcion);
        this.ListBarrio.forEach(x => x.id = x.IdBarrio);
        this.ListGenerico = this.ListBarrio;
        this.loading = false;
      },err =>  { 
        this.loading = false;
        const errorMessage = <any>err;
        this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
      });
    }
  }
  GetCiudades() {
    let tempDepartamento: Filtro = this.filtrosAgregado.filter(x => x.idFiltro == 19)[0];
    if (tempDepartamento == null){
      this.notif.warning('Advertencia', 'Debe agregar primero un departamento.', ConfiguracionNotificacion.configRightTop);
      this.filtroSelect = 0;
    }
    else {
      this.loading = true;
      this.serviseGeneral.GetCiudadList(tempDepartamento.idValue).subscribe(x => { 
        this.ListCiudad = x;
        this.ListCiudad.forEach(x => x.descri = x.Descripcion);
        this.ListCiudad.forEach(x => x.id = x.IdCiudad);
        this.ListGenerico = this.ListCiudad;
        this.loading = false;
      },err =>  { 
        this.loading = false;
        const errorMessage = <any>err;
        this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(err)
      });
    }
  }
  GetDepartamentos() {
    let tempPais: Filtro = this.filtrosAgregado.filter(x => x.idFiltro == 18)[0];
    if (tempPais == null) {
      this.notif.warning('Advertencia', 'Debe agregar primero país.', ConfiguracionNotificacion.configRightTop);
      this.filtroSelect = 0;
    }
    else if (tempPais.idValue != 42) {
      this.notif.warning('Advertencia', 'País agregado sin departamentos.', ConfiguracionNotificacion.configRightTop);
      this.filtroSelect = 0;
    }
    else if(tempPais.idValue == 42)
    {
      this.loading = true;
      this.serviseGeneral.GetDepartamentosList(42).subscribe(x => { 
      this.ListDepartamento = x;
      this.ListDepartamento.forEach(x => x.descri = x.Descripcion);
      this.ListDepartamento.forEach(x => x.id = x.IdDepartamento);
      this.ListGenerico = this.ListDepartamento;
      this.loading = false;
    },
    err => { 
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
      });
    }
  }
  GetPaises() {
    this.loading = true;
    this.serviseGeneral.GetPaisesList().subscribe(x => {
      this.ListPaises = x;
      this.ListPaises.forEach(x => x.descri = x.Descripcion);
      this.ListPaises.forEach(x => x.id = x.IdPais);
      this.ListGenerico = this.ListPaises;
      this.loading = false;
    },
    err => { 
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    });
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
  opcionSelectedFechas(value : number) {
    if (value == 1) {
      if (this.valueFechaInicial.toString() >= this.fechaMinima && this.valueFechaInicial  <= this.fechaMax)
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
  GetProfesion() {
    let pro = localStorage.getItem('profesion');
    this.ListProfesion = JSON.parse(window.atob(pro == null ? "" : pro));
    this.ListProfesion.forEach(x => x.descri = x.Descripcion);
    this.ListProfesion.forEach(x => x.id = x.Clase);
    this.ListGenerico = this.ListProfesion;
}
  GetTipoOcupacion() {
    let tipoEmpleo: Filtro = this.filtrosAgregado.filter(x => x.idFiltro == 10)[0];
    if (tipoEmpleo != null) { 
      this.loading = true;
      this.informeClientesService.getOcupaciones(tipoEmpleo.idValue).subscribe(
        (result) => {
          this.ListTipoOcupacion = result;                 
          this.ListTipoOcupacion.forEach(x => x.descri = x.Nombre);
          this.ListTipoOcupacion.forEach(x => x.id = x.IdTipoOcupacion);
          this.ListGenerico = this.ListTipoOcupacion;
          this.loading = false;
        },
        err => {
          this.loading = false;
          const errorMessage = <any>err;
          this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
          console.log(err)
        });
    }
    else {
      this.notif.warning('Advertencia', 'Debe agregar primero tipo de empleo.', ConfiguracionNotificacion.configRightTop);
      this.filtroSelect = 0;
    }
  }
  GetTipoEmpleo() {
    let em = localStorage.getItem('empleo');
    let temp: any[] = JSON.parse(window.atob(em == null ? "" : em));
    this.ListTipoEmpleo = temp;
    this.ListTipoEmpleo.forEach(x => x.descri = x.Nombre);
    this.ListTipoEmpleo.forEach(x => x.id = x.IdTipoEmpleo);
    this.ListGenerico = this.ListTipoEmpleo;
  }
  GetComoConocioCoogranada() {
    this.ListMetodosComoConocio = metodosComoConocio;
    this.ListMetodosComoConocio.forEach(x => x.descri = x.Descripcion);
    this.ListMetodosComoConocio.forEach(x => x.id = Number(x.Value));
    this.ListGenerico = this.ListMetodosComoConocio;
  }
  GetTipoDocumento() {
    this.loading = true;
    this.clientesGetListService.GetTipoDocumento().subscribe(
      result => {
        this.ListTipoDoc = result;
        this.ListTipoDoc.forEach(x => x.descri = x.Descripcion);
        this.ListTipoDoc.forEach(x => x.id = x.Clase);
        this.ListTipoDoc = this.ListTipoDoc.filter(x => x.id != 3);
        this.ListGenerico = this.ListTipoDoc;
        this.loading = false;
      },err => {
          this.loading = false;
          const errorMessage = <any>err;
          this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
          console.log(err)
        });
  }
  validaEdad(edade : number | null,initEnd: number) {
    if (initEnd == 1) {
      if (this.EdadInicial != null && this.EdadInicial != 0  )
        this.valida1 = false;
      else
        this.valida1 = true;
    } else {
      if (this.EdadFinal != null && this.EdadFinal != 0 ) 
        this.valida2 = false;
      else
        this.valida2 = true;
      
      if (this.EdadInicial != null && this.EdadFinal != null && this.EdadInicial >= this.EdadFinal)
        this.EdadInicialMayorEdadFinal = true;
      else
        this.EdadInicialMayorEdadFinal = false;
    }

    if (this.EdadInicial != null && this.EdadInicial > 0 &&
         this.EdadFinal != null && this.EdadFinal > 0 &&  this.EdadFinal >= this.EdadInicial)
      this.btnMore = true;
    else  
      this.btnMore = false;  
  }
  BlurSelect() {
    if (this.SelectedCombo == 0)
      this.valida1 = true; 
    else if (this.SelectedCombo != 0 && this.SelectedCombo != undefined)
      this.valida1 = false; 
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
  MostrarPanel() {
    let temp: any = this.filtrosAgregado.filter(x => x.idFiltro == this.filtroSelect)[0];
    if (temp) {
      this.notif.warning('Advertencia', 'El filtro ya fue ingresado.', ConfiguracionNotificacion.configRightTop);
      this.ResetFecha();
      this.limpiarSelected();
      return;
    }

    let s: number = this.filtroSelect;
    if (s == 5 || s == 24 || s == 25) {
      this.SelectedCombo --;
    }
    if (s == 1 || s == 17 || s == 26)
    {
      this.DateBeginAndEnd();
      this.AddFiltro(this.filtroSelect, 0, this.TituloGenerico, this.dateBegin, this.dateEnd, "Entre");
    }
    else if (s == 14)
    {
      this.AddFiltro(this.filtroSelect, 0, this.TituloGenerico, this.EdadInicial == null ? "" : this.EdadInicial.toString(), this.EdadFinal == null ? "" :this.EdadFinal.toString(), "Entre");
    }
    else if (s == 2 || s == 3 || s == 4 || s == 5 || s == 6 || s == 7 || s == 8 || s == 9
      || s == 10 || s == 11 || s == 13 || s == 18 || s == 19 || s == 20 || s == 21 || s == 22
      || s == 24 || s == 25 || s == 27)
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
  SeleccionaCampos(index: number, check: boolean) {
    if (index == -1) {
      this.ShowCampos.forEach(x => x.check = !check);
    } else
      this.ShowCampos[index].check = check;
  }
  GenerarInformeNaturales() {
    let temp : Campo[] = this.ShowCampos.filter(x => x.check == true);
    if (temp.length > 0 )
      this.GetCantInforme();
    else
    this.notif.warning('Advertencia', 'Debe seleccionar campos.', ConfiguracionNotificacion.configRightTop);
      
  }
  GetCantInforme() {
    this.setFiltroOficina();
    this.loading = true;
    let payload : any = {
      Filtros : this.filtrosAgregado
    }
    this.informeClientesService.GenerarInformeNaturales(payload).subscribe(x => {
      this.loading = false;
      this.DeletedOficina();
      this.ModalCantidadRegistros(x);
    }, err => {
      this.DeletedOficina();
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.error('Error al consultar', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
      }
    )
  }
  setFiltroOficina() {
    if (this.IdOficina != 3) 
      this.AddFiltro(22, this.IdOficina,"Oficina", this.NombreOficina,"", "Es Igual");
  }
  DeletedOficina() {
    if (this.IdOficina != 3)
      this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != 22); 
  }
  ModalCantidadRegistros(Cant: number) {
    
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
        this.loading = true;
        setTimeout(() => {
          this.DescargarInforme(Cant);
        }, 300);
      }
    });
  }
  DescargarInforme(cant : number) {
    this.setFiltroOficina();
    let payload: any =
    {
      Filtros: this.filtrosAgregado,
      Campos : this.ShowCampos.filter(x => x.check == true)
    }
    this.ModalPrgressBar(cant);
    this.informeClientesService.GenerarXLSXInforme(payload).subscribe(x => {
      if (this.ProcentajeProgressBar < 95)
        clearInterval(this.inter)
      this.ProcentajeProgressBar = 100;
      this.DeletedOficina();
      var baseg4 = x;
      const linkSource = `data:application/xlsx;base64,${baseg4}`;
      const downloadLink = document.createElement("a");
      const fileName = "InformeNaturales.xlsx";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      setTimeout(() => { this.CloseModal(); }, 1500);
    },
    err => {
      this.DeletedOficina();
      this.CloseModal();
      const errorMessage = <any>err;
      this.notif.error('Error al generar el informe', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
      console.log(err)
    })
  }
  eliminarAgregadas(element: Filtro) {
    if (element.idFiltro == 10 || element.idFiltro == 18 || element.idFiltro == 19 || element.idFiltro == 20) {
      let temp: Filtro = this.filtrosAgregado.filter(x => x.idFiltro == ( Number(element.idFiltro) + 1))[0];
      if (temp != null) {
        let strTemp : string = "";
        strTemp = temp.NombreFiltro.replace(":","").toLowerCase();
        this.notif.warning('Advertencia', 'Debe eliminar primero ' + strTemp +".", ConfiguracionNotificacion.configRightTop);
        return;
      }
    }
    this.filtrosAgregado = this.filtrosAgregado.filter(x => x.idFiltro != element.idFiltro);
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
  ModalPrgressBar(cant : number) {
    this.ProcentajeProgressBar = 0;
    this.loading = false;
    this.ModalProgressBar.nativeElement.click();
    let tempT: number = cant * 0.018;
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

