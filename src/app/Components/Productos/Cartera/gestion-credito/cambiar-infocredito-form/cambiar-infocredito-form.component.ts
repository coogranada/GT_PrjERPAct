import { Component, ElementRef, EventEmitter, Injectable, Input, Output, ViewChild } from '@angular/core';
import { CambiarInfoCreditoContext, Novedad, Operacion } from '../../../../../Models/Productos/cartera/cambiar-tasa-context';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalcularDatosAlCambiarTasa, CalcularDatosReeliquidacion, CalcularDatosRequest, ConPlazo, ConTasa, ICambiarInfoCreditoForm, PeriodoPago, ResultCalcularCambioDatos } from '../../../../../Models/Productos/cartera/gestion-credito.model';
import { CarteraService } from '../../../../../Services/Productos/cartera.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PeriodoPagoEnum, TipoSistemas } from '../../../../../Models/Productos/cartera/gestion-credito.enum';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import { CommonModule } from '@angular/common';
import { ERROR_MESSAGES, PERIODOS_MESES, SISTEMAS } from '../../../../../utils/constants';
import { firstValueFrom, switchMap, tap } from 'rxjs';
import { PorcentajeDirective } from '../../../../shared/directives/porcentaje.directive';
import { diferenciaEnMeses } from '../../../../../utils/helpers';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ShareComponentModule } from '../../../../../Modules/share-component.module';
import { LoadingService } from '../../../../../Services/shared/loading.service';

@Component({
  selector: 'app-cambiar-infocredito-form',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, CurrencyMaskModule, PorcentajeDirective, ShareComponentModule],
  templateUrl: './cambiar-infocredito-form.component.html',
  styleUrl: './cambiar-infocredito-form.component.css'
})
@Injectable()
export class CambiarInfoCreditoForm {

  @Input() context!: CambiarInfoCreditoContext;
  @Output() close = new EventEmitter<void>();
  @Output() finalizar = new EventEmitter<{ idNovedad: number; idOperacion: string }>();

  @ViewChild('inputPuntos') inputPuntos!: ElementRef;
  @ViewChild('inputTasaNominal') inputTasaNominal!: ElementRef;
  @ViewChild('plazo') inputPlazo!: ElementRef;

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
  idNovedad: Novedad | undefined = undefined;
  plazos: number[] = [];
  sistemas = SISTEMAS;
  periodosPago: PeriodoPago[] = [];
  periodosPagoCapital: PeriodoPago[] = [];
  plazoCalculado: number | null = null;
  plazoMinimo: number | null = null;
  plazoMaximo: number | null = null;
  ejemplosPlazosValidos: number[] = [];

  get periodoCapitalMeses() {
    return PERIODOS_MESES[this.cambiarInfoCreditoForm.controls.periodoCapitalSelect.value as keyof typeof PERIODOS_MESES];
  }

  get periodoInteresMeses() {
    return PERIODOS_MESES[this.cambiarInfoCreditoForm.controls.periodoInteresSelect.value as keyof typeof PERIODOS_MESES];
  }

  get btnCalcularBloqueado(): boolean {
    if (this.context.operacion === Operacion.ReestructurarCambioPlazo && !this.esTasaVariable() && !this.plazoEsMultiploExacto) return true;
    if (this.yaCalculoPlazoCuotaVariable) return true;
    return !(this.cambiarInfoCreditoForm.dirty && this.cambiarInfoCreditoForm.valid);
  }

  get btnCalcularVisible(): boolean {
    return [Operacion.CambiarTasa, Operacion.CambiarPlazo, Operacion.CambiarSistema, Operacion.ReestructurarCambioPlazo].includes(this.context.operacion);
  }

  get btnActualizarBloqueado(): boolean {
    if (this.cambiarInfoCreditoForm.invalid) return true;
    if (this.context.operacion === Operacion.ReestructurarCambioPlazo && !this.esTasaVariable() && !this.plazoEsMultiploExacto) return true;
    if (this.yaCalculoPlazoCuotaVariable) return false;
    return this.btnActualizarBloqueadoManual || this.cambiarInfoCreditoForm.dirty;
  }

