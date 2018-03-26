export interface Circle {
    uid: number;
    name: string;
    openCircle: boolean;
    position: {
        longitude: number,
        latitude: number
    }
    members?: Array<string>;
    //TODO später sollte noch 'modules?: Array<Module>' hinzugefügt werden
}
