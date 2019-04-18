import {DefaultCrudRepository} from '@loopback/repository';
import {ChannelDailyStat} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ChannelDailyStatRepository extends DefaultCrudRepository<
  ChannelDailyStat,
  typeof ChannelDailyStat.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ChannelDailyStat, dataSource);
  }
}
