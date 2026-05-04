import { Component, ElementRef, EventEmitter, Injectable, Input, Output, ViewChild } from '@angular/core';
import { CambiarInfoCreditoContext, Novedad, Operacion } from '../../../../../Models/Productos/cartera/cambiar-tasa-context';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalcularDatosRequest, ICambiarInfoCreditoForm, PeriodoPago, ResultCalcularCambioDatos } from '../../../../../Models/Productos/cartera/gestion-credito.model';
import { CarteraService } from '../../../../../Services/Productos/cartera.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxCurrencyDirective } from 'ngx-currency';
import { PeriodoPagoEnum, TipoSistemas } from '../../../../../Models/Productos/cartera/gestion-credito.enum';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import { CommonModule } from '@angular/common';
import { ERROR_MESSAGES, PERIODOS_MESES, SISTEMAS } from '../../../../../utils/constants';
import { firstValueFrom, of, switchMap, tap } from 'rxjs';
import { PorcentajeDirective } from '../../../../shared/directives/porcentaje.directive';
import { diferenciaEnMeses } from '../../../../../utils/helpers';

@Component({
  selector: 'app-cambiar-infocredito-form',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, NgxCurrencyDirective, CommonModule, PorcentajeDirective],
  templateUrl: './cambiar-infocredito-form.component.html',
  styleUrl: './cambiar-infocredito-form.component.css'
})
@Injectable()
export class CambiarInfoCreditoForm {

  @Input() context!: CambiarInfoCreditoContext;
  @Output() close = new EventEmitter<void>();
  @Output() finalizar = new EventEmitter<number>();

  @ViewChild('inputPuntos') inputPuntos!: ElementRef;
  @ViewChild('inputTasaNominal') inputTasaNominal!: ElementRef;
  @ViewChild('plazo') inputPlazo!: ElementRef;

  loading = false;
  btnActualizarBloqueadoManual = true;
  yaCalculoPlazoCuotaVariable = false;
  valorOriginalTasa: number | null = null;
  valorOriginalPuntos: number | null = null;
  cambiarInfoCreditoForm!: FormGroup<ICambiarInfoCreditoForm>;
  percentOptions = {
    prefix: '',
    suffix: ' %',
    thousands: '',
    decimal: '.',
    precision: 4,
    allowNegative: false
  };

  currencyOptions = {
    prefix: '$',
    thousands: ',',
    decimal: '.',
    precision: 2,
    allowNegative: false
  };

  dtoParaCalcular: CalcularDatosRequest | null = null;
  datosCalculados: ResultCalcularCambioDatos | null = null;
  idNovedad: number | undefined = undefined;
  plazos: number[] = [];
  sistemas = SISTEMAS;
  periodosPago: PeriodoPago[] = [];
  periodosPagoCapital: PeriodoPago[] = [];
  plazoCalculado: number | null = null;


  get btnCalcularBloqueado(): boolean {
    if (this.yaCalculoPlazoCuotaVariable) return true;
    return !(this.cambiarInfoCreditoForm.dirty && this.cambiarInfoCreditoForm.valid);
  }

  get btnCalcularVisible(): boolean {
    return [Operacion.CambiarTasa, Operacion.CambiarPlazo, Operacion.CambiarSistema].includes(this.context.operacion);
  }

  get btnActualizarBloqueado(): boolean {
    if (this.cambiarInfoCreditoForm.invalid) return true;
    if (this.yaCalculoPlazoCuotaVariable) return false;
    return this.btnActualizarBloqueadoManual || this.cambiarInfoCreditoForm.dirty;
  }

  get esCambiarSistema(): boolean {
    return this.context.operacion === Operacion.CambiarSistema;
  }

  get usaSelectPlazo(): boolean {
    return this.context.operacion === Operacion.CambiarPlazo &&
      this.context.datosFormData.IdPeriodoCapital !== PeriodoPagoEnum.AlVencimiento &&
      this.esCuotaVariable();
  }

  get plazoSeleccionado() {
    return this.usaSelectPlazo
      ? this.cambiarInfoCreditoForm.controls.plazoSelect.value
      : this.cambiarInfoCreditoForm.controls.plazo.value;
  }

