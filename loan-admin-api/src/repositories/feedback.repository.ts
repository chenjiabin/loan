import {DefaultCrudRepository} from '@loopback/repository';
import {Feedback} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FeedbackRepository extends DefaultCrudRepository<
  Feedback,
  typeof Feedback.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Feedback, dataSource);
  }
}
