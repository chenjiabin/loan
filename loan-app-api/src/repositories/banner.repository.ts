import {DefaultCrudRepository} from '@loopback/repository';
import {Banner} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BannerRepository extends DefaultCrudRepository<
  Banner,
  typeof Banner.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Banner, dataSource);
  }
}
