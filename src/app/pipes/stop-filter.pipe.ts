import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stopFilter'
})
export class StopFilterPipe implements PipeTransform {

  transform(value: any[], filter: string): any {
    if (!value || !filter) {
      return value
    }
    //return value.filter(value => value['stopName'].toLowerCase().indexOf(filter.toLowerCase()) != -1);
    return value.filter(value => value.stopName.toLowerCase().indexOf(filter.toLowerCase()) != -1);
  }

}
