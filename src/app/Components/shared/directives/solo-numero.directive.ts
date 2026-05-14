import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSoloNumero]',
  standalone: false
})
export class SoloNumeroDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;

    // Guardar posición del cursor
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const originalValue = input.value;

    // Eliminar todo lo que no sea número
    const cleanedValue = originalValue.replace(/[^0-9]/g, '');

    if (originalValue !== cleanedValue) {
      input.value = cleanedValue;

      // Ajustar el cursor para que no salte al final
      const diff = originalValue.length - cleanedValue.length;
      const newPos = start - diff;

      input.setSelectionRange(newPos, newPos);
    }
  }
}