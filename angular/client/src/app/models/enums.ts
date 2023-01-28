export enum eTodoEventType {
    Created = 1,
    Deleted = 2,
    TitleChanged = 3,
    DetailsChanged = 4,
    DueDateChanged = 5,
}

export enum eTodoExpiration {
    NotExpired = 1,
    ExpiresToday = 2,
    Expired = 3
}

export enum eEntityState {
    Active = 1,
    Deleted = 99
}