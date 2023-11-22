var DomHandler = (() => {
    const byId = (id) => document.getElementById(id);
    const makeElWithText = (el, text) => {
        const element = document.createElement(el);
        element.innerText = text;
        
        return element;
    };

    // common elements
    const dialogEl = byId('todo-dialog');
    const dialogElLegend = byId('todo-legend');
    const dialogOkBtn = byId('dialog-ok-btn');
    const todoListEl = byId('todo-list');

    
    // functions - todo
    function renderAllTodos(todos, historyFn, editFn, deleteFn) {
        const fragment = document.createDocumentFragment();
        
        todos.forEach(x => {
            
            const bindFn = (btn, targetFn, arg) => {
                btn.onclick = targetFn.bind(btn, arg);
            }

            const historyBtn = makeElWithText('button', 'View history');
            bindFn(historyBtn, historyFn, x.id);

            const editBtn = makeElWithText('button', 'Edit');
            bindFn(editBtn, editFn, x);

            const deleteBtn = makeElWithText('button', 'Delete');
            bindFn(deleteBtn, deleteFn, x);
            
            const div = document.createElement('div');
            div.classList.add('todo');
            
            [
                makeElWithText('h2', x.title),
                makeElWithText('p', x.description),
                makeElWithText('time', x.createdAt),
                historyBtn,
                editBtn,
                deleteBtn
            ].forEach(node => div.append(node));

            fragment.append(div);
        });


        todoListEl.innerHTML = '';
        todoListEl.append(fragment);
    }

    // functions - dialog
    function openDialog(dialogConf) {
        if(dialogConf.type === 'create') {
            dialogElLegend.innerText = 'Create Todo';
            dialogOkBtn.innerText = 'Create';
        }
        if(dialogConf.type === 'edit') {
            dialogElLegend.innerText = 'Edit Todo';
            dialogOkBtn.innerText = 'Edit';
            byId('todo-title').value = dialogConf.todo.title;
            byId('todo-description').value = dialogConf.todo.description;
        }
        
        dialogOkBtn.onclick = dialogConf.okAction;
        dialogEl.setAttribute('open', null);
    }
    
    function closeDialog() {
        dialogEl.removeAttribute('open');
        setDialogErrors([]);
        byId('todo-title').value = '';
        byId('todo-description').value = '';
    }


    function setDialogErrors(errs) {
        const errsDiv = byId('todo-errors');
        errsDiv.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        errs.forEach(x => {
            const errDiv = document.createElement('div');
            errDiv.classList.add('todo-error');
            errDiv.innerText = x;
    
            fragment.append(errDiv);
        });
    
        errsDiv.append(fragment);
    }

    // functions history
    function openHistoryDialog(todoVersions) {
        const legendText = `${todoVersions[todoVersions.length - 1].title} - history`;
        byId('todo-history-legend').innerText = legendText;
        let div = byId('todo-history-todo');
        div.innerHTML = '';

        const fragment = document.createDocumentFragment('div');
        todoVersions.forEach(x => {
            const todoDiv = document.createElement('div');
            
            todoDiv.classList.add('todo');
            [
                makeElWithText('h2', x.title),
                makeElWithText('p', x.description),
                makeElWithText('time', x.createdAt)
            ].forEach(node => todoDiv.append(node));
            
            fragment.append(todoDiv);
        });

        div.append(fragment);

        const dialog = byId('todo-history-dialog');
        dialog.setAttribute('open', null);
    }

    function closeHistoryDialog() {
        const dialog = byId('todo-history-dialog');
        dialog.removeAttribute('open');
    }
    

    return {
        common: {
            byId: byId
        },
        todo: {
            renderAll: renderAllTodos
        },
        dialog: {
            open: openDialog,
            close: closeDialog,
            setErrors: setDialogErrors
        },
        historyDialog: {
            open: openHistoryDialog,
            close: closeHistoryDialog
        }
    };
})()