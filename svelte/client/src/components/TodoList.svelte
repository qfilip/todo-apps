<script lang="ts">
    import Todo from './Todo.svelte';
    import * as backend from '../backend';
	import { onMount } from 'svelte';
    import { getTodos } from '../functions';
    import type { IRemoveTodoRequest, ITodo } from '../models';
    import { todoEvents, modalContainerOpen } from '../stores';
    import type { IModalOptions, ModalName } from '../modal.data';

    let todos: ITodo[] = [];
    
    onMount(() => {
        backend.getAllEvents().then(data => todoEvents.set(data));
        
        todoEvents.subscribe(xs => {
            todos = getTodos(xs);
        });
    });

    function handleViewChanges(event) {
        const todo = { id: event.detail } as ITodo;
        openTodoModal('viewChanges', todo);
    }

    function handleAdd() {
        openTodoModal('addTodo', null);
    }

    function handleEdit(event) {
        openTodoModal('editTodo', event.detail as ITodo);
    }

    function openTodoModal(name: ModalName, data: ITodo) {
        const options = { 
            open: true,
            name: name,
            data: data
        } as IModalOptions;
        
        modalContainerOpen.update(_ => { return options });
    }

    function handleRemove(event) {
        const request = {
            todoId: event.detail
        } as IRemoveTodoRequest;

        backend.removeTodoEventRequest(request)
            .then(data => todoEvents.update((x) => [...x, data]));
    }
</script>

<div>
    <button on:click={handleAdd} class="add-btn">Add</button>
    <div class="todo-grid">
        {#each todos as todo}
            <Todo todo={todo} on:viewChanges={handleViewChanges} on:editTodo={handleEdit} on:removeTodo={handleRemove} />
        {/each}
    </div>
</div>

<style>
    .todo-grid, .add-btn {
        width: 60%;
        margin: 1rem auto;
    }

    .todo-grid {
        display: grid;
        justify-content: space-between;
        grid-template-columns: repeat(auto-fill, 14rem);
        gap: .5rem;
        grid-row-gap: 1rem;
        grid-auto-rows: 1fr;
    }

    .add-btn {
        display: block;
    }
</style>