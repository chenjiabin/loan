import { DefaultCrudRepository } from '@loopback/repository';
import { ChannelUser } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject } from '@loopback/core';

export type Credentials = {
  name: string,
  password: string
}

export class ChannelUserRepository extends DefaultCrudRepository<
  ChannelUser,
  typeof ChannelUser.prototype.id
  > {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ChannelUser, dataSource);
  }
}
