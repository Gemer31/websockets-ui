import { UsersService } from '../services/users.service';
import { IUserWithIndex, IUserWithPassword } from '../models';
import { Messages, WsOperations } from '../types';
import { getWsResponse } from '../helpers';
import { WebSocket } from 'ws';

export class UsersController {
  constructor(private usersService: UsersService) {
  }

  public updateWinnersResponse(): void {
    this.usersService.getAllClients().forEach((c) => {
      c.send(getWsResponse(
        WsOperations.UPDATE_WINNERS,
        this.usersService.getWinners(),
      ));
    });
  }

  public getUserByClient(client: WebSocket): IUserWithIndex {
    return this.usersService.getRegisteredUser(client);
  }

  public getAllClients(): any[] {
    return this.usersService.getAllClients();
  }

  public login(client: WebSocket, userData: IUserWithPassword) {
    if (!userData.name || !userData.password) {
      this.registrationErrorResponse(client, Messages.INVALID_USER_DATA);
    }

    if (this.usersService.isAlreadyRegistered(userData)) {
      this.registrationErrorResponse(client, Messages.USER_ALREADY_REGISTERED);
    }

    const user: IUserWithIndex = this.usersService.login(client, userData);
    client.send(getWsResponse(WsOperations.REGISTRATION, user));
    console.log(`${Messages.LOG_IN_USER}: ${user.name}`);
  }

  private registrationErrorResponse(client, errorText) {
    client.send(getWsResponse(WsOperations.REGISTRATION, {error: true, errorText}));
  }

  public logout(client: WebSocket): void {
    const user = this.usersService.logout(client);
    console.log(`${Messages.LOG_IN_USER}: ${user.name}`);
  }
}
