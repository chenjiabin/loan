import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User } from './user.model';
import { LoanProduct } from './loan-product.model';

@model()
export class ViewRecord extends Entity {
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


  constructor(data?: Partial<ViewRecord>) {
    super(data);
  }
}
