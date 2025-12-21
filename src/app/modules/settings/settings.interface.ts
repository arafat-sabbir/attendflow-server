export interface ISetting {
    id: string;
    key: string;
    value: any;
    group: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISettingUpdate {
    key: string;
    value: any;
}
