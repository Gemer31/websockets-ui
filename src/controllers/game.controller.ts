import { GameService } from '../services/game.service';
import { ICoordinate, IShip } from '../models';
import { getWsResponse } from '../helpers';
import { AttackStatus, Messages, WsOperations } from '../types';
import { WebSocket } from 'ws';

export class GameController {
  constructor(private gameService: GameService) {
  }

  public createGame(roomId: string, playersIds: string[]): string {
    if (!roomId?.length || !playersIds.length) {
      throw new Error(Messages.INVALID_CREATE_GAME_PARAMS);
    }

    const gameId: string = this.gameService.createGame(roomId, playersIds);
    console.log(Messages.STARTED_GAME_ID + ': ' + gameId);

    return gameId;
  }

  public addShips(gameId: string, playerId: string, ships: IShip[]): void {
    if (!gameId || !playerId || !ships?.length) {
      throw new Error(Messages.INVALID_ADD_SHIPS_DATA);
    }

    this.gameService.addShips(gameId, playerId, ships);
    console.log(Messages.STARTED_GAME_ID + ': ' + gameId);
  }

  public gameIsReady(gameId: string): boolean {
    if (!gameId) {
      throw new Error(Messages.CHECK_GAME_READY_FAILED);
    }

    return this.gameService.gameIsReady(gameId);
  }

  public getRoomIdByGameId(gameId: string): string {
    if (!gameId) {
      throw new Error(Messages.GET_ROOM_ID_FAILED);
    }

    return this.gameService.getRoomIdByGameId(gameId);
  }

  public getWinner(gameId: string): string {
    if (!gameId) {
      throw new Error(Messages.GET_WINNER_FAILED);
    }

    return this.gameService.getWinner(gameId);
  }

  public attack(gameId: string, playerId: string, attackCoordinates: ICoordinate) {
    if (!gameId || !playerId || !attackCoordinates) {
      throw new Error(Messages.INVALID_ATTACK_DATA);
    }

    return this.gameService.attack(gameId, playerId, attackCoordinates);
  }

  public getShootedCoordinates(gameId: string, playerId: string): ICoordinate[] {
    if (!gameId || !playerId) {
      throw new Error(Messages.INVALID_GET_SHOOTED_COORDINATES);
    }

    return this.gameService.getShootedCoordinates(gameId, playerId);
  }

  public createGameResponse(client: WebSocket, idGame: string, idPlayer: string) {
    client.send(getWsResponse(
      WsOperations.CREATE_GAME,
      {idGame, idPlayer},
    ));
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
