import { WebSocketServer } from 'ws';
import {
  AddShipsData,
  ICoordinate,
  AttackData,
  IIndexRoom,
  IShip,
  IUserWithPassword,
  Message,
  IUserWithIndex,
} from './models';
import { AttackStatus, WsOperations } from './types';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { RoomsService } from './services/rooms.service';
import { GameService } from './services/game.service';
import { RoomController } from './controllers/room.controller';
import { GameController } from './controllers/game.controller';

export const usersService = new UsersService();
export const roomsService = new RoomsService();
export const gameService = new GameService();

export const usersController = new UsersController(usersService);
export const roomController = new RoomController(roomsService);
export const gameController = new GameController(gameService);

// export const roomsAndClients: Map<string, any[]> = new Map();
// export const clientsAndUsers: Map<any, IUserWithIndex> = new Map();

export function runWebsocket() {
  const wsServer = new WebSocketServer({port: 3000});

  wsServer.on('connection', (wsClient) => {
    console.log('Web Socket Server connected');

    // clientsAndUsers.set(wsClient, null);

    wsClient.on('message', async (msg) => {
      const requestData = JSON.parse(msg.toString()) as Message;

      try {
        switch (requestData.type) {
          case WsOperations.REGISTRATION: {
            const userData: IUserWithPassword = JSON.parse(requestData.data as string);
            usersController.login(wsClient, userData);
            usersController.updateWinnersResponse();
            roomController.updateRoom(wsClient);
            break;
          }
          case WsOperations.ADD_USER_TO_ROOM: {
            const {indexRoom}: IIndexRoom = JSON.parse(requestData.data as string);
            const user: IUserWithIndex = usersController.getUserByClient(wsClient);

            if (roomController.isUserInRoom(indexRoom, user.index)) {
              break;
            }

            roomController.addUserToRoom(
              indexRoom,
              usersController.getUserByClient(wsClient),
              wsClient,
            );
            usersController.getAllClients().forEach((c) => roomController.updateRoom(c));

            roomController.addClientToRoom(indexRoom, wsClient);
            const roomClients = roomController.getRoomClients(indexRoom);
            const idGame: string = gameController.createGame(
              indexRoom,
              roomClients.map((c) => usersController.getUserByClient(c).index),
            );
            roomClients.forEach((c) => gameController.createGameResponse(c, idGame, usersController.getUserByClient(c).index));

            break;
          }
          case WsOperations.CREATE_ROOM: {
            roomController.createRoom(wsClient, usersController.getUserByClient(wsClient));
            roomController.updateRoom(wsClient);
            usersController.getAllClients().forEach((c) => roomController.updateRoom(c));
            break;
          }
          case WsOperations.ADD_SHIPS: {
            const {gameId, indexPlayer, ships}: AddShipsData = JSON.parse(requestData.data as string);

            gameController.addShips(gameId, indexPlayer, ships);

            if (gameController.gameIsReady(gameId)) {
              const indexRoom = gameController.getRoomIdByGameId(gameId);
              roomController.getRoomClients(indexRoom)
                .forEach((c) => {
                  const indexPlayer: string = usersController.getUserByClient(c).index;
                  const playerShips: IShip[] = gameService.getPlayerShips(gameId, indexPlayer);
                  gameController.startGameResponse(c, indexPlayer, playerShips);
                  gameController.turnResponse(c, usersController.getUserByClient(wsClient).index);
                });
            }
            break;
          }
          case WsOperations.ATTACK:
          case WsOperations.RANDOM_ATTACK: {
            const {gameId, indexPlayer, y, x}: AttackData = JSON.parse(requestData.data as string);
            const attackCoordinates: ICoordinate = (typeof x === 'number') && (typeof y === 'number')
              ? {x: x, y: y}
              : null;
            const status: AttackStatus = gameController.attack(gameId, indexPlayer, attackCoordinates);
            const roomId: string = gameController.getRoomIdByGameId(gameId);
            const roomClients: any = roomController.getRoomClients(roomId);

            roomClients.forEach((c) => gameController.attackResponse(c, indexPlayer, status, attackCoordinates));

            if (status === AttackStatus.MISS) {
              roomController
                .getRoomClients(roomId)
                .forEach((c) => gameController.turnResponse(
                  c,
                  roomController.getEnemyPlayer(roomId, indexPlayer),
                ));
            } else {
              roomController
                .getRoomClients(roomId)
                .forEach((c) => gameController.turnResponse(c, indexPlayer));
            }

            const winner = gameController.getWinner(gameId);
            if (winner) {
              roomClients.forEach((c) => gameController.finishResponse(c, winner));
              usersController.addUserWin(winner);
            }

            usersController.getAllClients().forEach((c) => roomController.updateRoom(c));
            usersController.updateWinnersResponse();

            break;
          }
          default: {
            throw new Error(`No ${requestData.type} websocket operation`);
          }
        }
      } catch (e) {
        console.error((e as Error).message);
        // wsClient.send(JSON.stringify({...requestData, error: true, errorText: e}));
      }
    });
  });

  wsServer.on('close', (wsClient) => usersController.logout(wsClient));
}
