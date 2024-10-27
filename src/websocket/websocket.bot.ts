import { RawData, WebSocket } from 'ws';
import { getRandomArrayItem, getWsResponse } from '../helpers';
import { ICreateGameData, ITurnData, IUserWithPassword, Message } from '../models';
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
          case WsOperations.CREATE_GAME: {
            this._createGame(operationData);
            break;
          }
          case WsOperations.TURN: {
            this._turn(operationData);
            break;
          }
          case WsOperations.FINISH: {
            this._finish();
            break;
          }
          default: {
            break;
          }
        }
      },
    );
  };

  private _turn = ({currentPlayer}: ITurnData) => {
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

  private _createGame = ({idGame, idPlayer}: ICreateGameData): void => {
    this._gameId = idGame;
    this._userId = idPlayer;
    this._ws.send(getWsResponse(
      WsOperations.ADD_SHIPS,
      {
        gameId: this._gameId,
        indexPlayer: this._userId,
        ships: getRandomArrayItem(BOT_SHIPS),
      }));
  };

  private _finish = (): void => {
    this._ws.close(1000, JSON.stringify({deleteUserId: this._userId}));
  }
}
