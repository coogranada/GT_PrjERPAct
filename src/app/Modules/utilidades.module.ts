import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { UtilidadesRoutingModule } from '../Routes/utilidades-routing.module';
import { ConciliacionCompensacionComponent } from '../Components/Utilidades/conciliacion-compensacion/conciliacion-compensacion.component';

@NgModule({
  declarations: [
    ConciliacionCompensacionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    UtilidadesRoutingModule,
    CurrencyMaskModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ]
})
export class UtilidadesModule { }
