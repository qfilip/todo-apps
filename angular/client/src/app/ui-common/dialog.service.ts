import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IDialogOptions } from './IDialogOptions';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private dialogOptions$: Subject<IDialogOptions> = new BehaviorSubject(null);
    
    constructor() { }

    open(options: IDialogOptions) {
        this.dialogOptions$.next(options);
    }

    get dialogOptions() {
        return this.dialogOptions$.asObservable();
    }
}
