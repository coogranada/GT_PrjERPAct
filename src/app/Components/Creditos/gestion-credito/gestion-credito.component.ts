import { Component } from '@angular/core';
import { InicioComponent } from './inicio/inicio.component';
import { AsesoriaComponent } from './asesoria/asesoria.component';
import { RadicacionComponent } from './radicacion/radicacion.component';

@Component({
  selector: 'app-gestion-credito',
  imports: [InicioComponent, AsesoriaComponent, RadicacionComponent],
  templateUrl: './gestion-credito.component.html',
  styleUrl: './gestion-credito.component.css'
})
export class GestionCreditoComponent {

  activeTab = 'inicio';

  changeTab(tab: string) {
    this.activeTab = tab;
  }

}
