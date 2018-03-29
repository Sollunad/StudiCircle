import { Circle } from "./Circle";

export interface UserInfo{
    username: string;
    uuid: string;
    circles?: Array<Circle>;
    session : {
      sessionId : string
    }
}
