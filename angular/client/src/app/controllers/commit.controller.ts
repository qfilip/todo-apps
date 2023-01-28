import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbUrl } from '../app.constants';
import { ICommit } from '../models/ICommit';
import { ITodoEvent } from '../models/ITodoEvents';

@Injectable({
  providedIn: 'root'
})
export class CommitController {

    constructor(private http: HttpClient) { }
    private url = `${DbUrl}/commits`;
    
    getAll() {
        return this.http.get<ICommit[]>(this.url);
    }

    getBranchCommits(branchId: string) {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("branchId", branchId);
        
        return this.http.get<ICommit[]>(this.url, { params: queryParams});
    }

    push(commit: ICommit) {
        return this.http.post<ICommit>(this.url, commit);
    }
}
