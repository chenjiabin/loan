import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { User, ApplyRecord } from '../models';
import { UserRepository, LoanProductRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { ApplyRecordRepository } from '../repositories/apply-record.repository';
import { getCurTimestamp } from '../utils/utils';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ApplyRecordRepository)
    public applyRecordRepository: ApplyRecordRepository,
    @repository(LoanProductRepository)
    public loanProductRepository: LoanProductRepository,
  ) { }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': User } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter,
  ): Promise<User[]> {
    if (!filter) {
      filter = { limit: 50 }
    }
    if (!filter.limit || filter.limit > 50) {
      filter.limit = 50;
    }
    return await this.userRepository.find(filter);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': User } } },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.string('id') id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }


  @get('/users/{id}/applyRecords', {
    responses: {
      '200': {
        description: 'Array of ApplyRecord model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Array } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getUserApplyRecords(
    @param.path.string('id') id: string
  ): Promise<Array<any>> {
    return await this.applyRecordRepository.dataSource.execute(`
    SELECT
      A.name AS proName,
      A.icon AS proIcon,
      A.profile AS proProfile,
      A.limitL AS proLimitL,
      A.limitH AS proLimitH
    FROM
      LoanProduct A,
      (
        SELECT
          DISTINCT(loanProductId) AS proId
        FROM
          ApplyRecord
        WHERE
          userId=${id}
      ) B
    WHERE
      A.id = B.proId
  `);

    // let records = await this.applyRecordRepository.find(
    //   { where: { userId: ~~id } }
    // )
    // let applyRecordList = new Array()
    // for (const record of records) {
    //   let pro = await this.loanProductRepository.findById(record.loanProductId);
    //   applyRecordList.push({
    //     proName: pro.name,
    //     proIcon: pro.icon,
    //     proProfile: pro.profile,
    //     proLimit: pro.limitL + '-' + pro.limitH,
    //     applyTime: record.createTime
    //   })
    // }
    // return applyRecordList;
  }
}
