import { RawData, WebSocket } from 'ws';
import { getWsResponse } from '../helpers';
import { IShip, IUserWithIndex, IUserWithPassword, Message } from '../models';
import crypto from 'crypto';
import { WsOperations } from '../types';
import { BOT_ATTACK_TIMEOUT, BOT_SHIPS } from '../constants';

export class WebsocketBot {
  private _ws: WebSocket;
  private _gameId: string;
  private _userId: string;

  constructor(private _enemyUserId: string, private _roomId: string) {
    this._ws = new WebSocket('ws://localhost:3000');
  }

  public start() {
    this._ws.on('open', () => {
      this._handleRequest();

      const botUser: IUserWithPassword = {
        name: 'Bot',
        password: crypto.randomUUID(),
      };

      this._ws.send(getWsResponse(WsOperations.REGISTRATION, botUser));
      this._ws.send(getWsResponse(WsOperations.ADD_USER_TO_ROOM, {indexRoom: this._roomId}));
    });
  }

  private _handleRequest = (): void => {
    this._ws.on('message', (msg: RawData) => {
        const {type, data} = JSON.parse(msg.toString()) as Message;
        const operationData: any = data ? JSON.parse(data as string) : null;

        switch (type) {
          // case WsOperations.UPDATE_ROOM: {
          //   this._updateRoom(operationData);
          //   break;
          // }
          case WsOperations.CREATE_GAME: {
            this._createGame(operationData);
            break;
          }
          case WsOperations.START_GAME: {
            const {ships, currentPlayerIndex} = operationData as { ships: IShip, currentPlayerIndex: string };
            // this._turn({currentPlayer: currentPlayerIndex});
            break;
          }
          case WsOperations.TURN: {
            this._turn(operationData);
            break;
          }
          case WsOperations.FINISH: {
            this._finish(operationData);
          }

          default: {
            // throw new Error(`No ${type} websocket operation`);
          }
        }
      },
    );
  };

  private _turn = ({currentPlayer}: { currentPlayer: string }) => {
    if (currentPlayer === this._userId) {
      setTimeout(() => {
        this._ws.send(getWsResponse(
          WsOperations.RANDOM_ATTACK,
          {
            gameId: this._gameId,
            indexPlayer: this._userId,
          }));
      }, BOT_ATTACK_TIMEOUT);
    }
  };

  // private _updateRoom = (data: { roomId: string, roomUsers: IUserWithIndex[] }[]) => {
  //     this._ws.send(getWsResponse(WsOperations.ADD_USER_TO_ROOM, {indexRoom: this._roomId}));
  // };

  private _createGame = ({idGame, idPlayer}: { idGame: string, idPlayer: string }): void => {
    this._gameId = idGame;
    this._userId = idPlayer;
    this._ws.send(getWsResponse(
      WsOperations.ADD_SHIPS,
      {
        gameId: this._gameId,
        indexPlayer: this._userId,
        ships: BOT_SHIPS,
      }));
  };

  private _finish({winPlayer}: { winPlayer: string }) {
    this._ws.close(101, JSON.stringify({deleteUserId: this._userId}));
  }
}
