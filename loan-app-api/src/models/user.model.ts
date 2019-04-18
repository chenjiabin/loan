// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity, model, property, hasMany } from '@loopback/repository';
import { getCurTimestamp } from '../utils/utils';

export const UserStatus = {
  Inactive: 0,
  Active: 1,
}

@model()
export class User extends Entity {
  @property({
    type: 'number',
    generated: true,
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

  @property({
    type: 'string',
  })
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
  activeTime?: number;

  @property({
    type: 'number',
  })
  createTime?: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
