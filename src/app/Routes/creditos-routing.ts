import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreCreditosComponent } from '../Components/Creditos/score-creditos/score-creditos.component';
import { FichaAnalisisComponent } from '../Components/Creditos/ficha-analisis/ficha-analisis.component';
import { DatacreditoCreditosComponent } from '../Components/Creditos/datacredito/datacredito/datacredito.component';

const routes: Routes = [
  { path: "Score", component: ScoreCreditosComponent },
  { path: "Datacredito", component: DatacreditoCreditosComponent },
  { path: "FichaAnalisis", component: FichaAnalisisComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditosRoutingModule { }
