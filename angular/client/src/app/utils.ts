import { eTodoEventType } from "./models/enums";
import { ITodoEvent, ITodoCreated, ITodoDeleted, ITodoTitleChanged, ITodoDetailsChanged, ITodoDueDateChanged } from "./models/ITodoEvents";

export class Functions {
    static createId() {
        return Math.random().toString(16).substr(2, 8);
    }

    static formatDate(x: Date) {
        return new Date(x).toLocaleDateString('en-UK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }

    static onEventCastedDo<T>(
        x: ITodoEvent,
        onCreated: (e: ITodoCreated) => T | void,
        onDeleted: (e: ITodoDeleted) => T | void,
        onTitleChanged: (e: ITodoTitleChanged) => T | void,
        onDetailsChanged: (e: ITodoDetailsChanged) => T | void,
        onDueDateChanged: (e: ITodoDueDateChanged) => T | void
        ): T | void
    {
        if(x.type === eTodoEventType.Created) return onCreated(x as ITodoCreated);
        else if(x.type === eTodoEventType.Deleted) return onDeleted(x as ITodoDeleted);
        else if(x.type === eTodoEventType.TitleChanged) return onTitleChanged(x as ITodoTitleChanged);
        else if(x.type === eTodoEventType.DetailsChanged) return onDetailsChanged(x as ITodoDetailsChanged);
        else if(x.type === eTodoEventType.DueDateChanged) return onDueDateChanged(x as ITodoDueDateChanged);
        else {
            console.error(`Event type ${x.type} cannot be matched`);
        }
    }
}