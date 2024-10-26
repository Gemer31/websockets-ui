import { IUser, IUserWithIndex, IUserWithPassword, IUserWithWins } from '../models';
import crypto from 'crypto';
import { WebSocket } from 'ws';

export class UsersService {
  private users: IUser[] = [];
  private registrations: Map<any, string> = new Map<any, string>();

  public login(client: WebSocket, userData: IUserWithPassword): IUserWithIndex {
    let user: IUser = this.users.find((u) => u.name === userData.name && u.password === userData.password);

    if (!user) {
      user = this.createUser(userData);
    }

    this.registrations.set(client, user.index);
    return { name: user.name, index: user.index};
  }

  public logout(client: WebSocket) {
    const user: IUserWithIndex = this.getUser(this.registrations.get(client))
    this.registrations.delete(client);
    return user
  }

  public isAlreadyRegistered(user: IUserWithPassword): boolean {
    const registeredUsersIndexes = [...this.registrations.values()];
    return this.users
      .filter((u) => registeredUsersIndexes.includes(u.index))
      .some((u) => (u.password === user.password) && (u.name === user.name))
  }

  public getRegisteredUser(client: WebSocket): IUserWithIndex {
    const userIndex: string = this.registrations.get(client);
    const user: IUser = this.users.find((u) => u.index === userIndex);

    return { name: user.name, index: user.index };
  }

  public addUserWin(indexUser: string): void {
    this.getUser(indexUser).wins += 1;
  }

  public getAllClients(): any[] {
    return [...this.registrations.keys()];
  }

  public createUser({ name, password }: IUserWithPassword): IUser {
    const newUser: IUser = {
      index: crypto.randomUUID(),
      wins: 0,
      name,
      password,
    };
    this.users.push(newUser);
    return newUser;
  }

  public getUser(index: string): IUser {
    return this.users.find((u) => u.index === index);
  }

  public getWinners(): IUserWithWins[] {
    return this.users.map(({name, wins}) => ({ name, wins }));
  }
}
