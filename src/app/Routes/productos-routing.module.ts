import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractualComponent } from '../Components/Productos/Ahorros/Contractual/contractual/contractual.component';
import { AsesoriaContractualComponent } from '../Components/Productos/Ahorros/Contractual/asesoria/asesoria-contractual.component';
import { AportesComponent } from '../Components/Productos/Aportes/aportes.component';
import { TerminoComponent } from '../Components/Productos/Ahorros/Termino/termino/termino.component';
import { ScoreCreditosComponent } from '../Components/Productos/Creditos/score-creditos/score-creditos.component';
import { TarjetaHabientesComponent } from '../Components/Productos/Ahorros/Disponibles/tarjeta-habientes/tarjeta-habientes.component';
import { GMFDisponibleComponent } from '../Components/Productos/Ahorros/Disponibles/gmf/gmf.component';
import { FichaAnalisisComponent } from '../Components/Productos/Creditos/ficha-analisis/ficha-analisis.component';

const routesProductos: Routes = [
  { path: "Aportes", component: AportesComponent },
  { path: "Ahorros/Contractual", component: ContractualComponent},
  { path: "Ahorros/AsesoriaContractual", component: AsesoriaContractualComponent },
  { path: "Ahorros/Termino/Termino", component: TerminoComponent },
  { path: "Creditos/Score", component: ScoreCreditosComponent },
  { path: "Ahorros/Disponible/TarjetaHabientes", component: TarjetaHabientesComponent },
  { path: "Ahorros/Disponible/GMF", component: GMFDisponibleComponent },
  { path: "Creditos/FichaAnalisis", component: FichaAnalisisComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routesProductos)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
