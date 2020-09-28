export type IUser = {id: string, username: string}

export type TokenUser = {
  user: IUser,
  iat: number,
  exp: number
};

export type TokenUserType = (token: any, secret: string) => TokenUser | null;