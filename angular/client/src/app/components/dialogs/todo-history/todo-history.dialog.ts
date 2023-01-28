import { Component, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs';
import { eTodoEventType } from 'src/app/models/enums';
import { ICommit } from 'src/app/models/ICommit';
import { ITodo } from 'src/app/models/ITodo';
import { ITodoEvent } from 'src/app/models/ITodoEvents';
import { BranchService } from 'src/app/services/branch.service';
import { CommitService } from 'src/app/services/commit.service';
import { TodoService } from 'src/app/services/todo.service';
import { NotificationService } from 'src/app/ui-common/notification.service';
import { WrapperDialog } from 'src/app/ui-common/wrapper/wrapper.dialog';

@Component({
    selector: 'app-todo-history-dialog',
    templateUrl: './todo-history.dialog.html',
    styleUrls: ['./todo-history.dialog.scss']
})
export class TodoHistoryDialog implements OnInit {

    @ViewChild('dialogWrapper') dialogWrapper: WrapperDialog;

    private subscribed: boolean = true;

    constructor(
        private branchService: BranchService,
        private commitService: CommitService,
        private todoService: TodoService,
        private notification: NotificationService
    ) { }

    ngOnInit(): void {
        this.commitService.commits
        .pipe(takeWhile(() => this.subscribed))
        .subscribe(x => {
            if(x) {
                this.commits = x;
            }
        });
    }

    todoId: string;
    todoProjection: ITodo;
    _eventType = eTodoEventType;
    private commits: ICommit[];
    todoCommits: ICommit[];

    open(todoId: string) {
        this.todoId = todoId;
        this.createTodoCommitList();
        this.dialogWrapper.open();
    }

    private createTodoCommitList() {
        const isTodoEvent = (x: ITodoEvent) => {
            return this.todoService.onEventCastedDo<boolean>(
                x,
                (e) => e.todo.id === this.todoId,
                (e) => e.todoId === this.todoId,
                (e) => e.todoId === this.todoId,
                (e) => e.todoId === this.todoId,
                (e) => e.todoId === this.todoId,
            ) as boolean;
        }

        const branchId = this.branchService.getCurrentBranch().id;
        this.todoCommits = this.commits
            .filter(x => x.branchId === branchId)
            .sort((a, b) => +a.createdAt - +b.createdAt)
            .map(x => {
                const events = x.events
                    .filter(isTodoEvent)
                    .sort((a, b) => +a.createdAt - +b.createdAt)

                return { ...x, events: events } as ICommit;
            })
            .filter(x => x.events.length > 0);
    }

    onEventSelected(commitId: string, eventId: string) {
        let commitsForProjection: ICommit[] = [];
        let skipRest = false;
        
        this.todoCommits.forEach(x => {
            if(!skipRest) {
                skipRest = x.id === commitId;
                commitsForProjection.push({...x});
            }
        });

        const events = commitsForProjection.map(x => {
            let events: ITodoEvent[] = [];
            let skipRest = false;
            
            x.events.forEach(x => {
                if(!skipRest) {
                    events.push(x);
                    skipRest = x.id === eventId;
                }
            });

            return {...x, events: events };
        })
        .map(x => x.events)
        .flat();

        const todos = this.todoService.appendEventsToTodoProjection([], events);
        
        if(todos.length !== 1) {
            this.notification.error('Failed to reproduce state');
            return;
        }
        
        this.todoProjection = todos[0];
    }

    close() {
        this.dialogWrapper.close();
    }
}
