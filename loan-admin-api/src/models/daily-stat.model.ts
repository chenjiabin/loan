import {Entity, model, property} from '@loopback/repository';

@model()
export class DailyStat extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'number',
    default: 0,
  })
  registerCnt?: number;

  @property({
    type: 'number',
    default: 0,
  })
  applyCnt?: number;

  @property({
    type: 'number',
    default: 0,
  })
  applyUserCnt?: number;

  @property({
    type: 'date',
  })
  dateTime?: string;


  constructor(data?: Partial<DailyStat>) {
    super(data);
  }
}
