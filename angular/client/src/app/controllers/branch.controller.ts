import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbUrl } from '../app.constants';
import { IBranch } from '../models/IBranch';

@Injectable({
    providedIn: 'root'
})
export class BranchController {

    constructor(private http: HttpClient) { }
    private url = `${DbUrl}/branches`;

    getAll() {
        return this.http.get<IBranch[]>(this.url);
    }

    getBranch(branchId: string) {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("id", branchId);
        
        return this.http.get<IBranch[]>(this.url, { params: queryParams});
    }

    uploadBranch(branch: IBranch) {
        return this.http.post<IBranch>(this.url, branch);
    }

    patchBranch(branch: IBranch) {
        const url = this.url + `/${branch.id}`;
        return this.http.patch<IBranch>(url, branch);
    }
}
