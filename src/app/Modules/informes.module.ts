import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformesRoutingModule } from '../Routes/informes-routing.module';
import { DebitosAutomaticosComponent } from '../Components/Informes/debito-automatico/debito-automatico.component';
import { FormatoDebitoAutomaticoComponent } from '../Components/Formatos-impresion/formato-debitoautomatico/formato-debitoautomatico.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DebitosAutomaticosComponent,
    FormatoDebitoAutomaticoComponent
  ],
  imports: [
    CommonModule,
    InformesRoutingModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ]
})
export class InformesModule { }
