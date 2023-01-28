import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { eNotificationType, INotification, NotificationService } from 'src/app/ui-common/notification.service';

@Component({
    selector: 'app-notification-logs',
    templateUrl: './notification-logs.component.html',
    styleUrls: ['./notification-logs.component.scss']
})
export class NotificationLogsComponent implements OnInit, OnDestroy {

    private subscribed: boolean = true;

    constructor(private notifications: NotificationService) { }

    ngOnInit(): void {
        this.notifications.notification
            .pipe(takeWhile(() => this.subscribed))
            .subscribe(x => {
                if(x) {
                    this.addNotification(x);
                }
            });
    }

    notes: { at: Date, note: INotification}[] = [];
    _eNoteType = eNotificationType;
    isOpen: boolean = false;

    private addNotification(note: INotification) {
        this.notes.push({ at: new Date, note: note });
        if(this.notes.length > 50) {
            this.notes.shift();
        }
    }

    toggleDrawer() {
        this.isOpen = !this.isOpen;
    }

    ngOnDestroy(): void {
        this.subscribed = false;
    }
}
