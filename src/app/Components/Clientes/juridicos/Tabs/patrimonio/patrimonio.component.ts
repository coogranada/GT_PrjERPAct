import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
import { RecursosGeneralesService } from '../../../../../Services/Utilidades/recursosGenerales.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatrimonioModel } from '../../../../../Models/Clientes/Juridicos/PatrimonioModel';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;

@Component({
  selector: 'app-patrimonio',
  templateUrl: './patrimonio.component.html',
  styleUrls: ['./patrimonio.component.css'],
  providers: [ClientesGetListService, RecursosGeneralesService, GeneralesService],
  standalone : false
})
export class PatrimonioComponent implements OnInit {
  //#region carga variables
  public dataVias : any;
  public dataLetras : any;
  public dataCardinal : any;
  public dataImuebles : any;
  public dataContacto : any;
  public dataPaises : any;
  public dataDepartamentos : any;
  public dataCiudades : any;
  //#endregion
  //#region  variables de bloqueo
  @Input() bloquearForm: boolean | null = false;
  @Input() mostrarActualizar: boolean | null = false;
  @Input() mostrarLimpiar: boolean | null = false;
  @Input() mostrarSiguiente: boolean | null = false;
  //#endregion
  //#region From
  // public patrimonioFrom: FormGroup;
  public patrimonioFrom: any;
  //#endregion
  //#region  carga variables comunicacion
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente´
  @Input() infoTabAllPatrimonio: any;
  @Input() OperacionActual: any;
  //#endregion
  //#region Funcionales variables
  public siguiente = false;
  public positionTab = 5;
  public SumaActivos = 0;
  public SumaPasivos = 0;
  public TotalPatrimonio = 0;
  public clienteSeleccionado: any;
  public EsProveedor: boolean = false;
  protected EditarFrom = false;
  public obligatoriCliente : any;
  public JuridicoEdit: any;
  //#endregion
  public patrimonioModel = new PatrimonioModel();
  constructor(private notif: NgxToastService,private juridicoService: JuridicosService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.IrArriba();
    this.validarPatrimonio();
    this.onChanges();
  }

  onChanges(): void {
    this.ValidarCamposCambiantes();
  };

