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
import { LoanCategory } from '../models';
import { LoanCategoryRepository } from '../repositories';

export class LoanCategoryController {
  constructor(
    @repository(LoanCategoryRepository)
    public loanCategoryRepository: LoanCategoryRepository,
  ) { }

  @get('/loanCategories', {
    responses: {
      '200': {
        description: 'Array of LoanCategory model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': LoanCategory } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(LoanCategory))
    filter?: Filter,
  ): Promise<LoanCategory[]> {
    return await this.loanCategoryRepository.find(filter);
  }
}
