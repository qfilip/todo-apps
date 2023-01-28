<script lang="ts">
    import { onMount } from "svelte";
    import type { IModalOptions } from "../modal.data";
    import type { ITodo } from "../models";
    import { modalContainerOpen } from "../stores";
    import TodoAdd from "./TodoAdd.svelte";
    import TodoEdit from "./TodoEdit.svelte";
    import TodoViewChanges from "./TodoViewChanges.svelte";

    let modalOptions: IModalOptions = {
        open: false,
        name: 'addTodo',
        data: null
    };

    const components = [
        { name: 'viewChanges', component: TodoViewChanges },
		{ name: 'addTodo', component: TodoAdd },
		{ name: 'editTodo',   component: TodoEdit   }
	];

    let props = {
        todo: {} as ITodo
    }
    
    let selected;
    
    onMount(() => {
        modalContainerOpen.subscribe(options => {
            modalOptions.open = options.open;
            props = { todo: options.data };
            selected = components.find(x => x.name === options.name);
        });
    });
</script>

{#if modalOptions.open}
	<div class="modal-background">
        <div class="modal-container">
            <svelte:component this={selected.component} {...props }/>
        </div>
    </div>
{/if}

<style>
    .modal-background {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #00000099;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-container {
        position: relative;
        border-style: double;
        border-color: black;
        background-color: whitesmoke;
        color: black;
        min-width: 50%;
        min-height: 30%;
    }
</style>