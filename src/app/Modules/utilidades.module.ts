import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilidadesRoutingModule } from '../Routes/utilidades-routing.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { CrearNotificacionesComponent } from '../Components/Utilidades/crear-notificaciones/crear-notificaciones.component';
import { ConciliacionCompensacionComponent } from '../Components/Utilidades/conciliacion-compensacion/conciliacion-compensacion.component';
import { DiferenciasSaldosComponent } from '../Components/Utilidades/diferencias-saldos/diferencias-saldos.component';



@NgModule({
  declarations: [
    CrearNotificacionesComponent,
    ConciliacionCompensacionComponent,
    DiferenciasSaldosComponent
  ],
  imports: [
    CommonModule,
    UtilidadesRoutingModule,
    NguiAutoCompleteModule,
    CurrencyMaskModule,
    FormsModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ]
})
export class UtilidadesModule { }
