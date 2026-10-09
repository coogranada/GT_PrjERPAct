import { Component, effect, ElementRef, inject, input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarteraService } from '../../../../../Services/Productos/cartera.service';
import { PeriodoPago } from '../../../../../Models/Productos/cartera/gestion-credito.model';
import { PeriodoPagoEnum, TipoSistemas } from '../../../../../Models/Productos/cartera/gestion-credito.enum';
import { Asesor, NegociacionForm } from '../../../../../Models/Creditos/GestionCredito/gestion-credito.model';
import { ShareComponentModule } from '../../../../../Modules/share-component.module';
import { AsesoriaTerminoService } from '../../../../../Services/Productos/asesoriaTermino.service';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { GestionCreditoService } from '../../../../../Services/Productos/GestionCredito.service';
import { concatWithSpace } from '../../../../../utils/helpers';
import { PorcentajeDirective } from '../../../../shared/directives/porcentaje.directive';
import { CommonModule } from '@angular/common';
import { PERIODOS_MESES, SISTEMAS } from '../../../../../Models/Creditos/GestionCredito/gestion-credito-constants';

@Component({
  selector: 'app-tab-negociacion',
  imports: [CommonModule, ReactiveFormsModule, ShareComponentModule, PorcentajeDirective],
  templateUrl: './tab-negociacion.component.html',
  styleUrl: './tab-negociacion.component.css',
  providers: [AsesoriaTerminoService, GestionCreditoService]
})
export class TabNegociacionComponent {

  idAsesoria = input<number | null>();
  deducciones = input<number | null>();
  saldoCancelar = input<number | null>();
  desembolso = 0;

  sistemas = SISTEMAS;
  private readonly fb = inject(FormBuilder);

  // formNegociacion!: FormGroup<NegociacionForm>;

  formNegociacion = this.fb.group<NegociacionForm>({
    idProducto: this.fb.control({ value: null, disabled: true }),
    producto: this.fb.nonNullable.control({ value: '', disabled: true }),
    idLinea: this.fb.control({ value: null, disabled: true }),
    linea: this.fb.nonNullable.control({ value: '', disabled: true }),
    idSistema: this.fb.control({ value: null, disabled: true }),
    sistema: this.fb.nonNullable.control({ value: '', disabled: true }),
    idFormaPago: this.fb.control({ value: null, disabled: true }),
    formaPago: this.fb.nonNullable.control({ value: '', disabled: true }),
    idPeriodoCapital: this.fb.control({ value: null, disabled: true }),
    periodoCapital: this.fb.nonNullable.control({ value: '', disabled: true }),
    idPeriodoInteres: this.fb.control({ value: null, disabled: true }),
    periodoInteres: this.fb.nonNullable.control({ value: '', disabled: true }),
    monto: this.fb.control({ value: null, disabled: true }),
    plazo: this.fb.control({ value: null, disabled: true }),
    periodoGracia: this.fb.control({ value: null, disabled: true }),
    idGarantia: this.fb.control({ value: null, disabled: true }),
    garantia: this.fb.nonNullable.control({ value: '', disabled: true }),
    idTipoGarantia: this.fb.control({ value: null, disabled: true }),
    tipoGarantia: this.fb.nonNullable.control({ value: '', disabled: true }),
    idAsesor: this.fb.control({ value: null, disabled: true }),
    nombreAsesor: this.fb.nonNullable.control({ value: '', disabled: true }),
    idAsesorExterno: this.fb.control({ value: null, disabled: true }),
    nombreAsesorExterno: this.fb.nonNullable.control({ value: '', disabled: true }),
    indicador: this.fb.nonNullable.control({ value: '', disabled: true }),
    puntos: this.fb.control({ value: null, disabled: true }),
    tasaPeriodica: this.fb.control({ value: null, disabled: true }),
    tasaNominal: this.fb.control({ value: null, disabled: true }),
    tasaEfectiva: this.fb.control({ value: null, disabled: true }),
    // cuota: this.fb.control({ value: null, disabled: true })
  });
  periodosPagoCapital: PeriodoPago[] = [];
  formasPago: any[] = [];
  asesoresExternos: Asesor[] = [];
  productoBtnFlag = true;
  lineaBtnFlag = true;
  tipoGarantiaBtnFlag = true;
  asesorExtBtnFlag = true;
  calculatBtnDisabled = true;
  totalCuota: number | null = null;
  verGarantiasBtnDisabled = true;

