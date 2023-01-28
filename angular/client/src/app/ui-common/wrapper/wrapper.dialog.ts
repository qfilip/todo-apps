import { Component, Input } from '@angular/core';
import { IDialogOptions } from '../IDialogOptions';

@Component({
    selector: 'app-wrapper-dialog',
    templateUrl: './wrapper.dialog.html',
    styleUrls: ['./wrapper.dialog.scss']
})
export class WrapperDialog {

    @Input('title') title: string;
    constructor() { }

    options: IDialogOptions;
    isVisible: boolean;

    open() {
        this.isVisible = true;
    }

    close() {
        this.isVisible = false;
    }
}
