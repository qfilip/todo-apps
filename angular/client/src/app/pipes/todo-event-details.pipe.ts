
import { Pipe, PipeTransform } from "@angular/core";
import { ITodoEvent } from "../models/ITodoEvents";
import { TodoService } from "../services/todo.service";
import * as Utils from '../utils';

@Pipe({
    name: 'todoEventDetails'
})
export class TodoEventDetailsPipe implements PipeTransform {
    
    transform(x: ITodoEvent) {
        const date = Utils.Functions.formatDate(x.createdAt);
        const result = Utils.Functions.onEventCastedDo<string>(
            x,
            (e) => `created at ${date}`,
            (e) => `deleted at ${date}`,
            (e) => `title changed to '${e.title}' at ${date}`,
            (e) => `details changed to '${e.details}', at ${date}`,
            (e) => `due date changed to '${e.dueDate}' at ${date}`,
        );
        
        return result as string;
    }

}