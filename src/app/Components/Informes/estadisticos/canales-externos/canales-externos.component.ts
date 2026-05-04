import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canales-externos',
  templateUrl: './canales-externos.component.html',
  styleUrls: ['./canales-externos.component.css'],
  standalone : false
})
export class CanalesExternosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.IrArriba();
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
