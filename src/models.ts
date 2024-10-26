import { ShipTypes } from './types';

export interface IId {
  id: string;
}

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
  indexRoom: string;
}

export interface IRegistered {
  registered?: boolean;
}

export interface IUser extends IName, IWins, IIndex, IPassword, IRegistered {
}

export interface IUserWithWins extends IName, IWins {
}

export interface IUserWithIndex extends IIndex, IName {
}

export interface IUserWithPassword extends IName, IPassword {
}

export interface IRoom extends IId {
  roomUsers: IUserWithIndex[];
  roomClients: any[];
}

export interface IGame extends IId {
  roomId: string;
  players: Map<string, IGamePlayer>;
}

export interface IGamePlayer {
  ships?: IShip[];
  shoots?: ICoordinate[];
}

export interface IShip {
  coordinates?: ICoordinate[];
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

export interface ICoordinate {
  x?: number;
  y?: number;
}

export interface AttackData extends ICoordinate {
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
