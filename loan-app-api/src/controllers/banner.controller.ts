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
import { Banner } from '../models';
import { BannerRepository } from '../repositories';
import { getCurTimestamp } from '../utils/utils';

export class BannerController {
  constructor(
    @repository(BannerRepository)
    public bannerRepository: BannerRepository,
  ) { }

  @post('/banners', {
    responses: {
      '200': {
        description: 'Banner model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Banner } } },
      },
    },
  })
  async create(@requestBody() banner: Banner): Promise<Banner> {
    banner.createTime = getCurTimestamp()
    return await this.bannerRepository.create(banner);
  }

  @get('/banners/count', {
    responses: {
      '200': {
        description: 'Banner model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Banner)) where?: Where,
  ): Promise<Count> {
    return await this.bannerRepository.count(where);
  }

  @get('/banners', {
    responses: {
      '200': {
        description: 'Array of Banner model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Banner } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Banner)) filter?: Filter,
  ): Promise<Banner[]> {
    return await this.bannerRepository.find(filter);
  }

  @patch('/banners', {
    responses: {
      '200': {
        description: 'Banner PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() banner: Banner,
    @param.query.object('where', getWhereSchemaFor(Banner)) where?: Where,
  ): Promise<Count> {
    return await this.bannerRepository.updateAll(banner, where);
  }

  @get('/banners/{id}', {
    responses: {
      '200': {
        description: 'Banner model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Banner } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Banner> {
    return await this.bannerRepository.findById(id);
  }

  @patch('/banners/{id}', {
    responses: {
      '204': {
        description: 'Banner PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() banner: Banner,
  ): Promise<void> {
    await this.bannerRepository.updateById(id, banner);
  }

  @put('/banners/{id}', {
    responses: {
      '204': {
        description: 'Banner PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() banner: Banner,
  ): Promise<void> {
    await this.bannerRepository.replaceById(id, banner);
  }

  @del('/banners/{id}', {
    responses: {
      '204': {
        description: 'Banner DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bannerRepository.deleteById(id);
  }
}
