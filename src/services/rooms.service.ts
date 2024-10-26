import { IRoom, IUserWithIndex } from '../models';
import { WebSocket } from 'ws';
import crypto from 'crypto';

export class RoomsService {
  private rooms: IRoom[] = [];

  public createRoom(client: WebSocket, user: IUserWithIndex): string {
    const roomId = crypto.randomUUID();
    this.rooms.push({roomId, roomUsers: [user], roomClients: [client]});
    return roomId;
  }

  public addUserToRoom(indexRoom: string, user: IUserWithIndex, client: WebSocket) {
    const room = this.getRoom(indexRoom);
    room.roomUsers.push(user);
    room.roomClients.push(client);
  }

  public getRoomClients(indexRoom: string): any[] {
    return this.getRoom(indexRoom).roomClients;
  }

  public addClientToRoom(indexRoom: string, client: WebSocket): void {
    this.getRoom(indexRoom).roomClients.push(client);
  }

  public getRoomsWithOnePlayer() {
    return this.rooms.filter(room => room.roomUsers.length === 1);
  }

  public getEnemyPlayer(indexRoom: string, currentIndexPlayer: string): string {
    return this.getRoom(indexRoom).roomUsers.filter((u) => u.index !== currentIndexPlayer)[0].index;
  }

  private getRoom(indexRoom: string) {
    return this.rooms.find((room) => room.roomId === indexRoom);
  }
}
