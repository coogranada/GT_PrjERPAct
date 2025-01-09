import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OperacionesService } from '../../../../../../Services/Maestros/operaciones.service';
import { InformeConsecutivoTituloService } from '../../../../../../Services/Configuracion/Informe-Consecutivo-Titulo.service';
import { GeneralesService } from '../../../../../../Services/Productos/generales.service';
import { DatePipe } from '@angular/common';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-informe-consecutivo-titulo',
  templateUrl: './informe-consecutivo-titulo.component.html',
  styleUrls: ['./informe-consecutivo-titulo.component.css'],
  providers: [InformeConsecutivoTituloService, OperacionesService, GeneralesService],
  standalone : false
})
export class InformeConsecutivoTituloComponent implements OnInit {
  [x: string]: any;
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public Informes: any[] = [];
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public InformeconsecutivoFrom!: FormGroup;
  public consecutivoOperacionFrom!: FormGroup;
  linkPdf : string = "";
  private CodModulo = 72;
  public Modulo = this.CodModulo;

  public resultOperaciones : any[] = [];
  public resultOperacionesFiltro  : any[] = [];
  public resultConsecutivos : any[] = [];
  public resultDocumentosConsecutivos : any[] = [];
  public resultDocumentosYProductos : any[] = [];
  public resultUsuarios : any[] = [];
  public resultOficina : any[] = [];
  public resultEstado : any[] = [];

  public  BloquearAsignar : boolean | null = false;
  public BloquearDocumentos : boolean | null = false;
  public BloquearProductos : boolean | null = false;
  public BloquearOficina : boolean | null = false;
  public BloquearUsuarios : boolean | null = false;
  public BloquearBoton : boolean | null = false;

  formulario = true;
  operacion = true;
  disponibles = true;
  btn = true;

  public Idmodulo: any;
  public Iddocumento: any;
  public Idproducto: any;
  public FechaActual: any;

