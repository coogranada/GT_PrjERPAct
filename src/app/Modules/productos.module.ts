import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosRoutingModule } from '../Routes/productos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ContractualComponent } from '../Components/Productos/Ahorros/Contractual/contractual/contractual.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { AsesoriaContractualComponent } from '../Components/Productos/Ahorros/Contractual/asesoria/asesoria-contractual.component';
import { AportesComponent } from '../Components/Productos/Aportes/aportes.component';
import { TerminoComponent } from '../Components/Productos/Ahorros/Termino/termino/termino.component';
import { ScoreCreditosComponent } from '../Components/Productos/Creditos/score-creditos/score-creditos.component';
import { TarjetaHabientesComponent } from '../Components/Productos/Ahorros/Disponibles/tarjeta-habientes/tarjeta-habientes.component';
import { GMFDisponibleComponent } from '../Components/Productos/Ahorros/Disponibles/gmf/gmf.component';
import { FichaAnalisisComponent } from '../Components/Productos/Creditos/ficha-analisis/ficha-analisis.component';
import { ShareComponentModule } from './share-component.module';
import { DisponiblesComponent } from '../Components/Productos/Ahorros/Disponibles/disponibles/disponibles.component';
import { AsesoriaTerminoComponent } from '../Components/Productos/Ahorros/Termino/asesoria-termino/asesoria-termino.component';
import { GestionCreditoComponent } from '../Components/Productos/Cartera/gestion-credito/gestion-credito.component';
import { ConcatWithSpacePipe } from '../Pipes/utilidades/concatWithSpace.pipe';
import { InformesModule } from './informes.module';
import { TipoDocumentoPipe } from '../Pipes/utilidades/tipo-documento.pipe';
import { DatacreditoComponent } from '../Components/Productos/Creditos/datacredito/datacredito/datacredito.component';
import { CambiarInfoCreditoForm } from "../Components/Productos/Cartera/gestion-credito/cambiar-infocredito-form/cambiar-infocredito-form.component";
import { ModalComponent } from '../Components/shared/modal/modal.component';

@NgModule({
  declarations: [
    ContractualComponent,
    AsesoriaContractualComponent,
    AportesComponent,
    TerminoComponent,
    ScoreCreditosComponent,
    TarjetaHabientesComponent,
    GMFDisponibleComponent,
    FichaAnalisisComponent,
    DisponiblesComponent,
    GestionCreditoComponent,
    AsesoriaTerminoComponent,
    DatacreditoComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    ShareComponentModule,
    FormsModule,
    CurrencyMaskModule,
    NgxLoadingModule.forRoot({
        backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({ callSetDisabledState: 'whenDisabledForLegacyCode' }),
    ConcatWithSpacePipe,
    TipoDocumentoPipe,
    InformesModule,
    CambiarInfoCreditoForm,
    ModalComponent
]
})
export class ProductosModule { }