  get esCambiarSistema(): boolean {
    return this.context.operacion === Operacion.CambiarSistema
      || (
        this.context.operacion === Operacion.ReestructurarCambioPlazo
        && !this.esTasaVariable()
      );
  }

  get usaSelectPlazo(): boolean {
    return (this.context.operacion === Operacion.CambiarPlazo || this.context.operacion === Operacion.ReestructurarCambioPlazo) &&
      this.context.datosFormData.IdPeriodoCapital !== PeriodoPagoEnum.AlVencimiento &&
      (this.context.operacion === Operacion.CambiarPlazo && this.esCuotaVariable());
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

  get plazoEsMultiploExacto() {
    const plazo = this.cambiarInfoCreditoForm.controls.plazo.value;
    const idPeriodoCapital = this.cambiarInfoCreditoForm.controls.periodoCapitalSelect.value as keyof typeof PERIODOS_MESES;
    const idPeriodoInteres = this.cambiarInfoCreditoForm.controls.periodoInteresSelect.value as keyof typeof PERIODOS_MESES;
    if (idPeriodoCapital === PeriodoPagoEnum.AlVencimiento) {
      return true;
    }
    const mesesCapital = PERIODOS_MESES[idPeriodoCapital];
    const mesesInteres = PERIODOS_MESES[idPeriodoInteres];
    return plazo && (plazo * mesesInteres) % mesesCapital === 0;
  }

  constructor(
    private carteraService: CarteraService,
    private notif: ToastrService, 
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.periodosPago = this.context.periodosPago;
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
      periodoGracia: new FormControl({ value: this.context.datosFormData.PeriodoGracia, disabled: true }, [Validators.min(0), Validators.max(99)]),
      reestrucutradoIndicador: new FormControl({ value: 0, disabled: true }),
      acta: new FormControl<number | null>(null)
    });

    this.habilitarCampos(this.context.operacion);

    const { acta, plazo, sistemaSelect, periodoCapitalSelect, periodoInteresSelect, periodoGracia } = this.cambiarInfoCreditoForm.controls;

    acta?.valueChanges.subscribe(() => {
      // Evitar que marque dirty el form para que el boton calcular no se habilite
      acta?.markAsPristine();
    });

    plazo.valueChanges.subscribe(valor => {
      if (valor == null) return;
      const soloNumeros = +valor.toString().replace(/[^0-9]/g, '');
      if (valor !== soloNumeros) {
        plazo.setValue(soloNumeros, { emitEvent: false });
      }
    });

    const sistemaControl = this.cambiarInfoCreditoForm.controls.sistemaSelect;
    sistemaControl.valueChanges.subscribe(idSistema => {
      this.aplicarReglasSistema(idSistema);
      if (this.context.operacion === Operacion.ReestructurarCambioPlazo) {
        const perGraciaControl = this.cambiarInfoCreditoForm.controls.periodoGracia;
        perGraciaControl.setValue(this.context.datosFormData.PeriodoGracia, { emitEvent: false }); //Valor original
        plazo.setValue(this.context.datosFormData.Plazo, { emitEvent: false });
        perGraciaControl.enable();
        if (idSistema && this.esCuotaVariable(idSistema)) {
          perGraciaControl.setValue(0, { emitEvent: false });
          perGraciaControl.disable();
        }

        this.aplicarReglasPeriodosPlazo();
        this.yaCalculoPlazoCuotaVariable = false;
      }
    });

    periodoCapitalSelect.valueChanges.subscribe(idPeriodoCapital => {
      if (!this.periodosPagoInteres.some(p => p.IdFrecuenciaPago === periodoInteresSelect.value)) {
        periodoInteresSelect.reset(null);
      }

      if (this.context.operacion === Operacion.ReestructurarCambioPlazo) {
        this.aplicarReglasPeriodosPlazo(idPeriodoCapital);
      }
    });

