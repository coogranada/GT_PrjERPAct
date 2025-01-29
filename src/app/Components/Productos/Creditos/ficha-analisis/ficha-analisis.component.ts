import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import swal from 'sweetalert2';
import { map } from 'rxjs/internal/operators/map';
import { retry, delay } from 'rxjs/operators';
import { EnvironmentService } from '../../../../Services/Enviroment/enviroment.service';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { WindowRef } from '../../../../Services/Enviroment/WindowRef.service';
import { LoginService } from '../../../../Services/Login/login.service';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';
import { fichaAnalisisService } from '../../../../Services/Productos/fichaAnalisis.service';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  parseXML } from 'jquery';
import { CheckList, FADeudor, LogFichaAnalisis, ObligacionesExtinguidas, ObligacionesVigentes, DtosAttachFiles}from '../../../../Models/Productos/ficha-analisis.model';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
@Component({
  selector: 'app-ficha-analisis',
  templateUrl: './ficha-analisis.component.html',
  styleUrls: ['./ficha-analisis.component.css'],
  providers: [fichaAnalisisService, EnvironmentService, GeneralesService, ModuleValidationService, LoginService, OperacionesService],
  standalone : false
})
export class FichaAnalisisComponent implements OnInit {

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 75;

  //forms
  public FichaOperacionForm!: FormGroup;
  public FichaAnalisisDataForm!: FormGroup;
  public FichaAnalisisForm!: FormGroup;
  public CodeudorForm!: FormGroup;
  public DataUserLogeado : any;
  public dataUser : any;
  public docCodSelected = "";
  public ArrayInfoFinanciera : any[] = [];
  public VigentesPrin : any[] = [];
  public VigentesCode : any[]= [];
  public ExtinguidasPrin : any[]= [];
  public ExtinguidasCode : any[]= [];
  public MaxReal = 0
  public MaxFinan = 0;
  public MaxFinanCoogra = 0;
  
  //resultadosServices
  public resultOperaciones : any;
  public resultadoInfoRadicado : any[] = [];
  public resultadoCodeudores :any[] = [];
  public codSelected : any[] = [];
  public resultInfoFinanciera : any;

  //inputs
  public FormRadicado : boolean | null = true;

  //data
  public dataInsert = new FADeudor();
  public dataInsertCode!: Array<FADeudor>;
  public dataAttachFiles = new DtosAttachFiles();
  public jsonDto: any;
  public dataInsertLog = new LogFichaAnalisis();
  public dataDeudores : any[] = [];
  public dataTrazabilidad :any[]= [];
  public dataCuentas : any[] = [];
  public dataCodeInicial : any[]= [];
  
  //
  public dataInsertInicialCode!: any | Array<FADeudor>;
  public dataInsertFinalCode!: any | FADeudor[];
  public dataInsertInicial!: any |FADeudor;
  public dataInsertFinal!: any | FADeudor;
  
  //elementos
  public contenidoCodigo : any;
  public radicadoActual : any;
  public btn = true;
  public btnGuardar = false;
  public btnCuentas = false;
  public BloquearBoton : boolean | null = false;
  public BloquearBotonGuardar : boolean | null = null;
  public strOficina = "";
  public strDatos = "";
  public contenidoBoton = "Guardar"
  public currencyOptions = { prefix: '$ ', thousands: '.', decimal: ',', precision: 2 };
  public currencyCap = {align: 'left', suffix : ' %' ,prefix: '', allowNegative:false ,thousands: '', decimal: '.', precision: 2 };
  public linkPdf: any;
  public infoRadicado = false;
  public crear = true;
  public infoPdfTrue = false;
  public bloquearBuscar : boolean | null = null;
  public bloquearBuscarEmpresa : boolean | null = null;
  public errorAvaluo = false;
  public errorExpirianAso = false;
  public errorExpirianCode = false;
  public btnEnviarWorkF : boolean | null= false;
  public workFlowId : any;
  public detalleTrazabilidad = false;
  public esJuridico : any;
  
