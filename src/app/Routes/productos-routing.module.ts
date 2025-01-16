import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractualComponent } from '../Components/Productos/Ahorros/Contractual/contractual/contractual.component';
import { AsesoriaContractualComponent } from '../Components/Productos/Ahorros/Contractual/asesoria/asesoria-contractual.component';

const routesProductos: Routes = [
  { path: "Ahorros/Contractual", component: ContractualComponent},
  { path: "Ahorros/AsesoriaContractual", component: AsesoriaContractualComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routesProductos)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
