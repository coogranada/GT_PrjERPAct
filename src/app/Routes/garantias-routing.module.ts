import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionGarantiasComponent } from '../Components/garantias/gestion-garantias/gestion-garantias.component';

const routes: Routes = [
  {
    path: '',
    component: GestionGarantiasComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class GarantiasRoutingModule { }