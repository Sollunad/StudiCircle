import { UserInfo } from './UserInfo';

export interface LoginResponse {
    status: number;
    message: string;
    session: any;
    userData: UserInfo;
}