import { writable } from 'svelte/store';
import type { IModalOptions } from './modal.data';
import type { ITodoEvent } from './models';

export const todoEvents = writable<ITodoEvent[]>([]);

export const modalContainerOpen = writable<IModalOptions>({ open: false, name: 'addTodo', data: null });