  @ViewChild('searchButton')
  searchButton!: ElementRef<HTMLInputElement>;

  @ViewChild('modalAsesoresExterno', { static: true }) private modalAsesoresExterno!: ElementRef;
  

  get periodosPagoInteres(): PeriodoPago[] {
    const idPeriodoCapitalActual = this.formNegociacion.controls.idPeriodoCapital.value;
    if (idPeriodoCapitalActual == null) return [];
    if (idPeriodoCapitalActual === PeriodoPagoEnum.AlVencimiento) return this.periodosPagoCapital.filter(p => p.IdFrecuenciaPago !== PeriodoPagoEnum.AlVencimiento);

    const mesesCapital = PERIODOS_MESES[idPeriodoCapitalActual as keyof typeof PERIODOS_MESES];
    return this.periodosPagoCapital.filter(p => {
      const meses = PERIODOS_MESES[p.IdFrecuenciaPago as keyof typeof PERIODOS_MESES];
      if (!meses || !mesesCapital) return false;
      return meses <= mesesCapital && mesesCapital % meses === 0;
    });
  }

  // private asesoriaTerminoServices = inject(AsesoriaTerminoService);
  // esVisibleModal = false;
  tituloModal = 'Asesor Externo';
  constructor(
    // private fb: FormBuilder,
    private carteraService: CarteraService,
    private notif: ToastrService,
    private gestionCreditoService: GestionCreditoService,
    private asesoriaTerminoServices: AsesoriaTerminoService
  ) {

    effect(() => {
      const id = this.idAsesoria();      

      if (!id) {
        return;
      }

      this.gestionCreditoService.consultarNegociacion(id).subscribe(
        {
          next: result => {

            const { primerApellidoAsesor: pa, segundoApellidoAsesor: sa, primerNombreAsesor: pn, segundoNombreAsesor: sn,
              primerApellidoAsesorExterno: paE, segundoApellidoAsesorExterno: saE, primerNombreAsesorExterno: pnE, segundoNombreAsesorExterno: snE
             } = result;
            const nombreAsesor = concatWithSpace(pa, sa, pn, sn);
            const nombreAsesorExterno = concatWithSpace(paE, saE, pnE, snE);

            this.formNegociacion.patchValue({
              idProducto: result.idProducto,
              producto: result.producto,
              idLinea: result.idLinea,
              linea: result.linea,
              idSistema: result.idSistema,
              sistema: result.sistema,
              idFormaPago: result.idFormaPago,
              formaPago: result.formaPago,
              idPeriodoCapital: result.idPeriodoCapital,
              periodoCapital: result.periodoCapital,
              idPeriodoInteres: result.idPeriodoInteres,
              periodoInteres: result.periodoInteres,
              monto: result.monto,
              plazo: result.plazo,
              periodoGracia: result.diasGracia,
              idGarantia: result.idGarantia,
              garantia: result.garantia,
              idAsesor: result.idAsesor,
              nombreAsesor, 
              idAsesorExterno: result.idAsesorExterno,
              nombreAsesorExterno,
              tasaPeriodica: result.tasaPeriodica,
              tasaNominal: result.tasaNominal,
              tasaEfectiva: result.tasaEfectiva,
              indicador: result.siglaIndicador,
              puntos: result.puntos
            });
            this.totalCuota = result.cuota
            const deducciones = this.deducciones();
            const saldoCancelar = this.saldoCancelar();
            if (deducciones && saldoCancelar) {
              this.desembolso = result.monto - deducciones - saldoCancelar;
              this.totalCuota += deducciones;
            }

          },
          error: () => {

          }
        }
      )

    });
  }



  ngOnInit(): void {
    // this.carteraService.getPeriodosPagoCacheable()
    //   .subscribe(data => this.periodosPagoCapital = data);

    // this.gestionCreditoService.getFormasPago()
    //   .subscribe(data => this.formasPago = data);

    
    // this.aplicarReglasSistema(TipoSistemas.CuotaFija);

    const { sistema, periodoGracia, idAsesorExterno, nombreAsesorExterno } = this.formNegociacion.controls;

    sistema.valueChanges.subscribe(idSistema => {
      if(idSistema == null) return;
      // this.aplicarReglasSistema(idSistema);
        // const perGraciaControl = this.cambiarInfoCreditoForm.controls.periodoGracia;
        // perGraciaControl.setValue(this.context.datosFormData.PeriodoGracia, { emitEvent: false }); //Valor original
        // plazo.setValue(this.context.datosFormData.Plazo, { emitEvent: false });
        // /* if (this.maxPeriodoGracia > 0) */ periodoGracia.enable();
        // if (idSistema && this.esCuotaVariable(idSistema)) {
        //   periodoGracia.setValue(0, { emitEvent: false });
        //   periodoGracia.disable();
        // }

        // this.aplicarReglasPeriodosPlazo();
    });

    // idAsesorExterno.valueChanges.subscribe(() => {
    //   nombreAsesorExterno.setValue('', { emitEvent: false });
    // });

    // nombreAsesorExterno.valueChanges.subscribe(() => {
    //   idAsesorExterno.setValue(null, { emitEvent: false });
    // });
  }

