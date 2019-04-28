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
import { ChannelUser, User } from '../models';
import { ChannelUserRepository, UserRepository } from '../repositories';
import { getCurTimestamp } from '../utils/utils';
import { authenticate } from '@loopback/authentication';

export class ChannelUserController {
  constructor(
    @repository(ChannelUserRepository)
    public channelUserRepository: ChannelUserRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/channelUsers', {
    responses: {
      '200': {
        description: 'ChannelUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ChannelUser } } },
      },
    },
  })
  @authenticate('jwt')
  async create(@requestBody() channelUser: ChannelUser): Promise<ChannelUser> {
    channelUser.createTime = getCurTimestamp()
    channelUser.linkDesc = "H5推广：http://hudongwen.cn/h5?from=" + channelUser.name;
    return await this.channelUserRepository.create(channelUser);
  }

  @get('/channelUsers/count', {
    responses: {
      '200': {
        description: 'ChannelUser model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(ChannelUser)) where?: Where,
  ): Promise<Count> {
    return await this.channelUserRepository.count(where);
  }

  @get('/channelUsers', {
    responses: {
      '200': {
        description: 'Array of ChannelUser model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ChannelUser } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(ChannelUser)) filter?: Filter,
  ): Promise<ChannelUser[]> {
    return await this.channelUserRepository.find(filter);
  }

  @patch('/channelUsers', {
    responses: {
      '200': {
        description: 'ChannelUser PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody() channelUser: ChannelUser,
    @param.query.object('where', getWhereSchemaFor(ChannelUser)) where?: Where,
  ): Promise<Count> {
    return await this.channelUserRepository.updateAll(channelUser, where);
  }

  @get('/channelUsers/{id}', {
    responses: {
      '200': {
        description: 'ChannelUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ChannelUser } } },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<ChannelUser> {
    return await this.channelUserRepository.findById(id);
  }

  @patch('/channelUsers/{id}', {
    responses: {
      '204': {
        description: 'ChannelUser PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() channelUser: ChannelUser,
  ): Promise<void> {
    await this.channelUserRepository.updateById(id, channelUser);
  }

  @put('/channelUsers/{id}', {
    responses: {
      '204': {
        description: 'ChannelUser PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() channelUser: ChannelUser,
  ): Promise<void> {
    await this.channelUserRepository.replaceById(id, channelUser);
  }

  @del('/channelUsers/{id}', {
    responses: {
      '204': {
        description: 'ChannelUser DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.channelUserRepository.deleteById(id);
  }

  @get('/channelUsers/regInfo', {
    responses: {
      '200': {
        description: '该渠道下用户注册信息',
        content: { 'application/json': { schema: { 'x-ts-type': {} } } },
      },
    },
  })
  @authenticate('jwt')
  async findRegInfoById(
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter,
  ): Promise<any> {
    if (!filter) {
      filter = { fields: { id: true, phone: true, clientType: true, status: true, createTime: true } }
    } else {
      filter.fields = { id: true, phone: true, clientType: true, status: true, createTime: true }
    }
    return await this.userRepository.find(filter)
  }

  @get('/channelUsers/{id}/activeStat', {
    responses: {
      '200': {
        description: '该渠道下用户激活统计信息',
        content: { 'application/json': { schema: { 'x-ts-type': {} } } },
      },
    },
  })
  @authenticate('jwt')
  async getChannelUserActiveStat(
    @param.path.number('id') id: number,
    @param.query.number('startTime') startTime: number,
    @param.query.number('endTime') endTime: number,
  ): Promise<any> {
    if (!id) {
      return []
    }

    let whereTime = ""
    if (startTime && endTime) {
      whereTime = `createTime>=${startTime} and createTime<${endTime} and `
    }

    let result = await this.userRepository.dataSource.execute(`
      SELECT
        COUNT(id) AS regCnt,
        SUM(if(status=1,1,0)) AS activeCnt,
        from_unixtime(createTime,'%Y-%m-%d') AS date
      FROM
        User
      WHERE
        ${whereTime}channelId=${id}
      GROUP BY
        date
    `)

    let channel = await this.channelUserRepository.findById(id);
    for (var i = 0; i < result.length; i++) {
      result.activeCnt = result.regCnt * channel.activeProp1 + result.activeCnt * channel.activeProp2;
    }

    return result;
  }
}
