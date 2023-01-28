<script lang="ts">
    import type { IAddTodoRequest, ITodo } from "../models";
    import * as backend from '../backend';
    import { todoEvents, modalContainerOpen } from '../stores';
    import type { IModalOptions } from "../modal.data";

    let todo = { title: '' } as ITodo;

    const close = { open: false } as IModalOptions;

    function addTodo(ev) {
        ev.preventDefault();
        const title = ev.srcElement[0].value;

        const request = {
            todoTitle: title
        } as IAddTodoRequest;


        backend.addTodoEventRequest(request)
            .then(resp => {
                todoEvents.update((xs) => [...xs, resp]);
                modalContainerOpen.set(close);
            });
    }

    function onClose() {
        modalContainerOpen.set(close);
    }
</script>

<div class="header">Add</div>

<form on:submit={addTodo}>
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