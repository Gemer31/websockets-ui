import { RawData, WebSocket, WebSocketServer } from 'ws';
import {
  AddShipsData,
  AttackData,
  ICoordinate,
  IIndexRoom,
  IShip,
  IUserWithIndex,
  IUserWithPassword,
  Message,
} from '../models';
import { AttackStatus, WsOperations } from '../types';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { RoomsService } from '../services/rooms.service';
import { GameService } from '../services/game.service';
import { RoomController } from '../controllers/room.controller';
import { GameController } from '../controllers/game.controller';
import { getAvailableAttackCoordinates, getRandomArrayItem, isCoordinatesValid } from '../helpers';
import { WebsocketBot } from './websocket.bot';

export class ServerWebsocket {
  constructor(
    private usersController: UsersController,
    private roomController: RoomController,
    private gameController: GameController,
  ) {
  }

  public listen(port: number) {
    const wsServer = new WebSocketServer({port});

    wsServer.on('connection', (c: WebSocket) => {
      console.log('Web Socket Server connected');
      this._handleRequest(c);
    });
    wsServer.on('close', (c) => this.usersController.logout(c));
  }

  private _handleRequest = (wsClient: WebSocket) => {
    wsClient.on('message', (msg: RawData) => {
      const {type, data} = JSON.parse(msg.toString()) as Message;
      const operationData: any = data ? JSON.parse(data as string) : null;

      try {
        switch (type) {
          case WsOperations.REGISTRATION: {
            this._registration(wsClient, operationData);
            break;
          }
          case WsOperations.ADD_USER_TO_ROOM: {
            this._addUserToRoom(wsClient, operationData);
            break;
          }
          case WsOperations.CREATE_ROOM: {
            this._createRoom(wsClient);
            break;
          }
          case WsOperations.ADD_SHIPS: {
            this._addShips(wsClient, operationData);
            break;
          }
          case WsOperations.ATTACK:
          case WsOperations.RANDOM_ATTACK: {
            this._attack(wsClient, operationData);
            break;
          }
          case WsOperations.SINGLE_PLAY: {
            this._singlePlay(wsClient);
            break;
          }
          case WsOperations.DISCONNECT: {
            this._disconnect(wsClient);
            break;
          }
          default: {
            throw new Error(`No ${type} websocket operation`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    wsClient.on('close', (code, data) => {
      const {deleteUserId} = JSON.parse(data.toString() as string);

      if (deleteUserId) {
        this.usersController.deleteUser(deleteUserId);
      }

      this._disconnect(wsClient);
    });
  };

  private _registration = (client: WebSocket, userData: IUserWithPassword): void => {
    this.usersController.login(client, userData);
    this.usersController.updateWinnersResponse();
    this.roomController.updateRoomResponse(client);
  };

  private _disconnect(client: WebSocket): void {
    this.usersController.logout(client);
  }

  private _addUserToRoom = (client: WebSocket, {indexRoom: roomId}: IIndexRoom): void => {
    const user: IUserWithIndex = this.usersController.getUserByClient(client);

    if (this.roomController.isUserInRoom(roomId, user.index)) {
      return;
    }

    this.roomController.addUserToRoom(
      roomId,
      this.usersController.getUserByClient(client),
      client,
    );
    this.usersController.getAllClients().forEach((c) => this.roomController.updateRoomResponse(c));

    const roomClients = this.roomController.getRoomClients(roomId);
    const idGame: string = this.gameController.createGame(
      roomId,
      roomClients.map((c) => this.usersController.getUserByClient(c).index),
    );
    roomClients.forEach((c) => this.gameController.createGameResponse(c, idGame, this.usersController.getUserByClient(c).index));
  };

  private _createRoom = (client: WebSocket): void => {
    this.roomController.createRoom(client, this.usersController.getUserByClient(client));
    this.usersController.getAllClients().forEach((c) => this.roomController.updateRoomResponse(c));
  };

  private _addShips = (client: WebSocket, {gameId, indexPlayer, ships}: AddShipsData): void => {
    this.gameController.addShips(gameId, indexPlayer, ships);

    if (this.gameController.gameIsReady(gameId)) {
      const indexRoom = this.gameController.getRoomIdByGameId(gameId);
      this.roomController.getRoomClients(indexRoom)
        .forEach((c) => {
          const indexPlayer: string = this.usersController.getUserByClient(c).index;
          const playerShips: IShip[] = this.gameController.getPlayerShips(gameId, indexPlayer);
          this.gameController.startGameResponse(c, indexPlayer, playerShips);
          this.gameController.turnResponse(c, this.usersController.getUserByClient(client).index);
        });
    }
  };

  private _attack = (client: WebSocket, {gameId, indexPlayer, y, x}: AttackData): void => {
    let attackCoordinates: ICoordinate = {x, y};

    if (!isCoordinatesValid(attackCoordinates)) {
      const shootedCoordinates: ICoordinate[] = this.gameController.getShootedCoordinates(gameId, indexPlayer);
      const availableCoordinates: ICoordinate[] = getAvailableAttackCoordinates(shootedCoordinates);
      attackCoordinates = getRandomArrayItem(availableCoordinates);
    }

    const status: AttackStatus = this.gameController.attack(gameId, indexPlayer, attackCoordinates);
    const roomId: string = this.gameController.getRoomIdByGameId(gameId);
    const roomClients: any = this.roomController.getRoomClients(roomId);

    roomClients.forEach((c) => this.gameController.attackResponse(c, indexPlayer, status, attackCoordinates));

    if (status === AttackStatus.MISS) {
      roomClients.forEach((c) => this.gameController.turnResponse(
        c,
        this.roomController.getEnemyPlayerId(roomId, indexPlayer),
      ));
    } else {
      roomClients.forEach((c) => this.gameController.turnResponse(c, indexPlayer));
    }

    const winner = this.gameController.getWinner(gameId);
    if (winner) {
      roomClients.forEach((c) => this.gameController.finishResponse(c, winner));
      this.usersController.addUserWin(winner);
      this.usersController.addUserWin(winner);
      this.gameController.finishGame(gameId);
      this.roomController.deleteRoom(roomId);
    }

    this.usersController.getAllClients().forEach((c) => this.roomController.updateRoomResponse(c));
    this.usersController.updateWinnersResponse();
  };

  private _singlePlay = (client: WebSocket): void => {
    const user: IUserWithIndex = this.usersController.getUserByClient(client);
    // delete room if exists
    const roomId = this.roomController.createRoom(client, user);
    new WebsocketBot(user.index, roomId).start();
  };
}

const usersService = new UsersService();
const roomsService = new RoomsService();
const gameService = new GameService();

const usersController = new UsersController(usersService);
const roomController = new RoomController(roomsService);
const gameController = new GameController(gameService);

export const serverWebsocket = new ServerWebsocket(
  usersController,
  roomController,
  gameController,
);
