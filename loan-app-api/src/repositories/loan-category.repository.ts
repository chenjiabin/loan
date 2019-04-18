import {DefaultCrudRepository} from '@loopback/repository';
import {LoanCategory} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LoanCategoryRepository extends DefaultCrudRepository<
  LoanCategory,
  typeof LoanCategory.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(LoanCategory, dataSource);
  }
}
