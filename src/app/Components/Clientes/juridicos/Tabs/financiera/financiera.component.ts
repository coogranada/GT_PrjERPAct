import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequiredData } from '../../../../../Models/Generales/RequiredData.model';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
import { FinancieroModel } from '../../../../../Models/Clientes/Juridicos/FinancieroModel';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;
@Component({
  selector: 'app-financiera',
  templateUrl: './financiera.component.html',
  styleUrls: ['./financiera.component.css'],
  providers: [ClientesGetListService, GeneralesService],
  standalone : false
})
export class FinancieraComponent implements OnInit {
  //#region Declaracion variables de comunicacion
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente
  @Input() infoTabAllReferencia: any;
  @Input() OperacionActual: any;
  //#endregion
  //#region Declaracion formularios
  // public financieraFrom: FormGroup;
  public financieraFrom: any;
  public dataOperaciones :any;
  //#endregion
  //#region Declaracion variables de bloqueo Inptut()
  @Input() bloquearForm: boolean | null = false;
  @Input() mostrarActualizar: boolean = false;
  @Input() mostrarAgregar: boolean = false;
  @Input() mostrarLimpiar: boolean = false;
  @Input() mostrarSiguiente: boolean = false;
  @Input() activarBtnOpciones: boolean = false;
  //#endregion
  //#region carga variables
  public siguiente = false;
  public positionTab = 4;
  public dataCategoria  :any;
  public DataRequired = new RequiredData();
  public dataConceptos : any;
  public dataTableIngresos: any[] = [];
  public dataTableEgresos: any[] = [];
  public dataTableAll: any[] = [];
  public indexItemFinanciero = null;
  public SumaIngresos = 0;
  public SumaEgresos = 0;
  public financieroModel = new FinancieroModel();
  public financieroModelList: FinancieroModel[] = [];
  public tieneCostoAdmon = false;
  public tieneIngresosOpe = false;
  public EnableUpdateFinanciero = false;
  public clienteSeleccionado: any;
  public EsProveedor: boolean = false;
  public JuridicoEdit: any;
  public obligatoriCliente : any;
  public ColorAnterior1: any;
  public ColorAnterior2: any;

 
  //#endregion
  constructor(private clientesGetListService: ClientesGetListService, private notif: NgxToastService,
    private juridicoService: JuridicosService, private generalesService: GeneralesService) { }

  ngOnInit() {
    this.IrArriba();
    this.ObservacionCapitalice();
    this.validateJuridicos();
    this.dataCategoria = this.DataRequired.CategoriasData;
  }

  //#region  Metodos de carga
  //#endregion

  //#region Metodos funcionales
  AgregarFinanciero() {
    if (this.financieraFrom.valid) {
      if (this.indexItemFinanciero !== null) {
        if (this.financieraFrom.controls.Categoria.value.Id === 1) {
          this.SumaIngresos = 0;
          this.dataTableIngresos.splice(this.indexItemFinanciero, 1);
          if (this.financieraFrom.value.Observacion !== null && this.financieraFrom.value.Observacion !== undefined) {
            this.financieraFrom.value.Observacion = this.financieraFrom.value.Observacion.substr(0, 1).toUpperCase() +
              this.financieraFrom.value.Observacion.substr(1).toLowerCase();
          }
          this.dataTableIngresos.push(this.financieraFrom.value);
          this.EnableUpdateFinanciero = true;
          this.dataTableIngresos.forEach(ingresos => {
            this.SumaIngresos = this.SumaIngresos + ingresos.Valor;
          });

        } else {
          this.SumaEgresos = 0;
          this.dataTableEgresos.splice(this.indexItemFinanciero, 1);
          if (this.financieraFrom.value.Observacion !== null && this.financieraFrom.value.Observacion !== undefined) {
            this.financieraFrom.value.Observacion = this.financieraFrom.value.Observacion.substr(0, 1).toUpperCase() +
              this.financieraFrom.value.Observacion.substr(1).toLowerCase();
          }
          this.dataTableEgresos.push(this.financieraFrom.value);
          this.EnableUpdateFinanciero = true;
          this.dataTableEgresos.forEach(egresos => {
            this.SumaEgresos = this.SumaEgresos + egresos.Valor;
          });
        }
        this.indexItemFinanciero = null;
        this.financieraFrom.reset();

      } else {
        if (this.financieraFrom.controls.Categoria.value.Id === 1) {
          if (this.financieraFrom.value.Observacion !== null && this.financieraFrom.value.Observacion !== undefined) {
            this.financieraFrom.value.Observacion = this.financieraFrom.value.Observacion.substr(0, 1).toUpperCase() +
              this.financieraFrom.value.Observacion.substr(1).toLowerCase();
          }
          this.dataTableIngresos.push(this.financieraFrom.value);
          this.SumaIngresos = this.SumaIngresos + +this.financieraFrom.value.Valor;
          this.EnableUpdateFinanciero = true;
        } else {
          if (this.financieraFrom.value.Observacion !== null && this.financieraFrom.value.Observacion !== undefined) {
            this.financieraFrom.value.Observacion = this.financieraFrom.value.Observacion.substr(0, 1).toUpperCase() +
              this.financieraFrom.value.Observacion.substr(1).toLowerCase();
          }
          this.dataTableEgresos.push(this.financieraFrom.value);
          this.SumaEgresos = this.SumaEgresos + +this.financieraFrom.value.Valor;
          this.EnableUpdateFinanciero = true;
        }
        this.financieraFrom.reset();
      }
    } else {
      this.ValidarErrorForm(this.financieraFrom);
    }
  }

