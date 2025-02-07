import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformesRoutingModule } from '../Routes/informes-routing.module';
import { DebitosAutomaticosComponent } from '../Components/Informes/debito-automatico/debito-automatico.component';
import { FormatoDebitoAutomaticoComponent } from '../Components/Formatos-impresion/formato-debitoautomatico/formato-debitoautomatico.component';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoGestionOperacionesComponent } from '../Components/Informes/info-gestion-operaciones/info-gestion-operaciones.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TransaccionesComponent } from '../Components/Informes/estadisticos/transacciones/transacciones.component';
import { CanalesExternosComponent } from '../Components/Informes/estadisticos/canales-externos/canales-externos.component';
import { ComposicionPortafolioComponent } from '../Components/Informes/estadisticos/composicion-portafolio/composicion-portafolio.component';
import { EvolucionOficinaComponent } from '../Components/Informes/estadisticos/evolucion-oficina/evolucion-oficina.component';
import { IndicadoresGerencialesComponent } from '../Components/Informes/estadisticos/indicadores-gerenciales/indicadores-gerenciales.component';
import { MiListaProductosComponent } from '../Components/Informes/mi-lista-productos/mi-lista-productos.component';
import { AhorrosTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/ahorros-tab/ahorros-tab.component';
import { AportesTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/aportes-tab/aportes-tab.component';
import { CarteraTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/cartera-tab/cartera-tab.component';
import { ContabilidadTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/contabilidad-tab/contabilidad-tab.component';
import { ConveniosComponent } from '../Components/Informes/mi-lista-productos/Tabs/convenios/convenios.component';
import { CoodeudorTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/coodeudor-tab/coodeudor-tab.component';
import { NotificacionesTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/notificaciones-tab/notificaciones-tab.component';
import { OtrosConpTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/otros-conp-tab/otros-conp-tab.component';
import { RadicadosComponent } from '../Components/Informes/mi-lista-productos/Tabs/radicados/radicados.component';
import { SegurosTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/seguros-tab/seguros-tab.component';
import { UtilidadesTabComponent } from '../Components/Informes/mi-lista-productos/Tabs/utilidades-tab/utilidades-tab.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';


@NgModule({
  declarations: [
    DebitosAutomaticosComponent,
    FormatoDebitoAutomaticoComponent,
    InfoGestionOperacionesComponent,
    TransaccionesComponent,
    CanalesExternosComponent,
    ComposicionPortafolioComponent,
    EvolucionOficinaComponent,
    IndicadoresGerencialesComponent,
    MiListaProductosComponent,
    AhorrosTabComponent,
    AportesTabComponent,
    CarteraTabComponent,
    ContabilidadTabComponent,
    ConveniosComponent,
    CoodeudorTabComponent,
    NotificacionesTabComponent,
    OtrosConpTabComponent,
    RadicadosComponent,
    SegurosTabComponent,
    UtilidadesTabComponent

  ],
  imports: [
    CommonModule,
    InformesRoutingModule,
    NguiAutoCompleteModule,
    CurrencyMaskModule,
    FormsModule  ,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ]
})
export class InformesModule { }
