import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitosAutomaticosComponent } from '../Components/Informes/debito-automatico/debito-automatico.component';

const routes: Routes = [
  { path: "DebitosAutomaticos", component: DebitosAutomaticosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformesRoutingModule { }
