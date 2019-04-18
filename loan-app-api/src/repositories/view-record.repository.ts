import {DefaultCrudRepository} from '@loopback/repository';
import {ViewRecord} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ViewRecordRepository extends DefaultCrudRepository<
  ViewRecord,
  typeof ViewRecord.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ViewRecord, dataSource);
  }
}
