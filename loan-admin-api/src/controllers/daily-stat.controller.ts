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
import { DailyStat } from '../models';
import { DailyStatRepository } from '../repositories';

export class DailyStatController {
  constructor(
    @repository(DailyStatRepository)
    public dailyStatRepository: DailyStatRepository,
  ) { }

  @get('/daily-stats', {
    responses: {
      '200': {
        description: 'Array of DailyStat model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': DailyStat } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(DailyStat)) filter?: Filter,
  ): Promise<DailyStat[]> {
    return await this.dailyStatRepository.find(filter);
  }

  @get('/daily-stats/time-count', {
    responses: {
      '200': {
        description: 'Array of DailyStat model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': {} } },
          },
        },
      },
    },
  })
  async getTimeCount(): Promise<any> {
    let result = {}
    let totalResult = await this.dailyStatRepository.dataSource.execute(`
      SELECT
        SUM(registerCnt) AS registerTotalCnt,
        SUM(applyCnt) AS applyTotalCnt,
        SUM(applyUserCnt) AS applyUserTotalCnt
      FROM
        DailyStat
    `);

    if (totalResult.length != 0) {
      result = totalResult[0]
    }

    let monthResult = await this.dailyStatRepository.dataSource.execute(`
      SELECT
        SUM(registerCnt) AS registerMonthCnt,
        SUM(applyCnt) AS applyMonthCnt,
        SUM(applyUserCnt) AS applyUserMonthCnt
      FROM
        DailyStat
      WHERE
        dateTime >= date_format(now(), '%Y-%m')
    `);

    if (monthResult.length != 0) {
      result = Object.assign(result, monthResult[0])
    }


    let todyResult = await this.dailyStatRepository.dataSource.execute(`
      SELECT
      (
        SELECT
          COUNT(user.id)
        FROM
          User user
        WHERE
          user.createTime >= unix_timestamp(
            date_format(now(), '%Y-%m-%d')
          )
      ) AS registerTodayCnt,
      (
        SELECT
          COUNT(applyRecord.id)
        FROM
          ApplyRecord applyRecord
        WHERE
          applyRecord.createTime >= unix_timestamp(
            date_format(now(), '%Y-%m-%d')
          )
      ) AS applyTodayCnt,
      (
        SELECT
          COUNT(DISTINCT(applyRecord.userId))
        FROM
          ApplyRecord applyRecord
        WHERE
          applyRecord.createTime >= unix_timestamp(
            date_format(now(), '%Y-%m-%d')
          )
      ) AS applyUserTodayCnt
    `)

    if (todyResult.length != 0) {
      result = Object.assign(result, todyResult[0])
    }

    return result
  }
}
