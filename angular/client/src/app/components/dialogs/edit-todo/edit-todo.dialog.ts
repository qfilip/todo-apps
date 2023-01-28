import { Component, OnInit, ViewChild } from '@angular/core';
import { eTodoEventType } from 'src/app/models/enums';
import { ITodo } from 'src/app/models/ITodo';
import { ITodoDetailsChanged, ITodoDueDateChanged, ITodoTitleChanged } from 'src/app/models/ITodoEvents';
import { CommitService } from 'src/app/services/commit.service';
import { TodoService } from 'src/app/services/todo.service';
import { NotificationService } from 'src/app/ui-common/notification.service';
import { WrapperDialog } from 'src/app/ui-common/wrapper/wrapper.dialog';
import * as Utils from '../../../utils';

@Component({
    selector: 'app-edit-todo-dialog',
    templateUrl: './edit-todo.dialog.html',
    styleUrls: ['./edit-todo.dialog.scss']
})
export class EditTodoDialog implements OnInit {

    @ViewChild('dialogWrapper') dialogWrapper: WrapperDialog;

    constructor(
        private notifications: NotificationService,
        private commitService: CommitService,
        private todoService: TodoService
    ) { }

    ngOnInit(): void {
        this.todo = {
            title: '',
            details: ''
        } as ITodo;
    }

    private originalTodo: ITodo;
    todo: ITodo;

    onSave() {
        let errors = this.todoService.validateTodo(this.todo);
        if(errors.length > 0) {
            errors.forEach(x => this.notifications.warning(x));
            return;
        }
        
        if(this.todo.title !== this.originalTodo.title) {
            let event = {
                id: Utils.Functions.createId(),
                type: eTodoEventType.TitleChanged,
                todoId: this.todo.id,
                title: this.todo.title,
                createdAt: new Date()
            } as ITodoTitleChanged;
            this.commitService.addEvent(event);
        }

        if(this.todo.details !== this.originalTodo.details) {
            let event = {
                id: Utils.Functions.createId(),
                todoId: this.todo.id,
                details: this.todo.details,
                type: eTodoEventType.DetailsChanged,
                createdAt: new Date()
            } as ITodoDetailsChanged;
            this.commitService.addEvent(event);
        }

        if(this.todo.dueDate !== this.originalTodo.dueDate) {
            let event = {
                id: Utils.Functions.createId(),
                todoId: this.todo.id,
                dueDate: this.todo.dueDate,
                type: eTodoEventType.DueDateChanged,
                createdAt: new Date()
            } as ITodoDueDateChanged;
            this.commitService.addEvent(event);
        }

        this.notifications.info('Changes added');
        this.close();
    }
    
    open(todo: ITodo) {
        const clone = (x: ITodo) => JSON.parse(JSON.stringify(x));
        this.originalTodo = clone(todo);
        this.todo = clone(todo);
        this.dialogWrapper.open();
    }

    close() {
        this.dialogWrapper.close();
    }
}
