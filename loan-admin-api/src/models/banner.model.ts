import { Entity, model, property } from '@loopback/repository';
import { getCurTimestamp } from '../utils/utils';

@model()
export class Banner extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  title: string;

  @property({
    type: 'string',
  })
  icon?: string;

  @property({
    type: 'string',
  })
  url?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  open?: boolean;

  @property({
    type: 'number',
  })
  createTime?: number;

  constructor(data?: Partial<Banner>) {
    super(data);
  }
}
