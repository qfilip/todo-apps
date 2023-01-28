<script lang="ts">
    import * as funcs from '../functions';
    import type { ITodo } from '../models';
    import { createEventDispatcher } from 'svelte';

    export let todo: ITodo;
    export let showButtons: boolean = true;

	let dispatch = createEventDispatcher();

    function viewChanges() {
        dispatch('viewChanges', todo.id);
    }
    
    function editTodo() {
        dispatch('editTodo', todo);
    }

    function removeTodo() {
        dispatch('removeTodo', todo.id);
    }
</script>

<div class="todo-container">
    <strong>{ todo.title }</strong>
    <div class="no-select">
        <time>
            <span>Created at:</span>
            <span>{ funcs.formatDate(todo.createdAt) }</span>
        </time>
        <time>
            <span>Modified at:</span>
            <span>{ funcs.formatDate(todo.modifiedAt) }</span>
        </time>
    </div>
    {#if showButtons}
        <div class="btn-container">
            <button on:click={viewChanges}>History</button>
            <button on:click={editTodo}>Edit</button>
            <button on:click={removeTodo}>Delete</button>
        </div>
    {/if}
</div>

<style>
    .todo-container {
        padding: .5rem;
        border: 1px solid black;
        box-shadow: 1px 1px 5px black;
    }

    strong {
        font-size: 1.5rem;
    }

    .todo-container > div {
        margin-top: .5rem;
    }

    time {
        display: flex;
        justify-content: space-between;
    }

    .btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>