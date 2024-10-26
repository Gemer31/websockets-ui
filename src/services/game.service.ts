import { ICoordinate, IGame, IShip } from '../models';
import { AttackStatus } from '../types';
import crypto from 'crypto';

export class GameService {
  private games: Map<string, IGame> = new Map();

  private getGame(gameId: string) {
    return this.games.get(gameId);
  }

  public createGame(roomId: string, playersId: string[]): string {
    const gameId = crypto.randomUUID();
    this.games.set(gameId, {
      id: gameId,
      roomId,
      players: new Map()
        .set(playersId[0], {ships: [], shoots: []})
        .set(playersId[1], {ships: [], shoots: []}),
    });

    return gameId;
  }

  public finishGame(gameId: string): void {
    this.games.delete(gameId);
  }

  public addShips(gameId: string, indexPlayer: string, ships: IShip[]): void {
    this.getGame(gameId).players.get(indexPlayer).ships = ships
      ?.map((s: IShip) => ({
        ...s,
        damageCounter: 0,
        coordinates: this.getShipCoordinates(s),
      }));
  }

  public gameIsReady(gameId: string): boolean {
    const game = this.getGame(gameId);
    return [...game.players.values()].every((p) => !!p?.ships?.length);
  }

  public getRoomIdByGameId(gameId: string) {
    return this.getGame(gameId).roomId;
  }

  public getPlayerShips(gameId: string, indexPlayer: string): IShip[] {
    return this.getGame(gameId).players.get(indexPlayer).ships;
  }

  public attack(gameId: string, indexPlayer: string, attackCoordinate: ICoordinate) {
    const game = this.getGame(gameId);
    const enemyIndexPlayer: string = this.getEnemyUserIndex(gameId, indexPlayer);
    const enemyShips: IShip[] = game.players.get(enemyIndexPlayer).ships;
    let attackStatus: AttackStatus = AttackStatus.MISS;

    if (attackCoordinate) {
      enemyShips.every((ship) => {
        const damaged = this.isShipDamaged(ship, attackCoordinate);

        if (damaged) {
          ship.damageCounter += 1;

          if (ship.damageCounter === ship.length) {
            attackStatus = AttackStatus.KILLED;
          } else {
            attackStatus = AttackStatus.SHOT;
          }

          return false;
        }

        return true;
      });
    } else {
      // random
    }

    game.players.get(indexPlayer).shoots.push(attackCoordinate);

    return attackStatus;
  }

  public getWinner(gameId: string): string {
    const game = this.getGame(gameId);
    let looser: string;

    game.players.forEach((player, playerId) => {
      const ships = game.players.get(playerId).ships;
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

    return looser && this.getEnemyUserIndex(gameId, looser);
  }

  private getEnemyUserIndex(gameId: string, indexPlayer: string): string {
    return [...this.getGame(gameId).players.keys()].filter((p) => p !== indexPlayer)[0];
  }

  private isShipDamaged(ship: IShip, attackCoordinates: ICoordinate): boolean {
    let damaged: boolean = false;

    ship.coordinates?.every(({x, y}) => {
      if (attackCoordinates.x === x && attackCoordinates.y === y) {
        damaged = true;
        return false;
      }
      return true;
    });

    return damaged;
  }

  private getShipCoordinates({type, position, direction, length}: IShip): ICoordinate[] {
    const {x, y} = position;
    const coordinates = [];

    new Array(length)
      .fill(null)
      .forEach((_, index) => {
        coordinates.push(direction
          ? {x, y: y + index}
          : {x: x + index, y},
        );
      });

    return coordinates;
  }
}
