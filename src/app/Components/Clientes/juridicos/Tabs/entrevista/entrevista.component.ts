import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EntrevistaModel } from '../../../../../Models/Clientes/Juridicos/EntrevistaModel';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import { TratamientoDatosModel } from '../../../../../Models/Clientes/Juridicos/TratamientoDatosModel';
import { formatDate } from '@angular/common';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import moment from 'moment';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;
const PrimaryWhite = 'rgb(13,165,80)';
const SecondaryGrey = 'rgb(13,165,80,0.7)';
@Component({
  selector: 'app-entrevista',
  templateUrl: './entrevista.component.html',
  styleUrls: ['./entrevista.component.css'],
  providers: [JuridicosService, GeneralesService],
  standalone : false
})
export class EntrevistaComponent implements OnInit {
  //#region  carga variables comunicacion
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente
  @Input() infoTabAllEntrevista: any;
  @Input() OperacionSeleccionada: any;
  @Input() idJuridicoSearch: any;
  @Input() fechaMatricula: any;
  @Output() emitEventEntrevista: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() emitEventGuardado: EventEmitter<any> = new EventEmitter<any>();
  @Input() OperacionActual: any;
  //#endregion
  //#region carga variables
  public siguiente = false;
  public positionTab = 1;
  public allItemFormEntrevista: any[] = [];
  public labelBoton = '';
  public clienteSeleccionado: any;
  //#endregion
  //#region carga variables de bloqueo
  @Input() bloquearForm :boolean | null = true;
  bloquearFechaDebito = true;
  bloquearFechaManual = true;
  bloquearCheckExento = true;
  @Input() mostrarActualizar: boolean = false;
  @Input() mostrarAgregar: boolean  = false;
  @Input() mostrarLimpiar: boolean  = false;
  @Input() mostrarSiguiente: boolean  = false;
  @Input() mostrarMarcarDesmarcar: boolean  = false;
  @Input() dataPais: any;
  // @Input() dataPaises: any;
  @Input() dataDivisas: any;
  EnableUpdateEntrevista = false;
  DesbloquearRespuesta3 : boolean | null = false;
  DesbloquearRespuesta13 : boolean | null = false;
  DesbloquearRespuesta16 : boolean | null = false;
  @Input() MostrarFechaTratamiento = false;
  @Input() MostrarFechaExento = false;
  @Input() bloquearCheckTratamiento : boolean | null = true;
  @Input() bloquearCheckDebito = true;
  @Input() bloquearFechaExento : boolean | null = true;
  validoPregunta1 = false;
  validoPregunta2 = false;
  validoPregunta3 = false;
  validoPregunta4 = false;
  validoPregunta5 = false;
  validoPregunta20 = false;
  protected EditarFrom = false;
  public JuridicoEdit : any;
  //#endregion
  //#region From
  private DataUser : any;
  public entrevistaForm!: FormGroup;
  public tratamientoForm!: FormGroup;
  //#endregion
  public entrevistaModel = new EntrevistaModel();
  public entrevistaModelLst: EntrevistaModel[] = [];
  public tratamientoModel = new TratamientoDatosModel();
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  constructor(private notif: NgxToastService, private juridicoService: JuridicosService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    let data = localStorage.getItem('Data');
    this.DataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.IrArriba();
    this.validarTratamiento();
    this.validarEntrevista();
    this.EntidadCapitalice();
    this.ProductoCapitalice();
    this.CiudadCapitalice();
    this.onChanges();
  }

  onChanges(): void {
    this.ValidarCamposCambiantesUno();
  };

