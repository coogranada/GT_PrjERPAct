import { Pipe, PipeTransform, Injectable } from '@angular/core';

/**
 * Pipe name
 * @export
 * @class CurrencyCustom(moneda personalizada)
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'replace',
    standalone : false
})

@Injectable()

export class Replace implements PipeTransform {
    constructor() { }
    transform(item: any , char : string, newchar : string): any {
        if (item == null || item == undefined) return "0.00";
        item = item.replace(char, newchar);
        return item;
    }
}