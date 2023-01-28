import { Component, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs';
import { eTodoEventType } from 'src/app/models/enums';
import { IBranch } from 'src/app/models/IBranch';
import { ICommit } from 'src/app/models/ICommit';
import { ITodoEvent } from 'src/app/models/ITodoEvents';
import { BranchService } from 'src/app/services/branch.service';
import { CommitService } from 'src/app/services/commit.service';
import { PushService } from 'src/app/services/push.service';
import { BranchManagerDialog } from '../dialogs/branch-manager/branch-manager.dialog';
import { PullDialog } from '../dialogs/pull/pull.dialog';

@Component({
    selector: 'app-action-panel',
    templateUrl: './action-panel.component.html',
    styleUrls: ['./action-panel.component.scss']
})
export class ActionPanelComponent implements OnInit {

    @ViewChild('branchManagerDialog') branchManagerDialog: BranchManagerDialog;
    @ViewChild('pullDialog') pullDialog: PullDialog;
    
    private subsrcibed = true;
    
    constructor(
        private branchService: BranchService,
        private commitService: CommitService,
        private pushService: PushService
    ) { }

    ngOnInit(): void {
        
        this.branchService.currentBranch
        .pipe(takeWhile(() => this.subsrcibed))
        .subscribe(b => {
            if(b) {
                this.currentBranch = b;
                this.localCommits = this.commitService.getLocalCommitsList()
                    .filter(x => x.branchId === this.currentBranch.id);
            }
        });
        
        this.commitService.localChanges
        .pipe(takeWhile(() => this.subsrcibed))
        .subscribe(x => {
            if(x) {
                this.localChanges = x;
            }
        });

        this.commitService.localCommits
        .pipe(takeWhile(() => this.subsrcibed))
        .subscribe(x => {
            if(x) {
                this.localCommits = x.filter(c => c.branchId === this.currentBranch.id);
            }
        });
    }

    currentBranch: IBranch;
    localChanges: ITodoEvent[];
    localCommits: ICommit[];
    _eventType = eTodoEventType;

    commitChanges() {
        this.commitService.commit();
    }

    pushChanges() {
        this.pushService.push();
    }

    openBranchManagerDialog() {
        this.branchManagerDialog.open();
    }
}