  private emitEventTitulo: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private operacionesService: OperacionesService, private ConsecutivotituloService: InformeConsecutivoTituloService,private generalesService: GeneralesService, private notif: NgxToastService) {
    // const obs = fromEvent(this.el.nativeElement, 'click').pipe(
    //   map((e: any) => {
    //     this.moduleValidationService.validarLocalPermisos(this.CodModulo);
    //   })
    // );
    // obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.ValidateForm();
    this.Operaciones();
    this.OperacionesFiltro();
    this.ObtenerOficinas();
    this.ObtenerEstados();
    const FechaActual = new Date();
    this.FechaActual = new DatePipe('en-CO').transform(FechaActual, 'yyyy-MM-dd');
  }
  dataUser : any = {};
  OperacionesFiltro() {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    const arrayExample = [{
      'IdModulo': 66,
      'IdUsuario': this.dataUser.IdUsuario,
      'IdOperaciones': '',
      'IdOperacionesPerfil': '',
      'IdPerfil': this.dataUser.idPerfilUsuario
    }];
    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(
      result => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].$id === '1') result[i].ERP_tblOperacion.Descripcion = 'Anulados';
          if (result[i].$id === '4') result[i].ERP_tblOperacion.Descripcion = 'Asignados';
          if (result[i].$id === '10') result[i].ERP_tblOperacion.Descripcion = 'Confirmados';
          if (result[i].$id === '13' || result[i].$id === '7') {
            result.splice(i, 1);
            i--;
          }
          if (result[i].$id === '16') result[i].ERP_tblOperacion.Descripcion = 'Trasladados';
        }
        this.resultOperacionesFiltro = result;
        this.emitEventTitulo.emit(true);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  Operaciones() {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    const arrayExample = [{
      'IdModulo': this.CodModulo,
      'IdUsuario': this.dataUser.IdUsuario,
      'IdOperaciones': '',
      'IdOperacionesPerfil': '',
      'IdPerfil': this.dataUser.idPerfilUsuario
    }];
    this.operacionesService.OperacionesPermitidas(JSON.stringify(arrayExample[0])).subscribe(
      result => {
        this.resultOperaciones = result;
        this.emitEventTitulo.emit(true);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerUsuarios(Iddocumento : string) {
    if (Iddocumento === '5') {
      this.ConsecutivotituloService.ObtenerUsuariosTermino().subscribe(
        result => {
          this.resultUsuarios = result;
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    else if (Iddocumento === '3') {
      this.ConsecutivotituloService.ObtenerUsuariosContractual().subscribe(
        result => {
          this.resultUsuarios = result;
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    else if (Iddocumento === '1' || Iddocumento === '6') {
      this.ConsecutivotituloService.ObtenerUsuariosLibretas().subscribe(
        result => {
          this.resultUsuarios = result;
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    else if (Iddocumento === '2') {
      this.ConsecutivotituloService.ObtenerUsuariosTarjetas().subscribe(
        result => {
          this.resultUsuarios = result;
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    else if (Iddocumento === '4') {
      this.ConsecutivotituloService.ObtenerUsuariosPagare().subscribe(
        result => {
          this.resultUsuarios = result;
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    else {
      this.ConsecutivotituloService.ObtenerUsuarios().subscribe(
        result => {
          this.resultUsuarios = result;
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
  }
  ObtenerModulos() {
    this.ConsecutivotituloService.ObterneConsecutivos().subscribe(
      result => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].NombreModulo.includes('A')) result[i].NombreModulo = 'Termino';

          if (result[i].NombreModulo.includes('interno')) result[i].NombreModulo = 'Contractual';

          if (result[i].NombreModulo.includes('Disponible Interno')) result[i].NombreModulo = 'Disponibles';

          if (result[i].NombreModulo.includes('Cartera Interno')) result[i].NombreModulo = 'Cartera';
        }
        this.resultConsecutivos = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerDocumentos(IdModulo : string) {
    this.ConsecutivotituloService.ObtenerDocumentosConsecutivos(IdModulo).subscribe(
      result => {
        this.resultDocumentosConsecutivos = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerProductos(IdModulo : string) {
    this.ConsecutivotituloService.ObtenerProductosConsecutivos(IdModulo).subscribe(
      result => {
        this.resultDocumentosYProductos = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerDocumentosDisponibles(Idproducto : string) {
    this.ConsecutivotituloService.ObtenerDocumentosDisponibles(Idproducto).subscribe(
      result => {
        this.resultDocumentosConsecutivos = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerOficinas() {
    this.ConsecutivotituloService.Oficinas().subscribe(
      result => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].Valor === "3") {
            result.splice(i, 1);
          }
        }
        this.resultOficina = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }

  ObtenerEstados() {
    this.ConsecutivotituloService.ObtenerEstadoConsecutivos().subscribe(
      result => {
        result.splice(3, 1);
        this.resultEstado = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      })
  }

  ValorSeleccionadoFiltro() {
    this.generalesService.Autofocus('modulo');
  }

  ValorSeleccionado() {
    this.formulario = false;
    this.ObtenerModulos();
    this.ValorOficina();
    this.btn = false;
    this.BloquearAsignar = null;
    this.BloquearDocumentos = null;
    this.consecutivoOperacionFrom.get('btnValue')?.setValue('Generar');
    this.consecutivoOperacionFrom.get('operacion')?.reset();
    this.consecutivoOperacionFrom.get('IdModulo')?.reset();
    this.consecutivoOperacionFrom.get('IdProducto')?.reset();
    this.consecutivoOperacionFrom.get('IdDocumentos')?.reset();

    if (this.consecutivoOperacionFrom.get('Codigo')?.value === '81') {
      this.operacion = false;
      this.generalesService.Autofocus('operacionFiltro');
    } else {
      this.operacion = true;
      this.generalesService.Autofocus('modulo');
    }
  }

  ValorOficina() {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    if (this.dataUser.NumeroOficina != 3) {
      this.BloquearOficina = true;
      this.consecutivoOperacionFrom.get('IdOficina')?.setValue(this.dataUser.NumeroOficina);
    } else {
      this.BloquearOficina = null;
      this.consecutivoOperacionFrom.get('IdOficina')?.setValue("");
    }
  }

  ValorSeleccionadoModulo(Idmodulo : string) {
    this.BloquearBoton = true;
    $("#fechaInicial").val("");
    $("#fechaFinal").val("");
    this.consecutivoOperacionFrom.get('IdProducto')?.reset();

    this.ObtenerDocumentos(Idmodulo);
    if (Idmodulo === '38') {
      this.BloquearProductos = null;
      this.disponibles = false;
      this.BloquearUsuarios = null;
      this.generalesService.Autofocus('productos');
      this.ObtenerProductos(Idmodulo);
    } else {
      this.BloquearProductos = true;
      this.BloquearUsuarios = null;
      this.disponibles = true;
      this.generalesService.Autofocus('documentos');
    }
  }
  DocumentoSeleccionado(Iddocumento : string) {
    this.ObtenerUsuarios(Iddocumento);
  }
  ProductoSeleccionado(Idproducto : string) {
    this.consecutivoOperacionFrom.get('IdDocumentos')?.reset();
    this.consecutivoOperacionFrom.get('FechaFinal')?.reset();
    this.BloquearBoton = true;
    this.ObtenerDocumentosDisponibles(Idproducto);
    this.generalesService.Autofocus('documentos');
  }
  FechasSeleccionadas() {
    this.BloquearBoton = null;

    const FechaActual = new Date();
    this.FechaActual = new DatePipe('en-CO').transform(FechaActual, 'yyyy-MM-dd');
    const FechaInicial = this.consecutivoOperacionFrom.get('FechaInicial')?.value;
    const FechaFinal = this.consecutivoOperacionFrom.get('FechaFinal')?.value;
    if (this.consecutivoOperacionFrom.get('Codigo')?.value === "81") {
      if (FechaInicial > FechaFinal) {
        this.notif.onWarning('Advertencia', 'La fecha inicial es incorrecta con respecto a la fecha final.');
        this.consecutivoOperacionFrom.get('FechaInicial')?.reset();
        this.consecutivoOperacionFrom.get('FechaFinal')?.reset();
        this.generalesService.Autofocus('fechaInicial');
        this.BloquearBoton = false;
      }
    } else {
      if (FechaFinal > this.FechaActual) {
        this.notif.onWarning('Advertencia', 'La fecha de corte es incorrecta con respecto a la fecha actual.');
        this.consecutivoOperacionFrom.get('FechaFinal')?.reset();
        this.generalesService.Autofocus('fechaInicial');
        this.BloquearBoton = false;
      } else {
        let fn : string | null = new DatePipe('en-CO').transform(FechaFinal, 'yyyy,MM,dd');
        const FechaDate = new Date(fn == null ? "" : fn);
        FechaDate.setDate(1);
        let fnm : string | null =  new DatePipe('en-CO').transform(FechaFinal, 'yyyy,MM,dd');
        const FechaDateMes = new Date(fnm == null ? "" : fnm);
        FechaDateMes.setDate(1)
        FechaDateMes.setDate(FechaDateMes.getDate() - 1)
        const mesAnterior = new DatePipe('en-CO').transform(FechaDate, 'yyyy-MM-dd')
        const mesFinal = new DatePipe('en-CO').transform(FechaDateMes, 'yyyy-MM-dd')
        this.consecutivoOperacionFrom.get('MesAnterior')?.setValue(mesAnterior);
        this.consecutivoOperacionFrom.get('FechaInicial')?.setValue(mesFinal);
      }
    }
  }
  GenerarInforme() {
    this.loading = true;
    this.Informes.length = 0;

    const FechaInicial = this.consecutivoOperacionFrom.get('FechaInicial')?.value;
    const FechaFinal = this.consecutivoOperacionFrom.get('FechaFinal')?.value;
    const MesAnterior = this.consecutivoOperacionFrom.get('MesAnterior')?.value;
    this.consecutivoOperacionFrom.value.MesAnterior = MesAnterior + " 00:00:00"
    this.consecutivoOperacionFrom.value.FechaInicial = FechaInicial + " 23:00:00"
    this.consecutivoOperacionFrom.value.FechaFinal = FechaFinal + " 23:00:00"
    if (this.consecutivoOperacionFrom.value.IdUsuario === "") this.consecutivoOperacionFrom.value.IdUsuario = null;
    if (this.consecutivoOperacionFrom.value.IdOficina === "") this.consecutivoOperacionFrom.value.IdOficina = null;
    if (this.consecutivoOperacionFrom.value.IdEstado === "") this.consecutivoOperacionFrom.value.IdEstado = null;
    if (this.consecutivoOperacionFrom.value.operacion === "") this.consecutivoOperacionFrom.value.operacion = null;

    if (FechaFinal >= FechaInicial) {
      
      this.ConsecutivotituloService.GetInformeLogConsecutivos(this.consecutivoOperacionFrom.value).subscribe(
        result => {
          this.loading = false;
          this.Informes.length = 1;
          $("#modalAbrir").click();
          $("#InformeoBJECT").show();
          const pdfinBase64 = result.FileStream._buffer;
          const byteArray = new Uint8Array(
            atob(pdfinBase64)
              .split("")
              .map((char) => char.charCodeAt(0))
          );
          const newBolb = new Blob([byteArray], { type: "application/pdf" });
          this.linkPdf = URL.createObjectURL(newBolb);
          const url = window.URL.createObjectURL(newBolb);
          if( document.querySelector("object") != null)
          document.querySelector("object")!.data = url;
          document.querySelector("object")!.name = "Informes";
          document.querySelector("object")!.type = "application/pdf";
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
  }
  BuscarInforme() {
    this.loading = true;

    const FechaInicial = this.consecutivoOperacionFrom.get('FechaInicial')?.value;
    const FechaFinal = this.consecutivoOperacionFrom.get('FechaFinal')?.value;
    const MesAnterior = this.consecutivoOperacionFrom.get('MesAnterior')?.value;
    this.consecutivoOperacionFrom.value.MesAnterior = MesAnterior + " 00:00:00"
    this.consecutivoOperacionFrom.value.FechaInicial = FechaInicial + " 00:00:00"
    this.consecutivoOperacionFrom.value.FechaFinal = FechaFinal + " 23:59:59"
    if (this.consecutivoOperacionFrom.value.IdUsuario === "") this.consecutivoOperacionFrom.value.IdUsuario = null;
    if (this.consecutivoOperacionFrom.value.IdOficina === "") this.consecutivoOperacionFrom.value.IdOficina = null;
    if (this.consecutivoOperacionFrom.value.IdEstado === "") this.consecutivoOperacionFrom.value.IdEstado = null;
    if (this.consecutivoOperacionFrom.value.operacion === "") this.consecutivoOperacionFrom.value.operacion = null;

    if (FechaFinal >= FechaInicial) {
      this.ConsecutivotituloService.ObtenerInformeLogConsectivo(this.consecutivoOperacionFrom.value).subscribe(
          result => {
            if (result.length > 0) {
              this.GenerarInforme();
            } else {
              this.loading = false;
              this.notif.onWarning('Advertencia', 'No se encontraron títulos relacionados con estas fechas.');
              this.consecutivoOperacionFrom.get('FechaInicial')?.reset();
              this.consecutivoOperacionFrom.get('FechaFinal')?.reset();
              this.generalesService.Autofocus('fechaInicial');
              this.BloquearBoton = false;
            }
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          });
    }
  }

  GenerarInformeResumen() {
    this.loading = true;
    this.Informes.length = 0;

    const FechaInicial = this.consecutivoOperacionFrom.get('FechaInicial')?.value;
    const FechaFinal = this.consecutivoOperacionFrom.get('FechaFinal')?.value;
    const MesAnterior = this.consecutivoOperacionFrom.get('MesAnterior')?.value;
    this.consecutivoOperacionFrom.value.MesAnterior = MesAnterior + " 00:00:00"
    this.consecutivoOperacionFrom.value.FechaInicial = FechaInicial + " 23:00:00"
    this.consecutivoOperacionFrom.value.FechaFinal = FechaFinal + " 23:00:00"
    if (this.consecutivoOperacionFrom.value.IdUsuario === "") this.consecutivoOperacionFrom.value.IdUsuario = null;
    if (this.consecutivoOperacionFrom.value.IdOficina === "") this.consecutivoOperacionFrom.value.IdOficina = null;
    if (this.consecutivoOperacionFrom.value.IdEstado === "") this.consecutivoOperacionFrom.value.IdEstado = null;
    if (this.consecutivoOperacionFrom.value.operacion === "") this.consecutivoOperacionFrom.value.operacion = null;

    if (this.validarDatosPapeleriaControl()) {
      if (this.consecutivoOperacionFrom.get('IdModulo')?.value === "19" || this.consecutivoOperacionFrom.get('IdModulo')?.value === "20" || this.consecutivoOperacionFrom.get('IdModulo')?.value === "25") {
        this.ConsecutivotituloService.ObtenerInformeTituloTerminoNuevo(this.consecutivoOperacionFrom.value).subscribe(
          result => {
            this.loading = false;
            this.Informes.length = 1;
            $("#modalAbrir").click();
            $("#InformeoBJECT").show();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.querySelector("object")!.data = url;
            document.querySelector("object")!.name = "Informes";
            document.querySelector("object")!.type = "application/pdf";
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
      else if (this.consecutivoOperacionFrom.get('IdModulo')?.value === "38") {
        if (this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '1' || this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '6') {
          this.ConsecutivotituloService.ObtenerInformeTituloLibretasNuevo(this.consecutivoOperacionFrom.value).subscribe(
            result => {
              this.Informes.length = 1;
              $("#modalAbrir").click();
              $("#InformeoBJECT").show();
              const pdfinBase64 = result.FileStream._buffer;
              const byteArray = new Uint8Array(
                atob(pdfinBase64)
                  .split("")
                  .map((char) => char.charCodeAt(0))
              );
              const newBolb = new Blob([byteArray], { type: "application/pdf" });
              this.linkPdf = URL.createObjectURL(newBolb);
              const url = window.URL.createObjectURL(newBolb);
              document.querySelector("object")!.data = url;
              document.querySelector("object")!.name = "Informes";
              document.querySelector("object")!.type = "application/pdf";
              this.loading = false;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        }
        if (this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '2') {
          this.ConsecutivotituloService.ObtenerInformeTarjetasNuevo(this.consecutivoOperacionFrom.value).subscribe(
            result => {
              this.Informes.length = 1;
              $("#modalAbrir").click();
              $("#InformeoBJECT").show();
              const pdfinBase64 = result.FileStream._buffer;
              const byteArray = new Uint8Array(
                atob(pdfinBase64)
                  .split("")
                  .map((char) => char.charCodeAt(0))
              );
              const newBolb = new Blob([byteArray], { type: "application/pdf" });
              this.linkPdf = URL.createObjectURL(newBolb);
              const url = window.URL.createObjectURL(newBolb);
              document.querySelector("object")!.data = url;
              document.querySelector("object")!.name = "Informes";
              document.querySelector("object")!.type = "application/pdf";
              this.loading = false;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        }
      }
    } else {
      this.notif.onWarning('Advertencia', 'Debe diligenciar todos los campos.');
      this.loading = false;
    }
  }

  click() {
    if(this.consecutivoOperacionFrom.get('Codigo')?.value === "81") { this.BuscarInforme(); }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === "82") { this.GenerarInformeResumen(); }
  }

  validarDatosPapeleriaControl() {
    const form = this.consecutivoOperacionFrom.value
    const modulo = form.IdModulo
    const documentos = form.IdDocumentos
    const fechaCorte = form.FechaFinal
    const oficina = form.IdOficina
    if ((modulo && documentos && fechaCorte && oficina) && (modulo != "" && documentos != "" && fechaCorte != "" && oficina != "") ) {
      return true
    }
    return false
  }

  clickPDF() {
    const FechaInicial = this.consecutivoOperacionFrom.get('FechaInicial')?.value;
    const FechaFinal = this.consecutivoOperacionFrom.get('FechaFinal')?.value;
    const MesAnterior = this.consecutivoOperacionFrom.get('MesAnterior')?.value;
    this.consecutivoOperacionFrom.value.MesAnterior = MesAnterior + " 00:00:00"
    this.consecutivoOperacionFrom.value.FechaInicial = FechaInicial + " 00:00:00"
    this.consecutivoOperacionFrom.value.FechaFinal = FechaFinal + " 23:59:59"
    if (this.consecutivoOperacionFrom.value.IdUsuario === "") this.consecutivoOperacionFrom.value.IdUsuario = null;
    if (this.consecutivoOperacionFrom.value.IdOficina === "") this.consecutivoOperacionFrom.value.IdOficina = null;
    if (this.consecutivoOperacionFrom.value.IdEstado === "") this.consecutivoOperacionFrom.value.IdEstado = null;
    if (this.consecutivoOperacionFrom.value.operacion === "") this.consecutivoOperacionFrom.value.operacion = null;

    if(this.consecutivoOperacionFrom.get('Codigo')?.value === "81") { this.pdfInforme(); }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === "82") { this.pdfResumen() }
  }
  pdfResumen() {
    if (this.consecutivoOperacionFrom.get('IdModulo')?.value === "19" || this.consecutivoOperacionFrom.get('IdModulo')?.value === "20" || this.consecutivoOperacionFrom.get('IdModulo')?.value === "25") {
      this.ConsecutivotituloService.ObtenerInformeTituloTerminoNuevo(this.consecutivoOperacionFrom.value).subscribe(
        result => {
          const FechaActual = new Date();
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Informe_"+new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd HH:mm')+".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          this.loading = false;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
    else if (this.consecutivoOperacionFrom.get('IdModulo')?.value === "38") {
      if (this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '1' || this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '6') {
        this.ConsecutivotituloService.ObtenerInformeTituloLibretasNuevo(this.consecutivoOperacionFrom.value).subscribe(
          result => {
            const FechaActual = new Date();
            var baseg4 = result.FileStream;
            const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
            const downloadLink = document.createElement("a");
            const fileName = "Informe_"+new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd HH:mm')+".pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
            this.loading = false;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
      if (this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '2') {
        this.ConsecutivotituloService.ObtenerInformeTarjetasNuevo(this.consecutivoOperacionFrom.value).subscribe(
          result => {
            const FechaActual = new Date();
            var baseg4 = result.FileStream;
            const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
            const downloadLink = document.createElement("a");
            const fileName = "Informe_"+new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd HH:mm')+".pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
            this.loading = false;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
    }
  }
  pdfInforme() {
    this.ConsecutivotituloService.GetInformeLogConsecutivos(this.consecutivoOperacionFrom.value).subscribe(
      result => {
        const FechaActual = new Date();
        var baseg4 = result.FileStream;
        const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
        const downloadLink = document.createElement("a");
        const fileName = "Informe_"+new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd HH:mm')+".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  clickEXCEL() {
    this.loading = true;
    if(this.consecutivoOperacionFrom.get('Codigo')?.value === "81") { this.excelInforme(); }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === "82") { this.excelResumen() }
  }
  excelInforme() {
    this.ConsecutivotituloService.GenerarXlsxLogConsecutivos(
      this.consecutivoOperacionFrom.value
    ).subscribe(
      (result) => {
        const FechaActual = new Date();
        var baseg4 = result;
        const linkSource = `data:application/xlsx;base64,${baseg4}`;
        const downloadLink = document.createElement("a");
        const fileName = "Informe_" + new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd hh:mm:ss') + ".xlsx";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  excelResumen() {
    if (this.consecutivoOperacionFrom.get('IdModulo')?.value === "19" || this.consecutivoOperacionFrom.get('IdModulo')?.value === "20" || this.consecutivoOperacionFrom.get('IdModulo')?.value === "25") {
      this.ConsecutivotituloService.GenerarXlsxConsecutivoNuevos(this.consecutivoOperacionFrom.value).subscribe(
        result => {
          const FechaActual = new Date();
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Informe_" + new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd hh:mm:ss') + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          this.loading = false;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
    else if (this.consecutivoOperacionFrom.get('IdModulo')?.value === "38") {
      if (this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '1' || this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '6') {
        this.ConsecutivotituloService.GenerarXlsxLibretasNuevos(this.consecutivoOperacionFrom.value).subscribe(
          result => {
            const FechaActual = new Date();
            var baseg4 = result;
            const linkSource = `data:application/xlsx;base64,${baseg4}`;
            const downloadLink = document.createElement("a");
            const fileName = "Informe_" + new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd hh:mm:ss') + ".xlsx";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
            this.loading = false;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
      if (this.consecutivoOperacionFrom.get('IdDocumentos')?.value === '2') {
        this.ConsecutivotituloService.GenerarXlsxTarjetasNuevos(this.consecutivoOperacionFrom.value).subscribe(
          result => {
            const FechaActual = new Date();
            var baseg4 = result;
            const linkSource = `data:application/xlsx;base64,${baseg4}`;
            const downloadLink = document.createElement("a");
            const fileName = "Informe_" + new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd hh:mm:ss') + ".xlsx";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
            this.loading = false;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
    }
  }
  ClearFormConsecutivo() {
    this.BloquearAsignar = false;
    this.BloquearOficina = false;
    this.BloquearDocumentos = false;
    this.BloquearProductos = false;
    this.disponibles = true;
    this.btn = true;
    this.consecutivoOperacionFrom.reset();
  }

  LimpiarFormulario() {
    this.consecutivoOperacionFrom.reset();
    this.btn = true;
  }

  ValidateForm() {
    const Codigo = new FormControl('', [Validators.required]);
    const IdModulo = new FormControl('', [Validators.required]);
    const operacion = new FormControl('', []);
    const IdDocumentos = new FormControl('', []);
    const IdProducto = new FormControl('', []);
    const IdUsuario = new FormControl('', []);
    const FechaInicial = new FormControl('', []);
    const FechaFinal = new FormControl('', []);
    const MesAnterior = new FormControl('', []);
    const IdOficina = new FormControl('', []);
    const IdEstado = new FormControl('', []);
    const btnValue = new FormControl('', []);

    this.consecutivoOperacionFrom = new FormGroup({
      Codigo: Codigo,
      IdModulo: IdModulo,
      operacion: operacion,
      IdDocumentos: IdDocumentos,
      IdProducto: IdProducto,
      IdUsuario: IdUsuario,
      FechaInicial: FechaInicial,
      FechaFinal: FechaFinal,
      MesAnterior: MesAnterior,
      IdOficina: IdOficina,
      IdEstado: IdEstado,
      btnValue: btnValue,
    });
  }
}
