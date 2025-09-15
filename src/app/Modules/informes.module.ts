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
import { InformeClientesComponent } from '../Components/Informes/informe-clientes/informe-clientes.component';
import { InformeClientesNaturalesComponent } from '../Components/Informes/informe-clientes/informe-clientes-naturales/informe-clientes-naturales.component';
import { InformeJuridicosComponent } from '../Components/Informes/informe-clientes/informe-juridicos/informe-juridicos.component';
import { LogAuditoriaComponent } from '../Components/Informes/log-auditoria/log-auditoria.component';
import { LogAsesoriaComponent } from '../Components/Informes/log-auditoria/log-asesoria/log-asesoria.component';
import { LogAutenticacionErpComponent } from '../Components/Informes/log-auditoria/log-autenticacion-erp/log-autenticacion-erp.component';
import { LogBannerComponent } from '../Components/Informes/log-auditoria/log-banner/log-banner.component';
import { LogFichaAnalisisComponent } from '../Components/Informes/log-auditoria/log-ficha-analisis/log-ficha-analisis.component';
import { LogLogGeneralesComponent } from '../Components/Informes/log-auditoria/log-generales/log-generales.component';
import { LogGestionClientesComponent } from '../Components/Informes/log-auditoria/log-gestion-clientes/log-gestion-clientes.component';
import { LogMisProductosComponent } from '../Components/Informes/log-auditoria/log-mis-productos/log-mis-productos.component';
import { LogProductosVirtualesComponent } from '../Components/Informes/log-auditoria/log-productos-virtuales/log-productos-virtuales.component';
import { InformeAhorrosComponent } from '../Components/Informes/Informe-ahorros/informe-ahorros/informe-ahorros.component';
import { TablaVirtualComponent } from '../Components/Tabla-virtual/tabla-virtual/tabla-virtual.component';


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
    UtilidadesTabComponent,
    InformeClientesComponent,
    InformeAhorrosComponent,
    InformeClientesNaturalesComponent,
    InformeJuridicosComponent,
    LogAuditoriaComponent,
    LogAsesoriaComponent,
    LogAutenticacionErpComponent,
    LogBannerComponent,
    LogFichaAnalisisComponent,
    LogLogGeneralesComponent,
    LogGestionClientesComponent,
    LogMisProductosComponent,
    LogProductosVirtualesComponent,
    TablaVirtualComponent
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
