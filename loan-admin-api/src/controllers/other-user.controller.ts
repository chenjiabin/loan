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
import { OtherUser } from '../models';
import { OtherUserRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { getCurTimestamp } from '../utils/utils';

export class OtherUserController {
  constructor(
    @repository(OtherUserRepository)
    public otherUserRepository: OtherUserRepository,
  ) { }

  @post('/other-users', {
    responses: {
      '200': {
        description: 'OtherUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': OtherUser } } },
      },
    },
  })
  async create(@requestBody() otherUser: OtherUser): Promise<OtherUser> {
    otherUser.createTime = getCurTimestamp()
    return await this.otherUserRepository.create(otherUser);
  }

  @get('/other-users/count', {
    responses: {
      '200': {
        description: 'OtherUser model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(OtherUser)) where?: Where,
  ): Promise<Count> {
    return await this.otherUserRepository.count(where);
  }

  @get('/other-users', {
    responses: {
      '200': {
        description: 'Array of OtherUser model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': OtherUser } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(OtherUser)) filter?: Filter,
  ): Promise<OtherUser[]> {
    return await this.otherUserRepository.find(filter);
  }
}
