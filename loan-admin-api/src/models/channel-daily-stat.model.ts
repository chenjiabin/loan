import {Entity, model, property} from '@loopback/repository';

@model()
export class ChannelDailyStat extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  channelId?: number;

  @property({
    type: 'number',
    default: 0,
  })
  registerCnt?: number;

  @property({
    type: 'number',
    default: 0,
  })
  activeCnt?: number;

  @property({
    type: 'date',
  })
  dateTime?: string;


  constructor(data?: Partial<ChannelDailyStat>) {
    super(data);
  }
}
