import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stopFilter'
})
export class StopFilterPipe implements PipeTransform {

  transform(value: unknown, filter: string[]): any {
    if (!value || !filter) {
      return value
    }
    return null;
  }

}
