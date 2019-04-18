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
import { AdminUser } from '../models';
import { AdminUserRepository } from '../repositories';
import { HttpErrors } from '@loopback/rest';
import { JWTAuthenticationBindings } from '../keys';
import { inject } from '@loopback/core';
import { JWTAuthenticationService } from '../services/JWT.authentication.service';
import { authenticate, UserProfile } from '@loopback/authentication';
import { getCurTimestamp } from '../utils/utils';

export class AdminUserControllerController {
  constructor(
    @repository(AdminUserRepository)
    public adminUserRepository: AdminUserRepository,
    @inject(JWTAuthenticationBindings.SERVICE)
    public jwtAuthenticationService: JWTAuthenticationService,
  ) { }

  @post('/adminUsers/login', {
    responses: {
      '200': {
        description: 'AdminUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': AdminUser } } },
      },
    },
  })
  async login(@requestBody() adminUser: AdminUser): Promise<{ token: string }> {
    let foundUser = await this.adminUserRepository.findOne({
      where: { name: adminUser.name, password: adminUser.password },
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

  @get('/adminUsers/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: AdminUser,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<AdminUser> {
    let foundUser = await this.adminUserRepository.findById(~~currentUser.id)
    foundUser.password = ""
    return foundUser;
  }

  @post('/adminUsers', {
    responses: {
      '200': {
        description: 'AdminUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': AdminUser } } },
      },
    },
  })
  async create(@requestBody() adminUser: AdminUser): Promise<AdminUser> {
    adminUser.createTime = getCurTimestamp()
    return await this.adminUserRepository.create(adminUser);
  }

  @get('/adminUsers/count', {
    responses: {
      '200': {
        description: 'AdminUser model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(AdminUser)) where?: Where,
  ): Promise<Count> {
    return await this.adminUserRepository.count(where);
  }

  @get('/adminUsers', {
    responses: {
      '200': {
        description: 'Array of AdminUser model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': AdminUser } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(AdminUser)) filter?: Filter,
  ): Promise<AdminUser[]> {
    return await this.adminUserRepository.find(filter);
  }

  @patch('/adminUsers', {
    responses: {
      '200': {
        description: 'AdminUser PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() adminUser: AdminUser,
    @param.query.object('where', getWhereSchemaFor(AdminUser)) where?: Where,
  ): Promise<Count> {
    return await this.adminUserRepository.updateAll(adminUser, where);
  }

  @get('/adminUsers/{id}', {
    responses: {
      '200': {
        description: 'AdminUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': AdminUser } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<AdminUser> {
    return await this.adminUserRepository.findById(id);
  }

  @patch('/adminUsers/{id}', {
    responses: {
      '204': {
        description: 'AdminUser PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() adminUser: AdminUser,
  ): Promise<void> {
    await this.adminUserRepository.updateById(id, adminUser);
  }

  @put('/adminUsers/{id}', {
    responses: {
      '204': {
        description: 'AdminUser PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() adminUser: AdminUser,
  ): Promise<void> {
    await this.adminUserRepository.replaceById(id, adminUser);
  }

  @del('/adminUsers/{id}', {
    responses: {
      '204': {
        description: 'AdminUser DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.adminUserRepository.deleteById(id);
  }
}
