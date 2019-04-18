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
import { ApplyRecord } from '../models';
import { ApplyRecordRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { getCurTimestamp } from '../utils/utils';

export class ApplyRecordController {
  constructor(
    @repository(ApplyRecordRepository)
    public applyRecordRepository: ApplyRecordRepository,
  ) { }

  @post('/applyRecords', {
    responses: {
      '200': {
        description: 'ApplyRecord model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ApplyRecord } } },
      },
    },
  })
  @authenticate('jwt')
  async create(@requestBody() applyRecord: ApplyRecord): Promise<ApplyRecord> {
    applyRecord.createTime = getCurTimestamp()
    return await this.applyRecordRepository.create(applyRecord);
  }

  @get('/applyRecords/count', {
    responses: {
      '200': {
        description: 'ApplyRecord model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  // @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(ApplyRecord)) where?: Where,
  ): Promise<Count> {
    return await this.applyRecordRepository.count(where);
  }

  @get('/applyRecords', {
    responses: {
      '200': {
        description: 'Array of ApplyRecord model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ApplyRecord } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(ApplyRecord)) filter?: Filter,
  ): Promise<ApplyRecord[]> {
    return await this.applyRecordRepository.find(filter);
  }

  @patch('/applyRecords', {
    responses: {
      '200': {
        description: 'ApplyRecord PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody() applyRecord: ApplyRecord,
    @param.query.object('where', getWhereSchemaFor(ApplyRecord)) where?: Where,
  ): Promise<Count> {
    return await this.applyRecordRepository.updateAll(applyRecord, where);
  }

  @get('/applyRecords/{id}', {
    responses: {
      '200': {
        description: 'ApplyRecord model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ApplyRecord } } },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<ApplyRecord> {
    return await this.applyRecordRepository.findById(id);
  }

  @patch('/applyRecords/{id}', {
    responses: {
      '204': {
        description: 'ApplyRecord PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() applyRecord: ApplyRecord,
  ): Promise<void> {
    await this.applyRecordRepository.updateById(id, applyRecord);
  }

  @put('/applyRecords/{id}', {
    responses: {
      '204': {
        description: 'ApplyRecord PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() applyRecord: ApplyRecord,
  ): Promise<void> {
    await this.applyRecordRepository.replaceById(id, applyRecord);
  }

  @del('/applyRecords/{id}', {
    responses: {
      '204': {
        description: 'ApplyRecord DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.applyRecordRepository.deleteById(id);
  }
}
