import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearNotificacionesComponent } from '../Components/Utilidades/crear-notificaciones/crear-notificaciones.component';

const routes: Routes = [
  { path: "CrearNotificaciones", component: CrearNotificacionesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilidadesRoutingModule { }
