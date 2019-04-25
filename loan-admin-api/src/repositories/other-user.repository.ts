import {DefaultCrudRepository} from '@loopback/repository';
import {OtherUser} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OtherUserRepository extends DefaultCrudRepository<
  OtherUser,
  typeof OtherUser.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(OtherUser, dataSource);
  }
}
