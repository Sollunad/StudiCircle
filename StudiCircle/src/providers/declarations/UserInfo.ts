import {Circle} from "./Circle";

export interface UserInfo{
    mail : string;
    username: string;
    uuid: string;
    circles?: Array<Circle>;
    session?: {
      sessionId : string;
    } | string;
    coords : {
      lat: number;
      lon: number;
    }
}
