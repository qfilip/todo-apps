import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatestWith, Subject, takeWhile } from 'rxjs';
import { CommitController } from '../controllers/commit.controller';
import { ICommit } from '../models/ICommit';
import { ITodoEvent } from '../models/ITodoEvents';
import { DialogService } from '../ui-common/dialog.service';
import { IDialogOptions } from '../ui-common/IDialogOptions';
import { NotificationService } from '../ui-common/notification.service';
import { PageLoaderService } from '../ui-common/page-loader.service';
import * as Utils from '../utils';
import { BranchService } from './branch.service';

@Injectable({
    providedIn: 'root'
})
export class CommitService implements OnDestroy {

    private subsrcibed = true;
    private commits$: Subject<ICommit[]> = new BehaviorSubject(null);
    private remoteCommits$: Subject<ICommit[]> = new BehaviorSubject(null);
    private localCommits$: Subject<ICommit[]> = new BehaviorSubject(null);
    private localChanges$: Subject<ITodoEvent[]> = new BehaviorSubject(null);

    constructor(
        private branchService: BranchService,
        private commitController: CommitController,
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
                    this.clearEventsForCurrentBranch();
                    this.getCurrentBranchRemoteCommits();
                }
            });
    }

    private branchEventsMap: { [branchId: string]: ITodoEvent[] } = {};
    private currentBranchId: string;
    private commitList: ICommit[] = [];
    private localCommitList: ICommit[] = [];
    private remoteCommitList: ICommit[] = [];

    get commits() {
        return this.commits$.asObservable();
    }

    getCommitList() {
        return this.commitList;
    }

    setCommits() {
        this.commitList = this.localCommitList.concat(this.remoteCommitList);
        this.commits$.next(this.commitList);
    }

    get remoteCommits() {
        return this.remoteCommits$.asObservable();
    }

    getRemoteCommitList() {
        return this.remoteCommitList;
    }

    get localCommits() {
        return this.localCommits$.asObservable();
    }

    setLocalCommits(commits: ICommit[]) {
        this.localCommitList = [...commits];
        this.localCommits$.next(commits);
    }

    getLocalCommitsList() {
        return this.localCommitList;
    }

    clearLocalCommits() {
        this.localCommitList = [];
        this.localCommits$.next([]);
        this.setCommits();
    }

    get localChanges() {
        return this.localChanges$.asObservable();
    }

    clearLocalChanges() {
        this.localChanges$.next([]);
    }

    clearLocalCommitsForCurrentBranch() {
        this.localCommitList = this.localCommitList.filter(x => x.branchId !== this.currentBranchId);
        this.localCommits$.next(this.localCommitList);
    }

    getBranchRemoteCommits(branchId: string) {
        this.pageLoader.show('Getting commits');

        this.commitController.getBranchCommits(branchId)
        .subscribe(
            result => {
                this.remoteCommitList = result;
                this.remoteCommits$.next(result);
                this.setCommits();
                this.pageLoader.hide();
            },
            error => {
                this.notification.error('Failed to load commits');
                this.pageLoader.hide();
            }
        )
    }

    getCurrentBranchRemoteCommits() {
        this.getBranchRemoteCommits(this.currentBranchId);
    }

    addEvent(ev: ITodoEvent) {
        this.branchEventsMap[this.currentBranchId].push(ev as ITodoEvent);
        this.localChanges$.next(this.branchEventsMap[this.currentBranchId]);
    }

    commit() {
        const count = this.branchEventsMap[this.currentBranchId].length;

        if(count === 0) {
            this.notification.info('No changes to commit');
            return;
        }

        const o = {
            header: 'Sanity check',
            message: 'Are you sure that you want to commit these changes?',
            onOk: () => { this.handleCommit(); }
        } as IDialogOptions;

        this.dialogService.open(o);
    }

    private handleCommit() {
        this.pageLoader.show('Commit in progress');

        const commit = {
            id: Utils.Functions.createId(),
            branchId: this.currentBranchId,
            events: this.branchEventsMap[this.currentBranchId],
            createdAt: new Date()
        } as ICommit;

        this.addLocalCommit(commit);
        this.clearLocalChanges();
        this.clearEventsForCurrentBranch();
        
        this.pageLoader.hide();
        this.notification.info('Changes commited');
    }

    private addLocalCommit(commit: ICommit) {
        this.localCommitList.push(commit);
        this.localCommits$.next(this.localCommitList);
        this.setCommits();
    }

    private clearEventsForCurrentBranch() {
        this.branchEventsMap[this.currentBranchId] = [];
        this.localChanges$.next([]);
    }

    ngOnDestroy() {
        this.subsrcibed = false;
    }
}
