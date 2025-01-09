import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasComponent } from '../Components/Configuracion/Maestros/areas/areas.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ConfiguracionRoutingModule } from '../Routes/configuracion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TagInputModule } from 'ngx-chips';
import { UsuariosProveedoresComponent } from '../Components/Configuracion/Maestros/usuarios-proveedores/usuarios-proveedores.component';
import { ControlSesionesComponent } from '../Components/Configuracion/Maestros/control-sesiones/control-sesiones.component';
import { GestionBannerComponent } from '../Components/Configuracion/Maestros/gestion-banner/gestion-banner.component';
import { PermisosEspecialesComponent } from '../Components/Configuracion/Maestros/permisos-especiales/permisos-especiales.component';
import { GestionEmail } from '../Components/Configuracion/Maestros/gestion-email/gestion-email.component';
import { LlavesComponent } from '../Components/Configuracion/Maestros/llaves/llaves.component';
import { ConsecutivoTituloComponent } from '../Components/Configuracion/Maestros-productos/Maestros-ahorros/Consecutivo-titulo/consecutivo-titulo.component';
import { InformeConsecutivoTituloComponent } from '../Components/Configuracion/Informes/Maestros-ahorros/Consecutivo-titulo/informe-consecutivo-titulo/informe-consecutivo-titulo.component';
@NgModule({
  declarations: [
    AreasComponent,CargosComponent,OficinasComponent,PerfilesComponent,TipoUsuariosComponent,
    ModulosComponent ,PermisosComponent, OperacionesModulosComponent,OperacionesComponent,EstadosOperacionesComponent,
    UsuariosComponent, UsuariosProveedoresComponent, ControlSesionesComponent,GestionBannerComponent, PermisosEspecialesComponent,
    GestionEmail, LlavesComponent, ConsecutivoTituloComponent, InformeConsecutivoTituloComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfiguracionRoutingModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    NguiAutoCompleteModule,
    TagInputModule ,


  ],
  providers :[],
 // schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfiguracionModule { }