import { DefaultCrudRepository } from '@loopback/repository';
import { AdminUser } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject } from '@loopback/core';

export type Credentials = {
  name: string,
  password: string
}

export class AdminUserRepository extends DefaultCrudRepository<
  AdminUser,
  typeof AdminUser.prototype.id
  > {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(AdminUser, dataSource);
  }
}
