import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { BranchController } from 'src/app/controllers/branch.controller';
import { CommitController } from 'src/app/controllers/commit.controller';
import { eTodoEventType } from 'src/app/models/enums';
import { IBranch } from 'src/app/models/IBranch';
import { ICommit } from 'src/app/models/ICommit';
import { ITodoCreated, ITodoDetailsChanged, ITodoEvent, ITodoTitleChanged } from 'src/app/models/ITodoEvents';
import { BranchService } from 'src/app/services/branch.service';
import { TodoService } from 'src/app/services/todo.service';
import { DialogService } from 'src/app/ui-common/dialog.service';
import { IDialogOptions } from 'src/app/ui-common/IDialogOptions';
import { NotificationService } from 'src/app/ui-common/notification.service';
import * as Utils from '../../utils';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {

    constructor(
        private branchController: BranchController,
        private commitController: CommitController,
        private branchService: BranchService,
        private todoService: TodoService,
        private dialogService: DialogService,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        this.branchService.activeBranches
            .pipe(takeWhile(() => true))
            .subscribe(x => {
                if(x) {
                    this.branches = x;
                }
            });
    }

    private branches: IBranch[];

    testPost() {
        const todoId = Utils.Functions.createId();
        let evs = [
            {
                id: Utils.Functions.createId(),
                todo: {
                    id: todoId,
                    title: 'Example Todo 1',
                    details: 'Details for Example Todo 1',
                    dueDate: new Date()
                },
                type: eTodoEventType.Created,
                createdAt: new Date()
            } as ITodoCreated,
            {
                id: Utils.Functions.createId(),
                todoId: todoId,
                details: 'Updated details for Example Todo 1',
                type: eTodoEventType.DetailsChanged,
                createdAt: new Date()
            } as ITodoDetailsChanged,
            {
                id: Utils.Functions.createId(),
                todoId: todoId,
                title: 'Sample Todo 1',
                type: eTodoEventType.TitleChanged,
                createdAt: new Date()
            } as ITodoTitleChanged
        ] as ITodoEvent[];

        let commit = {
            id: Utils.Functions.createId(),
            branchId: 'a8057698',
            events: evs,
            createdAt: new Date()
        } as ICommit;

        this.commitController.push(commit).subscribe(
            r => console.log(r),
            e => console.log(e)
        );
    }

    testGet() {
        
        // this.commitController.getAll().subscribe(
        //     r => {
        //         let todos = this.todoService.getTodosProjectionFromCommits();
        //         console.table(todos);
        //     },
        //     e => console.log(e)
        // );
    }

    testDialog() {
        this.dialogService.open({} as IDialogOptions);
    }

    testBranchController() {
        const call = () => {
            this.branches.forEach(x => {
                this.branchController.getBranch(x.id)
                .subscribe(
                    r => console.log(r),
                    _ => console.error('failed')
                )
            });
        }

        call();
        this.branches = [{ id: 'fakeId' } as IBranch];
        call();
    }

    testCommitController() {
        const call = () => {
            this.branches.forEach(x => {
                this.commitController.getBranchCommits(x.id)
                .subscribe(
                    r => console.log(r),
                    _ => console.error('failed')
                )
            });
        }

        call();
        this.branches = [{ id: 'fakeId' } as IBranch];
        call();
    }

    testNotifications() {
        for(let i = 0; i < 5; i++) {
            this.notification.info('message');
        }
    }
}
