export enum WsOperations {
  REGISTRATION = 'reg',
  UPDATE_WINNERS = 'update_winners',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  CREATE_GAME = 'create_game',
  UPDATE_ROOM = 'update_room',
  ADD_SHIPS = 'add_ships',
  START_GAME = 'start_game',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  TURN = 'turn',
  FINISH = 'finish',
}

export enum AttackStatus {
  MISS = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
}

export enum Messages {
  USER_ALREADY_REGISTERED = 'User is already registered',
  INVALID_USER_DATA = 'Invalid user data',
  LOG_IN_USER = 'Log in user',
  LOG_OUT_USER = 'Log out user',
  INVALID_CREATE_GAME_PARAMS = 'Invalid create games params',
  DELETED_ROOM = 'Deleted room',
  FINISHED_GAME_ID = 'Finished game id',
  STARTED_GAME_ID = 'Started game id',
}

export enum ShipTypes {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  HUGE = 'huge',
}
