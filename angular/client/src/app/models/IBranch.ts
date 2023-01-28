import { eEntityState } from "./enums";

export interface IBranch {
    id: string;
    name: string;
    entityState: eEntityState;
}