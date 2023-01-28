import { eTodoEventType, IAddTodoRequest, IEditTodoRequest, IRemoveTodoRequest, ITodo, ITodoEvent } from "./models";

const url = `http://localhost:5000/events`;
const headersJson = { 'Content-Type': 'application/json' };

export function getAllEvents() {
    return fetch(url).then(r => r.json()) as Promise<ITodoEvent[]>;
}

export function addTodoEventRequest(req: IAddTodoRequest) {
    const request: ITodoEvent = {
        id: createId(),
        data: {
            id: createId(),
            title: req.todoTitle
        } as ITodo,
        type: eTodoEventType.Created,
        createdAt: new Date()
    }
    return post(request);
}

export function editTodoEventRequest(req: IEditTodoRequest) {
    const request: ITodoEvent = {
        id: createId(),
        data: {
            id: req.todoId,
            title: req.todoTitle
        } as ITodo,
        type: eTodoEventType.Modified,
        createdAt: new Date()
    }
    return post(request);
}

export function removeTodoEventRequest(req: IRemoveTodoRequest) {
    const request: ITodoEvent = {
        id: createId(),
        data: { id: req.todoId } as ITodo,
        type: eTodoEventType.Modified,
        createdAt: new Date()
    }
    return post(request);
}

function post(event: ITodoEvent) {
    return fetch(url, {
        method: 'POST',
        headers: headersJson,
        body: JSON.stringify(event)
      }).then(r => r.json()) as Promise<ITodoEvent>;
}

function createId() {
    return Math.random().toString(16).substr(2, 8);
}