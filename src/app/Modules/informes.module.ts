import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformesRoutingModule } from '../Routes/informes-routing.module';
import { DebitosAutomaticosComponent } from '../Components/Informes/debito-automatico/debito-automatico.component';
import { FormatoDebitoAutomaticoComponent } from '../Components/Formatos-impresion/formato-debitoautomatico/formato-debitoautomatico.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ReactiveFormsModule } from '@angular/forms';
import { InfoGestionOperacionesComponent } from '../Components/Informes/info-gestion-operaciones/info-gestion-operaciones.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TransaccionesComponent } from '../Components/Informes/estadisticos/transacciones/transacciones.component';
import { CanalesExternosComponent } from '../Components/Informes/estadisticos/canales-externos/canales-externos.component';
import { ComposicionPortafolioComponent } from '../Components/Informes/estadisticos/composicion-portafolio/composicion-portafolio.component';
import { EvolucionOficinaComponent } from '../Components/Informes/estadisticos/evolucion-oficina/evolucion-oficina.component';
import { IndicadoresGerencialesComponent } from '../Components/Informes/estadisticos/indicadores-gerenciales/indicadores-gerenciales.component';


@NgModule({
  declarations: [
    DebitosAutomaticosComponent,
    FormatoDebitoAutomaticoComponent,
    InfoGestionOperacionesComponent,
    TransaccionesComponent,
    CanalesExternosComponent,
    ComposicionPortafolioComponent,
    EvolucionOficinaComponent,
    IndicadoresGerencialesComponent

  ],
  imports: [
    CommonModule,
    InformesRoutingModule,
    NguiAutoCompleteModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ]
})
export class InformesModule { }
