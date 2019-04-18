import {DefaultCrudRepository} from '@loopback/repository';
import {LoanProduct} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LoanProductRepository extends DefaultCrudRepository<
  LoanProduct,
  typeof LoanProduct.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(LoanProduct, dataSource);
  }
}
