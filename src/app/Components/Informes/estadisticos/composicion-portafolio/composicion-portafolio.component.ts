import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-composicion-portafolio',
  templateUrl: './composicion-portafolio.component.html',
  styleUrls: ['./composicion-portafolio.component.css'],
  standalone : false
})
export class ComposicionPortafolioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.IrArriba();
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
