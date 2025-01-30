import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitosAutomaticosComponent } from '../Components/Informes/debito-automatico/debito-automatico.component';
import { InfoGestionOperacionesComponent } from '../Components/Informes/info-gestion-operaciones/info-gestion-operaciones.component';
import { TransaccionesComponent } from '../Components/Informes/estadisticos/transacciones/transacciones.component';
import { CanalesExternosComponent } from '../Components/Informes/estadisticos/canales-externos/canales-externos.component';
import { ComposicionPortafolioComponent } from '../Components/Informes/estadisticos/composicion-portafolio/composicion-portafolio.component';
import { EvolucionOficinaComponent } from '../Components/Informes/estadisticos/evolucion-oficina/evolucion-oficina.component';
import { IndicadoresGerencialesComponent } from '../Components/Informes/estadisticos/indicadores-gerenciales/indicadores-gerenciales.component';

const routes: Routes = [
  { path: "DebitosAutomaticos", component: DebitosAutomaticosComponent },
  { path: "GestionOperaciones", component: InfoGestionOperacionesComponent },
  { path: "Estadisticos/Transacciones", component: TransaccionesComponent },
  { path: "Estadisticos/Canales-Externos", component: CanalesExternosComponent },
  { path: "Estadisticos/Composicion-Portafolio", component: ComposicionPortafolioComponent },
  { path: "Estadisticos/Evolucion-Oficina", component: EvolucionOficinaComponent },
  { path: "Estadisticos/Indicadores-gerenciales", component: IndicadoresGerencialesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformesRoutingModule { }
