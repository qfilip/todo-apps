import { Component, OnInit, ViewChild } from '@angular/core';
import { ITodo } from 'src/app/models/ITodo';
import { WrapperDialog } from '../../../ui-common/wrapper/wrapper.dialog';
import * as Utils from '../../../utils';
import { NotificationService } from 'src/app/ui-common/notification.service';
import { CommitService } from 'src/app/services/commit.service';
import { ITodoCreated } from 'src/app/models/ITodoEvents';
import { TodoService } from 'src/app/services/todo.service';
import { eTodoEventType } from 'src/app/models/enums';

@Component({
    selector: 'app-add-todo-dialog',
    templateUrl: './add-todo.dialog.html',
    styleUrls: ['./add-todo.dialog.scss']
})
export class AddTodoDialog implements OnInit {

    @ViewChild('dialogWrapper') dialogWrapper: WrapperDialog;

    constructor(
        private notifications: NotificationService,
        private commitService: CommitService,
        private todoService: TodoService
    ) { }

    ngOnInit(): void {
        this.createEmptyTodo();
    }

    newTodo: ITodo;

    private createEmptyTodo() {
        this.newTodo = { title: '', details: '', dueDate: new Date() } as ITodo;
    }

    onCreate() {
        let errors = this.todoService.validateTodo(this.newTodo);
        if(errors.length > 0) {
            errors.forEach(x => this.notifications.warning(x));
            return;
        }
        
        const todo = {
            id: Utils.Functions.createId(),
            title: this.newTodo.title,
            details: this.newTodo.details,
            dueDate: this.newTodo.dueDate
        } as ITodo;

        const event = {
            id: Utils.Functions.createId(),
            type: eTodoEventType.Created,
            todo: todo,
            createdAt: new Date()
        } as ITodoCreated;

        this.commitService.addEvent(event);
        this.notifications.info('Change added');
        this.close();
    }

    open() {
        this.createEmptyTodo();
        this.dialogWrapper.open();
    }

    close() {
        this.dialogWrapper.close();
    }
}
