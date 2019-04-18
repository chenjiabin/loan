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
import { Config } from '../models';
import { ConfigRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class ConfigControllerController {
  constructor(
    @repository(ConfigRepository)
    public configRepository: ConfigRepository,
  ) { }

  @post('/configs', {
    responses: {
      '200': {
        description: 'Config model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Config } } },
      },
    },
  })
  // @authenticate('jwt')
  async create(@requestBody() config: Config): Promise<Config> {
    return await this.configRepository.create(config);
  }

  @get('/configs/count', {
    responses: {
      '200': {
        description: 'Config model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  // @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(Config)) where?: Where,
  ): Promise<Count> {
    return await this.configRepository.count(where);
  }

  @get('/configs', {
    responses: {
      '200': {
        description: 'Array of Config model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Config } },
          },
        },
      },
    },
  })
  // @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(Config)) filter?: Filter,
  ): Promise<Config[]> {
    return await this.configRepository.find(filter);
  }

  @patch('/configs', {
    responses: {
      '200': {
        description: 'Config PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() config: Config,
    @param.query.object('where', getWhereSchemaFor(Config)) where?: Where,
  ): Promise<Count> {
    return await this.configRepository.updateAll(config, where);
  }

  @get('/configs/{id}', {
    responses: {
      '200': {
        description: 'Config model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Config } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Config> {
    return await this.configRepository.findById(id);
  }

  @patch('/configs/{id}', {
    responses: {
      '204': {
        description: 'Config PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() config: Config,
  ): Promise<void> {
    await this.configRepository.updateById(id, config);
  }

  @put('/configs/{id}', {
    responses: {
      '204': {
        description: 'Config PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() config: Config,
  ): Promise<void> {
    await this.configRepository.replaceById(id, config);
  }

  @del('/configs/{id}', {
    responses: {
      '204': {
        description: 'Config DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.configRepository.deleteById(id);
  }
}
