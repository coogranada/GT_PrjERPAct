import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreasComponent } from '../Components/Configuracion/Maestros/areas/areas.component';
import { CargosComponent } from '../Components/Configuracion/Maestros/cargos/cargos.component';
import { OficinasComponent } from '../Components/Configuracion/Maestros/oficinas/oficinas.component';
import { PerfilesComponent } from '../Components/Configuracion/Maestros/perfiles/perfiles.component';
import { TipoUsuariosComponent } from '../Components/Configuracion/Maestros/tipo-usuarios/tipo-usuarios.component';
import { ModulosComponent } from '../Components/Configuracion/Maestros/modulos/modulos.component';
import { PermisosComponent } from '../Components/Configuracion/Maestros/permisos/permisos.component';
import { OperacionesModulosComponent } from '../Components/Configuracion/Maestros/operaciones-modulos/operaciones-modulos.component';
import { OperacionesComponent } from '../Components/Configuracion/Maestros/operaciones/operaciones.component';
import { EstadosOperacionesComponent } from '../Components/Configuracion/Maestros/estados-operaciones/estados-operaciones.component';
import { UsuariosComponent } from '../Components/Configuracion/Maestros/usuarios/usuarios.component';
import { UsuariosProveedoresComponent } from '../Components/Configuracion/Maestros/usuarios-proveedores/usuarios-proveedores.component';
import { ControlSesionesComponent } from '../Components/Configuracion/Maestros/control-sesiones/control-sesiones.component';
import { GestionBannerComponent } from '../Components/Configuracion/Maestros/gestion-banner/gestion-banner.component';
import { PermisosEspecialesComponent } from '../Components/Configuracion/Maestros/permisos-especiales/permisos-especiales.component';
import { GestionEmail } from '../Components/Configuracion/Maestros/gestion-email/gestion-email.component';
import { LlavesComponent } from '../Components/Configuracion/Maestros/llaves/llaves.component';
import { ConsecutivoTituloComponent } from '../Components/Configuracion/Maestros-productos/Maestros-ahorros/Consecutivo-titulo/consecutivo-titulo.component';
import { InformeConsecutivoTituloComponent } from '../Components/Configuracion/Informes/Maestros-ahorros/Consecutivo-titulo/informe-consecutivo-titulo/informe-consecutivo-titulo.component';
const routesConfiguracion: Routes = [
  { path: "Maestros/Areas", component: AreasComponent },
  { path: "Maestros/Cargos", component: CargosComponent },
  { path: "Maestros/Oficinas", component: OficinasComponent },
  { path: "Maestros/Perfiles", component: PerfilesComponent },
  { path: "Maestros/TiposUsuarios", component: TipoUsuariosComponent },
  { path: "Maestros/Modulos", component: ModulosComponent },
  { path: "Maestros/Permisos", component: PermisosComponent },
  { path: "Maestros/OperacionesModulos", component: OperacionesModulosComponent },
  { path: "Maestros/OperacionesPerfiles", component: OperacionesComponent },
  { path: "Maestros/OperacionesEstados", component: EstadosOperacionesComponent },
  { path: "Maestros/Usuarios", component: UsuariosComponent },
  { path: "Maestros/UsuariosProveederes", component: UsuariosProveedoresComponent },
  { path: "Maestros/ControlSesion", component: ControlSesionesComponent },
  { path: "Maestros/ImagenesBanner", component: GestionBannerComponent },
  { path: "Maestros/PermisosEspeciales", component: PermisosEspecialesComponent },
  { path: "Maestros/GestionEmail", component: GestionEmail },
  { path: "Maestros/llaves", component : LlavesComponent },
  { path: "Maestros-productos/Maestros-ahorros/Consecutivo-titulo", component: ConsecutivoTituloComponent },
  { path: "Informes/Maestros-ahorros/Consecutivo-titulo/informe-consecutivo-titulo", component: InformeConsecutivoTituloComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routesConfiguracion)], 
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }