import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearNotificacionesComponent } from '../Components/Utilidades/crear-notificaciones/crear-notificaciones.component';
import { ConciliacionCompensacionComponent } from '../Components/Utilidades/conciliacion-compensacion/conciliacion-compensacion.component';
import { DiferenciasSaldosComponent } from '../Components/Utilidades/diferencias-saldos/diferencias-saldos.component';

const routes: Routes = [
  { path: "CrearNotificaciones", component: CrearNotificacionesComponent },
  { path: "ConciliacionCompensacion", component: ConciliacionCompensacionComponent },
  { path: "DiferenciasSaldos", component: DiferenciasSaldosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilidadesRoutingModule { }
