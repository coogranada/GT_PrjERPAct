import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evolucion-oficina',
  templateUrl: './evolucion-oficina.component.html',
  styleUrls: ['./evolucion-oficina.component.css'],
  standalone : false
})
export class EvolucionOficinaComponent implements OnInit {

  constructor() { }
  ngOnInit() {
    this.IrArriba();
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
