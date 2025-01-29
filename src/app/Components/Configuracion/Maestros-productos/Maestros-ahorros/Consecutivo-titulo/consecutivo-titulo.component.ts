import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConsecutivoTituloService } from '../../../../../Services/Configuracion/Consecutivo-Titulo.service';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { map, retry, delay } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { ConsecutivosLog } from '../../../../../Models/Configuracion/Maestro_productos/ConsecutivosLog.model';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-consecutivo-titulo',
  templateUrl: './consecutivo-titulo.component.html',
  styleUrls: ['./consecutivo-titulo.component.css'],
  providers: [ConsecutivoTituloService, OperacionesService, GeneralesService, ModuleValidationService],
  standalone : false
})
export class ConsecutivoTituloComponent implements OnInit {
  [x: string]: any;
  public consecutivoFrom!: FormGroup;
  public consecutivoOperacionFrom!: FormGroup;
  public log: ConsecutivosLog | any = {};
  //Guardar 1 a 1 los logs de termino/contractual por cada numero de titulo

  public resultOperaciones : any[] = [];
  public resultOficina : any[] = [];
  public resultOficinaDestino : any[] = [];
  public dataBuscar : any;
  public resultConsecutivos : any[] = [];
  public resultDocumentosConsecutivos : any;
  public resultDocumentosYProductos : any[] = [];
  public resultColillasDisponibles : any[] = [];;
  public resultEstado :any[] = []
;
  public resultMotivo : any[] = [];
  public resultTitulo : any[] = [];
  public resultTitulos : any[] = [];
  public resultRegistrarTermino : any;
  public IdModulo : number = 0;


  public Idmodulo: any;
  public Idproducto: any;
  public Iddocumento: any;
  public FechaActual: any;

  public BloquearTitulo : boolean | null = false;
  public BloquearTituloF : boolean | null = false;
  public BloquearNroRegistro : boolean | null = null;
  public BloquearAsignar : boolean | null = false;
  public BloquearUsuario = false;
  public BloquearOficina = false;
  public BloquearEstado : boolean | null = false;
  public BloquearDocumentos : boolean | null = false;
  public BloquearProductos : boolean | null = false;
  public BloquearBoton : boolean | null = false;
  public BloquearMotivo : boolean | null = false;

  btnGuardar : boolean = false;
  alertaMostrada = false;
  operacionEscogida = '';
  UsuarioYFechaReasignar = true;
  UsuarioYFechaAsignar = true;
  UsuarioYFechaConfirma = true;
  formAsignar = true;
  formBuscar = true;
  formAnular = true;
  formRango = true;
  disponibles = true;
  buscarDisponible = true;
  anularDisponible = true;
  anularLibretas = true;
  anularTarjetas = true;
  usuario = true;
  motivoAnnulacion = true;
  registrarEntrada = true;
  oficinaEstado = true;
  motivo = false;
  saltoDeLinea = false;
  btn = true;
  mensajeMostradoLibretas = false;
  mensajeConfirmarMostrado = false
  libretasAsignarFinal = false;
  NroLibretasngM = "";
  libretaHTML = document.querySelector("#libretas");
  dataUser : any = {};
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  private emitEventTitulo: EventEmitter<boolean> = new EventEmitter<boolean>();

  private CodModulo = 66;
  public Modulo = this.CodModulo;
  constructor(private ConsecutivotituloService: ConsecutivoTituloService,
    private notif: NgxToastService,
    private operacionesService: OperacionesService,
    private generalesService: GeneralesService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ValidateForm();
    this.Operaciones();
    this.ObtenerOficinas();
    this.ObtenerEstados();
    const FechaActual = new Date();
    this.FechaActual = new DatePipe('en-CO').transform(FechaActual, 'yyyy-MM-dd');
}

