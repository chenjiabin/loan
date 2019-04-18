import { DefaultCrudRepository, BelongsToAccessor, repository } from '@loopback/repository';
import { ApplyRecord, User } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { UserRepository } from '.';

export class ApplyRecordRepository extends DefaultCrudRepository<
  ApplyRecord,
  typeof ApplyRecord.prototype.id
  > {
  public readonly user: BelongsToAccessor<
    User,
    typeof ApplyRecord.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ApplyRecord, dataSource);
    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
  }
}
