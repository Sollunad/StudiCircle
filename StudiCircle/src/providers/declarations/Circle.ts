export interface Circle {
    id: number;
    name: string;
    visible: boolean;
    position: {
        longitude: number,
        latitude: number
    }
    members?: Array<string>;
    //TODO später sollte noch 'modules?: Array<Module>' hinzugefügt werden
}
