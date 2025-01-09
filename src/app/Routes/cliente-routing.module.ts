import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NaturalesComponent } from '../Components/Clientes/naturales/naturales.component';
import { JuridicosComponent } from '../Components/Clientes/juridicos/juridicos.component';

const routesConfiguracion: Routes = [
  { path: "Naturales", component: NaturalesComponent },
  { path: "Juridicos", component: JuridicosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routesConfiguracion)], 
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
