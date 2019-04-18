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
import { LoanProduct, ApplyRecord, ViewRecord } from '../models';
import { LoanProductRepository, ApplyRecordRepository, ViewRecordRepository } from '../repositories';
import { getCurTimestamp } from '../utils/utils';
import { authenticate, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class LoanProductController {
  constructor(
    @repository(LoanProductRepository)
    public loanProductRepository: LoanProductRepository,
    @repository(ViewRecordRepository)
    public viewRecordRepository: ViewRecordRepository,
  ) { }

  @get('/loanProducts', {
    responses: {
      '200': {
        description: 'Array of LoanProduct model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': LoanProduct } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(LoanProduct))
    filter?: Filter,
  ): Promise<LoanProduct[]> {
    return await this.loanProductRepository.find(filter);
  }

  @get('/loanProducts/{id}', {
    responses: {
      '200': {
        description: 'LoanProduct model instance',
        content: { 'application/json': { schema: { 'x-ts-type': LoanProduct } } },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<LoanProduct> {
    let viewRecord = new (ViewRecord)
    viewRecord.userId = ~~currentUser.id
    viewRecord.loanProductId = id
    viewRecord.createTime = getCurTimestamp()
    await this.viewRecordRepository.create(viewRecord);
    return await this.loanProductRepository.findById(id);
  }
}