  private ValidarCamposCambiantesUno() { 
  
    this.entrevistaForm.get('RPregunta6Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
           this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta6No')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta14Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta14No')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta17Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta17No')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
  
    this.entrevistaForm.get('RPregunta8Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta9Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta10Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta11Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta12Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta25Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta13Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta24Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });

    this.entrevistaForm.get('RPregunta15Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });

    this.entrevistaForm.get('RPregunta16Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta18Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta19Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });

    this.entrevistaForm.get('RPregunta29Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });

    this.entrevistaForm.get('RPregunta28Si')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.entrevistaForm.get('RPregunta28No')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
  
  }


  //#region  Metodos de carga
  //#endregion

  //#region Metodos funcionales
  ValidarSeleccion(data : string, idP : number) {
    if (data === 'si') {
      this.entrevistaForm.get('RPregunta' + idP + 'Si')?.setValue(true);
      this.entrevistaForm.get('RPregunta' + idP + 'No')?.setValue(false);
    } else {
      this.entrevistaForm.get('RPregunta' + idP + 'Si')?.setValue(false);
      this.entrevistaForm.get('RPregunta' + idP + 'No')?.setValue(true);
    }
    if (idP === 6 ) {
      if (idP === 6 && data === 'si') {
        this.DesbloquearRespuesta3 = null;
        this.entrevistaForm.get('RPregunta7Si')?.reset();
        this.entrevistaForm.get('RPregunta8Si')?.reset();
        this.entrevistaForm.get('RPregunta9Si')?.reset();
        this.entrevistaForm.get('RPregunta10Si')?.reset();
        this.entrevistaForm.get('RPregunta11Si')?.reset();
        this.entrevistaForm.get('RPregunta12Si')?.reset();
        this.entrevistaForm.get('RPregunta25Si')?.reset();
        this.entrevistaForm.get('RPregunta13Si')?.reset();
        this.entrevistaForm.get('RPregunta24Si')?.reset();
      } else {
        this.DesbloquearRespuesta3 = true;
        this.entrevistaForm.get('RPregunta7Si')?.reset();
        this.entrevistaForm.get('RPregunta8Si')?.reset();
        this.entrevistaForm.get('RPregunta9Si')?.reset();
        this.entrevistaForm.get('RPregunta10Si')?.reset();
        this.entrevistaForm.get('RPregunta11Si')?.reset();
        this.entrevistaForm.get('RPregunta12Si')?.reset();
        this.entrevistaForm.get('RPregunta25Si')?.reset();
        this.entrevistaForm.get('RPregunta13Si')?.reset();
        this.entrevistaForm.get('RPregunta24Si')?.reset();
      }
    }
    if (idP === 14) {
      if (idP === 14 && data === 'si') {
        this.DesbloquearRespuesta13 = null;
        this.entrevistaForm.get('RPregunta15Si')?.reset();
        this.entrevistaForm.get('RPregunta16Si')?.reset();
      } else {
        this.DesbloquearRespuesta13 = true;
        this.entrevistaForm.get('RPregunta15Si')?.reset();
        this.entrevistaForm.get('RPregunta16Si')?.reset();
        
      }
    }
    if (idP === 17) {
      if (idP === 17 && data === 'si') {
        this.DesbloquearRespuesta16 = null;
        this.entrevistaForm.get('RPregunta18Si')?.reset();
        this.entrevistaForm.get('RPregunta19Si')?.reset();
        this.entrevistaForm.get('RPregunta29Si')?.reset();
      } else {
        this.DesbloquearRespuesta16 = true;
        this.entrevistaForm.get('RPregunta18Si')?.reset();
        this.entrevistaForm.get('RPregunta19Si')?.reset();
        this.entrevistaForm.get('RPregunta29Si')?.reset();
      }
    }
  }

  cambioCheck() {

  }

  limpiarFormulario() {
    this.entrevistaForm.reset();
    this.DesbloquearRespuesta3 = false;
    this.DesbloquearRespuesta13 = false;
    this.DesbloquearRespuesta16 = false;
    this.MostrarFechaTratamiento = false;
  }
  habilitarActualizar() {
    if (this.OperacionSeleccionada === 1) {
      this.EnableUpdateEntrevista = true;
    } else {
      this.EnableUpdateEntrevista = false;
    }
  }
  GuardarJuridicoCompleto() {
    this.loading = true;
    let data = localStorage.getItem('Data');
    const dataUser = JSON.parse(window.atob(data == null ? "" : data));
    console.log('Cantidad -' + this.entrevistaModelLst.length);
    console.log('Cliente selec - '+ this.clienteSeleccionado);
    if (this.infoTabAllEntrevista.BasicosDto.IdRelacion === '15' && this.entrevistaModelLst.length === 0) {
      this.siguiente = true;
      this.emitEvent.emit(this.positionTab);
      this.infoTabAllEntrevista.EntrevistaDto = {};
      this.tratamientoModel.Acepto = true;
      this.tratamientoModel.FechaAceptacion = formatDate(this.infoTabAllEntrevista.JuridicoDto.FechaMatricula, 'yyyy-MM-dd HH:mm:ss', 'en');
      this.tratamientoModel.IdAsesor = dataUser.lngTercero;
      this.tratamientoModel.IdTercero = 0;
      this.tratamientoModel.fechaNoAceptacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
      this.infoTabAllEntrevista.tratamientoDto = this.tratamientoModel;
      this.infoTabAllEntrevista.userWork = dataUser.Usuario;
      this.tratamientoForm.get('checkTratamiento')?.setValue(true);
      this.GuardarJuridico(this.infoTabAllEntrevista);
    } else {
      const valide = this.ValidarPreguntasEntrevistas();
      if (!valide) {
        this.notif.onWarning('Advertencia', 'Debe responder todas las preguntas.');
     } else {
      
        this.allItemFormEntrevista = [];
        this.infoTabAllEntrevista.EntrevistaDto = {};
        this.allItemFormEntrevista.push(this.entrevistaForm.value);
        this.MapearInformacionEntrevista();
        this.infoTabAllEntrevista.EntrevistaDto = this.entrevistaModelLst;
        this.tratamientoModel.Acepto = true;
        this.tratamientoModel.FechaAceptacion = formatDate(this.infoTabAllEntrevista.JuridicoDto.FechaMatricula, 'yyyy-MM-dd HH:mm:ss', 'en');
        this.tratamientoModel.IdAsesor = dataUser.lngTercero;
        this.tratamientoModel.IdTercero = 0;
        this.tratamientoModel.fechaNoAceptacion = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        this.infoTabAllEntrevista.tratamientoDto = this.tratamientoModel;
        this.infoTabAllEntrevista.userWork = dataUser.Usuario;
        console.log(this.infoTabAllEntrevista);
        this.GuardarJuridico(this.infoTabAllEntrevista);
      }
    }
    this.loading = false;
  }
    private MapearInformacionEntrevista() {
    this.allItemFormEntrevista.forEach(entrevista => {
    this.entrevistaModel = new EntrevistaModel();
    this.entrevistaModel.IdTercero = 0;
    this.entrevistaModel.NumeroPregunta = 6;
    this.entrevistaModel.Respuesta = entrevista.RPregunta6Si;
    this.entrevistaModelLst.push(this.entrevistaModel);
    this.entrevistaModel = new EntrevistaModel();
    this.entrevistaModel.IdTercero = 0;
    this.entrevistaModel.NumeroPregunta = 7;
    this.entrevistaModel.Respuesta = entrevista.RPregunta7Si;
    this.entrevistaModelLst.push(this.entrevistaModel);
    this.entrevistaModel = new EntrevistaModel();
    this.entrevistaModel.IdTercero = 0;
    this.entrevistaModel.NumeroPregunta = 8;
    this.entrevistaModel.Respuesta = entrevista.RPregunta8Si;
    this.entrevistaModelLst.push(this.entrevistaModel);
    this.entrevistaModel = new EntrevistaModel();
    this.entrevistaModel.IdTercero = 0;
    this.entrevistaModel.NumeroPregunta = 9;
    this.entrevistaModel.Respuesta = entrevista.RPregunta9Si;
    this.entrevistaModelLst.push(this.entrevistaModel);
    this.entrevistaModel = new EntrevistaModel();
    this.entrevistaModel.IdTercero = 0;
    this.entrevistaModel.NumeroPregunta = 10;
    this.entrevistaModel.Respuesta = entrevista.RPregunta10Si;
    this.entrevistaModelLst.push(this.entrevistaModel);
    this.entrevistaModel = new EntrevistaModel();
    this.entrevistaModel.IdTercero = 0;
    this.entrevistaModel.NumeroPregunta = 11;
    this.entrevistaModel.Respuesta = entrevista.RPregunta11Si;
    this.entrevistaModelLst.push(this.entrevistaModel);
    if (entrevista.RPregunta12Si != null) {
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = 0;
      this.entrevistaModel.NumeroPregunta = 12;
      this.entrevistaModel.Respuesta = entrevista.RPregunta12Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 12;
        this.entrevistaModel.Respuesta = entrevista.RPregunta12Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      if (entrevista.RPregunta25Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 25;
        this.entrevistaModel.Respuesta = entrevista.RPregunta25Si.Id;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 25;
        this.entrevistaModel.Respuesta = entrevista.RPregunta25Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = 0;
      this.entrevistaModel.NumeroPregunta = 13;
      this.entrevistaModel.Respuesta = entrevista.RPregunta13Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = 0;
      this.entrevistaModel.NumeroPregunta = 24;
      this.entrevistaModel.Respuesta = entrevista.RPregunta24Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = 0;
      this.entrevistaModel.NumeroPregunta = 14;
      this.entrevistaModel.Respuesta = entrevista.RPregunta14Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      if (entrevista.RPregunta15Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 15;
        this.entrevistaModel.Respuesta = entrevista.RPregunta15Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 15;
        this.entrevistaModel.Respuesta = entrevista.RPregunta15Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      if (entrevista.RPregunta16Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 15;
        this.entrevistaModel.Respuesta = entrevista.RPregunta16Si.Id;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 15;
        this.entrevistaModel.Respuesta = entrevista.RPregunta16Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = 0;
      this.entrevistaModel.NumeroPregunta = 17;
      this.entrevistaModel.Respuesta = entrevista.RPregunta17Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      if (entrevista.RPregunta18Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 18;
        this.entrevistaModel.Respuesta = entrevista.RPregunta18Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 18;
        this.entrevistaModel.Respuesta = entrevista.RPregunta18Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      if (entrevista.RPregunta19Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 19;
        this.entrevistaModel.Respuesta = entrevista.RPregunta19Si.Id;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = 0;
        this.entrevistaModel.NumeroPregunta = 19;
        this.entrevistaModel.Respuesta = entrevista.RPregunta19Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = 0;
      this.entrevistaModel.NumeroPregunta = 29;
      this.entrevistaModel.Respuesta = entrevista.RPregunta29Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = 0;
      this.entrevistaModel.NumeroPregunta = 28;
      this.entrevistaModel.Respuesta = entrevista.RPregunta28Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
    });
  }

  private GuardarJuridico(infoTotal : any) {
    this.loading = true;
    if (this.infoTabAllEntrevista.BasicosDto.IdRelacion === 5) {
      infoTotal.BasicosDto.DebitoAutomatico = this.tratamientoForm.get('checkDebitoAutomatico')?.value;
    } else {      
    infoTotal.BasicosDto.DebitoAutomatico = false;
    }
    console.log('infoTotal - Guardar juridico: ' + JSON.stringify(infoTotal));
    this.juridicoService.GuardarJuridicosAll(infoTotal).subscribe(result => {
      if (result.ok) {
        this.loading = false;
        localStorage.setItem('IdModuloActivo', window.btoa(JSON.stringify(12)));
        const dataJuridico = JSON.parse(result['_body']);
        this.GuardarLog(JSON.parse(result['_body']), this.OperacionSeleccionada, 0, dataJuridico.BasicosDto.IdTercero,12);
        // this.notif.onSuccess('Exitoso', 'El registro se realizó correctamente.');
        this.emitEventGuardado.emit({
          cargar: '1', consultar: infoTotal.JuridicoDto.Nit, consultarTercero: dataJuridico.BasicosDto.IdTercero,
          relacion: dataJuridico.BasicosDto.IdRelacion  });
        this.entrevistaModelLst = [];
        this.DesbloquearRespuesta3 = true;
        this.DesbloquearRespuesta16 = true;
        this.DesbloquearRespuesta13 = true;
        this.IrArriba();
      }
      else {
        this.loading = false;
        console.log('result - Guardar juridico: ' + result);
      }
    }, error => {
        this.loading = false;
      console.error('Error al realizar el registro - juridicos: ' + error);
      this.notif.onDanger('Error', 'No se pudo realizar el registro - Error: ' + error);
    });

  }

  ActualizarEntrevista() {
    if (this.EditarFrom) {
      if(this.infoTabAllEntrevista.BasicosDto.IdRelacion === '15' && this.entrevistaModelLst.length === 0 && this.infoTabAllEntrevista.BasicosDto.Proveedor ==='1'){
        const valide = this.ValidarPreguntasEntrevistas();
        if (!valide) {
          this.notif.onWarning('Advertencia', 'Debe responder todas las preguntas.');
        } else {
          this.EditaEntrevista();
        }
      } else {
        if (this.clienteSeleccionado === 15) {
          if (this.entrevistaForm.get('RPregunta6Si')?.value === true || this.entrevistaForm.get('RPregunta14Si')?.value === true ||
            this.entrevistaForm.get('RPregunta17Si')?.value === true) {
            const valide = this.ValidarPreguntasEntrevistas();
            if (!valide) {
              this.notif.onWarning('Advertencia', 'Debe responder todas las preguntas.');
            } else {
              this.EditaEntrevista();
            }
          } else {
            this.EditaEntrevista();
          }
        } else {
          const valide = this.ValidarPreguntasEntrevistas();
          if (!valide) {
            this.notif.onWarning('Advertencia', 'Debe responder todas las preguntas.');
          } else {
            this.EditaEntrevista();
          }
        }
          

      }
    } else {
      if (!this.EditarFrom) {
        this.notif.onWarning('Advertencia', 'Debe realizar cambios en el formulario.');
      }
      this.ValidarErrorForm(this.entrevistaForm);
    }
  }

  private EditaEntrevista() {
    this.allItemFormEntrevista = [];
    this.infoTabAllEntrevista.EntrevistaDto = {};
    this.allItemFormEntrevista.push(this.entrevistaForm.value);
    this.entrevistaModelLst = [];
    this.allItemFormEntrevista.forEach(entrevista => {
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 6;
      this.entrevistaModel.Respuesta = entrevista.RPregunta6Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 7;
      this.entrevistaModel.Respuesta = entrevista.RPregunta7Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 8;
      this.entrevistaModel.Respuesta = entrevista.RPregunta8Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 9;
      this.entrevistaModel.Respuesta = entrevista.RPregunta9Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 10;
      this.entrevistaModel.Respuesta = entrevista.RPregunta10Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 11;
      this.entrevistaModel.Respuesta = entrevista.RPregunta11Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      if (entrevista.RPregunta12Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 12;
        this.entrevistaModel.Respuesta = entrevista.RPregunta12Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 12;
        this.entrevistaModel.Respuesta = entrevista.RPregunta12Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      if (entrevista.RPregunta25Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 25;
        this.entrevistaModel.Respuesta = entrevista.RPregunta25Si.Id;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 25;
        this.entrevistaModel.Respuesta = entrevista.RPregunta25Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 13;
      this.entrevistaModel.Respuesta = entrevista.RPregunta13Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 24;
      this.entrevistaModel.Respuesta = entrevista.RPregunta24Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 14;
      this.entrevistaModel.Respuesta = entrevista.RPregunta14Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      if (entrevista.RPregunta15Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 15;
        this.entrevistaModel.Respuesta = entrevista.RPregunta15Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 15;
        this.entrevistaModel.Respuesta = entrevista.RPregunta15Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      if (entrevista.RPregunta16Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 16;
        this.entrevistaModel.Respuesta = entrevista.RPregunta16Si.Id;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 16;
        this.entrevistaModel.Respuesta = entrevista.RPregunta16Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 17;
      this.entrevistaModel.Respuesta = entrevista.RPregunta17Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      if (entrevista.RPregunta18Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 18;
        this.entrevistaModel.Respuesta = entrevista.RPregunta18Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 18;
        this.entrevistaModel.Respuesta = entrevista.RPregunta18Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      if (entrevista.RPregunta19Si != null) {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 19;
        this.entrevistaModel.Respuesta = entrevista.RPregunta19Si.Id;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }
      else {
        this.entrevistaModel = new EntrevistaModel();
        this.entrevistaModel.IdTercero = this.JuridicoEdit;
        this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
        this.entrevistaModel.NumeroPregunta = 19;
        this.entrevistaModel.Respuesta = entrevista.RPregunta19Si;
        this.entrevistaModelLst.push(this.entrevistaModel);
      }

      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 29;
      this.entrevistaModel.Respuesta = entrevista.RPregunta29Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
      this.entrevistaModel = new EntrevistaModel();
      this.entrevistaModel.IdTercero = this.JuridicoEdit;
      this.entrevistaModel.IdEntrevista = entrevista.IdEntrevista;
      this.entrevistaModel.NumeroPregunta = 28;
      this.entrevistaModel.Respuesta = entrevista.RPregunta28Si;
      this.entrevistaModelLst.push(this.entrevistaModel);
    });
    this.infoTabAllEntrevista.EntrevistaDto = this.entrevistaModelLst;
    this.GuardarLog(this.infoTabAllEntrevista.EntrevistaDto, this.OperacionSeleccionada, 0, this.JuridicoEdit, 12);
    this.juridicoService.EditEntrevista(this.infoTabAllEntrevista.EntrevistaDto).subscribe(result => {
      if (result) {
        this.notif.onSuccess('Exitoso', 'El registro se realizó correctamente.');
        this.infoTabAllEntrevista.EntrevistaDto = {};
        this.EditarFrom = false;
        this.IrArriba();
      }
    }, error => {
      console.error('Error al realizar el registro - juridicos: ' + error);
      this.notif.onDanger('Error', 'No se pudo realizar el registro - Error: ' + error);
    });
  }

  EditarTratamiento() {
    const valueCheck = this.tratamientoForm.get('checkTratamiento')?.value;
    const fechaManual = this.tratamientoForm.get('fechaTrataManual')?.value;
    const valueCheckGmf = this.tratamientoForm.get('checkExentoGMF')?.value;
    const operacion = this.OperacionSeleccionada;
    // aqui va la fecha de GMF exento
    if (operacion !== null && operacion !== undefined && operacion !== "" && operacion !== 0) {
      if (fechaManual !== null && fechaManual !== undefined && fechaManual !== '') {

        if (this.OperacionSeleccionada === 14) {// Marcar tratamiento
            if (!valueCheck) {
              this.tratamientoModel.IdTercero = this.idJuridicoSearch;
              this.tratamientoModel.Acepto = true;
              this.tratamientoModel.FechaAceptacion = formatDate(fechaManual, 'yyyy-MM-dd HH:mm:ss', 'en');
              this.tratamientoModel.fechaNoAceptacion = null;
              this.tratamientoModel.IdAsesor = this.DataUser.lngTercero;
              this.GuardarLog(this.tratamientoModel, this.OperacionSeleccionada, 0, this.tratamientoModel.IdTercero,12);
              this.juridicoService.MarcarTratamiento(this.tratamientoModel).subscribe(
                result => {
                  this.bloquearCheckTratamiento = true;
                  this.mostrarMarcarDesmarcar = false;
                  this.MostrarFechaTratamiento = false;
                  this.emitEventEntrevista.emit(true);
                  this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
                  this.IrArriba();
                },
                error => {
                  console.error('EditarTratamiento - ' + error);
                }
              );
            } else {
              this.IrArriba();
              this.emitEventEntrevista.emit(true);
              this.notif.onWarning('Advertencia', 'El tratamiento de datos ya se encuentra marcado.');
            }
        } else if (this.OperacionSeleccionada === 22) { // Desmarcar tratamiento
            if (valueCheck) {
              this.tratamientoModel.IdTercero = this.idJuridicoSearch;
              this.tratamientoModel.Acepto = false;
              this.tratamientoModel.FechaAceptacion = null;
              this.tratamientoModel.fechaNoAceptacion = formatDate(fechaManual, 'yyyy-MM-dd HH:mm:ss', 'en');
              this.tratamientoModel.IdAsesor = this.DataUser.lngTercero;
              this.GuardarLog(this.tratamientoModel, this.OperacionSeleccionada, 0, this.tratamientoModel.IdTercero,12);
              this.juridicoService.DesmarcarTratamiento(this.tratamientoModel).subscribe(
                result => {
                  this.bloquearCheckTratamiento = true;
                  this.mostrarMarcarDesmarcar = false;
                  this.emitEventEntrevista.emit(true);
                  this.MostrarFechaTratamiento = false;
                  this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
                  this.IrArriba();
                },
                error => {
                  console.error('EditarTratamiento - ' + error);
                }
              );
            } else {
              this.IrArriba();
              this.emitEventEntrevista.emit(true);
              this.notif.onWarning('Advertencia', 'El tratamiento de datos ya se encuentra desmarcado.');
            }
        } else if (this.OperacionSeleccionada === 41) { // Marcar exento GMF 
          if (!valueCheckGmf) {
            this.GuardarLog('Marco exento del GMF', this.OperacionSeleccionada, 0, this.idJuridicoSearch,12);
            this.juridicoService.MarcarExentoGFM(this.idJuridicoSearch,formatDate(fechaManual, 'yyyy-MM-dd HH:mm:ss', 'en')).subscribe(
              result => {
                this.bloquearCheckTratamiento = true;
                this.mostrarMarcarDesmarcar = false;
                this.tratamientoForm.get('checkExentoGMF')?.setValue(true);
                this.MostrarFechaTratamiento = false;
                this.bloquearFechaExento = true;
                this.MostrarFechaExento = true;
                this.bloquearCheckExento = true;
                this.MostrarFechaExento = false;
                this.emitEventEntrevista.emit(true);
                this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
                this.IrArriba();
              },
              error => {
                console.error('EditarTratamiento - ' + error);
              }
              );
          } else {
            this.IrArriba();
            this.emitEventEntrevista.emit(true);
            this.notif.onWarning('Advertencia', 'El GMF ya se encuentra marcado.');
          }
        } else if (this.OperacionSeleccionada === 42) { // Desmarcar exento GMF 
          if (valueCheckGmf) {
            this.GuardarLog('Desmarco exento del GMF', this.OperacionSeleccionada, 0, this.idJuridicoSearch,12);
            this.juridicoService.DesmarcarExentoGMF(this.idJuridicoSearch, formatDate(fechaManual, 'yyyy-MM-dd HH:mm:ss', 'en')).subscribe(
              result => {
                this.bloquearCheckTratamiento = true;
                this.mostrarMarcarDesmarcar = false;
                this.emitEventEntrevista.emit(true);
                this.MostrarFechaExento = false;
                this.MostrarFechaTratamiento = false;
                this.bloquearFechaExento = true;
                this.MostrarFechaExento = true;
                this.bloquearCheckExento = true;

                this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
                this.IrArriba();
              },
              error => {
                console.error('EditarTratamiento - ' + error);
              }
            );
          } else {
            this.IrArriba();
            this.emitEventEntrevista.emit(true);
            this.notif.onWarning('Advertencia', 'El GMF ya se encuentra desmarcado.');

          }
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe ingresar una fecha de actualización valida.');
      }
    } else {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una operación.');
    }

  }

  validarFechaTratamiento() {
    const fechaTratamiento = this.tratamientoForm.get('fechaTrataManual')?.value;
    const fechaTrata = new Date(fechaTratamiento);
    const fechaCreaMo = moment(new Date(this.fechaMatricula), 'YYYY-MM-DD').format('YYYY-MM-DD');
    const fechaCrea = new Date(fechaCreaMo);
    const fechaActual = new Date();
    if (fechaTratamiento !== null) {
      if (fechaTrata < fechaActual) {
        if (fechaTrata < fechaCrea) {
          this.notif.onWarning('Advertencia', 'La fecha no puede ser menor a la fecha de creación.');
          this.tratamientoForm.get('fechaTrataManual')?.reset();
          this.tratamientoForm.get('fechaTrataManual')?.setValue(null);
        }
      } else {
        this.notif.onWarning('Advertencia','La fecha no puede ser mayor a la fecha de actual.');
        this.tratamientoForm.get('fechaTrataManual')?.reset();
        this.tratamientoForm.get('fechaTrataManual')?.setValue(null);
      }
    } else {
      this.tratamientoForm.get('fechaTrataManual')?.reset();
      this.tratamientoForm.get('fechaTrataManual')?.setValue(null);
    }
  }
  
  ValidarPreguntasEntrevistas(): boolean {
    if (this.entrevistaForm.value.RPregunta6Si === null && this.entrevistaForm.value.RPregunta6No === null) {
      this.validoPregunta3 = false;
    } else {
      
      if (this.entrevistaForm.value.RPregunta6Si) {
        if (this.entrevistaForm.value.RPregunta7Si === null ||
          this.entrevistaForm.value.RPregunta11Si === null || this.entrevistaForm.value.RPregunta12Si === null ||
          this.entrevistaForm.value.RPregunta25Si === null || this.entrevistaForm.value.RPregunta13Si === null ||
          this.entrevistaForm.value.RPregunta24Si === null) {
            this.validoPregunta3 = false;
        } else {
          if (this.entrevistaForm.value.RPregunta8Si === null && this.entrevistaForm.value.RPregunta9Si === null &&
            this.entrevistaForm.value.RPregunta10Si === null) {
            this.validoPregunta3 = false;
          } else {
            this.validoPregunta3 = true;
          }
        }
      } else {
        this.validoPregunta3 = true;
      }
    }
    if (this.entrevistaForm.value.RPregunta14Si === null && this.entrevistaForm.value.RPregunta14No === null) {
      if (this.entrevistaForm.value.RPregunta14Si) {
        if (this.entrevistaForm.value.RPregunta15Si === null || this.entrevistaForm.value.RPregunta16Si === null) {
          this.validoPregunta4 = false;
        } else {
          this.validoPregunta4 = true;
        }
      } else {
        if (this.entrevistaForm.value.RPregunta14Si) {
          if (this.entrevistaForm.value.RPregunta15Si === null || this.entrevistaForm.value.RPregunta16Si === null) {
            this.validoPregunta4 = false;
          } else {
            this.validoPregunta4 = true;
          }
        } else {
          this.validoPregunta4 = true;
        }
      }
     
    } else {
      if (this.entrevistaForm.value.RPregunta14Si) {
        if (this.entrevistaForm.value.RPregunta16Si === null || this.entrevistaForm.value.RPregunta16Si === null) {
          this.validoPregunta4 = false;
        } else {
          this.validoPregunta4 = true;
        }
      } else {
        this.validoPregunta4 = true;
      }
    }
    if (this.entrevistaForm.value.RPregunta17Si === null && this.entrevistaForm.value.RPregunta17No === null) {
      if (this.entrevistaForm.value.RPregunta17Si) {
        if (this.entrevistaForm.value.RPregunta18Si === null || this.entrevistaForm.value.RPregunta19Si === null ||
          this.entrevistaForm.value.RPregunta29Si === null) {
          this.validoPregunta5 = false;
        } else {
          this.validoPregunta5 = true;
        }
      } else {
        this.validoPregunta5 = true;
      }
    } else {
      if (this.entrevistaForm.value.RPregunta17Si) {
        if (this.entrevistaForm.value.RPregunta18Si === null || this.entrevistaForm.value.RPregunta19Si === null ||
          this.entrevistaForm.value.RPregunta29Si === null) {
          this.validoPregunta5 = false;
        } else {
          this.validoPregunta5 = true;
        }
      } else {
        this.validoPregunta5 = true;
      }
    }

    if (this.entrevistaForm.value.RPregunta28Si === null && this.entrevistaForm.value.RPregunta28No === null) {
      this.validoPregunta20 = false;
    } else {
      this.validoPregunta20 = true;
    }

    // retornar un true o false si no tiene seleccionada todas las preguntas
    // this.validoPregunta1 &&  this.validoPregunta2 &&
    if (this.validoPregunta3 && this.validoPregunta4 && this.validoPregunta5 && this.validoPregunta20) {
      return true;
    } else {
      return false;
    }
    
  }



  //#endregion

  //#region Metodos Inicializacion y generales
  validarEntrevista() {
    const IdEntrevista = new FormControl('', []);
    const IdTercero = new FormControl('', []);

    const RPregunta6Si = new FormControl('', []);
    const RPregunta6No = new FormControl('', []);

    const RPregunta7Si = new FormControl('', []);
    const RPregunta8Si = new FormControl('', []);
    const RPregunta9Si = new FormControl('', []);
    const RPregunta10Si = new FormControl('', []);
    const RPregunta11Si = new FormControl('', []);
    const RPregunta12Si = new FormControl('', []);
    const RPregunta25Si = new FormControl('', []);
    const RPregunta13Si = new FormControl('', []);
    const RPregunta24Si = new FormControl('', []);

    const RPregunta14Si = new FormControl('', []);
    const RPregunta14No = new FormControl('', []);

    const RPregunta15Si = new FormControl('', []);
    const RPregunta16Si = new FormControl('', []);

    const RPregunta17Si = new FormControl('', []);
    const RPregunta17No = new FormControl('', []);

    const RPregunta18Si = new FormControl('', []);
    const RPregunta19Si = new FormControl('', []);
    const RPregunta29Si = new FormControl('', []);

    const RPregunta28Si = new FormControl('', []);
    const RPregunta28No = new FormControl('', []);

    this.entrevistaForm = new FormGroup({
      IdEntrevista: IdEntrevista,
      IdTercero: IdTercero,

      RPregunta6Si: RPregunta6Si,
      RPregunta6No: RPregunta6No,

      RPregunta7Si: RPregunta7Si,
      RPregunta8Si: RPregunta8Si,
      RPregunta9Si: RPregunta9Si,
      RPregunta10Si: RPregunta10Si,
      RPregunta11Si: RPregunta11Si,
      RPregunta12Si: RPregunta12Si,
      RPregunta25Si: RPregunta25Si,
      RPregunta13Si: RPregunta13Si,
      RPregunta24Si: RPregunta24Si,

      RPregunta14Si: RPregunta14Si,
      RPregunta14No: RPregunta14No,

      RPregunta15Si: RPregunta15Si,
      RPregunta16Si: RPregunta16Si,

      RPregunta17Si: RPregunta17Si,
      RPregunta17No: RPregunta17No,

      RPregunta18Si: RPregunta18Si,
      RPregunta19Si: RPregunta19Si,
      RPregunta29Si: RPregunta29Si,
      RPregunta28Si: RPregunta28Si,
      RPregunta28No: RPregunta28No,
      // fechaTrataManual: fechaTrataManual
    });

  
  }

  validarTratamiento() {
    const fechaTrataManual = new FormControl('', []);
    const checkTratamiento = new FormControl('', []);
    const checkDebitoAutomatico = new FormControl('', []);
    const checkExentoGMF = new FormControl('', []);
    this.tratamientoForm = new FormGroup({
      fechaTrataManual: fechaTrataManual,
      checkTratamiento: checkTratamiento,
      checkDebitoAutomatico: checkDebitoAutomatico,
      checkExentoGMF: checkExentoGMF
    });
  }

  ValidarErrorForm(formulario: any) {
    Object.keys(formulario.controls).forEach(field => { // {1}
      const control = formulario.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }

  GenericoSelect(input : string, form : any) {
    if (+form.get('' + input + '')?.value === 0) {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una opción valida.');
      form.get('' + input + '')?.reset();
    }
  }

  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        // console.log(new Date, result);
      }
    );
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  EntidadCapitalice() {
    let self = this;
    $('#enQueEntidad').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }
  ProductoCapitalice() {
    let self = this;
    $('#tipoProducto').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }
  CiudadCapitalice() {
    let self = this;
    $('#ciudad').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }
  //#endregion

}
