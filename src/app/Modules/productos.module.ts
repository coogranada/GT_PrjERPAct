import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosRoutingModule } from '../Routes/productos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ContractualComponent } from '../Components/Productos/Ahorros/Contractual/contractual/contractual.component';
import { Replace } from '../Pipes/utilidades/replace.pipe';
import { FormatoCambioCuentaDestinoComponent } from '../Components/Formatos-impresion/formato-cambio-cuentadestino/formato-cambio-cuentadestino.component';
import { ClienteModule } from './cliente.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { AsesoriaContractualComponent } from '../Components/Productos/Ahorros/Contractual/asesoria/asesoria-contractual.component';
import { FormatoAsesoriaComponent } from '../Components/Formatos-impresion/formato-asesoria/formato-asesoria.component';
import { AportesComponent } from '../Components/Productos/Aportes/aportes.component';
import { TerminoComponent } from '../Components/Productos/Termino/termino/termino.component';

@NgModule({
  declarations: [
    ContractualComponent,
    FormatoCambioCuentaDestinoComponent,
    Replace,
    AsesoriaContractualComponent,
    FormatoAsesoriaComponent,
    AportesComponent,
    TerminoComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    ClienteModule,
    FormsModule,
    CurrencyMaskModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ]
})
export class ProductosModule { }
