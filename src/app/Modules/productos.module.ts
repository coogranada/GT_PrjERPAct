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
import { TerminoComponent } from '../Components/Productos/Ahorros/Termino/termino/termino.component';
import { ScoreCreditosComponent } from '../Components/Productos/Creditos/score-creditos/score-creditos.component';
import { TarjetaHabientesComponent } from '../Components/Productos/Ahorros/Disponibles/tarjeta-habientes/tarjeta-habientes.component';
import { GMFDisponibleComponent } from '../Components/Productos/Ahorros/Disponibles/gmf/gmf.component';
import { FichaAnalisisComponent } from '../Components/Productos/Creditos/ficha-analisis/ficha-analisis.component';

@NgModule({
  declarations: [
    ContractualComponent,
    FormatoCambioCuentaDestinoComponent,
    Replace,
    AsesoriaContractualComponent,
    FormatoAsesoriaComponent,
    AportesComponent,
    TerminoComponent,
    ScoreCreditosComponent,
    TarjetaHabientesComponent,
    GMFDisponibleComponent,
    FichaAnalisisComponent

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
