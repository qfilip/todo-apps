var TodoFns = (() => {

    // create
    function openCreateTodoDialog() {
        const dialogConfig = {
            type: 'create',
            todo: null,
            okAction: () => {
                fireCreateEvent();
            }
        }
        
        DomHandler.dialog.open(dialogConfig);
    }

    function fireCreateEvent() {
        const title = DomHandler.common.byId('todo-title').value;
        const description = DomHandler.common.byId('todo-description').value;
        const createdAt = new Date();

        if(!title) {
            DomHandler.dialog.setErrors(['Title cannot be empty']);
            return;
        }
    
        const todoEvent = {
            type: 'create',
            time: new Date(),
            todo: {
                id: Utils.makeId(),
                title: title,
                description: description,
                createdAt: createdAt
            }
        };

        AppState.todo.fireEvent(todoEvent);
        DomHandler.dialog.close();
    }

    // history
    function viewHistory(todoId) {
        const allEvents = AppState.todo.getEvents();
        
        const todoEvents =
            getEventsForTodo(allEvents, todoId)
            .sort((a, b) => a.time - b.time);

        let versionEvents = [];
        todoEvents.forEach((_, i) => {
            const iVersionEvents = todoEvents.filter((_, idx) => idx <= i);
            versionEvents.push(iVersionEvents);
        });
        
        let todoVersions = [];
        versionEvents.forEach(iVersionEvents => {
            const iTodoVersion = getTodosFromEvents(iVersionEvents)[0];
            todoVersions.push(iTodoVersion);
        });
        
        DomHandler.historyDialog.open(todoVersions);
    }

    // edit
    function openEditDialog(todo) {
        const dialogConfig = {
            type: 'edit',
            todo: todo,
            okAction: () => {
                fireEditEvent(todo);
            }
        }

        DomHandler.dialog.open(dialogConfig);
    }

    function fireEditEvent(todo) {
        const title = DomHandler.common.byId('todo-title').value;
        const description = DomHandler.common.byId('todo-description').value;

        if(!title) {
            DomHandler.dialog.setErrors(['Title cannot be empty']);
            return;
        }

        const updated = {...todo, title: title, description: description };

        const todoEvent = {
            type: 'edit',
            time: new Date(),
            todo: updated
        }

        AppState.todo.fireEvent(todoEvent);
        DomHandler.dialog.close();
    }

    // delete
    function fireDeleteEvent(todo) {
        const todoEvent = {
            type: 'delete',
            time: new Date(),
            todo: todo
        };

        AppState.todo.fireEvent(todoEvent);
    }

    // common
    function getTodosFromEvents(events) {
        return events
            .sort((a, b) => a.time - b.time)
            .reduce((todos, ev) => {
                if(ev.type === 'create') {
                    const todo = Utils.cloneTodo(ev.todo);
                    return [...todos, todo];
                }

                if(ev.type === 'edit') {
                    let todo = todos.find(x => x.id === ev.todo.id);
                    todo.title = ev.todo.title;
                    todo.description = ev.todo.description;

                    return todos;
                }

                if(ev.type === 'delete') {
                    return todos.filter(x => x.id !== ev.todo.id);
                }
            }, []);
    }

    function getEventsForTodo(allEvents, todoId) {
        return allEvents
            .sort((a, b) => a.time - b.time)
            .reduce((todoEvents, ev) => {
                const events = ev.todo.id === todoId ?
                    [...todoEvents, ev] : todoEvents;

                return events;
            }, []);
    }

    function todoEventHandler() {
        const todos = getTodosFromEvents(AppState.todo.getEvents());
        const sortedTodos = todos.sort((a, b) => b.createdAt - a.createdAt);
        
        DomHandler.todo.renderAll(sortedTodos, viewHistory, openEditDialog, fireDeleteEvent);
    }

    AppState.todo.onEventFired(todoEventHandler);

    return {
        openCreateTodoDialog: openCreateTodoDialog,
    };
})()

