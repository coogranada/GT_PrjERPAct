import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareComponentModule } from './share-component.module';
import { CreditosRoutingModule } from '../Routes/creditos-routing';
import { FichaAnalisisComponent } from '../Components/Creditos/ficha-analisis/ficha-analisis.component';
import { ScoreCreditosComponent } from '../Components/Creditos/score-creditos/score-creditos.component';
import { DatacreditoCreditosComponent } from '../Components/Creditos/datacredito/datacredito/datacredito.component';


@NgModule({
  declarations: [
    ScoreCreditosComponent,
    FichaAnalisisComponent,
    DatacreditoCreditosComponent
  ],
  imports: [
    CommonModule,
    CreditosRoutingModule,
    NguiAutoCompleteModule,
    CurrencyMaskModule,
    FormsModule,  
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'}),
    ShareComponentModule
  ]
})
export class CreditosModule { }
