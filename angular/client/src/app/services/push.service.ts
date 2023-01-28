import { Injectable, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs';
import { CommitController } from '../controllers/commit.controller';
import { ICommit } from '../models/ICommit';
import { DialogService } from '../ui-common/dialog.service';
import { IDialogOptions } from '../ui-common/IDialogOptions';
import { NotificationService } from '../ui-common/notification.service';
import { PageLoaderService } from '../ui-common/page-loader.service';
import { BranchService } from './branch.service';
import { CommitService } from './commit.service';

@Injectable({
    providedIn: 'root'
})
export class PushService implements OnDestroy {
    private subsrcibed = true;

    constructor(
        private branchService: BranchService,
        private commitController: CommitController,
        private commitService: CommitService,
        private notification: NotificationService,
        private pageLoader: PageLoaderService,
        private dialogService: DialogService
    )
    {
        this.branchService.currentBranch
            .pipe(takeWhile(() => this.subsrcibed))
            .subscribe(b => {
                if(b) {
                    this.currentBranchId = b.id;
                }
            });

        this.commitService.localCommits
            .pipe(takeWhile(() => this.subsrcibed))
            .subscribe(x => {
                if(x) {
                    this.localCommits = x;
                }
            });

        this.commitService.remoteCommits
            .pipe(takeWhile(() => this.subsrcibed))
            .subscribe(x => {
                if(x) {
                    this.remoteCommits = x;
                }
            });
    }

    private currentBranchId: string;
    private localCommits: ICommit[] = [];
    private remoteCommits: ICommit[] = [];

    push() {
        const count = this.localCommits
            .filter(x => x.branchId === this.currentBranchId).length;

        if(count === 0) {
            this.notification.info('No changes to push');
            return;
        }

        const o = {
            header: 'Sanity check',
            message: 'Are you sure that you want to push these commits?',
            onOk: () => { this.handlePush(); }
        } as IDialogOptions;

        this.dialogService.open(o);
    }

    private handlePush() {
        this.pageLoader.show('Preparing to push');

        const commitsToPush = this.localCommits
            .filter(x => x.branchId === this.currentBranchId);

        if(commitsToPush.length === 0) {
            this.pageLoader.hide();
            this.notification.info('No commits found for pushing');
            return;
        }

        this.pageLoader.setMessage('Comparing differences');
        
        this.commitController.getAll()
        .subscribe(
            result => {
                const remoteCommitIds = result
                    .filter(x => x.branchId === this.currentBranchId)
                    .map(x => x.id);
                
                const combinedCommitIds = this.remoteCommits
                    .concat(commitsToPush)
                    .map(x => x.id);

                const diff = remoteCommitIds.filter(x => !combinedCommitIds.includes(x));

                if(diff.length === 0) {
                    this.pushCommits(commitsToPush);
                    return;
                }

                this.pageLoader.hide();
                this.dialogService.open({
                    message: 'Upstream commits not merged. Cannot push. Pull the data first',
                    cancelHidden: true
                } as IDialogOptions);
            },
            _ => {
                this.pageLoader.hide();
                this.notification.info('Failed to load data');
            }
        );

        this.pageLoader.hide();
    }

    private pushCommits(commits: ICommit[]) {
        this.pageLoader.setMessage('Pushing');
        const finalIterationIndex = commits.length - 1;

        commits.forEach((x, i) => {
            this.commitController.push(x).subscribe(
                result => {
                    this.localCommits = this.localCommits.filter(c => c.id !== x.id);
                    this.notification.success(`Commit ${x.id} pushed`);

                    if(i === finalIterationIndex) {
                        this.commitService.clearLocalChanges();
                        this.commitService.clearLocalCommitsForCurrentBranch();
                        this.commitService.getCurrentBranchRemoteCommits();
                        this.pageLoader.hide();
                        this.notification.success(`All commits pushed`);
                    }
                },
                error => {
                    const message = `Commit ${x.id} failed to be uploaded. DB corrupted`;
                    this.notification.error(message);
                }
            );
        });
    }


    ngOnDestroy() {
        this.subsrcibed = false;
    }
}