import { Pipe, PipeTransform, Injectable } from '@angular/core';

/**
 * Pipe name
 * @export
 * @class CurrencyCustom(moneda personalizada)
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'CurrencyCustom'
})
    
@Injectable()
    
export class CurrencyCustom implements PipeTransform {
    constructor() { }
    transform(item: any): any {
        if (item == null || item == NaN || item == undefined) return "0.00";
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);
        var num = numberFormat2.format(item);
        return num;
    }
}