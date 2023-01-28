export interface IDialogOptions {
    header: string;
    message: string;
    cancelHidden: boolean;
    okLabel: string;
    cancelLabel: string;
    onOk: () => void;
    onCancel: () => void;
}