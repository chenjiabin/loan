import {Entity, model, property} from '@loopback/repository';

@model()
export class OtherUser extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  mobile: string;

  @property({
    type: 'number',
  })
  createTime?: number;


  constructor(data?: Partial<OtherUser>) {
    super(data);
  }
}