  private ValidarCamposCambiantes() {
    this.patrimonioFrom.get('ActivosCorrientes').valueChanges.subscribe((val : any) => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.patrimonioFrom.get('ActivosNoCorrientes').valueChanges.subscribe((val : any) => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.patrimonioFrom.get('OtrosActivos').valueChanges.subscribe((val : any) => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.patrimonioFrom.get('ObligacionesFinancieras').valueChanges.subscribe((val : any) => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.patrimonioFrom.get('CuentaPorPagar').valueChanges.subscribe((val : any) => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.patrimonioFrom.get('OtrosPasivos').valueChanges.subscribe((val : any) => {
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
  GuardarPatrimonio() {
    if (this.infoTabAllPatrimonio.BasicosDto.IdRelacion === '15' && this.infoTabAllPatrimonio.BasicosDto.Proveedor ==='1' && this.patrimonioFrom.value.ActivosCorrientes === null
      || this.patrimonioFrom.value.ActivosCorrientes === undefined || this.patrimonioFrom.value.ActivosCorrientes === 0) {
      this.siguiente = true;
      this.emitEvent.emit(this.positionTab);
      this.infoTabAllPatrimonio.PatrimonioDto = {};
      this.IrArriba();
    } else {
      if (this.patrimonioFrom.valid) {
        this.siguiente = true;
        this.emitEvent.emit(this.positionTab);
        this.patrimonioModel.IdJuridicoPatrimonio = 0;
        this.patrimonioModel.IdTercero = 0;
        this.patrimonioModel.ActivosCorrientes = this.patrimonioFrom.value.ActivosCorrientes;
        this.patrimonioModel.ActivosNoCorrientes = this.patrimonioFrom.value.ActivosNoCorrientes;
        this.patrimonioModel.CuentasPorPagar = this.patrimonioFrom.value.CuentaPorPagar;
        this.patrimonioModel.ObligacionesFinancieras = this.patrimonioFrom.value.ObligacionesFinancieras;
        this.patrimonioModel.OtrosActivos = this.patrimonioFrom.value.OtrosActivos;
        this.patrimonioModel.OtrosPasivos = this.patrimonioFrom.value.OtrosPasivos;

        this.infoTabAllPatrimonio.PatrimonioDto = this.patrimonioModel;
        console.log(this.infoTabAllPatrimonio);
        this.IrArriba();
      } else {
        this.ValidarErrorForm(this.patrimonioFrom);
      }
    }
  }

  SumarActivos() {
      this.SumaActivos = 0;
      this.TotalPatrimonio = 0;

      this.SumaActivos = +this.patrimonioFrom.controls.ActivosCorrientes.value +
        +this.patrimonioFrom.controls.ActivosNoCorrientes.value +
        +this.patrimonioFrom.controls.OtrosActivos.value;
      this.TotalPatrimonio = +this.TotalPatrimonio + +this.SumaActivos - +this.SumaPasivos;
  }

  validValueActivoCorriente() {
    if (+this.patrimonioFrom.controls.ActivosCorrientes.value <= 0 && 
      this.patrimonioFrom.controls.ActivosCorrientes.value !== null && this.patrimonioFrom.controls.ActivosCorrientes.value !== undefined
      && this.patrimonioFrom.controls.ActivosCorrientes.value !== '') {
      this.notif.onWarning('Advertencia', 'El valor del campo activos corrientes debe ser mayor a 0.');
      this.patrimonioFrom.get('ActivosCorrientes').reset();
    }
  }

  SumarPasivos() {
    this.SumaPasivos = 0;
    this.TotalPatrimonio = 0;

    this.SumaPasivos = +this.patrimonioFrom.controls.ObligacionesFinancieras.value +
      +this.patrimonioFrom.controls.CuentaPorPagar.value +
      +this.patrimonioFrom.controls.OtrosPasivos.value;
    this.TotalPatrimonio = +this.TotalPatrimonio - +this.SumaPasivos + +this.SumaActivos;
  }

  limpiarFormulario() {
    this.patrimonioFrom.reset();
  }

  ActualizarPatrimonio() {
    if (this.patrimonioFrom.valid && this.EditarFrom) {
    
    if (+this.patrimonioFrom.controls.ActivosCorrientes.value <= 0 && 
      this.patrimonioFrom.controls.ActivosCorrientes.value !== null && this.patrimonioFrom.controls.ActivosCorrientes.value !== undefined
      && this.patrimonioFrom.controls.ActivosCorrientes.value !== '') {
      this.notif.onWarning('Advertencia', 'El valor del campo activos corrientes debe ser mayor a 0.');
      this.patrimonioFrom.get('ActivosCorrientes').reset();
    } else {
      this.patrimonioModel.IdJuridicoPatrimonio = this.patrimonioFrom.value.IdJuridicoPatrimonio;
      this.patrimonioModel.IdTercero = this.JuridicoEdit;
      this.patrimonioModel.ActivosCorrientes = this.patrimonioFrom.value.ActivosCorrientes;
      this.patrimonioModel.ActivosNoCorrientes = this.patrimonioFrom.value.ActivosNoCorrientes;
      this.patrimonioModel.CuentasPorPagar = this.patrimonioFrom.value.CuentaPorPagar;
      this.patrimonioModel.ObligacionesFinancieras = this.patrimonioFrom.value.ObligacionesFinancieras;
      this.patrimonioModel.OtrosActivos = this.patrimonioFrom.value.OtrosActivos;
      this.patrimonioModel.OtrosPasivos = this.patrimonioFrom.value.OtrosPasivos;
      this.GuardarLog(this.patrimonioModel, this.OperacionActual, 0, this.patrimonioModel.IdTercero,12);
      this.juridicoService.EditPatrimonioJuridico(this.patrimonioModel).subscribe(
        result => {
          if (result) {
            this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
            this.EditarFrom = false;
            this.IrArriba();
          }
        },
        error => {
          console.error('Error al realizar la actualizacion - juridicos: ' + error);
          this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
        });
    }
    } else {
      if (!this.EditarFrom) {
        this.notif.onWarning('Advertencia', 'Debe realizar algún cambio en el formulario.');
      }
      this.ValidarErrorForm(this.patrimonioFrom);
    }
  }

  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        // console.log(new Date, result);
      }
    );
  }
  //#endregion

  validarPatrimonio() {
    const IdJuridico = new FormControl('', []);
    const IdJuridicoPatrimonio = new FormControl('', []);
    const ActivosCorrientes = new FormControl('', [Validators.required]);
    const ActivosNoCorrientes = new FormControl('', [Validators.required]);
    const OtrosActivos = new FormControl('', [Validators.required]);
    const ObligacionesFinancieras = new FormControl('', [Validators.required]);
    const CuentaPorPagar = new FormControl('', [Validators.required]);
    const OtrosPasivos = new FormControl('', [Validators.required]);


    this.patrimonioFrom = new FormGroup({
      IdJuridico: IdJuridico,
      IdJuridicoPatrimonio: IdJuridicoPatrimonio,
      ActivosCorrientes: ActivosCorrientes,
      ActivosNoCorrientes: ActivosNoCorrientes,
      OtrosActivos: OtrosActivos,
      ObligacionesFinancieras: ObligacionesFinancieras,
      CuentaPorPagar: CuentaPorPagar,
      OtrosPasivos: OtrosPasivos,
    });


  }

  ValidarErrorForm(formulario: any) {
    Object.keys(formulario.controls).forEach(field => { // {1}
      const control = formulario.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
