import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone : false
})
export class FiltroPipe implements PipeTransform {

  transform(items: any, filter: any, isAnd: boolean): any {
        if (filter && Array.isArray(items)) {
          const filterKeys = Object.keys(filter);
          if (isAnd) {
            return items.filter(item =>
              filterKeys.reduce((memo, keyName) =>
                (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === '', true));
          } else {
            return items.filter(item => {
              return filterKeys.some((keyName) => {
                if (filter[keyName]) {
                  const fil = filter[keyName].split(' ');
                  let check = false;
                  for (const f of fil) {
                    if (new RegExp(f, 'gi').test(item[keyName]) || f === '') {
                      check = true;
                    } else {
                      check = false;
                      break;
                    }
                  }
                  return check;
                } else {
                  return true;
                }
              });
            });
          }
        } else {
          return items;
        }
  }
}


