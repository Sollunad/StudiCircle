import {Pipe, PipeTransform} from '@angular/core';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import * as localDe from 'date-fns/locale/de'

@Pipe({
  name: 'strictTime',
})
export class StrictRelativeTime implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return distanceInWordsStrict(args[0], value, {locale: localDe})
  }
}
