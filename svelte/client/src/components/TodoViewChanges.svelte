<script lang="ts">
    import { onMount } from "svelte";
    import type { ITodo, ITodoEvent } from "../models";
    import { getTodoVersions } from '../functions';
    import { todoEvents, modalContainerOpen } from '../stores';
    import type { IModalOptions } from "../modal.data";
    import Todo from "./Todo.svelte";

    export let todo: ITodo;

    let todos: ITodo[] = [];

    const close = { open: false } as IModalOptions;

    onMount(() => todoEvents.subscribe(xs => mapTodoVersions(xs)));
    
    function mapTodoVersions(xs: ITodoEvent[]) {
        todos = getTodoVersions(xs, todo.id);
    }

    function onClose() {
        modalContainerOpen.set(close);
    }
</script>

<div class="header">Todo Changes</div>
<div class="body">
    {#each todos as todo}
        <div>
            <Todo todo={todo} showButtons={false} />
        </div>
    {/each}
</div>
<div class="footer">
    <button on:click={onClose}>Close</button>
</div>

<style>
    .header {
        text-align: center;
        background-color: black;
        color: whitesmoke;
        font-size: 1.3rem;
    }

    .body, .footer {
        display: flex;
    }

    .body {
        flex-direction: column;
        align-items: center;
        
        margin: .5rem 0rem;
        padding: 1rem;
        min-height: 20rem;
        max-height: 20rem;
        overflow-y: auto;
    }

    .body > div {
        margin-bottom: .5rem;
    }

    .footer {
        justify-content: center;
        align-items: center;

        position: absolute;
        width: 100%;
        bottom: 0;
    }
</style>