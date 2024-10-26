import { ShipTypes } from './types';

export interface IIndex {
  index: string;
}

export interface IWins {
  wins: number;
}

export interface IName {
  name: string;
}

export interface IPassword {
  password: string;
}

export interface IIndexRoom {
  indexRoom: string | number;
}

export interface IUser extends IName, IWins, IIndex, IPassword {
}

export interface IUserWithWins extends IName, IWins {
}

export interface IUserWithIndex extends IIndex, IName {
}

export interface IUserWithPassword extends IName, IPassword {
}

export interface IRoom {
  roomId: string;
  roomUsers: IUserWithIndex[];
}

export interface IGame {
  idGame: string;
  roomId: string;
  playersId: string[];
  playersShips?: Map<string, IShip[]>;
}

export interface IShip {
  position: {
    x: number;
    y: number;
  },
  direction: boolean;
  length: number;
  type: ShipTypes;
  damageCounter?: number;
}

export interface AddShipsData {
  gameId: string;
  ships: IShip[];
  indexPlayer: string; /* id of the player in the current game session */
}

export interface AttackCoordinates {
  x?: number;
  y?: number;
}

export interface AttackData extends AttackCoordinates {
  gameId: string;
  indexPlayer: string; /* id of the player in the current game session */
}

export interface Message<T = unknown> {
  id: number;
  type: string;
  data: T;
}

export interface RegistrationResponseData {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}
