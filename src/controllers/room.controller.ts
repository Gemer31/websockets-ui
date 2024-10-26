import { WsOperations } from '../types';
import { RoomsService } from '../services/rooms.service';
import { getWsResponse } from '../helpers';
import { IUserWithIndex } from '../models';
import { WebSocket } from 'ws';

export class RoomController {
  constructor(private roomsService: RoomsService) {
  }

  public createRoom(client: WebSocket, user: IUserWithIndex): string {
    return this.roomsService.createRoom(client, user);
  }

  public addUserToRoom(indexRoom: string, user: IUserWithIndex, client: WebSocket) {
    this.roomsService.addUserToRoom(indexRoom, user, client);
  }

  public getRoomClients(indexRoom: string): any[] {
    return this.roomsService.getRoomClients(indexRoom);
  }

  public getEnemyPlayer(indexRoom: string, indexPlayer: string) {
    return this.roomsService.getEnemyPlayer(indexRoom, indexPlayer);
  }

  public addClientToRoom(indexRoom: string, client: WebSocket): void {
    this.roomsService.addClientToRoom(indexRoom, client);
  }

  public isUserInRoom(indexRoom: string, indexPlayer: string) {
    return this.roomsService.isUserInRoom(indexRoom, indexPlayer);
  }

  public updateRoom(client) {
    client.send(getWsResponse(
      WsOperations.UPDATE_ROOM,
      this.roomsService.getRoomsWithOnePlayer(),
    ));
  }
}
