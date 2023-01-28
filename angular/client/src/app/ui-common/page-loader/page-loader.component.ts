import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { PageLoaderService } from '../page-loader.service';

@Component({
    selector: 'app-page-loader',
    templateUrl: './page-loader.component.html',
    styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent implements OnInit, OnDestroy {

    private subsrcibed = true;
    constructor(private pageLoaderService: PageLoaderService) { }

    ngOnInit(): void {
        this.pageLoaderService.isLoading
            .pipe(takeWhile(() => this.subsrcibed))
            .subscribe(x => this.isLoading = x);

        this.pageLoaderService.message
            .pipe(takeWhile(() => this.subsrcibed))
            .subscribe(x => this.message = x);
    }

    isLoading: boolean = false;
    message: string;

    ngOnDestroy(): void {
        this.subsrcibed = false;
    }
}
