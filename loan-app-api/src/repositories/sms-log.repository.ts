import {DefaultCrudRepository} from '@loopback/repository';
import {SmsLog} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SmsLogRepository extends DefaultCrudRepository<
  SmsLog,
  typeof SmsLog.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(SmsLog, dataSource);
  }
}
