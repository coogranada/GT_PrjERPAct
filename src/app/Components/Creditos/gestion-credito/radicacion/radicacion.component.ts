import { Component } from '@angular/core';
import { TabNegociacionComponent } from '../shared/tab-negociacion/tab-negociacion.component';
import { TablaHistorialComponent } from '../../../shared/tabla-historial/tabla-historial.component';

@Component({
  selector: 'app-radicacion',
  imports: [TabNegociacionComponent, TablaHistorialComponent],
  templateUrl: './radicacion.component.html',
  styleUrl: './radicacion.component.css'
})
export class RadicacionComponent {
  activeTab = 'negociacion';

  changeTab(tab: string) {
    this.activeTab = tab;
  }
}
