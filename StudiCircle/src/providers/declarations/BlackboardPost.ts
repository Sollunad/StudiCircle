/*
---------------------------------------------------------------------------------
**!!!!!!!!! Used for comments too !!!!!!!!***
---------------------------------------------------------------------------------
*/

export interface BlackboardPost{
  postID: number;
  userName: string;
  title: string;
  text: string;
  date: string;
  comments?: Array<BlackboardPost>;

}
