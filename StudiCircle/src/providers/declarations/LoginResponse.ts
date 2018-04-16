import {UserInfo} from "./UserInfo";

export interface LoginResponse {
  httpStatus : number,
  userData : UserInfo,
  session : string;
}
