import { Pipe, PipeTransform } from '@angular/core';

// Ex.: myFunc | pipefy:arg1:arg2:...
@Pipe({
  name: 'pipefy',
  pure: true,
})
export class PipefyPipe implements PipeTransform {
  transform(callback: (...args: any[]) => any, ...args: any[]): any {
    return callback(...args);
  }
}
