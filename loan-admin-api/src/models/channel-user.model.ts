import { Entity, model, property } from '@loopback/repository';
import { getCurTimestamp } from '../utils/utils';

@model()
export class ChannelUser extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  account?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  linkDesc?: string;

  @property({
    type: 'number',
  })
  activeProp1: number;

  @property({
    type: 'number',
  })
  activeProp2: number;

  @property({
    type: 'number',
  })
  status?: number;

  @property({
    type: 'number',
  })
  createTime?: number;


  constructor(data?: Partial<ChannelUser>) {
    super(data);
  }
}
