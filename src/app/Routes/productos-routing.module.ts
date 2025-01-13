import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractualComponent } from '../Components/Productos/Ahorros/Contractual/contractual/contractual.component';

const routesProductos: Routes = [
  { path: "Ahorros/Contractual", component: ContractualComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routesProductos)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
