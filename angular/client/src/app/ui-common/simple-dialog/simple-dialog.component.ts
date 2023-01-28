import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { DialogService } from '../dialog.service';
import { IDialogOptions } from '../IDialogOptions';

@Component({
    selector: 'app-simple-dialog',
    templateUrl: './simple-dialog.component.html',
    styleUrls: ['./simple-dialog.component.scss']
})
export class SimpleDialogComponent implements OnInit, OnDestroy {

    constructor(private dialogService: DialogService) { }
    
    ngOnInit(): void {
        this.dialogService.dialogOptions
        .pipe(takeWhile(() => this.subscribed))
        .subscribe(x => {
            if(x) {
                this.open(x);
            }
        })
    }

    private subscribed = true;
    
    options: IDialogOptions;
    isVisible: boolean;
    
    private open(options: IDialogOptions) {
        this.options = {
            header: options.header ?? 'Info',
            message: options.message ?? 'Proceed?',
            cancelHidden: options.cancelHidden,
            okLabel: options.okLabel ?? 'OK',
            cancelLabel: options.cancelLabel ?? 'Cancel', 
            onOk: options.onOk ?? (() => {}),
            onCancel: options.onCancel ?? (() => {}),
        };
        
        this.isVisible = true;
    }


    close(isOk) {
        if(isOk) this.options.onOk();
        else this.options.onCancel();

        this.isVisible = false;
    }

    ngOnDestroy() {
        this.subscribed = false;
    }
}