  get periodosPagoInteres(): PeriodoPago[] {
    const idPeriodoCapitalActual = this.cambiarInfoCreditoForm.controls.periodoCapitalSelect.value;
    if (idPeriodoCapitalActual == null) return [];
    if (idPeriodoCapitalActual === PeriodoPagoEnum.AlVencimiento) return this.periodosPagoCapital.filter(p => p.IdFrecuenciaPago !== PeriodoPagoEnum.AlVencimiento);

    const mesesCapital = PERIODOS_MESES[idPeriodoCapitalActual as keyof typeof PERIODOS_MESES];
    return this.periodosPagoCapital.filter(p => {
      const meses = PERIODOS_MESES[p.IdFrecuenciaPago as keyof typeof PERIODOS_MESES];
      if (!meses || !mesesCapital) return false;
      return meses <= mesesCapital && mesesCapital % meses === 0;
    });
  }

  constructor(
    private carteraService: CarteraService,
    private notif: ToastrService
  ) { }

  ngOnInit() {
    const maxTasaNominal = this.context.detalleCredito.Encabezado.TasaLinea;
    let tasaNominal = this.context.datosFormData.TasaPactada;
    let tasaEfectiva = this.context.datosFormData.EfectivaPactada;
    if (this.context.operacion == Operacion.CambiarTasa) {
      tasaNominal = this.context.datosFormData.TasaLiquidada;
      tasaEfectiva = this.context.datosFormData.EfectivaLiquidada;
    }

    this.cambiarInfoCreditoForm = new FormGroup({
      sistema: new FormControl({ value: this.context.datosFormData.Sistema, disabled: true }),
      sistemaSelect: new FormControl(this.context.datosFormData.IdSistema),
      periodoCapital: new FormControl({ value: this.context.datosFormData.PeriodoCapital, disabled: true }),
      periodoCapitalSelect: new FormControl<number | null>({ value: null, disabled: true }),
      periodoInteres: new FormControl({ value: this.context.datosFormData.PeriodoInteres, disabled: true }),
      periodoInteresSelect: new FormControl<number | null>({ value: null, disabled: true }),
      monto: new FormControl({ value: this.context.detalleCredito.monto, disabled: true }),
      tasaNominal: new FormControl({ value: tasaNominal, disabled: true }, [Validators.min(0), Validators.max(maxTasaNominal)]),
      tasaEfectiva: new FormControl({ value: tasaEfectiva, disabled: true }),
      plazo: new FormControl({ value: this.context.datosFormData.Plazo, disabled: true }, [Validators.required, Validators.min(1)]),
      plazoSelect: new FormControl({ value: 0, disabled: true }),
      cuota: new FormControl({ value: this.context.detalleCredito.cuota, disabled: true }),
      indicador: new FormControl({ value: this.context.datosFormData.Indicador, disabled: true }),
      siglaIndicador: new FormControl({ value: this.context.datosFormData.SiglaIndicador, disabled: true }),
      puntos: new FormControl({ value: this.context.datosFormData.Puntos, disabled: true }, [Validators.min(0), Validators.max(99)]),
      periodoGracia: new FormControl({ value: this.context.datosFormData.PeriodoGracia, disabled: true })
    });

    this.habilitarCampos(this.context.operacion);

    const plazoInputControl = this.cambiarInfoCreditoForm.controls.plazo;
    plazoInputControl.valueChanges.subscribe(valor => {
      if (valor == null) return;
      const soloNumeros = +valor.toString().replace(/[^0-9]/g, '');
      if (valor !== soloNumeros) {
        plazoInputControl.setValue(soloNumeros, { emitEvent: false });
      }
    });


    const sistemaControl = this.cambiarInfoCreditoForm.controls.sistemaSelect;
    sistemaControl.valueChanges.subscribe(idSistema => {
      this.aplicarReglasSistema(idSistema);
    });

    const periodoCapitalControl = this.cambiarInfoCreditoForm.controls.periodoCapitalSelect;
    periodoCapitalControl.valueChanges.subscribe(() => {
      const periodoInteres = this.cambiarInfoCreditoForm.controls.periodoInteresSelect;
      if (!this.periodosPagoInteres.some(p => p.IdFrecuenciaPago === periodoInteres.value)) {
        periodoInteres.reset(null);
      }
    });

  }

  onCancelar() {
    this.close.emit();
  }

  esTasaVariable() {
    const idTipoSistema = this.context.datosFormData.IdSistema;
    return idTipoSistema === TipoSistemas.CuotaFijaTasaVariable || idTipoSistema === TipoSistemas.CuotaVariableTasaVariable;
  }

