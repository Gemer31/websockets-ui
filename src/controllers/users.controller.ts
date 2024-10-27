import { UsersService } from '../services/users.service';
import { IUserWithIndex, IUserWithPassword } from '../models';
import { Messages, WsOperations } from '../types';
import { getWsResponse, throwErrorIfInvalid } from '../helpers';
import { WebSocket } from 'ws';

export class UsersController {
  constructor(private usersService: UsersService) {
  }

  public addUserWin(userId: string): void {
    throwErrorIfInvalid(Messages.ADD_USER_WIN_FAILED, userId);

    return this.usersService.addUserWin(userId);
  }

  public getUserByClient(client: WebSocket): IUserWithIndex {
    throwErrorIfInvalid(Messages.GET_USER_BY_CLIENT_FAILED, client);

    return this.usersService.getRegisteredUser(client);
  }

  public getAllClients(): any[] {
    const clients: WebSocket[] = this.usersService.getAllClients();

    throwErrorIfInvalid(Messages.GET_ALL_CLIENTS_FAILED, clients);

    return clients;
  }

  public login(client: WebSocket, userData: IUserWithPassword): void {
    if (!userData.name || !userData.password) {
      this.registrationErrorResponse(client, Messages.INVALID_USER_DATA);
      return;
    }

    if (this.usersService.isAlreadyRegistered(userData)) {
      this.registrationErrorResponse(client, Messages.USER_ALREADY_REGISTERED);
      return;
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

  public updateWinnersResponse(): void {
    this.usersService.getAllClients().forEach((c) => {
      c.send(getWsResponse(
        WsOperations.UPDATE_WINNERS,
        this.usersService.getWinners(),
      ));
    });
  }
}
