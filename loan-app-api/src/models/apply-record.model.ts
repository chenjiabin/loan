import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User } from './user.model';
import { LoanProduct } from './loan-product.model';
import { getCurTimestamp } from '../utils/utils';

@model()
export class ApplyRecord extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => User)
  userId?: number;

  @belongsTo(() => LoanProduct)
  loanProductId: number;

  @property({
    type: 'number',
    index: true,
  })
  createTime?: number;


  constructor(data?: Partial<ApplyRecord>) {
    super(data);
  }
}