  esCuotaVariable() {
    const idTipoSistema = this.context.datosFormData.IdSistema;
    return idTipoSistema === TipoSistemas.CuotaVariable || idTipoSistema === TipoSistemas.CuotaVariableTasaVariable;
  }

  private aplicarReglasSistema(idSistema: number | null = this.context.datosFormData.IdSistema): void {
    const { periodoCapitalSelect, periodoInteresSelect } = this.cambiarInfoCreditoForm.controls;

    if (idSistema === TipoSistemas.CuotaFija) {
      periodoCapitalSelect.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
      periodoCapitalSelect.disable({ emitEvent: false });

      periodoInteresSelect.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
      periodoInteresSelect.disable({ emitEvent: false });

    } else if (idSistema === TipoSistemas.CuotaVariable) {
      periodoCapitalSelect.reset(null);
      periodoCapitalSelect.enable({ emitEvent: false });

      periodoInteresSelect.reset(null);
      periodoInteresSelect.enable({ emitEvent: false });

      if (this.context.datosFormData.IdSistema === TipoSistemas.CuotaFija) {
        this.sistemas = this.sistemas.filter(sis => sis.id === TipoSistemas.CuotaVariable);
      }
    }
  }

  private aplicarMaximoPeriodoCapital(plazoFaltanteMeses: number) {
    this.periodosPagoCapital = this.periodosPago.filter(p => {
      if (p.IdFrecuenciaPago === PeriodoPagoEnum.AlVencimiento) return true;

      const periodoMes = PERIODOS_MESES[p.IdFrecuenciaPago as keyof typeof PERIODOS_MESES];
      if (!periodoMes) return false;

      return plazoFaltanteMeses >= periodoMes;
    });
  }

  habilitarCampos(operacion: Operacion) {
    switch (operacion) {
      case Operacion.CambiarTasa:
        this.idNovedad = Novedad.CambiarTasa;
        if (this.context.datosFormData.Indicador?.trim()) {
          this.cambiarInfoCreditoForm.controls.puntos.enable();
          setTimeout(() => {
            this.inputPuntos.nativeElement.focus();
            this.inputPuntos.nativeElement.setSelectionRange(0, 0);
          });
        } else {
          this.cambiarInfoCreditoForm.controls.tasaNominal.enable();
          setTimeout(() => {
            this.inputTasaNominal.nativeElement.focus();
            this.inputTasaNominal.nativeElement.setSelectionRange(0, 0);
          });
        }

        break;
      case Operacion.CambiarCuota:
        this.idNovedad = Novedad.CambiarCuota;
        this.onCalcular();
        break;

      case Operacion.CambiarPlazo:
        this.idNovedad = Novedad.CambiarPlazo;
        this.loading = true;
        this.carteraService.getNuevoPlazo(this.context.detalleCredito.Encabezado.IdCuenta).subscribe({
          next: (result) => {
            this.loading = false;
            if (!result) return;
            this.plazos = result;
            if (this.usaSelectPlazo) {
              this.plazos = this.plazos.sort((a, b) => b - a).filter(p => p != this.context.datosFormData.Plazo);
              const plazoControl = this.cambiarInfoCreditoForm.controls.plazoSelect;
              plazoControl.setValue(this.plazos[0]);
              plazoControl.enable();
            } else {
              const plazoControl = this.cambiarInfoCreditoForm.controls.plazo;
              const nuevoPlazo = this.plazos[0];
              plazoControl.setValue(nuevoPlazo);
              plazoControl.enable();
              plazoControl.addValidators([Validators.max(nuevoPlazo)]);
              plazoControl.updateValueAndValidity();
              this.inputPlazo.nativeElement.select();
            }
            this.cambiarInfoCreditoForm.markAsDirty();

          },
          error: (error: HttpErrorResponse) => {
            console.log(error)
            this.loading = false;
          }
        })

        break;
      case Operacion.CambiarSistema:
        this.idNovedad = Novedad.CambiarSistema;
        this.loading = true;

        this.carteraService.getPeriodosPago().subscribe({
          next: periodos => {
            this.loading = false;
            this.periodosPago = periodos;
            const hoy = new Date();
            const plazoFaltanteMeses = diferenciaEnMeses(hoy, this.context.detalleCredito.fechaVencimiento);
            this.aplicarMaximoPeriodoCapital(plazoFaltanteMeses);
            this.aplicarReglasSistema();
          },
          error: err => console.error(err)
        });

        // const getPeriodos$ = this.periodosPago.length === 0
        //   ? this.carteraService.getPeriodosPago()
        //   : of(this.periodosPago);

        // getPeriodos$.pipe(
        //   tap(periodos => this.periodosPago = periodos),
        //   switchMap(() =>
        //     this.carteraService.getNuevoPlazo(this.context.detalleCredito.Encabezado.IdCuenta)
        //   )
        // ).subscribe({
        //   next: result => {
        //     this.loading = false;
        //     const hoy = new Date();
        //     const plazoFaltanteMeses = diferenciaEnMeses(hoy, this.context.detalleCredito.fechaVencimiento);
        //     this.aplicarMaximoPeriodoCapital(plazoFaltanteMeses);
        //     this.aplicarReglasSistema();
        //   },
        //   error: err => console.error(err)
        // });
        break;

    }
  }


