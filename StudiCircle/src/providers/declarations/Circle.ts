export interface Circle {
    uid: number;
    name: string;
    openCircle: boolean;
    position: {
        longitude: number,
        latitude: number
    }
    members?: Array<string>;
}