import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GestionGarantiasComponent } from '../Components/garantias/gestion-garantias/gestion-garantias.component';
import { GarantiasRoutingModule } from '../Routes/garantias-routing.module';

@NgModule({
  declarations: [
    GestionGarantiasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GarantiasRoutingModule
  ]
})
export class GarantiasModule { }
