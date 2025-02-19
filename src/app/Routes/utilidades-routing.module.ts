import { RouterModule, Routes } from "@angular/router";
import { ConciliacionCompensacionComponent } from "../Components/Utilidades/conciliacion-compensacion/conciliacion-compensacion.component";
import { NgModule } from "@angular/core";


const routesUtilidades: Routes = [
    { path: "ConciliacionCompensacion", component: ConciliacionCompensacionComponent }
  ];

  
@NgModule({
    imports: [RouterModule.forChild(routesUtilidades)],
    exports: [RouterModule]
  })
  export class UtilidadesRoutingModule { }