import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'concatWithSpace' })
export class ConcatWithSpacePipe implements PipeTransform {
  transform(value: string, ...args: string[]): string {
    return [value, ...args].filter(Boolean).map(s => String(s).trim().replace(/\s{2,}/g, ' ')).join(' ');
  }
}