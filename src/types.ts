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
  SINGLE_PLAY = 'single_play',
  DELETE_USER = 'delete_user',
  DISCONNECT = 'disconnect',
}

export enum AttackStatus {
  MISS = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
}

export enum Messages {
  INVALID_USER_DATA = 'Invalid user data',
  INVALID_ADD_SHIPS_DATA = 'Invalid add ships data',
  INVALID_CREATE_GAME_PARAMS = 'Invalid create games params',
  INVALID_ATTACK_DATA = 'Invalid attack data',
  INVALID_GET_SHOOTED_COORDINATES = 'Invalid get shooted coordinates',
  INVALID_CREATE_ROOM_DATA = 'Invalid create room data',
  INVALID_ADD_USER_TO_ROOM_DATA = 'Invalid add user to room data',
  INVALID_GET_ROOM_CLIENTS_DATA = 'Invalid get room clients data',
  INVALID_GET_ENEMY_PLAYER_ID = 'Invalid get enemy player id',
  INVALID_ADD_CLIENT_TO_ROOM_DATA = 'Invalid add client to room data',

  CHECK_GAME_READY_FAILED = 'Check game ready is failed. No gameId',
  GET_ROOM_ID_FAILED = 'Get room id failed',
  GET_WINNER_FAILED = 'Get winner failed',
  CHECK_USER_IN_ROOM_FAILED = 'Check user in room failed',
  DELETE_ROOM_FAILED = 'Delete room failed',
  ADD_USER_WIN_FAILED = 'Add user win failed',
  GET_USER_BY_CLIENT_FAILED = 'Get user by client failed',
  GET_ALL_CLIENTS_FAILED = 'Get all clients_failed',

  USER_ALREADY_REGISTERED = 'User is already registered',
  LOG_IN_USER = 'Log in user',
  LOG_OUT_USER = 'Log out user',
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
