import { Injectable } from "@angular/core";
import { eEntityState, eTodoEventType } from "../models/enums";
import { ICommit } from "../models/ICommit";
import { ITodo, ITodoStatePreview } from "../models/ITodo";
import { ITodoCreated, ITodoDeleted, ITodoDetailsChanged, ITodoDueDateChanged, ITodoEvent, ITodoTitleChanged } from "../models/ITodoEvents";
import { DialogService } from "../ui-common/dialog.service";
import { IDialogOptions } from "../ui-common/IDialogOptions";
import { BranchService } from "./branch.service";

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    constructor(
        private dialogService: DialogService,
        private branchService: BranchService
    ) {}

    getTodosProjectionFromCommits(commits: ICommit[]) {
        const branchId = this.branchService.getCurrentBranch().id;
        
        const byDate = (a: ICommit, b: ICommit) => {
            return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1;
        }

        const events = commits
            .filter(x => x.branchId === branchId)
            .sort(byDate)
            .map(x => x.events)
            .flat();

        return this.appendEventsToTodoProjection([], events);
    }

    appendEventsToTodoProjection(todos: ITodo[], events: ITodoEvent[]) {
        let dbCorrupted: 'notCorrupted' | 'userNotified' = 'notCorrupted';

        const onDbCorrupted = (ev: ITodoEvent) => {
            console.error(ev);
            if(dbCorrupted === 'userNotified') {
                return;
            }
              
            dbCorrupted = 'userNotified';
            this.dialogService.open({
                header: 'Fatal error',
                message: 'Database corrupted. Cannot scaffold Todo list',
                cancelHidden: true
            } as IDialogOptions);
        }
        
        const onCreated = (e: ITodoCreated) => {
            todos.push(e.todo);
        }

        const onDeleted = (e: ITodoDeleted) => {
            todos = todos.filter(x => x.id !== e.todoId);
        }

        const onTitleChanged = (e: ITodoTitleChanged) => {
            const i = todos.findIndex(x => x.id === e.todoId);
            if(i === -1) {
                onDbCorrupted(e);
                return;
            }
            todos[i].title = e.title;
        }

        const onDetailsChanged = (e: ITodoDetailsChanged) => {
            const i = todos.findIndex(x => x.id === e.todoId);
            if(i === -1) {
                onDbCorrupted(e);
                return;
            }
            todos[i].details = e.details;
        }

        const onDueDateChanged = (e: ITodoDueDateChanged) => {
            const i = todos.findIndex(x => x.id === e.todoId);
            if(i === -1) {
                onDbCorrupted(e);
                return;
            }
            todos[i].dueDate = e.dueDate;
        }

        const byDate = (a: ITodoEvent, b: ITodoEvent) => {
            return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1;
        }
        
        events
            .sort(byDate)
            .forEach(x => {
                this.onEventCastedDo<void>(
                    x,
                    onCreated,
                    onDeleted,
                    onTitleChanged,
                    onDetailsChanged,
                    onDueDateChanged
                );
        });

        return todos;
    }

    getTodoStatePreview(events: ITodoEvent[]) {
        if(events.length === 0) {
            console.error('Cannot scaffold preview from empty events');
            return null;
        }

        const onCreated = (e: ITodoCreated, x: ITodoStatePreview) => {
            return {
                ...x,
                todo: e.todo,
                state: eEntityState.Active
            } as ITodoStatePreview;
        }

        const onDeleted = (e: ITodoDeleted, x: ITodoStatePreview) => {
            return {
                ...x,
                state: eEntityState.Deleted
            } as ITodoStatePreview;
        }

        const onTitleChanged = (e: ITodoTitleChanged, x: ITodoStatePreview) => {
            return {
                ...x,
                todo: { ...x.todo, title: e.title }
            } as ITodoStatePreview;
        }

        const onDetailsChanged = (e: ITodoDetailsChanged, x: ITodoStatePreview) => {
            return {
                ...x,
                todo: { ...x.todo, details: e.details }
            } as ITodoStatePreview;
        }

        const onDueDateChanged = (e: ITodoDueDateChanged, x: ITodoStatePreview) => {
            return {
                ...x,
                todo: { ...x.todo, dueDate: e.dueDate }
            } as ITodoStatePreview;
        }

        const byDate = (a: ITodoEvent, b: ITodoEvent) => {
            return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1;
        }
        
        const initialState = { todo: {}, state: null } as ITodoStatePreview;

        return events
            .sort(byDate)
            .reduce((state, x) => {
                if(x.type === eTodoEventType.Created) return onCreated(x as ITodoCreated, state);
                else if(x.type === eTodoEventType.Deleted) return onDeleted(x as ITodoDeleted, state);
                else if(x.type === eTodoEventType.TitleChanged) return onTitleChanged(x as ITodoTitleChanged, state);
                else if(x.type === eTodoEventType.DetailsChanged) return onDetailsChanged(x as ITodoDetailsChanged, state);
                else if(x.type === eTodoEventType.DueDateChanged) return onDueDateChanged(x as ITodoDueDateChanged, state);
                else {
                    console.error(`Event type ${x.type} cannot be matched`);
                    return null;
                }
            }, initialState);
    }

    onEventCastedDo<T>(
        x: ITodoEvent,
        onCreated: (e: ITodoCreated) => T | void,
        onDeleted: (e: ITodoDeleted) => T | void,
        onTitleChanged: (e: ITodoTitleChanged) => T | void,
        onDetailsChanged: (e: ITodoDetailsChanged) => T | void,
        onDueDateChanged: (e: ITodoDueDateChanged) => T | void
        ): T | void
    {
        if(x.type === eTodoEventType.Created) return onCreated(x as ITodoCreated);
        else if(x.type === eTodoEventType.Deleted) return onDeleted(x as ITodoDeleted);
        else if(x.type === eTodoEventType.TitleChanged) return onTitleChanged(x as ITodoTitleChanged);
        else if(x.type === eTodoEventType.DetailsChanged) return onDetailsChanged(x as ITodoDetailsChanged);
        else if(x.type === eTodoEventType.DueDateChanged) return onDueDateChanged(x as ITodoDueDateChanged);
        else {
            console.error(`Event type ${x.type} cannot be matched`);
        }
    }

    mapTodoEvents(todoId: string, commits: ICommit[]) {
        const isTodoEvent = (x: ITodoEvent) => {
            return this.onEventCastedDo<boolean>(
                x,
                (e) => e.todo.id === todoId,
                (e) => e.todoId === todoId,
                (e) => e.todoId === todoId,
                (e) => e.todoId === todoId,
                (e) => e.todoId === todoId,
            ) as boolean;
        }

        const branchId = this.branchService.getCurrentBranch().id;
        
        const events = commits
            .filter(x => x.branchId === branchId)
            .sort((a, b) => +a.createdAt - +b.createdAt)
            .reduce((state, x) => {
                const events = x.events
                    .filter(isTodoEvent)
                    .sort((a, b) => +a.createdAt - +b.createdAt)

                return state.concat(events);
            }, [] as ITodoEvent[]);

        return events;
    }

    validateTodo(todo: ITodo) {
        let errors: string[] = [];
        if(todo.title.length < 3) {
            errors.push('Title is not long enough');
        }

        return errors;
    }
}