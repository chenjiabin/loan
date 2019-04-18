import {DefaultCrudRepository} from '@loopback/repository';
import {Config} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ConfigRepository extends DefaultCrudRepository<
  Config,
  typeof Config.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Config, dataSource);
  }
}