    periodoInteresSelect.valueChanges.subscribe(idPeriodoInteres => {
      if (this.context.operacion === Operacion.ReestructurarCambioPlazo) {
        this.aplicarReglasPeriodosPlazo(undefined, idPeriodoInteres);
        this.yaCalculoPlazoCuotaVariable = false;
      }
    });

    periodoGracia.valueChanges.subscribe(valor => {
      if (valor == null) return;
      const soloNumeros = +valor.toString().replace(/[^0-9]/g, '');
      if (valor !== soloNumeros) {
        periodoGracia.setValue(soloNumeros, { emitEvent: false });
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

  esCuotaVariable(idSistema = this.context.datosFormData.IdSistema) {
    return idSistema === TipoSistemas.CuotaVariable || idSistema === TipoSistemas.CuotaVariableTasaVariable;
  }

  private aplicarReglasSistema(idSistema: number | null = this.context.datosFormData.IdSistema): void {
    const { periodoCapitalSelect, periodoInteresSelect } = this.cambiarInfoCreditoForm.controls;

    if (idSistema === TipoSistemas.CuotaFija) { //No es necesario validar el Cuota Fija Tasa Variable porque esos no se permiten cambiar sistema.
      periodoCapitalSelect.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
      periodoCapitalSelect.disable({ emitEvent: false });

      periodoInteresSelect.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
      periodoInteresSelect.disable({ emitEvent: false });

    } else if (idSistema === TipoSistemas.CuotaVariable) {
      periodoCapitalSelect.reset(null);
      periodoCapitalSelect.enable({ emitEvent: false });

      periodoInteresSelect.reset(null);
      periodoInteresSelect.enable({ emitEvent: false });

      if (this.context.operacion == Operacion.ReestructurarCambioPlazo) {
        periodoCapitalSelect.setValue(this.context.datosFormData.IdPeriodoCapital, { emitEvent: false });
        periodoInteresSelect.setValue(this.context.datosFormData.IdPeriodoInteres, { emitEvent: false });
        
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

  private aplicarReglasPeriodosPlazo(
    idPeriodoCapital = this.cambiarInfoCreditoForm.controls.periodoCapitalSelect.value,
    idPeriodoInteres = this.cambiarInfoCreditoForm.controls.periodoInteresSelect.value
  ) {
    if(!idPeriodoCapital || !idPeriodoInteres) return;

    const plazoControl = this.cambiarInfoCreditoForm.controls.plazo;
    const plazoMaximoLineaEnDias = this.context.detalleCredito.Encabezado.PlazoMaximoLinea!;
    let periodoCapitalMeses = PERIODOS_MESES[idPeriodoCapital as keyof typeof PERIODOS_MESES];
    const periodoInteresMeses = PERIODOS_MESES[idPeriodoInteres as keyof typeof PERIODOS_MESES];

    if(idPeriodoCapital === PeriodoPagoEnum.AlVencimiento) {
      periodoCapitalMeses = periodoInteresMeses;
    }

    const validators = [];
    const maximoMeses = plazoMaximoLineaEnDias / 30;
    const maximoPeriodoInteres = maximoMeses / periodoInteresMeses;
    this.plazoMaximo = maximoPeriodoInteres;
    validators.push(Validators.max(this.plazoMaximo));

    const plazoFaltanteMeses = diferenciaEnMeses(new Date(), this.context.detalleCredito.fechaVencimiento);
    const minimoMeses = Math.ceil((plazoFaltanteMeses + 1) / periodoCapitalMeses) * periodoCapitalMeses;
    const minimoPeriodosInteres = minimoMeses / periodoInteresMeses;

    this.plazoMinimo = minimoPeriodosInteres;
    validators.push(Validators.min(this.plazoMinimo));
    plazoControl.setValidators(validators);
    plazoControl.updateValueAndValidity();
  }

  private habilitarEdicionTasa() {
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
  }

    habilitarCampos(operacion: Operacion) {
    switch (operacion) {
      case Operacion.CambiarTasa:
        this.idNovedad = Novedad.CambiarTasa;
        this.habilitarEdicionTasa();
        break;
      case Operacion.CambiarCuota:
        this.idNovedad = Novedad.CambiarCuota;
        this.onCalcular();
        break;

      case Operacion.CambiarPlazo:
        this.idNovedad = Novedad.CambiarPlazo;
        this.loading.show()
        this.carteraService.getNuevoPlazo(this.context.detalleCredito.Encabezado.IdCuenta).subscribe({
          next: (result) => {
            this.loading.hide()
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
            this.loading.hide()
          }
        })

        break;
      case Operacion.CambiarSistema:
        this.idNovedad = Novedad.CambiarSistema;
        this.loading.show()

        this.loading.hide()
        const hoy = new Date();
        const plazoFaltanteMeses = diferenciaEnMeses(hoy, this.context.detalleCredito.fechaVencimiento);
        this.aplicarMaximoPeriodoCapital(plazoFaltanteMeses);
        this.aplicarReglasSistema();
        break;

      case Operacion.ReestructurarCambioPlazo:
        this.idNovedad = Novedad.CambiarPlazo;
        const idCuenta = this.context.detalleCredito.Encabezado.IdCuenta;
        this.periodosPagoCapital = this.periodosPago;

        this.loading.show()
        this.carteraService.getReestructuracionReliquidacion(idCuenta).subscribe({
          next: result => {
            this.loading.hide()

            if (result?.Reestructuracion && result.Reestructuracion.length) {
              result.Reestructuracion.sort((a, b) => b.Contador - a.Contador);
              const contadorReestructuracion = result.Reestructuracion[0].Contador;
              this.cambiarInfoCreditoForm.controls.reestrucutradoIndicador.setValue(contadorReestructuracion);
            }

            this.aplicarReglasSistema();
            this.aplicarReglasPeriodosPlazo(this.context.datosFormData.IdPeriodoCapital, this.context.datosFormData.IdPeriodoInteres);
            const plazoControl = this.cambiarInfoCreditoForm.controls.plazo;
            plazoControl.enable();
            this.inputPlazo.nativeElement.select();
            if (!this.esCuotaVariable()) this.cambiarInfoCreditoForm.controls.periodoGracia.enable();

            this.cambiarInfoCreditoForm.markAsDirty();
          },
          error: err => console.error(err)
        });
        break;

    }
  }

  private convertirDiasAPeriodos(dias: number, idPeriodoInteres: number) {
    return dias / (PERIODOS_MESES[idPeriodoInteres as keyof typeof PERIODOS_MESES] * 30); 
  }


  private generarMultiplos(desde: number, multiplo: number) { 
    const multiploInferior = Math.ceil(desde / multiplo) * multiplo;
    return [multiploInferior, multiploInferior + multiplo * 1, multiploInferior + multiplo * 2];
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

  private validarCambiarPlazo(): boolean {
    const plazoOriginal = this.context.datosFormData.Plazo;
    const plazo = this.plazoSeleccionado;
    if (plazoOriginal == plazo) {
      this.notif.warning('Advertencia', 'Debe cambiar plazo.', ConfiguracionNotificacion.configRightTop);
      return false;
    };
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

  private validarReestructurar() {
    const {
      IdPeriodoCapital: idPerCapOriginal,
      IdPeriodoInteres: idPerIntOriginal,
      IdSistema: idSisOriginal,
      PeriodoGracia: perGraciaOriginal,
      Plazo: plazoOriginal
    } = this.context.datosFormData;
    const idPerCap = this.cambiarInfoCreditoForm.controls.periodoCapitalSelect.value;
    const idPerInt = this.cambiarInfoCreditoForm.controls.periodoInteresSelect.value;
    const idSistema = this.cambiarInfoCreditoForm.controls.sistemaSelect.value;
    const periodoGracia = this.cambiarInfoCreditoForm.controls.periodoGracia.value;
    const plazo = this.cambiarInfoCreditoForm.controls.plazo.value;

    if (!this.esTasaVariable()) {

      if (!idSistema) {
        this.notif.warning('Advertencia', 'Debe seleccionar sistema.', ConfiguracionNotificacion.configRightTop);
        return false;
      }

      if (!idPerCap || !idPerInt) {
        this.notif.warning('Advertencia', 'Debe seleccionar periodos.', ConfiguracionNotificacion.configRightTop);
        return false;
      }
    }

    // if (
    //   idSisOriginal == idSistema 
    //   && idPerCapOriginal == idPerCap 
    //   && idPerIntOriginal == idPerInt 
    //   && perGraciaOriginal == periodoGracia
    //   && plazoOriginal == plazo
    // ) {
    //   this.notif.warning('Advertencia', 'Debe cambiar datos.', ConfiguracionNotificacion.configRightTop);
    //   return false;
    // }

    return true;
  }


  private async getDatosCalculados(valor?: CalcularDatosReeliquidacion) {
    const idCuenta = this.context.detalleCredito.Encabezado.IdCuenta;
    const idNovedad = this.idNovedad;
    if (!idCuenta || !idNovedad) return;

    this.dtoParaCalcular = { idCuenta, idNovedad, ...valor };

    try {
      this.loading.show();
      const result = await firstValueFrom(this.carteraService.calcularCambioDatos(this.dtoParaCalcular));
      this.loading.hide();
      this.datosCalculados = result;
      return result;
    } catch (error: any) {
      console.log(error);
      this.loading.hide();
      const mensajeError = ERROR_MESSAGES[error.ErrorCode as keyof typeof ERROR_MESSAGES]
      if (error?.ErrorCode && mensajeError) {
        this.notif.warning('Advertencia', mensajeError, ConfiguracionNotificacion.configRightTop);
      } else {
        this.notif.error('Error', 'Ocurrió un error inesperado', ConfiguracionNotificacion.configRightTop);
      }

      return null;
    }
  }

  private async getDatosCalculadosReest(valor: ConPlazo | ConTasa) {
    const idCuenta = this.context.detalleCredito.Encabezado.IdCuenta;
    const idNovedad = this.idNovedad;
    if (!idCuenta || !idNovedad) return;
    this.dtoParaCalcular = { idCuenta, idNovedad, ...valor };
    
    try {
      this.loading.show();
      const result = await firstValueFrom(this.carteraService.calcularCambioReestructuracion(this.dtoParaCalcular));
      this.loading.hide();
      this.datosCalculados = result;
      return result;
    } catch (error: any) {
      console.log(error);
      this.loading.hide();
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

    let valorDisparadorDelCambio: CalcularDatosAlCambiarTasa | null = null;

    if (key === 'tasaNominal') {
      value = value / 100;
      valorDisparadorDelCambio = { tasaNominal: value }
    } else {
      valorDisparadorDelCambio = { puntos: value }
    }

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
    const plazo = this.plazoSeleccionado;
    if (plazo == null) return;
    const result = await this.getDatosCalculados({ plazo });
    if (!result) return;

    this.mapearDatosCalculados(['cuota', 'plazo', 'monto', 'periodoGracia']);
    this.btnActualizarBloqueadoManual = false;
    if (this.esCuotaVariable()) this.yaCalculoPlazoCuotaVariable = true;
  }

  async calcularDatosPlazoRestructuracion() {
    const {
      sistemaSelect: idSistema,
      periodoCapitalSelect: idPeriodoCapital,
      periodoInteresSelect: idPeriodoInteres,
      periodoGracia,
      plazo
    } = this.cambiarInfoCreditoForm.getRawValue();
    if (!plazo) return;

    let datosParaCalcular: ConPlazo = { plazo, periodoGracia: periodoGracia! };

    if(!this.esTasaVariable() && idSistema && idPeriodoCapital && idPeriodoInteres) 
      datosParaCalcular = { ...datosParaCalcular, idSistema, idPeriodoCapital, idPeriodoInteres };

    const result = await this.getDatosCalculadosReest(datosParaCalcular);
    if (!result) return;
    this.mapearDatosCalculados(['cuota', 'monto']);
    this.btnActualizarBloqueadoManual = false;
    if (this.esCuotaVariable(idSistema!)) this.yaCalculoPlazoCuotaVariable = true;

  }

  async onCalcular() {
    if (!this.context.operacion) return;

    switch (this.context.operacion) {
      case Operacion.CambiarTasa:
        await this.calcularDatosAlCambiarTasa();
        break;
      case Operacion.CambiarCuota:
        await this.calcularDatosAlCambiarCuota();
        break;
      case Operacion.CambiarPlazo:
        if (!this.validarCambiarPlazo()) return;
        await this.calcularDatosAlCambiarPlazo();
        break;
      case Operacion.CambiarSistema:
        if (!this.validarCambioSistema()) return;
        const idSistema = this.cambiarInfoCreditoForm.controls.sistemaSelect.value!;
        const idPeriodoCapital = this.cambiarInfoCreditoForm.controls.periodoCapitalSelect.value!;
        const idPeriodoInteres = this.cambiarInfoCreditoForm.controls.periodoInteresSelect.value!;
        const result = await this.getDatosCalculados({ idSistema, idPeriodoCapital, idPeriodoInteres });
        if (!result) return;
        this.mapearDatosCalculados(['cuota', 'plazo', 'monto', 'periodoGracia']);
        this.btnActualizarBloqueadoManual = false;
        break;
      case Operacion.ReestructurarCambioPlazo:
        if (!this.validarReestructurar()) return;
        await this.calcularDatosPlazoRestructuracion();
        break;
    }
  }

  onActualizar() {
    if (!this.dtoParaCalcular) return;

    if (this.context.operacion === Operacion.ReestructurarCambioPlazo) {
      const { acta, plazo } = this.cambiarInfoCreditoForm.value;
      if (!acta) {
        this.notif.warning('Advertencia', 'Debe diligenciar acta.', ConfiguracionNotificacion.configRightTop);
        return;
      }

      if (!plazo) {
        this.notif.warning('Advertencia', 'Debe diligenciar plazo.', ConfiguracionNotificacion.configRightTop);
        return;
      }

      this.dtoParaCalcular = { ...this.dtoParaCalcular, plazo };

      this.loading.show();
      this.carteraService.actualizarCreditoReest({ ...this.dtoParaCalcular, acta }).subscribe({
        next: () => {
          this.finalizar.emit({ idNovedad: this.idNovedad!, idOperacion: this.context.operacion });
          this.loading.hide();
          this.close.emit();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.loading.hide();
        }
      });

      return;
    }

    switch (this.context.operacion) {
      case Operacion.CambiarCuota:
        if (!this.validarCambiarCuotaAlActualizar()) return;
        break;
      case Operacion.CambiarPlazo:
        if (!this.validarCambiarPlazo()) return;
        if (this.esCuotaVariable() && this.plazoSeleccionado) {
          const { idCuenta } = this.dtoParaCalcular;
          this.dtoParaCalcular = { idNovedad: Novedad.CambiarPlazo, idCuenta, plazo: this.plazoSeleccionado };
        }

        break;
    }

    this.loading.show();
    this.carteraService.actualizarCredito(this.dtoParaCalcular).subscribe({
      next: () => {
        this.finalizar.emit({ idNovedad: this.idNovedad!, idOperacion: this.context.operacion });
        this.loading.hide();
        this.close.emit();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
        this.loading.hide();
      }
    })
  }

}
