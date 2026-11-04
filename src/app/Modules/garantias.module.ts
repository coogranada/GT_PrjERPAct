import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ShareComponentModule } from './share-component.module';



@NgModule({
  declarations: [],
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
