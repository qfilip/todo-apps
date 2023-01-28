import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IBranch } from 'src/app/models/IBranch';
import { BranchService } from 'src/app/services/branch.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    private subscribed = true;

    constructor(private branchService: BranchService) { }

    ngOnInit(): void {
        this.branchService.activeBranches
        .pipe(takeWhile(() => this.subscribed))
        .subscribe(x => {
            if(x) {
                this.branches = x;
                this.setCurrentBranch(x[0].id);
            }
        });
    }

    branches: IBranch[];
    currentbranch: IBranch;

    onBranchSelected(e: any) {
        this.setCurrentBranch(e.target.value);
    }

    private setCurrentBranch(branchId: string) {
        this.currentbranch = this.branches.find(x => x.id === branchId);
        this.branchService.setCurrentBranch(this.currentbranch);
    }

    ngOnDestroy(): void {
        this.subscribed = false;
    }
}