  private validarCambioTasa(): boolean {
    const tasaNominalOriginal = this.context.datosFormData.TasaLiquidada;
    const puntosOriginal = this.context.datosFormData.Puntos;

    const tasaNominal = this.cambiarInfoCreditoForm.controls.tasaNominal.value;
    const puntos = this.cambiarInfoCreditoForm.controls.puntos.value;

    if (this.cambiarInfoCreditoForm.controls.tasaNominal.enabled && tasaNominalOriginal === tasaNominal) {
      this.notif.warning('Advertencia', 'Debe cambiar la tasa nominal.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    if (this.cambiarInfoCreditoForm.controls.puntos.enabled && puntosOriginal === puntos) {
      this.notif.warning('Advertencia', 'Debe cambiar los puntos.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    return true;
  }

  private validarCambiarCuotaAlActualizar(): boolean {
    const cuotaOriginal = this.context.detalleCredito.cuota;
    const nuevaCuota = this.cambiarInfoCreditoForm.controls.cuota.value;

    if (cuotaOriginal === nuevaCuota) {
      this.notif.warning('Advertencia', 'Debe cambiar cuota.', ConfiguracionNotificacion.configRightTop);
      return false;
    }
    return true;
  }

  private validarCambioSistema(): boolean {
    const { IdPeriodoCapital: idPerCapOriginal, IdPeriodoInteres: idPerIntOriginal, IdSistema: idSisOriginal } = this.context.datosFormData;
    const idPerCap = this.cambiarInfoCreditoForm.controls.periodoCapitalSelect.value;
    const idPerInt = this.cambiarInfoCreditoForm.controls.periodoInteresSelect.value;
    const idSistema = this.cambiarInfoCreditoForm.controls.sistemaSelect.value;

    if (!idSistema) {
      this.notif.warning('Advertencia', 'Debe seleccionar sistema.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    if (!idPerCap || !idPerInt) {
      this.notif.warning('Advertencia', 'Debe seleccionar periodos.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    if (idSisOriginal == idSistema && idPerCapOriginal == idPerCap && idPerIntOriginal == idPerInt) {
      this.notif.warning('Advertencia', 'Debe cambiar sistema o periodos.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    return true;
  }

  private async getDatosCalculados(valor?: Partial<CalcularDatosRequest>) {
    const idCuenta = this.context.detalleCredito.Encabezado.IdCuenta;
    const idNovedad = this.idNovedad;
    if (!idCuenta || !idNovedad) return;

    this.dtoParaCalcular = { idCuenta, idNovedad, ...valor };

    try {
      this.loading = true;
      const result = await firstValueFrom(this.carteraService.calcularCambioDatos(this.dtoParaCalcular));
      this.loading = false;
      this.datosCalculados = result;
      return result;
    } catch (error: any) {
      console.log(error);
      this.loading = false;
      const mensajeError = ERROR_MESSAGES[error.ErrorCode as keyof typeof ERROR_MESSAGES]
      if (error?.ErrorCode && mensajeError) {
        this.notif.warning('Advertencia', mensajeError, ConfiguracionNotificacion.configRightTop);
      } else {
        this.notif.error('Error', 'Ocurrió un error inesperado', ConfiguracionNotificacion.configRightTop);
      }

      return null;
    }
  }

  private keyMap = {
    tasaEfectiva: 'TasaEfectiva',
    tasaNominal: 'TasaNominal',
    cuota: 'Cuota',
    plazo: 'Plazo',
    monto: 'Monto',
    periodoGracia: 'MesesGraciaCalculada',
  } as const;

  private mapearDatosCalculados(keys: (keyof typeof this.keyMap)[]) {
    this.cambiarInfoCreditoForm.markAsPristine();
    keys.forEach((key) => {
      if (this.datosCalculados) {
        const control = this.cambiarInfoCreditoForm.get(key);
        const value = this.datosCalculados[this.keyMap[key]];

        if (control && value !== undefined) {
          control.setValue(value);
        }
      }
    });
  }

  async calcularDatosAlCambiarTasa() {
    if (!this.validarCambioTasa()) return;
    const form = this.cambiarInfoCreditoForm.controls;
    const key = form.tasaNominal.enabled ? 'tasaNominal' : 'puntos';
    let value = form[key].value;

    if (value == null) return;

    if (key === 'tasaNominal') value = value / 100;

    const valorDisparadorDelCambio = { [key]: value };
    const result = await this.getDatosCalculados(valorDisparadorDelCambio);
    if (!result) return;
    this.mapearDatosCalculados(['cuota', 'plazo', 'monto', 'periodoGracia', 'tasaEfectiva', 'tasaNominal']);
    this.btnActualizarBloqueadoManual = false;
  }

  async calcularDatosAlCambiarCuota() {
    const result = await this.getDatosCalculados();
    if (!result) return;
    this.mapearDatosCalculados(['cuota', 'plazo', 'monto', 'periodoGracia']);
    this.btnActualizarBloqueadoManual = false;
  }

  async calcularDatosAlCambiarPlazo() {
    const plazo = this.cambiarInfoCreditoForm.controls.plazo.value;
    if (plazo == null) return;
    const result = await this.getDatosCalculados({ plazo });
    if (!result) return;

    this.mapearDatosCalculados(['cuota', 'plazo', 'monto', 'periodoGracia']);
    this.btnActualizarBloqueadoManual = false;
    if (this.esCuotaVariable()) this.yaCalculoPlazoCuotaVariable = true;
  }

  async onCalcular() {
    if (!this.idNovedad) return;

    switch (this.idNovedad) {
      case Novedad.CambiarTasa:
        await this.calcularDatosAlCambiarTasa();
        break;
      case Novedad.CambiarCuota:
        await this.calcularDatosAlCambiarCuota();
        break;
      case Novedad.CambiarPlazo:
        await this.calcularDatosAlCambiarPlazo();
        break;
      case Novedad.CambiarSistema:
        if (!this.validarCambioSistema()) return;
        const idSistema = this.cambiarInfoCreditoForm.controls.sistemaSelect.value!;
        const idPeriodoCapital = this.cambiarInfoCreditoForm.controls.periodoCapitalSelect.value!;
        const idPeriodoInteres = this.cambiarInfoCreditoForm.controls.periodoInteresSelect.value!;
        const result = await this.getDatosCalculados({ idSistema, idPeriodoCapital, idPeriodoInteres });
        if (!result) return;
        this.mapearDatosCalculados(['cuota', 'plazo', 'monto', 'periodoGracia']);
        this.btnActualizarBloqueadoManual = false;
        break;
    }
  }

  onActualizar() {
    if (!this.dtoParaCalcular) return;

    switch (this.idNovedad) {
      case Novedad.CambiarCuota:
        if (!this.validarCambiarCuotaAlActualizar()) return;
        break;
      case Novedad.CambiarPlazo:
        const plazoOriginal = this.context.datosFormData.Plazo;
        const plazo = this.usaSelectPlazo
          ? this.cambiarInfoCreditoForm.controls.plazoSelect.value
          : this.cambiarInfoCreditoForm.controls.plazo.value;
        if (plazoOriginal == plazo) {
          this.notif.warning('Advertencia', 'Debe cambiar plazo.', ConfiguracionNotificacion.configRightTop);
          return
        };

        if (this.esCuotaVariable() && plazo) {
          const { idCuenta } = this.dtoParaCalcular;
          this.dtoParaCalcular = { idNovedad: Novedad.CambiarPlazo, idCuenta, plazo };
        }

        break;
    }

    this.loading = true;
    this.carteraService.actualizarCredito(this.dtoParaCalcular).subscribe({
      next: () => {
        this.finalizar.emit(this.idNovedad);
        this.loading = false;
        this.close.emit();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
        this.loading = false;
      }
    })
  }

}
