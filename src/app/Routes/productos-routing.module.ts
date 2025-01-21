import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractualComponent } from '../Components/Productos/Ahorros/Contractual/contractual/contractual.component';
import { AsesoriaContractualComponent } from '../Components/Productos/Ahorros/Contractual/asesoria/asesoria-contractual.component';
import { AportesComponent } from '../Components/Productos/Aportes/aportes.component';
import { TerminoComponent } from '../Components/Productos/Termino/termino/termino.component';

const routesProductos: Routes = [
  { path: "Aportes", component: AportesComponent },
  { path: "Ahorros/Contractual", component: ContractualComponent},
  { path: "Ahorros/AsesoriaContractual", component: AsesoriaContractualComponent },
  { path: "Ahorros/Termino/Termino", component: TerminoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routesProductos)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
