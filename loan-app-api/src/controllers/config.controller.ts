import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getFilterSchemaFor,
} from '@loopback/rest';
import { Config } from '../models';
import { ConfigRepository } from '../repositories';

export class ConfigController {
  constructor(
    @repository(ConfigRepository)
    public configRepository: ConfigRepository,
  ) { }

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
  async find(
    @param.query.object('filter', getFilterSchemaFor(Config)) filter?: Filter,
  ): Promise<Config[]> {
    return await this.configRepository.find(filter);
  }
}
