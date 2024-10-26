import { IRoom, IUserWithIndex } from '../models';
import crypto from 'crypto';

export class RoomsService {
  private rooms: IRoom[] = [];

  public createRoom(user: IUserWithIndex): string {
    const roomId = crypto.randomUUID();
    this.rooms.push({ roomId, roomUsers: [user]});
    return roomId;
  }

  public addUserToRoom(indexRoom: string, user: IUserWithIndex) {
    this.rooms.find((room) => room.roomId === indexRoom).roomUsers.push(user);
  }

  public getRoomsWithOnePlayer() {
    return this.rooms.filter(room => room.roomUsers.length === 1);
  }
}
