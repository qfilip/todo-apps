<script lang="ts">
    import type { IEditTodoRequest, ITodo } from "../models";
    import * as backend from '../backend';
    import { todoEvents, modalContainerOpen } from '../stores';
    import type { IModalOptions } from "../modal.data";

    export let todo: ITodo;

    const close = { open: false } as IModalOptions;

    function editTodo(ev) {
        ev.preventDefault();
        const title = ev.srcElement[0].value;

        const request = {
            todoId: todo.id,
            todoTitle: title
        } as IEditTodoRequest;


        backend.editTodoEventRequest(request)
            .then(resp => {
                todoEvents.update((xs) => [...xs, resp]);
                modalContainerOpen.set(close);
            });
    }

    function onClose() {
        modalContainerOpen.set(close);
    }
</script>

<div class="header">Edit</div>
<form on:submit={editTodo}>
    <div class="body">
        <label>Title: <input type="text" value={todo.title} /></label>
    </div>
    <div class="footer">
        <button type="submit">Submit</button>
        <button on:click={onClose}>Close</button>
    </div>
</form>
<style>
    .header {
        text-align: center;
        background-color: black;
        color: whitesmoke;
        font-size: 1.3rem;
    }

    .body, .footer {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .body {
        margin: .5rem 0rem;
        padding: 1rem;
    }

    .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
    }
</style>