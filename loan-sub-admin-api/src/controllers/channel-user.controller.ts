import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { ChannelUser } from '../models';
import { ChannelUserRepository } from '../repositories';
import { authenticate, UserProfile } from '@loopback/authentication';
import { JWTAuthenticationBindings } from '../keys';
import { inject } from '@loopback/core';
import { JWTAuthenticationService } from '../services/JWT.authentication.service';

export class ChannelUserController {
  constructor(
    @repository(ChannelUserRepository)
    public channelUserRepository: ChannelUserRepository,
    @inject(JWTAuthenticationBindings.SERVICE)
    public jwtAuthenticationService: JWTAuthenticationService,
  ) { }

  @post('/channelUsers/login', {
    responses: {
      '200': {
        description: 'AdminUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ChannelUser } } },
      },
    },
  })
  async login(@requestBody() channelUser: ChannelUser): Promise<{ token: string }> {
    let foundUser = await this.channelUserRepository.findOne({
      where: { account: channelUser.account, password: channelUser.password },
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound("用户名或密码不正确");
    }

    // Get token
    const token = await this.jwtAuthenticationService.getAccessTokenForUser(
      foundUser,
      false,
    );

    foundUser.password = ""

    return { token: token };

  }

  @get('/channelUsers/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: ChannelUser,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<ChannelUser> {
    let foundUser = await this.channelUserRepository.findById(~~currentUser.id)
    foundUser.password = ""
    return foundUser;
  }

  @get('/channelUsers/activeStat', {
    responses: {
      '200': {
        description: '该渠道下用户激活统计信息',
        content: { 'application/json': { schema: { 'x-ts-type': {} } } },
      },
    },
  })
  @authenticate('jwt')
  async getChannelUserActiveStat(
    @param.query.number('startTime') startTime: number,
    @param.query.number('endTime') endTime: number,
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<any> {
    let id = ~~currentUser.id;

    let whereTime = ""
    if (startTime && endTime) {
      whereTime = `createTime>=${startTime} and createTime<${endTime} and `
    }

    let result = await this.channelUserRepository.dataSource.execute(`
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
      if (result[i].regCnt <= 10) {
        continue
      }
      let activeRate = result[i].activeCnt * 1.0 / result[i].regCnt
      result[i].regCnt = result[i].activeCnt * channel.activeProp1 + (result[i].regCnt - result[i].activeCnt) * channel.activeProp2;
      result[i].activeCnt = result[i].regCnt * activeRate;
      result[i].regCnt = ~~result[i].regCnt;
      result[i].activeCnt = ~~result[i].activeCnt;
    }

    return result;
  }
}
