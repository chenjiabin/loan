// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { repository } from '@loopback/repository';
import {
  post,
  param,
  get,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { User, UserStatus } from '../models';
import { UserRepository, ChannelUserRepository } from '../repositories';
import { inject, Setter } from '@loopback/core';
import {
  authenticate,
  UserProfile,
  AuthenticationBindings,
} from '@loopback/authentication';
import { Credentials } from '../repositories/user.repository';
import { PasswordHasher } from '../services/hash.password.bcryptjs';
import { JWTAuthenticationService } from '../services/JWT.authentication.service';
import { JWTAuthenticationBindings, PasswordHasherBindings } from '../keys';
import { validateCredentials } from '../services/JWT.authentication.service';
import * as _ from 'lodash';
import { SmsLogRepository } from '../repositories/sms-log.repository';
import { getRandomNum, getCurTimestamp } from '../utils/utils';
import { RestBindings, Request } from '@loopback/rest';

// TODO(jannyHou): This should be moved to @loopback/authentication
const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    name: { type: 'string' },
  },
};

type RegParams = {
  phone: string;
  password: string;
  code: string;
};

type QuickLoginParams = {
  phone: string;
  code: string;
  channel: string; // 从哪个渠道登录的
};

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(SmsLogRepository) protected smsLogRepo: SmsLogRepository,
    @repository(ChannelUserRepository) protected channelUserRepo: ChannelUserRepository,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    public setCurrentUser: Setter<UserProfile>,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHahser: PasswordHasher,
    @inject(JWTAuthenticationBindings.SERVICE)
    public jwtAuthenticationService: JWTAuthenticationService,
    @inject(RestBindings.Http.REQUEST)
    public req: Request
  ) { }

  @get('/users/{userId}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.string('userId') userId: string): Promise<User> {
    return this.userRepository.findById(userId, {
      fields: { password: false },
    });
  }

  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<User> {
    return this.userRepository.findById(currentUser.id, {
      fields: { password: false },
    });;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  // @authenticate('jwt', {action: 'generateAccessToken'})
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<{ token: string }> {
    validateCredentials(credentials);
    const token = await this.jwtAuthenticationService.getAccessTokenForUser(
      credentials,
    );
    return { token };
  }

  @post('/users/quickLogin', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async quickLogin(
    @requestBody() quickLoginParams: QuickLoginParams,
  ): Promise<{ user: User; token: string }> {
    // 检查验证码是否正确
    let smsLog = await this.smsLogRepo.findOne({
      where: { phone: quickLoginParams.phone },
      order: ['id DESC'],
    });

    console.log(quickLoginParams);
    if (smsLog == null || smsLog.code != quickLoginParams.code) {
      console.log(smsLog);
      throw new HttpErrors.UnprocessableEntity('验证码错误');
    }

    let foundUser = await this.userRepository.findOne({
      where: { phone: quickLoginParams.phone },
    });

    if (!foundUser) {
      let user = new User();
      user.phone = quickLoginParams.phone;
      user.password = await this.passwordHahser.hashPassword('123456');
      user.nick = "用户" + getRandomNum(1000000, 9999999);
      let channel = await this.channelUserRepo.findOne({ where: { name: quickLoginParams.channel } });
      let channelId = 0;
      if (channel) {
        channelId = channel.id || 0;
      }
      user.channelId = channelId;

      let curTs = getCurTimestamp();
      user.status = UserStatus.Active;
      user.activeTime = curTs;
      user.createTime = curTs;
      user.ip = this.req.ip;

      // Save & Return Result
      foundUser = await this.userRepository.create(user);
    } else {
      if (!foundUser.status || ~~foundUser.status != UserStatus.Active) {
        this.userRepository.updateById(foundUser.id, { status: UserStatus.Active, activeTime: getCurTimestamp() })
      }
    }

    delete foundUser.password;
    // Get token
    const token = await this.jwtAuthenticationService.getAccessTokenForUser(
      foundUser,
      false,
    );
    return { user: foundUser, token: token };
  }

  @post('/users/reg', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async register(
    @requestBody() quickLoginParams: QuickLoginParams,
  ): Promise<{ code: number }> {
    // 检查验证码是否正确
    let smsLog = await this.smsLogRepo.findOne({
      where: { phone: quickLoginParams.phone },
      order: ['id DESC'],
    });

    console.log(quickLoginParams);
    if (smsLog == null || smsLog.code != quickLoginParams.code) {
      console.log(smsLog);
      throw new HttpErrors.UnprocessableEntity('验证码错误');
    }

    let foundUser = await this.userRepository.findOne({
      where: { phone: quickLoginParams.phone },
    });

    if (!foundUser) {
      let user = new User();
      user.phone = quickLoginParams.phone;
      user.password = await this.passwordHahser.hashPassword('123456');
      user.nick = "用户" + getRandomNum(1000000, 9999999);
      let channel = await this.channelUserRepo.findOne({ where: { name: quickLoginParams.channel } });
      let channelId = 0;
      if (channel) {
        channelId = channel.id || 0;
      }
      user.channelId = channelId;

      let curTs = getCurTimestamp();
      user.createTime = curTs;

      // let ip = '';
      // let addrsStr = this.req.header('X-Forwarded-For');
      // if (addrsStr) {
      //   let addrs = addrsStr.split(',');
      //   if (addrs.length > 0) {
      //     ip = addrs[0];
      //   }
      // }
      user.ip = this.req.ip;

      // Save & Return Result
      foundUser = await this.userRepository.create(user);
    } else {
      return { code: 201 }
    }

    return { code: 200 };
  }
}
