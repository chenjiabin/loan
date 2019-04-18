import { Entity, model, property } from '@loopback/repository';
import { getCurTimestamp } from '../utils/utils';

@model()
export class LoanCategory extends Entity {
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
  icon: string;

  @property({
    type: 'number',
  })
  createTime?: number;

  constructor(data?: Partial<LoanCategory>) {
    super(data);
  }
}