  constructor(private winRef: WindowRef, private notif: NgxToastService,
    private envirment: EnvironmentService, private moduleValidationService: ModuleValidationService, private el: ElementRef,
    private loginService: LoginService, private router: Router, private operacionesService: OperacionesService,
    private generalesService: GeneralesService,
    private FichaAnalisisService: fichaAnalisisService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  ngOnInit() {
    this.Operaciones();
    this.ValidacionForm();
    /*this.DataUserLogeado = JSON.parse(JSON.parse(window.atob(localStorage.getItem('Data'))));
    console.log(this.DataUserLogeado) */
    this.generalesService.Autofocus('opcionOperacion');
  }

  

  Operaciones() {
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    const arrayExample = [{
      'idPerfil': this.dataUser.idPerfilUsuario,
      'idUsuario': this.dataUser.IdUsuario,
      'idModulo': this.CodModulo
      //'IdOperaciones': '',
      //'IdOperacionesPerfil': '',
    }];
    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(
      result => {
        this.resultOperaciones = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  ObteneInfoFinanciera(Aso : any) {
    this.FichaAnalisisService.BuscarInfoFinanciera(Aso).subscribe(
      result => {
        this.resultInfoFinanciera = result;
        this.resultInfoFinanciera[0] = this.ValoresXml2Json(result[0]);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage)
      }
    )
  }
  fueEnviadoAlWM() {
    if (this.resultadoInfoRadicado.length != 0) {
      if (this.resultadoInfoRadicado[0].EnviadoAlWorkManager == true && (
        this.contenidoCodigo == 102 || this.contenidoCodigo == 1 ||
        this.contenidoCodigo == 106 || this.contenidoCodigo == 107
      )) {
        if (this.contenidoCodigo != 107) {
          this.notif.onWarning('Advertencia', 'Esta ficha de análisis ya fue enviada al Workmanager.');
          this.FichaOperacionForm.get('Codigo')?.reset();
        }
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  OperacionSeleccionada() {
    this.contenidoCodigo = this.FichaOperacionForm.get("Codigo")?.value;
    this.resultOperaciones.forEach((element : any) => {
      if (element.ERP_tblOperacion.IdOperacion == this.contenidoCodigo) {
        this.strDatos = "/" + element.ERP_tblOperacion.Descripcion;
      }
    });
    if (this.contenidoCodigo == 90 || this.contenidoCodigo == 2) {
      this.contenidoBoton = "Crear";
      this.ClearAll(1);
      this.FichaOperacionForm.get('Documento')?.reset();
      this.FichaOperacionForm.get('Radicado')?.reset();
      this.FormRadicado = null;
      this.btn = false;
      if (this.contenidoCodigo == 90) {
        this.btnGuardar = true;
        this.currencyOptions.precision = 0;
        //[jherrera][2024/04/16] se settea el valor null del botón para que cuando se cambie de operación tenga su estado normal
        this.BloquearBotonGuardar = null;
      } else {
        this.btnGuardar = false;
        this.currencyOptions.precision = 2;
        this.bloquearBuscarEmpresa = true;
        this.BloquearBoton = true;
      }
    } else {
      if (this.contenidoCodigo == 102) { //Actualizar datos asociado
        if (this.bloquearBuscar == true) {
          if (!this.fueEnviadoAlWM()) {
            this.btnGuardar = false;
            this.ConfirmarActualizarDeNaturales();
          }
        } else {
          this.notif.onWarning('Advertencia', 'Debe buscar un radicado para realizar esta operación.');
          this.ClearAll();
        }
      } else if (this.contenidoCodigo == 1) {//Editar
        if (this.bloquearBuscar == true) {
          if (!this.fueEnviadoAlWM()) {
            this.bloquearBuscarEmpresa = (this.esJuridico == 1) ? null : true;
            this.currencyOptions.precision = 0;
            this.bloquearBuscar = null;
            this.btnGuardar = true;
            this.BloquearBotonGuardar = true;
            this.contenidoBoton = 'Actualizar';
            this.FichaOperacionForm.get('Codigo')?.reset();
          }
        } else {
          this.notif.onWarning('Advertencia', 'Debe buscar un radicado para realizar esta operación.');
          this.ClearAll();
        }
      } else if (this.contenidoCodigo == 101) {//pdf
        this.btnGuardar = false;
        if (this.bloquearBuscar == true) {
          this.mostrarPDF();
          this.FichaOperacionForm.get('Codigo')?.reset();
        }
        else {
          this.notif.onWarning('Advertencia', 'Debe buscar un radicado para realizar esta operación.');
          this.ClearAll();
        }
      } else if (this.contenidoCodigo == 106) {//enviar al work manager
        this.btnGuardar = false;
        if (this.bloquearBuscar == true) {
          if (!this.fueEnviadoAlWM()) {
            $("#BotonWM").click();
          }
        }
        else {
          this.notif.onWarning('Advertencia', 'Debe buscar un radicado para realizar esta operación.');
          this.ClearAll();
        }
      } else if (this.contenidoCodigo == 107) {//Autorizacion
        if (this.bloquearBuscar == true) {
          if (this.fueEnviadoAlWM()) {
            this.ConfirmarAutorizacion()
          } else {
            this.notif.onWarning('Advertencia', 'Esta ficha de análisis no ha sido enviada al workmanager.');
            this.FichaOperacionForm.get('Codigo')?.reset();
          }
        } else {
          this.notif.onWarning('Advertencia', 'Debe buscar un radicado para realizar esta operación.');
          this.ClearAll();
        }
        
      }
    }
  }

  OperacionSetFADeudor(FADeudor: FADeudor) {
    this.loading = true;
    this.FichaAnalisisService.setFADeudor(FADeudor).subscribe(
      result => {
        this.loading = false;
        this.notif.onSuccess('Exitoso', 'La ficha de análisis se creó correctamente.');
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }

  OperacionSetFACodeudor(FACodeudor: FADeudor) {
    this.FichaAnalisisService.setFACodeudor(FACodeudor).subscribe(
      result => {
      },
      error => {
        console.log(error);
      }
    )
  }

  OperacionSetLogFichaAnalisis(LogFichaAnalisis: LogFichaAnalisis) {
    this.FichaAnalisisService.setLogFichaAnalisis(LogFichaAnalisis).subscribe(
      result => {
      },
      error => {
        console.log(error);
      }
    )
  }
  OperacionUpdateFADeudor(FADeudor: FADeudor) {
    this.loading = false;
    this.FichaAnalisisService.actualizarFichaAnalisis(FADeudor).subscribe(
      result => {
        this.loading = false;
        this.notif.onSuccess('Exitoso', 'La ficha de análisis se actualizó correctamente.');
      }, error => {
        this.loading = false;
        console.log(error);
      }
    )
  }
  OperacionBuscarTrazabilidad() {
    const radicado = this.radicadoActual;
    this.FichaAnalisisService.getFALog(radicado).subscribe(
      data => {
        if (data.length != 0) {
          this.dataTrazabilidad = this.organizarTrazabilidad(data);
          //this.dataTrazabilidad = this.dataTrazabilidad.reverse();
          $("#BotonTrazabilidad").click();
        }
      }
    )
  }
  organizarTrazabilidad(data : any) {
    let detalleSize = false;
    let opSize = 0;
    $("#columna_operacion").removeClass("columna_operacion");
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length - 1; j++) {
        if (data[j]["IdLogFA"] > data[j + 1]["IdLogFA"]) {
          let aux = data[j]["IdLogFA"];
          data[j]["IdLogFA"] = data[j + 1]["IdLogFA"];
          data[j + 1]["IdLogFA"] = aux;
        }
      }
      if (data[i]["Operacion"].includes("Enviar")) {
        if (data[i]["JsonDto"].includes("{")) {
          let json = JSON.parse(data[i]["JsonDto"]);
          let wfid = json["WorkFlowId"];
          data[i]["JsonDto"] = `${wfid}`;
        }
        detalleSize = true;
        opSize = 210;
      } else {
        data[i]["JsonDto"] = "";
        if (data[i]["Operacion"].includes("Actualizar")) {
          opSize = 210;  
        }
      }
    }
    if (opSize != 0) {$("#columna_operacion").addClass("columna_operacion");}
    this.detalleTrazabilidad = detalleSize ? true : false;
    
    return data;
  }
  OperacionUpdateFACodeudor(FADeudor: FADeudor) {
    this.FichaAnalisisService.actualizarCodeudorFichaAnalisis(FADeudor).subscribe(
      result => {
        this.ClearAll();
      }, error => {
        console.log(error);
      }
    )
  }
  OperacionUpdateFADeudorDeNaturales(FADeudor: FADeudor) {
    this.loading = false;
    this.FichaAnalisisService.actualizarFichaDeAnalisisDeNaturales(FADeudor).subscribe(
      result => {
        this.loading = false;
        this.notif.onSuccess('Exitoso', 'La ficha de análisis se actualizó correctamente.');
      }, error => {
        this.loading = false;
        console.log(error);
      }
    )
  }
  OperacionUpdateFACodeudorDeNaturales(FADeudor: FADeudor) {
    this.FichaAnalisisService.actualizarCodeudorFichaDeAnalisisDeNaturales(FADeudor).subscribe(
      result => {
      }, error => {
        console.log(error);
      }
    )
  }


  RadicadoChange(event : any) {
    this.FichaOperacionForm.get('Documento')?.reset();
    if (event.KeyCode == 13) {
      $("#btnBuscar").click();
    }
    this.BloquearBoton = null;
  }

  DocumentoChange(event : any) {
    this.FichaOperacionForm.get('Radicado')?.reset();
    if (event.KeyCode == 13) {
      $("#btnBuscar").click();
    }
    this.BloquearBoton = null;
  }

  ClearAll(opChange = 0, btn = 0) {
    this.crear = true;
    if (btn == 0) {
      this.btn = true;
      this.BloquearBoton = false;
      this.btnGuardar = false;
    }
    this.btnEnviarWorkF = true;
    this.workFlowId = "";
    this.infoRadicado = false;
    this.FichaAnalisisDataForm?.reset();
    this.bloquearBuscar = null;
    this.bloquearBuscarEmpresa = true;
    $("#procesowf").val("");
    this.workFlowId = "";
    this.FormRadicado = true;
    this.codSelected = [];
    if (opChange == 0) {
      this.FichaOperacionForm?.reset();
      this.strDatos = "";
    }
    this.resultInfoFinanciera, this.resultOperaciones, this.resultadoCodeudores, this.resultadoInfoRadicado = [];
    this.ArrayInfoFinanciera, this.ExtinguidasCode, this.ExtinguidasPrin, this.VigentesCode, this.VigentesPrin = [];

  }

  OperacionCrearFichaAnalisis() {
    this.radicadoActual = this.FichaOperacionForm.get('Radicado')?.value;
    let radicado = this.radicadoActual;
    this.bloquearBuscar = null;
    this.loading = true;
    this.FichaAnalisisService.BuscarRadicadoOpBuscar(radicado).subscribe(
      result => {
        if (result.length != 0) {
          this.notif.onWarning('Advertencia', 'El número de radicado ya tiene ficha de análisis.');
          this.infoRadicado = false;
          this.ClearAll();
          this.loading = false;
        } else {
          this.FichaAnalisisService.BuscarRadicado(radicado).subscribe(
            resultado => {
              if (resultado.length != 0) {
                this.ClearAll(1, 1);
                this.resultadoInfoRadicado = [];
                this.resultadoInfoRadicado = resultado;
                this.resultadoInfoRadicado = this.AñadirValoresAResponse(this.resultadoInfoRadicado);
                this.strOficina = this.resultadoInfoRadicado[0].Oficina
                this.asignarInfoAso(this.resultadoInfoRadicado,true, false);
                this.FichaOperacionForm.get('Codigo')?.reset();
                this.BloquearBoton = true;
                this.FichaAnalisisService.BuscarInfoCodeudor(radicado).subscribe(
                  res => {
                    if (this.resultadoInfoRadicado.length != 0) {
                      this.resultadoCodeudores = [];
                      this.resultadoCodeudores = res;
                      this.resultadoCodeudores.forEach(Code => {
                        Code["PuntajeExpirian"] = "";
                        Code["ResultadoScoring"] = "";
                        Code["CapPagoDir"] = "";
                        Code["CapPagoTot"] = "";
                        Code["UtilidadNetaA"] = "";
                        Code["RentabilidadActivo"] = "";
                        Code["RentabilidadPatrimonio"] = "";
                        Code["AnalisisEstFinan"] = "";
                      });
                      this.resultadoCodeudores = this.AñadirValoresAResponse(this.resultadoCodeudores);
                      this.infoRadicado = true;
                      this.loading = false;
                    } else {
                      this.resultadoCodeudores = [];
                      this.loading = false;
                      this.infoRadicado = false;
                    }
                  },
                  error => {
                    const errorMessage = <any>error;
                    this.infoRadicado = false;
                    this.loading = false;
                    console.log(errorMessage);
                  }
                )
              } else {
                this.notif.onWarning('Advertencia', 'No se encontró número de radicado.');
                this.generalesService.Autofocus('opcionOperacion');
                this.FichaOperacionForm.get('Radicado')?.reset();
                this.FichaOperacionForm.get('Documento')?.reset();
                this.resultadoCodeudores = [];
                this.resultadoInfoRadicado = [];
                this.infoRadicado = false;
                this.loading = false;
                this.FichaAnalisisDataForm?.reset();
              }
            },
            error => {
              this.loading = false;
              this.notif.onWarning('Advertencia', 'No se encontró número de radicado.');
              this.generalesService.Autofocus('opcionOperacion');
              this.FichaOperacionForm.get('Radicado')?.reset();
              this.FichaOperacionForm.get('Documento')?.reset();
              this.resultadoCodeudores = [];
              this.resultadoInfoRadicado = [];
              this.infoRadicado = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          )
        }
      },
      error => {
        const errorMessage = <any>error;
        this.loading = false;
        this.notif.onWarning('Advertencia', 'No se encontró número de radicado.');
        this.generalesService.Autofocus('opcionOperacion');
        this.FichaOperacionForm.get('Radicado')?.reset();
        this.FichaOperacionForm.get('Documento')?.reset();
        this.resultadoCodeudores = [];
        this.resultadoInfoRadicado = [];
        this.infoRadicado = false;
        console.log(errorMessage);
      });
  }

  OperacionBuscarFichaAnalisis() {
    let radicado = this.radicadoActual;
    this.bloquearBuscar = true;
    this.bloquearBuscarEmpresa = true;
    this.loading = true;
    this.currencyOptions.precision = 2;
    this.FichaAnalisisService.BuscarRadicadoOpBuscar(radicado).subscribe(
      result => {
        if (result.length == 0) {
          this.loading = false;
          this.infoRadicado = false;
          this.resultadoInfoRadicado = [];
          this.crear = true;
          this.FichaAnalisisDataForm?.reset();
          this.notif.onWarning('Advertencia', 'El número de radicado no tiene ficha de análisis.');
          this.FichaOperacionForm.get('Radicado')?.reset();
          this.FichaOperacionForm.get('Documento')?.reset();
          this.generalesService.Autofocus('opcionOperacion');
          this.radicadoActual = "";
        } else {
          this.crear = false;
          this.resultadoInfoRadicado = this.organizarInfoExtinguidasYVigentes(result);
          this.asignarInfoAso(result, false, true);
          this.strOficina = this.resultadoInfoRadicado[0].Oficina
          this.FichaAnalisisService.BuscarInfoCodeudorOpBuscar(radicado).subscribe(
            res => {
              this.resultadoCodeudores = this.organizarInfoExtinguidasYVigentes(res);
              this.dataInsertInicialCode = this.recolectarInfoCodeGeneral();
              this.loading = false;
              setTimeout(() => {
                this.infoRadicado = true;
              }, 1000);
            },
            error => {
              this.infoRadicado = false;
              this.loading = false;
              console.log(error);
            }
          )
          if (this.contenidoCodigo == 2) {
            this.recolectarInfoLog();
          }
          this.FormRadicado = true;
          this.contenidoCodigo = 2;
          this.FichaOperacionForm.get('Codigo')?.reset();
        }
      },
      error => {
        this.loading = false;
        this.crear = true;
        this.infoRadicado = false;
        this.resultadoInfoRadicado = [];
        this.FichaAnalisisDataForm?.reset();
        this.notif.onWarning('Advertencia', 'El número de radicado no tiene ficha de análisis.');
        this.FichaOperacionForm.get('Radicado')?.reset();
        this.FichaOperacionForm.get('Documento')?.reset();
        this.generalesService.Autofocus('opcionOperacion');
        this.radicadoActual = "";
        console.log(error)
      }
    )
  }

  ValoresXml2Json(respuesta : any) {
    for (let clave in respuesta) {
      if (typeof respuesta[clave] === 'string') {
        let cadena: string = respuesta[clave];
        if (cadena.startsWith("<")) {
          var xml = parseXML(cadena)
          respuesta[clave] = this.xml2json(xml)[clave];
        }
      }
    }
    return respuesta;
  }

  xml2json(xml : any) {
    try {
      var obj : any = {};
      if (xml.children.length > 0) {
        for (var i = 0; i < xml.children.length; i++) {
          var item = xml.children.item(i);
          var nodeName = item.nodeName;

          if (typeof (obj[nodeName]) == "undefined") {
            obj[nodeName] = this.xml2json(item);
          } else {
            if (typeof (obj[nodeName].push) == "undefined") {
              var old = obj[nodeName];

              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(this.xml2json(item));
          }
        }
      } else {
        obj = xml.textContent;
      }
      return obj;
    } catch (e : any) {
      console.log(e.message);
    }
  }

  AñadirValoresAResponse(response : any) {
    response.forEach((element : any)=> {
      element = this.ValoresXml2Json(element);
      this.ResumenInfoFinanciera(element);
      element["VigentesPrin"] = this.VigentesPrin;
      element["VigentesCode"] = this.VigentesCode;
      element["ExtinguidasPrin"] = this.ExtinguidasPrin;
      element["ExtinguidasCode"] = this.ExtinguidasCode;
      element["MaxOpCancelReal"] = this.MaxReal * 1000;
      element["MaxOpCancelFinan"] = this.MaxFinan * 1000;
      element["MaxOpCancelFinanCoogra"] = this.MaxFinanCoogra * 1000;
      this.VigentesPrin = []; this.VigentesCode = []; this.ExtinguidasCode = []; this.ExtinguidasPrin = [], this.ArrayInfoFinanciera = [], this.MaxFinan = 0, this.MaxFinanCoogra = 0, this.MaxReal = 0;
    });
    return response;
  }

  SacarValores(objeto : any, tipo : string) : any {
    let elemento : any = {};
    elemento["TipoEntidad"] = objeto.TipoEntidad;
    elemento["Entidad"] = objeto.NombreEntidad;
    elemento["Tipo"] = tipo;
    elemento["LineaCredito"] = objeto.LineaCredito;
    elemento["Otorgado"] = Number.isNaN(parseInt(objeto.ValorInicial)) ? 0 : parseInt(objeto.ValorInicial);
    elemento["Calidad"] = objeto.Calidad == "PRIN" ? objeto.Calidad : "CODE";
    elemento["EstadoContrato"] = objeto.EstadoContrato;
    elemento["Cantidad"] = 1;
    elemento["Utilidad"] = Number.isNaN(parseInt(objeto.SaldoObligacion)) ? 0 : parseInt(objeto.SaldoObligacion);
    elemento["Cuota"] = Number.isNaN(parseInt(objeto.ValorCuota)) ? 0 : parseInt(objeto.ValorCuota);
    elemento["Mora"] = Number.isNaN(parseInt(objeto.ValorMora)) ? 0 : parseInt(objeto.ValorMora);
    elemento["PrcUtilidad"] = parseInt(objeto.SaldoObligacion) * 100 / parseInt(objeto.ValorInicial);
    return elemento;
  }

  ObtenerMayorCancelado(objeto : any, index : number) {
    //[jherrera][2024/04/08] se agrega validación para que solo evalúe en los que fue/es deudor
    if (objeto.Calidad == "PRIN") {
      if (index == 2) {
        let nombre = objeto.NombreEntidad.toUpperCase();
        if (nombre.includes("COOGRANADA")) {
          if (parseInt(objeto.ValorInicial) > this.MaxFinanCoogra) {
            this.MaxFinanCoogra = objeto.ValorInicial;
          }
        } else {
          if (parseInt(objeto.ValorInicial) > this.MaxFinan) {
            this.MaxFinan = objeto.ValorInicial;
          }
        }
      } else if (index == 3) {
        if (parseInt(objeto.ValorInicial) > this.MaxReal) {
          this.MaxReal = objeto.ValorInicial;
        }
      }
    } 
  }

  ObtenerTotalesInfoFinanciera() {
    let cantTotal = 0, otorgadoTotal = 0, utilTotal = 0, cuotaTotal = 0, moraTotal = 0;
    let titulo = "Subtotal";
    if (this.VigentesPrin.length != 0) {
      this.VigentesPrin.forEach((element : any) => {
        cantTotal += element.Cantidad;
        otorgadoTotal += element.Otorgado;
        utilTotal += element.Utilidad;
        cuotaTotal += element.Cuota;
        moraTotal += element.Mora;
      });
      let obj : any = { "Titulo": titulo, "Otorgado": otorgadoTotal, "Cantidad": cantTotal, "Utilidad": utilTotal, "Cuota": cuotaTotal, "Mora": moraTotal }
      this.VigentesPrin.push(obj);
      cantTotal = 0, otorgadoTotal = 0, utilTotal = 0, cuotaTotal = 0, moraTotal = 0;
    }
    if (this.VigentesCode.length != 0) {
      this.VigentesCode.forEach(element => {
        cantTotal += element.Cantidad;
        otorgadoTotal += element.Otorgado;
        utilTotal += element.Utilidad;
        cuotaTotal += element.Cuota;
        moraTotal += element.Mora;
      });
      let obj = { "Titulo": titulo, "Otorgado": otorgadoTotal, "Cantidad": cantTotal, "Utilidad": utilTotal, "Cuota": cuotaTotal, "Mora": moraTotal }
      this.VigentesCode.push(obj);
      cantTotal = 0, otorgadoTotal = 0, utilTotal = 0, cuotaTotal = 0, moraTotal = 0;

    }
    if (this.ExtinguidasCode.length != 0) {
      this.ExtinguidasCode.forEach(element => {
        cantTotal += element.Cantidad;
        otorgadoTotal += element.Otorgado;
        utilTotal += element.Utilidad;
        cuotaTotal += element.Cuota;
        moraTotal += element.Mora;
      });
      let obj = { "Titulo": titulo, "Otorgado": otorgadoTotal, "Cantidad": cantTotal, "Utilidad": utilTotal, "Cuota": cuotaTotal, "Mora": "-" }
      this.ExtinguidasCode.push(obj);
      cantTotal = 0, otorgadoTotal = 0, utilTotal = 0, cuotaTotal = 0, moraTotal = 0;
    }
    if (this.ExtinguidasPrin.length != 0) {
      this.ExtinguidasPrin.forEach(element => {
        cantTotal += element.Cantidad;
        otorgadoTotal += element.Otorgado;
        utilTotal += element.Utilidad;
        cuotaTotal += element.Cuota;
        moraTotal += element.Mora;
      });
      let obj = { "Titulo": titulo, "Otorgado": otorgadoTotal, "Cantidad": cantTotal, "Utilidad": utilTotal, "Cuota": cuotaTotal, "Mora": "-" }
      this.ExtinguidasPrin.push(obj);
      cantTotal = 0, otorgadoTotal = 0, utilTotal = 0, cuotaTotal = 0, moraTotal = 0;
    }
  }

  sumarInfoVigente(vigente: ObligacionesVigentes, element : any) {
    vigente.Calidad = element.Calidad;
    vigente.Otorgado += element.Otorgado;
    vigente.Cantidad += element.Cantidad;
    vigente.Utilidad += element.Utilidad;
    vigente.Cuota += element.Cuota;
    vigente.Mora += element.Mora;
    return vigente;
  }
  sumarInfoExtinguida(extinguida: ObligacionesExtinguidas, element : any) {
    extinguida.Calidad = element.Calidad;
    extinguida.Otorgado += element.Otorgado;
    extinguida.Cantidad += element.Cantidad;
    extinguida.Utilidad += element.Utilidad;
    if (element.Cuota > extinguida.Cuota) {
      extinguida.Cuota = element.Cuota;
    }
    return extinguida;
  }
  OrdenarResumenInfoFinanciera(infoResumida : any[]) {
    let vigentes : any = []
    let extinguidos : any = []

    infoResumida.forEach(element => {
      if ((element.Otorgado != 0) && (!isNaN(element.Otorgado))) {
        let i = 0;
        if (element.Tipo == "SectorFinancieroAlDia" || element.Tipo == "SectorRealAlDia" || element.Tipo == "SectorRealEnMora" || element.Tipo == "SectorFinancieroEnMora") {
          let vigente = new ObligacionesVigentes();
          //Validacionies para el titulo
          if (element.Tipo == "SectorFinancieroAlDia" || element.Tipo == "SectorFinancieroEnMora") {
            vigente.Titulo = "Sec Finan:";
            if (element.TipoEntidad == "COOP") {
              let entidad = element.Entidad.toUpperCase();
              vigente.Titulo = entidad.includes("COOGRANADA") ? "Coogranada:" : "Sec Solida:";
            }
            if (element.LineaCredito == "TCR") {
              vigente.Titulo = "Tarjetas cred:"
            }
          } else {
            vigente.Titulo = "Sec Real:";
          }

          if (vigentes.length > 0) {
            for (let index = 0; index < vigentes.length; index++) {
              if (vigente.Titulo == vigentes[index].Titulo && element.Calidad == vigentes[index].Calidad) {
                vigentes[index] = this.sumarInfoVigente(vigentes[index], element)
                i += 1;
              }
            }
          }
          if (i == 0) {
            if (element.Calidad != "") {
              vigente = this.sumarInfoVigente(vigente, element);
              vigentes.push(vigente);
            }
          }
        }
  
        i = 0;
        if (element.Tipo == "SectorFinancieroExtinguidas" || element.Tipo == "SectorRealExtinguidas") {
          let extinguido = new ObligacionesExtinguidas();
          //Validacionies para el titulo
          if (element.Tipo == "SectorFinancieroExtinguidas") {
            extinguido.Titulo = "Sec Finan:";
            if (element.TipoEntidad == "COOP") {
              let entidad = element.Entidad.toUpperCase();
              extinguido.Titulo = entidad.includes("COOGRANADA") ? "Coogranada:" : "Sec Solida:";
            }
            if (element.LineaCredito == "TCR") {
              extinguido.Titulo = "Tarjetas cred:"
            }
          } else {
            extinguido.Titulo = "Sec Real:";
          }
          if (extinguidos.length > 0) {
            for (let index = 0; index < extinguidos.length; index++) {
              if (extinguido.Titulo == extinguidos[index].Titulo && element.Calidad == extinguidos[index].Calidad) {
                extinguidos[index] = this.sumarInfoExtinguida(extinguidos[index], element)
                i += 1;
              }
            }
          }
          if (i == 0) {
            if (element.Calidad != "") {
              extinguido = this.sumarInfoExtinguida(extinguido, element);
              extinguidos.push(extinguido);
            }
          }
        }
      }
    });

    this.agregarInfoExtinguidaYVigente(extinguidos, vigentes);
    this.ObtenerTotalesInfoFinanciera();

  }
  agregarInfoExtinguidaYVigente(extinguidos: ObligacionesExtinguidas[], vigentes: ObligacionesVigentes[]) {
    vigentes.forEach(vigente => {
      vigente.Calidad == "PRIN" ? this.VigentesPrin.push(vigente) : this.VigentesCode.push(vigente);
    });

    extinguidos.forEach(extinguido => {
      extinguido.Calidad == "PRIN" ? this.ExtinguidasPrin.push(extinguido) : this.ExtinguidasCode.push(extinguido);
    });
  }

  ResumenInfoFinanciera(info : any) {
    try {
      let sector = ["SectorFinancieroAlDia", "SectorRealAlDia", "SectorFinancieroExtinguidas", "SectorRealExtinguidas", "SectorRealEnMora", "SectorFinancieroEnMora"];
      let i = 0;
      sector.forEach(elemento => {
        //recorre el obj
        if (typeof info === 'object' && info !== null) {
          for (let clave in info) {
            if (clave == elemento) {
              if (!(typeof info[clave].Obligacion === 'string')) {
                if (this.isArray(info[clave].Obligacion)) {
                  info[clave].Obligacion.forEach((item : any) => {
                    this.ArrayInfoFinanciera.push(this.SacarValores(item, elemento));
                    this.ObtenerMayorCancelado(item, i);
                  });
                }
                else if (typeof info[clave].Obligacion == 'object' && info[clave].Obligacion !== null) {
                  this.ArrayInfoFinanciera.push(this.SacarValores(info[clave].Obligacion, elemento));
                  this.ObtenerMayorCancelado(info[clave].Obligacion, i);
                }

              }
            }
          }
        }
        i++;
      });
      this.OrdenarResumenInfoFinanciera(this.ArrayInfoFinanciera);
    } catch (error) {
      console.log(error)
    }
  }

  recolectarInfo() {
    let act = null;
    if (this.contenidoCodigo != 90) {
      this.jsonDto = this.armarJsonDto();
      act = this.compararDataParaActualizar()
    }
    if (act == null) {
      this.recolectarInfoAso();
      this.recolectarInfoCode();
      this.recolectarInfoLog();
      this.dataInsertInicial = new FADeudor();
      this.dataInsertInicialCode = [];
      this.dataInsertFinal = new FADeudor();
      this.dataInsertFinalCode = [] ;
      setTimeout(() => {
        this.crear = false;
        this.btnGuardar = false;
        this.strDatos="/Buscar"
        this.OperacionBuscarFichaAnalisis();
      }, 1500);
      this.loading = false;
    } else {
      this.notif.onWarning('Advertencia', 'Debe realizar un cambio para actualizar.');
    }
  }
  
  recolectarInfoAso() {
    this.radicadoActual = this.FichaAnalisisDataForm.get("noRadicado")?.value;
    this.dataInsert.lngRadicado = this.FichaAnalisisDataForm.get("noRadicado")?.value;
    this.dataInsert.IdTercero = this.resultadoInfoRadicado[0].IdTercero;
    this.dataInsert.Monto = this.FichaAnalisisDataForm.get("monto")?.value;
    this.dataInsert.Destino = this.FichaAnalisisDataForm.get("destino")?.value;
    this.dataInsert.Linea = this.FichaAnalisisDataForm.get("linea")?.value;
    this.dataInsert.FormaPago = this.FichaAnalisisDataForm.get("formaPago")?.value;
    this.dataInsert.Plazo = this.FichaAnalisisDataForm.get("plazo")?.value;
    this.dataInsert.Cuota = this.FichaAnalisisDataForm.get("cuota")?.value;
    this.dataInsert.Tasa = this.FichaAnalisisDataForm.get("tasa")?.value;
    this.dataInsert.Garantia = this.FichaAnalisisDataForm.get("garantia")?.value;
    this.dataInsert.VlrAvaluo = this.FichaAnalisisDataForm.get("vlrAvaluo")?.value;
    this.dataInsert.DetalleGarantia = this.FichaAnalisisDataForm.get("dscGarantia")?.value;
    this.dataInsert.SeguroGarantia = parseInt(this.FichaAnalisisDataForm.get("cobSeguroGarantia")?.value);
    this.dataInsert.DescCobSeguro = this.FichaAnalisisDataForm.get("dscCoberturaSeguro")?.value;
    this.dataInsert.SeguroDeudor = parseInt(this.FichaAnalisisDataForm.get("cobSeguroDeudor")?.value);
    this.dataInsert.DescCobSeguroDeudor = this.FichaAnalisisDataForm.get("dscCobDeudor")?.value;
    this.dataInsert.DescripcionInversion = this.FichaAnalisisDataForm.get("dscInversion")?.value;
    this.dataInsert.Nombre = this.FichaAnalisisDataForm.get("nombreAso")?.value;
    this.dataInsert.Documento = this.FichaAnalisisDataForm.get("identAso")?.value;
    this.dataInsert.Correo = this.FichaAnalisisDataForm.get("correoAso")?.value;
    this.dataInsert.AsociadoDesde = this.FichaAnalisisDataForm.get("asociadoDesdeAso")?.value;
    this.dataInsert.VlrAportes = this.FichaAnalisisDataForm.get("vlrAportesAso")?.value;
    this.dataInsert.Empresa = this.FichaAnalisisDataForm.get("empresaAso")?.value;
    this.dataInsert.ActividadEconomica = this.FichaAnalisisDataForm.get("ActividadEconomicaAso")?.value;
    this.dataInsert.Antiguedad = this.FichaAnalisisDataForm.get("antiguedadAso")?.value;
    this.dataInsert.Ocupacion = this.FichaAnalisisDataForm.get("ocupacionAso")?.value;
    this.dataInsert.PromCoogranada = this.resultadoInfoRadicado[0].Cuentas;
    this.dataInsert.PromOtras = this.FichaAnalisisDataForm.get("promOtrasAso")?.value;
    this.dataInsert.PuntajeExpirian = this.FichaAnalisisDataForm.get("puntExpirianAso")?.value;
    this.dataInsert.PuntajeTrans = this.FichaAnalisisDataForm.get("puntajeTransAso")?.value;
    let scoring = this.FichaAnalisisDataForm.get("scoringAso")?.value;
    this.dataInsert.ResultadoScoring = scoring == "0" ? "No aplica" : scoring;
    this.dataInsert.Activos = this.FichaAnalisisDataForm.get("activosAso")?.value;
    this.dataInsert.Pasivos = this.FichaAnalisisDataForm.get("pasivosAso")?.value;
    this.dataInsert.Patrimonio = this.FichaAnalisisDataForm.get("patrimonioAso")?.value;
    this.dataInsert.IngresoMensual = this.FichaAnalisisDataForm.get("ingresoMensualAso")?.value;
    this.dataInsert.PrcSolvencia = this.organizarPorcentajes(this.FichaAnalisisDataForm.get("prcSolvenciaAso")?.value);
    this.dataInsert.UtilidadNetaA = this.FichaAnalisisDataForm.get("utilidadNetaAso")?.value;
    this.dataInsert.CapPagoDir = this.FichaAnalisisDataForm.get("capacidadPagoAso")?.value;
    this.dataInsert.CapPagoTot = this.FichaAnalisisDataForm.get("capacidadPagoTotalAso")?.value;
    this.dataInsert.RentabilidadPatrimonio = this.FichaAnalisisDataForm.get("ROEAso")?.value;
    this.dataInsert.RentabilidadActivo = this.FichaAnalisisDataForm.get("ROAAso")?.value;
    this.dataInsert.MaxOpCancelReal = this.FichaAnalisisDataForm.get("MaxOpCancelRealAso")?.value;
    this.dataInsert.MaxOpCancelFinan = this.FichaAnalisisDataForm.get("MaxOpCancelFinanAso")?.value;
    this.dataInsert.MaxOpCancelFinanCoogra = this.FichaAnalisisDataForm.get("MaxOpCancelFinanCoograAso")?.value;
    this.dataInsert.EndeudamientoDir = this.FichaAnalisisDataForm.get("endeudamientoDirAso")?.value;
    this.dataInsert.EndeudamientoTot = this.FichaAnalisisDataForm.get("endeudamientoTotAso")?.value;
    this.dataInsert.AnalisisEstFinan = this.FichaAnalisisDataForm.get("descActivosAso")?.value;
    this.dataInsert.DescActivos = this.FichaAnalisisDataForm.get("descActivosAso")?.value;
    this.dataInsert.RecomendacionAnalista = this.FichaAnalisisDataForm.get("RecomendacionAnalista")?.value;
    this.dataInsert.ConceptoFinal = this.FichaAnalisisDataForm.get("ConceptoFinal")?.value;
    let data = localStorage.getItem('Data');
    this.DataUserLogeado = JSON.parse(window.atob(data == null ? "" : data));
    this.dataInsert.AnalistaEncargado = this.DataUserLogeado.Nombre;
    this.dataInsert.ExtinguidasCode = this.resultadoInfoRadicado[0]["ExtinguidasCode"] != null ? this.resultadoInfoRadicado[0]["ExtinguidasCode"] : [];
    this.dataInsert.ExtinguidasPrin = this.resultadoInfoRadicado[0]["ExtinguidasPrin"] != null ? this.resultadoInfoRadicado[0]["ExtinguidasPrin"] : [];
    this.dataInsert.VigentesCode = this.resultadoInfoRadicado[0]["VigentesCode"] != null ? this.resultadoInfoRadicado[0]["VigentesCode"] : [];
    this.dataInsert.VigentesPrin = this.resultadoInfoRadicado[0]["VigentesPrin"] != null ? this.resultadoInfoRadicado[0]["VigentesPrin"] : [];
    
    this.dataInsert.ExtinguidasCode = this.resultadoInfoRadicado[0]["ExtinguidasCode"].length != 0 ? JSON.stringify(this.resultadoInfoRadicado[0]["ExtinguidasCode"]) : null;
    this.dataInsert.ExtinguidasPrin = this.resultadoInfoRadicado[0]["ExtinguidasPrin"].length != 0 ? JSON.stringify(this.resultadoInfoRadicado[0]["ExtinguidasPrin"]) : null;
    this.dataInsert.VigentesCode = this.resultadoInfoRadicado[0]["VigentesCode"].length != 0 ? JSON.stringify(this.resultadoInfoRadicado[0]["VigentesCode"]) : null;
    this.dataInsert.VigentesPrin = this.resultadoInfoRadicado[0]["VigentesPrin"].length != 0 ? JSON.stringify(this.resultadoInfoRadicado[0]["VigentesPrin"]) : null;
    this.dataInsert.CheckList = this.ObtenerOAsignarCheckList();
    if (this.contenidoCodigo == 90) { // crear
      this.OperacionSetFADeudor(this.dataInsert);
    } else if (this.contenidoCodigo == 1) {//editar
      this.OperacionUpdateFADeudor(this.dataInsert);
    } else if (this.contenidoCodigo == 102) {//actualizar datos del asociado
      this.OperacionUpdateFADeudorDeNaturales(this.dataInsert);
    }
  }

  recolectarInfoCode() {
    this.dataInsertCode = [];
    let data = localStorage.getItem('Data');
    this.DataUserLogeado = JSON.parse(window.atob(data == null ? "" : data));
    this.resultadoCodeudores.forEach(codeudor => {
      let Code = new FADeudor();
      Code.Nombre = codeudor.Nombre;
      Code.IdUsuarioERP = this.DataUserLogeado.IdUsuario;
      Code.IdOficina = this.DataUserLogeado.NumeroOficina;
      Code.IdAsesorModifica = this.DataUserLogeado.lngTercero;
      Code.Documento = codeudor.Documento;
      Code.Correo = codeudor.Correo;
      let stringFecha = "";
      if (codeudor.AsociadoDesde != null && codeudor.AsociadoDesde != "") {
        let fecha = new Date(codeudor.AsociadoDesde);
        let dia = fecha.getDate() > 9 ? fecha.getDate() : '0' + fecha.getDate();
        let mes = (fecha.getMonth() + 1) > 9 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1);
        stringFecha = fecha.getFullYear() + '/' + mes + '/' + dia;
      }
      Code.AsociadoDesde = stringFecha;
      Code.VlrAportes = this.validarAportes(codeudor);
      Code.Empresa = codeudor.Empresa;
      Code.ActividadEconomica = codeudor.ActividadEconomica;
      if (this.contenidoCodigo == 1) { //editar
        Code.Antiguedad = codeudor.Antiguedad
      } else {
        let anios = !this.isNumber(parseInt(codeudor.AntiguedadAnos)) ? "__" : (codeudor.AntiguedadAnos == null ? 0 : codeudor.AntiguedadAnos);
        let meses = !this.isNumber(parseInt(codeudor.AntiguedadMeses)) ? "__" : (codeudor.AntiguedadMeses == null ? 0 : codeudor.AntiguedadMeses);
        Code.Antiguedad = anios + " Años " + meses + " Meses"
      }
      Code.Ocupacion = codeudor.Ocupacion;
      if (codeudor.Score !== undefined && codeudor.Score !== null) {
        if (codeudor.Score.Puntaje !== undefined && codeudor.Score.Puntaje !== null) {
          Code.PuntajeTrans = codeudor.Score.Puntaje
        }
      }
      Code.Activos = this.isNumber(codeudor.Activos) ? codeudor.Activos : 0;
      Code.Pasivos = this.isNumber(codeudor.Pasivos) ? codeudor.Pasivos : 0;
      Code.Patrimonio = (this.isNumber(codeudor.Activos) ? codeudor.Activos : 0) - (this.isNumber(codeudor.Pasivos) ? codeudor.Pasivos : 0)
      Code.IngresoMensual = codeudor.Ingresos
      Code.EndeudamientoDir = this.organizarPorcentajes((this.division(codeudor.Pasivos, codeudor.Activos) * 100).toFixed(2)) + ' %';
      Code.EndeudamientoTot = this.organizarPorcentajes((this.division(codeudor.Pasivos, codeudor.Activos) * 100).toFixed(2)) + ' %';
      Code.PrcSolvencia = this.organizarPorcentajes((this.division(codeudor.Activos, codeudor.Pasivos) * 100).toFixed(2) + ' %');
      Code.PuntajeExpirian = codeudor.PuntajeExpirian;
      Code.ResultadoScoring = codeudor.ResultadoScoring;
      Code.MaxOpCancelReal = codeudor.MaxOpCancelReal;
      Code.MaxOpCancelFinan = codeudor.MaxOpCancelFinan;
      Code.MaxOpCancelFinanCoogra = codeudor.MaxOpCancelFinanCoogra
      Code.CapPagoDir = codeudor.CapPagoDir;
      Code.CapPagoTot = codeudor.CapPagoTot;
      Code.UtilidadNetaA = codeudor.UtilidadNetaA == "" ? "0" : codeudor.UtilidadNetaA;
      Code.AnalisisEstFinan = codeudor.AnalisisEstFinan == undefined ? "" : codeudor.AnalisisEstFinan;
      Code.RentabilidadPatrimonio = this.organizarPorcentajes(codeudor.RentabilidadPatrimonio)
      Code.RentabilidadActivo = this.organizarPorcentajes(codeudor.RentabilidadActivo)
  
      Code.lngRadicado = this.FichaAnalisisDataForm.get("noRadicado")?.value;
      Code.IdTercero = codeudor.idTercero;
      codeudor.ExtinguidasPrin = codeudor.ExtinguidasPrin != null ? JSON.stringify(codeudor.ExtinguidasPrin) : [];
      codeudor.ExtinguidasCode = codeudor.ExtinguidasCode != null ? JSON.stringify(codeudor.ExtinguidasCode) : [];
      codeudor.VigentesCode = codeudor.VigentesCode != null ? JSON.stringify(codeudor.VigentesCode) : [];
      codeudor.VigentesPrin = codeudor.VigentesPrin != null ? JSON.stringify(codeudor.VigentesPrin) : [];
      Code.ExtinguidasPrin = codeudor.ExtinguidasPrin.length != 0 ? JSON.stringify(codeudor.ExtinguidasPrin) : null;
      Code.ExtinguidasCode = codeudor.ExtinguidasCode.length != 0 ? JSON.stringify(codeudor.ExtinguidasCode) : null;
      Code.VigentesCode = codeudor.VigentesCode.length != 0 ? JSON.stringify(codeudor.VigentesCode) : null;
      Code.VigentesPrin = codeudor.VigentesPrin.length != 0 ? JSON.stringify(codeudor.VigentesPrin) : null;
      this.dataInsertCode.push(Code);
    });
    if (this.dataInsertCode.length != 0) {
      this.dataInsertCode.forEach(codeudor => {
        if (this.contenidoCodigo == 90) { // crear
          this.OperacionSetFACodeudor(codeudor);
        } else if (this.contenidoCodigo == 1) {//editar
          this.OperacionUpdateFACodeudor(codeudor);
        } else if (this.contenidoCodigo == 102) {//actualizar datos del asociado
          this.OperacionUpdateFACodeudorDeNaturales(codeudor);
        }
      });
    }
  }
  isNumber(value :any){
    return typeof value === 'number' && !isNaN(value);
  }
  recolectarInfoLog() {
    this.dataInsertLog.IdOperacion = this.contenidoCodigo;
    this.dataInsertLog.Radicado = this.FichaAnalisisDataForm.get("noRadicado")?.value;
    let data = localStorage.getItem('Data');
    this.DataUserLogeado = JSON.parse(window.atob(data == null ? "" : data));
    this.dataInsertLog.IdUsuarioERP = this.DataUserLogeado.IdUsuario;
    this.dataInsertLog.IdOficina = this.DataUserLogeado.NumeroOficina;
    this.dataInsertLog.JsonDto = "";
    this.dataInsertLog.IdAsesorModifica = this.DataUserLogeado.lngTercero;
    if (this.contenidoCodigo == 1 || this.contenidoCodigo == 102) {
      this.dataInsertLog.JsonDto = JSON.stringify(this.jsonDto);
    } else if (this.contenidoCodigo == 106) {
      this.dataInsertLog.JsonDto = `{"WorkFlowId":"${this.workFlowId}"}`;
    }
    
    if (this.contenidoCodigo == 102 && this.dataInsertLog.JsonDto.includes('"jsonDtoAnterior":{}')) {
    } else {
      this.OperacionSetLogFichaAnalisis(this.dataInsertLog);
    }
  }

  validarNull(variable : any) {
    if (variable == null) {
      return "";
    }
    return variable;
  }
  recolectarInfoAsoGeneral() {
    let data = new FADeudor();
    data.lngRadicado = this.FichaAnalisisDataForm.get("noRadicado")?.value;
    data.IdTercero = this.resultadoInfoRadicado[0].IdTercero;
    data.Monto = this.FichaAnalisisDataForm.get("monto")?.value;
    data.Destino = this.FichaAnalisisDataForm.get("destino")?.value;
    data.Linea = this.FichaAnalisisDataForm.get("linea")?.value;
    data.FormaPago = this.FichaAnalisisDataForm.get("formaPago")?.value;
    data.Plazo = this.FichaAnalisisDataForm.get("plazo")?.value;
    data.Cuota = this.FichaAnalisisDataForm.get("cuota")?.value;
    data.Tasa = this.FichaAnalisisDataForm.get("tasa")?.value;
    data.Garantia = this.FichaAnalisisDataForm.get("garantia")?.value;
    data.VlrAvaluo = this.FichaAnalisisDataForm.get("vlrAvaluo")?.value;
    data.DetalleGarantia = this.FichaAnalisisDataForm.get("dscGarantia")?.value;
    data.SeguroGarantia = parseInt(this.FichaAnalisisDataForm.get("cobSeguroGarantia")?.value);
    data.DescCobSeguro = this.FichaAnalisisDataForm.get("dscCoberturaSeguro")?.value;
    data.SeguroDeudor = parseInt(this.FichaAnalisisDataForm.get("cobSeguroDeudor")?.value);
    data.DescCobSeguroDeudor = this.FichaAnalisisDataForm.get("dscCobDeudor")?.value;
    data.DescripcionInversion = this.FichaAnalisisDataForm.get("dscInversion")?.value;
    data.Nombre = this.FichaAnalisisDataForm.get("nombreAso")?.value;
    data.Documento = this.FichaAnalisisDataForm.get("identAso")?.value;
    data.Correo = this.FichaAnalisisDataForm.get("correoAso")?.value;
    data.AsociadoDesde = this.FichaAnalisisDataForm.get("asociadoDesdeAso")?.value;
    data.VlrAportes = this.FichaAnalisisDataForm.get("vlrAportesAso")?.value;
    data.Empresa = this.FichaAnalisisDataForm.get("empresaAso")?.value;
    data.ActividadEconomica = this.FichaAnalisisDataForm.get("ActividadEconomicaAso")?.value;
    data.Antiguedad = this.FichaAnalisisDataForm.get("antiguedadAso")?.value;
    data.Ocupacion = this.FichaAnalisisDataForm.get("ocupacionAso")?.value;
    data.PromCoogranada = this.FichaAnalisisDataForm.get("promCoogranadaAso")?.value;
    data.PromOtras = this.FichaAnalisisDataForm.get("promOtrasAso")?.value;
    data.PuntajeExpirian = this.FichaAnalisisDataForm.get("puntExpirianAso")?.value;
    data.PuntajeTrans = this.FichaAnalisisDataForm.get("puntajeTransAso")?.value;
    let scoring = this.FichaAnalisisDataForm.get("scoringAso")?.value;
    data.ResultadoScoring = scoring == "0" ? "No aplica" : scoring;
    data.Activos = this.FichaAnalisisDataForm.get("activosAso")?.value;
    data.Pasivos = this.FichaAnalisisDataForm.get("pasivosAso")?.value;
    data.Patrimonio = this.FichaAnalisisDataForm.get("patrimonioAso")?.value;
    data.IngresoMensual = this.FichaAnalisisDataForm.get("ingresoMensualAso")?.value;
    data.PrcSolvencia = this.organizarPorcentajes(this.FichaAnalisisDataForm.get("prcSolvenciaAso")?.value);
    data.UtilidadNetaA = this.FichaAnalisisDataForm.get("utilidadNetaAso")?.value;
    data.CapPagoDir = this.FichaAnalisisDataForm.get("capacidadPagoAso")?.value;
    data.CapPagoTot = this.FichaAnalisisDataForm.get("capacidadPagoTotalAso")?.value;
    data.RentabilidadPatrimonio = this.FichaAnalisisDataForm.get("ROEAso")?.value;
    data.RentabilidadActivo = this.FichaAnalisisDataForm.get("ROAAso")?.value;
    data.MaxOpCancelReal = this.FichaAnalisisDataForm.get("MaxOpCancelRealAso")?.value;
    data.MaxOpCancelFinan = this.FichaAnalisisDataForm.get("MaxOpCancelFinanAso")?.value;
    data.MaxOpCancelFinanCoogra = this.FichaAnalisisDataForm.get("MaxOpCancelFinanCoograAso")?.value;
    data.EndeudamientoDir = this.FichaAnalisisDataForm.get("endeudamientoDirAso")?.value;
    data.EndeudamientoTot = this.FichaAnalisisDataForm.get("endeudamientoTotAso")?.value;
    data.AnalisisEstFinan = this.FichaAnalisisDataForm.get("descActivosAso")?.value;
    data.DescActivos = this.FichaAnalisisDataForm.get("descActivosAso")?.value;
    data.RecomendacionAnalista = this.FichaAnalisisDataForm.get("RecomendacionAnalista")?.value;
    data.ConceptoFinal = this.FichaAnalisisDataForm.get("ConceptoFinal")?.value;
    let dataU = localStorage.getItem('Data');
    this.DataUserLogeado = JSON.parse(window.atob(dataU == null ? "" : dataU));
    data.AnalistaEncargado = this.DataUserLogeado.Nombre;
    data.ExtinguidasCode = this.retornarStr(this.resultadoInfoRadicado[0]["ExtinguidasCode"])
    data.ExtinguidasPrin = this.retornarStr(this.resultadoInfoRadicado[0]["ExtinguidasPrin"])
    data.VigentesCode = this.retornarStr(this.resultadoInfoRadicado[0]["VigentesCode"])
    data.VigentesPrin = this.retornarStr(this.resultadoInfoRadicado[0]["VigentesPrin"])
    data.CheckList = this.ObtenerOAsignarCheckList();
    return data;
  }

  recolectarInfoCodeGeneral() {
    let data: Array<FADeudor>;
    data = [];
    this.resultadoCodeudores.forEach(codeudor => {
      let Code = new FADeudor();
      Code.Nombre = codeudor.Nombre;
      Code.Documento = codeudor.Documento;
      Code.Correo = codeudor.Correo;
      let stringFecha = "";
      if (codeudor.AsociadoDesde != null && codeudor.AsociadoDesde != "") {
        let fecha = new Date(codeudor.AsociadoDesde);
        let dia = fecha.getDate() > 9 ? fecha.getDate() : '0' + fecha.getDate();
        let mes = (fecha.getMonth() + 1) > 9 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1);
        stringFecha = fecha.getFullYear() + '/' + mes + '/' + dia;
      }
      Code.AsociadoDesde = stringFecha;
      Code.VlrAportes = this.validarAportes(codeudor);
      Code.Empresa = codeudor.Empresa; 
      Code.ActividadEconomica = codeudor.ActividadEconomica;
      if (codeudor.Antiguedad != undefined) {
        Code.Antiguedad = codeudor.Antiguedad
      } else {
        let anios = !this.isNumber(parseInt(codeudor.AntiguedadAnos)) ? "__" : (codeudor.AntiguedadAnos == null ? 0 : codeudor.AntiguedadAnos);
        let meses = !this.isNumber(parseInt(codeudor.AntiguedadMeses)) ? "__" : (codeudor.AntiguedadMeses == null ? 0 : codeudor.AntiguedadMeses);
        Code.Antiguedad = anios + " Años " + meses + " Meses"
      }
      Code.Ocupacion = codeudor.Ocupacion;
      if (codeudor.Score !== undefined && codeudor.Score !== null) {
        if (codeudor.Score.Puntaje !== undefined && codeudor.Score.Puntaje !== null) {
          Code.PuntajeTrans = codeudor.Score.Puntaje
        }
      }
      Code.Activos = this.isNumber(codeudor.Activos) ? codeudor.Activos : 0;
      Code.Pasivos = this.isNumber(codeudor.Pasivos) ? codeudor.Pasivos : 0;
      Code.Patrimonio = (this.isNumber(codeudor.Activos) ? codeudor.Activos : 0) - (this.isNumber(codeudor.Pasivos) ? codeudor.Pasivos : 0)
      Code.IngresoMensual = codeudor.Ingresos
      Code.EndeudamientoDir = this.organizarPorcentajes((this.division(codeudor.Pasivos, codeudor.Activos) * 100).toFixed(2)) + ' %';
      Code.EndeudamientoTot = this.organizarPorcentajes((this.division(codeudor.Pasivos, codeudor.Activos) * 100).toFixed(2)) + ' %';
      Code.PrcSolvencia = this.organizarPorcentajes((this.division(codeudor.Activos, codeudor.Pasivos) * 100).toFixed(2) + ' %');
      Code.PuntajeExpirian = codeudor.PuntajeExpirian;
      Code.ResultadoScoring = codeudor.ResultadoScoring;
      Code.MaxOpCancelReal = codeudor.MaxOpCancelReal;
      Code.MaxOpCancelFinan = codeudor.MaxOpCancelFinan;
      Code.MaxOpCancelFinanCoogra = codeudor.MaxOpCancelFinanCoogra
      Code.CapPagoDir = codeudor.CapPagoDir;
      Code.CapPagoTot = codeudor.CapPagoTot;
      Code.AnalisisEstFinan = codeudor.AnalisisEstFinan == undefined ? "" : codeudor.AnalisisEstFinan;
      Code.UtilidadNetaA = codeudor.UtilidadNetaA == "" ? "0" : codeudor.UtilidadNetaA;
      Code.RentabilidadPatrimonio = this.organizarPorcentajes(codeudor.RentabilidadPatrimonio)
      Code.RentabilidadActivo = this.organizarPorcentajes(codeudor.RentabilidadActivo)
  
      Code.lngRadicado = this.FichaAnalisisDataForm.get("noRadicado")?.value;
      Code.IdTercero = codeudor.idTercero;
      Code.ExtinguidasPrin = this.retornarStr(codeudor.ExtinguidasPrin)
      Code.ExtinguidasCode = this.retornarStr(codeudor.ExtinguidasCode)
      Code.VigentesCode = this.retornarStr(codeudor.VigentesCode)
      Code.VigentesPrin = this.retornarStr(codeudor.VigentesPrin)
      data.push(Code);
    });
    return data;
  }
  armarDataBase() {//Se settea en 1 los datos innecesarios para la actualización de naturales para que sea más fácil compararlos al final
    let data = new FADeudor();
    data.VlrAvaluo = 1;
    data.DetalleGarantia = 1;
    data.SeguroGarantia = 1;
    data.DescCobSeguro = 1;
    data.SeguroDeudor = 1;
    data.DescCobSeguroDeudor = 1;
    data.DescripcionInversion = 1;
    data.PromOtras = 1;
    data.PuntajeExpirian = 1;
    data.ResultadoScoring = 1;
    data.UtilidadNetaA = 1;
    data.CapPagoDir = 1;
    data.CapPagoTot = 1;
    data.RentabilidadPatrimonio = 1;
    data.RentabilidadActivo = 1;
    data.ConceptoFinal = 1;
    data.AnalistaEncargado = 1;
    data.CheckList = 1;
    data.AnalisisEstFinan = 1;
    data.DescActivos = 1;
    data.RecomendacionAnalista = 1;

   
    this.dataInsertInicial = this.setNullAinfoBase(data, this.dataInsertInicial);
    this.dataInsertFinal = this.setNullAinfoBase(data, this.dataInsertFinal);
    for (let i = 0; i < this.dataInsertInicialCode.length; i++) {
      this.dataInsertInicialCode[i] = this.setNullAinfoBase(data, this.dataInsertInicialCode[i]);
      if (this.dataInsertFinalCode[i] != undefined) {
        this.dataInsertFinalCode[i] = this.setNullAinfoBase(data, this.dataInsertFinalCode[i]);
      } else {
        this.dataInsertFinalCode[i] = new FADeudor();
        this.dataInsertFinalCode[i] = this.setNullAinfoBase(data, this.dataInsertFinalCode[i]);
      }
    }
  }
  setNullAinfoBase(Base : any, cambio: any) {
    for (let clave in Base) {
      if (Base[clave] == 1) {
        if (cambio[clave] != undefined) {
          cambio[clave] = null;
        }
      }
    }
    return cambio;
  }
  recolectarInfoFinal() {
    this.dataInsertFinal = this.recolectarInfoAsoGeneral();
    this.dataInsertFinalCode = this.recolectarInfoCodeGeneral();
  }
  compararDataParaActualizar() {
    this.recolectarInfoFinal();
    if (this.contenidoCodigo == 102) {
      this.armarDataBase();
    }
    for (let clave in this.dataInsertInicial) {
      if (this.validarNull(this.dataInsertInicial[clave]) != this.validarNull(this.dataInsertFinal[clave])) {
        return null;
      }
    }

    if (this.dataInsertInicialCode.length != this.dataInsertFinalCode.length) {
      return null;
    }

    for (let i = 0; i < this.dataInsertInicialCode.length; i++) {//array con los datos de la tabla fichaAnalisisCode
      let diferentes = 0;
      for (let j = 0; j < this.dataInsertFinalCode.length; j++) {//array de naturales
        if (this.dataInsertFinalCode[j]["Documento"] == this.dataInsertInicialCode[i]["Documento"]) {
          for (let clave in this.dataInsertInicialCode[i]) {
            if (this.validarNull(this.dataInsertInicialCode[i][clave]) != this.validarNull(this.dataInsertFinalCode[j][clave])) {
              return null;
            }
          }
        } else {
          diferentes++;
        }
      }
      if (this.dataInsertFinalCode.length != 0 && diferentes == this.dataInsertFinalCode.length) {
        return null;
      }
    }

    return true;
  }

  armarJsonDto() {
    let jsonDtoAnterior : any= {};
    let jsonDtoActual : any = {};
    let infoCodeAnterior = [];
    let infoCodeActual = [];

    this.recolectarInfoFinal();
    if (this.contenidoCodigo == 102) {
      this.armarDataBase();
    }

    for (let clave in this.dataInsertInicial) {
      if (this.dataInsertInicial[clave] != this.dataInsertFinal[clave]) {
        jsonDtoAnterior[clave] = this.dataInsertInicial[clave];
        jsonDtoActual[clave] = this.dataInsertFinal[clave];
      }
    }

    for (let i = 0; i < this.dataInsertInicialCode.length; i++) {
      for (let j = 0; j < this.dataInsertFinalCode.length; j++) {
        if (this.dataInsertFinalCode[j]["Documento"] == this.dataInsertInicialCode[i]["Documento"]) {
          let codeActual : any = {};
          let codeAnterior : any = {};
          let contador = 0;
          for (let clave in this.dataInsertInicialCode[i]) {
            if (this.dataInsertInicialCode[i][clave] != this.dataInsertFinalCode[j][clave]) {
              codeActual[clave] = this.dataInsertFinalCode[j][clave];
              codeAnterior[clave] = this.dataInsertInicialCode[i][clave];
              contador++;
            }
          }
          if (contador != 0) {
            infoCodeActual.push(codeActual);
            infoCodeAnterior.push(codeAnterior);
          }
        }
      }
    }
    if (infoCodeActual.length != 0) {
      jsonDtoActual["Codeudor"] = infoCodeActual;
      jsonDtoAnterior["Codeudor"] = infoCodeAnterior;
    }
    let json = {
      "jsonDtoAnterior": jsonDtoAnterior,
      "jsonDtoActual": jsonDtoActual,
    }
    return json;
  }
  validarAportes(data : any) {
    if (data.VlrAportes == undefined) {
      return data.ValorAportes;
    } else {
      return data.VlrAportes;
    }
  }
  retornarStr(variable : any) {
    if (this.isObject(variable) || this.isArray(variable)) {
      return JSON.stringify(variable)
    } else if (this.isString(variable)) {
      return variable
    } else {
      return "";
    }
    
  }
  isObject(value : any){
    return typeof value === 'object' && value !== null;
  }
  isString(value : any){
    return typeof value === 'string';
  }
  isArray(value : any){
    return Array.isArray(value);
  }
  validarVacio(variable : any) {
    if (variable == "" || variable == null) {
      return 0;
    }
    return variable;
  }
  cerrarModalCode() {
    this.resultadoCodeudores.forEach(codeudor => {
      if (codeudor.Documento == this.docCodSelected) {
        codeudor.PuntajeExpirian = this.CodeudorForm.get('puntExpirianCode')?.value;
        if (codeudor.PuntajeExpirian < 0 || codeudor.puntExpirian > 1000) {
          codeudor.PuntajeExpirian = "";
          this.notif.onWarning('Advertencia', 'No se admiten valores menores de mil o negativos.');
        }
        let scoring = this.CodeudorForm.get('scoringCode')?.value;
        codeudor.ResultadoScoring = scoring == "0" ? "No aplica" : scoring;
        codeudor.CapPagoDir = this.validarVacio(this.CodeudorForm.get('capacidadPagoCode')?.value);
        codeudor.CapPagoTot = this.validarVacio(this.CodeudorForm.get('capacidadPagoTotalCode')?.value);
        codeudor.UtilidadNetaA = this.validarVacio(this.CodeudorForm.get('utilidadNetaCode')?.value);
        codeudor.RentabilidadActivo = this.validarVacio(this.CodeudorForm.get('ROACode')?.value);
        codeudor.RentabilidadPatrimonio = this.validarVacio(this.CodeudorForm.get('ROECode')?.value);
        codeudor.AnalisisEstFinan =  this.CodeudorForm.get('AnalisisEstFinanCode')?.value;
        codeudor.Patrimonio = this.validarVacio(this.CodeudorForm.get('patrimonioCod')?.value);
      }
    });
    this.codSelected = [];
    this.CodeudorForm?.reset();
    this.modificarbtnBuscar();
  }
  cerrarModalPDF() {
    this.FichaOperacionForm.get('Codigo')?.reset();
  }
  codeudorSeleccionado(documento : string) {
    this.docCodSelected = documento;
    this.codSelected = [];
    this.resultadoCodeudores.forEach(element => {
      if (element.Documento == documento) {
        this.codSelected.push(element);
        this.CodeudorForm.get('nombreCod')?.setValue(element.Nombre);
        this.CodeudorForm.get('identCod')?.setValue(element.Documento);
        this.CodeudorForm.get('correoCod')?.setValue(element.Correo);
        this.CodeudorForm.get('ActividadEconomicaCod')?.setValue(element.ActividadEconomica); 
        this.CodeudorForm.get('empresaCod')?.setValue(element.Empresa);
        this.CodeudorForm.get('ocupacionCod')?.setValue(element.Ocupacion);
        this.CodeudorForm.get('activosCod')?.setValue(this.isNumber(element.Activos) ? element.Activos : 0);
        this.CodeudorForm.get('pasivosCod')?.setValue(this.isNumber(element.Pasivos) ? element.Pasivos : 0);
        this.CodeudorForm.get('patrimonioCod')?.setValue(element.Activos - element.Pasivos);
        this.CodeudorForm.get('ingresoMensualCod')?.setValue(element.Ingresos);
        this.CodeudorForm.get('MaxOpCancelFinanCode')?.setValue(element.MaxOpCancelFinan);
        this.CodeudorForm.get('MaxOpCancelRealCode')?.setValue(element.MaxOpCancelReal);
        this.CodeudorForm.get('MaxOpCancelFinanCoograCode')?.setValue(element.MaxOpCancelFinanCoogra);
        this.CodeudorForm.get('ROACode')?.setValue(this.organizarPorcentajes(element.RentabilidadActivo != "" ? element.RentabilidadActivo : "0.00"));
        this.CodeudorForm.get('ROECode')?.setValue(this.organizarPorcentajes(element.RentabilidadPatrimonio != "" ? element.RentabilidadPatrimonio : "0.00"));
        this.CodeudorForm.get('utilidadNetaCode')?.setValue((element.UtilidadNetaA == "" || element.UtilidadNetaA == null) ? 0 : element.UtilidadNetaA);
        this.CodeudorForm.get('capacidadPagoCode')?.setValue(element.CapPagoDir == "" ? '0' : element.CapPagoDir);
        this.CodeudorForm.get('capacidadPagoTotalCode')?.setValue(element.CapPagoTot == "" ? '0' : element.CapPagoTot);
        this.CodeudorForm.get('AnalisisEstFinanCode')?.setValue(element.AnalisisEstFinan);
        if (this.contenidoCodigo == 90) {//para crear
          this.CodeudorForm.get('vlrAportesCod')?.setValue((element.ValorAportes == null) ? 0 : element.ValorAportes);
          if (this.contenidoCodigo != 1) {
            let anios = !this.isNumber(parseInt(element.AntiguedadAnos)) ? "__" : (element.AntiguedadAnos == null ? 0 : element.AntiguedadAnos);
            let meses = !this.isNumber(parseInt(element.AntiguedadMeses)) ? "__" : (element.AntiguedadMeses == null ? 0 : element.AntiguedadMeses);
            this.CodeudorForm.get('antiguedadCod')?.setValue(anios + " Años  " + meses + " Meses");
            if (element.Score !== undefined && element.Score !== null) {
              if (element.Score.Puntaje !== undefined && element.Score.Puntaje !== null) {
                this.CodeudorForm.get('puntajeTransCod')?.setValue(element.Score.Puntaje);
              }
            }
          } else {
            this.CodeudorForm.get('puntajeTransCod')?.setValue(element.PuntajeTrans);
            this.CodeudorForm.get('antiguedadCod')?.setValue(element.Antiguedad);
          }
          let stringFecha = "";
          if (element.AsociadoDesde != null && element.AsociadoDesde != "") {
            let fecha = new Date(element.AsociadoDesde)
            let dia = fecha.getDate() > 9 ? fecha.getDate() : '0' + fecha.getDate();
            let mes = (fecha.getMonth() + 1) > 9 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1);
            stringFecha = fecha.getFullYear() + '/' + mes + '/' + dia;
          }
          this.CodeudorForm.get('asociadoDesdeCod')?.setValue(stringFecha);
          this.CodeudorForm.get('endeudamientoDirCod')?.setValue(this.organizarPorcentajes((this.division(element.Pasivos, element.Activos) * 100).toFixed(2) + ' %'));
          this.CodeudorForm.get('endeudamientoTotCod')?.setValue(this.organizarPorcentajes((this.division(element.Pasivos, element.Activos) * 100).toFixed(2) + ' %'));
          this.CodeudorForm.get('prcSolvenciaCod')?.setValue(this.organizarPorcentajes((this.division(element.Activos, element.Pasivos) * 100).toFixed(2) + ' %'));
          this.CodeudorForm.get('puntExpirianCode')?.setValue(element.PuntajeExpirian);
          this.CodeudorForm.get('scoringCode')?.setValue(element.ResultadoScoring);
        } else { //para las demás opeeraciones
          this.CodeudorForm.get('antiguedadCod')?.setValue(element.Antiguedad);
          this.CodeudorForm.get('asociadoDesdeCod')?.setValue(element.AsociadoDesde);
          this.CodeudorForm.get('puntajeTransCod')?.setValue(element.PuntajeTrans);
          this.CodeudorForm.get('vlrAportesCod')?.setValue(element.VlrAportes);
          this.CodeudorForm.get('prcSolvenciaCod')?.setValue(this.organizarPorcentajes(element.PrcSolvencia));
          this.CodeudorForm.get('puntExpirianCode')?.setValue(element.PuntajeExpirian);
          this.CodeudorForm.get('scoringCode')?.setValue(element.ResultadoScoring);
          
          this.CodeudorForm.get('endeudamientoDirCod')?.setValue(this.organizarPorcentajes(element.EndeudaminetoDirecto));
          this.CodeudorForm.get('endeudamientoTotCod')?.setValue(this.organizarPorcentajes(element.EndeudamientoTot));
          element.ExtinguidasCode = element.ExtinguidasCode;
          element.ExtinguidasPrin = element.ExtinguidasPrin;
          element.VigentesPrin = element.VigentesPrin;
          element.VigentesCode = element.VigentesCode;
          this.codSelected = [];
          this.codSelected.push(element);
        }
      }
    });
  }
 

  division(dividendo : any, divisor : any) {
    dividendo = (dividendo == null || dividendo == "") ? 0 : dividendo
    divisor = (divisor == null || divisor == "") ? 0 : divisor
    let numerador = this.isNumber(parseInt(dividendo)) ? parseInt(dividendo) : 0;
    let denominador = this.isNumber(parseInt(divisor)) ? parseInt(divisor) : 0;
    if (denominador != 0) {
      return numerador / denominador;
    } else {
      return 0;
    }
  }
  validarEnviadoAlWorkmanager(enviado : string) {
    if (enviado != undefined) {
      if (enviado) {
        return "Sí"
      } else {
        return "No"
      }
    } else {
      return "No";
    }
  }
  asignarInfoAso(response : any[], crear = true, recolectarInfoInicial=true) {
    response.forEach(element => {
      this.esJuridico = element.EsJuridico;
      this.radicadoActual = element.IdRadicado;
      this.FichaAnalisisDataForm.get('noRadicado')?.setValue(element.IdRadicado);
      this.FichaAnalisisDataForm.get('monto')?.setValue(element.MontoCredito);
      this.FichaAnalisisDataForm.get('destino')?.setValue(element.DestinoCredito);
      this.FichaAnalisisDataForm.get('linea')?.setValue(element.Linea);
      this.FichaAnalisisDataForm.get('formaPago')?.setValue(element.FormaPago);
      this.FichaAnalisisDataForm.get('plazo')?.setValue(element.Plazo);
      this.FichaAnalisisDataForm.get('cuota')?.setValue(element.Cuota);
      this.FichaAnalisisDataForm.get('enviado')?.setValue(this.validarEnviadoAlWorkmanager(element.EnviadoAlWorkManager));
      this.FichaAnalisisDataForm.get('nombreAso')?.setValue(element.Nombre);
      this.FichaAnalisisDataForm.get('identAso')?.setValue(element.NumeroDocumento);
      this.FichaAnalisisDataForm.get('correoAso')?.setValue(element.Correo);
      this.organizarCuentas(element.Cuentas)
      this.FichaAnalisisDataForm.get('ingresoMensualAso')?.setValue(element.Ingresos);
      this.FichaAnalisisDataForm.get('pasivosAso')?.setValue(this.isNumber(element.Pasivos) ? element.Pasivos.toFixed(2) : 0.00);
      this.FichaAnalisisDataForm.get('activosAso')?.setValue(this.isNumber(element.Activos) ? element.Activos.toFixed(2) : 0.00);
      this.FichaAnalisisDataForm.get('vlrAportesAso')?.setValue(element.ValorAportes);
      this.FichaAnalisisDataForm.get('empresaAso')?.setValue(element.Empresa);
      this.FichaAnalisisDataForm.get('ActividadEconomicaAso')?.setValue(element.ActividadEconomica);
      this.FichaAnalisisDataForm.get('ocupacionAso')?.setValue(element.Ocupacion);
      this.FichaAnalisisDataForm.get("MaxOpCancelRealAso")?.setValue(element.MaxOpCancelReal);
      this.FichaAnalisisDataForm.get("MaxOpCancelFinanAso")?.setValue(element.MaxOpCancelFinan);
      this.FichaAnalisisDataForm.get("MaxOpCancelFinanCoograAso")?.setValue(element.MaxOpCancelFinanCoogra);
      this.FichaOperacionForm.get("Documento")?.setValue(element.NumeroDocumento);
      this.FichaOperacionForm.get('Radicado')?.setValue(element.IdRadicado);
      this.FichaAnalisisDataForm.get('garantia')?.setValue(element.Garantia);
        
      if (crear) {
        this.FichaAnalisisDataForm.get('tasa')?.setValue(element.Tasa + " %");
        let stringFecha = "";
        if (element.AsociadoDesde != null) {
          let fecha = new Date(element.AsociadoDesde);
          let dia = fecha.getDate() > 9 ? fecha.getDate() : '0' + fecha.getDate();
          let mes = (fecha.getMonth() + 1) > 9 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1);
          stringFecha = fecha.getFullYear() + '/' + mes + '/' + dia;
        }
        this.FichaAnalisisDataForm.get('asociadoDesdeAso')?.setValue(stringFecha);
        if (element.Score !== undefined && element.Score !== null) {
          if (element.Score.Puntaje !== undefined && element.Score.Puntaje !== null) {
            this.FichaAnalisisDataForm.get('puntajeTransAso')?.setValue(element.Score.Puntaje);
          }
        }
        if (element.EsJuridico == 0) {
          this.bloquearBuscarEmpresa = true;
        } else {
          this.bloquearBuscarEmpresa = null;
        }
        let anios = !this.isNumber(parseInt(element.AntiguedadAnos)) ? "__" : (element.AntiguedadAnos == null ? 0 : element.AntiguedadAnos);
        let meses = !this.isNumber(parseInt(element.AntiguedadMeses)) ? "__" : (element.AntiguedadMeses == null ? 0 : element.AntiguedadMeses);
        this.FichaAnalisisDataForm.get('antiguedadAso')?.setValue(anios + " Años  " + meses + " Meses");
        this.FichaAnalisisDataForm.get('patrimonioAso')?.setValue(element.Activos - element.Pasivos);
        this.FichaAnalisisDataForm.get('endeudamientoDirAso')?.setValue(this.organizarPorcentajes((this.division(element.Pasivos, element.Activos) * 100).toFixed(2) + ' %'));
        this.FichaAnalisisDataForm.get('endeudamientoTotAso')?.setValue(this.organizarPorcentajes((this.division(element.Pasivos, element.Activos) * 100).toFixed(2) + ' %'));
        let solv = (this.division(element.Activos, element.Pasivos) * 100).toFixed(2);
        this.FichaAnalisisDataForm.get('prcSolvenciaAso')?.setValue(this.organizarPorcentajes(solv));
        this.FichaAnalisisDataForm.get("utilidadNetaAso")?.setValue(0);
        this.FichaAnalisisDataForm.get("ROEAso")?.setValue(this.organizarPorcentajes("0.00 %"));
        this.FichaAnalisisDataForm.get("ROAAso")?.setValue(this.organizarPorcentajes("0.00 %"));
        this.FichaAnalisisDataForm.get("capacidadPagoAso")?.setValue("0");
        this.FichaAnalisisDataForm.get("capacidadPagoTotalAso")?.setValue("0");
        this.FichaAnalisisDataForm.get('vlrAvaluo')?.setValue("0");
        this.FichaAnalisisDataForm.get("promOtrasAso")?.setValue("0");
        this.FichaAnalisisDataForm.get("utilidadNetaAso")?.setValue("0");
        let data = localStorage.getItem('Data');
    this.DataUserLogeado = JSON.parse(window.atob(data == null ? "" : data));
        this.FichaAnalisisDataForm.get("AnalistaEncargado")?.setValue(this.DataUserLogeado.Nombre);
          
      } else {
        //mappeo de datos del asociado
        this.FichaAnalisisDataForm.get('tasa')?.setValue(element.Tasa);
        this.FichaAnalisisDataForm.get('asociadoDesdeAso')?.setValue(element.AsociadoDesde);
        this.FichaAnalisisDataForm.get('puntajeTransAso')?.setValue(element.PuntajeTrans);
        this.FichaAnalisisDataForm.get('antiguedadAso')?.setValue(element.Antiguedad);
        this.FichaAnalisisDataForm.get('patrimonioAso')?.setValue(element.Patrimonio);
        this.FichaAnalisisDataForm.get('prcSolvenciaAso')?.setValue(this.organizarPorcentajes(element.PrcSolvencia));
        this.FichaAnalisisDataForm.get('endeudamientoDirAso')?.setValue(element.EndeudamientoDir);
        this.FichaAnalisisDataForm.get('endeudamientoTotAso')?.setValue(element.EndeudamientoTot);
        this.FichaAnalisisDataForm.get('vlrAvaluo')?.setValue(element.VlrAvaluo);
        this.FichaAnalisisDataForm.get("dscGarantia")?.setValue(element.DetalleGarantia);
        this.FichaAnalisisDataForm.get("cobSeguroGarantia")?.setValue(element.SeguroGarantia ? 1 : 0);
        this.FichaAnalisisDataForm.get("dscCoberturaSeguro")?.setValue(element.DescCobSeguro);
        this.FichaAnalisisDataForm.get("cobSeguroDeudor")?.setValue(element.SeguroDeudor ? 1 : 0);
        this.FichaAnalisisDataForm.get("dscCobDeudor")?.setValue(element.DescCobSeguroDeudor);
        this.FichaAnalisisDataForm.get("dscInversion")?.setValue(element.DescripcionInversion);
        this.FichaAnalisisDataForm.get("promOtrasAso")?.setValue(element.PromOtras);
        this.FichaAnalisisDataForm.get("puntExpirianAso")?.setValue(element.PuntajeExpirian);
        this.FichaAnalisisDataForm.get("scoringAso")?.setValue(element.ResultadoScoring);
        this.FichaAnalisisDataForm.get("MaxOpCancelRealAso")?.setValue(element.MaxOpCancelReal);
        this.FichaAnalisisDataForm.get("MaxOpCancelFinanAso")?.setValue(element.MaxOpCancelFinan);
        this.FichaAnalisisDataForm.get("MaxOpCancelFinanCoograAso")?.setValue(element.MaxOpCancelFinanCoogra);
        this.FichaAnalisisDataForm.get("capacidadPagoAso")?.setValue(element.CapPagoDir);
        this.FichaAnalisisDataForm.get("capacidadPagoTotalAso")?.setValue(element.CapPagoTot);
        this.FichaAnalisisDataForm.get("utilidadNetaAso")?.setValue(element.UtilidadNetaA);
        this.FichaAnalisisDataForm.get("ROAAso")?.setValue(this.organizarPorcentajes(element.RentabilidadActivo));
        this.FichaAnalisisDataForm.get("ROEAso")?.setValue(this.organizarPorcentajes(element.RentabilidadPatrimonio));
        this.FichaAnalisisDataForm.get("descActivosAso")?.setValue(element.AnalisisEstFinan);
        this.FichaAnalisisDataForm.get("ConceptoFinal")?.setValue(element.ConceptoFinal);
        this.FichaAnalisisDataForm.get("RecomendacionAnalista")?.setValue(element.RecomendacionAnalista);
        this.FichaAnalisisDataForm.get("AnalistaEncargado")?.setValue(element.AnalistaEncargado);
        
        this.ObtenerOAsignarCheckList(false, element.CheckList);
      }
    });
    if (recolectarInfoInicial) {
      this.dataInsertInicial = this.recolectarInfoAsoGeneral();
    }
  }
  organizarCuentas(cuentas :  any)  {
    cuentas = JSON.parse(cuentas);
    this.btnCuentas = false;
    this.FichaAnalisisDataForm.get('promCoogranadaAso')?.setValue('0');
    if (this.isArray(cuentas)) {
      this.dataCuentas = cuentas;
      if (cuentas.length == 1) {
        this.btnCuentas = false;
        let c : any[] = cuentas
        let prom : any  = c[0]["Promedio"] + '';
        this.FichaAnalisisDataForm.get('promCoogranadaAso')?.setValue(prom);
      } else if (cuentas.length > 1){
        this.btnCuentas = true;
      }
    }
  }
  EVAL(value : any){
    const result = new Function('return ' + value)();
    return result;
    }
  organizarInfoExtinguidasYVigentes(response : any[]) {
    response.forEach(element => {
      if (this.isString(element.ExtinguidasCode)) {
        element.ExtinguidasCode = this.EVAL(element.ExtinguidasCode);
        if (this.isString(element.ExtinguidasCode)) {
          element.ExtinguidasCode = this.EVAL(element.ExtinguidasCode);
        }
      } else if (this.isArray(element.ExtinguidasCode)) {
        element.ExtinguidasCode = element.ExtinguidasCode;
      } else {
        element.ExtinguidasCode = [];
      }
    
      if (this.isString(element.ExtinguidasPrin)) {
        element.ExtinguidasPrin = this.EVAL(element.ExtinguidasPrin);
        if (this.isString(element.ExtinguidasPrin)) {
          element.ExtinguidasPrin = this.EVAL(element.ExtinguidasPrin);
        }
      } else if (this.isArray(element.ExtinguidasPrin)) {
        element.ExtinguidasPrin = element.ExtinguidasPrin;
      } else {
        element.ExtinguidasPrin = [];
      }

      if (this.isString(element.VigentesPrin)) {
        element.VigentesPrin = this.EVAL(element.VigentesPrin);
        if (this.isString(element.VigentesPrin)) {
          element.VigentesPrin = this.EVAL(element.VigentesPrin);
        }
      } else if (this.isArray(element.VigentesPrin)) {
        element.VigentesPrin = element.VigentesPrin;
      } else {
        element.VigentesPrin = [];
      }

      if (this.isString(element.VigentesCode)) {
        element.VigentesCode = this.EVAL(element.VigentesCode);
        if (this.isString(element.VigentesCode)) {
          element.VigentesCode = this.EVAL(element.VigentesCode);
        }
      } else if (this.isArray(element.VigentesCode)) {
        element.VigentesCode = element.VigentesCode;
      } else {
        element.VigentesCode = [];
      }
    });
    
    return response;
  }

  utilidadDigitada() {
    const utilidad = this.FichaAnalisisDataForm.get('utilidadNetaAso')?.value;
    const activos = parseFloat(this.FichaAnalisisDataForm.get('activosAso')?.value);
    const patrimonio = parseFloat(this.FichaAnalisisDataForm.get('patrimonioAso')?.value);
    let roa;
    let roe;
    roa = (this.division(utilidad, activos) * 100).toFixed(2);
    roe = (this.division(utilidad, patrimonio) * 100).toFixed(2);
    this.FichaAnalisisDataForm.get('ROAAso')?.setValue(this.organizarPorcentajes(roa));
    this.FichaAnalisisDataForm.get('ROEAso')?.setValue(this.organizarPorcentajes(roe));
    
    this.modificarbtnBuscar();
  }

  utilidadCodeDigitada() {
    const utilidad = this.CodeudorForm.get('utilidadNetaCode')?.value;
    const activos = parseFloat(this.CodeudorForm.get('activosCod')?.value);
    const patrimonio = parseFloat(this.CodeudorForm.get('patrimonioCod')?.value);
    let roa;
    let roe;
    roa = (this.division(utilidad, activos) * 100).toFixed(2);
    roe = (this.division(utilidad, patrimonio) * 100).toFixed(2);
    this.resultadoCodeudores.forEach(codeudor => {
      if (codeudor.Documento == this.CodeudorForm.get('identCod')?.value) {
        codeudor.RentabilidadPatrimonio = roe;
        codeudor.RentabilidadActivo = roa;
        this.CodeudorForm.get('ROACode')?.setValue(this.organizarPorcentajes(roa));
        this.CodeudorForm.get('ROECode')?.setValue(this.organizarPorcentajes(roe));
      }
    })
  }

 
  validarNegativoVlrAvaluo(e : any)  {
    let vlrAvaluo = (this.FichaAnalisisDataForm.get('vlrAvaluo')?.value == null || this.FichaAnalisisDataForm.get('vlrAvaluo')?.value == "") ? 0 : this.FichaAnalisisDataForm.get('vlrAvaluo')?.value;
    if (vlrAvaluo < 0) {
      this.FichaAnalisisDataForm.get('vlrAvaluo')?.setValue("0");
      this.notif.onWarning('Advertencia', 'No se admiten valores negativos.');
    }
  }
  validarNegativoPromedio(e : any) {
    let prom = (this.FichaAnalisisDataForm.get('promOtrasAso')?.value == null || this.FichaAnalisisDataForm.get('promOtrasAso')?.value == "") ? 0 : this.FichaAnalisisDataForm.get('promOtrasAso')?.value;
    if (prom < 0) {
      this.FichaAnalisisDataForm.get('promOtrasAso')?.setValue("0");
      this.notif.onWarning('Advertencia', 'No se admiten valores negativos.');
    }
    this.modificarbtnBuscar();
  }

  menorDeMilValidate(caso : number, event : any) {
    if (event.keyCode == 189) {
      switch (caso) {
        case 0:
          this.FichaAnalisisDataForm.get('puntExpirianAso')?.reset();
          this.notif.onWarning('Advertencia', 'No se admiten valores mayores de mil o negativos.');
          break;
        case 1:
          this.notif.onWarning('Advertencia', 'No se admiten valores mayores de mil o negativos.');
          this.CodeudorForm.get('puntExpirianCode')?.reset();
          break;
      }
    } else {
      let valores =
        [
          (this.FichaAnalisisDataForm.get('puntExpirianAso')?.value == null || this.FichaAnalisisDataForm.get('puntExpirianAso')?.value == "") ? 0 : this.FichaAnalisisDataForm.get('puntExpirianAso')?.value,
          (this.CodeudorForm.get('puntExpirianCode')?.value == null || this.CodeudorForm.get('puntExpirianCode')?.value == "") ? 0 : this.CodeudorForm.get('puntExpirianCode')?.value
        ]
      if (parseInt(valores[caso]) > 1000 || parseInt(valores[caso]) < 0) {
        switch (caso) {
          case 0:
            this.notif.onWarning('Advertencia', 'No se admiten valores mayores de mil o negativos.');
            this.FichaAnalisisDataForm.get('puntExpirianAso')?.reset();
            break;
          case 1:
            this.notif.onWarning('Advertencia', 'No se admiten valores mayores de mil o negativos.');
            this.CodeudorForm.get('puntExpirianCode')?.reset();
            break;
        }
      }
    }
  }

  modificarbtnBuscar() {
    if (this.contenidoCodigo != 90) this.BloquearBotonGuardar = this.compararDataParaActualizar();
  }
  
  enterModal(e : any, campo = '') {
    e.preventDefault();
    
    if (campo != '') {
      //[jherrera][2024/04/08] se valida el parametro "campo" para saber si hace parte de los codeudores y así saber en que form está el campo realmente
      let data = campo.includes("Code") ? this.CodeudorForm.get(campo)?.value : this.FichaAnalisisDataForm.get(campo)?.value;
      data = data + '\n'
      campo.includes("Code") ? this.CodeudorForm.get(campo)?.setValue(data) : this.FichaAnalisisDataForm.get(campo)?.setValue(data);
    }
  }

  enviarFichaAlWorkManager() {
    this.loading = true;
    let data = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.FichaAnalisisService.GenerarPDFFichaAnalisis(this.radicadoActual).subscribe(
      (result) => {
        const pdfinBase64 = result.FileStream._buffer;
        this.linkPdf = pdfinBase64;
        this.dataAttachFiles.base64 = this.linkPdf;
        this.dataAttachFiles.Documento = this.FichaAnalisisDataForm.get("identAso")?.value;
        this.dataAttachFiles.Radicado = this.radicadoActual;
        this.dataAttachFiles.idWorkFlow = this.workFlowId;
        this.dataAttachFiles.usuario = this.dataUser.Usuario
        this.FichaAnalisisService.EnvioFichaAnalisisWorkManager(this.dataAttachFiles).subscribe(
          (result) => {
            let resultado = result;
            if (this.isString(resultado["_body"])) {
              let jsonResponse = JSON.parse(resultado["_body"]);
              if (jsonResponse.Success) {
                this.FichaAnalisisService.actualizarColEnvioAlWM(this.radicadoActual, 1).pipe(
                  retry(2),
                  delay(1000)
                ).subscribe(
                  res => {
                    this.notif.onSuccess('Exitoso', 'Se envió al workmangaer correctamente.');
                    this.recolectarInfoLog();
                    this.ClearAll();
                    this.loading = false;
                  },
                  err => {
                    this.loading = false;
                    this.notif.onWarning('Advertencia', 'Se envió al workmangaer correctamente.');
                  }
                )
              } else {
                this.loading = false;
                this.notif.onWarning('Advertencia', 'No se envió al workmanager.');
                $("#procesowf").val("");
                this.workFlowId = "";
                this.FichaOperacionForm.get('Codigo')?.reset();
              }
            }
          },
          error => {
            this.notif.onWarning('Advertencia', 'No se envió al workmanager.');
            this.loading = false;
            this.infoRadicado = true;
            this.FichaOperacionForm.get('Codigo')?.reset();
          }
        )
      },
      (error) => {
        this.notif.onWarning('Advertencia', 'No se envió al workmanager.');
        this.loading = false;
        this.infoRadicado = true;
        this.FichaOperacionForm.get('Codigo')?.reset();
      }
    );
  }

  mostrarPDF() {
    $("#BotonPDF").click();
    this.loading = true;
    this.infoPdfTrue = true;
    const radicado = this.radicadoActual;
    this.FichaAnalisisService.GenerarPDFFichaAnalisis(radicado).subscribe(
      (result) => {
        this.loading = false;
        this.recolectarInfoLog();
        const pdfinBase64 = result.FileStream._buffer;
        this.linkPdf = pdfinBase64;
        const byteArray = new Uint8Array(atob(pdfinBase64).split("").map((char) => char.charCodeAt(0)));
        const newBolb = new Blob([byteArray], { type: "application/pdf" });
        const url = window.URL.createObjectURL(newBolb);
        document.getElementById("PDF")?.setAttribute("data", url);
        document.getElementById("PDF")?.setAttribute("name", "document");
      },
      (error) => {
        this.notif.onWarning('Advertencia', 'No se generó el PDF.');
        this.loading = false;
        this.infoRadicado = true;
        console.log(error);
      }
    );
  }

  BuscarPorDoc(operacion : string, documento : string) {
    this.dataDeudores = [];
    this.FichaAnalisisService.getFichaAnalisisPorDocumento(operacion, documento).subscribe(
      res => {
        if (res.length == 0) {
          this.notif.onWarning('Advertencia', 'No se encontró información.');
          this.infoRadicado = false;
        }
        else if (res.length == 1) {
          this.ConsultarInfoPorRadicado(res[0].Radicado);
        } else {
          this.dataDeudores = res;
          $("#BotonDeudores").click();
        }
      },
      error => {
        console.log(error);
      }
    )
  }
  
  bloquearModal(e : any) {
    if (e.KeyCode === 13) {
      e.preventDefault();
    }
  }

  organizarPorcentajes(text : string) {
    let retornar = "";
    this.isString(text) ? retornar = text : "";
    while (retornar.includes("%")) {
      retornar = retornar.replace("%", "");
      retornar = retornar.replace(" ", "");
    }
    retornar = retornar == "" ? "0.00" : retornar;
    return (retornar + " %");
  }

  ConsultarInfoPorRadicado(radicado : string) {
    this.FichaOperacionForm.get('Radicado')?.setValue(radicado);
    this.radicadoActual = radicado;
    if (this.contenidoCodigo === '90') this.OperacionCrearFichaAnalisis();
    else if (this.contenidoCodigo === '2') this.OperacionBuscarFichaAnalisis();
  }

  ConfirmarActualizarDeNaturales() {
    swal.fire({
      title: 'Advertencia',
      text: '',
      html: '¿ Desea realizar la actualización ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((res) => {
      if (res.value) {
        this.ActualizarDeNaturales();
      } else {
        this.FichaOperacionForm.get('Codigo')?.reset();
        this.strDatos = "/Buscar";
      }
    });
  }
  ConfirmarEnviarAlWorkManager() {
    swal.fire({
      title: 'Advertencia',
      text: '',
      html: `¿Está seguro que el número de proceso ${this.workFlowId} es correcto?` ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((res) => {
      if (res.value) {
        this.enviarFichaAlWorkManager();
      } else {
        this.FichaOperacionForm.get('Codigo')?.reset();
        this.workFlowId = "";
        $("#procesowf").val("")
        this.strDatos = "/Buscar";
      }
    });
  }
  ConfirmarAutorizacion() {
    swal.fire({
      title: 'Advertencia',
      text: '',
      html: '¿ Desea realizar la autorización ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((res) => {
      if (res.value) {
        this.autorizacion();
      } else {
        this.FichaOperacionForm.get('Codigo')?.reset();
        this.strDatos = "/Buscar";
      }
    });
  }
  autorizacion() {
    this.loading = true;
    this.FichaAnalisisService.actualizarColEnvioAlWM(this.radicadoActual, 0).subscribe(
      result => {
        this.recolectarInfoLog();
        this.notif.onSuccess('Exitoso', 'El estado de la ficha de análisis fue actualizado correctamente.');
        this.OperacionBuscarFichaAnalisis();
        this.loading = false;
      }, error => {
        this.notif.onWarning('Advertencia', 'No se ejecutó la autorización.');
      }
    )
  }
  procesoWFChange() {
    this.workFlowId = $("#procesowf").val();
    if (this.workFlowId != "" && this.workFlowId != null) {
      this.btnEnviarWorkF = null;
    } else {
      this.btnEnviarWorkF = true;
    }
  }

  CapturarWorkFlowId(cerrar = 0) {
    if (cerrar == 0) {
      this.workFlowId = $("#procesowf").val();
      this.ConfirmarEnviarAlWorkManager();
      $("#cerrarModalEnviarWM").click();
    } else {
      $("#procesowf").val("");
      this.FichaOperacionForm.get('Codigo')?.reset();
      this.strDatos = "/Buscar";
      this.workFlowId = "";
      this.btnEnviarWorkF = true;
    }
  }
  
  ActualizarDeNaturales() {
    const radicado = this.FichaOperacionForm.get('Radicado')?.value;
    this.loading = true;
    this.FichaAnalisisService.BuscarRadicado(radicado).subscribe(
      resultado => {
        if (resultado.length != 0) {
          this.resultadoInfoRadicado = [];
          this.resultadoInfoRadicado = resultado;
          this.resultadoInfoRadicado = this.AñadirValoresAResponse(this.resultadoInfoRadicado);
          this.asignarInfoAso(this.resultadoInfoRadicado,true, false);
  
          this.FichaAnalisisService.BuscarInfoCodeudor(radicado).subscribe(
            res => {
              if (this.resultadoInfoRadicado.length != 0) {
                this.resultadoCodeudores = [];
                this.resultadoCodeudores = res;
                this.resultadoCodeudores = this.AñadirValoresAResponse(this.resultadoCodeudores);
                let actualizar = this.compararDataParaActualizar();
                if (actualizar == null) {
                  this.armarDataBase()
                  this.recolectarInfo();
                } else {
                  this.notif.onWarning('Advertencia', 'No hay información para actualizar.');
                  this.FichaOperacionForm.get('Codigo')?.reset();
                  this.strDatos = "/Buscar";
                  this.OperacionBuscarFichaAnalisis();
                }
                this.loading = false;
              } else {
                this.resultadoCodeudores = [];
                let actualizar = this.compararDataParaActualizar();
                if (actualizar != true) {
                  this.armarDataBase();
                  this.recolectarInfo();
                } else {
                  this.notif.onWarning('Advertencia', 'No hay información para actualizar.');
                  this.FichaOperacionForm.get('Codigo')?.reset();
                  this.strDatos = "/Buscar";
                  this.OperacionBuscarFichaAnalisis();
                }
                this.loading = false;
              }
            },
            error => {
              const errorMessage = <any>error;
              this.loading = false;
              console.log(errorMessage);
            }
          )
        } else {
          this.resultadoCodeudores = [];
          this.infoRadicado = false;
          this.resultadoInfoRadicado = [];
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      })
  }

  validarNullCheckList(variable : any) {
    if (variable == null) {
      return false;
    }
    return variable;
  }

  ObtenerOAsignarCheckList(Obtener = true, checkliststring = "") {
    if (Obtener) {
      let checklist = new CheckList();
      checklist.InfoActualizadaSGF = this.validarNullCheckList(this.FichaAnalisisDataForm.get("InfoActualizadaSGF")?.value);
      checklist.CondicionesCredito = this.validarNullCheckList(this.FichaAnalisisDataForm.get("CondicionesCredito")?.value);
      checklist.FormatoAsegurabilidad = this.validarNullCheckList(this.FichaAnalisisDataForm.get("FormatoAsegurabilidad")?.value);
      checklist.ListaRestrictiva = this.validarNullCheckList(this.FichaAnalisisDataForm.get("ListaRestrictiva")?.value);
      checklist.Avaluo = this.validarNullCheckList(this.FichaAnalisisDataForm.get("Avaluo")?.value);
      checklist.Scoring = this.validarNullCheckList(this.FichaAnalisisDataForm.get("Scoring")?.value);
      checklist.EstudiosTitulos = this.validarNullCheckList(this.FichaAnalisisDataForm.get("EstudiosTitulos")?.value);
      checklist.PolizaIncendios = this.validarNullCheckList(this.FichaAnalisisDataForm.get("PolizaIncendios")?.value);
      checklist.EstadoDeCuenta = this.validarNullCheckList(this.FichaAnalisisDataForm.get("EstadoDeCuenta")?.value);
      let stringCheklist = JSON.stringify(checklist);
      return stringCheklist;
    } else {
      if (checkliststring != "" && checkliststring != null) {
        let list = JSON.parse(checkliststring);
        this.FichaAnalisisDataForm.get("InfoActualizadaSGF")?.setValue(list.InfoActualizadaSGF);
        this.FichaAnalisisDataForm.get("CondicionesCredito")?.setValue(list.CondicionesCredito);
        this.FichaAnalisisDataForm.get("FormatoAsegurabilidad")?.setValue(list.FormatoAsegurabilidad);
        this.FichaAnalisisDataForm.get("ListaRestrictiva")?.setValue(list.ListaRestrictiva);
        this.FichaAnalisisDataForm.get("Scoring")?.setValue(list.Scoring);
        this.FichaAnalisisDataForm.get("Avaluo")?.setValue(list.Avaluo);
        this.FichaAnalisisDataForm.get("EstudiosTitulos")?.setValue(list.EstudiosTitulos);
        this.FichaAnalisisDataForm.get("PolizaIncendios")?.setValue(list.PolizaIncendios);
        this.FichaAnalisisDataForm.get("EstadoDeCuenta")?.setValue(list.EstadoDeCuenta);
      }
    }
    return "";
  }

  Click() {
    const radicado = this.FichaOperacionForm.get('Radicado')?.value;
    const radicadoFicha = this.FichaAnalisisDataForm.get("noRadicado")?.value;
    if (radicado == null || radicado == "") {
      this.radicadoActual = radicadoFicha;
    } else {
      this.radicadoActual = radicado;
    }
    const documento = this.FichaOperacionForm.get('Documento')?.value;
    
    if (this.radicadoActual != '' && this.radicadoActual != null && this.radicadoActual != undefined) {
      if (this.contenidoCodigo === '90') this.OperacionCrearFichaAnalisis();
      else if (this.contenidoCodigo === '2') {
        this.OperacionBuscarFichaAnalisis();
      }
    } else {
      this.BuscarPorDoc(this.contenidoCodigo,documento);
    }
  }

  ValidacionForm() {
    const Codigo = new FormControl('', [Validators.required]);
    const noRadicado = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const Documento = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const monto = new FormControl('', []);

    this.FichaAnalisisDataForm = new FormGroup({
      //info radicado
      noRadicado: new FormControl({value:"", disabled:true},[]),
      monto: new FormControl({value:"", disabled: true}, []),
      destino: new FormControl({value:"", disabled:true}, []),
      linea: new FormControl({value:"", disabled:true}, []),
      formaPago: new FormControl({value:"", disabled:true}, []),
      plazo: new FormControl({value:"", disabled:true}, []),
      cuota: new FormControl({value:"", disabled:true}, []),
      tasa: new FormControl({ value: "", disabled: true }, []),
      enviado: new FormControl({ value: "", disabled: true }, []),
      garantia: new FormControl({value:"", disabled:true}, []),
      vlrAvaluo: new FormControl({value:"", disabled:false}, []),
      dscInversion: new FormControl('', {updateOn:'change'}),
      dscGarantia: new FormControl('', {updateOn:'change'}),
      cobSeguroGarantia: new FormControl('', {updateOn:'change'}),
      dscCoberturaSeguro: new FormControl('', {updateOn:'change'}),
      cobSeguroDeudor: new FormControl('', {updateOn:'change'}),
      dscCobDeudor: new FormControl('', {updateOn:'change'}),

      //asociado
      nombreAso: new FormControl({value:"", disabled:true}, []),
      identAso: new FormControl({value:"", disabled:true}, []),
      correoAso: new FormControl({value:"", disabled:true}, []),
      asociadoDesdeAso: new FormControl({value:"", disabled:true}, []),
      vlrAportesAso: new FormControl({value:"", disabled:true}, []),
      empresaAso: new FormControl({ value: "", disabled: true }, []),
      ActividadEconomicaAso: new FormControl({ value: "", disabled: true }, []),
      antiguedadAso: new FormControl({value:"", disabled:true}, []),
      ocupacionAso: new FormControl({value:"", disabled:true}, []),
      promCoogranadaAso: new FormControl({value:"", disabled:true}, []),
      promOtrasAso: new FormControl('', {updateOn:'change'}),
      puntExpirianAso: new FormControl('',{updateOn:'change'}),
      puntajeTransAso: new FormControl({value:"", disabled:true}, []),
      scoringAso: new FormControl('', { updateOn: 'change' }),
      MaxOpCancelRealAso : new FormControl('', { updateOn: 'change' }),
      MaxOpCancelFinanAso : new FormControl('', { updateOn: 'change' }),
      MaxOpCancelFinanCoograAso : new FormControl('', { updateOn: 'change' }),
      activosAso: new FormControl({value:"", disabled:true}, []),
      pasivosAso: new FormControl({value:"", disabled:true}, []),
      patrimonioAso: new FormControl({value:"", disabled:true}, []),
      ingresoMensualAso: new FormControl({value:"", disabled:true}, []),
      prcSolvenciaAso: new FormControl({value:"", disabled:true}, []),
      utilidadNetaAso: new FormControl('', {updateOn:'change'}),
      ROAAso: new FormControl({value:"", disabled:true}, []),
      ROEAso: new FormControl('', {updateOn:'change'}),
      capacidadPagoAso: new FormControl('', {updateOn:'change'}),
      capacidadPagoTotalAso: new FormControl('', {updateOn:'change'}),
      endeudamientoDirAso: new FormControl({value:"", disabled:true}, []),
      endeudamientoTotAso: new FormControl({value:"", disabled:true}, []),
      descActivosAso: new FormControl('', { updateOn: 'change' }),
      RecomendacionAnalista: new FormControl('', { updateOn: 'change' }),
      AnalistaEncargado: new FormControl('', {updateOn: 'change'}),
      ConceptoFinal: new FormControl('', { updateOn: 'change' }),
      InfoActualizadaSGF: new FormControl('', { updateOn: 'change' }),
      CondicionesCredito: new FormControl('', {updateOn:'change'}),
      FormatoAsegurabilidad: new FormControl('', {updateOn:'change'}),
      ListaRestrictiva: new FormControl('', {updateOn:'change'}),
      Avaluo: new FormControl('', {updateOn:'change'}),
      Scoring: new FormControl('', {updateOn:'change'}),
      EstudiosTitulos: new FormControl('', {updateOn:'change'}),
      PolizaIncendios: new FormControl('', { updateOn: 'change' }),
      EstadoDeCuenta: new FormControl('', { updateOn: 'change' }),

    });

    this.CodeudorForm = new FormGroup({
      nombreCod: new FormControl({value:"", disabled:true}, []),
      identCod: new FormControl({value:"", disabled:true}, []),
      correoCod: new FormControl({value:"", disabled:true}, []),
      asociadoDesdeCod: new FormControl({value:"", disabled:true}, []),
      vlrAportesCod: new FormControl({value:"", disabled:true}, []),
      empresaCod: new FormControl({value:"", disabled:true}, []),
      ActividadEconomicaCod: new FormControl({ value: "", disabled: true }, []),
      antiguedadCod: new FormControl({value:"", disabled:true}, []),
      ocupacionCod: new FormControl({value:"", disabled:true}, []),
      //info crediticia
      puntExpirianCode: new FormControl('',{updateOn:'change'}),
      puntajeTransCod: new FormControl({ value: "", disabled: true }, []),
      scoringCode: new FormControl('', { updateOn: 'change' }),
      MaxOpCancelRealCode : new FormControl('', { updateOn: 'change' }),
      MaxOpCancelFinanCode : new FormControl('', { updateOn: 'change' }),
      MaxOpCancelFinanCoograCode : new FormControl('', { updateOn: 'change' }),
     
      //info finan
      activosCod: new FormControl({value:"", disabled:true}, []),
      pasivosCod: new FormControl({value:"", disabled:true}, []),
      patrimonioCod: new FormControl({value:"", disabled:true}, []),
      ingresoMensualCod: new FormControl({value:"", disabled:true}, []),
      prcSolvenciaCod: new FormControl({ value: "", disabled: true }, []),
      capacidadPagoCode: new FormControl('', {updateOn:'change'}),
      utilidadNetaCode: new FormControl('', { updateOn: 'change' }),
      AnalisisEstFinanCode: new FormControl('', { updateOn: 'change' }),
      ROACode: new FormControl('', {updateOn:'change'}),
      ROECode: new FormControl('', {updateOn:'change'}),
      capacidadPagoTotalCode: new FormControl('', {updateOn:'change'}),
      endeudamientoDirCod: new FormControl({value:"", disabled:true}, []),
      endeudamientoTotCod: new FormControl({value:"", disabled:true}, []),
    });

    this.FichaOperacionForm = new FormGroup({
      Codigo: Codigo,
      Radicado: noRadicado,
      Documento: Documento,
      btnValue: new FormControl('', []),
    });

    this.FichaAnalisisForm = new FormGroup({
    });
  }
}