  CambiarColor(fil : string, producto : number) {
    if (producto === 1) {

      $(".filExe" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filExe" + fil).css("background", "#e5e5e5");
      $(".strCuentaExe" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".strCuentaExe" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
      // limpia sombreado anterior

      this.ColorAnterior2 = null;
      this.ColorAnterior3 = null;
      this.ColorAnterior4 = null;
      this.ColorAnterior5 = null;
    }
  }
  public ColorAnterior: any;
  public ColorAnterior2: any;
  public ColorAnterior3: any;
  public ColorAnterior4: any;
  public ColorAnterior5: any;
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
    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(result => {
        this.resultOperaciones = result;
        this.emitEventTitulo.emit(true);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  RegistrarLog() {
    this.ConsecutivotituloService.RegistrarLog(this.log).pipe(retry(2),delay(1000)).subscribe(result => { },
      error => {
        console.log(error)
      });
  }
  ObtenerModulos() {
    this.ConsecutivotituloService.ObterneConsecutivos().subscribe(result => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].NombreModulo.includes('A')) result[i].NombreModulo = 'Termino';
          if (result[i].NombreModulo.includes('interno')) result[i].NombreModulo = 'Contractual';
          if (result[i].NombreModulo.includes('Disponible Interno')) result[i].NombreModulo = 'Disponibles';
        }
        if (this.consecutivoOperacionFrom.get('Codigo')?.value === '78') {
          for (let i = 0; i < result.length; i++) {
            if (result[i].NombreModulo.includes('Contractual')) result.splice(i, 1);
            if (result[i].NombreModulo.includes('Créditos')) result.splice(i, 1);
          }
        }
        this.resultConsecutivos = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerDocumentos(IdModulo : string) {
    this.ConsecutivotituloService.ObtenerDocumentosConsecutivos(IdModulo).subscribe(result => {
        this.resultDocumentosConsecutivos = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerProductos(IdModulo : string) {
    this.ConsecutivotituloService.ObtenerProductosConsecutivos(IdModulo).subscribe( result => {
        this.resultDocumentosYProductos = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerDocumentosDisponibles(Idproducto : string) {
    this.resultDocumentosConsecutivos = [];
    this.ConsecutivotituloService.ObtenerDocumentosDisponibles(Idproducto).subscribe(result => {
        this.resultDocumentosConsecutivos = result;
        this.ObtenerColillasDisponibles(Idproducto);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerColillasDisponibles(Idproducto : string) {
    this.resultColillasDisponibles = [];
    this.ConsecutivotituloService.ObtenerColillasDisponibles(Idproducto).subscribe(result => {
        this.resultColillasDisponibles = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerEstados() {
    this.ConsecutivotituloService.ObtenerEstadoConsecutivos().subscribe(result => {
        this.resultEstado = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerMotivosAnulacion() {
    this.ConsecutivotituloService.ObtenerMotivoAnulacionConsecutivos().subscribe(result => {
        this.resultMotivo = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      })
  }
  ValidacionesGeneralesLenght(motivo=true) {
    this.BloquearBoton = false;
    this.BloquearMotivo = true;
    this.resultOficinaDestino = [];
    this.motivoAnnulacion = true;
    this.consecutivoFrom.get('IdMotivo')?.setValue('0');
    this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
    this.consecutivoFrom.get('NroTituloInicial')?.reset();
    this.consecutivoFrom.get('NroTituloFinal')?.reset();
    this.consecutivoFrom.get('IdOficinaDestino')?.reset();
    this.generalesService.Autofocus('tituloinicial');
    if (motivo) {
      this.motivo = false;
    }
    if (this.Iddocumento === '2') {
      this.notif.onWarning('Advertencia', 'La tarjeta no se encuentra asignada.');
    } else {
      if (!this.mensajeMostradoLibretas) {
        this.notif.onWarning('Advertencia', 'El registro no se encuentra asignado.');
        if(this.consecutivoOperacionFrom.get("Codigo")?.value == '76') {
          this.consecutivoFrom.get('NroRegistro')?.reset();         
        }
        this.mensajeMostradoLibretas = true;
      }
    }
  }
  ObtenerInfoTitulo(IntNroTitulo : string = "", Producto : number = 0) {
    this.mensajeMostradoLibretas = false;
    this.mensajeConfirmarMostrado = false;
    if (IntNroTitulo === undefined || IntNroTitulo === null || IntNroTitulo === "") {
      IntNroTitulo = this.consecutivoFrom.get('NroRegistro')?.value;
      this.BloquearBoton = false;
      this.BloquearMotivo = true;
      this.motivo = false;
    }
    if (this.IdModulo === 19) {
      this.ConsecutivotituloService.ObtenerNroTituloTermino(IntNroTitulo).subscribe(
        result => {
          this.resultTitulo = result;
          console.log(result);
          if (result.length === 0) {
            this.ValidacionesGeneralesLenght();
          }else
          if (this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuariosAnular();
          }else
          if (!this.UsuarioYFechaReasignar && !this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuarioConfirma();
          }else
          if (!this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuarioReasigna();
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    else if (this.IdModulo === 20) {
      this.ConsecutivotituloService.ObtenerNroTituloConsecutivos(IntNroTitulo).subscribe(
        result => {
          this.resultTitulo = result;
          if (result.length === 0) {
            this.ValidacionesGeneralesLenght();
          } else
          if (this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuariosAnular();
          }else
          if (!this.UsuarioYFechaReasignar && !this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuarioConfirma();
          }else
          if (!this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuarioReasigna();
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    else if (this.IdModulo === 38) {
      if (this.Iddocumento === "1" || this.Iddocumento === "6") {
        let libretas = parseInt(this.consecutivoFrom.get('NroLibretas')?.value);
        const colillas = parseInt(this.consecutivoFrom.get('NroColillas')?.value);
        isNaN(libretas) ? libretas = 0 : libretas = libretas;
        for (let index = 0; index < libretas; index++) {
          this.ConsecutivotituloService.ObtenerNroLibretaDisponible(Number(IntNroTitulo), Producto).subscribe(result => {
              this.resultTitulo = result;
              if (result.length === 0) {
                this.ValidacionesGeneralesLenght(false);
                index = libretas + 1;
              } else
              if (this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
                this.MapearDatosUsuariosAnular();
              } else
              if (!this.UsuarioYFechaReasignar && !this.UsuarioYFechaConfirma) {
                this.MapearDatosUsuarioConfirma();
              } else
              if (!this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
                this.MapearDatosUsuarioReasigna();
              }
            },
            error => {
              const errorMessage = <any>error;
              console.log(errorMessage);
            });
          IntNroTitulo += colillas + 1;
        }
      }
      else if (this.Iddocumento === '2') {
        this.ConsecutivotituloService.ObtenerNroTarjetasDisponible(IntNroTitulo).subscribe(
          result => {
            this.resultTitulo = result;
            if (result.length === 0) {
              this.ValidacionesGeneralesLenght();
            } else {
              if (this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
                this.MapearDatosUsuariosAnular();
              }else
              if (!this.UsuarioYFechaReasignar && !this.UsuarioYFechaConfirma) {
                this.MapearDatosUsuarioConfirma();
              } else
              if (!this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
                this.MapearDatosUsuarioReasigna();
              }
            }
          },
          error => {
            const errorMessage = <any>error;
            console.log(errorMessage);
          });
      }
      this.alertaMostrada = false;
    }
    else if (this.IdModulo === 25) {
      this.ConsecutivotituloService.ObtenerNroTituloPagare(IntNroTitulo).subscribe(
        result => {
          this.resultTitulo = result;
          if (result.length === 0) {
            this.ValidacionesGeneralesLenght();
          }
          if (this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuariosAnular();
          }
          if (!this.UsuarioYFechaReasignar && !this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuarioConfirma();
          }
          if (!this.UsuarioYFechaReasignar && this.UsuarioYFechaConfirma) {
            this.MapearDatosUsuarioReasigna();
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    }
    if((this.consecutivoOperacionFrom.get('Codigo')?.value === '76'))this.BloquearBoton = true;
    this.btn = false;
  }
  MotivoSeleccionado() {
    this.BloquearBoton = null;
    const Idmotivo = parseInt(this.consecutivoFrom.get('IdMotivo')?.value);
    this.validarCamposAnulado();
    if (Idmotivo === 2) {
      this.motivoAnnulacion = false;
      this.BloquearBoton = true;
      this.generalesService.Autofocus('motivo');
    } else {
      this.motivoAnnulacion = true;
      this.BloquearBoton = null;
    }
  }
  validarCamposAnulado() {
    const campos = this.consecutivoFrom.value;
    console.log(campos)
    if (campos.IdDocumentos == null) return null;
    else return;  
  }
  OfinicaDestinoSeleccionada() {
    this.btn = false;
    this.BloquearBoton = null;
  }
  DocumentoSeleccionado(Iddocumento : string) {
    this.formBuscar = true;
    this.BloquearMotivo = true;
    this.BloquearTitulo = null;
    this.BloquearTituloF = null;
    $("#libretasFin").val('');
    this.BloquearNroRegistro = null;
    this.motivo = false;
    this.motivoAnnulacion = true;
    this.consecutivoFrom.get('IdMotivo')?.setValue('0');
    this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
    this.btn = false;
    this.resultOficinaDestino = [];
    this.BloquearBoton = true;
    this.mensajeConfirmarMostrado = false;
    this.mensajeMostradoLibretas = false;
    if (this.consecutivoOperacionFrom.get('Codigo')?.value !== '78') {
      if (this.consecutivoOperacionFrom.get('Codigo')?.value !== '76') {
        if ((Iddocumento === "1" || Iddocumento === "6") && this.Idmodulo === '38') {
          this.disponibles = false;
          this.anularDisponible = true;
          this.saltoDeLinea = true;
        } else if ((Iddocumento === "2") && this.Idmodulo === '38') {
          this.disponibles = true;
          this.anularDisponible = false;
          this.saltoDeLinea = false;
        }
      } else {
        if ((Iddocumento === "1" || Iddocumento === "6") && this.Idmodulo === '38') {
          this.anularLibretas = false;
          this.motivo = true;
          this.anularTarjetas = true;
          this.BloquearTituloF = true;
        } else if ((Iddocumento === "2") && this.Idmodulo === '38') {
          this.anularLibretas = true;
          this.motivo = false;
          this.anularTarjetas = false;
        }
        else {
          this.motivo = false;
        }
      }
    }
    else {
      this.generalesService.Autofocus('fechaInicial');
    }
    if (this.consecutivoOperacionFrom.get('Codigo')?.value == '45') {
      if ((Iddocumento === "1" || Iddocumento === "6")) {
        this.libretasAsignarFinal = true;
      } else if (Iddocumento === "2") {
        this.libretasAsignarFinal = false;
      }
    }
  }
  ProductoSeleccionado(Idproducto : string) {
    this.btn = false;
    this.BloquearBoton = true;
    this.formBuscar = true;
    $("#libretasFin").val('');
    this.resultOficinaDestino = [];
    this.ObtenerDocumentosDisponibles(Idproducto);
    this.consecutivoFrom.get('NroTituloInicial')?.reset();
    this.consecutivoFrom.get('NroTituloFinal')?.reset();
    this.generalesService.Autofocus('documentos');
    this.mensajeConfirmarMostrado = false;
    this.mensajeMostradoLibretas = false;
  }
  ValorSeleccionadoModulo(Idmodulo : string) {
    this.ClearSelects(true);
    this.formBuscar = true;
    this.BloquearMotivo = true;
    this.motivo = false;
    this.motivoAnnulacion = true;
    this.ResetValues();
    this.consecutivoFrom.get('IdProducto')?.reset();
    this.consecutivoFrom.get('IdDocumentos')?.reset();
    this.IdModulo = parseInt(Idmodulo);
    this.libretasAsignarFinal = false;
    this.btn = false;
    this.BloquearBoton = true;
    this.buscarDisponible = true;
    this.resultOficinaDestino = [];
    this.mensajeConfirmarMostrado = false;
    this.mensajeMostradoLibretas = false;
    if (this.consecutivoOperacionFrom.get('Codigo')?.value === '45' && Idmodulo === '38') {
      this.BloquearProductos = null;
      this.disponibles = false;
      this.anularDisponible = true;
      this.buscarDisponible = true;
      this.saltoDeLinea = false;
      this.generalesService.Autofocus('productos');
      this.ObtenerProductos(Idmodulo);
      this.libretasAsignarFinal = true;
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '76' && Idmodulo === '38') {
      this.BloquearProductos = null;
      this.disponibles = true;
      this.libretasAsignarFinal = false;
      this.anularDisponible = false;
      this.saltoDeLinea = false;
      this.generalesService.Autofocus('productos');
      this.ObtenerProductos(Idmodulo);
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '46' && Idmodulo === '38') {
      this.BloquearProductos = null;
      this.disponibles = false;
      this.anularDisponible = true;
      this.libretasAsignarFinal = false;
      this.saltoDeLinea = true;
      this.generalesService.Autofocus('productos');
      this.ObtenerProductos(Idmodulo);
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '77' && Idmodulo === '38') {
      this.BloquearProductos = null;
      this.libretasAsignarFinal = false;
      this.disponibles = false;
      this.anularDisponible = true;
      this.saltoDeLinea = true;
      this.generalesService.Autofocus('productos');
      this.ObtenerProductos(Idmodulo);
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '78' && Idmodulo === '38') {
      this.libretasAsignarFinal = false;
      this.BloquearProductos = null;
      this.disponibles = true;
      this.anularDisponible = false;
      this.saltoDeLinea = false;
      this.MapearDatosUsuarioRegistra();
      this.generalesService.Autofocus('productos');
      this.ObtenerProductos(Idmodulo);
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '2' && Idmodulo === '38') {
      this.libretasAsignarFinal = false;
      this.BloquearProductos = null;
      this.buscarDisponible = false;
      this.disponibles = false;
      this.anularDisponible = true;
      this.saltoDeLinea = false;
      this.generalesService.Autofocus('productos');
      this.ObtenerProductos(Idmodulo);
    }
    else {
      this.MapearDatosUsuarioRegistra();
      this.ObtenerDocumentos(Idmodulo);
      this.BloquearProductos = false;
      this.libretasAsignarFinal = false;
      this.disponibles = true;
      this.anularDisponible = true;
      this.buscarDisponible = false;
      this.anularLibretas = true;
      this.anularTarjetas = true;
      this.saltoDeLinea = false;
      this.generalesService.Autofocus('documentos');
    }
  }
  FechasSeleccionadas() {
    const FechaInicial = this.consecutivoFrom.get('FechaInicial')?.value;
    const FechaFinal = this.consecutivoFrom.get('FechaFinal')?.value;
    let data : string | null = localStorage.getItem('Data')
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    const idOficina = this.dataUser.NumeroOficina;
    const idProducto = this.consecutivoFrom.get('IdProducto')?.value;
    if (FechaInicial <= FechaFinal) {
      if (this.IdModulo === 38) {
        if (this.Iddocumento === '1' || this.Iddocumento === '6') {
          this.ConsecutivotituloService.ObtenerLibretasRegistrar(FechaInicial, FechaFinal, idOficina, idProducto).subscribe(
            result => {
              if (result.length > 0) {
                this.resultRegistrarTermino = result;
                this.BloquearBoton = null;
                this.btn = false;
              } else {
                this.BloquearBoton = false;
                this.notif.onWarning('Advertencia', 'La fecha es incorrecta.');
                this.consecutivoFrom.get('FechaInicial')?.reset();
                this.consecutivoFrom.get('FechaFinal')?.reset();
                this.generalesService.Autofocus('fechaInicial');
              }
            },
            error => {
              const errorMessage = <any>error;
              console.log(errorMessage);
            })
        }
        else if (this.Iddocumento === '2') {
          this.ConsecutivotituloService.ObtenerTarjetasRegistrar(FechaInicial, FechaFinal, idOficina).subscribe(
            result => {
              if (result.length > 0) {
                this.resultRegistrarTermino = result;
                this.BloquearBoton = null;
                this.btn = false;
              } else {
                this.BloquearBoton = false;
                this.notif.onWarning('Advertencia', 'La fecha es incorrecta.');
                this.consecutivoFrom.get('FechaInicial')?.reset();
                this.consecutivoFrom.get('FechaFinal')?.reset();
                this.generalesService.Autofocus('fechaInicial');
              }
            },
            error => {
              const errorMessage = <any>error;
              console.log(errorMessage);
            })
        }
      } else if (this.IdModulo === 19) {
        this.ConsecutivotituloService.ObtenerTitulosTerminoRegistrar(FechaInicial, FechaFinal, idOficina).subscribe(
          result => {
            if (result.length > 0) {
              this.resultRegistrarTermino = result;
              this.BloquearBoton = null;
              this.btn = false;
            } else {
              this.BloquearBoton = false;
              this.notif.onWarning('Advertencia', 'La fecha es incorrecta.');
              this.consecutivoFrom.get('FechaInicial')?.reset();
              this.consecutivoFrom.get('FechaFinal')?.reset();
              this.generalesService.Autofocus('fechaInicial');
            }
          },
          error => {
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        )
      }
    } else {
      this.BloquearBoton = false;
      this.notif.onWarning('Advertencia', 'La fecha inicial es incorrecta con respecto a la fecha final.');
      this.consecutivoFrom.get('FechaInicial')?.reset();
      this.consecutivoFrom.get('FechaFinal')?.reset();
      this.generalesService.Autofocus('fechaInicial');
    }
  }
  ValidarMotivo() {
    if (this.consecutivoFrom.get('DescripcionMotivo')?.value.length > 0) {
      this.BloquearBoton = null;
    } else {
      this.BloquearBoton = true;
    }
  }
  ValidarOficina(mensaje : string) {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    if (this.dataUser.NumeroOficina == "3") {
      this.BloquearBoton = false;
      this.notif.onWarning('Advertencia', `No se puede ${mensaje} en la oficina administración.`);
      return false;
    }
    return true;
  }
  ValorSeleccionadoGenerales() {
    this.generalesService.Autofocus('modulo');
    this.ObtenerModulos();
    this.LimpiarFormulario();
    this.formAsignar = false;
    this.formBuscar = true;
    this.disponibles = true;
    this.anularDisponible = true;
    this.motivoAnnulacion = true;
    this.motivo = false;
    $("#libretasFin").val('');
    this.saltoDeLinea = false;
    this.BloquearTitulo = true;
    this.BloquearTituloF = true;
    this.consecutivoFrom.get('IdMotivo')?.reset();
    this.consecutivoFrom.get('DescripcionMotivo')?.reset();
  }
  ValorSeleccionado() {
    this.ClearFormConsecutivo(true);
    this.formAsignar = true;
    this.btn = false;
    this.BloquearBoton = true;
    this.mensajeConfirmarMostrado = false;
    this.mensajeMostradoLibretas = false;
    if (this.consecutivoOperacionFrom.get('Codigo')?.value === '45') { // Asignar titulo
      var ofi = this.ValidarOficina("asignar títulos");
      if (ofi) {
        this.ValorSeleccionadoGenerales();
        this.BloquearOficina = true;
        this.BloquearEstado = true;
        this.BloquearDocumentos = null;
        this.BloquearAsignar = null;
        this.UsuarioYFechaAsignar = false;
        this.UsuarioYFechaReasignar = true;
        this.UsuarioYFechaConfirma = true;
        this.formRango = false;
        this.formAnular = true;
        this.usuario = false;
        this.registrarEntrada = true;
        this.oficinaEstado = false;
        this.consecutivoFrom.get('btnValue')?.setValue('Guardar');
        this.MapearDatosUsuarioAsigna();
      }
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '46') { // Reasignar titulo
      var ofi = this.ValidarOficina("trasladar títulos");
      if (ofi) {
        this.ValorSeleccionadoGenerales();
        this.BloquearOficina = false;
        this.BloquearEstado = null;
        this.BloquearDocumentos = null;
        this.BloquearAsignar = null;
        this.UsuarioYFechaAsignar = true;
        this.UsuarioYFechaReasignar = false;
        this.UsuarioYFechaConfirma = true;
        this.formRango = false;
        this.formAnular = true;
        this.registrarEntrada = true;
        this.oficinaEstado = true;
        this.consecutivoFrom.get('btnValue')?.setValue('Actualizar');
      }
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '76') {   //Anular resgistro
      var ofi = this.ValidarOficina("anular títulos");
      if (ofi) {
        this.ValorSeleccionadoGenerales();
        this.ObtenerMotivosAnulacion();
        this.BloquearAsignar = null;
        this.BloquearDocumentos = false;
        this.BloquearOficina = false;
        this.BloquearEstado = false;
        this.UsuarioYFechaAsignar = true;
        this.UsuarioYFechaReasignar = true;
        this.UsuarioYFechaConfirma = true;
        this.formRango = true;
        this.BloquearNroRegistro = true;
        this.formAnular = false;
        this.usuario = true;
        this.registrarEntrada = true;
        this.oficinaEstado = true;
        this.consecutivoFrom.get('btnValue')?.setValue('Anular');
      }
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '77') {  //Confirmar Traslado
      var ofi = this.ValidarOficina("confirmar títulos");
      if (ofi) {
        this.ValorSeleccionadoGenerales();
        this.BloquearOficina = true;
        this.BloquearEstado = true;
        this.BloquearDocumentos = null;
        this.BloquearAsignar = null;
        this.btnGuardar = false;
        this.UsuarioYFechaAsignar = true;
        this.UsuarioYFechaReasignar = false;
        this.UsuarioYFechaConfirma = false;
        this.formRango = false;
        this.formAnular = true;
        this.usuario = false;
        this.registrarEntrada = true;
        this.oficinaEstado = true;
        this.consecutivoFrom.get('btnValue')?.setValue('Confirmar');
      }
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '78') { //Registrar Entregas
      var ofi = this.ValidarOficina("registrar entregas");
      if (ofi) {
        this.ValorSeleccionadoGenerales();
        this.formRango = true;
        this.formAnular = true;
        this.UsuarioYFechaConfirma = true;
        this.UsuarioYFechaReasignar = true;
        this.UsuarioYFechaAsignar = true;
        this.BloquearProductos = false;
        this.BloquearAsignar = null;
        this.registrarEntrada = false;
        this.oficinaEstado = true;
        this.MapearDatosUsuarioRegistra();
        this.consecutivoFrom.get('btnValue')?.setValue('Registrar');
      }
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '2') {  //Buscar
      this.ValorSeleccionadoGenerales();
      this.BloquearOficina = true;
      this.BloquearEstado = true;
      this.BloquearDocumentos = null;
      this.BloquearAsignar = null;
      this.UsuarioYFechaAsignar = false;
      this.UsuarioYFechaReasignar = true;
      this.UsuarioYFechaConfirma = true;
      this.formRango = false;
      this.formAnular = true;
      this.usuario = false;
      this.registrarEntrada = true;
      this.oficinaEstado = false;
      this.consecutivoFrom.get('btnValue')?.setValue('Buscar');
    }
  }
  MapearDatosUsuarioRegistra() {
    const FechaActual = new Date();
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.consecutivoFrom.get('Asigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('IdOficina')?.setValue(this.dataUser.NumeroOficina);
    this.consecutivoFrom.get('IdUsuarioAsigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('IdEstado')?.setValue(45);
    this.consecutivoFrom.get('FechaInicial')?.setValue(new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd'));
    this.consecutivoFrom.get('FechaFinal')?.setValue(new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd'));
  }
  MapearDatosUsuariosAnular() {
    const FechaActual = new Date();
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.consecutivoFrom.get('Asigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('IdOficina')?.setValue(this.dataUser.NumeroOficina);
    this.consecutivoFrom.get('IdEstado')?.setValue(this.resultTitulo[0].IdEstado);
    this.consecutivoFrom.get('IdUsuarioAsigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('FechaAsignacion')?.setValue(new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd HH:mm'));
    this.AnularConsecutivo();
  }
  MapearDatosUsuarioAsigna() {
    const FechaActual = new Date();
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.consecutivoFrom.get('Asigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('IdOficina')?.setValue(this.dataUser.NumeroOficina);
    this.consecutivoFrom.get('IdEstado')?.setValue('45');
    this.consecutivoFrom.get('IdUsuarioAsigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('FechaAsignacion')?.setValue(new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd HH:mm'));
  }
  MapearDatosUsuarioReasigna() {
    const FechaActual = new Date();
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.consecutivoFrom.get('IdOficina')?.setValue(this.dataUser.NumeroOficina);
    this.consecutivoFrom.get('Reasigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('IdUsuarioReasigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('FechaReasignacion')?.setValue(new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd HH:mm'));
    this.generalesService.Autofocus('oficinaDestino');
    this.ObtenerInfotitulos(1);
  }
  MapearDatosUsuarioConfirma() {
    const FechaActual = new Date();
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.consecutivoFrom.get('IdOficina')?.setValue(this.dataUser.NumeroOficina);
    this.consecutivoFrom.get('IdEstado')?.setValue(this.resultTitulo[0].IdEstado);
    this.consecutivoFrom.get('Reasigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('IdUsuarioReasigna')?.setValue(this.dataUser.IdUsuario);
    this.consecutivoFrom.get('FechaReasignacion')?.setValue(new DatePipe('en-CO').transform(FechaActual, 'yyyy/MM/dd HH:mm'));
    this.BloquearBoton = null;
    this.ObtenerInfotitulos(2);
  }
  ObtenerOficinas() {
    this.ConsecutivotituloService.Oficinas().subscribe(
      result => {
        this.resultOficina = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  ObtenerOficinasDestino() {
    this.resultOficinaDestino = [];
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    let oficinaActual = parseInt(this.dataUser.NumeroOficina);

    for (let i = 0; i < this.resultOficina.length; i++) {
      if (oficinaActual != this.resultOficina[i].Valor) {
        this.resultOficinaDestino.push(this.resultOficina[i]);
      }
    }

    for (let i = 0; i < this.resultOficinaDestino.length; i++) {
      if (parseInt(this.resultOficinaDestino[i].Valor) === oficinaActual || parseInt(this.resultOficinaDestino[i].Valor) === 3) {
        this.resultOficinaDestino.splice(i, 1);
      }
    }
    this.consecutivoFrom.controls["IdOficinaDestino"].enable();
  }
  ClearSelects(modulo=false) {
    if(!modulo){ this.resultConsecutivos = []} //modulo
    this.BloquearTitulo = true;
    this.BloquearTituloF = true;
    this.BloquearNroRegistro = true;
    this.resultDocumentosYProductos = [] //productos
    this.resultDocumentosConsecutivos = [] //Documentos
    this.resultColillasDisponibles = [] //cantColillas
  }
  ClearFormConsecutivo(operacion=false) {
    this.ClearSelects();
    if (!operacion) {
      this.operacionEscogida = '';
      this.consecutivoOperacionFrom.reset();
    }
    this.consecutivoFrom.reset();
    this.resultDocumentosConsecutivos = null;
    this.BloquearAsignar = false;
    this.BloquearUsuario = false;
    this.BloquearOficina = false;
    this.BloquearEstado = false;
    this.BloquearDocumentos = false;
    this.BloquearProductos = false;
    this.UsuarioYFechaReasignar = true;
    this.UsuarioYFechaAsignar = true;
    this.UsuarioYFechaConfirma = true;
    this.formAsignar = true;
    this.formAnular = true;
    this.formRango = true;
    this.formBuscar = true;
    this.disponibles = true;
    this.buscarDisponible = true;
    this.usuario = true;
    this.btn = true;
  }
  LimpiarFormulario() {
    this.consecutivoFrom.reset();
    $("#libretasFin").val('');
    this.btnGuardar = true;
  }
  ResetValues() {
    this.consecutivoFrom.get('NroTituloInicial')?.reset();
    this.consecutivoFrom.get('NroTituloFinal')?.reset();
    this.consecutivoFrom.get('NroRegistro')?.reset();
    this.consecutivoFrom.get('NroLibretas')?.reset();
    this.consecutivoFrom.get('NroColillas')?.reset();
    this.consecutivoFrom.get('IdOficinaDestino')?.reset();
    this.consecutivoFrom.get('IdMotivo')?.reset();
    this.consecutivoFrom.get('DescripcionMotivo')?.reset();
    this.consecutivoFrom.get('FechaInicial')?.reset();
    this.consecutivoFrom.get('FechaFinal')?.reset();
  }
  GuardarConsecutivo() {
    var NroTituloInicial = this.consecutivoFrom.get('NroTituloInicial')?.value;
    var NroTituloFinal = this.consecutivoFrom.get('NroTituloFinal')?.value;

    if (NroTituloFinal >= NroTituloInicial) {
      if (this.dataUser.NumeroOficina === this.consecutivoFrom.get('IdOficina')?.value) {
        if (this.IdModulo === 19) {
          this.loading = true;
          this.ConsecutivotituloService.GuardarRangoTituloTermino(this.consecutivoFrom.value).subscribe(
            result => {
              this.loading = false;
              this.RegistrarLog();
              this.BloquearAsignar = false;
              this.BloquearTitulo = false;
              this.BloquearTituloF = false;
              this.BloquearUsuario = false;
              this.BloquearOficina = false;
              this.notif.onSuccess('Exitoso', 'El rango se guardó correctamente.');
              this.consecutivoOperacionFrom.get('Codigo')?.reset();
              this.formAsignar = true;
              this.formRango = true;
              this.formAnular = true;
              this.ClearSelects();
              this.btn = true;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        }

        if (this.IdModulo === 20) {
          this.loading = true;
          this.ConsecutivotituloService.GuardarConsecutivoTitulo(this.consecutivoFrom.value).subscribe(
            result => {
              this.loading = false;
              this.RegistrarLog();
              this.BloquearAsignar = false;
              this.BloquearTitulo = false;
              this.BloquearTituloF = false;
              this.BloquearUsuario = false;
              this.BloquearOficina = false;
              this.notif.onSuccess('Exitoso', 'El rango se guardó correctamente.');
              this.consecutivoOperacionFrom.get('Codigo')?.reset();
              this.formAsignar = true;
              this.formRango = true;
              this.formAnular = true;
              this.ClearFormConsecutivo();
              this.btn = true;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        }

        if (this.IdModulo === 38) {
          if (this.Iddocumento === '1' || this.Iddocumento === '6') {
            this.loading = true;
            this.ConsecutivotituloService.GuardarDisponibles(this.consecutivoFrom.value).subscribe(
              result => {
                this.loading = false;
                let libretas = parseInt(this.consecutivoFrom.get("NroLibretas")?.value)
                let colillas = parseInt(this.consecutivoFrom.get("NroColillas")?.value)

                this.log.Colillas = colillas;
                this.log.Libretas = libretas;
                this.RegistrarLog();
                this.BloquearAsignar = false;
                this.BloquearTitulo = false;
                this.BloquearTituloF = false;
                this.BloquearUsuario = false;
                this.BloquearOficina = false;
                this.notif.onSuccess('Exitoso', 'El rango se guardó correctamente.');
                this.consecutivoOperacionFrom.get('Codigo')?.reset();
                this.formAsignar = true;
                this.formRango = true;
                this.formAnular = true;
                this.ClearFormConsecutivo();
                this.btn = true;
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              }
            );
          }
          if (this.Iddocumento === '2') {
            this.loading = true;
            this.ConsecutivotituloService.GuardarTarjetasDisponibles(this.consecutivoFrom.value).subscribe(
              result => {
                this.loading = false;
                this.RegistrarLog();
                this.BloquearAsignar = false;
                this.BloquearTitulo = false;
                this.BloquearTituloF = false;
                this.BloquearUsuario = false;
                this.BloquearOficina = false;
                this.notif.onSuccess('Exitoso', 'El rango se guardó correctamente.');
                this.consecutivoOperacionFrom.get('Codigo')?.reset();
                this.formAsignar = true;
                this.formRango = true;
                this.formAnular = true;
                this.ClearFormConsecutivo();
                this.btn = true;
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              });
          }
        }

        if (this.IdModulo === 25) {
          this.loading = true;
          this.ConsecutivotituloService.GuardarPagare(this.consecutivoFrom.value).subscribe(
            result => {
              this.loading = false;
              this.RegistrarLog();
              this.BloquearAsignar = false;
              this.BloquearTitulo = false;
              this.BloquearTituloF = false;
              this.BloquearUsuario = false;
              this.BloquearOficina = false;
              this.notif.onSuccess('Exitoso', 'El rango se guardó correctamente.');
              this.consecutivoOperacionFrom.get('Codigo')?.reset();
              this.formAsignar = true;
              this.formRango = true;
              this.formAnular = true;
              this.ClearFormConsecutivo();
              this.btn = true;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            });
        }
      } else {
        this.BloquearBoton = false;
        this.notif.onWarning('Advertencia', 'La Oficina es incorrecta..');
      }
    } else {
      this.BloquearBoton = false;
      this.notif.onWarning('Advertencia', 'El Nro títulos final es incorrecto con respecto a al Nro título inicial');
      this.generalesService.Autofocus('tituloFinal');
    }
  }
  isNumber(value: any) {
    return typeof value === 'number' && !isNaN(value);
  }
  cambioLibretas(event : any) {
    let codigo = parseInt(this.consecutivoOperacionFrom.get('Codigo')?.value);

    if (this.isNumber(event.key) || event.keyCode == 8) {
      if (codigo == 45) {//asignar rango
        if (this.NroLibretasngM == "") {
          this.BloquearBoton = true;
        } else if (parseInt(this.NroLibretasngM) > 100 ) {
          this.BloquearBoton = true;
        }
      } else if (codigo == 46) {//reasignar rango
        this.consecutivoFrom.get('IdOficinaDestino')?.reset();
        this.BloquearBoton = true;
      }
    }
    if (codigo == 45 && this.NroLibretasngM != "") {//asignar rango
      if (parseInt(this.NroLibretasngM) > 100 ) {
        this.BloquearBoton = true;
        this.notif.onWarning('Advertencia', 'El tope máximo de asignación es 100.');
        this.NroLibretasngM = this.NroLibretasngM.substring(0, this.NroLibretasngM.length - 1);  
      }
    }
  }
  cambioRangoFinal(event : any) {
    let codigo = parseInt(this.consecutivoOperacionFrom.get('Codigo')?.value);
    if (this.isNumber(event.key) || event.keyCode == 8) {
      if (codigo == 46 || codigo == 77) {//reasignar
        this.consecutivoFrom.get('IdOficinaDestino')?.reset();
        this.BloquearBoton = true;
      }
    }
    if (codigo == 76) {
      this.consecutivoFrom.get('IdMotivo')?.reset();
      this.consecutivoFrom.get('DescripcionMotivo')?.reset();
      this.BloquearBoton = true;
    } else if (codigo == 45) {//asignar
      this.BloquearBoton = true;
    }
  }
  calcularYAsignar() {
    const Inicial = parseInt(this.consecutivoFrom.get('NroTituloInicial')?.value);
    const Colillas = parseInt(this.consecutivoFrom.get('NroColillas')?.value);
    const Libretas = parseInt(this.consecutivoFrom.get('NroLibretas')?.value);
    this.consecutivoFrom.get('NroTituloFinal')?.setValue(Inicial + ((Colillas+1)*Libretas) - 1);
    const Final = parseInt(this.consecutivoFrom.get('NroTituloFinal')?.value);
    $("#libretasFin").val(isNaN(Final)? '' : Final);
    const Producto = parseInt(this.consecutivoFrom.get('IdProducto')?.value);
    this.mensajeConfirmarMostrado = false;
    this.mensajeMostradoLibretas = false;

    if (this.consecutivoOperacionFrom.get('Codigo')?.value !== '45') {
      this.ObtenerInfoTitulo(Inicial.toString(),Producto);
    }

    if (Final >= Inicial && Libretas <= 100) {
      if (this.Iddocumento === '1' || this.Iddocumento === '6') {
        this.ConsecutivotituloService.ObtenerInfoDisponibles(Inicial, Final, Producto).subscribe(
          result => {
            const nroInicial = result[0].INICIAL;
            const nroFinal = result[0].FINAL;
            if (nroInicial !== 0 || nroFinal !==0) {
              if (this.UsuarioYFechaReasignar) {
                this.BloquearBoton = false;
                $("#libretasFin").val('');
                this.notif.onWarning('Advertencia', 'El rango ya ha sido asignado.');
                this.consecutivoFrom.get('NroTituloInicial')?.reset();
                this.consecutivoFrom.get('NroTituloFinal')?.reset();
                this.consecutivoFrom.get('NroColillas')?.reset();
                this.consecutivoFrom.get('NroLibretas')?.reset();
                this.generalesService.Autofocus('tituloinicial');
              }
            } else {
              this.BloquearBoton = null;
            }
          },
          error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          });
      }
      if (this.Iddocumento === '2') {        
        this.ConsecutivotituloService.ObtenerInfoTarjetasDisponibles(Inicial, Final).subscribe(
          result => {
            if (result[0].Column1 !==0) {
              if (this.UsuarioYFechaReasignar) {
                this.BloquearBoton = false;
                $("#libretasFin").val('');
                this.notif.onWarning('Advertencia', 'El rango ya ha sido asignado.');
                this.consecutivoFrom.get('NroTituloInicial')?.reset();
                this.consecutivoFrom.get('NroTituloFinal')?.reset();
                this.consecutivoFrom.get('NroColillas')?.reset();
                this.consecutivoFrom.get('NroLibretas')?.reset();
                this.generalesService.Autofocus('tituloinicial');
              }
            } else {
              this.BloquearBoton = null;
            }
          },
          error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          });
      }
    }
    this.mensajeMostradoLibretas = false;
  }
  BuscarLibreta() {
    const Inicial = parseInt(this.consecutivoFrom.get('NroTituloInicial')?.value);
    const Producto = parseInt(this.consecutivoFrom.get('IdProducto')?.value);
    const Libretas = parseInt(this.consecutivoFrom.get("NroLibretas")?.value);
    if (this.consecutivoOperacionFrom.get('Codigo')?.value === '76') {
      if (this.IdModulo === 38) {
        if (this.Iddocumento === "1" || this.Iddocumento === "6") {
          this.ConsecutivotituloService.ObtenerNroLibretaDisponible(Inicial, Producto).subscribe(
            result => {
              if (result.length === 0) {
                this.BloquearBoton = true;
                this.BloquearMotivo = true;
                this.resultOficinaDestino = [];
                this.motivoAnnulacion = true;
                this.consecutivoFrom.get('IdMotivo')?.setValue('0');
                this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
                $("#libretasFin").val('');
                this.notif.onWarning('Advertencia', 'El registro no se encuentra asignado.');
                this.consecutivoFrom.get('NroTituloInicial')?.reset();
                this.consecutivoFrom.get('NroTituloFinal')?.reset();
                this.consecutivoFrom.get('IdOficinaDestino')?.reset();
                this.generalesService.Autofocus('tituloinicial');
              } else {
                this.resultTitulo = result;
                this.BloquearTituloF = true;
                this.BloquearBoton = true;
                this.consecutivoFrom.get('NroTituloFinal')?.setValue(result[0].NroFinal);
                this.MapearDatosUsuariosAnular();
              }
            },
            error => {
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          )
        }
      }
    }
    else if (this.consecutivoOperacionFrom.get('Codigo')?.value === '2' && this.IdModulo === 38) {
      if (this.Iddocumento == "1" || this.Iddocumento == "6") {
        this.BloquearBoton = null;
      }
    } else {
      this.BloquearBoton = true;
    }
  }
  CambiarRango() {
    let codigo = this.consecutivoOperacionFrom.get('Codigo')?.value ;
    if (codigo !== '76' && codigo != '2' && this.Idmodulo != 38) {
      this.BloquearBoton = true;
      this.consecutivoFrom.get('NroTituloFinal')?.reset();
    }
    if (codigo == '76' && this.Idmodulo == 38){
      this.consecutivoFrom.get('IdMotivo')?.reset();
      this.consecutivoFrom.get('DescripcionMotivo')?.reset();
      this.BloquearBoton = true;
    }
  }
  resultLength(data : any[]) {
    if (data.length <= 0) {
      this.notif.onWarning('Advertencia', 'No se encontraron registros.');
    }
  }
  listarTitulos() {
    const Inicial = parseInt(this.consecutivoFrom.get('NroTituloInicial')?.value);
    let Final = parseInt(this.consecutivoFrom.get('NroTituloFinal')?.value);
    if (isNaN(Final) && this.IdModulo ===38) {
      Final = Inicial + 30 - 1;
    }
    const Producto = parseInt(this.consecutivoFrom.get('IdProducto')?.value);
    if (Final >= Inicial) {
      this.BloquearBoton = null;
      this.btn = false;
      if (this.IdModulo === 19) {
        this.loading = true;
        this.ConsecutivotituloService.ObtenerInfoRangoTitulosTermino(Inicial, Final).subscribe(
          result => {
            this.loading = false;
            this.formBuscar = false;
            this.dataBuscar = result;
            this.resultLength(result);
          }, error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          });
      }
      if (this.IdModulo === 20) {
        this.loading = true;
        this.ConsecutivotituloService.ObtenerInfoRangoTitulosConsecutivos(Inicial, Final).subscribe(
          result => {
            this.loading = false;
            this.formBuscar = false;
            this.dataBuscar = result;
            this.resultLength(result);
          }, error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          });
      }
      if (this.IdModulo === 38) {
        if (this.Iddocumento === '1' || this.Iddocumento === '6') {
          /* const libretas = parseInt(this.consecutivoFrom.get('NroLibretas').value);
          const rangoFinal = (Final + libretas - 1); */
          this.loading = true;
          this.ConsecutivotituloService.ObtenerInfoLibretasDisponibles(Inicial, Producto).subscribe(
            result => {
              this.loading = false;
              this.formBuscar = false;
              this.dataBuscar = result;
              console.log(this.dataBuscar);
              this.resultLength(result);
            }, error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            });
        }
        else if (this.Iddocumento === '2') {
          /* const libretas = parseInt(this.consecutivoFrom.get('NroLibretas').value);
          const rangoFinal = (Final + libretas - 1); */
          this.loading = true;
          this.ConsecutivotituloService.ObtenerInfoTarjetaDisponibles(Inicial, Final).subscribe(
            result => {
              this.loading = false;
              this.formBuscar = false;
              this.dataBuscar = result;
              this.dataBuscar = result;
              this.resultLength(result);
            }, error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        }
      }
      if (this.IdModulo === 25) {
        this.loading = true;
        this.ConsecutivotituloService.ObtenerInfoRangoPagare(Inicial, Final).subscribe(
          result => {
            this.loading = false;
            this.formBuscar = false;
            this.dataBuscar = result;
            this.resultLength(result);
          }, error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
    } else {
      this.BloquearBoton = false;
      this.motivoAnnulacion = true;
      this.consecutivoFrom.get('IdMotivo')?.setValue('0');
      this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
      this.notif.onWarning('Advertencia', 'El Nro títulos final es incorrecto con respecto al Nro título inicial.');
      this.consecutivoFrom.get('NroTituloInicial')?.reset();
      this.consecutivoFrom.get('NroTituloFinal')?.reset();
      this.generalesService.Autofocus('NroTituloInicial');
    }
  }
  BuscarTitulo() {
    const Inicial = parseInt(this.consecutivoFrom.get('NroTituloInicial')?.value);
    const Final = parseInt(this.consecutivoFrom.get('NroTituloFinal')?.value);
    const Producto = parseInt(this.consecutivoFrom.get('IdProducto')?.value);
    this.consecutivoFrom.get('IdOficinaDestino')?.reset();
    this.mensajeConfirmarMostrado = false;
    this.mensajeMostradoLibretas = false;
      if (this.consecutivoOperacionFrom.get('Codigo')?.value == '2') {
        this.BloquearBoton = null;
      }
      else if (this.consecutivoOperacionFrom.get('Codigo')?.value !== '45') {
        if (Final >= Inicial) {
          this.BloquearBoton = false;
          this.ObtenerInfoTitulo(Inicial.toString(), Producto);
          this.mensajeMostradoLibretas = false;
        } else if (isNaN(Final) && isNaN(Inicial) && this.IdModulo == 38) {
          this.notif.onWarning('Advertencia', 'Rango Incorrecto.');
          this.resultOficinaDestino = [];
        }
        else {

          this.BloquearBoton = false;
          this.motivoAnnulacion = true;
          this.consecutivoFrom.get('IdMotivo')?.setValue('0');
          this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
          this.notif.onWarning('Advertencia', 'El Nro títulos final es incorrecto con respecto al Nro título inicial.')
          this.resultOficinaDestino = [];
          this.consecutivoFrom.get('NroTituloInicial')?.reset();
          this.consecutivoFrom.get('NroTituloFinal')?.reset();
          this.generalesService.Autofocus('NroTituloInicial');
        }
      }
      else {
        if (Final >= Inicial && (Final - Inicial <= 100)) {
          if (this.consecutivoFrom.get('NroTituloInicial')?.value !== null
            && this.consecutivoFrom.get('NroTituloInicial')?.value !== undefined
            && this.consecutivoFrom.get('NroTituloInicial')?.value !== ''
            && this.consecutivoFrom.get('NroTituloFinal')?.value !== null
            && this.consecutivoFrom.get('NroTituloFinal')?.value !== undefined
            && this.consecutivoFrom.get('NroTituloFinal')?.value !== '') {
            // this.BloquearBoton = null;
            if (this.IdModulo === 19) {
              this.ConsecutivotituloService.BuscarTituloTermino(Inicial, Final).subscribe(
                result => {
                  const Consulta = result[0].Column1;
                  if (Consulta !== 0) {
                    if (this.UsuarioYFechaReasignar) {
                      this.BloquearBoton = false;
                      this.motivoAnnulacion = true;
                      this.consecutivoFrom.get('IdMotivo')?.setValue('0');
                      this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
                      this.notif.onWarning('Advertencia', 'El rango ya ha sido asignado.');
                      this.resultOficinaDestino = [];
                      this.consecutivoFrom.get('NroTituloInicial')?.reset();
                      this.consecutivoFrom.get('NroTituloFinal')?.reset();
                      this.generalesService.Autofocus('tituloinicial');
                    }
                  }
                  else {
                    this.BloquearBoton = null;
                    this.btn = false;
                  }
                },
                error => {
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.log(errorMessage);
                });
            }
            else if (this.IdModulo === 20) {
              this.ConsecutivotituloService.BuscarTitulo(Inicial, Final).subscribe(
                result => {
                  const Consulta = result[0].Column1;
                  if (Consulta !== 0) {
                    if (this.UsuarioYFechaReasignar) {
                      this.BloquearBoton = false;
                      this.motivoAnnulacion = true;
                      this.consecutivoFrom.get('IdMotivo')?.setValue('0');
                      this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
                      this.resultOficinaDestino = [];
                      this.notif.onWarning('Advertencia', 'El rango ya ha sido asignado.');
                      this.consecutivoFrom.get('NroTituloInicial')?.reset();
                      this.consecutivoFrom.get('NroTituloFinal')?.reset();
                      this.generalesService.Autofocus('tituloinicial');
                    }
                  }
                  else {
                    this.BloquearBoton = null;
                    this.btn = false;
                  }
                },
                error => {
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.log(errorMessage);
                });
            }
            else if (this.IdModulo === 38) {
              if (this.Iddocumento === "1" || this.Iddocumento === "6") {
                this.ConsecutivotituloService.BuscarLibretasDisponibles(Inicial, Final, Producto).subscribe(
                  result => {
                    if (result.length === 0) {
                      this.BloquearBoton = false;
                      this.btn = false;
                      this.motivoAnnulacion = true;
                      this.consecutivoFrom.get('IdMotivo')?.setValue('0');
                      this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
                      this.notif.onWarning('Advertencia', 'El rango es incorrecto.');
                      this.consecutivoFrom.get('NroTituloInicial')?.reset();
                      this.resultOficinaDestino = [];
                      this.consecutivoFrom.get('NroTituloFinal')?.reset();
                      this.generalesService.Autofocus('tituloinicial');
                    } else {
                      this.BloquearBoton = null;
                      this.btn = false;
                    }
                  },
                  error => {
                    const errorMessage = <any>error;
                    this.notif.onDanger('Error', errorMessage);
                    console.log(errorMessage);
                  });
              }
              if (this.Iddocumento === '2') {
                this.ConsecutivotituloService.ObtenerInfoTarjetasDisponibles(Inicial, Final).subscribe(
                  result => {
                    if (result[0].Column1 !== 0) {
                      if (this.UsuarioYFechaReasignar) {
                        this.BloquearBoton = false;
                        this.motivoAnnulacion = true;
                        this.consecutivoFrom.get('IdMotivo')?.setValue('0');
                        this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
                        this.notif.onWarning('Advertencia', 'El rango ya ha sido asignado.');
                        this.consecutivoFrom.get('NroTituloInicial')?.reset();
                        this.consecutivoFrom.get('NroTituloFinal')?.reset();
                        this.resultOficinaDestino = [];
                        this.consecutivoFrom.get('NroColillas')?.reset();
                        this.consecutivoFrom.get('NroLibretas')?.reset();
                        this.generalesService.Autofocus('tituloinicial');
                      }
                    } else {
                      this.BloquearBoton = null;
                      this.btn = false;
                    }
                  },
                  error => {
                    const errorMessage = <any>error;
                    this.notif.onDanger('Error', errorMessage);
                    console.log(errorMessage);
                  });
              }
            }
            else if (this.IdModulo === 25) {
              this.ConsecutivotituloService.BuscarTituloPagare(Inicial, Final).subscribe(
                result => {
                  const Consulta = result[0].Column1;
                  if (Consulta !== 0) {
                    if (this.UsuarioYFechaReasignar) {
                      this.BloquearBoton = false;
                      this.motivoAnnulacion = true;
                      this.consecutivoFrom.get('IdMotivo')?.setValue('0');
                      this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
                      this.notif.onWarning('Advertencia', 'El rango ya ha sido asignado.');
                      this.resultOficinaDestino = [];
                      this.consecutivoFrom.get('NroTituloInicial')?.reset();
                      this.consecutivoFrom.get('NroTituloFinal')?.reset();
                      this.generalesService.Autofocus('tituloinicial');
                    }
                  }
                  else {
                    this.BloquearBoton = null;
                    this.btn = false;
                  }
                },
                error => {
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.log(errorMessage);
                });
            }
          }
          else {
            this.BloquearBoton = false;
            this.BloquearMotivo = true;
            this.motivo = true;
            this.consecutivoFrom.get('IdMotivo')?.setValue('0');
            this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
          }
        } else if (isNaN(Final) && isNaN(Inicial)) {
          this.resultOficinaDestino = [];
          this.notif.onWarning('Advertencia', 'Rango Incorrecto.');
        } else {
          this.BloquearBoton = false;
          this.motivoAnnulacion = true;
          this.consecutivoFrom.get('IdMotivo')?.setValue('0');
          this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
          Final - Inicial >= 100 ?
          this.notif.onWarning('Advertencia', 'El tope máximo de asignación es 100.') :
          this.notif.onWarning('Advertencia', 'El Nro títulos final es incorrecto con respecto al Nro título inicial.');
          this.resultOficinaDestino = [];
          this.consecutivoFrom.get('NroTituloInicial')?.reset();
          this.consecutivoFrom.get('NroTituloFinal')?.reset();
          this.generalesService.Autofocus('NroTituloInicial');
        }
      }
  }
  ObtenerInfotitulos(int : number) {
    let Inicial = parseInt(this.consecutivoFrom.get('NroTituloInicial')?.value);
    let Final = parseInt(this.consecutivoFrom.get('NroTituloFinal')?.value);
    const Producto = parseInt(this.consecutivoFrom.get('IdProducto')?.value);
    if (this.IdModulo === 19) {
      this.ConsecutivotituloService.ObtenerInfoRangoTitulosTermino(Inicial, Final).subscribe(
        result => {
          this.resultTitulos = result;
          if (int == 1) this.ActualizarConsecutivo();
          else if (int == 2) this.ConfirmarConsecutivo();
        }, error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
    if (this.IdModulo === 20) {
      this.ConsecutivotituloService.ObtenerInfoRangoTitulosConsecutivos(Inicial, Final).subscribe(
        result => {
          this.resultTitulos = result;
          if (int == 1) this.ActualizarConsecutivo();
          else if (int == 2) this.ConfirmarConsecutivo();
        }, error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
      }
      if (this.IdModulo === 38) {
        if (this.Iddocumento === '1' || this.Iddocumento === '6') {
          const colillas = parseInt(this.consecutivoFrom.get('NroColillas')?.value);
          const libretas = parseInt(this.consecutivoFrom.get('NroLibretas')?.value);
          this.resultTitulos = [];
          for (let index = 0; index < libretas; index++) {
            this.ConsecutivotituloService.ObtenerInfoLibretasDisponibles(Inicial, Producto).subscribe(
              result => {
                if (result.length == 0) {
                  index = libretas + 1;
                } else {
                  let agregado = false;
                  this.resultTitulos.forEach(element => {
                    if (result[0].NroTitulo == element.NroTitulo) {
                      agregado = true;
                    }
                  });
                  if (!agregado) {
                    this.resultTitulos.push(result[0]);
                  }
                }
              }, error => {
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              });
            Inicial += colillas + 1;
            Final += colillas + 1;
          }
          setTimeout(() => {
            if (int == 1) this.ActualizarConsecutivo();
            else if (int == 2) this.ConfirmarConsecutivo();
          }, 1000);
        }
        else if (this.Iddocumento === '2') {
          const libretas = parseInt(this.consecutivoFrom.get('NroLibretas')?.value);
          const rangoFinal = (Final + libretas - 1);
          this.ConsecutivotituloService.ObtenerInfoTarjetaDisponibles(Inicial, Final).subscribe(
            result => {
              this.resultTitulos = result;
              if (int == 1) this.ActualizarConsecutivo();
              else if (int == 2) this.ConfirmarConsecutivo();
            }, error => {
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            });
        }
      }
      if (this.IdModulo === 25) {
        this.ConsecutivotituloService.ObtenerInfoRangoPagare(Inicial, Final).subscribe(
          result => {
            this.resultTitulos = result;
            if (int == 1) this.ActualizarConsecutivo();
            else if (int == 2) this.ConfirmarConsecutivo();
          }, error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
  }
  Actualizar() {
    if (this.IdModulo === 19) {
      this.loading = true;
      this.ConsecutivotituloService.ActualizarRangoTituloTermino(this.consecutivoFrom.value).subscribe(
        result => {
          this.loading = false;
          let limInferior = this.log.NroInicial;
          let limSuperior = this.log.NroFinal;
          this.log.NroFinal = null;
          for (let i = limInferior; i <= limSuperior; i++){
            this.log.NroInicial = i;
            this.RegistrarLog();
          }
          this.notif.onSuccess('Exitoso', 'El rango se actualizó correctamente.');
          this.formAsignar = true;
          this.formRango = true;
          this.formAnular = true;
          this.ClearFormConsecutivo();
          this.btn = true;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      )
    }
    else if (this.IdModulo === 20) {
      this.loading = true;
      this.ConsecutivotituloService.ActualizarConsecutivoTitulo(this.consecutivoFrom.value).subscribe(
        result => {
          this.loading = false;
          let limInferior = this.log.NroInicial;
          let limSuperior = this.log.NroFinal;
          this.log.NroFinal = null;
          for (let i = limInferior; i <= limSuperior; i++){
            this.log.NroInicial = i;
            this.RegistrarLog();
          }
          this.notif.onSuccess('Exitoso', 'El rango se actualizó correctamente.');
          this.formAsignar = true;
          this.formRango = true;
          this.formAnular = true;
          this.ClearFormConsecutivo();
          this.btn = true;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      )
    }
    else if (this.IdModulo === 38) {
      if (this.Iddocumento === '1' || this.Iddocumento === '6') {
        this.loading = true;
        this.ConsecutivotituloService.ActualizarLibretasDisponibles(this.consecutivoFrom.value).subscribe(
          result => {
            this.loading = false;
            let libretas = parseInt(this.consecutivoFrom.get("NroLibretas")?.value)
            let colillas = parseInt(this.consecutivoFrom.get("NroColillas")?.value)
            let limInferior = this.log.NroInicial;
            this.log.NroFinal = null;
            for (let i = 0; i < libretas; i++){
              this.log.NroInicial = limInferior;
              this.log.NroFinal = limInferior + colillas;
              this.RegistrarLog();
              limInferior += colillas + 1;
            }
            this.notif.onSuccess('Exitoso', 'El rango se actualizó correctamente.');
            this.formAsignar = true;
            this.formRango = true;
            this.formAnular = true;
            this.ClearFormConsecutivo();
            this.btn = true;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        )
      }
      else if (this.Iddocumento === '2') {
          this.loading = true;
        this.ConsecutivotituloService.ActualizarTarjetasDisponibles(this.consecutivoFrom.value).subscribe(
          result => {
          this.loading = false;
            let limInferior = this.log.NroInicial;
            let limSuperior = this.log.NroFinal;
            this.log.NroFinal = null;
            for (let i = limInferior; i <= limSuperior; i++){
              this.log.NroInicial = i;
              this.RegistrarLog();
            }
            this.notif.onSuccess('Exitoso', 'El rango se actualizó correctamente.');
            this.formAsignar = true;
            this.formRango = true;
            this.formAnular = true;
            this.ClearFormConsecutivo();
            this.btn = true;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          });
      }
    }
    else if (this.IdModulo === 25) {
      this.loading = true;
      this.ConsecutivotituloService.ActualizarPagare(this.consecutivoFrom.value).subscribe(
        result => {
          this.loading = false;
          let limInferior = this.log.NroInicial;
          let limSuperior = this.log.NroFinal;
          this.log.NroFinal = null;
          for (let i = limInferior; i <= limSuperior; i++){
            this.log.NroInicial = i;
            this.RegistrarLog();
          }
          this.notif.onSuccess('Exitoso', 'El rango se actualizó correctamente.');
          this.formAsignar = true;
          this.formRango = true;
          this.formAnular = true;
          this.ClearFormConsecutivo();
          this.btn = true;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        });
    }
  }
  ActualizarConsecutivo() {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    let oficina = parseInt(this.dataUser.NumeroOficina);
    let titulosCorrectos = true;
    let estadoCorrecto = true;

    this.resultTitulos.forEach(item => {
      if (item.IdEstado !== 45 ) {
        estadoCorrecto = false;
      }
      if (item.IdCuenta != null || item.FechaApertura !== null || item.IdOficina !== oficina) {
        titulosCorrectos = false;
      }
    });
    if (!titulosCorrectos || !estadoCorrecto) {
      if (!this.alertaMostrada) {
        this.notif.onWarning('Advertencia', 'El rango a trasladar no cumple las condiciones.');
        this.alertaMostrada = true;
      }
      this.consecutivoFrom.get('NroTituloInicial')?.setValue('');
      this.consecutivoFrom.get('NroTituloFinal')?.setValue('');
      this.consecutivoFrom.get('IdOficina')?.setValue('');
      this.consecutivoFrom.get('NroLibretas')?.reset();
      this.consecutivoFrom.get('NroColillas')?.reset();
      this.consecutivoFrom.get('IdOficinaDestino')?.setValue('');
      this.BloquearBoton = true;
      this.resultOficinaDestino = [];
      this.generalesService.Autofocus('tituloinicial');
    } else {
      this.ObtenerOficinasDestino();
    }
  }
  anular() {
    if (this.IdModulo === 19) {
      this.loading = true;
      this.ConsecutivotituloService.AnularNroTituloTermino(this.consecutivoFrom.value).subscribe(
        result => {
          this.loading = false;
          this.RegistrarLog();
          this.notif.onSuccess('Exitoso', 'El registro se anuló correctamente.');
          this.formAsignar = true;
          this.formRango = true;
          this.formAnular = true;
          this.ClearFormConsecutivo();
          this.btn = true;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
    else if (this.IdModulo === 20) {
      this.loading = true;
      this.ConsecutivotituloService.AnularNroTituloConsecutivos(this.consecutivoFrom.value).subscribe(
        result => {
          this.loading = false;
          this.RegistrarLog();
          this.notif.onSuccess('Exitoso', 'El registro se anuló correctamente.');
          this.formAsignar = true;
          this.formRango = true;
          this.formAnular = true;
          this.ClearFormConsecutivo();
          this.btn = true;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
    else if (this.IdModulo === 38) {
      if (this.Iddocumento === "1" || this.Iddocumento === "6") {
        this.loading = true;
        this.ConsecutivotituloService.AnularLibretaDisponibles(this.consecutivoFrom.value).subscribe(
          result => {
            this.loading = false;
            this.RegistrarLog();
            this.notif.onSuccess('Exitoso', 'El registro se anuló correctamente.');
            this.formAsignar = true;
            this.formRango = true;
            this.formAnular = true;
            this.ClearFormConsecutivo();
            this.btn = true;
          },
          error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
      else if (this.Iddocumento === "2") {
        this.loading = true;
        this.ConsecutivotituloService.AnularTarjetaDisponibles(this.consecutivoFrom.value).subscribe(
          result => {
            this.loading = false;
            this.RegistrarLog();
            this.notif.onSuccess('Exitoso', 'El registro se anuló correctamente.');
            this.formAsignar = true;
            this.formRango = true;
            this.formAnular = true;
            this.ClearFormConsecutivo();
            this.btn = true;

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
    else if (this.IdModulo === 25) {
      this.loading = true;
      this.ConsecutivotituloService.AnularNroTituloPagare(this.consecutivoFrom.value).subscribe(
        result => {
          this.loading = false;
          this.RegistrarLog();
          this.notif.onSuccess('Exitoso', 'El registro se anulo correctamente.');
          this.formAsignar = true;
          this.formRango = true;
          this.formAnular = true;
          this.ClearFormConsecutivo();
          this.btn = true;
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
  AnularConsecutivo() {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));

    if (this.resultTitulo[0].IdOficina.toString() === this.dataUser.NumeroOficina) {
      if (this.resultTitulo[0].IdEstado === 45) {
        if (this.resultTitulo[0].IdCuenta === null || this.resultTitulo[0].IdCuenta === undefined) {
          if (this.resultTitulo[0].FechaApertura === null || this.resultTitulo[0].FechaApertura === undefined) {
            this.btn = false;
            this.BloquearMotivo = null;
          }
          else {
            this.BloquearBoton = false;
            $("#IdMotivo").val("0");
            this.notif.onWarning('Advertencia', 'El registro ya fue asignado.');
            this.generalesService.Autofocus('nroRegistro');
            this.BloquearBoton = false;
            this.BloquearMotivo = true;
            // this.motivo = false;
            this.consecutivoFrom.get('NroTituloInicial')?.reset();
            this.consecutivoFrom.get('NroTituloFinal')?.reset();
            this.consecutivoFrom.get('NroRegistro')?.reset();
            this.motivoAnnulacion = true;
            this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
          }
        }
        else {
          this.BloquearBoton = false;
          $("#IdMotivo").val("0");
          this.notif.onWarning('Advertencia', 'El registro ya fue asignado.');
          this.generalesService.Autofocus('nroRegistro');
          this.BloquearBoton = false;
          this.BloquearMotivo = true;
          // this.motivo = false;
          this.consecutivoFrom.get('NroTituloInicial')?.reset();
          this.consecutivoFrom.get('NroTituloFinal')?.reset();
          this.consecutivoFrom.get('NroRegistro')?.reset();
          this.motivoAnnulacion = true;
          this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
        }
      }
      else {
        this.BloquearBoton = false;
        $("#IdMotivo").val("0");
        this.notif.onWarning('Advertencia', 'El estado es incorrecto.');
        this.generalesService.Autofocus('nroRegistro');
        this.BloquearBoton = false;
        this.BloquearMotivo = true;
        // this.motivo = false;
        this.consecutivoFrom.get('NroRegistro')?.reset();
        this.consecutivoFrom.get('NroTituloInicial')?.reset();
        this.consecutivoFrom.get('NroTituloFinal')?.reset();
        this.motivoAnnulacion = true;
        this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
      }
    }
    else {
      this.BloquearBoton = false;
      $("#IdMotivo").val("0");
      this.notif.onWarning('Advertencia', 'La Oficina es incorrecta.');
      this.generalesService.Autofocus('nroRegistro');
      this.BloquearBoton = false;
      this.BloquearMotivo = true;
      // this.motivo = false;
      this.consecutivoFrom.get('NroTituloInicial')?.reset();
      this.consecutivoFrom.get('NroTituloFinal')?.reset();
      this.consecutivoFrom.get('NroRegistro')?.reset();
      this.motivoAnnulacion = true;
      this.consecutivoFrom.get('DescripcionMotivo')?.setValue('');
    }
  }
  Confirmar() {
    Swal.fire({
      title: '¿Desea confirmar traslado?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results) => {
      if (results.value) {
        if (this.IdModulo === 19) {
          this.loading = true;
          this.ConsecutivotituloService.ConfirmarRangoTituloTermino(this.consecutivoFrom.value).subscribe(
            result => {
              this.loading = false;
              let limInferior = this.log.NroInicial;
              let limSuperior = this.log.NroFinal;
              this.log.NroFinal = null;
              for (let i = limInferior; i <= limSuperior; i++){
                this.log.NroInicial = i;
                this.RegistrarLog();
              }
              this.notif.onSuccess('Exitoso', 'El rango se confirmó correctamente.');
              this.formAsignar = true;
              this.formRango = true;
              this.formAnular = true;
              this.ClearFormConsecutivo();
              this.btn = true;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          )
        }
        else if (this.IdModulo === 20) {
          this.loading = true;
          this.ConsecutivotituloService.ConfirmarRangoTituloConsecutivos(this.consecutivoFrom.value).subscribe(
            result => {
              this.loading = false;
              let limInferior = this.log.NroInicial;
              let limSuperior = this.log.NroFinal;
              this.log.NroFinal = null;
              for (let i = limInferior; i <= limSuperior; i++){
                this.log.NroInicial = i;
                this.RegistrarLog();
              }
              this.notif.onSuccess('Exitoso', 'El rango se confirmó correctamente.');
              this.formAsignar = true;
              this.formRango = true;
              this.formAnular = true;
              this.ClearFormConsecutivo();
              this.btn = true;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          )
        }
        else if (this.IdModulo === 38) {
          if (this.Iddocumento === "1" || this.Iddocumento === "6") {
            this.loading = true;
            this.ConsecutivotituloService.ConfirmarRangoLibretas(this.consecutivoFrom.value).subscribe(
              result => {
                this.loading = false;
                let libretas = parseInt(this.consecutivoFrom.get("NroLibretas")?.value);
                let colillas = parseInt(this.consecutivoFrom.get("NroColillas")?.value);
                let limInferior = this.log.NroInicial;
                this.log.NroFinal = null;
                for (let i = 0; i < libretas; i++){
                  this.log.NroInicial = limInferior;
                  this.log.NroFinal = limInferior + colillas;
                  this.RegistrarLog();
                  limInferior += colillas + 1;
                }
                this.notif.onSuccess('Exitoso', 'El rango se confirmó correctamente.');
                this.formAsignar = true;
                this.formRango = true;
                this.formAnular = true;
                this.ClearFormConsecutivo();
                this.btn = true;
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              }
            )
          }
          else if (this.Iddocumento === "2") {
            this.loading = true;
            this.ConsecutivotituloService.ConfirmarRangoTarjetas(this.consecutivoFrom.value).subscribe(
              result => {
                this.loading = false;
                let limInferior = this.log.NroInicial;
                let limSuperior = this.log.NroFinal;
                this.log.NroFinal = null;
                for (let i = limInferior; i <= limSuperior; i++){
                  this.log.NroInicial = i;
                  this.RegistrarLog();
                }
                this.notif.onSuccess('Exitoso', 'El rango se confirmó correctamente.');
                this.formAsignar = true;
                this.formRango = true;
                this.formAnular = true;
                this.ClearFormConsecutivo();
                this.btn = true;
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              }
            )
          }
        }
        else if (this.IdModulo === 25) {
          this.loading = true;
          this.ConsecutivotituloService.ConfirmarRangoPagare(this.consecutivoFrom.value).subscribe(
            result => {
              this.loading = false;
              let limInferior = this.log.NroInicial;
              let limSuperior = this.log.NroFinal;
              this.log.NroFinal = null;
              for (let i = limInferior; i <= limSuperior; i++){
                this.log.NroInicial = i;
                this.RegistrarLog();
              }
              this.notif.onSuccess('Exitoso', 'El rango se confirmó correctamente.');
              this.formAsignar = true;
              this.formRango = true;
              this.formAnular = true;
              this.ClearFormConsecutivo();
              this.btn = true;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          )
        }
      }
    });
  }

  ConfirmarAsignación() {
    const Inicial = parseInt(this.consecutivoFrom.get('NroTituloInicial')?.value);
    const Final = parseInt(this.consecutivoFrom.get('NroTituloFinal')?.value);
    const mensaje = '¿Está seguro de asignar el rango desde '+Inicial+' hasta '+Final+'?'

    Swal.fire({
      title: mensaje,
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results) => {
      if (results.value) {
        this.GuardarConsecutivo()
      }
    });
  }
  ConfirmarConsecutivo() {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));

    let oficina = parseInt(this.dataUser.NumeroOficina);
    let estadoCorrecto = true;
    let titulosCorrectos = true;

    this.resultTitulos.forEach(item => {
      if (item.IdEstado !== 47) {
        estadoCorrecto = false;
      }
    });
    this.resultTitulos.forEach(element => {
      if (element.IdCuenta != null || element.FechaReasignacion === null || element.FechaApertura !== null || element.IdOficina !== oficina) {
        titulosCorrectos = false;
      }
    });

    if (!titulosCorrectos || !estadoCorrecto) {
      if (this.mensajeConfirmarMostrado = false) {
        this.mensajeConfirmarMostrado = true;
        this.notif.onWarning('Advertencia', 'El rango a confirmar no cumple las condiciones.');
      }
      this.consecutivoFrom.get('NroTituloInicial')?.setValue('');
      this.consecutivoFrom.get('NroTituloFinal')?.setValue('');
      this.consecutivoFrom.get('IdOficina')?.setValue('');
      this.consecutivoFrom.get('IdEstado')?.setValue('');
      this.BloquearBoton = true;
      this.generalesService.Autofocus('tituloinicial');
    }
    else {
      this.btn = false;
      this.BloquearBoton = null;
    }
  }
  RegistrarConsecutivo() {
    if (this.resultRegistrarTermino === undefined || this.resultRegistrarTermino === null || this.resultRegistrarTermino === '') {
      this.notif.onWarning('Advertencia', 'El rango a registrar no cumple con las condiciones');
      this.consecutivoFrom.get('FechaInicial')?.reset();
      this.consecutivoFrom.get('FechaFinal')?.reset();
      this.generalesService.Autofocus('fechaInicial');
    } else {
      let data : string | null = localStorage.getItem('Data');
      this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
      const fechaI = this.consecutivoFrom.get('FechaInicial')?.value;
      const fechaF = this.consecutivoFrom.get('FechaFinal')?.value;
      const idOficina = parseInt(this.dataUser.NumeroOficina);
      const documento = this.consecutivoFrom.get('IdDocumentos')?.value;
      const idProducto = this.consecutivoFrom.get('IdProducto')?.value;
      this.ConsecutivotituloService.LimpiarParaRegistrarEntregas(fechaI,fechaF,idOficina, documento).subscribe(
        result => {
        
        },error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      )
      if (this.IdModulo === 19) {
        this.loading = true;
        this.ConsecutivotituloService.ActualizarTitulosRegistrar(this.resultRegistrarTermino).subscribe(
          result => {
            this.loading = false;
            this.notif.onSuccess('Exitoso', 'El rango se registro correctamente.');
            this.formAsignar = true;
            this.formRango = true;
            this.formAnular = true;
            this.ClearFormConsecutivo();
            this.btn = true;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        )
      }
      else if (this.IdModulo === 38) {
        if (this.Iddocumento === '1' || this.Iddocumento === '6') {
          this.loading = true;
          this.ConsecutivotituloService.ActualizarLibretasRegistrar(this.resultRegistrarTermino).subscribe(
            result => {
            this.loading = false;
              this.notif.onSuccess('Exitoso', 'El rango se registro correctamente.');
              this.formAsignar = true;
              this.formRango = true;
              this.formAnular = true;
              this.ClearFormConsecutivo();
              this.btn = true;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          )
        }
        else if (this.Iddocumento === '2') {
          this.loading = true;
          this.ConsecutivotituloService.ActualizarTarjetasRegistrar(this.resultRegistrarTermino).subscribe(
            result => {
              this.loading = false;
              this.notif.onSuccess('Exitoso', 'El rango se registro correctamente.');
              this.formAsignar = true;
              this.formRango = true;
              this.formAnular = true;
              this.ClearFormConsecutivo();
              this.btn = true;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          )
        }
      }
    }
  }

  OrganizarDatosLog() {
    let data : string | null = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    let datosForm = this.consecutivoFrom.value;
    let datalog = new ConsecutivosLog();
    datalog.IdOficinaDestino = parseInt(datosForm.IdOficinaDestino);
    datalog.NroInicial = datosForm.NroTituloInicial;
    datalog.IdOficinaOrigen = parseInt(datosForm.IdOficina);
    datalog.NroFinal = datosForm.NroTituloFinal;
    datalog.Usuario = this.dataUser.IdUsuario;
    datalog.Operacion = this.consecutivoOperacionFrom.get('Codigo')?.value;
    datalog.Documento = datosForm.IdDocumentos;
    if (datalog.NroInicial == null) {
      datalog.NroInicial = datosForm.NroRegistro;
    }

    if (datalog.Operacion == 76) {
      datalog.IdEstado = 10;
    }else if (datalog.Operacion == 46) {
      datalog.IdEstado = 47;
    }else {
      datalog.IdEstado = datosForm.IdEstado;
    }
    datalog.IdProducto = datosForm.IdProducto;
    if (datalog.IdProducto == null) {
      datalog.IdProducto = 0;
    }
    if (datalog.Documento == null) {
      datalog.Documento = 0;
    }
    datalog.IdModulo = datosForm.IdModulo;
    this.log = data;
  }

  click() {
    this.OrganizarDatosLog();
    if (this.consecutivoFrom.get('btnValue')?.value === 'Actualizar') this.Actualizar();
    if (this.consecutivoFrom.get('btnValue')?.value === 'Anular') this.anular();
    if (this.consecutivoFrom.get('btnValue')?.value === 'Confirmar') this.Confirmar();
    if (this.consecutivoFrom.get('btnValue')?.value === 'Guardar') this.ConfirmarAsignación();
    if (this.consecutivoFrom.get('btnValue')?.value === 'Registrar') this.RegistrarConsecutivo();
    if (this.consecutivoFrom.get('btnValue')?.value === 'Buscar') this.listarTitulos();
  }

  ValidateForm() {
    const Codigo = new FormControl('', [Validators.required]);
    const NroTituloInicial = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const NroTituloFinal = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const NroRegistro = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const NroLibretas = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const NroColillas = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const IdOficina = new FormControl('', []);
    const IdOficinaDestino = new FormControl({value :'', disabled : true}, []);
    const IdModulo = new FormControl('', [Validators.required]);
    const Asigna = new FormControl('', []);
    const IdUsuarioAsigna = new FormControl('', []);
    const FechaAsignacion = new FormControl('', []);
    const Reasigna = new FormControl('', []);
    const IdUsuarioReasigna = new FormControl('', []);
    const FechaReasignacion = new FormControl('', []);
    const IdDocumentos = new FormControl('', []);
    const IdProducto = new FormControl('', []);
    const IdEstado = new FormControl('', []);
    const IdMotivo = new FormControl('', []);
    const DescripcionMotivo = new FormControl('', []);
    const FechaInicial = new FormControl('', []);
    const FechaFinal = new FormControl('', []);
    const btnValue = new FormControl('', []);

    this.consecutivoFrom = new FormGroup({
      NroTituloInicial: NroTituloInicial,
      NroTituloFinal: NroTituloFinal,
      NroRegistro: NroRegistro,
      NroLibretas: NroLibretas,
      NroColillas: NroColillas,
      IdOficina: IdOficina,
      IdOficinaDestino: IdOficinaDestino,
      IdModulo: IdModulo,
      Asigna: Asigna,
      IdUsuarioAsigna: IdUsuarioAsigna,
      FechaAsignacion: FechaAsignacion,
      Reasigna: Reasigna,
      IdUsuarioReasigna: IdUsuarioReasigna,
      FechaReasignacion: FechaReasignacion,
      IdDocumentos: IdDocumentos,
      IdProducto: IdProducto,
      IdEstado: IdEstado,
      IdMotivo: IdMotivo,
      DescripcionMotivo: DescripcionMotivo,
      FechaInicial: FechaInicial,
      FechaFinal: FechaFinal,
      btnValue: btnValue,
    });

    this.consecutivoOperacionFrom = new FormGroup({
      Codigo: Codigo,
    });
  }
}
