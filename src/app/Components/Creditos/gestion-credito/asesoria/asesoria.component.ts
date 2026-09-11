import { Component } from '@angular/core';

@Component({
  selector: 'app-asesoria',
  imports: [],
  templateUrl: './asesoria.component.html',
  styleUrl: './asesoria.component.css'
})
export class AsesoriaComponent {

  activeTab = 'negociacion';

  changeTab(tab: string) {
    this.activeTab = tab;
  }
}
