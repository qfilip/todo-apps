import { Component, Input, OnInit } from '@angular/core';
import { ITodoStatePreview } from 'src/app/models/ITodo';

@Component({
    selector: 'app-todo-state-preview',
    templateUrl: './todo-state-preview.component.html',
    styleUrls: ['./todo-state-preview.component.scss']
})
export class TodoStatePreviewComponent implements OnInit {

    @Input('preview') preview: ITodoStatePreview;
    
    constructor() { }

    ngOnInit(): void {
    }

}
