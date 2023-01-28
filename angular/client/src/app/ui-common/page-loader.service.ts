import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PageLoaderService {

    private isLoading$: Subject<boolean> = new BehaviorSubject(false);
    private message$: Subject<string> = new BehaviorSubject(null);

    constructor() { }

    show(message: string = null) {
        message = message ?? 'Loading...';
        this.message$.next(message);
        this.isLoading$.next(true);
    }

    setMessage(message: string) {
        this.message$.next(message);
    }

    hide() {
        this.isLoading$.next(false);
    }

    get isLoading() {
        return this.isLoading$.asObservable();
    }

    get message() {
        return this.message$.asObservable();
    }
}