  EliminarFinanciero(index : number, data : any) {
    if (data.Categoria.Id === 1) {
      this.dataTableIngresos.splice(index, 1);
      this.SumaIngresos = this.SumaIngresos - +data.Valor;
      this.EnableUpdateFinanciero = true;
    } else {
      this.dataTableEgresos.splice(index, 1);
      this.SumaEgresos = this.SumaEgresos - +data.Valor;
      this.EnableUpdateFinanciero = true;
    }
  }

  MapearFinanciero(index : any , data : any) {
    this.IrArriba();
    this.indexItemFinanciero = index;
    this.financieraFrom.get('IdJuridicoFinanciera').setValue(data.IdJuridicoFinanciera);
    this.financieraFrom.get('IdJuridico').setValue(data.IdJuridico);
    this.financieraFrom.get('Categoria').setValue(data.Categoria);
    this.financieraFrom.get('Valor').setValue(data.Valor);
    this.clientesGetListService.GetConceptosJuridicos(data.Categoria.Id).subscribe(
      result => {
        this.dataConceptos = result;
        this.dataConceptos.forEach((element : any) => {
          if (element.IdConcepto === data.Concepto.IdConcepto) {
            this.financieraFrom.get('Concepto').setValue(element);
          }
        });
      });
    this.financieraFrom.get('Observacion').setValue(data.Observacion);
  }

  GuardarFinanciero() {
    if (this.infoTabAllReferencia.BasicosDto.IdRelacion === '15' && this.dataTableIngresos.length === 0 && this.infoTabAllReferencia.BasicosDto.Proveedor ==='1') {
      this.infoTabAllReferencia.FinancieroDto = {};
      console.log(this.infoTabAllReferencia);
      this.siguiente = true;
      this.emitEvent.emit(this.positionTab);
      this.IrArriba();
    } else {
      if (this.dataTableIngresos.length > 0 && this.dataTableEgresos.length > 0) {
        this.financieroModelList = [];
        this.dataTableAll = [];
        this.tieneCostoAdmon = false;
        this.tieneIngresosOpe = false;

        this.dataTableIngresos.forEach(ingresos => {
          this.dataTableAll.push(ingresos);
        });

        this.dataTableEgresos.forEach(egresos => {
          this.dataTableAll.push(egresos);
        });

        this.dataTableAll.forEach(elementAll => {
          this.financieroModel = new FinancieroModel();
          this.financieroModel.Descripcion = elementAll.Observacion;
          this.financieroModel.IdTercero = 0;
          this.financieroModel.IdCategoria = elementAll.Categoria.Id;
          this.financieroModel.IdJuridicoConcepto = elementAll.Concepto.IdConcepto;
          this.financieroModel.Valor = elementAll.Valor;

          this.financieroModelList.push(this.financieroModel);
        });

        this.financieroModelList.forEach(elementlist => {
          if (elementlist.IdJuridicoConcepto === 3) {
            this.tieneCostoAdmon = true;
          }

          if (elementlist.IdJuridicoConcepto === 1) {
            this.tieneIngresosOpe = true;
          }
        });

        if (this.tieneCostoAdmon && this.tieneIngresosOpe) {
          this.siguiente = true;
          this.emitEvent.emit(this.positionTab);

          this.infoTabAllReferencia.FinancieroDto = this.financieroModelList;
          console.log(this.infoTabAllReferencia);
          this.IrArriba();
        } else {
          if (!this.tieneCostoAdmon) {
            this.notif.onWarning('Advertencia', 'Debe registrar un egreso por costo de administración.');
            this.tieneCostoAdmon = false;
          }
          if (!this.tieneIngresosOpe) {
            this.notif.onWarning('Advertencia', 'Debe registrar un ingreso operativo.');
            this.tieneIngresosOpe = false;
          }
        }
      } else {
        this.notif.onWarning('Advertencia','Debe agregar un registro de ingresos operativos y otro de costos de administración.');
      }
    }
  }

