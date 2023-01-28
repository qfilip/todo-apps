import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { eTodoExpiration } from 'src/app/models/enums';
import { ITodo } from 'src/app/models/ITodo';


@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

    @Input('todo') todo: ITodo;
    @Output('onEdit') onEdit: EventEmitter<string> = new EventEmitter();
    @Output('onDelete') onDelete: EventEmitter<string> = new EventEmitter();
    @Output('onViewHistory') onViewHistory: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
        this.setExpiration();
    }

    todoExpiration: eTodoExpiration;
    _eTodoExpiration = eTodoExpiration;

    private setExpiration() {
        const getClearDate = (d: Date) => {
            d = new Date(d);
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }

        const now = getClearDate(new Date()).getTime();
        const dueDate = getClearDate(this.todo.dueDate).getTime();

        if(dueDate > now) this.todoExpiration = eTodoExpiration.NotExpired;
        else if(dueDate === now) this.todoExpiration = eTodoExpiration.ExpiresToday;
        else this.todoExpiration = eTodoExpiration.Expired;
    }

    viewHistory() {
        this.onViewHistory.emit(this.todo.id);
    }

    edit() {
        this.onEdit.emit(this.todo.id);
    }

    delete() {
        this.onDelete.emit(this.todo.id);
    }
}
