import { Entity, model, property } from '@loopback/repository';
import { getCurTimestamp } from '../utils/utils';

@model()
export class SmsLog extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'number',
  })
  createTime?: number;

  constructor(data?: Partial<SmsLog>) {
    super(data);
  }
}
