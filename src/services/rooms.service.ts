import { IRoom, IUserWithIndex } from '../models';
import { WebSocket } from 'ws';
import crypto from 'crypto';

export class RoomsService {
  private rooms: Map<string, IRoom> = new Map();

  public createRoom(client: WebSocket, user: IUserWithIndex): string {
    const roomId = crypto.randomUUID();
    this.rooms.set(roomId, {id: roomId, roomUsers: [user], roomClients: [client]});
    return roomId;
  }

  public addUserToRoom(roomId: string, user: IUserWithIndex, client: WebSocket) {
    const room: IRoom = this.rooms.get(roomId);
    room.roomUsers.push(user);
    room.roomClients.push(client);
  }

  public getRoomClients(roomId: string): any[] {
    return this.rooms.get(roomId).roomClients;
  }

  public getRoomsWithOnePlayer(): IRoom[] {
    return [...this.rooms.values()].filter(room => room.roomUsers.length === 1);
  }

  public getEnemyPlayerId(roomId: string, currentIndexPlayer: string): string {
    return this.rooms
      .get(roomId)
      .roomUsers
      .filter((u) => u.index !== currentIndexPlayer)
      ?.[0].index;
  }

  public isUserInRoom(roomId: string, indexUser: string): boolean {
    return this.rooms
      .get(roomId)
      .roomUsers
      .some((u) => (u.index === indexUser));
  }

  public deleteRoom(roomId: string): void {
    this.rooms.delete(roomId);
  }
}
