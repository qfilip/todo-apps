var AppState = (() => {
    let todoEvents = [];
    let todoCallbacks = [];
    
    function onTodoEventFired(callback) {
        todoCallbacks.push(callback);
    }

    function fireTodoEvent(todoEvent) {
        todoEvents.push(todoEvent);
        todoCallbacks.forEach(fn => fn());
    }

    function getTodoEvents() {
        return todoEvents;
    }

    return {
        todo: {
            onEventFired: onTodoEventFired,
            fireEvent: fireTodoEvent,
            getEvents: getTodoEvents
        }
    }
})()