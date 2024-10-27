import { WsOperations } from './types';
import { ICoordinate } from './models';

const BOARD_LENGTH: number = 10;

export function getWsResponse(type: WsOperations, data: unknown) {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
}

export function getAvailableAttackCoordinates(shootedCoordinates: ICoordinate[]): ICoordinate[] {
  const res: ICoordinate[] = [];

  for (let i = 0; i < BOARD_LENGTH; i++) {
    for (let j = 0; j < BOARD_LENGTH; j++) {
      const isShooted: boolean = shootedCoordinates.some(({x, y}) => (x === i && y === j));
      if (!isShooted) {
        res.push({x: i, y: j});
      }
    }
  }

  return res;
}

export function getRandomItemFromArray<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
