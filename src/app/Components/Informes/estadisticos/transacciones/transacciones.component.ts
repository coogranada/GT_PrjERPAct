import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css'],
  standalone : false
})
export class TransaccionesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.IrArriba()
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
