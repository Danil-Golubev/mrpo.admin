export type user = {
  tgId:string,
  firstName:string,
  secondName:string
}

export type event = {
  _id:string,
  title:string,
  description:string,
  members:user[]
}