import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, takeWhile } from 'rxjs';
import { eEntityState } from 'src/app/models/enums';
import { IBranch } from 'src/app/models/IBranch';
import { ICommit } from 'src/app/models/ICommit';
import { BranchService } from 'src/app/services/branch.service';
import { CommitService } from 'src/app/services/commit.service';
import { WrapperDialog } from 'src/app/ui-common/wrapper/wrapper.dialog';

@Component({
    selector: 'app-branch-manager-dialog',
    templateUrl: './branch-manager.dialog.html',
    styleUrls: ['./branch-manager.dialog.scss']
})
export class BranchManagerDialog implements OnInit {

    @ViewChild('dialogWrapper') dialogWrapper: WrapperDialog;

    private subscribed: boolean = true;
    
    constructor(
        private branchService: BranchService,
        private commitService: CommitService
    ) { }

    ngOnInit(): void {
        this.observe(this.branchService.activeBranches, (x) => {
            this.branches = x;
            this.selectBranch(x[0].id);
        });

    }

    _entityState = eEntityState;
    branches: IBranch[];
    selectedBranch: IBranch;
    selectedBranchIsActive: boolean;
    
    branchCommits: ICommit[];

    setSelectedBranch(ev: any) {
        this.selectBranch(ev.target.value);
    }

    private selectBranch(id: string) {
        const clone = (x: IBranch) => JSON.parse(JSON.stringify(x));

        this.selectedBranch = clone(this.branches.find(x => x.id === id));
        this.selectedBranchIsActive = this.selectedBranch.entityState === eEntityState.Active;
        this.branchCommits = this.commitService.getCommitList().filter(x => x.branchId === id);
    }

    toggleBranchIsActive(ev: any) {
        this.selectedBranchIsActive = ev.target.checked;
        
        if(this.selectedBranchIsActive) {
            this.selectedBranch.entityState = eEntityState.Active;
        }
        else {
            this.selectedBranch.entityState = eEntityState.Deleted;
        }
    }

    createBranch() {
        this.branchService.createBranch(this.selectedBranch);
    }

    updateBranch() {
        this.branchService.updateBranch(this.selectedBranch);
    }

    cloneBranch() {
        this.branchService.cloneBranch(this.selectedBranch);
    }

    open() {
        this.branchCommits = this.commitService.getCommitList().filter(x => x.branchId === this.selectedBranch.id);
        this.dialogWrapper.open();
    }

    private observe<T>(o: Observable<T>, onUpdate: (data: T) => void) {
        o.pipe(takeWhile(() => this.subscribed))
        .subscribe(x => {
            if(x) {
                onUpdate(x);
            }
        });
    }
}
