import { Entity, model, property, belongsTo } from '@loopback/repository';
import { LoanCategory } from './loan-category.model';
import { getCurTimestamp } from '../utils/utils';

@model()
export class LoanProduct extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  icon?: string;

  @belongsTo(() => LoanCategory)
  categoryId?: number;

  @property({
    type: 'string',
  })
  profile?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  tags?: string[];

  @property({
    type: 'number',
  })
  limitL?: number;

  @property({
    type: 'number',
  })
  limitH?: number;

  @property({
    type: 'string',
  })
  period?: string;

  @property({
    type: 'string',
  })
  interest?: string;

  @property({
    type: 'number',
  })
  applyNum?: number;

  @property({
    type: 'string',
  })
  applyCond?: string;

  @property({
    type: 'string',
  })
  applyProc?: string;

  @property({
    type: 'string',
  })
  specDesc?: string;

  @property({
    type: 'string',
  })
  sucProb?: string;

  @property({
    type: 'string',
  })
  speed?: string;

  @property({
    type: 'string',
  })
  todayUse?: string;

  @property({
    type: 'number',
  })
  sortNum?: number;

  @property({
    type: 'boolean',
    default: false,
  })
  top?: boolean;

  @property({
    type: 'string',
  })
  url?: string;

  @property({
    type: 'number',
  })
  createTime?: number;

  constructor(data?: Partial<LoanProduct>) {
    super(data);
  }
}
