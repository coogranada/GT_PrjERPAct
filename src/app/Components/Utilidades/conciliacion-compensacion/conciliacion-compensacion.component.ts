import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoginService } from '../../../Services/Login/login.service';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { OperacionesService } from '../../../Services/Maestros/operaciones.service';
import { ExcelService } from '../../../Services/General/excel.service';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { ConciliaconCompensacionService } from '../../../Services/Utilidades/conciliacion-compensacion.service';
import { ComContData } from '../../../Models/Utilidades/comcont.model';
import { AutConData } from '../../../Models/Utilidades/autcon.model';
import { DisData } from '../../../Models/Utilidades/dis.model';


const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-conciliacion-compensacion',
  templateUrl: './conciliacion-compensacion.component.html',
  styleUrl: './conciliacion-compensacion.component.css',
  standalone: false,
  providers: [ConciliaconCompensacionService, ModuleValidationService, LoginService, OperacionesService]
})

export class ConciliacionCompensacionComponent implements OnInit {


  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('InputComcont', { static: false }) inputComcont!: ElementRef;
  @ViewChild('InputAutcon', { static: false }) inputAutcon!: ElementRef;
  @ViewChild('InputDis', { static: false }) inputDis!: ElementRef;
  @ViewChild('ModalImpresion', { static: true }) private ModalImpresion!: ElementRef;
  @ViewChild('ModalDispensado', { static: true }) private ModalDispensado!: ElementRef;
  @ViewChild('ModalDispensadoC', { static: true }) private ModalDispensadoC!: ElementRef;

  private CodModulo = 47;
  public compensacionForm: FormGroup;
  public DatosUsuario: any;
  public resultOperaciones: any;
  public valueSelected: string = '';
  public cuentaSelected: string = '';
  public loadingCons: boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  operacionEscogida = '';
  selectedRow: any = null;
  selectedTab: string = 'tab1';
  openAccordion: number | null = null;
  linkPdf: string | undefined;
  isDisabled: boolean = false;
  searchTerm: string = '';
  ExplicacionDiferencia: string = '';

  private searchSubject: Subject<string> = new Subject<string>();

  toggleDisable() {
    this.isDisabled = !this.isDisabled;
  }


