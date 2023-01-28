import { Component, OnInit, ViewChild } from '@angular/core';
import { lastValueFrom, takeWhile } from 'rxjs';
import { BranchController } from 'src/app/controllers/branch.controller';
import { CommitController } from 'src/app/controllers/commit.controller';
import { eEntityState } from 'src/app/models/enums';
import { IBranch } from 'src/app/models/IBranch';
import { ICommit } from 'src/app/models/ICommit';
import { ITodo, ITodoDiffs, ITodoStatePreview } from 'src/app/models/ITodo';
import { BranchService } from 'src/app/services/branch.service';
import { CommitService } from 'src/app/services/commit.service';
import { PullService } from 'src/app/services/pull.service';
import { TodoService } from 'src/app/services/todo.service';
import { WrapperDialog } from 'src/app/ui-common/wrapper/wrapper.dialog';

@Component({
    selector: 'app-pull-dialog',
    templateUrl: './pull.dialog.html',
    styleUrls: ['./pull.dialog.scss']
})
export class PullDialog implements OnInit {

    @ViewChild('dialogWrapper') dialogWrapper: WrapperDialog;

    constructor(
        private commitController: CommitController,
        private branchService: BranchService,
        private pullService: PullService,
        private todoService: TodoService,
        private commitService: CommitService
    ) { }

    ngOnInit(): void {
        this.branchService.activeBranches
        .pipe(takeWhile(() => true))
        .subscribe(x => {
            if(x) {
                this.branches = x;
            }
        });
    }

    currentBranch: IBranch;
    selectedBranch: IBranch;
    branches: IBranch[];

    localTodoStates: ITodoStatePreview[];
    pulledTodoStates: ITodoStatePreview[];
    diffs: ITodoDiffs;

    open() {
        this.currentBranch = this.branchService.getCurrentBranch();
        this.selectedBranch = this.branches[0];

        this.dialogWrapper.open();
    }

    setSelectedBranch(ev: any) {
        const id = ev.target.value;
        this.selectedBranch = this.branches.find(x => x.id === id);
    }

    pull() {
        lastValueFrom(this.commitController.getBranchCommits(this.selectedBranch.id))
        .then(result => this.displayDifferences(result))
        .catch(e => console.error(e));
    }

    displayDifferences(pulledCommits: ICommit[]) {
        const localCommits = this.commitService.getCommitList()
            .filter(x => x.branchId === this.currentBranch.id);

        const eventMaps = this.pullService.getEventMaps(localCommits, pulledCommits);
        
        const localTodoStates = eventMaps.localEventsMap.map(x => {
            return this.todoService.getTodoStatePreview(x.events);
        });

        const pulledTodoStates = eventMaps.pulledEventsMap.map(x => {
            return this.todoService.getTodoStatePreview(x.events);
        });

        const localTodoIds = localTodoStates.map(x => x.todo.id);
        const pulledTodoIds = pulledTodoStates.map(x => x.todo.id);

        const commonIds = pulledTodoIds.filter(x => localTodoIds.includes(x));
        const localSpecificIds = localTodoIds.filter(x => !commonIds.includes(x));
        const pulledSpecificIds = pulledTodoIds.filter(x => !commonIds.includes(x));

        const differ: ITodoDiffs = {
            related: [],
            unrelated: []
        };

        const diffExists = (a: ITodoStatePreview, b: ITodoStatePreview) => {
            const result =
                a.state !== b.state ||
                a.todo.title !== b.todo.title ||
                a.todo.details !== b.todo.details ||
                a.todo.dueDate.getTime() !== b.todo.dueDate.getTime();

            return result;
        }

        commonIds.map(x => {
            const local = localTodoStates.find(s => s.todo.id === x);
            const pulled = pulledTodoStates.find(s => s.todo.id === x);
            if(diffExists(local, pulled)) {
                differ.related.push({ local: local, remote: pulled });
            }
        });

        this.diffs = {...differ};
    }
}
