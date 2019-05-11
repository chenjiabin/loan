// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity, model, property, hasMany, belongsTo } from '@loopback/repository';
import { getCurTimestamp } from '../utils/utils';
import { ChannelUser } from './channel-user.model';

const UserStatus = {
  Active: 1,
  Inactive: 2,
}

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  nick?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  card?: string;

  @property({
    type: 'string',
  })
  clientType?: string;

  @belongsTo(() => ChannelUser)
  channelId?: number;

  // 1: 激活 2: 未激活
  @property({
    type: 'number',
    defult: UserStatus.Inactive,
  })
  status?: number;

  @property({
    type: 'number',
  })
  createTime?: number;

  @property({
    type: 'string',
  })
  ip?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
