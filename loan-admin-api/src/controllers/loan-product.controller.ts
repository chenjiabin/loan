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
import { authenticate } from '@loopback/authentication';

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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.loanProductRepository.deleteById(id);
  }

  @get('/loanProducts/{id}/recordInfo', {
    responses: {
      '200': {
        description: '该产品下用户申请记录',
        content: { 'application/json': { schema: { 'x-ts-type': {} } } },
      },
    },
  })
  @authenticate('jwt')
  async findRecordInfoById(@param.path.number('id') id: number): Promise<any> {
    return await this.loanProductRepository.dataSource.execute(`
      SELECT
        User.id AS id,
        phone,
        ChannelUser.name AS channelName,
        User.createTime AS createTime,
        ip
      FROM
        User
        LEFT JOIN ChannelUser ON User.channelId = ChannelUser.id
      WHERE
        User.id IN (
          SELECT
            DISTINCT(userId)
          FROM
            ApplyRecord
          WHERE
            loanProductId = ${id}
        )
    `);
  }

  @get('/loanProducts/{id}/recordInfo/count', {
    responses: {
      '200': {
        description: '该产品下用户申请记录总数',
        content: { 'application/json': { schema: { 'x-ts-type': {} } } },
      },
    },
  })
  @authenticate('jwt')
  async findRecordInfoCountById(@param.path.number('id') id: number): Promise<any> {
    return await this.loanProductRepository.dataSource.execute(`
      SELECT
        COUNT(DISTINCT(userId)) AS count
      FROM
        ApplyRecord
      WHERE
        loanProductId = ${id}
    `);
  }
}
