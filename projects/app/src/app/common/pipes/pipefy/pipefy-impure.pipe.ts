import { Pipe, PipeTransform } from '@angular/core';

// Ex.: myFunc | pipefyImpure:arg1:arg2:...
@Pipe({
  name: 'pipefyImpure',
  pure: true,
})
export class PipefyImpurePipe implements PipeTransform {
  transform(callback: (...args: any[]) => any, ...args: any[]): any {
    return callback(...args);
  }
}
