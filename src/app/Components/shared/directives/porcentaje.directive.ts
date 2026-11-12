import { Directive, HostListener, ElementRef, AfterViewInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPorcentajeDirectiva]',
  standalone: true
})
export class PorcentajeDirective implements AfterViewInit {

  private valorNumerico: number | null = null;
  private enEdicion = false;
  private primeraVezFocus = true;

  constructor(
    private el: ElementRef,
    @Optional() private control: NgControl
  ) { }

  ngAfterViewInit() {
    this.aplicarFormatoInicial();
    this.suscribirseCambios();
  }

  private esNoEditable(): boolean {
    const input = this.el.nativeElement;
    return input.readOnly || input.disabled;
  }

  private formatear(valor: number | null) {
    if (valor === null) {
      return '';
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
      useGrouping: false
    }).format(valor) + ' %';
  }

  private suscribirseCambios() {
    if (this.control?.valueChanges) {
      this.control.valueChanges.subscribe(valor => {
        this.valorNumerico =
          valor === null || valor === ''
            ? null
            : Number(valor);

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
    const valor = this.el.nativeElement.value;
    this.valorNumerico =
      valor === null || valor === undefined || valor === ''
        ? null
        : Number(valor.replace(/[^0-9.]/g, ''));

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

    this.valorNumerico = valor === ''
      ? null
      : Number(valor);

    this.control?.control?.setValue(this.valorNumerico, {
      emitEvent: false
    });

    this.el.nativeElement.value =
      this.valorNumerico !== null
        ? this.valorNumerico
        : '';
  }

  @HostListener('focus')
  onFocus() {
    if (this.esNoEditable()) return;

    this.enEdicion = true;
    this.el.nativeElement.value = this.valorNumerico || '';

    if (this.primeraVezFocus) {
      setTimeout(() => {
        this.el.nativeElement.select();
      });
      this.primeraVezFocus = false;
    }
  }

  @HostListener('blur')
  onBlur() {
    this.enEdicion = false;
    this.el.nativeElement.value = this.formatear(this.valorNumerico);
  }
}