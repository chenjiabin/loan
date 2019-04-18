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
import { getCurTimestamp } from '../utils/utils';

export class LoanCategoryController {
  constructor(
    @repository(LoanCategoryRepository)
    public loanCategoryRepository: LoanCategoryRepository,
  ) { }

  @post('/loanCategories', {
    responses: {
      '200': {
        description: 'LoanCategory model instance',
        content: { 'application/json': { schema: { 'x-ts-type': LoanCategory } } },
      },
    },
  })
  async create(
    @requestBody() loanCategory: LoanCategory,
  ): Promise<LoanCategory> {
    loanCategory.createTime = getCurTimestamp()
    return await this.loanCategoryRepository.create(loanCategory);
  }

  @get('/loanCategories/count', {
    responses: {
      '200': {
        description: 'LoanCategory model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(LoanCategory)) where?: Where,
  ): Promise<Count> {
    return await this.loanCategoryRepository.count(where);
  }

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

  @patch('/loanCategories', {
    responses: {
      '200': {
        description: 'LoanCategory PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() loanCategory: LoanCategory,
    @param.query.object('where', getWhereSchemaFor(LoanCategory)) where?: Where,
  ): Promise<Count> {
    return await this.loanCategoryRepository.updateAll(loanCategory, where);
  }

  @get('/loanCategories/{id}', {
    responses: {
      '200': {
        description: 'LoanCategory model instance',
        content: { 'application/json': { schema: { 'x-ts-type': LoanCategory } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<LoanCategory> {
    return await this.loanCategoryRepository.findById(id);
  }

  @patch('/loanCategories/{id}', {
    responses: {
      '204': {
        description: 'LoanCategory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() loanCategory: LoanCategory,
  ): Promise<void> {
    await this.loanCategoryRepository.updateById(id, loanCategory);
  }

  @put('/loanCategories/{id}', {
    responses: {
      '204': {
        description: 'LoanCategory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() loanCategory: LoanCategory,
  ): Promise<void> {
    await this.loanCategoryRepository.replaceById(id, loanCategory);
  }

  @del('/loanCategories/{id}', {
    responses: {
      '204': {
        description: 'LoanCategory DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.loanCategoryRepository.deleteById(id);
  }
}
