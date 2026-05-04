import { Directive, HostListener, ElementRef, AfterViewInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMonedaDirectiva]',
  standalone: false
})
export class MonedaDirectivaDirective implements AfterViewInit {

  private valorNumerico: number = 0;
  private enEdicion = false;

  constructor(
    private el: ElementRef,
    @Optional() private control: NgControl
  ) { }

  ngAfterViewInit() {
    this.suscribirseCambios();
  }

  private esNoEditable(): boolean {
    const input = this.el.nativeElement;
    return input.readOnly || input.disabled;
  }

  private formatear(valor: number) {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  }

  private suscribirseCambios() {
    if (this.control?.valueChanges) {
      this.control.valueChanges.subscribe(valor => {
        this.valorNumerico = Number(valor) || 0;

        if (!this.enEdicion) {
          this.el.nativeElement.value = this.formatear(this.valorNumerico);
        }
      });
    } else {
      // fallback si no hay ngModel
      this.aplicarFormatoInicial();
    }
  }

  private aplicarFormatoInicial() {
    const valor = this.el.nativeElement.value || '0';
    this.valorNumerico = Number(valor.replace(/[^0-9.]/g, '')) || 0;

    if (this.esNoEditable()) {
      this.el.nativeElement.value = this.formatear(this.valorNumerico);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (this.esNoEditable()) return;

    let valor = event.target.value;
    valor = valor.replace(/[^0-9.]/g, '');

    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes[1];
    }

    this.valorNumerico = Number(valor) || 0;
    this.el.nativeElement.value = valor;
  }

  @HostListener('focus')
  onFocus() {
    if (this.esNoEditable()) return;

    this.enEdicion = true;
    this.el.nativeElement.value = this.valorNumerico || '';
  }

  @HostListener('blur')
  onBlur() {
    this.enEdicion = false;
    this.el.nativeElement.value = this.formatear(this.valorNumerico);
  }
}