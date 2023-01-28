import { Component } from '@angular/core';
import { CommitController } from './controllers/commit.controller';
import { ICommit } from './models/ICommit';
import { ITodoCreated, ITodoDetailsChanged, ITodoEvent, ITodoTitleChanged } from './models/ITodoEvents';
import * as Utils from './utils';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    
}
