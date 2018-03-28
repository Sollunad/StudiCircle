import {UserInfo} from "./UserInfo";

export interface LoginResponse {
  status : number,
  userData : UserInfo,
  session : {
    sessionId : string
  }
}
