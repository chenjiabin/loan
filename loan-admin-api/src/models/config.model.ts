import { Entity, model, property } from '@loopback/repository';

@model()
export class Config extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
    index: true
  })
  key: string;

  @property({
    type: 'string',
  })
  value?: string;

  @property({
    type: 'string',
  })
  type?: string;


  constructor(data?: Partial<Config>) {
    super(data);
  }
}
