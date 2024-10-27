export const BOARD_LENGTH: number = 10;
export const BOT_ATTACK_TIMEOUT: number = 5000;
export const BOT_SHIPS = [
  {
    position: {
      x: 2,
      y: 1,
    },
    direction: false,
    type: 'huge',
    length: 4,
  },
  {
    position: {
      x: 5,
      y: 4,
    },
    direction: false,
    type: 'large',
    length: 3,
  },
  {
    position: {
      x: 7,
      y: 0,
    },
    direction: false,
    type: 'large',
    length: 3,
  },
  {
    position: {
      x: 0,
      y: 3,
    },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 3,
      y: 7,
    },
    direction: true,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 0,
      y: 8,
    },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 0,
      y: 6,
    },
    direction: false,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 6,
      y: 6,
    },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 2,
      y: 5,
    },
    direction: false,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 9,
      y: 5,
    },
    direction: false,
    type: 'small',
    length: 1,
  },
];
