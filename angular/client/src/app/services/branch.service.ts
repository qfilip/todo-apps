import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { BranchController } from '../controllers/branch.controller';
import { CommitController } from '../controllers/commit.controller';
import { eEntityState } from '../models/enums';
import { IBranch } from '../models/IBranch';
import { ICommit } from '../models/ICommit';
import { DialogService } from '../ui-common/dialog.service';
import { IDialogOptions } from '../ui-common/IDialogOptions';
import { NotificationService } from '../ui-common/notification.service';
import { PageLoaderService } from '../ui-common/page-loader.service';
import * as Utils from '../utils';

@Injectable({
    providedIn: 'root'
})
export class BranchService {

    private branches$: Subject<IBranch[]> = new BehaviorSubject(null);
    private activeBranches$: Subject<IBranch[]> = new BehaviorSubject(null);
    private currentBranch$: Subject<IBranch> = new BehaviorSubject(null);
    
    constructor(
        private branchController: BranchController,
        private commitController: CommitController,
        private dialogService: DialogService,
        private pageLoader: PageLoaderService,
        private notifications: NotificationService
    )
    {
        const getBranches = () => {
            this.branchController.getAll()
            .subscribe(
                result => {
                    this.branches$.next(result);
                    this.branchList = [...result];
                    this.setActiveBranches(result);
                },
                error => {
                    this.dialogService.open({
                        header: 'Warning!',
                        message: 'Failed to obtain branches. App cannot operate. Check database connection and try again.',
                        cancelHidden: true,
                        okLabel: 'Retry',
                        onOk: () => getBranches()
                    } as IDialogOptions);
                }
            );
        }

        getBranches();
    }

    branchList: IBranch[];
    selectedBranch: IBranch;

    get branches() {
        return this.branches$.asObservable();
    }

    getBranches() {
        return this.branchList;
    }
    
    get activeBranches() {
        return this.activeBranches$.asObservable();
    }

    private setActiveBranches(allBranches: IBranch[]) {
        const active = allBranches.filter(x => x.entityState === eEntityState.Active);
        this.activeBranches$.next(active);
    }

    get currentBranch() {
        return this.currentBranch$.asObservable();
    }

    setCurrentBranch(branch: IBranch) {
        this.selectedBranch = branch;
        this.currentBranch$.next(branch);
    }

    getCurrentBranch() {
        return this.selectedBranch;
    }

    createBranch(branch: IBranch) {
        if(branch.name.length < 3) {
            this.notifications.error(`Branch name is too short`);
            return;
        }

        this.pageLoader.show('Creating branch');
        this.getBranchesAndAct((r) => {
            if(r.some(x => x.name === branch.name)) {
                this.notifications.error(`Branch with name '${branch.name}' already exists`);
                return;
            }

            const newBranch: IBranch = {
                id: Utils.Functions.createId(),
                name: branch.name,
                entityState: eEntityState.Active
            }

            this.uploadBranchAndAct(newBranch, (r) => {
                this.notifications.success('Branch created');
                this.getBranchesAndAct((r) => {
                    this.branches$.next(r);
                    this.setActiveBranches(r);
                });
            });
        });
    }

    updateBranch(branch: IBranch) {
        console.log(branch);
        if(branch.name.length < 3) {
            this.notifications.error(`Branch name is too short`);
            return;
        }

        this.patchBranchAndAct(branch, (r) => {
            this.notifications.success('Branch updated');
            this.getBranchesAndAct((r) => {
                this.branches$.next(r);
                this.setActiveBranches(r);
            });
        });
    }

    cloneBranch(branch: IBranch) {
        if(branch.name.length < 3) {
            this.notifications.error(`Branch name is too short`);
            return;
        }

        this.getBranchesAndAct((r) => {
            const clone: IBranch = {
                id: Utils.Functions.createId(),
                name: `${branch.name}-clone`,
                entityState: branch.entityState
            }

            if(r.some(x => x.name === clone.name)) {
                this.notifications.error(`Cannot clone. Branch with name ${clone.name} exists.`);
                return;
            }

            this.uploadBranchAndAct(clone, (_) => {
                this.getBranchCommitsAndAct(branch.id, (r) => {
                    const clonedCommits = r.map(x => {
                        return {
                            ...x,
                            id: Utils.Functions.createId(),
                            branchId: clone.id
                        } as ICommit
                    });
    
                    this.pageLoader.setMessage('Cloning commits');
                    const finalIterationIndex = clonedCommits.length - 1;
    
                    clonedCommits.forEach((x, i) => {
                        this.commitController.push(x).subscribe(
                            result => {
                                if(i === finalIterationIndex) {
                                    this.pageLoader.hide();
                                    this.notifications.success(`All commits cloned`);
                                    
                                    this.getBranchesAndAct((r) => {
                                        this.setActiveBranches(r);
                                        this.branches$.next(r);
                                        this.notifications.info(`Branches refreshed`);
                                    });
                                }
                            },
                            error => {
                                const message = `Commit ${x.id} failed to be uploaded. DB corrupted`;
                                this.pageLoader.hide();
                                this.notifications.error(message);
                            }
                        );
                    });
                });
            });
        });
    }

    private getBranchesAndAct(action: (x: IBranch[]) => void) {
        this.pageLoader.show('Fetching branches');
        this.branchController.getAll()
            .subscribe(
                result => {
                    this.pageLoader.hide();
                    action(result);
                },
                error => {
                    this.pageLoader.hide();
                    this.notifications.error('Failed to load branches');
                }
            );
    }

    private uploadBranchAndAct(payload: IBranch, action: (x: IBranch) => void) {
        this.pageLoader.show('Uploading branch');
        this.branchController.uploadBranch(payload)
            .subscribe(
                result => {
                    this.pageLoader.hide();
                    action(result);
                },
                error => {
                    this.pageLoader.hide();
                    this.notifications.error('Failed to upload branch');
                }
            );
    }

    private patchBranchAndAct(payload: IBranch, action: (x: IBranch) => void) {
        this.pageLoader.show('Patching branch');
        this.branchController.patchBranch(payload)
            .subscribe(
                result => {
                    this.pageLoader.hide();
                    action(result);
                },
                error => {
                    this.pageLoader.hide();
                    this.notifications.error('Failed to patch branch');
                }
            );
    }

    private getBranchCommitsAndAct(branchId: string, action: (cs: ICommit[]) => void) {
        this.pageLoader.show('Getting commits');
        this.commitController.getBranchCommits(branchId)
            .subscribe(
                result => {
                    this.pageLoader.hide();
                    action(result);
                },
                error => {
                    this.pageLoader.hide();
                    this.notifications.error('Failed to get commits');
                }
            );
    }
}
