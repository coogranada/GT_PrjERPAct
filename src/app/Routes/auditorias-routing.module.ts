import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GMFComponent } from '../Components/Auditorias/gmf/gmf.component';
import { ScoreComponent } from '../Components/Auditorias/score/score.component';

const routes: Routes = [
  { path: "GMF", component: GMFComponent },
  { path: "Score", component: ScoreComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditoriasRoutingModule { }
