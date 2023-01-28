import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ITodo } from 'src/app/models/ITodo';
import { AddTodoDialog } from '../dialogs/add-todo/add-todo.dialog';
import { CommitService } from 'src/app/services/commit.service';
import { TodoService } from 'src/app/services/todo.service';
import { EditTodoDialog } from '../dialogs/edit-todo/edit-todo.dialog';
import { DialogService } from 'src/app/ui-common/dialog.service';
import { eTodoEventType } from 'src/app/models/enums';
import { ITodoDeleted, ITodoEvent } from 'src/app/models/ITodoEvents';
import * as Utils from '../../utils';
import { IDialogOptions } from 'src/app/ui-common/IDialogOptions';
import { TodoHistoryDialog } from '../dialogs/todo-history/todo-history.dialog';
import { ICommit } from 'src/app/models/ICommit';

@Component({
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {

    @ViewChild('addTodoDialog') addTodoDialog: AddTodoDialog;
    @ViewChild('editTodoDialog') editTodoDialog: EditTodoDialog;
    @ViewChild('todoHistoryDialog') todoHistoryDialog: TodoHistoryDialog;

    private subscribed = true;

    constructor(
        private todoService: TodoService,
        private commitService: CommitService,
        private dialogService: DialogService
    ) { }

    ngOnInit(): void {
        this.commitService.commits
        .pipe(takeWhile(() => this.subscribed))
        .subscribe(x => {
            if(x) {
                this.mapTodosFromCommits(x);
            }
        });

        this.commitService.localChanges
        .pipe(takeWhile(() => this.subscribed))
        .subscribe(x => {
            if(x && x.length > 0) {
                this.appendEventsToTodos(x);
            }
        });
    }

    todos: ITodo[];

    private mapTodosFromCommits(commits: ICommit[]) {
        this.todos = this.todoService.getTodosProjectionFromCommits(commits);
    }

    private appendEventsToTodos(events: ITodoEvent[]) {
        this.todos = this.todoService.appendEventsToTodoProjection(this.todos, events);
    }

    openTodoHistoryDialog(todoId: string) {
        this.todoHistoryDialog.open(todoId);
    }

    openAddTodoDialog() {
        this.addTodoDialog.open();
    }

    openEditTodoDialog(todoId: string) {
        const todo = this.todos.find(x => x.id === todoId);
        this.editTodoDialog.open(todo);
    }

    openDeleteTodoDialog(todoId: string) {
        const todo = this.todos.find(x => x.id === todoId);

        const okHandler = () => {
            const event = {
                id: Utils.Functions.createId(),
                todoId: todo.id,
                type: eTodoEventType.Deleted,
                createdAt: new Date()
            } as ITodoDeleted;
    
            this.commitService.addEvent(event);
        }

        this.dialogService.open({
            header: 'Delete',
            message: `Proceed with deleting ${todo.title} Todo?`,
            onOk: () => okHandler()
        } as IDialogOptions);
    }

    tracker(index: any, entity: any) {
        console.log(index);
        console.log(entity);

        return entity.id;
    }

    ngOnDestroy(): void {
        this.subscribed = false;
    }
}
