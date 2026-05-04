import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransaccionesCajaComponent } from '../Components/Transacciones/transacciones-caja/transacciones-caja.component';
import { ImprimirTransaccionComponent } from '../Components/Transacciones/imprimir-transaccion/imprimir-transaccion.component';

const routesProductos: Routes = [
  { path: "TransaccionesCaja", component: TransaccionesCajaComponent},
  { path: "ImprimirTransacciones", component: ImprimirTransaccionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routesProductos)],
  exports: [RouterModule]
})
export class TransaccionesRoutingModule { }
