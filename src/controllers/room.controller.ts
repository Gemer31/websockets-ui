import { WsMessageTypes } from '../types';
import { RoomsService } from '../services/roomsService';

export class RoomController {
  constructor(private roomsService: RoomsService) {
  }


  public updateRoom(client) {
    client.send(JSON.stringify({
      type: WsMessageTypes.UPDATE_ROOM,
      data: JSON.stringify(this.roomsService.getRoomsWithOnePlayer()),
      id: 0,
    }));
  }

}
