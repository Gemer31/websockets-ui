import { GameService } from '../services/game.service';
import { ICoordinate, IShip } from '../models';
import { getWsResponse } from '../helpers';
import { AttackStatus, Messages, WsOperations } from '../types';
import { WebSocket } from 'ws';

export class GameController {
  constructor(private gameService: GameService) {
  }

  public createGame(roomId: string, playersIds: string[]): string {
    if (!roomId?.length && !playersIds.length) {
      throw new Error(Messages.INVALID_CREATE_GAME_PARAMS);
    }

    const gameId: string = this.gameService.createGame(roomId, playersIds);

    console.log(Messages.STARTED_GAME_ID + ': ' + gameId);

    return gameId;
  }

  public addShips(gameId: string, indexPlayer: string, ships: IShip[]): void {
    this.gameService.addShips(gameId, indexPlayer, ships);
    console.log(Messages.STARTED_GAME_ID + ': ' + gameId);
  }

  public gameIsReady(gameId: string): boolean {
    return this.gameService.gameIsReady(gameId);
  }

  public getRoomIdByGameId(gameId: string): string {
    return this.gameService.getRoomIdByGameId(gameId);
  }

  public getWinner(gameId: string): string {
    return this.gameService.getWinner(gameId);
  }

  public createGameResponse(client: WebSocket, gameId: string, idPlayer: string) {
    client.send(getWsResponse(WsOperations.CREATE_GAME, {gameId, idPlayer}));
  }

  public attack(gameId: string, indexPlayer: string, attackCoordinates: ICoordinate) {
    return this.gameService.attack(gameId, indexPlayer, attackCoordinates);
  }

  public startGameResponse(client: WebSocket, currentPlayerIndex: string, ships: IShip[]) {
    client.send(getWsResponse(
      WsOperations.START_GAME,
      {
        ships, /* player's ships, not enemy's */
        currentPlayerIndex, /* id of the player in the current game session, who have sent his ships */
      },
    ));
  }

  public finishGame(gameId: string): void {
    this.gameService.finishGame(gameId);
    console.log(Messages.FINISHED_GAME_ID + ': ' + gameId);
  }

  public finishResponse(client: WebSocket, winPlayer: string) {
    client.send(getWsResponse(
      WsOperations.FINISH,
      {winPlayer}, /* id of the player in the current game session */
    ));
  }

  public attackResponse(
    client: WebSocket,
    currentPlayer: string,
    status: AttackStatus,
    position: ICoordinate,
  ) {
    client.send(getWsResponse(
      WsOperations.ATTACK,
      {
        position,
        currentPlayer, /* id of the player in the current game session */
        status,
      },
    ));
  }

  public turnResponse(client: WebSocket, currentPlayer: string) {
    client.send(getWsResponse(
      WsOperations.TURN,
      {
        currentPlayer, /* id of the player in the current game session */
      },
    ));
  }
}
