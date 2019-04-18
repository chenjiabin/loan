import { Entity, model, property } from '@loopback/repository';
import { getCurTimestamp } from '../utils/utils';

@model()
export class AdminUser extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  nick: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  avatar: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @property({
    type: 'number',
  })
  createTime?: number;


  constructor(data?: Partial<AdminUser>) {
    super(data);
  }
}
