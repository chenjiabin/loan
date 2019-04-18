import { DefaultCrudRepository } from '@loopback/repository';
import { ProductDailyStat } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ProductDailyStatRepository extends DefaultCrudRepository<
  ProductDailyStat,
  typeof ProductDailyStat.prototype.id
  > {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ProductDailyStat, dataSource);
  }
}
