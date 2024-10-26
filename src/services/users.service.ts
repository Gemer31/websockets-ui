import { IUser, IUserWithIndex, IUserWithPassword, IUserWithWins } from '../models';
import crypto from 'crypto';

export class UsersService {
  public users: IUser[] = [];

  public registerUser({ name, password }: IUserWithPassword): IUser {
    const newUser: IUser = {
      index: crypto.randomUUID(),
      wins: 0,
      name,
      password,
    };
    this.users.push(newUser);
    return newUser;
  }

  public getUser({ name, password }: IUserWithPassword): IUserWithIndex {
    let user: IUser = this.users.find((item) => item.name === name && item.password === password);

    if (!user) {
      user = this.registerUser({name, password});
    }

    delete user.password;
    delete user.wins;

    return user;
  }

  public getWinners(): IUserWithWins[] {
    return this.users.map(({name, wins}) => ({ name, wins }));
  }
}
