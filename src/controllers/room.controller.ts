import { Messages, WsOperations } from '../types';
import { RoomsService } from '../services/rooms.service';
import { throwErrorIfInvalid, getWsResponse } from '../helpers';
import { IRoom, IUserWithIndex } from '../models';
import { WebSocket } from 'ws';

export class RoomController {
  constructor(private roomsService: RoomsService) {
  }

  public createRoom(client: WebSocket, user: IUserWithIndex): string {
    throwErrorIfInvalid(Messages.INVALID_CREATE_ROOM_DATA, client, user);

    return this.roomsService.createRoom(client, user);
  }

  public addUserToRoom(indexRoom: string, user: IUserWithIndex, client: WebSocket) {
    throwErrorIfInvalid(Messages.INVALID_ADD_USER_TO_ROOM_DATA, indexRoom, client, user);

    this.roomsService.addUserToRoom(indexRoom, user, client);
  }

  public getRoomClients(roomId: string): any[] {
    throwErrorIfInvalid(Messages.INVALID_GET_ROOM_CLIENTS_DATA, roomId);

    return this.roomsService.getRoomClients(roomId);
  }

  public getEnemyPlayerId(roomId: string, playerId: string) {
    throwErrorIfInvalid(Messages.INVALID_GET_ENEMY_PLAYER_ID, roomId, playerId);

    return this.roomsService.getEnemyPlayerId(roomId, playerId);
  }

  public isUserInRoom(roomId: string, playerId: string) {
    throwErrorIfInvalid(Messages.CHECK_USER_IN_ROOM_FAILED, roomId, playerId);

    return this.roomsService.isUserInRoom(roomId, playerId);
  }

  public deleteRoom(roomId: string) {
    throwErrorIfInvalid(Messages.DELETE_ROOM_FAILED, roomId);

    this.roomsService.deleteRoom(roomId);
    console.log(Messages.DELETED_ROOM + ': ' + roomId);
  }

  public updateRoomResponse(client) {
    client.send(getWsResponse(
      WsOperations.UPDATE_ROOM,
      this.roomsService.getRoomsWithOnePlayer().map((r: IRoom) => {
        return {
          roomId: r.id,
          roomUsers: r.roomUsers,
        };
      }),
    ));
  }
}
