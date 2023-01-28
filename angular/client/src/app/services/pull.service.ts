import { Injectable, OnDestroy } from '@angular/core';
import { BranchController } from '../controllers/branch.controller';
import { CommitController } from '../controllers/commit.controller';
import { eTodoEventType } from '../models/enums';
import { ICommit } from '../models/ICommit';
import { ITodoEventMap } from '../models/ITodo';
import { ITodoCreated, ITodoEvent } from '../models/ITodoEvents';
import { NotificationService } from '../ui-common/notification.service';
import { PageLoaderService } from '../ui-common/page-loader.service';
import { BranchService } from './branch.service';
import { CommitService } from './commit.service';
import { TodoService } from './todo.service';

@Injectable({
    providedIn: 'root'
})
export class PullService {

    constructor(
        private commitController: CommitController,
        private branchService: BranchService,
        private commitService: CommitService,
        private todoService: TodoService,
        private pageLoader: PageLoaderService,
        private notification: NotificationService
    ) {}

    // different branches
    pullFromDifferentBranch(branchId: string) {
        this.pageLoader.setMessage('Fetching remote commits');
        this.commitController.getBranchCommits(branchId)
        .subscribe(
            result => {
                this.notification.success('Commits pulled');
                this.addCommitsFromDifferentBranch(result);
                this.pageLoader.hide();
            },
            error => {
                this.pageLoader.hide();
                this.notification.error('Could not fetch commits');
                console.error(error);
            }
        );
    }
    
    private addCommitsFromDifferentBranch(foreignCommits: ICommit[]) {
        const currentBranchId = this.branchService.getCurrentBranch().id;
        const commits = this.commitService.getCommitList();
        
        const commitIds = commits.map(x => x.id);

        const forMerge = foreignCommits
        .filter(x => !commitIds.includes(x.id))
        .map(x => {
            return {...x, branchId: currentBranchId } as ICommit;
        });

        const byDate = (a: ICommit, b: ICommit) => {
            return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1;
        }

        const currentBranchLocalCommits = this.commitService.getLocalCommitsList();
        const merged = currentBranchLocalCommits.concat(forMerge).sort(byDate);
        
        this.commitService.setLocalCommits(merged);
        this.notification.success(`${forMerge.length} commits merged`);
    }
    
    // same branch
    pullFromSameBranch() {
        this.pageLoader.show('Fetching remote commits');
        const id = this.branchService.getCurrentBranch().id;
        
        this.commitController.getBranchCommits(id)
        .subscribe(
            result => {
                return result;
                const localCommits = this.commitService.getCommitList()
                    .filter(x => x.branchId === id);
                this.mergeCommitsFromSameBranch(localCommits, result);
            },
            error => {
                this.pageLoader.hide();
                this.notification.error('Could not fetch commits');
                console.error(error);
            }
        );
    }

    getEventMaps(localCommits: ICommit[], pulledCommits: ICommit[]) {
        const createdTodoIdReducer = (state: string[], c: ICommit) => {
            const createdTodoIds = c.events
                .filter(e => e.type === eTodoEventType.Created)
                .map(e => (e as ITodoCreated).todo.id);
            
            return state.concat(createdTodoIds);
        }
        
        const createdTodoIdsLocal = localCommits.reduce(createdTodoIdReducer, []);
        const createdTodoIdsPulled = pulledCommits.reduce(createdTodoIdReducer, []);
        
        // map events for each todo, and check final result
        const todoEventReducer = (state: ITodoEventMap[], todoId: string) => {
            const events =  this.todoService.mapTodoEvents(todoId, localCommits);
            return [...state, { todoId: todoId, events: events}];
        }

        const localEventsMap = createdTodoIdsLocal.reduce(todoEventReducer, []);
        const pulledEventsMap = createdTodoIdsPulled.reduce(todoEventReducer, []);

        return { localEventsMap: localEventsMap, pulledEventsMap: pulledEventsMap };
    }
}