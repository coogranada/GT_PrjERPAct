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
import { TarjetaHabientesComponent } from '../Components/Productos/Ahorros/Disponibles/tarjeta-habientes/tarjeta-habientes.component';
import { GMFDisponibleComponent } from '../Components/Productos/Ahorros/Disponibles/gmf/gmf.component';
import { ShareComponentModule } from './share-component.module';
import { DisponiblesComponent } from '../Components/Productos/Ahorros/Disponibles/disponibles/disponibles.component';
import { AsesoriaTerminoComponent } from '../Components/Productos/Ahorros/Termino/asesoria-termino/asesoria-termino.component';
import { GestionCarteraComponent} from '../Components/Productos/Cartera/gestion-credito/gestion-cartera.component';
import { ConcatWithSpacePipe } from '../Pipes/utilidades/concatWithSpace.pipe';
import { InformesModule } from './informes.module';
import { TipoDocumentoPipe } from '../Pipes/utilidades/tipo-documento.pipe';
import { CambiarInfoCreditoForm } from "../Components/Productos/Cartera/gestion-credito/cambiar-infocredito-form/cambiar-infocredito-form.component";
import { ModalComponent } from '../Components/shared/modal/modal.component';
import { CambiarGarantiasModalComponent } from '../Components/shared/cambiar-garantias-modal/cambiar-garantias-modal.component';

@NgModule({
  declarations: [
    ContractualComponent,
    AsesoriaContractualComponent,
    AportesComponent,
    TerminoComponent,
    TarjetaHabientesComponent,
    GMFDisponibleComponent,
    DisponiblesComponent,
    GestionCarteraComponent,
    AsesoriaTerminoComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    ShareComponentModule,
    FormsModule,
    CambiarGarantiasModalComponent,
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
