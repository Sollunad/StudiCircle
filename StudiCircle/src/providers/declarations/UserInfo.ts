import {Circle} from "./Circle";

export interface UserInfo{
    mail : string;
    username: string;
    uuid: string;
    id: string;
    circles?: Array<Circle>;
    session?: {
      sessionId : string;
    } | string;
    coords : {
      lat: number;
      lon: number;
    }
}