  ActualizarFinanciero() {
   
    if (this.dataTableIngresos.length > 0 && this.dataTableEgresos.length > 0) {
      this.financieroModelList = [];
      this.dataTableAll = [];
      this.tieneCostoAdmon = false;
      this.tieneIngresosOpe = false;

      this.dataTableIngresos.forEach(ingresos => {
        this.dataTableAll.push(ingresos);
      });

      this.dataTableEgresos.forEach(egresos => {
        this.dataTableAll.push(egresos);
      });

      this.dataTableAll.forEach(elementAll => {
        this.financieroModel = new FinancieroModel();
        this.financieroModel.IdJuridicoFinanciera = elementAll.IdJuridicoFinanciera;
        if (elementAll.IdJuridico !== null && elementAll.IdJuridico !== undefined) {
          this.financieroModel.IdTercero = elementAll.IdJuridico;
          this.JuridicoEdit = elementAll.IdJuridico;
        } else {
          this.financieroModel.IdTercero = this.JuridicoEdit;
        
        }
        
        this.financieroModel.Descripcion = elementAll.Observacion;
        this.financieroModel.IdCategoria = elementAll.Categoria.Id;
        this.financieroModel.IdJuridicoConcepto = elementAll.Concepto.IdConcepto;
        this.financieroModel.Valor = elementAll.Valor;

        this.financieroModelList.push(this.financieroModel);
      });

      this.financieroModelList.forEach(elementlist => {
        if (elementlist.IdJuridicoConcepto === 3) {
          this.tieneCostoAdmon = true;
        }

        if (elementlist.IdJuridicoConcepto === 1) {
          this.tieneIngresosOpe = true;
        }
      });

      if (this.tieneCostoAdmon && this.tieneIngresosOpe) {

        this.GuardarLog(this.financieroModelList, this.OperacionActual, 0, this.JuridicoEdit,12);
        this.juridicoService.EditFinancieroJuridico(this.financieroModelList).subscribe(
          result => {
            if (result) {
              this.IrArriba();
              this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
              this.financieroModelList = [];
              this.EnableUpdateFinanciero = false;
            }
          },
          error => {
            console.error('Error al realizar la actualizacion - juridicos: ' + error);
            this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
            
          });

      } else {
        if (!this.tieneCostoAdmon) {
          this.notif.onWarning('Advertencia', 'Debe registrar un egreso por costo de administración.');
          this.tieneCostoAdmon = false;
          this.EnableUpdateFinanciero = false;
        }
        if (!this.tieneIngresosOpe) {
          this.notif.onWarning('Advertencia', 'Debe registrar un ingreso operativo.');
          this.tieneIngresosOpe = false;
          this.EnableUpdateFinanciero = false;
        }
      }
    } else {
      this.notif.onWarning('Advertencia', 'Debe agregar una categoría para ingresos y una para egresos.');
      this.EnableUpdateFinanciero = false;
    }
  }

  GetConceptos(form : any) {
    if (form.Id !== undefined) {
      this.clientesGetListService.GetConceptosJuridicos(form.Id).subscribe(
        result => {
          this.dataConceptos = result;
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.error(errorMessage);
        }
      );
    } else {
      this.financieraFrom.get('Concepto').reset();
      this.dataConceptos = [];
      this.GenericoSelect('Categoria', this.financieraFrom);
    }
  }

  LimpiarFormulario() {
    this.financieraFrom.reset();
    this.dataConceptos = [];
  }

  validarValor() {
    const valorIngresado = +this.financieraFrom.get('Valor').value;
    if (valorIngresado <= 0 && valorIngresado !== null &&
      valorIngresado !== undefined) {
      this.notif.onWarning('Advertencia', 'El valor ingresado debe ser mayor a 0.');
      this.financieraFrom.get('Valor').reset();
    } 
  }
  //#endregion

  //#region Metodos Inicializacion y generales
  validateJuridicos() {
    const IdJuridicoFinanciera = new FormControl('', []);
    const IdJuridico = new FormControl('', []);
    const Categoria = new FormControl('', [Validators.required]);
    const Concepto = new FormControl('', [Validators.required]);
    const Observacion = new FormControl('', []);
    const Valor = new FormControl('', [Validators.required]);

    this.financieraFrom = new FormGroup({
      IdJuridicoFinanciera: IdJuridicoFinanciera,
      IdJuridico: IdJuridico,
      Categoria: Categoria,
      Concepto: Concepto,
      Observacion: Observacion,
      Valor: Valor
    });
  }

  ValidarErrorForm(formulario: any) {
    Object.keys(formulario.controls).forEach(field => { // {1}
      const control = formulario.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }

  GenericoSelect(input : string, form : any) {
    if (+form.get('' + input + '').value === 0) {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una opción valida.');
      form.get('' + input + '').reset();
    }
  }

  ObservacionCapitalice() {
    let self = this;
    $('#Observa').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
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

  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".filIngresos_" + this.ColorAnterior1).css("background", "#FFFFFF");
      $(".filIngresos_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior1 = fil;
    }
    if (producto === 2) {

      $(".filEgresos_" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".filEgresos_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior2 = fil;

    }
    
  }
//#endregion
}
