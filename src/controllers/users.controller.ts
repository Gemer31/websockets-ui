import { UsersService } from '../services/users.service';
import { IUserWithIndex, IUserWithPassword } from '../models';
import { WsMessageTypes } from '../types';

export class UsersController {
  constructor(private usersService: UsersService) {
  }

  public getUser(data: IUserWithPassword): IUserWithIndex {
    try {
      if (!data.name || !data.password) {
        throw new Error('User not found');
      }

      return this.usersService.getUser(data);
    } catch (e) {
      throw new Error('User not found');
    }
  }

  public updateWinners(client): void {
    client.send(JSON.stringify({
      type: WsMessageTypes.UPDATE_WINNERS,
      data: JSON.stringify(this.usersService.getWinners()),
      id: 0,
    }));
  }
}
