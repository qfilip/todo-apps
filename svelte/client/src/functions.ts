import { eTodoEventType, ITodo, ITodoEvent } from "./models";

export function getTodoVersions(events: ITodoEvent[], todoId: string) {
    return events
        .filter(x => x.data.id === todoId)
        .sort(eventsByDateAscSort)
        .reduce(todoVersionsFromEventsReducer, [] as ITodo[]);
}

export function getTodos(events: ITodoEvent[]) {
    return events
        .sort(eventsByDateAscSort)
        .reduce(todosFromEventsReducer, [] as ITodo[]);
}

function todoVersionsFromEventsReducer(acc: ITodo[], ev: ITodoEvent) {
    if(ev.type === eTodoEventType.Created) {
        const todo: ITodo = {
            id: ev.data.id,
            title: ev.data.title,
            createdAt: ev.createdAt,
            modifiedAt: ev.createdAt
        };
        acc.push(todo);
    }
    else if(ev.type === eTodoEventType.Modified) {
        let firstVersion = acc[0];
        const todo: ITodo = {
            id: ev.data.id,
            title: ev.data.title,
            createdAt: firstVersion.createdAt,
            modifiedAt: ev.createdAt
        }
        acc.push(todo);
    }
    else if(ev.type === eTodoEventType.Deleted) {
        // noop
    }
    else {
        throw 'Cannot scaffold todo version history';
    }

    return acc;
}

function todosFromEventsReducer(acc: ITodo[], ev: ITodoEvent) {
    if(ev.type === eTodoEventType.Created) {
        const todo: ITodo = {
            id: ev.data.id,
            title: ev.data.title,
            createdAt: ev.createdAt,
            modifiedAt: ev.createdAt
        };
        acc.push(todo);
    }
    else if(ev.type === eTodoEventType.Modified) {
        let todo = acc.find(x => x.id === ev.data.id);
        todo.title = ev.data.title;
        todo.modifiedAt = ev.createdAt;
    }
    else if(ev.type === eTodoEventType.Deleted) {
        acc = acc.filter(x => x.id !== ev.data.id);
    }

    return acc;
}

function eventsByDateAscSort(ev1: ITodoEvent, ev2: ITodoEvent) {
    const toTime = (ev: ITodoEvent) => new Date(ev.createdAt).getTime();
    return toTime(ev1) - toTime(ev2);
}

export function formatDate(date: Date) {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}