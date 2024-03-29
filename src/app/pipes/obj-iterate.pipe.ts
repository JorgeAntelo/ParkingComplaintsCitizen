import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objIterate'
})
export class ObjIteratePipe implements PipeTransform {

  transform(value: any, args: any[] = null): any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }

}
