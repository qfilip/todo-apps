import { Pipe, PipeTransform } from "@angular/core";
import * as Utils from '../utils';

@Pipe({
    name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
    
    transform(x: Date) {
        const date = new Date(x);
        return Utils.Functions.formatDate(date);
    }

}