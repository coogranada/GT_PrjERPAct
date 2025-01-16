import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ClientesService } from '../../../Services/Clientes/clientes.service';
import { ClientesGetListService } from '../../../Services/Clientes/clientesGetList.service';
import { OperacionesService } from '../../../Services/Maestros/operaciones.service';
import { ClientesModel } from '../../../Models/Clientes/clientes.model';
import { NaturalesAllModel, NaturalesServicio, NaturalesMenorModel } from '../../../Models/Clientes/naturalesAll.model';
import { formatDate } from '@angular/common';
import { RequiredData } from '../../../Models/Generales/RequiredData.model';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AppComponent } from '../../../app.component';
import { RecursosGeneralesService } from '../../../Services/Utilidades/recursosGenerales.service';
import { OficinasService } from '../../../Services/Maestros/oficinas.service';
import { GeneralesService } from '../../../Services/Productos/generales.service';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { NgxToastService } from 'ngx-toast-notifier';
import { HtmlToService } from '../../../Services/Utilidades/html-to.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-solicitud-servicios',
  templateUrl: './solicitud-servicios.component.html',
  styleUrls: ['./solicitud-servicios.component.css'],
  providers: [ClientesService, ClientesGetListService, OperacionesService,
    RecursosGeneralesService, OficinasService,
    OperacionesService, GeneralesService, ModuleValidationService],
    standalone : false
})
export class SolicitudServiciosComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  // Abre la solicitud automaticamente
  @ViewChild('openSolicitud', { static: true }) openSolicitudModal!: ElementRef;
  @Input() infoRetiroReimprimir : any;

  @ViewChild('AppComponent', { static: true }) appComponent!: AppComponent;
  // recibe los datos del componente Naturales
  @Input() openSolicitud : any;
  @Input() validar : any;
  @Input() DocumentoConsultar : any;
  @Input() InformacionMenor : any;
  @Input() EsReImpresion : any;
  public CargarAppComponet = false;
  public loading = false;
  public mostrarImporta : boolean | null = false;
  public mostrarExporta : boolean | null = false;
  public mostrarGiros : boolean | null = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  //#region Variables
  id: any;
  operacionEscogida = '';
  CedulaAsesor = '';
  NombreAsesor = '';
  administradineros = '';
  validarfianciero = 0;
  antiguedadStr: any;
  tienePpal = false;
  mostrarReimprimir = false;
  oculatObligatorio = true;
  oculatObligatorioTercero = true;
  tieneEmpleo = false;
  activedServicio = false;
  activedBasico = false;
  activedFinan = false;
  activedConta = false;
  activedActivo = false;
  activedConyu = false;
  activedLabor = false;
  activeRefe = false;
  activeEntre = false;
  activeSeguro = false;
  activeFecha = false;
  mostrarOficina = false;
  btnGuardarOculto = false;
  btnOcultoBuscar = true;
  mostrarSolicitud = false;
  variableGlobalTrue: any;
  variableGlobalFalse = null;
  tratamientoConsulta: any;
  fechaCreacion: any;
  fechaModificacion: any;
  fechaRetiro: any;
  empleoAnterior: any;
  viviendaAnterior: any;
  public rangeChanged : any;
  indexSeguro = null;
  indexFinanciero = null;
  indexContacto = null;
  indexActivo = null;
  indexLaboral = null;
  indexReferencia = null;
  indexConyugue = null;
  dataLocal: any;
  dataGenNit: any;
  dataTercero: any;
  dataTipoCliente: any;
  @Input() dataCiudad: any;
  @Input() dataBarrio: any;
  @Input() dataMarcasSol: any;

  dataNivelEstudio: any;
  @Input() dataProfesionSol: any;
  dataUser: any;
  @Input() dataActivosAllSol: any;
  @Input() dataParentescosSol: any;
  @Input() dataParentescosPepsSol: any;
  @Input() dataSegurosSol: any;
  @Input() dataCargosSol: any;
  dataPreguntas: any;
  @Input() dataDivisasSol: any;
  LabelHipoPigno = '';
  config2: any = { 'sourceField': ['Nombre'] };
  dataEmpresas: any;
  @Input() dataEmpresasEps: any;
  fechaImpresion: any;
  mostrarCobertura : boolean | null = false;
  direccionArray: string = "";
  via: string = "";
  numero: string = "";
  letra: string = "";
  numeroDos: string = "";
  letraDos: string = "";
  cardi: string = "";
  numeroTres: string = "";
  imuebles: string = "";
  numeroCuatro: string = "";
  MostrarAsesorExterno = false;
  ocultarEditar = true;
  refFamiliar = false;
  refComercial = false;
  refFinanciera = false;
  disbaleBusqueda = true;
  DescripcionBtn = 'Siguiente';
  MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
  DigitosContacto = 0;
  moduloLocal: any;
  public Servcredito: any;
  public servVinculacion: any;
  public ServActualiza: any;
  @Input() dataDepartamentosAllSol: any;
  @Input() dataCiudadesAllSol: any;
  @Input() dataPaisesAllSol: any;
  @Input() dataBarriosAllSol: any;
  //#endregion

  public ocupacionesConyugue = [
    { Value: '1', Descripcion: 'Asalariado' },
    { Value: '2', Descripcion: 'Independiente' },
    { Value: '3', Descripcion: 'Pensionado' },
    { Value: '4', Descripcion: 'Ama de casa' },
    { Value: '5', Descripcion: 'Otros' }];

  public naturalesServicio = new NaturalesServicio();
  public naturalesAllModel = new NaturalesAllModel();
  public naturalesMenorModel = new NaturalesMenorModel();
  public metodosConocio = [
    { Value: '1', Descripcion: 'Radio' },
    { Value: '2', Descripcion: 'Televisión' },
    { Value: '3', Descripcion: 'Volante' },
    { Value: '4', Descripcion: 'Referido' },
    { Value: '5', Descripcion: 'Web' },
    { Value: '6', Descripcion: 'Por' },
    { Value: '7', Descripcion: 'Otro' },
  ];
  public tiposDocumento = [
    { Value: '1', Descripcion: 'Cedula' },
    { Value: '2', Descripcion: 'Extranjería Cedula' },
    { Value: '3', Descripcion: 'Nit' },
    { Value: '4', Descripcion: 'Tarjeta De Identidad' },
    { Value: '5', Descripcion: 'Nuip' },
    { Value: '7', Descripcion: 'Registro Civil' },
    { Value: '8', Descripcion: 'Otro' },
    { Value: '9', Descripcion: 'Pasaporte' },
    { Value: '10', Descripcion: 'PTP Permiso Temporal de Permanencia' },
    { Value: '11', Descripcion: 'PPT Permiso de Proteccion Temporal' },
  ];
  public generos = [
    { Value: '0', Descripcion: 'Femenino' },
    { Value: '1', Descripcion: 'Masculino' },
  ];
  public estadoCivil = [
    { Value: '25', Descripcion: 'Soltero' },
    { Value: '5', Descripcion: 'Casado' },
    { Value: '30', Descripcion: 'Union libre' },
    { Value: '20', Descripcion: 'Separado' },
    { Value: '35', Descripcion: 'Viudo' }
  ];
  public nivelesEstudio = [
    { Value: '5',  Descripcion: 'Bachillerato' },
    { Value: '15', Descripcion: 'Postgrado' },
    { Value: '20', Descripcion: 'Primaria' },
    { Value: '25', Descripcion: 'Tecnico' },
    { Value: '30', Descripcion: 'Tecnologico' },
    { Value: '35', Descripcion: 'Universitario' },
    { Value: '40', Descripcion: 'Maestria' },
  ];
  public tiposVivienda = [
    { Value: '15', Descripcion: 'Propia' },
    { Value: '1', Descripcion: 'Arrendada' },
    { Value: '10', Descripcion: 'Familiar' }
  ];
  public serviciosolicitado = [
    { Value: '1', Descripcion: 'vinculacion' },
    { Value: '2', Descripcion: 'credito' },
    { Value: '3', Descripcion: 'ActDatos' }
  ];
  public Correspondencia = [
    { Value: '1', Descripcion: 'Residencia' },
    { Value: '2', Descripcion: 'Laboral' },
    { Value: '3', Descripcion: 'Correo electrónico' }
  ];
  public tiposDocumentoConyugue = [
    { Value: '1', Descripcion: 'Cedula' },
    { Value: '2', Descripcion: 'Extranjería Cedula' },
    { Value: '3', Descripcion: 'Nit' },
    { Value: '4', Descripcion: 'Tarjeta De Identidad' },
    { Value: '5', Descripcion: 'Nuip' },
    { Value: '7', Descripcion: 'Registro Civil' },
    { Value: '8', Descripcion: 'Otro' },
    { Value: '9', Descripcion: 'Pasaporte' }
  ];

  public ArrayPropiedad: any[] = [];
  public ArrayVehiculo: any[] = [];
  public ArrayOtros: any[] = [];

  public ArrayFamiliar: any[] = [];
  public ArrayPersonal: any[] = [];
  public ArrayComercial: any[] = [];
  public ArrayFinanciaria: any[] = [];

  public ArrayPeps: any[] = [];

  public allItemsFormSave = [];
  public allItemsFormSaves = {
    asociadosNaturalesDto: {},
    tercerosDto: {},
    financieroDto: {},
    contactoDto: {},
    activoDto: {},
    conyugueDto: {},
    laboralDto: [],
    referenciaDto: {},
    entrevistaDto: {},
    listaDePeps: {},
    segurosDto: {},
    tratamientoDto: {},
    cooberturaDto: {},
    logSegurosDto: {}
  };
  public allItemsEditNatural = {
    asociadosNaturalesDto: {},
    tercerosDto: {},
    financieroDto: {}
  };
  //#endregion
  private DataRequired = new RequiredData();
  esReimpresa: any;
  constructor(private clientesService: ClientesService, private clientesGetListService: ClientesGetListService, 
    private notif: NgxToastService, private htmlTo : HtmlToService) {}

  ngOnInit() {
    if (this.validar === 1) {
      this.CargarAppComponet = true;
    } else {
      this.CargarAppComponet = false;
    }
    this.dataTipoCliente = this.DataRequired.RelacionData;
    this.GetSeguros();
  }
  GetInfoGenNit(tercero : string) {
    this.clientesGetListService.GetInfoGenNit(tercero).subscribe(
      result => {
        this.dataGenNit = result;
      },
      error => {
        this.notif.onDanger('Error', error);
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
    return this.dataGenNit;
  }
  addVias() {
    this.numero = '';
    this.letra = '';
    this.numeroDos = '';
    this.letraDos = '';
    this.cardi = '';
    this.numeroTres = '';
    this.imuebles = '';
    this.numeroCuatro = '';
  }
  GetSeguros() {
     const dataSeguros : any[] = [];
    // this.clientesGetListService.GetSeguros().subscribe(
    //   result => {
      this.dataSegurosSol.forEach((element : any) => {
          if (element.Clase !== 20) {
            dataSeguros.push(element);
          }
        });
    this.dataSegurosSol = dataSeguros;
        // this.segurosEmit.emit(dataSeguros);
        // this.loadSeguro  = false;
        // localStorage.setItem('storageSeguros', window.btoa(JSON.stringify(dataSeguros)));
    //   },
    //   error => {
    //     const errorMessage = <any>error;
    //     this.notif.error('Error', errorMessage);
    //     console.error(errorMessage);
    //   }
    // );
  }
  abrirSolicitud(documentoConsultar : string) {
    if (this.EsReImpresion) {
      this.esReimpresa = 'Reimpresión';
    } else {
      this.esReimpresa = '';
    }
    this.fechaImpresion = new Date();
    this.loading = true;
    this.CargarAppComponet = true;
    this.ArrayPropiedad = [];
    this.ArrayVehiculo = [];
    this.ArrayFamiliar = [];
    this.ArrayPersonal = [];
    this.ArrayComercial = [];
    this.ArrayFinanciaria = [];
    this.ArrayPeps = [];
    this.ArrayOtros = [];
    let fechaAntiLab;
    let fechaNacimiento;
    let fechaExpedicion;
    let fechaModificacion;
    let fechaNacimientoFormat;
    let fechaExpedicionFormat;
    let fechaViveDesde;
    this.mostrarImporta = null;
    this.mostrarCobertura = null;
    this.mostrarGiros = null;
    this.naturalesServicio = new NaturalesServicio();
    this.naturalesAllModel = new NaturalesAllModel();
    console.log("eee",documentoConsultar)
    this.clientesService.BuscarNaturalesAll(documentoConsultar).subscribe((result : any) => {
        console.log(result);
        if (result !== null) {
          let credito : string | null = localStorage.getItem('Credito');
          let vinculacion : string | null = localStorage.getItem('Vinculacion');
          let actualizacion : string | null = localStorage.getItem('Actualizacion');
          let dataServicie : string | null = localStorage.getItem('DataService');

          this.Servcredito = JSON.parse(credito == null ? "" : credito);
          this.servVinculacion = JSON.parse(vinculacion == null ? "" : vinculacion);
          this.ServActualiza = JSON.parse(actualizacion == null ? "" : actualizacion);
          const dataCredito = JSON.parse(dataServicie == null ? "" : dataServicie);
          // mapea la informacion si la impresion es para credito
          if (dataCredito !== null) {
            this.naturalesServicio.Asesor = dataCredito.Asesor;
            if (dataCredito.Destino !== null && dataCredito.Destino !== undefined && dataCredito.Destino !== null) {
              this.naturalesServicio.Destino = this.MaysPrimera(dataCredito.Destino.toLowerCase());
            } else {
              this.naturalesServicio.Destino = dataCredito.Destino;
            }
            this.naturalesServicio.Oficina = dataCredito.Oficina;
            this.naturalesServicio.MontoSolicitado = dataCredito.montoSolicitado;
            this.naturalesServicio.PlazoDeseado = dataCredito.plazoDeseado;
            this.naturalesServicio.NombreDeudor = dataCredito.NombreDeudor;
            this.naturalesServicio.NumeroDocDeudor = dataCredito.NumeroDocumento;
            if (dataCredito.TipoDocumento !== null && dataCredito.TipoDocumento !== undefined
              && dataCredito.TipoDocumento !== '') {
              this.tiposDocumento.forEach(elementTipoDocu => {
                console.log(dataCredito.TipoDocumento);
                if (+elementTipoDocu.Value === dataCredito.TipoDocumento) {
                  this.naturalesServicio.TipoIdentificacion = elementTipoDocu.Descripcion;
                }
              });
            } else {
              this.naturalesServicio.TipoIdentificacion = null;
            }
          }

          // mapea el metodo como conocio a coogranada
          this.metodosConocio.forEach((elementMetodo : any) => {
            if (+elementMetodo.Value === result.asociadosNaturalesDto.MetodoConocio) {
              this.naturalesAllModel.ConocioCoogranada = elementMetodo.Descripcion;
            }
          });


          if (result.asociadosNaturalesDto.OtroPor !== null && result.asociadosNaturalesDto.OtroPor !== undefined) {
            this.naturalesAllModel.Cual = this.MaysPrimera(result.asociadosNaturalesDto.OtroPor.toLowerCase());
          } else {
            this.naturalesAllModel.Cual = '';
          }

          // formatDate(this.basicosFrom.value.viveDesde, 'yyyy-MM-dd', 'en')
          // fechaModificacionFormat = formatDate(new Date(), 'dd-MM-yyyy', 'en');

          fechaModificacion = new Date();
          this.naturalesAllModel.DiaFechaSoli = fechaModificacion.getDate();
          this.naturalesAllModel.MesFechaSoli = fechaModificacion.getMonth() + 1;
          this.naturalesAllModel.AnoFechaSoli = fechaModificacion.getFullYear();

          //#region INFORMACION PERSONAL
          console.log('#region INFORMACION PERSONAL - ' + this.dataTipoCliente);
          this.dataTipoCliente.forEach((tipoCliente : any) => {
            if (tipoCliente.Clase === result.asociadosNaturalesDto.IdRelacion) {
              this.naturalesAllModel.TipoDeCliente = tipoCliente.Descripcion;
            }
           });

          // mapea el tipo de documento
          console.log('mapea el tipo de documento - ' + this.tiposDocumento);
          if (result.tercerosDto.IdTipoDocumento !== null && result.tercerosDto.IdTipoDocumento !== undefined
            && result.tercerosDto.IdTipoDocumento !== '') {
            this.tiposDocumento.forEach(elementTipoDocu => {
              if (+elementTipoDocu.Value === result.tercerosDto.IdTipoDocumento) {
                this.naturalesAllModel.TipoDocumento = elementTipoDocu.Descripcion;
              }
            });
          } else {
            this.naturalesAllModel.TipoDocumento = null;
          }
       // mapea la nacionalidad 
      if (result.asociadosNaturalesDto.IdNacionalidad !== 0
      && result.asociadosNaturalesDto.IdNacionalidad !== undefined
      && result.asociadosNaturalesDto.IdNacionalidad !== null) {
          this.clientesGetListService.getNacionalidad().subscribe(
          resultN => {
            resultN.forEach((elementN : any) => {
              if (elementN.IdNacionalidad === result.asociadosNaturalesDto.IdNacionalidad) {
              this.naturalesAllModel.Nacionalidad = elementN.Descripcion;
              }
           });
         },);
      }
          // mapea fecha de expedicion
          // fechaExpedicion = new Date(result.tercerosDto.FechaExpDocumento).toLocaleDateString();
          fechaExpedicionFormat = formatDate(result.tercerosDto.FechaExpDocumento, 'MM-dd-yyyy', 'en');
          fechaExpedicion = new Date(fechaExpedicionFormat);

          const dateCompare1 = new Date('01-01-1901');
          const newDateStringExpi = new Date(fechaExpedicionFormat);
          if (newDateStringExpi > dateCompare1) {
            this.naturalesAllModel.DiaFechaExpe = fechaExpedicion.getDate();
            this.naturalesAllModel.MesFechaExpe = fechaExpedicion.getMonth() + 1 ;
            this.naturalesAllModel.AnofechaExpe = fechaExpedicion.getFullYear();
          } else {
            this.naturalesAllModel.DiaFechaExpe = '';
            this.naturalesAllModel.MesFechaExpe = '';
            this.naturalesAllModel.AnofechaExpe = '';
          }

          // mapea documento y nombres
          this.naturalesAllModel.NumeroDocumento = result.tercerosDto.NumeroDocumento;
          this.naturalesAllModel.PrimerNombre = result.tercerosDto.PrimerNombre;
          this.naturalesAllModel.SegundoNombre = result.tercerosDto.SegundoNombre;
          this.naturalesAllModel.PrimerApellido = result.tercerosDto.PrimerApellido;
          this.naturalesAllModel.SegundoApellido = result.tercerosDto.SegundoApellido;
          // mapea fecha de nacimiento

          // fechaNacimiento = new Date(result.tercerosDto.FechaNacimiento).toLocaleDateString();
          fechaNacimientoFormat = formatDate(result.tercerosDto.FechaNacimiento, 'MM-dd-yyyy', 'en');
          fechaNacimiento = new Date(fechaNacimientoFormat);
          const dateCompare2 = new Date('01-01-1901');
          const newDateStringExp = new Date(fechaExpedicionFormat);
          if (newDateStringExp > dateCompare2) {
          this.naturalesAllModel.DiaFechaNaci = fechaNacimiento.getDate();
          this.naturalesAllModel.MesFechaNaci = fechaNacimiento.getMonth() + 1;
          this.naturalesAllModel.AnoFechaNaci = fechaNacimiento.getFullYear();
          } else {
            this.naturalesAllModel.DiaFechaNaci = '';
            this.naturalesAllModel.MesFechaNaci = '';
            this.naturalesAllModel.AnoFechaNaci = '';
          }
          // mapea la ciudad de expedicion
          console.log('mapea la ciudad de expedicion - ' + this.dataCiudad);
          if (result.tercerosDto.IdCiudadExpeDto !== null && result.tercerosDto.IdCiudadExpeDto !== undefined) {
            this.dataCiudadesAllSol.forEach((elementCiu : any) => {
              if (elementCiu.IdCiudad === result.tercerosDto.IdCiudadExpeDto) {
                this.naturalesAllModel.LugarExpedicon = elementCiu.Descripcion;
              }
            });
          } else {
            if (result.tercerosDto.IdPaisExpe !== null && result.tercerosDto.IdPaisExpe !== undefined) {
              this.dataPaisesAllSol.forEach((elementPais : any) => {
                if (elementPais.IdPais === result.tercerosDto.IdPaisExpe) {
                  this.naturalesAllModel.LugarExpedicon = elementPais.Descripcion;
                }
              });
            }
          }
          // mapea el genero
          this.generos.forEach(elementTipoDocu => {
            if (+elementTipoDocu.Value === result.tercerosDto.IdGenero) {
              this.naturalesAllModel.Genero = elementTipoDocu.Descripcion;
            }
          });
          // mapeo ciudad, departamento pais de nacimiento
          if (result.tercerosDto.IdCiudadNto !== null && result.tercerosDto.IdCiudadNto !== undefined
            && result.tercerosDto.IdCiudadNto !== '' && result.tercerosDto.IdCiudadNto !== 0 ) {
            this.dataCiudadesAllSol.forEach((elementCiu : any) => {
              if (elementCiu.IdCiudad === result.tercerosDto.IdCiudadNto) {
                 this.naturalesAllModel.CiudadNto = elementCiu.Descripcion;
                this.dataDepartamentosAllSol.forEach((elementDep : any) => {
                  if (elementDep.IdDepartamento === elementCiu.IdDepartamento) {
                    this.naturalesAllModel.Departamento =  elementDep.Descripcion;
                    this.dataPaisesAllSol.forEach((elementPais : any) => {
                      if (elementPais.IdPais === elementDep.IdPais) {
                        this.naturalesAllModel.Pais = elementPais.Descripcion;
                      }
                    });
                  }
                });
              }
            });
          } else {
            if (result.tercerosDto.IdPaisNto !== null && result.tercerosDto.IdPaisNto !== undefined) {
              this.dataPaisesAllSol.forEach((elementPais : any) => {
                if (elementPais.IdPais === result.tercerosDto.IdPaisNto) {
                  this.naturalesAllModel.Pais = elementPais.Descripcion;
                }
              });
            }
          }
          // mapea el estado civil
          this.estadoCivil.forEach(elementEstadoCivil => {
            if (+elementEstadoCivil.Value === result.asociadosNaturalesDto.IdEstadoCivil) {
              this.naturalesAllModel.EstadoCivil = elementEstadoCivil.Descripcion;
            }
          });
          // mapea personas a cargo
          if (result.asociadosNaturalesDto.NumPersCargo === null || result.asociadosNaturalesDto.NumPersCargo === undefined
            || result.asociadosNaturalesDto.NumPersCargo === '') {
            this.naturalesAllModel.NumeroPersonasCargo = '0';
          } else {
            this.naturalesAllModel.NumeroPersonasCargo = result.asociadosNaturalesDto.NumPersCargo;
          }

          // mapea el nivel de estudio
          this.nivelesEstudio.forEach(elementNivelEstudio => {
            if (+elementNivelEstudio.Value === result.asociadosNaturalesDto.IdNivelEstudio) {
              this.naturalesAllModel.NivelEstudio = elementNivelEstudio.Descripcion;
              }
          });

           
          // mapea la profesion
          // console.log('mapea la profesion - ' + this.dataCiudad);
          this.dataProfesionSol.forEach((elementProfesion : any) => {
            if (elementProfesion.Clase === result.asociadosNaturalesDto.IdTituloProfesional) {
              this.naturalesAllModel.tituloProfesional = elementProfesion.Descripcion;
            }
          });
          // mapea la informacion del Arrendador
          this.naturalesAllModel.NombreArrendador = result.asociadosNaturalesDto.NombreArrendador;
          this.naturalesAllModel.TelefonoArrendador = result.asociadosNaturalesDto.TelefonoArrendador;
          // mapea celular y  correo
          console.log(' // mapea celular y  correo');
          console.log('mapea contactoDto solo console llego hasta aqui');
          console.log('mapea contactoDto' + result.contactoDto);
          if (result.contactoDto !== null && result.contactoDto.length >= 0) {
            console.log('Entro al if - if (result.contactoDto !== null && result.contactoDto.length >= 0) {');
            result.contactoDto.forEach((elementCont : any) => {
              if (elementCont.IdTipoContacto === 6) {
                if (elementCont.ContactoPrincipal) {
                  this.tienePpal = true;
                }
              }
            });

            if (this.tienePpal) {
              result.contactoDto.forEach((elementCont : any) => {
                if (elementCont.IdTipoContacto === 6) {
                  if (elementCont.ContactoPrincipal) {
                    this.naturalesAllModel.NumeroCelular = elementCont.Descripcion;
                  }
                } else if (elementCont.IdTipoContacto === 3) {
                  if (elementCont.ContactoPrincipal) {
                    if (elementCont.Descripcion !== null && elementCont.Descripcion !== undefined && elementCont.Descripcion !== '') {
                      this.naturalesAllModel.CorreoElectronico = elementCont.Descripcion.toLowerCase();
                    } else {
                      this.naturalesAllModel.CorreoElectronico = elementCont.Descripcion;
                    }
                  }

                }
              });
            } else {
              result.contactoDto.forEach((elementCont : any) => {
                if (elementCont.IdTipoContacto === 6) {
                    this.naturalesAllModel.NumeroCelular = elementCont.Descripcion;
                } else if (elementCont.IdTipoContacto === 3) {
                  if (elementCont.ContactoPrincipal) {
                    if (elementCont.Descripcion !== null && elementCont.Descripcion !== undefined && elementCont.Descripcion !== '') {
                      this.naturalesAllModel.CorreoElectronico = elementCont.Descripcion.toLowerCase();
                    } else {
                      this.naturalesAllModel.CorreoElectronico = elementCont.Descripcion;
                    }
                  }
                }
              });
            }
          }
          console.log('Salio del contactoDto y sigue con Ubicacion de la recidencia');
          //#endregion

          //#region UBICACION DE LA RECIDENCIA

          // mapea direccion recidencia
          console.log('mapea direccion recidencia');
          result.contactoDto.forEach((elementRec : any) => {
            // let complementoContato = '';
            if (elementRec.IdTipoContacto === 1) {
              if (elementRec.Descripcion) {
                this.naturalesAllModel.Direccion = this.MaysPrimera(elementRec.Descripcion.toLowerCase());
              } else {
                this.naturalesAllModel.Direccion = elementRec.Descripcion.toLowerCase();
              }
              if (elementRec.IdBarrio !== null && elementRec.IdBarrio !== undefined) {
                this.dataBarriosAllSol.forEach((elementBarr : any) => {
                  if (elementBarr.IdBarrio === elementRec.IdBarrio) {
                    this.naturalesAllModel.BarrioReside = elementBarr.Descripcion;
                  }
                });
              }
              if (elementRec.IdCiudad !== null && elementRec.IdCiudad !== undefined && elementRec.IdCiudad !== '' &&
                elementRec.IdCiudad !== 0 ) {
                this.dataCiudadesAllSol.forEach((elementCiu : any) => {
                  if (elementCiu.IdCiudad === elementRec.IdCiudad) {
                    this.naturalesAllModel.CiudadReside = elementCiu.Descripcion;
                    this.dataDepartamentosAllSol.forEach((elementDep : any) => {
                      if (elementDep.IdDepartamento === elementCiu.IdDepartamento) {
                        this.naturalesAllModel.DepartamentoReside = elementDep.Descripcion;
                        this.dataPaisesAllSol.forEach((elementPais : any) => {
                          if (elementPais.IdPais === elementDep.IdPais) {
                            this.naturalesAllModel.PaisReside = elementPais.Descripcion;
                          }
                        });
                      }
                    });
                  }
                });
              } else {
                this.dataPaisesAllSol.forEach((elementPais : any) => {
                  if (elementPais.IdPais === elementRec.IdPais) {
                    this.naturalesAllModel.PaisReside = elementPais.Descripcion;
                  }
                });
              }
            }
          });
          // mapea telefono recidencia
          console.log('mapea telefono recidencia');
          result.contactoDto.forEach((elementTel : any)=> {
            if (elementTel.IdTipoContacto === 4) {
              this.naturalesAllModel.Telefono = elementTel.Descripcion;
            }
          });
          // mapea el tipo de vivienda
          console.log('mapea el tipo de vivienda');
           this.tiposVivienda.forEach(elementTipoVivienda => {
            if (+elementTipoVivienda.Value === result.asociadosNaturalesDto.IdTipoVivienda) {
              this.naturalesAllModel.TipoVivienda = elementTipoVivienda.Descripcion;
            }
           });
          // mapea la fecha antiguedad de vivienda

           if (result.asociadosNaturalesDto.Fecha_Vive !== null) {
             const dateCompare3 = new Date('01-01-1901');
            const newDateStringVive = new Date(result.asociadosNaturalesDto.Fecha_Vive);
            if (newDateStringVive > dateCompare3) {
              fechaViveDesde = new Date(result.asociadosNaturalesDto.Fecha_Vive);
              this.naturalesAllModel.MesFechaAnti = fechaViveDesde.getMonth() + 1;
              this.naturalesAllModel.AnoFechaAnti = fechaViveDesde.getFullYear();
            } else {
              this.naturalesAllModel.MesFechaAnti = '';
              this.naturalesAllModel.AnoFechaAnti = '';
            }
          }

          //#endregion

          //#region INFORMACION LABORAL
          console.log('mapea INFORMACION LABORAL');
          // mapea la actividad economica
          console.log('mapea la actividad economica - ');
          this.clientesGetListService.GetActividadEconomica(result.asociadosNaturalesDto.IdTipoOcupacion).subscribe(
            resultActividad => {
                resultActividad.forEach((elementActivdad : any) => {
                  if (elementActivdad.Id === result.asociadosNaturalesDto.IdActividadEconomica) {
                    this.naturalesAllModel.CodigoCiiu = elementActivdad.CodigoCiiu;
                    this.naturalesAllModel.ActividadEconomica = elementActivdad.Descripcion;
                  }
                });
            });
          // mapea el tipo de ocupacion o empleo
          this.clientesGetListService.GetTipoOcupacion(result.asociadosNaturalesDto.IdTipoEmpleo).subscribe(
            resultOcupacion => {
              console.log('mapea el tipo de ocupacion o empleo - ' + resultOcupacion);
                resultOcupacion.forEach((elementOcupacion : any) => {
                  if (elementOcupacion.IdTipoOcupacion === result.asociadosNaturalesDto.IdTipoOcupacion) {
                    this.naturalesAllModel.TipoOcupacion = elementOcupacion.Nombre;
                  }
                });
            });
          // mapea direccion laboral
          console.log('mapea contactoDto - ' + result.contactoDto);
          result.contactoDto.forEach((elementlab : any) => {
            if (elementlab.IdTipoContacto === 2) {

              this.naturalesAllModel.DireccionLaboral = elementlab.Descripcion;
              if (elementlab.IdBarrio !== null && elementlab.IdBarrio !== undefined) {
                this.dataBarriosAllSol.forEach((elementBarr : any ) => {
                  if (elementBarr.IdBarrio === elementlab.IdBarrio) {
                    this.naturalesAllModel.BarrioLaboral = elementBarr.Descripcion;
                  }
                });
              }
              if (elementlab.IdCiudad !== null && elementlab.IdCiudad !== undefined) {
                this.dataCiudadesAllSol.forEach((elementCiu : any) => {
                  if (elementCiu.IdCiudad === elementlab.IdCiudad) {
                    this.naturalesAllModel.CiudadLaboral = elementCiu.Descripcion;
                    this.dataDepartamentosAllSol.forEach((elementDep : any) => {
                      if (elementDep.IdDepartamento === elementCiu.IdDepartamento) {
                        this.naturalesAllModel.DepartamentoLaboral = elementDep.Descripcion;
                        this.dataPaisesAllSol.forEach((elementPais : any)=> {
                          if (elementPais.IdPais === elementDep.IdPais) {
                            this.naturalesAllModel.PaisLaboral = elementPais.Descripcion;
                          }
                        });
                      }
                    });
                  }
                });
              } else {
                this.dataPaisesAllSol.forEach((elementPais : any) => {
                  if (elementPais.IdPais === elementlab.IdPais) {
                    this.naturalesAllModel.PaisLaboral = elementPais.Descripcion;
                  }
                });
              }
            }
          });
          // mapea telefono laboral
          result.contactoDto.forEach((elementTel : any) => {
            if (elementTel.IdTipoContacto === 5) {
              this.naturalesAllModel.TelefonoLaboral = elementTel.Descripcion;
            }
          });
          // mapea la empresa donde labora y nit
          result.laboralDto.forEach((elementLaboral : any) => {
            const objClients = new ClientesModel();
            objClients.Nombre = '*';
            objClients.Nit = '*';
            objClients.Codigo = elementLaboral.IdEmpresa;
            if (elementLaboral.IdEmpresa !== 0 && elementLaboral.IdEmpresa !== null &&
              (elementLaboral.IdNatural === null || elementLaboral.IdNatural === 0 || elementLaboral.IdNatural === undefined)) {
              this.clientesGetListService.GetEmpresas(objClients).subscribe(
                resultEmpresa => {
                  this.naturalesAllModel.EmpresaLabora = resultEmpresa[0].Nombre;
                  this.naturalesAllModel.NitLabora = resultEmpresa[0].Nit;
                },
                error => {
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.error(errorMessage);
                }
              );
            } else if (elementLaboral.IdEmpresa !== 0 && elementLaboral.IdEmpresa !== null &&
              (elementLaboral.IdNatural !== null && elementLaboral.IdNatural !== 0 )) {
              this.clientesService.BuscarNaturalLaboral(elementLaboral.IdEmpresa).subscribe(
                resulNatural => {
                  this.naturalesAllModel.EmpresaLabora = resulNatural.PrimerNombre + ' ' + resulNatural.SegundoNombre + ' '
                    + resulNatural.PrimerApellido + ' ' + resulNatural.SegundoApellido;
                },
                error => {
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.error(errorMessage);
                });
            } else {
              if (elementLaboral.EmpresaDescripcion !== null && elementLaboral.EmpresaDescripcion !== undefined ) {
                this.naturalesAllModel.EmpresaLabora = this.MaysPrimera(elementLaboral.EmpresaDescripcion.toLowerCase());
              } else {
                this.naturalesAllModel.EmpresaLabora = elementLaboral.EmpresaDescripcion.toLowerCase();
              }
            }

          });
          // mapea el cargo
          result.laboralDto.forEach((elementLaboral : any) => {
            this.dataCargosSol.forEach((elementCargos : any)=> {
                if (elementCargos.Clase === elementLaboral.IdCargo) {
                  this.naturalesAllModel.CargoOficio = elementCargos.Descripcion;
                }
              });
          });
          // mapea la EPS
          this.dataEmpresasEps.forEach((elementEps : any) => {
              if (elementEps.IdEPS === result.asociadosNaturalesDto.IdEPS) {
                this.naturalesAllModel.Eps = elementEps.Nombre;
              }
          });
          // mapea fecha de antiguedad laboral
          console.log('mapea LaboralDto - ' + result.laboralDto);
          result.laboralDto.forEach((elementlab : any)=> {
          fechaAntiLab = new Date(this.naturalesAllModel.AnosAntiguedadEmpresa = elementlab.FechaLabora);
          this.naturalesAllModel.MesesAntiguedadEmpresa = fechaAntiLab.getMonth() + 1;
          this.naturalesAllModel.AnosAntiguedadEmpresa = fechaAntiLab.getFullYear();
          });
          //  mapea nro empleados a cargo
          result.laboralDto.forEach((elementlab : any) => {
          this.naturalesAllModel.NEmpleados = elementlab.NumPersonasCargo;
          });
          // mapea datos arrendador 
          result.laboralDto.forEach((elementLab : any) => {
            this.naturalesAllModel.NomArrendadorLaboral = elementLab.NombreArrendador;
            this.naturalesAllModel.TeleArrendadorLaboral = elementLab.TelefonoArrendador;
            if (elementLab.IdTipoLocal === 1) {
              this.naturalesAllModel.TipoLocalLaboral = 'Arrendado';
            } else {
              this.naturalesAllModel.TipoLocalLaboral = 'Propio';
            }
          });
          //#endregion

          //#region ENVIO DE CORRESPONDENCIA

          // mapeo envio informacion correspondecia
           result.contactoDto.forEach((elementCont : any) => {
             if (elementCont.Correspondecia === true) {
              this.Correspondencia.forEach(elementCor => {
                if (+elementCor.Value === elementCont.IdTipoContacto) {
                  if (elementCor.Descripcion !== null && elementCor.Descripcion !== undefined && elementCor.Descripcion !== '') {
                    this.naturalesAllModel.Correspondencia = this.MaysPrimera(elementCor.Descripcion.toLowerCase());
                  } else {
                    this.naturalesAllModel.Correspondencia = elementCor.Descripcion.toLowerCase();
                  }
                }
              });
            }
          });
          //#endregion

          //#region INFORMACION FINANCIERA

          this.naturalesAllModel.Salario = 0;
          this.naturalesAllModel.Comisiones = 0;
          this.naturalesAllModel.Arriendos = 0;
          this.naturalesAllModel.OtrosIngresos = 0;
          this.naturalesAllModel.CostosGastos = 0;
          this.naturalesAllModel.ValorArriendo = 0;
          this.naturalesAllModel.ObligacionesFinancieras = 0;
          this.naturalesAllModel.OtrasObligaciones = 0;
          this.naturalesAllModel.GastosFamiliares = 0;
          this.naturalesAllModel.OtrosEgresos = 0;
          console.log('INFORMACION FINANCIERA - ' + result.financieroDto);
          result.financieroDto.forEach((elementFin : any) => {
            // salario
            if (elementFin.IdConceptoFinan === 10 || elementFin.IdConceptoFinan === 11) {
              this.naturalesAllModel.Salario = this.naturalesAllModel.Salario + elementFin.Valor;
              // comisiones
            } if (elementFin.IdConceptoFinan === 3) {
              this.naturalesAllModel.Comisiones = this.naturalesAllModel.Comisiones + elementFin.Valor;
              // Arriendos
            } if (elementFin.IdConceptoFinan === 1) {
              this.naturalesAllModel.Arriendos = this.naturalesAllModel.Arriendos + elementFin.Valor;
              // otros ingresos
            } if (elementFin.IdConceptoFinan === 9) {
              this.naturalesAllModel.OtrosIngresos = this.naturalesAllModel.OtrosIngresos + elementFin.Valor;
            }
              // total Ingresos
              this.naturalesAllModel.TotalIngresos = (+this.naturalesAllModel.Salario +
              +this.naturalesAllModel.Comisiones + +this.naturalesAllModel.Arriendos + +this.naturalesAllModel.OtrosIngresos);
              // costos y gastos
            if (elementFin.IdConceptoFinan === 12) {
              this.naturalesAllModel.CostosGastos = this.naturalesAllModel.CostosGastos + elementFin.Valor;
            }
              // total ingresos operacionales
            this.naturalesAllModel.TotalIngresosOperacionales = (this.naturalesAllModel.TotalIngresos -
              this.naturalesAllModel.CostosGastos);


              // valor arriendo
             if (elementFin.IdConceptoFinan === 2) {
              this.naturalesAllModel.ValorArriendo = this.naturalesAllModel.ValorArriendo + elementFin.Valor;
              // obligaciones financieras
            } if (elementFin.IdConceptoFinan === 6) {
              this.naturalesAllModel.ObligacionesFinancieras = this.naturalesAllModel.ObligacionesFinancieras + elementFin.Valor;
              // Otras obligaciones
            }  if (elementFin.IdConceptoFinan === 7) {
              this.naturalesAllModel.OtrasObligaciones = this.naturalesAllModel.OtrasObligaciones + elementFin.Valor;
              // gastos familiares
            } if (elementFin.IdConceptoFinan === 5) {
              this.naturalesAllModel.GastosFamiliares = this.naturalesAllModel.GastosFamiliares + elementFin.Valor;
              // otros egresos
            }  if (elementFin.IdConceptoFinan === 8) {
              this.naturalesAllModel.OtrosEgresos =  this.naturalesAllModel.OtrosEgresos + elementFin.Valor;
            }
              // total egresos
            this.naturalesAllModel.TotalEgresos = (this.naturalesAllModel.ValorArriendo + this.naturalesAllModel.ObligacionesFinancieras
              + this.naturalesAllModel.OtrasObligaciones + this.naturalesAllModel.GastosFamiliares + this.naturalesAllModel.OtrosEgresos);
          });



          // total activos
          this.naturalesAllModel.TotalActivos = 0;
          console.log('INFORMACION FINANCIERA - ' + result.activoDto);
          result.activoDto.forEach((elementAct : any) => {
            this.naturalesAllModel.TotalActivos = this.naturalesAllModel.TotalActivos + elementAct.AvaluoComercial;
          });
          // total pasivos
          this.naturalesAllModel.TotalPasivos = result.asociadosNaturalesDto.TotalPasivos;
          // total patrimonio
          this.naturalesAllModel.TotalPatrimonio = this.naturalesAllModel.TotalActivos - this.naturalesAllModel.TotalPasivos;

          //#endregion

          //#region ACTIVOS
          let PlacaUpper = '';
          result.activoDto.forEach((elementActivos : any) => {
            if (elementActivos.IdActivo === 1) {
              if (elementActivos.IdCiudad !== undefined && elementActivos.IdCiudad !== null && elementActivos.IdCiudad !== '' && 
                elementActivos.IdCiudad !== 0) {
                this.dataCiudadesAllSol.forEach((elementCiu : any) => {
                  if (elementCiu.IdCiudad === elementActivos.IdCiudad) {
                    this.naturalesAllModel.CiudadActivo = elementCiu.Descripcion;
                  }
                });
              } else {
                this.dataPaisesAllSol.forEach((elementPais : any) => {
                  if (elementPais.IdPais === elementActivos.IdPais) {
                    this.naturalesAllModel.CiudadActivo = elementPais.Descripcion;
                  }
                });
              }
              this.dataActivosAllSol.forEach((elementPat : any) => {
                if (elementPat.Id === elementActivos.IdTipoPatrimonio) {
                  this.naturalesAllModel.TipoPropiedad = elementPat.Descripcion;
                }
              });
              if (elementActivos.EntidadHipoPignora === 'false' || elementActivos.EntidadHipoPignora === false ||
                elementActivos.EntidadHipoPignora === null || elementActivos.EntidadHipoPignora === undefined  ) {
                elementActivos.aFavor = 'No';
              }

              this.ArrayPropiedad.push(
                {
                'TipoActivo': this.naturalesAllModel.TipoPropiedad,
                'Direccion': this.MaysPrimera(elementActivos.Direccion.toLowerCase()),
                'Ciudad':  this.naturalesAllModel.CiudadActivo,
                'Valor': elementActivos.AvaluoComercial,
                'ValorDeuda': elementActivos.ValorAdeudado,
                'Afavor': this.MaysPrimera(elementActivos.aFavor.toLowerCase()),
              }
              );
            } else if (elementActivos.IdActivo === 2) {
              this.dataActivosAllSol.forEach((elementPat : any ) => {
                if (elementPat.Id === elementActivos.IdTipoPatrimonio) {
                  this.naturalesAllModel.TipoVehiculo = elementPat.Descripcion;
                }
              });
              if (elementActivos.IdMarca !== null && elementActivos.IdMarca !== undefined &&
                elementActivos.IdMarca !== '' && elementActivos.IdMarca !== 0) {
                this.dataMarcasSol.forEach((elementMarc : any) => {
                  if (elementMarc.Clase === elementActivos.IdMarca) {
                      this.naturalesAllModel.Marca = elementMarc.Descripcion;
                  }
                });
              } else {
                this.naturalesAllModel.Marca = 'N/A';
              }

              if (elementActivos.EntidadHipoPignora === 'false' || elementActivos.EntidadHipoPignora === false ||
                elementActivos.EntidadHipoPignora === null || elementActivos.EntidadHipoPignora === undefined) {
                elementActivos.aFavor = 'No';
              }
              if (elementActivos.Placa !== null && elementActivos.Placa !== undefined && elementActivos.Placa !== '') {
                 PlacaUpper = elementActivos.Placa.toUpperCase();
              } else {
                 PlacaUpper = elementActivos.Placa;
              }
              this.ArrayVehiculo.push( {
               'TipoActivo': this.naturalesAllModel.TipoVehiculo,
                'Marca': this.naturalesAllModel.Marca.toLowerCase(),
                'Modelo': elementActivos.Modelo,
                'Placa': PlacaUpper,
                'Valor': elementActivos.AvaluoComercial,
                'ValorPignorado': elementActivos.ValorHipoteca,
                'Afavor': this.MaysPrimera(elementActivos.aFavor.toLowerCase()),
              }
              );
            } else {
              this.dataActivosAllSol.forEach((elementPat : any) => {
                if (elementPat.Id === elementActivos.IdTipoPatrimonio) {
                  this.naturalesAllModel.TipoVehiculo = elementPat.Descripcion;
                }
              });
              if (elementActivos.IdCiudad !== null && elementActivos.IdCiudad !== undefined && elementActivos.IdCiudad !== ''
                && elementActivos.IdCiudad !== 0) {
                this.dataCiudadesAllSol.forEach((elementC : any) => {
                  if (elementC.IdCiudad === elementActivos.IdCiudad) {
                    this.naturalesAllModel.CiudadActivo = elementC.Descripcion;
                  }
                });
              } else if (elementActivos.IdPais !== null && elementActivos.IdPais !== undefined) {
                this.dataPaisesAllSol.forEach((elementPais : any)=> {
                  if (elementPais.IdPais === elementActivos.IdPais) {
                    this.naturalesAllModel.CiudadActivo = elementPais.Descripcion;
                  }
                });
              }

              if (elementActivos.DescripcionOtro === null || elementActivos.DescripcionOtro === undefined) {
                elementActivos.DescripcionOtro = '';
              }
              this.ArrayOtros.push({
                'TipoActivo': this.naturalesAllModel.TipoVehiculo,
                'Ciudad': this.naturalesAllModel.CiudadActivo,
                'Descripcion': this.MaysPrimera(elementActivos.DescripcionOtro.toLowerCase()),
                'Valor': elementActivos.AvaluoComercial,
              });
            }

          });
          //#endregion

          //#region INFORMACION CONYUGUE

          if (result.conyugueDto !== null) {

            // mapea tipo de documento
            this.tiposDocumentoConyugue.forEach(elementTipoDocuC => {
              if (+elementTipoDocuC.Value === result.conyugueDto.IdTipoDocumento) {
                this.naturalesAllModel.TipoDocConyugue = elementTipoDocuC.Descripcion;
              }
            });

            // mapea datos conyugue
            this.naturalesAllModel.DocumentoConyugue = result.conyugueDto.Documento;
            this.naturalesAllModel.PrimerApellidoConyugue = result.conyugueDto.PrimerApellido;
            this.naturalesAllModel.SegundoApellidoConyugue = result.conyugueDto.SegundoApellido;
            this.naturalesAllModel.PrimerNombreConyugue = result.conyugueDto.PrimerNombre;
            this.naturalesAllModel.SegundoNombreConyugue = result.conyugueDto.SegundoNombre;
            this.naturalesAllModel.TelefonoRConyugue = result.conyugueDto.TelefonoResidencia;
            this.naturalesAllModel.CelularConyugue = result.conyugueDto.NumeroCelular;
            if (result.conyugueDto.NombreEmpresa !== null && result.conyugueDto.NombreEmpresa !== ''
              && result.conyugueDto.NombreEmpresa !== undefined) {
              this.naturalesAllModel.EmpresaLaboraConyugue = (result.conyugueDto.NombreEmpresa);
            } else {
              this.naturalesAllModel.EmpresaLaboraConyugue = '';
            }
            this.clientesGetListService.GetTipoOcupacion('0').subscribe(
              resultOcupacionConyugue => {
                resultOcupacionConyugue.forEach((elementOcuC : any) => {
                  if (elementOcuC.IdOcupacion === result.conyugueDto.IdOcupacion) {
                    this.naturalesAllModel.OcupacionConyugue = elementOcuC.Nombre;
                  }
                });
              });

            this.naturalesAllModel.IngresosConyugue = result.conyugueDto.Ingresos;
            this.naturalesAllModel.EgresosConyugue = result.conyugueDto.Egresos;
            this.naturalesAllModel.NitEmpresaConyugue = result.conyugueDto.NitEmpresa;
            this.naturalesAllModel.AntiguedadEmpConyugue = result.conyugueDto.Antiguedad;
            if (this.naturalesAllModel.AntiguedadEmpConyugue !== null && this.naturalesAllModel.AntiguedadEmpConyugue !== undefined
              && this.naturalesAllModel.AntiguedadEmpConyugue !== '') {
              const antiguedad = this.naturalesAllModel.AntiguedadEmpConyugue.split('|');
              if (antiguedad[0] !== 'null' && antiguedad[1] !== 'null') {
                this.naturalesAllModel.MesesAntiguedadEmpresaConyugue = antiguedad[0];
                this.naturalesAllModel.AnosAntiguedadEmpresaConyugue = antiguedad[1];
              }
            }

            this.naturalesAllModel.TelefonoEmpresaConyugue = result.conyugueDto.TelEmpresa;
            if (result.conyugueDto.DetalleOcupacion !== null && result.conyugueDto.DetalleOcupacion !== undefined
              && result.conyugueDto.DetalleOcupacion !== '') {
              this.naturalesAllModel.DetallesOcupacionConyugue = this.MaysPrimera(result.conyugueDto.DetalleOcupacion.toLowerCase());
            } else {
              this.naturalesAllModel.DetallesOcupacionConyugue = result.conyugueDto.DetalleOcupacion;
            }

          }
          //#endregion

          //#region INFORMACION ENTREVISTA
            result.entrevistaDto.forEach((element : any) => {

              if (result.asociadosNaturalesDto.PersPEP) { // peronsa PEPS
                this.naturalesAllModel.PersonaPEPS = 'Si';
              } else {
                this.naturalesAllModel.PersonaPEPS = 'No';
              }
              if (element.NumeroPregunta === 1) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.Administradineros = 'Si';
                } else {
                  this.naturalesAllModel.Administradineros = 'No';
                }
              }
              if (element.NumeroPregunta === 2) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.OtraActividad = 'Si';
                } else {
                  this.naturalesAllModel.OtraActividad = 'No';
                }
              }
              if (element.NumeroPregunta === 3) {
                if (element.Respuesta !== null && element.Respuesta !== undefined && element.Respuesta !== '') {
                  this.naturalesAllModel.CualActivdad = this.MaysPrimera(element.Respuesta.toLowerCase());
                } else {
                  this.naturalesAllModel.CualActivdad = element.Respuesta;
                }
              }
              if (element.NumeroPregunta === 4) {
                this.naturalesAllModel.GanaActividad = element.Respuesta;
              }
              if (element.NumeroPregunta === 5) {
                this.naturalesAllModel.ValorPromedio = element.Respuesta;
              }
              if (element.NumeroPregunta === 6) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.OperacionMonedaExtrangera = 'Si';
                } else {
                  this.naturalesAllModel.OperacionMonedaExtrangera = 'No';
                }
              }
              if (element.NumeroPregunta === 7) { // Entidad
                this.naturalesAllModel.Entidad = element.Respuesta;
              }
              if (element.NumeroPregunta === 8) { // importa
                this.mostrarImporta = Boolean(element.Respuesta);
              }
              if (element.NumeroPregunta === 9) { // exporta
                this.mostrarExporta = Boolean(element.Respuesta);
              }
              if (element.NumeroPregunta === 10) { // giros
                this.mostrarGiros = Boolean(element.Respuesta);
              }
              if (element.NumeroPregunta === 11) { // tipoProducto
                this.naturalesAllModel.TipoProducto = element.Respuesta;
              }
              if (element.NumeroPregunta === 12) { // Pais
                if (element.Respuesta !== '' && element.Respuesta !== null) {
                  this.dataPaisesAllSol.forEach((elementPaises : any ) => {
                    if (elementPaises.IdPais === +element.Respuesta) {
                      this.naturalesAllModel.PaiseEntrevista = elementPaises.Descripcion.replace('Pais', '');
                    }
                  });
                } else {
                  this.naturalesAllModel.PaiseEntrevista = '';
                }
              }
              if (element.NumeroPregunta === 13) { // ciudad operacion
                this.naturalesAllModel.Ciudadoperacion = element.Respuesta;
              }
              if (element.NumeroPregunta === 24) { // Monto promedio
                this.naturalesAllModel.MontoPromedio = element.Respuesta;
              }
              if (element.NumeroPregunta === 25) { // Moneda operacion
                if (element.Respuesta !== '' && element.Respuesta !== null) {
                  this.dataDivisasSol.forEach((elementDivisas : any) => {
                    if (elementDivisas.Id === +element.Respuesta) {
                      this.naturalesAllModel.Moneda = elementDivisas.Nombre;
                    }
                  });
                } else {
                  this.naturalesAllModel.Moneda = '';
                }
              }
              if (element.NumeroPregunta === 14) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.TieneInversionMonedaExtrangera = 'Si';
                } else {
                  this.naturalesAllModel.TieneInversionMonedaExtrangera = 'No';
                }
              }
              if (element.NumeroPregunta === 15) {
                if (element.Respuesta !== '' && element.Respuesta !== null) {
                  this.dataPaisesAllSol.forEach((elementPaises : any) => {
                    if (elementPaises.IdPais === +element.Respuesta) {
                      this.naturalesAllModel.PaisTiene = elementPaises.Descripcion;
                    }
                  });
                } else {
                  this.naturalesAllModel.PaisTiene = '';
                }
              }
              if (element.NumeroPregunta === 16) {
                if (element.Respuesta !== '' && element.Respuesta !== null) {
                  this.dataDivisasSol.forEach((elementDivisas : any) => {
                    if (elementDivisas.Id === +element.Respuesta) {
                      this.naturalesAllModel.MonedaTiene = elementDivisas.Nombre;
                    }
                  });
                } else {
                  this.naturalesAllModel.MonedaTiene = '';
                }
              }
              if (element.NumeroPregunta === 17) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.PoseeCuentaMonedaExtrangera = 'Si';;
                } else {
                  this.naturalesAllModel.PoseeCuentaMonedaExtrangera = 'No';
                }
              }
              if (element.NumeroPregunta === 29) {
                  this.naturalesAllModel.CuentaMonedaExtrangera = element.Respuesta;                
              }
              if (element.NumeroPregunta === 18) {
                if (element.Respuesta !== '' && element.Respuesta !== null) {
                  this.dataPaisesAllSol.forEach((elementPaises : any) => {
                    if (elementPaises.IdPais === +element.Respuesta) {
                      this.naturalesAllModel.PaisPosee = elementPaises.Descripcion;
                    }
                  });
                } else {
                  this.naturalesAllModel.PaisPosee = '';
                }
              }
              if (element.NumeroPregunta === 19) {
                if (element.Respuesta !== '' && element.Respuesta !== null) {
                  this.dataDivisasSol.forEach((elementDivisas : any) => {
                    if (elementDivisas.Id === +element.Respuesta) {
                      this.naturalesAllModel.MonedaPosee = elementDivisas.Nombre;
                    }
                  });
                } else {
                  this.naturalesAllModel.MonedaPosee = '';
                }
              }
              if (element.NumeroPregunta === 20) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.PersonaPEPS = 'Si';
                } else {
                  this.naturalesAllModel.PersonaPEPS = 'No';
                }
              }
              if (element.NumeroPregunta === 21) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.ManejaRecursosPublicos = 'Si';
                } else {
                  this.naturalesAllModel.ManejaRecursosPublicos = 'No';
                }
              }
              if (element.NumeroPregunta === 22) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.PorCargoPoderPublico = 'Si';
                } else {
                  this.naturalesAllModel.PorCargoPoderPublico = 'No';
                }
              }
              if (element.NumeroPregunta === 23) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.VinculoEntreUnPeps = 'Si';
                } else {
                  this.naturalesAllModel.VinculoEntreUnPeps = 'No';
                }
              }
              if (element.NumeroPregunta === 26) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.PorActividadPoderPublico = 'Si';
                } else {
                  this.naturalesAllModel.PorActividadPoderPublico = 'No';
                }
              }
              if (element.NumeroPregunta === 28) {
                if (element.Respuesta === 'true') {
                  this.naturalesAllModel.DeclaroQueNoTransacciones = 'Si';
                } else {
                  this.naturalesAllModel.DeclaroQueNoTransacciones = 'No';
                }
              }

            });
          //#endregion

          //#region LISTA PEPS
          if (result.listaDePeps !== null) {
            if (result.listaDePeps.length > 0) {
              result.listaDePeps.forEach((element : any) => {
                if (element.NombreCompleto !== null && element.NombreCompleto !== undefined && element.NombreCompleto !== '') {
                  this.naturalesAllModel.NombreCompleto = this.MaysPrimera(element.NombreCompleto.toLowerCase());
                } else {
                  this.naturalesAllModel.NombreCompleto = element.NombreCompleto;
                }
                this.naturalesAllModel.IdentitificacionPeps = element.Identificacion;
                this.naturalesAllModel.Periodo = element.PeriodoDesde;
                this.dataCargosSol.forEach((elementCargos : any) => {
                  if (elementCargos.Clase === +element.Cargo) {
                    this.naturalesAllModel.Cargo = elementCargos.Descripcion;
                  }
                });
                this.dataParentescosSol.forEach((elementParent : any ) => {
                  if (elementParent.IdParentesco === +element.IdParentesco) {
                    this.naturalesAllModel.Parentesco = elementParent.Descripcion;
                  }
                });
                this.ArrayPeps.push(
                  {
                    'NombrePeps': this.naturalesAllModel.NombreCompleto,
                    'DocumentoPeps': this.naturalesAllModel.IdentitificacionPeps,
                    'Periodo': this.naturalesAllModel.Periodo,
                    'Cargo': this.naturalesAllModel.Cargo,
                    'Parentesco': this.naturalesAllModel.Parentesco
                  }
                );
              });
            }
          }
          
          //#endregion

          //#region REFERENCIAS
          console.log('INFORMACION REFERENCIAS - ' + result.referenciaDto);
          result.referenciaDto.forEach((elementDatoRef : any) => {
            if (elementDatoRef.IdTipoReferencia === 2) {
              console.log('informacion dataParentesco - ' + this.dataParentescosSol);
              this.dataParentescosSol.forEach((elementParent : any) => {
                if (elementParent.Clase === elementDatoRef.IdParentesco) {
                  this.naturalesAllModel.ParentescoFamiliar = elementParent.Descripcion;
                }
              });

              if (elementDatoRef.PrimerNombre === null || elementDatoRef.PrimerNombre === 'null') {
                elementDatoRef.PrimerNombre = '';
              }
              if (elementDatoRef.PrimerApellido === null || elementDatoRef.PrimerApellido === 'null') {
                elementDatoRef.PrimerApellido = '';
              }
              if (elementDatoRef.SegundoNombre === null || elementDatoRef.SegundoNombre === 'null') {
                elementDatoRef.SegundoNombre = '';
              }
              if (elementDatoRef.SegundoApellido === null || elementDatoRef.SegundoApellido === 'null') {
                elementDatoRef.SegundoApellido = '';
              }

              const PrimerNombreMayu = this.MaysPrimera(elementDatoRef.PrimerNombre.toLowerCase());
              const PrimerApellidoMayu = this.MaysPrimera(elementDatoRef.PrimerApellido.toLowerCase());
              const SegundoNombreMayu = this.MaysPrimera(elementDatoRef.SegundoNombre.toLowerCase());
              const SegundoApellidoMayu = this.MaysPrimera(elementDatoRef.SegundoApellido.toLowerCase());

              if (this.ArrayFamiliar.length <= 2) {
                  this.ArrayFamiliar.push({
                    'Nombre': PrimerNombreMayu + ' ' + SegundoNombreMayu  + ' '
                      + PrimerApellidoMayu + ' ' + SegundoApellidoMayu,
                    'parentesco': this.naturalesAllModel.ParentescoFamiliar,
                    'Telefono1': elementDatoRef.TelefonoContacto,
                    'Telefono2': elementDatoRef.Celular,
                    'Telefono3': elementDatoRef.TelefonoEmpresa,
                  });
              }
            }
            if (elementDatoRef.IdTipoReferencia === 4) {
              console.log('informacion dataParentesco - ' + this.dataParentescosSol);
              this.dataParentescosSol.forEach((elementParent : any) => {
                if (elementParent.Clase === elementDatoRef.IdParentesco) {
                  this.naturalesAllModel.parentescoPersonal = elementParent.Descripcion;
                }
              });

              if (elementDatoRef.PrimerNombre === null || elementDatoRef.PrimerNombre === 'null') {
                elementDatoRef.PrimerNombre = '';
              }
              if (elementDatoRef.PrimerApellido === null || elementDatoRef.PrimerApellido === 'null') {
                elementDatoRef.PrimerApellido = '';
              }
              if (elementDatoRef.SegundoNombre === null || elementDatoRef.SegundoNombre === 'null') {
                elementDatoRef.SegundoNombre = '';
              }
              if (elementDatoRef.SegundoApellido === null || elementDatoRef.SegundoApellido === 'null') {
                elementDatoRef.SegundoApellido = '';
              }
              const PrimerNombreMayu = this.MaysPrimera(elementDatoRef.PrimerNombre.toLowerCase());
              const PrimerApellidoMayu = this.MaysPrimera(elementDatoRef.PrimerApellido.toLowerCase());
              const SegundoNombreMayu = this.MaysPrimera(elementDatoRef.SegundoNombre.toLowerCase());
              const SegundoApellidoMayu = this.MaysPrimera(elementDatoRef.SegundoApellido.toLowerCase());

              if (this.ArrayPersonal.length <= 2) {
                  this.ArrayPersonal.push({
                    'Nombre': PrimerNombreMayu + ' ' + SegundoNombreMayu  + ' '
                      + PrimerApellidoMayu + ' ' + SegundoApellidoMayu,
                    'parentesco': this.naturalesAllModel.parentescoPersonal,
                    'Telefono1': elementDatoRef.TelefonoContacto,
                    'Telefono2': elementDatoRef.Celular,
                    'Telefono3': elementDatoRef.TelefonoEmpresa,
                  });
              }
            }
            if (elementDatoRef.IdTipoReferencia === 1) {

              if (elementDatoRef.IdCiudad !== 0 && elementDatoRef.IdCiudad !== null) {
                let serPro = '';
                let descripcionEmpresa = '';
                if (elementDatoRef.ServicioProducto !== null && elementDatoRef.ServicioProducto !== undefined) {
                  serPro = elementDatoRef.ServicioProducto.toLowerCase();
                }
                // console.log('informacion dataCiudad - ' + this.dataCiudad);
                this.dataCiudadesAllSol.forEach((elementCiudad : any) => {
                  if (elementCiudad.IdCiudad === elementDatoRef.IdCiudad) {
                    if (this.ArrayComercial.length <= 2) {
                      if (elementDatoRef.DescripcionEmpresa !== null && elementDatoRef.DescripcionEmpresa !== undefined) {
                        descripcionEmpresa = this.MaysPrimera(elementDatoRef.DescripcionEmpresa.toLowerCase());
                      } else {
                        descripcionEmpresa = '';
                      }
                      this.ArrayComercial.push({
                        'Nombre': descripcionEmpresa,
                        'Telefono': elementDatoRef.TelefonoEmpresa,
                        'Ciudad': elementCiudad.Descripcion,
                        'Servicio': this.MaysPrimera(serPro),
                      });
                    }
                  }
                });
              } else if (elementDatoRef.IdPais !== 0 && elementDatoRef.IdPais !== null) {
                let serPro = '';
                let descripcionEmpresa = '';
                if (elementDatoRef.ServicioProducto !== null && elementDatoRef.ServicioProducto !== undefined) {
                  serPro = elementDatoRef.ServicioProducto.toLowerCase();
                }
                // console.log('informacion dataCiudad - ' + this.dataCiudad);
                this.dataPaisesAllSol.forEach((elementPais : any) => {
                  if (elementPais.IdPais === elementDatoRef.IdPais) {
                    if (this.ArrayComercial.length <= 2) {
                      if (elementDatoRef.DescripcionEmpresa !== null && elementDatoRef.DescripcionEmpresa !== undefined) {
                        descripcionEmpresa = this.MaysPrimera(elementDatoRef.DescripcionEmpresa.toLowerCase());
                      } else {
                        descripcionEmpresa = '';
                      }
                      this.ArrayComercial.push({
                        'Nombre': descripcionEmpresa,
                        'Telefono': elementDatoRef.TelefonoEmpresa,
                        'Ciudad': elementPais.Descripcion,
                        'Servicio': this.MaysPrimera(serPro),
                      });
                    }
                  }
                });
              } else {
                let serPro = '';
                if (elementDatoRef.ServicioProducto !== null && elementDatoRef.ServicioProducto !== undefined) {
                  serPro = elementDatoRef.ServicioProducto.toLowerCase();
                }
                if (this.ArrayComercial.length <= 2) {
                    this.ArrayComercial.push({
                      'Nombre': elementDatoRef.DescripcionEmpresa,
                      'Telefono': elementDatoRef.TelefonoEmpresa,
                      'Ciudad': elementDatoRef.IdCiudad,
                      'Servicio': this.MaysPrimera(serPro),
                    });
                }
              }

            }
            if (elementDatoRef.IdTipoReferencia === 3) {
              let serPro = '';
              if (elementDatoRef.IdCiudad !== 0 && elementDatoRef.IdCiudad !== null) {
                // console.log('informacion dataCiudad - ' + this.dataCiudad);
                this.dataCiudadesAllSol.forEach((elementCiudad : any) => {
                  if (elementCiudad.IdCiudad === elementDatoRef.IdCiudad) {
                    if (this.ArrayFinanciaria.length <= 2) {
                      if (elementDatoRef.ServicioProducto !== null && elementDatoRef.ServicioProducto !== undefined) {
                        serPro = elementDatoRef.ServicioProducto.toLowerCase();
                      }
                      this.ArrayFinanciaria.push({
                        'Nombre': this.MaysPrimera(elementDatoRef.DescripcionEmpresa.toLowerCase()),
                        'Telefono': elementDatoRef.TelefonoEmpresa,
                        'Oficina': elementCiudad.Descripcion,
                        'Servicio': this.MaysPrimera(serPro),
                        'NroServicio': elementDatoRef.NumeroProducto,
                      });

                    }
                  }
                });

              } else {
                if (this.ArrayFinanciaria.length <= 1) {
                  if (elementDatoRef.ServicioProducto !== null && elementDatoRef.ServicioProducto !== undefined) {
                    serPro = elementDatoRef.ServicioProducto.toLowerCase();
                  }
                    this.ArrayFinanciaria.push({
                      'Nombre': this.MaysPrimera(elementDatoRef.DescripcionEmpresa.toLowerCase()),
                      'Telefono': elementDatoRef.TelefonoEmpresa,
                      'Oficina': elementDatoRef.IdOficina,
                      'Servicio': serPro,
                      'NroServicio': elementDatoRef.NumeroProducto,
                    });
                }
              }
            }


            });
          // #endregion

          this.openSolicitudModal.nativeElement.click();
          this.loading = false;
        }
      },
      error => {
        console.error('BuscarNaturalesAllSolicitudImpresion - ' + error);
      });
  }

  MonthDiff = function (d1 : Date, d2 : Date) {
    if (d2 < d1) {
      const dTmp = d2;
      d2 = d1;
      d1 = dTmp;
    }

    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();

    if (d1.getDate() <= d2.getDate()) {
      months += 1;
    }
    return months;
  };

  MaysPrimera(string : string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  print(){
    this.htmlTo.HtmlToPdf("FormatoDeServicios","p",[884,3576])
    //
  }
}
