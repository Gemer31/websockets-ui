import { AttackCoordinates, IGame, IShip } from '../models';
import { AttackStatus } from '../types';
import crypto from 'crypto';

export class GameService {
  private games: IGame[] = [];

  private getGame(idGame: string) {
    return this.games.find((g) => g.idGame === idGame);
  }

  public createGame(roomId: string, playersId: string[]): string {
    const idGame = crypto.randomUUID();

    this.games.push({
      idGame,
      roomId,
      playersId,
      playersShips: new Map<string, IShip[]>(),
    });

    return idGame;
  }

  public addShips(idGame: string, indexPlayer: string, ships: IShip[]): void {
    this.getGame(idGame).playersShips.set(indexPlayer, ships);
  }

  public gameIsReady(idGame: string): boolean {
    const game = this.getGame(idGame);
    return !!game.playersShips.get(game.playersId[0]).length && !!game.playersShips.get(game.playersId[1]).length;
  }

  public getRoomIdByGameId(idGame: string) {
    return this.getGame(idGame).roomId;
  }

  public getPlayerShips(idGame: string, indexPlayer: string): IShip[] {
    return this.getGame(idGame).playersShips.get(indexPlayer);
  }

  public attack(idGame: string, indexPlayer: string, attackCoordinates: AttackCoordinates) {
    const game = this.getGame(idGame);
    const enemyIndexPlayer: string = game.playersId.filter((p) => p !== indexPlayer)[0];
    const enemyShips: IShip[] = game.playersShips.get(enemyIndexPlayer);
    let status: AttackStatus = AttackStatus.MISS;

    if (attackCoordinates) {
      enemyShips.every((ship) => {
        const damaged = this.isShipDamaged(ship, attackCoordinates);

        if (damaged) {
          ship.damageCounter = (ship.damageCounter || 0) + 1;

          if (ship.damageCounter === ship.length) {
            status = AttackStatus.KILLED;
          } else {
            status = AttackStatus.SHOT;
          }

          return false;
        }

        return true;
      })
    } else {
      // random
    }

    return status;
  }

  public getWinner(idGame: string): string {
    const game = this.getGame(idGame);
    let looser: string;

    game.playersId.forEach((playerId) => {
      const ships = game.playersShips.get(playerId);
      let killedShipsCounter: number = 0;

      ships.forEach((ship) => {
        if (ship.damageCounter === ship.length) {
          killedShipsCounter++;
        }
      });

      if (killedShipsCounter === ships.length) {
        looser = playerId;
      }
    });

    return looser && game.playersId.filter((playerId) => playerId !== looser)[0];
  }

  private isShipDamaged(ship: IShip, coordinates: AttackCoordinates): boolean {
    return true;
  }
}
