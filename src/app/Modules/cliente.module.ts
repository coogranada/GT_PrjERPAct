import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NaturalesComponent } from '../Components/Clientes/naturales/naturales.component';
import { ClienteRoutingModule } from '../Routes/cliente-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TagInputModule } from 'ngx-chips';
import { TrasavilidadAsociadoComponent } from '../Components/Clientes/naturales/Trasavilidad/trasavilidad-asociado/trasavilidad-asociado.component';
import { SolicitudServiciosComponent } from '../Components/Formatos-impresion/solicitud-servicios/solicitud-servicios.component';
import { SolicitudRetiroComponent } from '../Components/Formatos-impresion/solicitud-retiro/solicitud-retiro.component';
import { AccionistasComponent } from '../Components/Clientes/juridicos/Tabs/accionistas/accionistas.component';
import { ContactoComponent } from '../Components/Clientes/juridicos/Tabs/contacto/contacto.component';
import { EntrevistaComponent } from '../Components/Clientes/juridicos/Tabs/entrevista/entrevista.component';
import { FinancieraComponent } from '../Components/Clientes/juridicos/Tabs/financiera/financiera.component';
import { HistorialComponent } from '../Components/Clientes/juridicos/Tabs/historial/historial.component';
import { InfoJuridicosComponent } from '../Components/Clientes/juridicos/Tabs/info-juridicos/info-juridicos.component';
import { PatrimonioComponent } from '../Components/Clientes/juridicos/Tabs/patrimonio/patrimonio.component';
import { ReferenciasComponent } from '../Components/Clientes/juridicos/Tabs/referencias/referencias.component';
import { RepresentanteLegalComponent } from '../Components/Clientes/juridicos/Tabs/representante-legal/representante-legal.component';
import { TrazabilidadComponent } from '../Components/Clientes/juridicos/Tabs/trazabilidad/trazabilidad.component';
import { JuridicosComponent } from '../Components/Clientes/juridicos/juridicos.component';
import { SolicitudServiciosJuridicosComponent } from '../Components/Formatos-impresion/solicitud-servicios-juridicos/solicitud-servicios-juridicos.component';
import { SolicitudesGestionesComponent } from '../Components/GestionesOperaciones/solicitudes-gestiones/solicitudes-gestiones.component';
import { GestionGestionesOperacionesComponent } from '../Components/GestionesOperaciones/gestion-gestiones-operaciones/gestion-gestiones-operaciones.component';
import { GestionesOperacionesComponent } from '../Components/GestionesOperaciones/gestiones-operaciones/gestiones-operaciones.component';
import { FiltroPipe } from '../Pipes/Filtro/filtro.pipe';

@NgModule({
  declarations: [
    NaturalesComponent,
    TrasavilidadAsociadoComponent,
    SolicitudServiciosComponent,
    SolicitudRetiroComponent,
   AccionistasComponent,
   ContactoComponent,
   EntrevistaComponent,
  FinancieraComponent,
  HistorialComponent,
 InfoJuridicosComponent,
 PatrimonioComponent,
 ReferenciasComponent,
 RepresentanteLegalComponent,
 TrazabilidadComponent,
 JuridicosComponent,
 SolicitudServiciosJuridicosComponent,
 SolicitudesGestionesComponent,
 GestionGestionesOperacionesComponent,
 GestionesOperacionesComponent,
 FiltroPipe
],
  imports: [
    CommonModule,ClienteRoutingModule,
    FormsModule,
   // ReactiveFormsModule,
   
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    NguiAutoCompleteModule,
    TagInputModule ,
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ]
})
export class ClienteModule { }
