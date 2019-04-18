import { Entity, model, property, belongsTo } from '@loopback/repository';
import { getCurTimestamp } from '../utils/utils';
import { User } from './user.model';

@model()
export class Feedback extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @belongsTo(() => User)
  uid: string;

  @property({
    type: 'string',
  })
  content?: string;

  @property({
    type: 'string',
    default: "",
  })
  reply?: string;

  @property({
    type: 'number',
  })
  createTime?: number;

  @property({
    type: 'number',
  })
  replyTime?: number;


  constructor(data?: Partial<Feedback>) {
    super(data);
  }
}
