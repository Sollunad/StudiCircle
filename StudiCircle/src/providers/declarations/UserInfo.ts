import { Circle } from "./Circle";


export interface UserInfo {
    userId: number|string;
    username: string;
    mail: string;
    role: number;
    status: number;
    cirlces?: Array<Circle>;
    session?: string|any;
}
