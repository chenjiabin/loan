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
import { ChannelDailyStat } from '../models';
import { ChannelDailyStatRepository } from '../repositories';

export class ChannelDailyStatController {
  constructor(
    @repository(ChannelDailyStatRepository)
    public channelDailyStatRepository: ChannelDailyStatRepository,
  ) { }

  @get('/channel-daily-stats', {
    responses: {
      '200': {
        description: 'Array of ChannelDailyStat model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ChannelDailyStat } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ChannelDailyStat)) filter?: Filter,
  ): Promise<ChannelDailyStat[]> {
    return await this.channelDailyStatRepository.find(filter);
  }
}
