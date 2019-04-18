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
import { LoanProduct } from '../models';
import { LoanProductRepository } from '../repositories';
import { getCurTimestamp } from '../utils/utils';

export class LoanProductController {
  constructor(
    @repository(LoanProductRepository)
    public loanProductRepository: LoanProductRepository,
  ) { }

  @post('/loanProducts', {
    responses: {
      '200': {
        description: 'LoanProduct model instance',
        content: { 'application/json': { schema: { 'x-ts-type': LoanProduct } } },
      },
    },
  })
  async create(@requestBody() loanProduct: LoanProduct): Promise<LoanProduct> {
    loanProduct.createTime = getCurTimestamp()
    return await this.loanProductRepository.create(loanProduct);
  }

  @get('/loanProducts/count', {
    responses: {
      '200': {
        description: 'LoanProduct model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(LoanProduct)) where?: Where,
  ): Promise<Count> {
    return await this.loanProductRepository.count(where);
  }

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

  @patch('/loanProducts', {
    responses: {
      '200': {
        description: 'LoanProduct PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() loanProduct: LoanProduct,
    @param.query.object('where', getWhereSchemaFor(LoanProduct)) where?: Where,
  ): Promise<Count> {
    return await this.loanProductRepository.updateAll(loanProduct, where);
  }

  @get('/loanProducts/{id}', {
    responses: {
      '200': {
        description: 'LoanProduct model instance',
        content: { 'application/json': { schema: { 'x-ts-type': LoanProduct } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<LoanProduct> {
    return await this.loanProductRepository.findById(id);
  }

  @patch('/loanProducts/{id}', {
    responses: {
      '204': {
        description: 'LoanProduct PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() loanProduct: LoanProduct,
  ): Promise<void> {
    await this.loanProductRepository.updateById(id, loanProduct);
  }

  @put('/loanProducts/{id}', {
    responses: {
      '204': {
        description: 'LoanProduct PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() loanProduct: LoanProduct,
  ): Promise<void> {
    await this.loanProductRepository.replaceById(id, loanProduct);
  }

  @del('/loanProducts/{id}', {
    responses: {
      '204': {
        description: 'LoanProduct DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.loanProductRepository.deleteById(id);
  }
}
