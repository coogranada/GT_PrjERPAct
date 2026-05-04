import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { ShareComponentModule } from './share-component.module';
import { ConcatWithSpacePipe } from '../Pipes/utilidades/concatWithSpace.pipe';
import { TipoDocumentoPipe } from '../Pipes/utilidades/tipo-documento.pipe';
import { TransaccionesCajaComponent } from '../Components/Transacciones/transacciones-caja/transacciones-caja.component';
import { TransaccionesRoutingModule } from '../Routes/transacciones-routing.module';
import { MonedaDirectivaDirective } from '../Components/shared/directives/moneda-directiva.directive';
import { ImprimirTransaccionComponent } from '../Components/Transacciones/imprimir-transaccion/imprimir-transaccion.component';

@NgModule({
  declarations: [
    TransaccionesCajaComponent, MonedaDirectivaDirective, ImprimirTransaccionComponent
  ],
  imports: [
    CommonModule,
    TransaccionesRoutingModule,
    ShareComponentModule,
    FormsModule,
    CurrencyMaskModule,
    NgxLoadingModule.forRoot({
        backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({ callSetDisabledState: 'whenDisabledForLegacyCode' }),
    ConcatWithSpacePipe,
    TipoDocumentoPipe
]
})
export class TransaccionesModule { }
