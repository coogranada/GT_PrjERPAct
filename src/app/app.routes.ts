import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { NgModule } from '@angular/core';
import { LayoutComponent } from './Components/layout/layout.component';
import { PerfilComponent } from './Components/Perfil/perfil.component';
import { AcercaDeComponent } from './Components/acerca-de/acerca-de.component';
import { AplicacionesColaborativasComponent } from './Components/Aplicaciones-colaborativas/aplicaciones-colaborativas.component';
import { LibretaDireccionesComponent } from './Components/libreta-direcciones/libreta-direcciones.component';
export const routes: Routes = [
    { path: "login", redirectTo: "/Login" },
    { path: "Login", component: LoginComponent },
    {
        path: "", component: LayoutComponent,
         children: [
             { path: "AcercaDe", component: AcercaDeComponent },
             { path: "Perfil/Detalle", component: PerfilComponent },
             { path: "LibretaDirecciones", component: LibretaDireccionesComponent },
             { path: "AplicacionesColaborativas", component: AplicacionesColaborativasComponent },
             { path: "Configuracion", data : { breadcrub : "Configuracion"}, loadChildren : () => import("../app/Modules/configuracion.module").then( x => x.ConfiguracionModule) },    
             { path: "Clientes", data : { breadcrub : "Clientes"}, loadChildren : () => import("../app/Modules/cliente.module").then( x => x.ClienteModule) },   
             { path: "Productos", data : { breadcrub : "Productos"}, loadChildren : () => import("../app/Modules/productos.module").then( x => x.ProductosModule) },                     
        ]
    }  
];
@NgModule({
    imports: [RouterModule.forRoot(routes)], 
    exports: [RouterModule]
  })
    
  export class AppRoutingModule { }
  export const APP_ROUTING: any = RouterModule.forRoot(routes);