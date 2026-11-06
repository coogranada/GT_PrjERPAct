import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ShareComponentModule } from './share-component.module';
import { GestionGarantiasComponent } from '../Components/garantias/gestion-garantias/gestion-garantias.component';



@NgModule({
  declarations: [GestionGarantiasComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    CurrencyMaskModule,
    ShareComponentModule
  ]
})
export class GarantiasModule { }
