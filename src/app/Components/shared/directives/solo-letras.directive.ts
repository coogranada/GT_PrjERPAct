import { Directive, ElementRef, HostListener } from '@angular/core';
import { ERP_REGEX } from '../../../utils/constant';

@Directive({
  selector: '[appSoloLetras]',
  standalone: true
})
export class SoloLetrasDirective {

  private readonly regex = ERP_REGEX.NOMBRES;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;

    // Guardar posición del cursor
    const start = input.selectionStart ?? 0;

    const originalValue = input.value;

    // Eliminar todo lo que no sea letra o espacio
    const cleanedValue = Array.from(originalValue)
      .filter(char => this.regex.test(char))
      .join('');

    if (originalValue !== cleanedValue) {
      input.value = cleanedValue;

      // Ajustar posición del cursor
      const diff = originalValue.length - cleanedValue.length;
      const newPos = Math.max(0, start - diff);

      input.setSelectionRange(newPos, newPos);
    }
  }
}