  constructor(
    private conciliacionCompensacionService: ConciliaconCompensacionService,
    private notif: ToastrService,
    private operacionesService: OperacionesService,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private router: Router,
    private el: ElementRef,
    private moduleValidationService: ModuleValidationService,
    private excelReportService: ExcelService,
    private fb: FormBuilder

  ) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        //  this.moduleValidationService.validarLocalPermisos(this.CodModulo);
       // return 'Permisos validados';
      })
    );
    obs.subscribe((resulr) => console.log(resulr));

    this.searchSubject.pipe(debounceTime(500),
      distinctUntilChanged()
    ).subscribe((searchTerm) => {
      this.filtrarData(searchTerm);
    });

    this.compensacionForm = this.fb.group({
      Fecha: [''],
      ValorOrden: [0],
      CapitalCoogranada: [0],
      CapitalVisionamos: [0],
      Dispensado: [0],
      NovedadCredibanco: [0],
      MovimientoInternacional: [0],
      Diferencia: [0],
      ComisionCoogranada: [0],
      ComisionVisionamos: [0],
      GastoComision: [0],
      ExplicacionDiferencia: [''],
      IdUsuarioProceso: [0],
      UsuarioProceso: [''],
      Cuenta: [''],
      JsonDispensado: ['']
    });
  }

  inicializaForm() {
    this.compensacionForm = this.fb.group({
      Fecha: [''],
      ValorOrden: [0],
      CapitalCoogranada: [0],
      CapitalVisionamos: [0],
      Dispensado: [0],
      NovedadCredibanco: [0],
      MovimientoInternacional: [0],
      Diferencia: [0],
      ComisionCoogranada: [0],
      ComisionVisionamos: [0],
      GastoComision: [0],
      ExplicacionDiferencia: [''],
      IdUsuarioProceso: [0],
      UsuarioProceso: [''],
      Cuenta: [''],
      JsonDispensado: ['']
    });

  }

  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.Operaciones();
    this.DatosUsuario = JSON.parse(window.atob(localStorage.getItem('Data') ?? '')) || '{}';
    this.cuentaSelected = '11100548';

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      }
    );
    
    this.IrArriba();
  }

  compDia: any[] = [];
  resComp: any[] = [];
  resAutcon: any[] = [];
  resCompCap: any[] = [];
  resCompCom: any[] = [];
  resDis: any[] = [];
  resNovCredibanco: any[] = [];
  resMvtoInternacional: any[] = [];
  resMvtoCoogranada: any[] = [];
  filtrarItems: any[] = [];
  comContD: any[] = [];
  fechaBusqueda: string = '';
  fechaIdentificadaComCont: string = '';
  fechaIdentificadaAutCon: string = '';
  fechaIdentificadaDis: string = '';
  fechaIdentificadaComContStr: string = '';
  Dispensado: number = 0;
  CapitalVisionamos: number = 0;
  CapitalCoogranada: number = 0;
  sdoOrdenTransferencia: number = 0;
  ComisionVisionamos: number = 0;
  ComisionCoogranada: number = 0;
  GastoComision: number = 0;
  NovedadCredibanco: number = 0;
  MovimientoInternacional: number = 0;
  Diferencia: number = 0;
  ValorDisCom: number = 0;
  vblePanelDatos: boolean = false;
  vbleModalDis: boolean = false;

  dataUser: any;

  fileName: string = 'No ha seleccionado ningún archivo';
  fileName1: string = 'No ha seleccionado ningún archivo';
  fileName2: string = 'No ha seleccionado ningún archivo';
  step = 0;


  Operaciones() {
    this.DatosUsuario = JSON.parse(window.atob(localStorage.getItem('Data')?? ''));
    const arrayExample = [{
      'IdModulo': this.CodModulo,
      'IdUsuario': this.DatosUsuario.IdUsuario,
      'IdOperaciones': '',
      'IdOperacionesPerfil': '',
      'IdPerfil': this.DatosUsuario.idPerfilUsuario
    }];
    this.operacionesService.OperacionesPermitidas(JSON.stringify(arrayExample[0])).subscribe(
      result => {
        this.resultOperaciones = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }


  opcionSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.valueSelected = selectElement.value;
    this.vblePanelDatos = false;

    if (this.valueSelected == '90' && this.isDisabled) {
      this.toggleDisable();
    }
  }

  cuentaSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.cuentaSelected = selectElement.value;
  }

  goToStep(step: number) {
    this.step = step;
  }

  async obtenerDatosIni(origen: number) {
    if (this.fileName === "No ha seleccionado ningún archivo") {
      this.notif.warning('Advertencia', 'Para finalizar, debe adjuntar el archivo COMCONT.', ConfiguracionNotificacion.configRightTop);
      this.goToStep(0);
    } else if (this.fileName1 === "No ha seleccionado ningún archivo") {
      this.notif.warning('Advertencia', 'Para finalizar, debe adjuntar el archivo AUTCON.', ConfiguracionNotificacion.configRightTop);
      this.goToStep(1);
    } else if (this.fechaIdentificadaAutCon === "") {
      this.notif.warning('Advertencia', 'No se puedo identificar la fecha de compensación.', ConfiguracionNotificacion.configRightTop);
    } else {
      //1: LLamado desde el botón Step 2: LLamado desde la Modal
      if (origen === 1) {
        if (this.vbleModalDis) {
          this.abrirModalDispensado();
        } else {
          this.obtenerDatos();
        }
      } else if (origen === 2) {
        if (this.fileName2 === "No ha seleccionado ningún archivo") {
          this.notif.warning('Advertencia', 'Para finalizar, debe adjuntar el archivo DIS.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.cerrarModalDispensado();
          this.obtenerDatos();
        }
      }
    }
  }

  async obtenerDatos() {
    this.loadingCons = true;
    try {
      await this.obtenerSaldosGenerales();
      await this.obtenerNovedadesCredibanco();
      await this.obtenerMovimientoInter();
      await this.obtenerMovimientoCoogranada();

      setTimeout(() => {
        //restraso 1 segundo la ejecución para lograr que las variables ya tengan infromación para calcular diferencia
        this.Diferencia = Number(((this.CapitalCoogranada - this.CapitalVisionamos) - this.NovedadCredibanco) - this.MovimientoInternacional);
        this.sdoOrdenTransferencia = Number((this.CapitalVisionamos + this.ComisionVisionamos) - this.Dispensado)
      }, 1000);
      this.vblePanelDatos = true;
      this.toggleDisable();
      this.notif.success('Exitoso', 'Proceso realizado con éxito.', ConfiguracionNotificacion.configRightTop);
    } catch (error) {
      console.log("error obtener datos: " + error)
      this.notif.error('Error', 'Ha ocurrido un problema en la ejecución: ' + error, ConfiguracionNotificacion.configRightTop);
    } finally {
      this.loadingCons = false;
    }
  }

  obtenerSaldosGenerales(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.conciliacionCompensacionService.GetResumenCompensacion(this.fechaIdentificadaComContStr, this.cuentaSelected).subscribe(
          (response: any) => {
            this.resComp = response;
            this.resCompCap = this.resComp.filter(dato => dato.TipoConcepto === 'Capital' || dato.TipoConcepto === 'Dispensado');
            this.resCompCom = this.resComp.filter(dato => dato.TipoConcepto === 'Comisión');

            this.ComisionVisionamos = Number(this.resComp.filter(dato => dato.TipoConcepto === 'Comisión').reduce((acc, dato) => acc + dato.ValorVisionamos, 0).toString());
            this.ComisionCoogranada = Number(this.resComp.filter(dato => dato.TipoConcepto === 'Comisión').reduce((acc, dato) => acc + dato.ValorCoogranada, 0).toString());
            this.GastoComision = (this.ComisionVisionamos - this.ComisionCoogranada)
            this.Dispensado = Number(this.resComp.filter(dato => dato.TipoConcepto === 'Dispensado').map(dato => dato.ValorVisionamos).toString()) * -1;
            this.CapitalCoogranada = Number(this.resComp.filter(dato => dato.TipoConcepto === 'Capital').reduce((acc, dato) => acc + dato.ValorCoogranada, 0).toString());
            this.CapitalVisionamos = Number(this.resComp.filter(dato => dato.TipoConcepto === 'Capital').reduce((acc, dato) => acc + dato.ValorVisionamos, 0).toString());
            resolve();
          },
          (error) => {
            const errorMessage = <any>error;
            this.limpiarForm(1);
            this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
            console.log(errorMessage);
            reject(error);
          });
      } catch {
        this.limpiarForm(1);
        console.log('error en resumen');
      }
    });

  }

  obtenerNovedadesCredibanco(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.conciliacionCompensacionService.GetNovCredibanco().subscribe(
          (response: any) => {
            this.resNovCredibanco = response;
            this.NovedadCredibanco = Number(this.resNovCredibanco.filter(dato => dato.S003 === '').reduce((acc, dato) => acc + dato.S032, 0).toString())
              - Number(this.resNovCredibanco.filter(dato => dato.S003 !== '').reduce((acc, dato) => acc + dato.S032, 0).toString());
            resolve();
          },
          (error) => {
            const errorMessage = <any>error;
            this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
            console.log(errorMessage);
            reject(error);
          });
      } catch {
        console.log('error obteniendo novedades credibanco');
      }
    });
  }

  obtenerMovimientoInter(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.conciliacionCompensacionService.GetMvtoInternacional().subscribe(
          (response: any) => {
            this.resMvtoInternacional = response;
            this.MovimientoInternacional = Number(this.resMvtoInternacional.filter(dato => dato.S032 > 0).reduce((acc, dato) => acc + dato.S032, 0).toString());
            resolve();
          },
          (error) => {
            const errorMessage = <any>error;
            this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
            console.log(errorMessage);
            reject(error);
          });
      } catch {
        console.log('error obteniendo novedades credibanco');
      }
    });
  }

  obtenerMovimientoCoogranada(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.conciliacionCompensacionService.GetDetalleCompensacion(this.fechaIdentificadaComContStr, this.cuentaSelected).subscribe(
          (response: any) => {
            this.resMvtoCoogranada = response;
            this.filtrarItems = response;
            resolve();
          },
          (error) => {
            const errorMessage = <any>error;
            this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
            console.log(errorMessage);
            reject(error);
          });
      } catch {
        console.log('error obteniendo detalle coogranada');
      }
    });
  }


  file: any;
  fileChanged(e: any) {
    try {
      let file = e.target.files[0];
      let reader = new FileReader();
      if (file) {
        this.fileName = file.name;
        if (!this.fileName.toUpperCase().includes('.COMCONT')) {
          this.LimpiarArchivoComCont();
          this.notif.warning('Advertencia', 'El archivo no tiene la extensión correcta.', ConfiguracionNotificacion.configRightTop);
        } else {
          reader.onloadend = () => this.printFileContents(reader.result);
          reader.readAsText(file);
        }
      } else {
        this.LimpiarArchivoComCont();
      }
    } catch {
      this.LimpiarArchivoComCont();
    }
  }


  file1: any;
  fileChanged1(e: any) {
    try {
      let file1 = e.target.files[0];
      let reader = new FileReader();

      if (this.fileName === "No ha seleccionado ningún archivo") {
        this.notif.warning('Advertencia', 'Debe adjuntar el archivo con extensión .COMCONT, del paso 1.', ConfiguracionNotificacion.configRightTop);
        this.goToStep(0);
      } else {
        if (file1) {
          this.fileName1 = file1.name;
          if (!this.fileName1.toUpperCase().includes('.AUTCONV2')) {
            this.LimpiarArchivoAutCon();
            this.notif.warning('Advertencia', 'El archivo no tiene la extensión correcta.', ConfiguracionNotificacion.configRightTop);
          } else {
            reader.onloadend = () => this.printFileContents1(reader.result);
            reader.readAsText(file1);
          }
        } else {
          this.LimpiarArchivoAutCon();
        }
      }
    } catch {
      this.LimpiarArchivoAutCon();
    }

  }

  file2: any;
  fileChanged2(e: any) {
    try {
      let file2 = e.target.files[0];
      let reader = new FileReader();

      if (this.fileName === "No ha seleccionado ningún archivo") {
        this.notif.warning('Advertencia', 'Debe adjuntar el archivo con extensión .COMCONT, del paso 1.', ConfiguracionNotificacion.configRightTop);
        this.goToStep(0);
        this.cerrarModalDispensado();
      } else if (this.fileName1 === "No ha seleccionado ningún archivo") {
        this.notif.warning('Advertencia', 'Debe adjuntar el archivo con extensión .AUTCON, del paso 2.', ConfiguracionNotificacion.configRightTop);
        this.goToStep(1);
        this.cerrarModalDispensado();
      } else {
        if (file2) {
          this.fileName2 = file2.name;
          if (!this.fileName2.toUpperCase().includes('.DIS')) {
            this.LimpiarArchivoDis();
            this.notif.warning('Advertencia', 'El archivo no tiene la extensión correcta.', ConfiguracionNotificacion.configRightTop);
          } else {
            reader.onloadend = () => this.printFileContents2(reader.result);
            reader.readAsText(file2);
          }
        } else {
          this.LimpiarArchivoDis();
        }
      }
    } catch {
      this.LimpiarArchivoDis();
    }

  }


  printFileContents(contents: any) {
    let lines = contents.split('\n');
    let arr = [];

    for (let i of lines) {
      arr.push(i.split(','));
    }

    let arrayComCont = [];
    let noCumple = 0;
    let posNocumple = 0;

    for (let i of arr) {
      if (i[0] == "") {
        noCumple = noCumple + 1;
        posNocumple = i;
      }
    }

    if (noCumple > 1) {
      this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas.', ConfiguracionNotificacion.configRightTop);
    } else {
      try {
        for (let i of arr) {

          //Identifico si en el día hay concepto 53 para habilitar modal de dispensado
          if (i[1].toString() == "53") {
            this.vbleModalDis = true;
            this.ValorDisCom = parseFloat(i[6]) / 100;
          }


          if (i[3] == "\"+\"" || i[3] == "\"-\"") {
            // este concepto es obligatorio,dado que la identificación de comisiones la BD no es posible desagregarse tal como lo reporta visionamos
            arrayComCont.push(
              new ComContData(i[1], 'CM', '0000000000', '00000000', '8909819121', 'Coogranada', 0, 0, this.ConvertirFecha(i[1]))
            );
            // si es la ultima fila del arreglo no se almacena información
            break;
          } else {
            this.fechaIdentificadaComContStr = i[0];
            this.fechaIdentificadaComCont = this.ConvertirFecha(i[0]).toISOString().split('T')[0]; // Formato YYYY-MM-DD
            arrayComCont.push(
              new ComContData(i[0], i[1], i[2], i[3], this.RemoverCerosIzquierda(i[4]), this.RemoverAsteriscos(i[5]), parseFloat(i[6]) / 100, parseFloat(i[7]) / 100, this.ConvertirFecha(i[0]))
            );
          }
        }


        //if ((this.fechaIdentificadaAutCon === this.fechaIdentificadaComCont) || (!this.fechaIdentificadaAutCon && (this.fechaIdentificadaAutCon !== ""))) {
        if (this.fechaIdentificadaAutCon === this.fechaIdentificadaComCont || this.fechaIdentificadaAutCon.trim() === "") {
          this.loadingCons = true;
          this.conciliacionCompensacionService.GuardarComcont(JSON.stringify(arrayComCont)).subscribe(
            result => {
              if (result) {
                this.notif.success('Exitoso', 'Archivo COMCONT almacenado correctamente.', ConfiguracionNotificacion.configRightTop);
                this.loadingCons = false;
                this.comContD = arrayComCont;
              } else {
                this.loadingCons = false;
                this.LimpiarArchivoComCont();
                this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas [7].', ConfiguracionNotificacion.configRightTop);
              }
            },
            error => {
              if (error.status === 400) {
                const errorMessage = error._body ? JSON.parse(error._body) : 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas [7].';

                this.loadingCons = false;
                this.LimpiarArchivoComCont();
                this.notif.warning('Advertencia', errorMessage, ConfiguracionNotificacion.configRightTop);

              } else {
                this.loadingCons = false;
                this.LimpiarArchivoComCont();
                const errorMessage = <any>error;
                this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
              }
            }
          );
        } else {
          this.LimpiarArchivoComCont();
          this.notif.warning('Advertencia', 'Las fechas del archivo AUTCON y COMCONT deben coincidir.', ConfiguracionNotificacion.configRightTop);
        }
      } catch {
        this.LimpiarArchivoComCont();
        this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas [7].', ConfiguracionNotificacion.configRightTop);
        console.log('error en archivo o estructura')
      }
    }

  }

  printFileContents1(contents: any) {
    let lines = contents.split('\n');
    let arr = [];
    let FechaActual: Date = new Date();

    for (let i of lines) {
      arr.push(i.split(','));
    }

    let arrayAutCon = [];
    let noCumple = 0;

    let posNocumple = 0;

    for (let i of arr) {
      if (i[0] == "") {
        noCumple = noCumple + 1;
        posNocumple = i;
      }
    }


    if (noCumple > 1) {
      this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas.', ConfiguracionNotificacion.configRightTop);
    } else {
      try {
        for (let i of arr) {
          if (i[0] == "S001") {
            // si es encabezado del arreglo no se almacena información
            continue;
          }

          if (i[0] == "00000021") {
            // si es la ultima fila del arreglo no se almacena información
            this.fechaIdentificadaAutCon = this.ConvertirFecha(i[1]).toISOString().split('T')[0]; // Formato YYYY-MM-DD
            break;
          } else {
            arrayAutCon.push(
              new AutConData(i[0], i[1], this.RemoverAsteriscos(i[2]), i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10], this.RemoverAsteriscos(i[11]), this.RemoverAsteriscos(i[12]), i[13], i[14], i[15], i[16], i[17], i[18], parseFloat(i[19]) / 100, i[20], i[21], i[22], i[23], i[24], i[25], i[26], i[27], this.RemoverAsteriscos(i[28]), i[29], i[30], i[31], i[32], i[33], i[34], i[35], i[36], i[37], i[38], i[39], i[40], i[41], i[42], FechaActual)
            );
          }
        }

        if ((this.fechaIdentificadaAutCon === this.fechaIdentificadaComCont) || (!this.fechaIdentificadaComCont && (this.fechaIdentificadaComCont !== ""))) {
          this.loadingCons = true;
          this.conciliacionCompensacionService.GuardarAutCon(JSON.stringify(arrayAutCon)).subscribe(
            result => {
              if (result) {
                this.notif.success('Exitoso', 'Archivo AUTCON almacenado correctamente.', ConfiguracionNotificacion.configRightTop);
                this.loadingCons = false;
              } else {
                this.loadingCons = false;
                this.LimpiarArchivoAutCon();
                this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas [43].', ConfiguracionNotificacion.configRightTop);
              }
            },
            error => {
              if (error.status === 400) {
                const errorMessage = error._body ? JSON.parse(error._body) : 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas [43].';

                this.loadingCons = false;
                this.LimpiarArchivoAutCon();
                this.notif.warning('Advertencia', errorMessage, ConfiguracionNotificacion.configRightTop);

              } else {
                this.loadingCons = false;
                this.LimpiarArchivoAutCon();
                const errorMessage = <any>error;
                this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
              }
            }
          );
        } else {
          this.LimpiarArchivoAutCon();
          this.notif.warning('Advertencia', 'Las fechas del archivo AUTCON y COMCONT deben coincidir.', ConfiguracionNotificacion.configRightTop);
        }
      } catch {
        this.LimpiarArchivoAutCon();
        this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas [43].', ConfiguracionNotificacion.configRightTop);
        console.log('error en archivo o estructura autconv2')
      }
    }
  }

  printFileContents2(contents: any) {
    let lines = contents.split('\n');
    let arr = [];

    for (let i of lines) {
      arr.push(i.split(','));
    }

    let arrayDis = [];
    let sdoDispensadoArchivo = 0;
    let noCumple = 0;
    let noCumple1 = 0;
    let posNocumple = 0;

    for (let i of arr) {
      if (i[0] == "") {
        noCumple = noCumple + 1;
        posNocumple = i;
      }
    }


    if (noCumple > 1) {
      this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas.', ConfiguracionNotificacion.configRightTop);
    } else {
      try {

        for (let i of arr) {
          if (i[0] == "00000021") {
            // si es la ultima fila del arreglo no se almacena información
            this.fechaIdentificadaDis = this.ConvertirFecha(i[1]).toISOString().split('T')[0]; // Formato YYYY-MM-DD
            break;
          } else {
            if (i[0] && i[1] && i[2] && i[3] && i[4]) {
              arrayDis.push(
                new DisData(i[0], i[1], i[2], i[3], parseFloat(i[4]))
              );
              sdoDispensadoArchivo = sdoDispensadoArchivo + parseFloat(i[4]);
            } else {
              noCumple1 = noCumple1 + 1;
            }
          }
        }
        if (noCumple1 >= 1) {
          this.LimpiarArchivoDis();
          this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas [5].', ConfiguracionNotificacion.configRightTop);
        } else {
          if ((this.fechaIdentificadaDis === this.fechaIdentificadaComCont) || (!this.fechaIdentificadaDis && (this.fechaIdentificadaDis !== ""))) {
            if (this.ValorDisCom === sdoDispensadoArchivo) {
              this.resDis = arrayDis;
              this.notif.success('Exitoso', 'Archivo DIS almacenado correctamente.', ConfiguracionNotificacion.configRightTop);
              this.cerrarModalDispensado();
              this.obtenerDatos();
            } else {
              this.LimpiarArchivoDis();
              this.notif.warning('Advertencia', 'Los valores de dispensado no coinciden, COMCONT: ' + this.ValorDisCom + ', Archivo DIS: ' + sdoDispensadoArchivo + ".", ConfiguracionNotificacion.configRightTop);
            }
          } else {
            this.LimpiarArchivoDis();
            this.notif.warning('Advertencia', 'Las fechas de los archivos deben coincidir.', ConfiguracionNotificacion.configRightTop);
          }
        }
      } catch {
        this.LimpiarArchivoDis();
        this.notif.warning('Advertencia', 'El archivo tiene problemas de estructura, valide el formato de los campos y cantidad de columnas [5].', ConfiguracionNotificacion.configRightTop);
        console.log('error en archivo o estructura dis')
      }
    }
  }

  BuscarCompensacion() {
    this.vblePanelDatos = false;
    if (this.fechaBusqueda === "") {
      this.notif.warning('Advertencia', 'No ha seleccionado una fecha válida para realizar la búsqueda.', ConfiguracionNotificacion.configRightTop);
    } else {
      try {
        this.conciliacionCompensacionService.GetCompensacionDia(this.fechaBusqueda).subscribe(
          (response: any) => {
            this.compDia = response;
            if (this.compDia === null) {
              this.notif.warning('Advertencia', 'No se encontraron datos para la fecha seleccionada.', ConfiguracionNotificacion.configRightTopNoClose);
            } else {
              this.generarImpresion(this.compDia)

            }
          },
          (error) => {
            const errorMessage = <any>error;
            this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
            console.log(errorMessage);
          });
      } catch {
        console.log('error obteniendo');
      }
    }
  }

  GuardarCompensacion() {
    try {
      this.loadingCons = true;
      this.dataUser = JSON.parse(window.atob(localStorage.getItem('Data') ?? ''));
      this.compensacionForm.patchValue({ IdUsuarioProceso: this.dataUser.IdUsuario });
      this.compensacionForm.patchValue({ Fecha: this.fechaIdentificadaComCont });
      this.compensacionForm.patchValue({ ValorOrden: this.sdoOrdenTransferencia });
      this.compensacionForm.patchValue({ UsuarioProceso: this.dataUser.Nombre });
      this.compensacionForm.patchValue({ Cuenta: this.cuentaSelected });
      this.compensacionForm.patchValue({ JsonDispensado: JSON.stringify(this.resDis) });


      if (this.compensacionForm.get('CapitalCoogranada')?.value === 0 || this.compensacionForm.get('CapitalVisionamos')?.value === 0 || this.fechaIdentificadaComCont === '' ) {
        this.loadingCons = false;
        this.notif.warning('Advertencia', 'No se pudo guardar, no ha finalizado el cuadre diario.', ConfiguracionNotificacion.configRightTop);
      } else {
        if (
          (this.compensacionForm.get('Diferencia')?.value > 0.01 || this.compensacionForm.get('Diferencia')?.value < -0.01) &&
          (this.compensacionForm.get('ExplicacionDiferencia')?.value === '' || this.compensacionForm.get('ExplicacionDiferencia')?.value === undefined)) {
          
          this.loadingCons = false;
          console.log('Diferencia: ' + this.compensacionForm.get('Diferencia')?.value);
          this.notif.warning('Advertencia', 'Debe explicar la diferencia cuando es diferente de cero.', ConfiguracionNotificacion.configRightTop);
        } else {
          try {
            this.conciliacionCompensacionService.GuardarCompensacion(JSON.stringify(this.compensacionForm.value)).subscribe(
              result => {
                if (result) {
                  this.loadingCons = false;
                  this.notif.success('Exitoso', 'Compensación guardada correctamente.', ConfiguracionNotificacion.configRightTop);
                  this.generarImpresion(this.compensacionForm.value);
                  this.GuardarLogCompensacion();
                } else {
                  this.loadingCons = false;
                  this.notif.error('Advertencia', 'Ocurrió un error al almacenar la compensación.', ConfiguracionNotificacion.configRightTop);
                }
              },
              error => {
                this.loadingCons = false;
                const errorMessage = <any>error;
                this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
              }
            );
          } catch {
            this.loadingCons = false;
            this.notif.error('Error', 'Ocurrió un error al almacenar la compensación.', ConfiguracionNotificacion.configRightTop);
          }
        }
      }
    } catch {
      this.loadingCons = false;
      this.notif.error('Error', 'Ocurrió un error al almacenar la compensación.', ConfiguracionNotificacion.configRightTop);
    }
  }

  GuardarLogCompensacion() {
    this.loadingCons = true;
    this.dataUser = JSON.parse(window.atob(localStorage.getItem('Data') ?? ''));
    const dataLog = {
      IdUsuarioERP: this.dataUser.IdUsuario,
      IdTercero: this.dataUser.intlngTercero,
      IdModulo: this.CodModulo,
      IdOperacion: this.valueSelected,
      FechaCompensacion: this.fechaIdentificadaAutCon,
    };

    try {
      this.conciliacionCompensacionService.GuardarLogCompensacion(JSON.stringify(dataLog)).subscribe(
        result => {
          if (result) {
            this.loadingCons = false;
            console.log('Log guardado correctamente');
          } else {
            this.loadingCons = false;
            console.log('Log no se puedo guardar');
          }
        },
        error => {
          this.loadingCons = false;
          const errorMessage = <any>error;
          console.log('Log no se puedo guardar');
        }
      );
    } catch {
      this.loadingCons = false;
      console.log('Log no se puedo guardar C');
    }


  }

  LimpiarArchivoComCont() {
    this.inputComcont!.nativeElement.value = '';
    this.fileName = 'No ha seleccionado ningún archivo';
    this.fechaIdentificadaComCont = '';
    this.fechaIdentificadaComContStr = '';
  }

  LimpiarArchivoAutCon() {
    this.inputAutcon!.nativeElement.value = '';
    this.fileName1 = 'No ha seleccionado ningún archivo';
    this.fechaIdentificadaAutCon = '';
  }

  LimpiarArchivoDis() {
    this.inputDis!.nativeElement.value = '';
    this.fileName2 = 'No ha seleccionado ningún archivo';
    this.fechaIdentificadaDis = '';
  }

  RemoverCerosIzquierda(cadena: string): string {
    return cadena.replace(/^0+/, '');
  }

  RemoverAsteriscos(cadena: string): string {
    return cadena.replace(/^"|"$/g, '').trim();
  }

  ConvertirFecha(cadena: string): Date {
    const year_ = parseInt(cadena.substring(0, 4), 10);
    const month_ = parseInt(cadena.substring(4, 6), 10) - 1; // Los meses son de 0 a 11
    const day_ = parseInt(cadena.substring(6, 8), 10);
    const date_ = new Date(year_, month_, day_);
    return date_;
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  selectRow(item: any) {
    this.selectedRow = item;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  filtrarData(searchTerm: string) {
    if (searchTerm) {
      this.filtrarItems = this.resMvtoCoogranada.filter(item =>
        item.DocumentoA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Concepto_Visionamos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Secuencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Trans.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Cuenta.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filtrarItems = [...this.resMvtoCoogranada];
    }
  }

  exportarExcel2(nro: number) {
    var data = null;
    switch (nro) {
      case 1:
        if (!this.resNovCredibanco || this.resNovCredibanco.length === 0) {
          this.notif.warning('Advertencia', 'No hay información para exportar.', ConfiguracionNotificacion.configRightTop);
        } else {
          data = this.resNovCredibanco.map(row => {
            return Object.keys(row)
              .reduce((obj, key) => {
                (obj as { [key: string]: unknown })[key] = row[key];
                return obj;
              }, {});
          });
          this.excelReportService.exportAsExcelFile(data, 'Novedades credibanco ' + this.fechaIdentificadaAutCon)
        }
        break;
      case 2:
        if (!this.resMvtoInternacional || this.resMvtoInternacional.length === 0) {
          this.notif.warning('Advertencia', 'No hay información para exportar.', ConfiguracionNotificacion.configRightTop);
        } else {
          data = this.resMvtoInternacional.map(row => {
            return Object.keys(row)
              .reduce((obj, key) => {
                (obj as { [key: string]: unknown })[key] = row[key];
                return obj;
              }, {});
          });
          this.excelReportService.exportAsExcelFile(data, 'Movimiento internacional ' + this.fechaIdentificadaAutCon)
        }
        break;
      case 3:
        if (!this.resComp || this.resComp.length === 0) {
          this.notif.warning('Advertencia', 'No hay información para exportar.', ConfiguracionNotificacion.configRightTop);
        } else {
          data = this.resComp.map(row => {
            return Object.keys(row)
              .slice(0, 7) //se remueve las columnas no necesarias
              .reduce((obj, key) => {
                (obj as { [key: string]: unknown })[key] = row[key];
                return obj;
              }, {});
          });
          this.excelReportService.exportAsExcelFile(data, 'Diferencia por conceptos ' + this.fechaIdentificadaAutCon)
        }
        break;
      case 4:
        if (!this.resMvtoCoogranada || this.resMvtoCoogranada.length === 0) {
          this.notif.warning('Advertencia', 'No hay información para exportar.', ConfiguracionNotificacion.configRightTop);
        } else {
          const dataToExport: { [sheetName: string]: any[] } = {};

          const data1 = this.resMvtoCoogranada.map(row => {
            return Object.keys(row)
              .slice(7) // se remueven las primeras 7 columnas
              .reduce((obj, key) => {
                (obj as { [key: string]: unknown })[key] = row[key];
                return obj;
              }, {});
          });
          dataToExport['SGF'] = data1;


          this.conciliacionCompensacionService.GetAutcon().subscribe(
            (response: any) => {
              this.resAutcon = response;
              const data2 = this.resAutcon.map(row => {
                return Object.keys(row)
                  .reduce((obj, key) => {
                    (obj as { [key: string]: unknown })[key] = row[key];
                    return obj;
                  }, {});
              });
              dataToExport['AUTCON'] = data2;


              const data3 = this.comContD.map(row => {
                return Object.keys(row)
                  .reduce((obj, key) => {
                    (obj as { [key: string]: unknown })[key] = row[key];
                    return obj;
                  }, {});
              });
              dataToExport['COMCONT'] = data3;

              this.excelReportService.exportAsExcelFile1(dataToExport, 'COMPENSACION ' + this.fechaIdentificadaAutCon);
            },
            (error) => {
              const errorMessage = <any>error;
              this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
              console.log(errorMessage);
            }
          );
        }

        break;
      case 5:
        try {
          if (this.fechaBusqueda === "") {
            this.notif.warning('Advertencia', 'No ha seleccionado una fecha válida para realizar la búsqueda.', ConfiguracionNotificacion.configRightTop);
          } else {
            const dataToExport: { [sheetName: string]: any[] } = {};

            // Realizamos ambas solicitudes en paralelo usando forkJoin
            forkJoin([
              this.conciliacionCompensacionService.GetCompensacionMes(this.fechaBusqueda),
              this.conciliacionCompensacionService.GetDispensadoMes(this.fechaBusqueda)
            ]).subscribe(
              ([responseCompensacion, responseDispensado]) => {
                this.resComp = responseCompensacion as any;
                this.resDis = responseDispensado as any;

                // Procesamos los datos de "Compensación"
                if (this.resComp === null || !this.resComp || this.resComp.length === 0) {
                  this.notif.warning('Advertencia', 'No se encontraron datos para el mes de compensación.', ConfiguracionNotificacion.configRightTopNoClose);
                } else {
                  const data1 = this.resComp.map(row => {
                    return Object.keys(row)
                      .slice(1)
                      .reduce((obj, key) => {
                        (obj as { [key: string]: unknown })[key] = row[key];
                        return obj;
                      }, {});
                  });
                  dataToExport['Compensación'] = data1;
                }

                // Procesamos los datos de "Dispensado"
                const data2 = this.resDis.map(row => {
                  return Object.keys(row)
                    .slice(1)
                    .reduce((obj, key) => {
                      (obj as { [key: string]: unknown })[key] = row[key];
                      return obj;
                    }, {});
                });
                dataToExport['Dispensado'] = data2;

                // Exportamos ambos datos en un solo archivo Excel
                this.excelReportService.exportAsExcelFile1(dataToExport, 'Reporte compensación mes');
              },
              (error) => {
                const errorMessage = <any>error;
                this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
                console.log(errorMessage);
              }
            );
          }
        } catch (error) {
          console.log("error obtener datos: " + error)
          this.notif.error('Error', 'Ha ocurrido un problema en la ejecución: ' + error, ConfiguracionNotificacion.configRightTop);
        }

        break;
    }
  }

  onFechaChange(event: any) {
    this.fechaBusqueda = event.target.value;
  }

  generarImpresion(Datos: any) {
    this.linkPdf = "";
    let pdfinBase64 = null;
    let byteArray = null;
    let newBolb = null;
    let url = null;
    this.loadingCons = true;
    document.querySelector("object")!.data = "";
    document.querySelector("object")!.name = "";
    document.querySelector("object")!.type = "";
    //this.conciliacionCompensacionService.GenerarPDFCompensacion(JSON.stringify(this.compensacionForm.value)).subscribe(
    this.conciliacionCompensacionService.GenerarPDFCompensacion(JSON.stringify(Datos)).subscribe(
      result => {
        pdfinBase64 = result.FileStream._buffer;
        byteArray = new Uint8Array(
          atob(pdfinBase64)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        newBolb = new Blob([byteArray], { type: "application/pdf" });
        this.linkPdf = URL.createObjectURL(newBolb);
        url = window.URL.createObjectURL(newBolb);
        document.querySelector("object")!.data = url;
        document.querySelector("object")!.name = "Impresion";
        document.querySelector("object")!.type = "application/pdf";
        this.loadingCons = false;
      },
      error => {
        this.loadingCons = false
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(errorMessage);
      }
    );
    $("#ImpresionCompensacion").show();
    this.ModalImpresion.nativeElement.click();
  }

  abrirModalDispensado() {
    this.ModalDispensado.nativeElement.click();
  }

  cerrarModalDispensado() {
    $(this.ModalDispensadoC.nativeElement).click();
  }

  limpiarForm(origen: number) {
    this.selectTab('tab1');
    this.searchTerm = '';

    if (origen == 2) {
      this.toggleDisable();
    }

    this.LimpiarArchivoAutCon();
    this.LimpiarArchivoComCont();
    this.LimpiarArchivoDis();

    this.compDia = [];
    this.resComp = [];
    this.resAutcon = [];
    this.resCompCap = [];
    this.resCompCom = [];
    this.resDis = [];
    this.resNovCredibanco = [];
    this.resMvtoInternacional = [];
    this.resMvtoCoogranada = [];
    this.filtrarItems = [];
    this.fechaBusqueda = '';
    this.Dispensado = 0;
    this.CapitalVisionamos = 0;
    this.CapitalCoogranada = 0;
    this.sdoOrdenTransferencia = 0;
    this.ComisionVisionamos = 0;
    this.ComisionCoogranada = 0;
    this.GastoComision = 0;
    this.NovedadCredibanco = 0;
    this.MovimientoInternacional = 0;
    this.Diferencia = 0;
    this.ValorDisCom = 0;
    this.vblePanelDatos = false;
    this.vbleModalDis = false;
    this.ExplicacionDiferencia = '';

    this.inicializaForm();

    this.cerrarAcordeon();
    this.goToStep(0);
    this.IrArriba();
  }

  borrarSiEspacios(controlName: string): void {
    const control = this.compensacionForm.controls[controlName];

    if (control.value.trim() === '') {
      control.setValue('');
    }
  }

  toggleAccordion(index: number) {
    this.openAccordion = this.openAccordion === index ? null : index;
  }

  isOpen(index: number): boolean {
    return this.openAccordion === index;
  }

  cerrarAcordeon() {
    this.openAccordion = null;
  }

  recargarForm() {
    window.location.reload();
  }

}

