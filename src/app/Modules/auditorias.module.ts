import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriasRoutingModule } from '../Routes/auditorias-routing.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { GMFComponent } from '../Components/Auditorias/gmf/gmf.component';
import { ScoreComponent } from '../Components/Auditorias/score/score.component';

@NgModule({
  declarations: [
    GMFComponent,
    ScoreComponent
  ],
  imports: [
    CommonModule,
    AuditoriasRoutingModule,
    NguiAutoCompleteModule,
    CurrencyMaskModule,
    FormsModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ]
})
export class AuditoriasModule { }
