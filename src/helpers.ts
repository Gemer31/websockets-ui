import { WsOperations } from './types';

export function getWsResponse(type: WsOperations, data: unknown) {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
}
