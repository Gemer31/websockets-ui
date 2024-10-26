import { ICoordinate, IGame, IShip } from '../models';
import { AttackStatus, ShipTypes } from '../types';
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
      players: new Map()
        .set(playersId[0], {ships: [], shoots: []})
        .set(playersId[1], {ships: [], shoots: []}),
    });

    return idGame;
  }

  public addShips(idGame: string, indexPlayer: string, ships: IShip[]): void {
    this.getGame(idGame).players.get(indexPlayer).ships = ships
      ?.map((s: IShip) => ({
        ...s,
        damageCounter: 0,
        coordinates: this.getShipCoordinates(s),
      }));
  }

  public gameIsReady(idGame: string): boolean {
    const game = this.getGame(idGame);
    return [...game.players.values()].every((p) => !!p?.ships?.length);
  }

  public getRoomIdByGameId(idGame: string) {
    return this.getGame(idGame).roomId;
  }

  public getPlayerShips(idGame: string, indexPlayer: string): IShip[] {
    return this.getGame(idGame).players.get(indexPlayer).ships;
  }

  public attack(idGame: string, indexPlayer: string, attackCoordinate: ICoordinate) {
    const game = this.getGame(idGame);
    const enemyIndexPlayer: string = this.getEnemyUserIndex(idGame, indexPlayer);
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

  public getWinner(idGame: string): string {
    const game = this.getGame(idGame);
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

    return looser && this.getEnemyUserIndex(idGame, looser);
  }

  private getEnemyUserIndex(idGame: string, indexPlayer: string): string {
    return [...this.getGame(idGame).players.keys()].filter((p) => p !== indexPlayer)[0];
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