  onIdAsesorInput() {
    this.formNegociacion.controls.nombreAsesorExterno.setValue('', { emitEvent: false });
  }

  onNombreAsesorInput() {
    this.formNegociacion.controls.idAsesorExterno.setValue(null, { emitEvent: false });
  }

  esCuotaVariable(idSistema: number) {
    return idSistema === TipoSistemas.CuotaVariable || idSistema === TipoSistemas.CuotaVariableTasaVariable;
  }

  private aplicarReglasSistema(idSistema: number): void {
      const { periodoCapital, periodoInteres } = this.formNegociacion.controls;
  
      // if (idSistema === TipoSistemas.CuotaFija || idSistema === TipoSistemas.CuotaFijaTasaVariable) {
      //   periodoCapital.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
      //   periodoCapital.disable({ emitEvent: false });
  
      //   periodoInteres.setValue(PeriodoPagoEnum.Mes, { emitEvent: false });
      //   periodoInteres.disable({ emitEvent: false });
  
      // } else {
      //   periodoCapital.reset();
      //   periodoCapital.enable({ emitEvent: false });
  
      //   periodoInteres.reset();
      //   periodoInteres.enable({ emitEvent: false });
      // }
    }


  buscarAsesorExternoCodigo(event: FocusEvent) {
    
    const codigoCtrl = this.formNegociacion.controls.idAsesorExterno;
    const codigo = codigoCtrl.value;
    const focoCambioABotonLupa = event.relatedTarget == this.searchButton.nativeElement;
    if(!codigo || focoCambioABotonLupa) {
      codigoCtrl.setValue(null);
      return;
    }

    this.asesoriaTerminoServices.BuscarAsesorExternoCacheable({ strCodigo: codigo, strNombre: null })
      .subscribe({
        next: result => {

          if (result.length == 0) {
            this.notif.warning('Advertencia', 'No se encontró el asesor externo.', ConfiguracionNotificacion.configRightTop);
            codigoCtrl.setValue(null);

          } else if (result.length == 1) {
            // Mapea directamente
            this.formNegociacion.patchValue({
              idAsesorExterno: result[0].intIdAsesor,
              nombreAsesorExterno: result[0].Nombre
            })
          }
        }
      });
  }

  buscarAsesorExternoNombre() {
    const nombreCtrl = this.formNegociacion.controls.nombreAsesorExterno;
    const nombre = nombreCtrl.value?.replace(/\s{2,}/g, ' ')?.trim();
    if(nombre == null || undefined) return;

    this.asesoriaTerminoServices.BuscarAsesorExternoCacheable({ strCodigo: null, strNombre: nombre })
      .subscribe({
        next: result => {

          if (result.length == 0) {
            this.notif.warning('Advertencia', 'No se encontró el asesor externo.', ConfiguracionNotificacion.configRightTop);
            nombreCtrl.setValue('');

          } else if (result.length == 1) {
            // Mapea directamente
            this.formNegociacion.patchValue({
              idAsesorExterno: result[0].intIdAsesor,
              nombreAsesorExterno: result[0].Nombre
            })
          } else {
            // Modal
            this.modalAsesoresExterno.nativeElement.click();
            // this.esVisibleModal = true;
            this.asesoresExternos = result;
          }
        }
      });
  }

  mapearAsesorExterno(asesor: Asesor) {
    this.formNegociacion.patchValue({
      idAsesorExterno: asesor.intIdAsesor,
      nombreAsesorExterno: asesor.Nombre
    });

    this.modalAsesoresExterno.nativeElement.click();
    // this.esVisibleModal = false;
  }

  onCloseModal() {
    // this.esVisibleModal = false;

  }

}
