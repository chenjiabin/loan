import {DefaultCrudRepository} from '@loopback/repository';
import {DailyStat} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DailyStatRepository extends DefaultCrudRepository<
  DailyStat,
  typeof DailyStat.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(DailyStat, dataSource);
  }
}
