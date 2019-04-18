import { Model, model, property, Entity } from '@loopback/repository';

@model()
export class ProductDailyStat extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  productId?: number;

  @property({
    type: 'number',
  })
  uvCnt?: number;

  @property({
    type: 'number',
  })
  applyCnt?: number;

  @property({
    type: 'string',
  })
  dateTime?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<ProductDailyStat>) {
    super(data);
  }
}
