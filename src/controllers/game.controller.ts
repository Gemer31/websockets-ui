import { GameService } from '../services/game.service';
import { ICoordinate, IShip } from '../models';
import { getWsResponse } from '../helpers';
import { AttackStatus, WsOperations } from '../types';
import { WebSocket } from 'ws';

export class GameController {
  constructor(private gameService: GameService) {
  }

  public createGame(roomId: string, playersIds: string[]): string {
    return this.gameService.createGame(roomId, playersIds);
  }

  public addShips(idGame: string, indexPlayer: string, ships: IShip[]): void {
    return this.gameService.addShips(idGame, indexPlayer, ships);
  }

  public gameIsReady(idGame: string): boolean {
    return this.gameService.gameIsReady(idGame);
  }

  public getRoomIdByGameId(idGame: string): string {
    return this.gameService.getRoomIdByGameId(idGame);
  }

  public getWinner(idGame: string) {
    return this.gameService.getWinner(idGame);
  }

  public createGameResponse(client: WebSocket, idGame: string, idPlayer: string) {
    client.send(getWsResponse(WsOperations.CREATE_GAME, {idGame, idPlayer}));
  }

  public attack(idGame: string, indexPlayer: string, attackCoordinates: ICoordinate) {
    return this.gameService.attack(idGame, indexPlayer, attackCoordinates);
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
