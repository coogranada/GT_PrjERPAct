import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesGestionesComponent } from '../Components/GestionesOperaciones/solicitudes-gestiones/solicitudes-gestiones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TagInputModule } from 'ngx-chips';


@NgModule({
  declarations: [SolicitudesGestionesComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    NguiAutoCompleteModule,
    TagInputModule ,
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ],exports:[
    SolicitudesGestionesComponent
  ]
})
export class ShareComponentModule { }
