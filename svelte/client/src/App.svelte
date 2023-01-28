<script lang="ts">
    import TodoList from './components/TodoList.svelte';
    import ModalContainer from './components/ModalContainer.svelte';
</script>

<main>
    <ModalContainer />
	<h1 class="no-select">Todos</h1>
    <TodoList />
</main>

<style>
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

    :global(body) {
        margin: 0;
        padding: 0;
    }

    :global(h1) {
        margin: 0;
		background-color: black;
        color: white;
	}

    :global(button) {
        width: 5rem;
        cursor: pointer;
        transition: .5s;
    }

    :global(button:hover) {
        color: whitesmoke;
        background-color: black;
    }

    :global(.no-select) {
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    h1 {
        text-align: center;
        box-shadow: .1rem .1rem .4rem black;
        transition: .5s;
    }

    h1:hover {
        color: red;
        box-shadow: .1rem .1rem .4rem red;
    }
</style>